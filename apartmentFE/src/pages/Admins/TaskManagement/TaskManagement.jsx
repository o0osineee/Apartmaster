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
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../redux/slices/taskSlice';
import { fetchDepartments } from '../../../redux/slices/departmentSlice';
import { fetchEmployees, fetchEmployeesByDepartment } from '../../../redux/slices/employeeSlice';

const TaskManagement = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state?.tasks?.items || []);
  const tasksLoading = useSelector((state) => state?.tasks?.loading || false);
  const tasksError = useSelector((state) => state?.tasks?.error || null);
  const departments = useSelector((state) => {
    const deptItems = state?.departments?.items;
    if (!deptItems) return [];
    const departmentsArray = deptItems.data || deptItems;
    return Array.isArray(departmentsArray) ? departmentsArray : [];
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null });
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    departmentId: '',
    employeeId: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: null,
    status: 'Chờ xử lý',
    departmentId: '',
    employeeId: ''
  });

  const employees = useSelector((state) => {
    if (formData.departmentId) {
      return state.employees.departmentEmployees;
    }
    const empItems = state?.employees?.items;
    if (!empItems) return [];
    const employeesArray = empItems.data || empItems;
    return Array.isArray(employeesArray) ? employeesArray : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const [tasksResult, departmentsResult, employeesResult] = await Promise.all([
          dispatch(fetchTasks()),
          dispatch(fetchDepartments()),
          dispatch(fetchEmployees())
        ]);
        
        console.log('Tasks result:', tasksResult);
        console.log('Departments result:', departmentsResult);
        console.log('Employees result:', employeesResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleOpenDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline ? new Date(task.deadline) : null,
        status: task.status || 'Chờ xử lý',
        departmentId: task.department?.departmentId || '',
        employeeId: task.employee?.employeeId || ''
      });
    } else {
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        deadline: null,
        status: 'Chờ xử lý',
        departmentId: '',
        employeeId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      deadline: null,
      status: 'Chờ xử lý',
      departmentId: '',
      employeeId: ''
    });
  };

  const handleOpenDeleteDialog = (task) => {
    setDeleteDialog({ open: true, task });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, task: null });
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
      const taskData = {
        ...formData,
        deadline: formData.deadline ? formData.deadline.toISOString().split('T')[0] : null,
        departmentId: parseInt(formData.departmentId),
        employeeId: formData.employeeId ? parseInt(formData.employeeId) : null
      };

      if (selectedTask) {
        await dispatch(updateTask({ id: selectedTask.taskId, data: taskData }));
      } else {
        await dispatch(createTask(taskData));
      }
      handleCloseDialog();
      dispatch(fetchTasks());
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(deleteDialog.task.taskId));
      handleCloseDeleteDialog();
      dispatch(fetchTasks());
    } catch (error) {
      console.error('Error deleting task:', error);
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
      employeeId: ''
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.employee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesDepartment = !filters.departmentId || task.department?.departmentId === parseInt(filters.departmentId);
    const matchesEmployee = !filters.employeeId || task.employee?.employeeId === parseInt(filters.employeeId);
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesEmployee;
  });

  const paginatedTasks = filteredTasks.slice(
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
      day: '2-digit'
    });
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setFormData(prev => ({
      ...prev,
      departmentId,
      employeeId: ''
    }));
    
    if (departmentId) {
      try {
        await dispatch(fetchEmployeesByDepartment(departmentId));
      } catch (error) {
        console.error('Error fetching employees by department:', error);
      }
    }
  };

  if (tasksLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasksError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{tasksError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm công việc..."
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
          Thêm công việc
        </Button>
      </Box>

      {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
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
                  <AssignmentIcon />
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
                  <ScheduleIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Hạn chót</Typography>
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
                  <BusinessIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Phòng ban</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Nhân viên</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                <Typography variant="subtitle1" fontWeight="bold">Thao tác</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow key={task.taskId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{task.title}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{task.description}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(task.deadline)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{task.department?.name}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{task.employee?.fullName || 'Không có'}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell} align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(task)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(task)}
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
          count={filteredTasks.length}
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
          {selectedTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin công việc
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
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Hạn chót"
                      value={formData.deadline}
                      onChange={handleDateChange('deadline')}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth sx={styles.formField} />
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
                    >
                      <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
                      <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                      <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Bộ phận phụ trách</InputLabel>
                    <Select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleDepartmentChange}
                      label="Bộ phận phụ trách"
                      required
                    >
                      {Array.isArray(departments) && departments.map((dept) => (
                        <MenuItem key={dept.departmentId} value={dept.departmentId}>
                          {dept.name}
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
                      disabled={!formData.departmentId}
                    >
                      <MenuItem value="">Không có</MenuItem>
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
            disabled={!formData.departmentId}
          >
            {selectedTask ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa công việc này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.task?.title}
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

export default TaskManagement;
