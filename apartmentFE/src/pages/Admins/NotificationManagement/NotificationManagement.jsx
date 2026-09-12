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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Notifications as NotificationsIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  fetchNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../../../redux/slices/notificationSlice';

const NotificationManagement = () => {
  const dispatch = useDispatch();
  const notificationsState = useSelector((state) => state.notifications || {});
  const notifications = notificationsState.items?.data || [];
  const loading = notificationsState.loading || false;
  const error = notificationsState.error || null;

  console.log('Notifications state:', notificationsState);
  console.log('Notifications data:', notifications);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, notification: null });
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'Hiển thị'
  });

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleOpenDialog = (notification = null) => {
    if (notification) {
      setSelectedNotification(notification);
      setFormData({
        title: notification.title,
        content: notification.content,
        status: notification.status
      });
    } else {
      setSelectedNotification(null);
      setFormData({
        title: '',
        content: '',
        status: 'Hiển thị'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotification(null);
    setFormData({
      title: '',
      content: '',
      status: 'Hiển thị'
    });
  };

  const handleOpenDeleteDialog = (notification) => {
    setDeleteDialog({ open: true, notification });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, notification: null });
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
      if (selectedNotification) {
        await dispatch(updateNotification({ id: selectedNotification.notificationId, data: formData }));
      } else {
        await dispatch(createNotification(formData));
      }
      handleCloseDialog();
      dispatch(fetchNotifications());
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteNotification(deleteDialog.notification.notificationId));
      handleCloseDeleteDialog();
      dispatch(fetchNotifications());
    } catch (error) {
      console.error('Error deleting notification:', error);
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
      status: ''
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = 
      notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !filters.status || notification.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedNotifications = filteredNotifications.slice(
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
      case 'Hiển thị':
        return 'success';
      case 'Ẩn':
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
            placeholder="Tìm kiếm thông báo..."
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
          Thêm thông báo
        </Button>
      </Box>

      {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                  <MenuItem value="Ẩn">Ẩn</MenuItem>
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
              <TableCell sx={styles.tableCell}><NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Tiêu đề</TableCell>
              <TableCell sx={styles.tableCell}><DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Nội dung</TableCell>
              <TableCell sx={styles.tableCell}><FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Trạng thái</TableCell>
              <TableCell sx={styles.tableCell}><PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Người tạo</TableCell>
              <TableCell sx={styles.tableCell}><ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Ngày tạo</TableCell>
              <TableCell sx={styles.tableCell}><EditIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNotifications.map((notification) => (
              <TableRow key={notification.notificationId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{notification.title}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{notification.content}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={notification.status}
                    color={getStatusColor(notification.status)}
                    sx={styles.statusChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{notification.employeeName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatDate(notification.createdAt)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(notification)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(notification)}
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
          count={filteredNotifications.length}
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
          {selectedNotification ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin thông báo
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
                      <MenuItem value="Hiển thị">Hiển thị</MenuItem>
                      <MenuItem value="Ẩn">Ẩn</MenuItem>
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
            {selectedNotification ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa thông báo này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.notification?.title}
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

export default NotificationManagement;
