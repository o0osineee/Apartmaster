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
  ReportProblem as ReportProblemIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import {
  fetchComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from '../../../redux/slices/complaintSlice';
import { fetchResidents } from '../../../redux/slices/residentSlice';
import { fetchDepartments } from '../../../redux/slices/departmentSlice';

const ComplaintManagement = () => {
  const dispatch = useDispatch();
  const { items: complaints, loading, error } = useSelector((state) => {
    console.log('Complaints state:', state.complaints);
    return state.complaints;
  });
  console.log('Complaints data:', complaints);

  const residents = useSelector((state) => state?.residents?.items || []);
  const departments = useSelector((state) => state?.departments?.items || []);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, complaint: null });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    departmentId: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    time: null,
    status: 'Chờ xử lý',
    residentId: '',
    departmentId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchComplaints()),
          dispatch(fetchResidents()),
          dispatch(fetchDepartments())
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOpenDialog = (complaint = null) => {
    if (complaint) {
      setSelectedComplaint(complaint);
      setFormData({
        title: complaint.title,
        content: complaint.content,
        time: complaint.time ? new Date(complaint.time) : null,
        status: complaint.status,
        residentId: complaint.resident?.residentId || '',
        departmentId: complaint.department?.departmentId || '',
      });
    } else {
      setSelectedComplaint(null);
      setFormData({
        title: '',
        content: '',
        time: null,
        status: 'Chờ xử lý',
        residentId: '',
        departmentId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComplaint(null);
    setFormData({
      title: '',
      content: '',
      time: null,
      status: 'Chờ xử lý',
      residentId: '',
      departmentId: '',
    });
  };

  const handleOpenDeleteDialog = (complaint) => {
    setDeleteDialog({ open: true, complaint });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, complaint: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      const complaintData = {
        ...formData,
        time: formData.time ? formData.time.toISOString().slice(0, 19).replace('T', ' ') : null,
        resident: {
          residentId: parseInt(formData.residentId)
        },
        department: {
          departmentId: parseInt(formData.departmentId)
        }
      };

      if (selectedComplaint) {
        await dispatch(updateComplaint({ id: selectedComplaint.complaintId, data: complaintData }));
      } else {
        await dispatch(createComplaint(complaintData));
      }
      handleCloseDialog();
      dispatch(fetchComplaints());
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteComplaint(deleteDialog.complaint.complaintId));
      handleCloseDeleteDialog();
      dispatch(fetchComplaints());
    } catch (error) {
      console.error('Error deleting complaint:', error);
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
      departmentId: '',
    });
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.resident?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || complaint.status === filters.status;
    const matchesDepartment = !filters.departmentId || complaint.department?.departmentId === parseInt(filters.departmentId);
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const paginatedComplaints = filteredComplaints.slice(
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
      case 'Chờ xử lý':
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

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm khiếu nại..."
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
          Thêm khiếu nại
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
                  <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
                  <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                  <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Phòng ban</InputLabel>
                <Select
                  value={filters.departmentId}
                  onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                  label="Phòng ban"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
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
                  <ReportProblemIcon />
                  <Typography>Tiêu đề</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <DescriptionIcon />
                  <Typography>Nội dung</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <ScheduleIcon />
                  <Typography>Trạng thái</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography>Cư dân</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <BusinessIcon />
                  <Typography>Phòng ban</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <ScheduleIcon />
                  <Typography>Ngày tạo</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComplaints.map((complaint) => (
              <TableRow key={complaint.complaintId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{complaint.title}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{complaint.content}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{complaint.resident?.fullName || 'Không có'}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{complaint.department?.name || 'Không có'}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(complaint.createdAt)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(complaint)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(complaint)}
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
          count={filteredComplaints.length}
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
          {selectedComplaint ? 'Chỉnh sửa khiếu nại' : 'Thêm khiếu nại mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin khiếu nại
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
                    label="Nội dung"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Thời gian xử lý"
                      value={formData.time}
                      onChange={handleDateChange('time')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required sx={styles.formField} />
                      )}
                    />
                  </LocalizationProvider>
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
                      <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
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
                      {residents.map((res) => (
                        <MenuItem key={res.residentId} value={res.residentId}>
                          {res.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Phòng ban</InputLabel>
                    <Select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      label="Phòng ban"
                      required
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept.departmentId} value={dept.departmentId}>
                          {dept.name}
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
          >
            {selectedComplaint ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa khiếu nại này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.complaint?.title}
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

export default ComplaintManagement;
