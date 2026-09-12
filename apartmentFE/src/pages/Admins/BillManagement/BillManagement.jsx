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
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  fetchBills,
  calculateBill,
  updateBillPayment,
  deleteBill,
} from '../../../redux/slices/billSlice';
import { fetchApartments } from '../../../redux/slices/apartmentSlice';
import axios from 'axios';

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

const BillManagement = () => {
  const dispatch = useDispatch();
  const { bills = [], loading, error } = useSelector((state) => state.bills);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    apartmentCode: '',
    month: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [formData, setFormData] = useState({
    apartmentId: '',
    month: new Date(),
  });
  const [paymentData, setPaymentData] = useState({
    isPaid: false,
    paymentMethod: ''
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    billId: null,
    apartmentCode: '',
  });

  const [apartmentSearch, setApartmentSearch] = useState('');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartmentError, setApartmentError] = useState('');

  useEffect(() => {
    dispatch(fetchBills());
    dispatch(fetchApartments());
  }, [dispatch]);

  // Get unique values for filters
  const apartmentCodes = [...new Set(bills?.map(bill => bill.apartmentCode) || [])];
  const months = [...new Set(bills?.map(bill => bill.month) || [])].sort().reverse();
  const statuses = ['Đã thanh toán', 'Chưa thanh toán'];

  // Filter bills based on search query and filters
  const filteredBills = bills?.filter(bill => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      String(bill.apartmentCode).toLowerCase().includes(searchLower) ||
      String(bill.month).includes(searchLower) ||
      String(bill.money).includes(searchLower) ||
      String(bill.paymentMethod || '').toLowerCase().includes(searchLower);

    const matchesApartment = filters.apartmentCode === '' || bill.apartmentCode === filters.apartmentCode;
    const matchesMonth = filters.month === '' || bill.month === filters.month;
    const matchesStatus = filters.status === '' || 
      (filters.status === 'Đã thanh toán' ? bill.isPaid : !bill.isPaid);

    return matchesSearch && matchesApartment && matchesMonth && matchesStatus;
  }) || [];

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBills = filteredBills.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      apartmentCode: '',
      month: '',
      status: '',
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      apartmentId: '',
      month: new Date(),
    });
    setApartmentSearch('');
    setSelectedApartment(null);
    setApartmentError('');
  };

  const handleOpenPaymentDialog = (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      isPaid: bill.isPaid,
      paymentMethod: bill.paymentMethod || ''
    });
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setSelectedBill(null);
    setPaymentData({
      isPaid: false,
      paymentMethod: ''
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      month: date
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedApartment) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn căn hộ',
          severity: 'error'
        });
        return;
      }
      const data = {
        apartmentId: selectedApartment.apartmentId,
        month: format(formData.month, 'yyyy-MM'),
        isPaid: false,
        paymentMethod: ''
      };
      await dispatch(calculateBill(data)).unwrap();
      await dispatch(fetchBills());
      setNotification({
        open: true,
        message: 'Tính hóa đơn thành công!',
        severity: 'success'
      });
      handleCloseDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Có lỗi xảy ra khi tính hóa đơn',
        severity: 'error'
      });
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      if (selectedBill) {
        await dispatch(updateBillPayment({
          billId: selectedBill.billId,
          paymentData: {
            isPaid: paymentData.isPaid,
            paymentMethod: paymentData.paymentMethod
          }
        })).unwrap();
        await dispatch(fetchBills());
        setNotification({
          open: true,
          message: 'Cập nhật trạng thái thanh toán thành công!',
          severity: 'success'
        });
        handleClosePaymentDialog();
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán',
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = (bill) => {
    setDeleteDialog({
      open: true,
      billId: bill.billId,
      apartmentCode: bill.apartmentCode,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      billId: null,
      apartmentCode: '',
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBill(deleteDialog.billId));
      setNotification({
        open: true,
        message: 'Xóa hóa đơn thành công!',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Có lỗi xảy ra khi xóa hóa đơn',
        severity: 'error'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleApartmentSearch = async () => {
    try {
      setApartmentError('');
      const response = await axios.get(`/api/apartments/code/${apartmentSearch}`);
      if (response.data.success) {
        const apartment = response.data.data;
        
        // Lấy thông tin phí của căn hộ
        const feeResponse = await axios.get(`/api/fee-apartments/${apartment.apartmentId}`);
        if (feeResponse.data.success) {
          const feeDetails = feeResponse.data.data.map(fee => ({
            feeId: fee.feeId,
            feeName: fee.feeName,
            unitPrice: fee.unitPrice,
            weight: fee.weight,
            total: fee.unitPrice * fee.weight
          }));
          
          setSelectedApartment({
            ...apartment,
            feeDetails
          });
        } else {
          setSelectedApartment(apartment);
        }
        
        setFormData(prev => ({
          ...prev,
          apartmentId: apartment.apartmentId
        }));
      }
    } catch (error) {
      setApartmentError('Không tìm thấy căn hộ với mã này');
      setSelectedApartment(null);
      setFormData(prev => ({
        ...prev,
        apartmentId: ''
      }));
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const renderCreateBillDialog = () => (
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
        Tính hóa đơn mới
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={styles.formSection}>
            <Typography variant="h6" sx={styles.formSectionTitle}>
              Thông tin hóa đơn
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="Mã căn hộ"
                    value={apartmentSearch}
                    onChange={(e) => setApartmentSearch(e.target.value)}
                    error={!!apartmentError}
                    helperText={apartmentError}
                    fullWidth
                    sx={styles.formField}
                  />
                  <Button
                    variant="contained"
                    onClick={handleApartmentSearch}
                    sx={{ mt: 1 }}
                  >
                    Tìm kiếm
                  </Button>
                </Box>
              </Grid>
              {selectedApartment && (
                <Grid item xs={12}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Đã tìm thấy căn hộ: {selectedApartment.code}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                    label="Tháng"
                    value={formData.month}
                    onChange={handleDateChange}
                    views={['month', 'year']}
                    renderInput={(params) => <TextField {...params} fullWidth sx={styles.formField} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>

          {selectedApartment && formData.month && (
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Chi tiết hóa đơn
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên phí</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Hệ số</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedApartment.feeDetails?.map((fee, index) => (
                      <TableRow key={index}>
                        <TableCell>{fee.feeName}</TableCell>
                        <TableCell align="right">{formatCurrency(fee.unitPrice)}</TableCell>
                        <TableCell align="right">{fee.weight}</TableCell>
                        <TableCell align="right">{formatCurrency(fee.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Tổng cộng:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {formatCurrency(selectedApartment.feeDetails?.reduce((sum, fee) => sum + fee.total, 0) || 0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
          disabled={!selectedApartment || !formData.month}
        >
          Tính hóa đơn
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={styles.pageContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={styles.header}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Tìm kiếm hóa đơn..."
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
              onClick={handleOpenDialog}
              sx={styles.addButton}
            >
              Tính hóa đơn mới
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
                    <InputLabel>Căn hộ</InputLabel>
                    <Select
                      value={filters.apartmentCode}
                      onChange={(e) => setFilters({ ...filters, apartmentCode: e.target.value })}
                      label="Căn hộ"
                      startAdornment={
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả căn hộ</MenuItem>
                      {apartmentCodes.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tháng</InputLabel>
                    <Select
                      value={filters.month}
                      onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                      label="Tháng"
                      startAdornment={
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Tất cả tháng</MenuItem>
                      {months.map((month) => (
                        <MenuItem key={month} value={month}>
                          {month}
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
                          <PaymentIcon color="primary" />
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

        {/* Bills Table */}
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
                          <CalendarIcon />
                          <Typography>Tháng</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <MoneyIcon />
                          <Typography>Số tiền</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <PaymentIcon />
                          <Typography>Trạng thái</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box sx={styles.iconContainer}>
                          <ReceiptIcon />
                          <Typography>Phương thức thanh toán</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell} align="right">
                        <Typography>Thao tác</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedBills.map((bill) => (
                      <TableRow key={`${bill.billId}-${bill.apartmentId}-${bill.month}`} sx={styles.tableRow}>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{bill.apartmentCode}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{bill.month}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{formatCurrency(bill.money)}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Chip
                            label={bill.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            color={bill.isPaid ? 'success' : 'warning'}
                            sx={styles.statusChip}
                          />
                        </TableCell>
                        <TableCell sx={styles.tableCell}>
                          <Typography>{bill.isPaid ? (bill.paymentMethod || '-') : '-'}</Typography>
                        </TableCell>
                        <TableCell sx={styles.tableCell} align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="Cập nhật thanh toán">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenPaymentDialog(bill)}
                                sx={styles.actionButton}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDeleteDialog(bill)}
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
                count={filteredBills.length}
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

      {renderCreateBillDialog()}

      {/* Dialog cập nhật thanh toán */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
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
          Cập nhật trạng thái thanh toán
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin thanh toán
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      name="isPaid"
                      value={paymentData.isPaid}
                      onChange={handlePaymentChange}
                      label="Trạng thái"
                      required
                    >
                      <MenuItem value={true}>Đã thanh toán</MenuItem>
                      <MenuItem value={false}>Chưa thanh toán</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={paymentData.paymentMethod}
                      onChange={handlePaymentChange}
                      label="Phương thức thanh toán"
                      required
                    >
                      <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                      <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                      <MenuItem value="Thẻ tín dụng">Thẻ tín dụng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClosePaymentDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            variant="contained"
            color="primary"
            sx={styles.addButton}
          >
            Cập nhật
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
            Bạn có chắc chắn muốn xóa hóa đơn này?
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
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillManagement; 