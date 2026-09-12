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
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import {
  fetchFees,
  createFee,
  updateFee,
  deleteFee,
  setSelectedFee,
  setFilters,
  clearFilters,
} from '../../../redux/slices/feeSlice';

const FEE_TYPES = [
  'Tiện ích',
  'Dịch vụ',

];

const FeeManagement = () => {
  const dispatch = useDispatch();
  const { 
    items: feesResponse = { success: true, data: [] }, 
    loading, 
    error,
    selectedFee,
    filters,
  } = useSelector((state) => state.fees || {});

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, fee: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: ''
  });

  useEffect(() => {
    dispatch(fetchFees());
  }, [dispatch]);

  const handleOpenDialog = (fee = null) => {
    if (fee) {
      dispatch(setSelectedFee(fee));
      setFormData({
        name: fee.name,
        type: fee.type,
        price: fee.price.toString()
      });
    } else {
      dispatch(setSelectedFee(null));
      setFormData({
        name: '',
        type: '',
        price: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(setSelectedFee(null));
    setFormData({
      name: '',
      type: '',
      price: ''
    });
  };

  const handleOpenDeleteDialog = (fee) => {
    setDeleteDialog({ open: true, fee });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, fee: null });
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
      const feeData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (selectedFee) {
        await dispatch(updateFee({ id: selectedFee.feeId, data: feeData }));
      } else {
        await dispatch(createFee(feeData));
      }
      handleCloseDialog();
      dispatch(fetchFees());
    } catch (error) {
      console.error('Error saving fee:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFee(deleteDialog.fee.feeId));
      handleCloseDeleteDialog();
      dispatch(fetchFees());
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleTypeFilterChange = (e) => {
    dispatch(setFilters({ type: e.target.value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const filteredFees = feesResponse.data.filter((fee) => {
    const matchesSearch = 
      fee.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      fee.type?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.type === 'all' || fee.type === filters.type;

    return matchesSearch && matchesType;
  });

  const paginatedFees = filteredFees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
    actionButton: {
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
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
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
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
    filterContainer: {
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      mb: 2,
    },
    filterChip: {
      '&.MuiChip-colorPrimary': {
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        color: '#1976d2',
      },
    },
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
            placeholder="Tìm kiếm phí..."
            value={filters.search}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ width: 300, ...styles.searchField }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => dispatch(setFilters({ search: '' }))}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Loại phí</InputLabel>
            <Select
              value={filters.type}
              onChange={handleTypeFilterChange}
              label="Loại phí"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {FEE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {(filters.search || filters.type !== 'all') && (
            <Button
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              size="small"
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={styles.addButton}
        >
          Thêm phí
        </Button>
      </Box>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCell}>Tên phí</TableCell>
              <TableCell sx={styles.tableCell}>Loại phí</TableCell>
              <TableCell sx={styles.tableCell}>Giá</TableCell>
              <TableCell sx={styles.tableCell}>Ngày tạo</TableCell>
              <TableCell sx={styles.tableCell}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFees.map((fee) => (
              <TableRow key={fee.feeId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Box sx={styles.iconContainer}>
                    <MoneyIcon />
                    <Typography>{fee.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={styles.iconContainer}>
                    <CategoryIcon />
                    <Chip
                      label={fee.type}
                      size="small"
                      sx={styles.filterChip}
                    />
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{formatCurrency(fee.price)}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={styles.iconContainer}>
                    <ScheduleIcon />
                    <Typography>{formatDate(fee.createdAt)}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(fee)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(fee)}
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
          count={filteredFees.length}
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
          {selectedFee ? 'Chỉnh sửa phí' : 'Thêm phí mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin phí
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên phí"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Loại phí</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Loại phí"
                      required
                    >
                      {FEE_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Giá"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                    }}
                    sx={styles.formField}
                  />
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
            disabled={!formData.name || !formData.type || !formData.price}
          >
            {selectedFee ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa phí này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.fee?.name}
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

export default FeeManagement;
