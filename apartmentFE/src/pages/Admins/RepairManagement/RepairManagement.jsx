import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
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
  Tooltip,
  alpha,
  Chip,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  fetchRepairs,
  createRepair,
  updateRepair,
  deleteRepair,
} from '../../../redux/slices/repairSlice';
import { fetchResidents } from '../../../redux/slices/residentSlice';
import { fetchEmployeesByDepartment } from '../../../redux/slices/employeeSlice';


const RepairManagement = () => {
  const dispatch = useDispatch();
  const repairs = useSelector((state) => state?.repairs?.items || []);
  const repairsLoading = useSelector((state) => state?.repairs?.loading || false);
  const repairsError = useSelector((state) => state?.repairs?.error || null);
  const residents = useSelector((state) => state?.residents?.items || []);
 
  const employees = useSelector((state) => {
    const empItems = state?.employees?.departmentEmployees;
    if (!empItems) return [];
    const employeesArray = empItems.data || empItems;
    return Array.isArray(employeesArray) ? employeesArray : [];
  });


  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, repair: null });
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    employeeId: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Đã tiếp nhận',
    residentId: '',
    employeeId: ''
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchRepairs()),
          dispatch(fetchResidents()),
          dispatch(fetchEmployeesByDepartment(2))
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, [dispatch]);


  const handleOpenDialog = (repair = null) => {
    if (repair) {
      setSelectedRepair(repair);
      setFormData({
        title: repair.title,
        description: repair.description,
        status: repair.status,
        residentId: repair.resident?.residentId || '',
        employeeId: repair.employee?.employeeId || ''
      });
    } else {
      setSelectedRepair(null);
      setFormData({
        title: '',
        description: '',
        status: 'Đã tiếp nhận',
        residentId: '',
        employeeId: ''
      });
    }
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRepair(null);
    setFormData({
      title: '',
      description: '',
      status: 'Đã tiếp nhận',
      residentId: '',
      employeeId: ''
    });
  };


  const handleOpenDeleteDialog = (repair) => {
    setDeleteDialog({ open: true, repair });
  };


  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, repair: null });
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
      const repairData = {
        ...formData,
        resident: {
          residentId: parseInt(formData.residentId)
        },
        employee: {
          employeeId: parseInt(formData.employeeId)
        }
      };


      if (selectedRepair) {
        await dispatch(updateRepair({ id: selectedRepair.repairId, data: repairData }));
      } else {
        await dispatch(createRepair(repairData));
      }
      handleCloseDialog();
      dispatch(fetchRepairs());
    } catch (error) {
      console.error('Error saving repair:', error);
    }
  };


  const handleDelete = async () => {
    try {
      await dispatch(deleteRepair(deleteDialog.repair.repairId));
      handleCloseDeleteDialog();
      dispatch(fetchRepairs());
    } catch (error) {
      console.error('Error deleting repair:', error);
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleClearFilters = () => {
    setFilters({
      status: '',
      employeeId: ''
    });
  };


  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.resident?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.employee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());


    const matchesStatus = !filters.status || repair.status === filters.status;
    const matchesEmployee = !filters.employeeId || repair.employee?.employeeId === parseInt(filters.employeeId);
   
    return matchesSearch && matchesStatus && matchesEmployee;
  });


  const paginatedRepairs = filteredRepairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


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
      '&.MuiChip-colorError': {
        backgroundColor: alpha('#f44336', 0.1),
        color: '#d32f2f',
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
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành':
        return 'success';
      case 'Đang xử lý':
        return 'warning';
      case 'Đã tiếp nhận':
        return 'error';
      default:
        return 'default';
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (repairsLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }


  if (repairsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{repairsError}</Alert>
      </Box>
    );
  }


  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm yêu cầu sửa chữa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: 300, ...styles.searchField }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={styles.filterButton}
          >
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={styles.addButton}
        >
          Thêm yêu cầu sửa chữa
        </Button>
      </Box>


      {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Đã tiếp nhận">Đã tiếp nhận</MenuItem>
                  <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Nhân viên</InputLabel>
                <Select
                  value={filters.employeeId}
                  onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                  label="Nhân viên"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.isArray(employees) && employees.map((emp) => (
                    <MenuItem key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                fullWidth
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}


      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <BuildIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Tiêu đề</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <DescriptionIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Mô tả</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <AssignmentIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Trạng thái</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Cư dân</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Nhân viên</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <ScheduleIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Ngày tạo</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Typography variant="subtitle1" fontWeight="bold">Thao tác</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRepairs.map((repair) => (
              <TableRow key={repair.repairId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{repair.title}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{repair.description}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={repair.status}
                    color={getStatusColor(repair.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{repair.resident?.fullName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{repair.employee?.fullName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(repair.createdAt)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(repair)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(repair)}
                        sx={styles.actionButton}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRepairs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </TableContainer>


      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          {selectedRepair ? 'Chỉnh sửa yêu cầu sửa chữa' : 'Thêm yêu cầu sửa chữa mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin yêu cầu sửa chữa
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Trạng thái"
                      required
                    >
                      <MenuItem value="Đã tiếp nhận">Đã tiếp nhận</MenuItem>
                      <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                      <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Cư dân</InputLabel>
                    <Select
                      name="residentId"
                      value={formData.residentId}
                      onChange={handleInputChange}
                      label="Cư dân"
                      required
                    >
                      {Array.isArray(residents) && residents.map((resident) => (
                        <MenuItem key={resident.residentId} value={resident.residentId}>
                          {resident.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Nhân viên phụ trách</InputLabel>
                    <Select
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      label="Nhân viên phụ trách"
                      required
                    >
                      {Array.isArray(employees) && employees.map((emp) => (
                        <MenuItem key={emp.employeeId} value={emp.employeeId}>
                          {emp.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.title || !formData.description || !formData.residentId || !formData.employeeId}
          >
            {selectedRepair ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ ...styles.dialogTitle, background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)' }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Bạn có chắc chắn muốn xóa yêu cầu sửa chữa này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.repair?.title}
          </Typography>
          <Typography color="error" variant="body2">
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ minWidth: 100, mr: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default RepairManagement;




