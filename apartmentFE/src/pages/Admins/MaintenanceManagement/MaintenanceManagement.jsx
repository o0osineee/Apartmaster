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
} from '@mui/icons-material';
import {
  fetchMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../../../redux/slices/maintenanceSlice';
import { fetchEmployeesByDepartment } from '../../../redux/slices/employeeSlice';

const MaintenanceManagement = () => {
  const dispatch = useDispatch();
  const maintenancesState = useSelector((state) => state.maintenances || {});
  const maintenances = maintenancesState.items?.data || [];
  const maintenancesLoading = maintenancesState.loading || false;
  const maintenancesError = maintenancesState.error || null;
  
  const employees = useSelector((state) => {
    const empItems = state?.employees?.departmentEmployees;
    if (!empItems) return [];
    const employeesArray = empItems.data || empItems;
    return Array.isArray(employeesArray) ? employeesArray : [];
  });

  console.log('Maintenances State:', maintenancesState);
  console.log('Maintenances Data:', maintenances);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, maintenance: null });
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
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
    time: null,
    status: 'Đã tiếp nhận',
    employeeId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchMaintenances()),
          dispatch(fetchEmployeesByDepartment(2)) // Lấy nhân viên bộ phận kỹ thuật
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOpenDialog = (maintenance = null) => {
    if (maintenance) {
      setSelectedMaintenance(maintenance);
      setFormData({
        title: maintenance.title,
        description: maintenance.description,
        time: maintenance.time ? new Date(maintenance.time) : null,
        status: maintenance.status,
        employeeId: maintenance.employee?.employeeId || ''
      });
    } else {
      setSelectedMaintenance(null);
      setFormData({
        title: '',
        description: '',
        time: null,
        status: 'Đã tiếp nhận',
        employeeId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaintenance(null);
    setFormData({
      title: '',
      description: '',
      time: null,
      status: 'Đã tiếp nhận',
      employeeId: ''
    });
  };

  const handleOpenDeleteDialog = (maintenance) => {
    setDeleteDialog({ open: true, maintenance });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, maintenance: null });
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
      const maintenanceData = {
        ...formData,
        time: formData.time ? formData.time.toISOString().slice(0, 19).replace('T', ' ') : null,
        employee: {
          employeeId: parseInt(formData.employeeId)
        }
      };

      if (selectedMaintenance) {
        await dispatch(updateMaintenance({ id: selectedMaintenance.maintenanceId, data: maintenanceData }));
      } else {
        await dispatch(createMaintenance(maintenanceData));
      }
      handleCloseDialog();
      dispatch(fetchMaintenances());
    } catch (error) {
      console.error('Error saving maintenance:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMaintenance(deleteDialog.maintenance.maintenanceId));
      handleCloseDeleteDialog();
      dispatch(fetchMaintenances());
    } catch (error) {
      console.error('Error deleting maintenance:', error);
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

  const filteredMaintenances = maintenances.filter((maintenance) => {
    const matchesSearch = 
      maintenance.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      maintenance.employee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || maintenance.status === filters.status;
    const matchesEmployee = !filters.employeeId || maintenance.employee?.employeeId === parseInt(filters.employeeId);
    
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const paginatedMaintenances = filteredMaintenances.slice(
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

  if (maintenancesLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (maintenancesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{maintenancesError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm bảo trì..."
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
          Thêm yêu cầu bảo trì
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
                  {employees.map((emp) => (
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
                  <Typography>Tiêu đề</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <DescriptionIcon />
                  <Typography>Mô tả</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <ScheduleIcon />
                  <Typography>Thời gian</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <BuildIcon />
                  <Typography>Trạng thái</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography>Nhân viên</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMaintenances.map((maintenance) => (
              <TableRow key={maintenance.maintenanceId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{maintenance.title}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{maintenance.description}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(maintenance.time)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={maintenance.status}
                    color={getStatusColor(maintenance.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{maintenance.employee?.fullName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(maintenance)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(maintenance)}
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
          count={filteredMaintenances.length}
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
          {selectedMaintenance ? 'Chỉnh sửa yêu cầu bảo trì' : 'Thêm yêu cầu bảo trì mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin bảo trì
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
                    required
                    multiline
                    rows={4}
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Thời gian bảo trì"
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
                      <MenuItem value="Đã tiếp nhận">Đã tiếp nhận</MenuItem>
                      <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                      <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
            disabled={!formData.employeeId}
          >
            {selectedMaintenance ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa bảo trì này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.maintenance?.title}
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

export default MaintenanceManagement;
