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
  DirectionsCar as CarIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../../../redux/slices/vehicleSlice';
import { fetchResidents, findResidentByIdNumber } from '../../../redux/slices/residentSlice';


const VehicleManagement = () => {
  const dispatch = useDispatch();
  const { items: vehicles, loading, error } = useSelector((state) => state.vehicles || {});


  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vehicle: null });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    licensePlate: '',
    type: '',
    residentId: '',
    idCard: ''
  });
  const [residentInfo, setResidentInfo] = useState(null);


  useEffect(() => {
    console.log('Fetching data...');
    dispatch(fetchVehicles());
    dispatch(fetchResidents());
  }, [dispatch]);


  const handleOpenDialog = (vehicle = null) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        residentId: vehicle.resident?.residentId || '',
        idCard: vehicle.resident?.idCard || ''
      });
      setResidentInfo(vehicle.resident);
    } else {
      setSelectedVehicle(null);
      setFormData({
        licensePlate: '',
        type: '',
        residentId: '',
        idCard: ''
      });
      setResidentInfo(null);
    }
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
    setFormData({
      licensePlate: '',
      type: '',
      residentId: '',
      idCard: ''
    });
    setResidentInfo(null);
  };


  const handleOpenDeleteDialog = (vehicle) => {
    setDeleteDialog({ open: true, vehicle });
  };


  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, vehicle: null });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (name === 'idCard') {
      if (value.length === 12) {
        dispatch(findResidentByIdNumber(value))
          .unwrap()
          .then((resident) => {
            setFormData(prev => ({
              ...prev,
              residentId: resident.residentId
            }));
            setResidentInfo(resident);
          })
          .catch((error) => {
            console.error('Error finding resident:', error);
            setFormData(prev => ({
              ...prev,
              residentId: ''
            }));
            setResidentInfo(null);
          });
      } else {
        setFormData(prev => ({
          ...prev,
          residentId: ''
        }));
        setResidentInfo(null);
      }
    }
  };


  const isFormValid = () => {
    return formData.licensePlate &&
           formData.type &&
           formData.idCard &&
           formData.residentId;
  };


  const handleSubmit = async () => {
    try {
      const vehicleData = {
        licensePlate: formData.licensePlate,
        type: formData.type,
        residentId: parseInt(formData.residentId)
      };


      if (selectedVehicle) {
        await dispatch(updateVehicle({ id: selectedVehicle.vehicleId, data: vehicleData }));
      } else {
        await dispatch(createVehicle(vehicleData));
      }
      handleCloseDialog();
      dispatch(fetchVehicles());
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };


  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(deleteDialog.vehicle.vehicleId));
      handleCloseDeleteDialog();
      dispatch(fetchVehicles());
    } catch (error) {
      console.error('Error deleting vehicle:', error);
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
      type: ''
    });
  };


  const filteredVehicles = vehicles?.data?.filter((vehicle) => {
    const matchesSearch =
      vehicle.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.resident?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());


    const matchesType = !filters.type || vehicle.type === filters.type;
   
    return matchesSearch && matchesType;
  }) || [];


  const paginatedVehicles = filteredVehicles.slice(
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
    typeChip: {
      fontWeight: 'bold',
      '&.MuiChip-colorPrimary': {
        backgroundColor: alpha('#1976d2', 0.1),
        color: '#1976d2',
      },
      '&.MuiChip-colorSecondary': {
        backgroundColor: alpha('#9c27b0', 0.1),
        color: '#9c27b0',
      },
    },
  };


  const getTypeColor = (type) => {
    switch (type) {
      case 'Xe máy':
        return 'primary';
      case 'Ô tô':
        return 'secondary';
      default:
        return 'default';
    }
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
            placeholder="Tìm kiếm phương tiện..."
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
          Thêm phương tiện
        </Button>
      </Box>


      {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại phương tiện</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  label="Loại phương tiện"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Xe máy">Xe máy</MenuItem>
                  <MenuItem value="Xe đạp">Xe đạp</MenuItem>

                  <MenuItem value="Ô tô">Ô tô</MenuItem>
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
                  <CarIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Biển số xe</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <CarIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Loại phương tiện</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <Box sx={styles.iconContainer}>
                  <PersonIcon />
                  <Typography variant="subtitle1" fontWeight="bold">Cư dân</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                <Typography variant="subtitle1" fontWeight="bold">Thao tác</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVehicles.map((vehicle) => (
              <TableRow key={vehicle.vehicleId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{vehicle.licensePlate}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Chip
                    label={vehicle.type}
                    color={getTypeColor(vehicle.type)}
                    sx={styles.typeChip}
                  />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{vehicle.resident?.fullName}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell} align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(vehicle)}
                        sx={styles.actionButton}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(vehicle)}
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
          count={filteredVehicles.length}
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
          {selectedVehicle ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.formSectionTitle}>
                Thông tin phương tiện
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Biển số xe"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={styles.formField}>
                    <InputLabel>Loại phương tiện</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Loại phương tiện"
                      required
                    >
                      <MenuItem value="Xe máy">Xe máy</MenuItem>
                      <MenuItem value="Xe đạp">Xe đạp</MenuItem>
                      <MenuItem value="Ô tô">Ô tô</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CCCD của cư dân"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    required
                    sx={styles.formField}
                    helperText={residentInfo ? `Đã tìm thấy cư dân: ${residentInfo.fullName}` : "Nhập CCCD để tìm cư dân"}
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
            disabled={!isFormValid()}
          >
            {selectedVehicle ? 'Cập nhật' : 'Thêm mới'}
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
            Bạn có chắc chắn muốn xóa phương tiện này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.vehicle?.licensePlate}
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


export default VehicleManagement;




