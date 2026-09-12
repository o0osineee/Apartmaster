import React, { useEffect, useState } from 'react';
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
  Tooltip,
  alpha,
  Chip,
  Paper,
  Snackbar,
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
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../../redux/slices/employeeSlice';
import { fetchDepartments } from '../../../redux/slices/departmentSlice';
import { fetchRoles } from '../../../redux/slices/roleSlice';

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const employees = useSelector((state) => state?.employees?.items || []);
  const employeesLoading = useSelector((state) => state?.employees?.loading || false);
  const employeesError = useSelector((state) => state?.employees?.error || null);
  
  const departments = useSelector((state) => state?.departments?.items || []);
  const departmentsLoading = useSelector((state) => state?.departments?.loading || false);
  const departmentsError = useSelector((state) => state?.departments?.error || null);
  
  const roles = useSelector((state) => state?.roles?.items || []);
  const rolesLoading = useSelector((state) => state?.roles?.loading || false);
  const rolesError = useSelector((state) => state?.roles?.error || null);

  // State
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, employee: null });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    departmentId: '',
    roleId: '',
    status: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    idNumber: '',
    fullName: '',
    gender: '',
    birthDate: null,
    phone: '',
    email: '',
    startDate: null,
    endDate: null,
    departmentId: '',
    roleId: '',
    status: 1,
    username: '',
    password: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        await Promise.all([
          dispatch(fetchEmployees()),
          dispatch(fetchDepartments()),
          dispatch(fetchRoles())
        ]);
        console.log('Data fetched successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Handlers
  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        idNumber: employee.idNumber,
        fullName: employee.fullName,
        gender: employee.gender,
        birthDate: employee.birthDate ? new Date(employee.birthDate) : null,
        phone: employee.phone,
        email: employee.email,
        startDate: employee.startDate ? new Date(employee.startDate) : null,
        endDate: employee.endDate ? new Date(employee.endDate) : null,
        departmentId: employee.departmentId,
        roleId: employee.roleId,
        status: employee.status,
        username: employee.username || '',
        password: employee.username || ''
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        idNumber: '',
        fullName: '',
        gender: '',
        birthDate: null,
        phone: '',
        email: '',
        startDate: new Date(),
        endDate: null,
        departmentId: '',
        roleId: '',
        status: 1,
        username: '',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setFormData({
      idNumber: '',
      fullName: '',
      gender: '',
      birthDate: null,
      phone: '',
      email: '',
      startDate: new Date(),
      endDate: null,
      departmentId: '',
      roleId: '',
      status: 1,
      username: '',
      password: ''
    });
  };

  const handleOpenDeleteDialog = (employee) => {
    setDeleteDialog({ open: true, employee });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, employee: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Tự động cập nhật username và password khi idNumber thay đổi
      if (name === 'idNumber') {
        newData.username = value;
        newData.password = value;
      }
      
      return newData;
    });
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.idNumber || !/^\d{12}$/.test(formData.idNumber)) {
        setNotification({
          open: true,
          message: 'CMND/CCCD phải là chuỗi 12 chữ số',
          severity: 'error'
        });
        return;
      }

      if (!formData.fullName || formData.fullName.length < 3 || formData.fullName.length > 100) {
        setNotification({
          open: true,
          message: 'Họ và tên phải có từ 3 đến 100 ký tự',
          severity: 'error'
        });
        return;
      }

      if (!formData.startDate) {
        setNotification({
          open: true,
          message: 'Ngày vào làm là bắt buộc',
          severity: 'error'
        });
        return;
      }

      if (!formData.username || !/^[a-zA-Z0-9]{3,30}$/.test(formData.username)) {
        setNotification({
          open: true,
          message: 'Tên đăng nhập phải từ 3-30 ký tự, chỉ chứa chữ và số',
          severity: 'error'
        });
        return;
      }

      if (!formData.departmentId) {
        setNotification({
          open: true,
          message: 'Bộ phận là bắt buộc',
          severity: 'error'
        });
        return;
      }

      if (!formData.roleId) {
        setNotification({
          open: true,
          message: 'Vai trò là bắt buộc',
          severity: 'error'
        });
        return;
      }

      // Validate optional fields
      if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
        setNotification({
          open: true,
          message: 'Số điện thoại phải có 10-11 chữ số',
          severity: 'error'
        });
        return;
      }

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setNotification({
          open: true,
          message: 'Email không hợp lệ',
          severity: 'error'
        });
        return;
      }

      if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        setNotification({
          open: true,
          message: 'Ngày thôi việc phải sau ngày vào làm',
          severity: 'error'
        });
        return;
      }

      const employeeData = {
        idNumber: formData.idNumber.trim(),
        fullName: formData.fullName.trim(),
        gender: formData.gender || null,
        birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : null,
        phone: formData.phone ? formData.phone.trim() : null,
        email: formData.email ? formData.email.trim() : null,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate ? formData.endDate.toISOString().split('T')[0] : null,
        departmentId: parseInt(formData.departmentId),
        roleId: parseInt(formData.roleId),
        status: formData.status ? 1 : 0,
        username: formData.idNumber.trim(),
        password: formData.idNumber.trim(),
      };

      if (selectedEmployee) {
        await dispatch(updateEmployee({ 
          id: selectedEmployee.employeeId, 
          data: employeeData 
        }));
        setNotification({
          open: true,
          message: 'Cập nhật nhân viên thành công!',
          severity: 'success'
        });
      } else {
        await dispatch(createEmployee(employeeData));
        setNotification({
          open: true,
          message: 'Thêm nhân viên mới thành công!',
          severity: 'success'
        });
      }
      handleCloseDialog();
      dispatch(fetchEmployees());
    } catch (error) {
      console.error('Error saving employee:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEmployee(deleteDialog.employee.employeeId));
      handleCloseDeleteDialog();
      dispatch(fetchEmployees());
    } catch (error) {
      console.error('Error deleting employee:', error);
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
      departmentId: '',
      roleId: '',
      status: ''
    });
  };

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.departmentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.roleName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = !filters.departmentId || employee.departmentId === parseInt(filters.departmentId);
    const matchesRole = !filters.roleId || employee.roleId === parseInt(filters.roleId);
    const matchesStatus = !filters.status || employee.status === parseInt(filters.status);
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Styles
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
      case 1:
        return 'success';
      case 0:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Đang làm việc';
      case 0:
        return 'Nghỉ việc';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Loading state
  const isLoading = employeesLoading || departmentsLoading || rolesLoading;
  const hasError = employeesError || departmentsError || rolesError;

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {employeesError || departmentsError || rolesError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm nhân viên..."
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
          Thêm nhân viên
            </Button>
          </Box>

      {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Bộ phận</InputLabel>
                <Select
                  value={filters.departmentId}
                  onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                  label="Bộ phận"
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={filters.roleId}
                  onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
                  label="Vai trò"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="1">Đang làm việc</MenuItem>
                  <MenuItem value="0">Nghỉ việc</MenuItem>
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
                  <PersonIcon />
                  <Typography>Họ và tên</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <BadgeIcon />
                  <Typography>CMND/CCCD</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography>Giới tính</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <CalendarTodayIcon />
                  <Typography>Ngày sinh</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PhoneIcon />
                  <Typography>Số điện thoại</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <EmailIcon />
                  <Typography>Email</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <CalendarTodayIcon />
                  <Typography>Ngày vào làm</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <CalendarTodayIcon />
                  <Typography>Ngày thôi việc</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <BusinessIcon />
                  <Typography>Bộ phận</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <WorkIcon />
                  <Typography>Vai trò</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <AssignmentIcon />
                  <Typography>Trạng thái</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                <Typography>Thao tác</Typography>
              </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.employeeId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.fullName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.idNumber}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.gender}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(employee.birthDate)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.phone}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.email}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(employee.startDate)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(employee.endDate)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.departmentName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{employee.roleName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={getStatusText(employee.status)}
                    color={getStatusColor(employee.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(employee)}
                        sx={styles.actionButton}
                          >
                            <EditIcon />
                          </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                        onClick={() => handleOpenDeleteDialog(employee)}
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
          count={filteredEmployees.length}
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
          {selectedEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin cá nhân
              </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                    label="CMND/CCCD"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                  onChange={handleInputChange}
                      label="Giới tính"
                      required
                    >
                      <MenuItem value="Nam">Nam</MenuItem>
                      <MenuItem value="Nữ">Nữ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày sinh"
                      value={formData.birthDate}
                      onChange={handleDateChange('birthDate')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required sx={styles.formField} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>

            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin liên hệ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                    required
                    sx={styles.formField}
                />
              </Grid>
              </Grid>
            </Box>

            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin tài khoản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.username}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={styles.formField}
                    helperText="Tên đăng nhập sẽ tự động lấy từ số căn cước công dân"
                />
              </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formData.password}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={styles.formField}
                    helperText="Mật khẩu mặc định giống số căn cước công dân"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin công việc
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày bắt đầu"
                      value={formData.startDate}
                      onChange={handleDateChange('startDate')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required sx={styles.formField} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày kết thúc"
                      value={formData.endDate}
                      onChange={handleDateChange('endDate')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth sx={styles.formField} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Bộ phận</InputLabel>
                    <Select
                      name="departmentId"
                      value={formData.departmentId || ''}
                      onChange={handleInputChange}
                      label="Bộ phận"
                      required
                    >
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <MenuItem key={dept.departmentId} value={dept.departmentId}>
                            {dept.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có dữ liệu</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      name="roleId"
                      value={formData.roleId || ''}
                      onChange={handleInputChange}
                      label="Vai trò"
                      required
                    >
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <MenuItem key={role.roleId} value={role.roleId}>
                            {role.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có dữ liệu</MenuItem>
                      )}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={12}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                      label="Trạng thái"
                      required
                    >
                      <MenuItem value={1}>Đang làm việc</MenuItem>
                      <MenuItem value={0}>Nghỉ việc</MenuItem>
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
            disabled={!formData.departmentId || !formData.roleId}
          >
            {selectedEmployee ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa nhân viên này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.employee?.fullName}
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

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement; 