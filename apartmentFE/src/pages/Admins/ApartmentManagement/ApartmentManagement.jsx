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
  Home as HomeIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  AreaChart as AreaChartIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  fetchApartments,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../../../redux/slices/apartmentSlice';

// Custom styles
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
    '&.MuiChip-colorInfo': {
      backgroundColor: alpha('#2196f3', 0.1),
      color: '#1976d2',
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

const ApartmentManagement = () => {
  const dispatch = useDispatch();
  const { items: apartments = [], loading, error } = useSelector((state) => state.apartments || {});
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    building: '',
    floor: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    building: '',
    floor: '',
    area: '',
    status: 'Còn trống',
    contract: '',
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'info' | 'warning'
  });

  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: '',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    apartmentId: null,
    apartmentCode: '',
  });

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  // Get unique values for filters
  const buildings = [...new Set(apartments.map(apt => apt.building))];
  const floors = [...new Set(apartments.map(apt => apt.floor))].sort((a, b) => a - b);
  const statuses = ['Còn trống', 'Đã mua', 'Đã thuê'];

  // Filter apartments based on search query and filters
  const filteredApartments = apartments.filter(apartment => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      String(apartment.code).toLowerCase().includes(searchLower) ||
      String(apartment.building).toLowerCase().includes(searchLower) ||
      String(apartment.floor).includes(searchLower) ||
      String(apartment.area).includes(searchLower) ||
      String(apartment.status).toLowerCase().includes(searchLower) ||
      String(apartment.contract || '').toLowerCase().includes(searchLower);

    const matchesBuilding = filters.building === '' || apartment.building === filters.building;
    const matchesFloor = filters.floor === '' || apartment.floor === Number(filters.floor);
    const matchesStatus = filters.status === '' || apartment.status === filters.status;

    return matchesSearch && matchesBuilding && matchesFloor && matchesStatus;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedApartments = filteredApartments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      building: '',
      floor: '',
      status: '',
    });
  };

  const handleOpenDialog = (apartment = null) => {
    if (apartment) {
      console.log('Opening dialog for apartment:', apartment);
      setSelectedApartment(apartment);
      setFormData({
        code: apartment.code,
        building: apartment.building,
        floor: apartment.floor,
        area: apartment.area,
        status: apartment.status,
        contract: apartment.contract || '',
      });
    } else {
      console.log('Opening dialog for new apartment');
      setSelectedApartment(null);
      setFormData({
        code: '',
        building: '',
        floor: '',
        area: '',
        status: 'Còn trống',
        contract: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApartment(null);
    setFormData({
      code: '',
      building: '',
      floor: '',
      area: '',
      status: 'Còn trống',
      contract: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCloseErrorDialog = () => {
    setErrorDialog({ open: false, message: '' });
  };

  const handleSubmit = async () => {
    try {
      const apartmentData = {
        ...formData,
        floor: parseInt(formData.floor),
        area: parseFloat(formData.area),
      };

      if (selectedApartment) {
        const result = await dispatch(updateApartment({ 
          id: selectedApartment.apartmentId, 
          data: apartmentData 
        })).unwrap();
        
        if (result) {
          await dispatch(fetchApartments());
          setNotification({
            open: true,
            message: 'Cập nhật căn hộ thành công!',
            severity: 'success'
          });
          handleCloseDialog();
        }
    } else {
        const result = await dispatch(createApartment(apartmentData)).unwrap();
        
        if (result) {
          await dispatch(fetchApartments());
          setNotification({
            open: true,
            message: 'Thêm căn hộ mới thành công!',
            severity: 'success'
          });
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.error('Error saving apartment:', error);
      
      // Luôn load lại danh sách căn hộ
      await dispatch(fetchApartments());
      
      // Xử lý thông báo lỗi
      let errorMessage = 'Có lỗi xảy ra khi lưu căn hộ!';
      
      if (error.response?.status === 409 || 
          (error.message && error.message.includes('code already exists'))) {
        errorMessage = `Mã căn hộ "${formData.code}" đã tồn tại trong hệ thống!`;
      } else if (error.response?.data?.message) {
        // Lấy thông báo lỗi từ server
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Lấy thông báo lỗi từ error object
        errorMessage = error.message;
      }

        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      
      // Đóng dialog nếu là lỗi trùng mã
      if (error.response?.status === 409) {
        handleCloseDialog();
      }
    }
  };

  const handleOpenDeleteDialog = (apartment) => {
    setDeleteDialog({
      open: true,
      apartmentId: apartment.apartmentId,
      apartmentCode: apartment.code,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      apartmentId: null,
      apartmentCode: '',
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteApartment(deleteDialog.apartmentId));
      setNotification({
        open: true,
        message: 'Xóa căn hộ thành công!',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting apartment:', error);
      setNotification({
        open: true,
        message: 'Có lỗi xảy ra khi xóa căn hộ',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Còn trống':
        return 'info';
      case 'Đã mua':
        return 'success';
      case 'Đã thuê':
        return 'warning';
      default:
        return 'default';
    }
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
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.pageContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={styles.header}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Tìm kiếm căn hộ..."
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
                  Thêm căn hộ
                </Button>
              </Box>
          </Grid>

        {/* Filter Section */}
          {showFilters && (
          <Grid item xs={12}>
            <Paper sx={styles.searchFilterContainer}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tòa nhà</InputLabel>
                    <Select
                      value={filters.building}
                      onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                      label="Tòa nhà"
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả tòa nhà</MenuItem>
                      {buildings.map((building) => (
                        <MenuItem key={building} value={building}>
                          {building}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tầng</InputLabel>
                    <Select
                      value={filters.floor}
                      onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                      label="Tầng"
                      startAdornment={
                        <InputAdornment position="start">
                          <LayersIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả tầng</MenuItem>
                      {floors.map((floor) => (
                        <MenuItem key={floor} value={floor}>
                          Tầng {floor}
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
                      startAdornment={
                        <InputAdornment position="start">
                          <AssignmentIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả trạng thái</MenuItem>
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
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
            </Paper>
          </Grid>
          )}

        {/* Apartments Table */}
        <Grid item xs={12}>
          <Card sx={styles.tableContainer}>
            <CardContent>
              <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
                    <TableRow>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <HomeIcon />
                          <Typography>Mã căn hộ</Typography>
                  </Box>
                </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <BusinessIcon />
                          <Typography>Tòa nhà</Typography>
                  </Box>
                </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <LayersIcon />
                          <Typography>Tầng</Typography>
                  </Box>
                </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <AreaChartIcon />
                          <Typography>Diện tích (m²)</Typography>
                  </Box>
                </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <AssignmentIcon />
                          <Typography>Trạng thái</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <AssignmentIcon />
                    <Typography>Mã hợp đồng</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell} align="right">
                        <Typography>Thao tác</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                    {paginatedApartments.map((apartment) => (
                      <TableRow key={apartment.apartmentId} sx={styles.tableRow}>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{apartment.code}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{apartment.building}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{apartment.floor}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{apartment.area}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                      <Chip 
                            label={apartment.status}
                            color={getStatusColor(apartment.status)}
                            sx={styles.statusChip}
                          />
                  </TableCell>
                        <TableCell sx={styles.tableCell}>
                          {apartment.contract && apartment.status !== 'Còn trống' && (
                            <Typography variant="body2" color="text.secondary">
                              {apartment.contract}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={styles.tableCell} align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                                onClick={() => handleOpenDialog(apartment)}
                                sx={styles.actionButton}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                                onClick={() => handleOpenDeleteDialog(apartment)}
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
        </TableContainer>
              <TablePagination
                component="div"
                count={filteredApartments.length}
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
        </Grid>
      </Grid>

        <Dialog
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
            borderRadius: 2,
            background: 'white',
            },
          }}
        >
        <DialogTitle sx={styles.dialogTitle}>
          {selectedApartment ? 'Chỉnh sửa thông tin căn hộ' : 'Thêm căn hộ mới'}
          </DialogTitle>
            <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin cơ bản
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                    label="Mã căn hộ"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Tòa nhà"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                  required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                  label="Tầng"
                    name="floor"
                  type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Diện tích"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                  required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Trạng thái"
                      required
                    >
                      <MenuItem value="Còn trống">Còn trống</MenuItem>
                      <MenuItem value="Đã mua">Đã mua</MenuItem>
                      <MenuItem value="Đã thuê">Đã thuê</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {(formData.status === 'Đã mua' || formData.status === 'Đã thuê') && (
              <Box sx={styles.formSection}>
                <Typography variant="h6" sx={styles.formSectionTitle}>
                  Thông tin hợp đồng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                  fullWidth
                      label="Mã hợp đồng"
                      name="contract"
                      value={formData.contract}
                      onChange={handleInputChange}
                      sx={styles.formField}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
              </Box>
            </DialogContent>
        <DialogActions sx={{ p: 2 }}>
              <Button
            onClick={handleCloseDialog}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
              px: 3,
                }}
              >
                Hủy
              </Button>
              <Button
            onClick={handleSubmit} 
                variant="contained"
                color="primary"
            sx={styles.addButton}
          >
            {selectedApartment ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={errorDialog.open}
        onClose={handleCloseErrorDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          '& .MuiTypography-root': {
            fontWeight: 'bold',
          },
        }}>
          Thông báo
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography color="error" sx={{ fontSize: '1.1rem' }}>
              {errorDialog.message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseErrorDialog}
            variant="contained"
            color="error"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
              px: 3,
            }}
          >
            Đóng
              </Button>
            </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
            borderRadius: 2,
            background: 'white',
            },
          }}
        >
        <DialogTitle sx={{ ...styles.dialogTitle, background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)' }}>
              Xác nhận xóa
          </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Bạn có chắc chắn muốn xóa căn hộ này?
          </Typography>
          <Typography color="error" sx={{ fontWeight: 'medium', mb: 2 }}>
            Mã căn hộ: {deleteDialog.apartmentCode}
          </Typography>
          <Typography color="text.secondary" variant="body2">
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

export default ApartmentManagement;

