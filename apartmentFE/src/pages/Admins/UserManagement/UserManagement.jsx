import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  IconButton,
  Tooltip,
  alpha,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Divider,
  Grid,
  CircularProgress,
  TablePagination,
  Alert,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionDetails,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Sort as SortIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { fetchEmployees } from '../../../redux/slices/employeeSlice';
import { fetchResidents } from '../../../redux/slices/residentSlice';
import axios from 'axios';

const UserManagement = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    status: 'active',
    roleID: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });
  const [showPassword, setShowPassword] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get unique values for filters
  const roles = ['employee', 'resident'];
  const statuses = ['active', 'inactive'];

  // Thêm state mới cho phân quyền
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Thêm state cho thông báo
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Thêm state mới cho danh sách quyền
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchResidents());
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/login-info');
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError('Không thể lấy danh sách người dùng');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy danh sách người dùng');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Thêm useEffect để fetch dữ liệu phân quyền
  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        setLoadingPermissions(true);
        const response = await axios.get('/api/role-permissions');
        if (response.data.success) {
          setRolePermissions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching role permissions:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchRolePermissions();
  }, []);

  // Thêm useEffect để fetch danh sách quyền
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('/api/permissions');
        if (response.data.success) {
          setPermissions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setNotification({
          open: true,
          message: 'Có lỗi xảy ra khi tải danh sách quyền',
          severity: 'error'
        });
      }
    };

    fetchPermissions();
  }, []);

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      String(user.username).toLowerCase().includes(searchLower) ||
      String(user.fullName).toLowerCase().includes(searchLower) ||
      String(user.email).toLowerCase().includes(searchLower) ||
      String(user.phone).toLowerCase().includes(searchLower);

    const matchesRole = filters.role === '' || user.role === filters.role;
    const matchesStatus = filters.status === '' || 
      (filters.status === 'active' ? user.status === 1 : user.status === 0);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      role: '',
      status: '',
    });
  };

  const handleOpenEditDialog = (user) => {
    setForm({
      username: user.username,
      password: user.password,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status === 1 ? 'active' : 'inactive',
      roleID: user.role,
    });
    setEditingId(user.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update password and status
        const response = await axios.put(`/api/auth/users/${editingId}/update`, {
          password: form.password,
          status: form.status === 'active' ? 1 : 0
        });

        if (response.data.success) {
          setNotification({
            open: true,
            message: 'Cập nhật thông tin người dùng thành công!',
            severity: 'success'
          });
          setIsDialogOpen(false);
          // Refresh user list
          const usersResponse = await axios.get('/api/auth/login-info');
          if (usersResponse.data.success) {
            setUsers(usersResponse.data.data);
          }
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin người dùng',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Hàm xử lý thay đổi quyền
  const handlePermissionChange = async (roleId, departmentId, permissionId, checked) => {
    try {
      setLoadingPermissions(true);
      
      if (checked) {
        // Thêm quyền
        const response = await axios.post(`/api/role-permissions/${roleId}/${departmentId}/${permissionId}`);
        if (response.data.success) {
          // Cập nhật UI sau khi API call thành công
          setRolePermissions(prev => 
            prev.map(rp => {
              if (rp.role.id === roleId && rp.department.id === departmentId) {
                return {
                  ...rp,
                  permissions: [...rp.permissions, { id: permissionId }]
                };
              }
              return rp;
            })
          );
          setNotification({
            open: true,
            message: 'Đã thêm quyền thành công',
            severity: 'success'
          });
        }
      } else {
        // Xóa quyền
        const response = await axios.delete(`/api/role-permissions/${roleId}/${departmentId}/${permissionId}`);
        if (response.data.success) {
          // Cập nhật UI sau khi API call thành công
          setRolePermissions(prev => 
            prev.map(rp => {
              if (rp.role.id === roleId && rp.department.id === departmentId) {
                return {
                  ...rp,
                  permissions: rp.permissions.filter(p => p.id !== permissionId)
                };
              }
              return rp;
            })
          );
          setNotification({
            open: true,
            message: 'Đã xóa quyền thành công',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật quyền',
        severity: 'error'
      });
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Thêm hàm đóng thông báo
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
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
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: '#1976d2',
    },
    tableRow: {
      '&:hover': {
        backgroundColor: alpha('#1976d2', 0.04),
      },
    },
    tableCell: {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: 'calc(100vh - 88px)',
          overflow: 'hidden',
        }}
      >
        <Box>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 200,
                fontSize: '1rem',
                py: 2,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              label="Danh sách người dùng" 
              iconPosition="start"
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Phân quyền" 
              iconPosition="start"
            />
          </Tabs>

          {activeTab === 0 ? (
            <>
              <Box sx={styles.header}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    placeholder="Tìm kiếm người dùng..."
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
              </Box>

              {/* Filter Section */}
              {showFilters && (
                <Box sx={styles.searchFilterContainer}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Vai trò</InputLabel>
                        <Select
                          value={filters.role}
                          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                          label="Vai trò"
                          startAdornment={
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">Tất cả vai trò</MenuItem>
                          {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role === 'employee' ? 'Nhân viên' : 'Cư dân'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          label="Trạng thái"
                          startAdornment={
                            <InputAdornment position="start">
                              <SecurityIcon color="primary" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">Tất cả trạng thái</MenuItem>
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
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
                        sx={styles.filterButton}
                      >
                        Xóa bộ lọc
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Card sx={styles.tableContainer}>
                <CardContent>
                  <TableContainer component={Paper} sx={styles.tableContainer}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <PersonIcon />
                              <Typography>Loại người dùng</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <PersonIcon />
                              <Typography>Tên đăng nhập</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <SecurityIcon />
                              <Typography>Mật khẩu</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <PersonIcon />
                              <Typography>Họ và tên</Typography>
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
                              <PhoneIcon />
                              <Typography>Số điện thoại</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <SecurityIcon />
                              <Typography>Vai trò</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Box sx={styles.iconContainer}>
                              <SecurityIcon />
                              <Typography>Trạng thái</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={styles.tableCell} align="right">
                            <Typography>Thao tác</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id} sx={styles.tableRow}>
                            <TableCell sx={styles.tableCell}>
                              <Chip 
                                label={user.role === 'employee' ? 'Nhân viên' : 'Cư dân'}
                                size="small"
                                sx={{ 
                                  backgroundColor: user.role === 'employee' ? alpha('#1976d2', 0.1) : alpha('#4caf50', 0.1),
                                  color: user.role === 'employee' ? 'primary.main' : 'success.main',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={styles.tableCell}>{user.username}</TableCell>
                            <TableCell sx={styles.tableCell}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {showPassword[user.id] ? user.password : '••••••••'}
                                <IconButton
                                  size="small"
                                  onClick={() => setShowPassword(prev => ({
                                    ...prev,
                                    [user.id]: !prev[user.id]
                                  }))}
                                >
                                  {showPassword[user.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell sx={styles.tableCell}>{user.fullName}</TableCell>
                            <TableCell sx={styles.tableCell}>{user.email}</TableCell>
                            <TableCell sx={styles.tableCell}>{user.phone}</TableCell>
                            <TableCell sx={styles.tableCell}>
                              <Chip 
                                label={user.roleName || 'Chưa phân quyền'}
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha('#1976d2', 0.1),
                                  color: 'primary.main',
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={styles.tableCell}>
                              <Chip 
                                label={user.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
                                color={user.status === 1 ? 'success' : 'error'}
                                size="small"
                                sx={styles.statusChip}
                              />
                            </TableCell>
                            <TableCell sx={styles.tableCell} align="right">
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Tooltip title="Sửa">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    sx={styles.actionButton}
                                    onClick={() => handleOpenEditDialog(user)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={filteredUsers.length}
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
                </CardContent>
              </Card>
            </>
          ) : (
            <Box sx={{ p: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <SecurityIcon />
                      Phân quyền theo vai trò và bộ phận
                    </Typography>
                  </Box>

                  {loadingPermissions ? (
                    <Box display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      '& .MuiTableHead-root': {
                        backgroundColor: '#f8f9fa',
                        '& .MuiTableCell-root': {
                          fontWeight: 'bold',
                          color: '#1976d2',
                          borderBottom: '2px solid #e0e0e0',
                        },
                      },
                      '& .MuiTableBody-root .MuiTableRow-root:hover': {
                        backgroundColor: alpha('#1976d2', 0.04),
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid #e0e0e0',
                      }
                    }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ minWidth: 150 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="primary" />
                                <Typography>Vai trò</Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ minWidth: 150 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon color="primary" />
                                <Typography>Bộ phận</Typography>
                              </Box>
                            </TableCell>
                            {permissions.map(permission => (
                              <TableCell 
                                key={permission.permissionId}
                                align="center"
                                sx={{ minWidth: 120 }}
                              >
                                <Tooltip title={permission.description || permission.name}>
                                  <Typography sx={{ 
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                  }}>
                                    {permission.name}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rolePermissions.map((rp) => (
                            <TableRow key={`${rp.role.id}-${rp.department.id}`}>
                              <TableCell>
                                <Chip 
                                  label={rp.role.name}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha('#1976d2', 0.1),
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    minWidth: 120
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={rp.department.name}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha('#4caf50', 0.1),
                                    color: 'success.main',
                                    fontWeight: 500,
                                    minWidth: 120
                                  }}
                                />
                              </TableCell>
                              {permissions.map(permission => (
                                <TableCell 
                                  key={`${rp.role.id}-${rp.department.id}-${permission.permissionId}`}
                                  align="center"
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={rp.permissions.some(p => p.id === permission.permissionId)}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            rp.role.id,
                                            rp.department.id,
                                            permission.permissionId,
                                            e.target.checked
                                          )
                                        }
                                        color="primary"
                                        size="small"
                                      />
                                    }
                                    label=""
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          Chỉnh sửa thông tin người dùng
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={form.username}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={styles.formField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type={showPassword[editingId] ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(prev => ({
                            ...prev,
                            [editingId]: !prev[editingId]
                          }))}
                          edge="end"
                        >
                          {showPassword[editingId] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                  sx={styles.formField}
                  helperText="Nhập mật khẩu mới cho người dùng"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    label="Trạng thái"
                    required
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thêm Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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

export default UserManagement;
