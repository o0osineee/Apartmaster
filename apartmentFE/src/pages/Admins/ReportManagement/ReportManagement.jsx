import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  TablePagination,
  Paper,
  Chip,
  Tooltip,
  alpha,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  PictureAsPdf as PdfIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
} from '../../../redux/slices/reportSlice';
import { fetchEmployees } from '../../../redux/slices/employeeSlice';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ReportManagement = () => {
  const dispatch = useDispatch();
  const { items: reports, loading, error } = useSelector((state) => state.reports);
  const { items: employees = [] } = useSelector((state) => state.employees);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    note: '',
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchReports()),
          dispatch(fetchEmployees())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  const handleOpenDialog = (report = null) => {
    if (report) {
      setSelectedReport(report);
      setFormData({
        employeeId: report.employeeId,
        note: '',
      });
    } else {
      setSelectedReport(null);
      setFormData({
        employeeId: '',
        note: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setFormData({
      employeeId: '',
      note: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.employeeId) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn người tạo báo cáo',
          severity: 'error'
        });
        return;
      }
      if (selectedReport) {
        await dispatch(updateReport({ 
          id: selectedReport.reportId, 
          data: formData 
        })).unwrap();
        setNotification({
          open: true,
          message: 'Cập nhật báo cáo thành công',
          severity: 'success'
        });
        await dispatch(fetchReports());
      } else {
        await dispatch(createReport(formData)).unwrap();
        setNotification({
          open: true,
          message: 'Tạo báo cáo thành công',
          severity: 'success'
        });
        await dispatch(fetchReports());
      }
      handleCloseDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Có lỗi xảy ra khi lưu báo cáo',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (selectedReport) {
      await dispatch(deleteReport(selectedReport.reportId)).unwrap();
      setOpenDeleteDialog(false);
      setNotification({
        open: true,
        message: 'Xóa báo cáo thành công',
        severity: 'success'
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    return employee ? employee.fullName : 'Unknown';
  };

  const fetchSummaryData = async () => {
    const [apartments, residents, employees, bills, tasks, services] = await Promise.all([
      axios.get('/api/apartments'),
      axios.get('/api/residents'),
      axios.get('/api/employees'),
      axios.get('/api/bills'),
      axios.get('/api/tasks'),
      axios.get('/api/services'),
    ]);
    return {
      apartments: apartments.data.data || [],
      residents: residents.data.data || [],
      employees: employees.data.data || [],
      bills: bills.data.data || [],
      tasks: tasks.data.data || [],
      services: services.data.data || [],
    };
  };

  const handleExportSummaryPDF = async () => {
    try {
      const summary = await fetchSummaryData();
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(18);
      doc.text('BÁO CÁO TỔNG HỢP CHUNG CƯ', 105, y, { align: 'center' });
      y += 10;
      doc.setFontSize(12);
      doc.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 105, y, { align: 'center' });
      y += 10;
      doc.setFontSize(14);
      doc.text('1. Thông tin chung:', 14, y); y += 8;
      doc.setFontSize(12);
      doc.text(`- Tổng số căn hộ: ${summary.apartments.length}`, 16, y); y += 7;
      doc.text(`- Tổng số cư dân: ${summary.residents.length}`, 16, y); y += 7;
      doc.text(`- Tổng số nhân viên: ${summary.employees.length}`, 16, y); y += 7;
      doc.text(`- Tổng số dịch vụ: ${summary.services.length}`, 16, y); y += 10;
      doc.setFontSize(14);
      doc.text('2. Tài chính:', 14, y); y += 8;
      doc.setFontSize(12);
      const totalBills = summary.bills.length;
      const totalPaid = summary.bills.filter(b => b.isPaid).reduce((sum, b) => sum + (b.money || 0), 0);
      const totalUnpaid = summary.bills.filter(b => !b.isPaid).reduce((sum, b) => sum + (b.money || 0), 0);
      doc.text(`- Tổng số hóa đơn: ${totalBills}`, 16, y); y += 7;
      doc.text(`- Doanh thu đã thu: ${totalPaid.toLocaleString('vi-VN')}đ`, 16, y); y += 7;
      doc.text(`- Doanh thu chưa thu: ${totalUnpaid.toLocaleString('vi-VN')}đ`, 16, y); y += 10;
      doc.setFontSize(14);
      doc.text('3. Công việc:', 14, y); y += 8;
      doc.setFontSize(12);
      const totalTasks = summary.tasks.length;
      const completedTasks = summary.tasks.filter(t => t.status === 'Hoàn thành').length;
      doc.text(`- Tổng số công việc: ${totalTasks}`, 16, y); y += 7;
      doc.text(`- Số công việc hoàn thành: ${completedTasks}`, 16, y); y += 10;
      // Có thể bổ sung chi tiết hơn nếu muốn
      doc.save(`bao-cao-tong-hop-${new Date().toISOString().split('T')[0]}.pdf`);
      setNotification({ open: true, message: 'Xuất PDF thành công', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Có lỗi khi xuất PDF', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const styles = {
    pageContainer: {
      p: 3,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3,
      backgroundColor: 'white',
      p: 2,
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    searchFilterContainer: {
      mb: 3,
      p: 2,
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '& .MuiTableHead-root': {
        backgroundColor: '#f8f9fa',
        '& .MuiTableCell-root': {
          fontWeight: 'bold',
          color: '#1976d2',
        },
      },
    },
    statusChip: {
      fontWeight: 'bold',
      '&.MuiChip-colorSuccess': {
        backgroundColor: alpha('#4caf50', 0.1),
        color: '#2e7d32',
      },
      '&.MuiChip-colorWarning': {
        backgroundColor: alpha('#ff9800', 0.1),
        color: '#f57c00',
      },
    },
    actionButton: {
      '&:hover': {
        backgroundColor: alpha('#1976d2', 0.1),
      },
    },
    dialogTitle: {
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      color: 'white',
      padding: '16px 24px',
    },
    formField: {
      mb: 2,
    },
    searchField: {
      backgroundColor: 'white',
      borderRadius: 1,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#1976d2',
        },
      },
    },
    addButton: {
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      color: 'white',
      '&:hover': {
        background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
      },
    },
    filterButton: {
      color: '#1976d2',
      '&:hover': {
        backgroundColor: alpha('#1976d2', 0.1),
      },
    },
    formSection: {
      backgroundColor: '#f8f9fa',
      p: 2,
      borderRadius: 1,
      mb: 2,
    },
    formSectionTitle: {
      color: '#1976d2',
      mb: 2,
      fontWeight: 'bold',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    },
    tableRow: {
      '&:hover': {
        backgroundColor: alpha('#1976d2', 0.04),
      },
    },
    tableCell: {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: '#1976d2',
    },
    statsCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      p: 2,
    },
    statsValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1976d2',
      mb: 1,
    },
    statsLabel: {
      color: 'text.secondary',
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý báo cáo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleExportSummaryPDF}
            sx={styles.addButton}
          >
            Xuất PDF tổng hợp
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={styles.addButton}
          >
            Tạo báo cáo mới
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={styles.iconContainer}>
                    <DescriptionIcon />
                    <Typography>Nội dung tổng hợp</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={styles.iconContainer}>
                    <PersonIcon />
                    <Typography>Người tạo</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={styles.iconContainer}>
                    <AssignmentIcon />
                    <Typography>Ngày tạo</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography>Thao tác</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .filter(report => report && typeof report === 'object' && report.content)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.reportId} sx={styles.tableRow}>
                    <TableCell>
                      <Typography
                        sx={{
                          maxWidth: 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={report.content}
                      >
                        {report.content || 'Không có dữ liệu'}
                      </Typography>
                    </TableCell>
                    <TableCell>{getEmployeeName(report.employeeId)}</TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(report)}
                          title="Sửa"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedReport(report);
                            setOpenDeleteDialog(true);
                          }}
                          title="Xóa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
          />
        </TableContainer>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          {selectedReport ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin báo cáo
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Người tạo</InputLabel>
                    <Select
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      label="Người tạo"
                      required
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.employeeId} value={employee.employeeId}>
                          {employee.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú bổ sung (không bắt buộc)"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    sx={styles.formField}
                    helperText="Bạn có thể nhập ghi chú bổ sung cho báo cáo này"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={styles.addButton}
          >
            {selectedReport ? 'Cập nhật' : 'Tạo báo cáo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa báo cáo này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportManagement;
