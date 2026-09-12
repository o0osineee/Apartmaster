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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import {
  fetchResidents,
  createResident,
  updateResident,
  deleteResident,
} from '../../../redux/slices/residentSlice';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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

const ResidentManagement = () => {
  const dispatch = useDispatch();
  const { items: residents = [], loading, error } = useSelector((state) => state.residents || {});
  // console.log('Residents data:', residents);
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: null,
    gender: '',
    idNumber: '',
    phone: '',
    email: '',
    username: '',
    status: 1,
    password: '',
    apartmentCode: '',
    isOwner: false,
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: '',
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    residentId: null,
    residentName: '',
  });

  const [apartmentSearchResult, setApartmentSearchResult] = useState(null);
  const [apartmentSearchLoading, setApartmentSearchLoading] = useState(false);
  const [apartmentSearchError, setApartmentSearchError] = useState(null);
  const [existingOwner, setExistingOwner] = useState(false);
  const [residentApartments, setResidentApartments] = useState([]);

  // Add new state for showing/hiding add apartment form
  const [showAddApartmentForm, setShowAddApartmentForm] = useState(false);

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  // Fetch resident's apartments when editing
  useEffect(() => {
    if (selectedResident) {
      const fetchResidentApartments = async () => {
        try {
          const response = await axios.get(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments`);
          setResidentApartments(response.data.data || []);
        } catch (error) {
          console.error('Error fetching resident apartments:', error);
        }
      };
      fetchResidentApartments();
    }
  }, [selectedResident]);

  // Filter residents based on search query and filters
  const filteredResidents = residents.filter(resident => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      String(resident.fullName).toLowerCase().includes(searchLower) ||
      String(resident.phone).includes(searchLower) ||
      String(resident.email).toLowerCase().includes(searchLower) ||
      String(resident.idNumber).includes(searchLower);

    const matchesGender = filters.gender === '' || resident.gender === filters.gender;

    return matchesSearch && matchesGender;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedResidents = filteredResidents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      gender: '',
    });
  };

  const handleOpenDialog = (resident = null) => {
    if (resident) {
      setSelectedResident(resident);
      setFormData({
        fullName: resident.fullName,
        birthDate: resident.birthDate ? new Date(resident.birthDate) : null,
        gender: resident.gender,
        idNumber: resident.idNumber,
        phone: resident.phone,
        email: resident.email,
        username: resident.username,
        status: resident.status,
        password: '',
        apartmentCode: '',
        isOwner: false,
      });
    } else {
      setSelectedResident(null);
      setFormData({
        fullName: '',
        birthDate: null,
        gender: '',
        idNumber: '',
        phone: '',
        email: '',
        username: '',
        status: 1,
        password: '',
        apartmentCode: '',
        isOwner: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResident(null);
    setFormData({
      fullName: '',
      birthDate: null,
      gender: '',
      idNumber: '',
      phone: '',
      email: '',
      username: '',
      status: 1,
      password: '',
      apartmentCode: '',
      isOwner: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: date,
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

      if (formData.apartmentCode && !apartmentSearchResult) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn một căn hộ hợp lệ',
          severity: 'error'
        });
        return;
      }

      // Format data before sending
      const residentData = {
        idNumber: formData.idNumber.trim(),
        fullName: formData.fullName.trim(),
        gender: formData.gender || null,
        birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : null,
        phone: formData.phone ? formData.phone.trim() : null,
        email: formData.email ? formData.email.trim() : null,
        username: formData.idNumber.trim(), // Username mặc định là idNumber
        password: formData.idNumber.trim(), // Password mặc định là idNumber
        status: 1,
        roleId: 6, // Role mặc định cho cư dân
        apartmentCode: formData.apartmentCode || null,
        isOwner: formData.isOwner === true // Chuyển đổi thành boolean
      };

      // Log data for debugging
      console.log('Sending resident data:', residentData);

      let result;
      if (selectedResident) {
        result = await dispatch(updateResident({ 
          id: selectedResident.residentId, 
          data: residentData 
        })).unwrap();
      } else {
        result = await dispatch(createResident(residentData)).unwrap();
      }

      if (result) {
        await dispatch(fetchResidents());
        setNotification({
          open: true,
          message: selectedResident ? 'Cập nhật cư dân thành công!' : 'Thêm cư dân mới thành công!',
          severity: 'success'
        });
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error saving resident:', error);
      let errorMessage = 'Có lỗi xảy ra khi lưu thông tin cư dân';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = (resident) => {
    setDeleteDialog({
      open: true,
      residentId: resident.residentId,
      residentName: resident.fullName,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      residentId: null,
      residentName: '',
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteResident(deleteDialog.residentId));
      setNotification({
        open: true,
        message: 'Xóa cư dân thành công!',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting resident:', error);
      setNotification({
        open: true,
        message: 'Có lỗi xảy ra khi xóa cư dân',
        severity: 'error'
      });
    }
  };

  const handleApartmentCodeChange = async (e) => {
    const code = e.target.value.trim();
    setFormData(prev => ({ ...prev, newApartmentCode: code }));
    
    if (code.length > 0) {
      setApartmentSearchLoading(true);
      setApartmentSearchError(null);
      setExistingOwner(false);
      try {
        // Check if apartment exists
        const response = await axios.get(`/api/apartments/code/${code}`);
        const apartment = response.data.data;
        setApartmentSearchResult(apartment);

        // Check if apartment has an owner
        const ownerResponse = await axios.get(`/api/resident-apartments/apartments/${apartment.apartmentId}/residents`);
        const residents = ownerResponse.data.data || [];
        const hasOwner = residents.some(r => r.isOwner === 1 && !r.assignmentIsDeleted);
        setExistingOwner(hasOwner);

        // If apartment has owner, disable owner option
        if (hasOwner) {
          setFormData(prev => ({ ...prev, newIsOwner: false }));
        }
      } catch (error) {
        console.error('Error searching apartment:', error);
        setApartmentSearchError('Không tìm thấy căn hộ với mã này');
        setApartmentSearchResult(null);
      } finally {
        setApartmentSearchLoading(false);
      }
    } else {
      setApartmentSearchResult(null);
      setApartmentSearchError(null);
      setExistingOwner(false);
    }
  };

  const handleUpdateApartmentRole = async (apartmentId, isOwner) => {
    try {
      console.log('Updating apartment role:', {
        residentId: selectedResident.residentId,
        apartmentId,
        isOwner
      });

      await axios.put(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments/${apartmentId}`, {
        isOwner: isOwner
      });
      
      // Refresh resident's apartments
      const response = await axios.get(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments`);
      setResidentApartments(response.data.data || []);
      
      setNotification({
        open: true,
        message: 'Cập nhật vai trò thành công!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating apartment role:', error.response?.data || error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò',
        severity: 'error'
      });
    }
  };

  const handleAddNewApartment = async () => {
    try {
      if (!apartmentSearchResult) {
        setNotification({
          open: true,
          message: 'Vui lòng chọn một căn hộ hợp lệ',
          severity: 'error'
        });
        return;
      }

      console.log('Adding new apartment:', {
        residentId: selectedResident.residentId,
        apartmentId: apartmentSearchResult.apartmentId,
        isOwner: formData.newIsOwner
      });

      await axios.post(`/api/resident-apartments`, {
        residentId: selectedResident.residentId,
        apartmentId: apartmentSearchResult.apartmentId,
        isOwner: formData.newIsOwner,
        moveInDate: new Date().toISOString().split('T')[0]
      });

      // Refresh resident's apartments
      const response = await axios.get(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments`);
      setResidentApartments(response.data.data || []);

      // Clear form and hide it
      setFormData(prev => ({
        ...prev,
        newApartmentCode: '',
        newIsOwner: false
      }));
      setApartmentSearchResult(null);
      setApartmentSearchError(null);
      setExistingOwner(false);
      setShowAddApartmentForm(false);

      setNotification({
        open: true,
        message: 'Thêm căn hộ thành công!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding new apartment:', error.response?.data || error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi thêm căn hộ',
        severity: 'error'
      });
    }
  };

  const handleRemoveApartment = async (apartmentId) => {
    try {
      await axios.delete(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments/${apartmentId}`);
      
      // Refresh resident's apartments
      const response = await axios.get(`/api/resident-apartments/residents/${selectedResident.residentId}/apartments`);
      setResidentApartments(response.data.data || []);
      
      setNotification({
        open: true,
        message: 'Xóa quan hệ căn hộ thành công!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing apartment:', error.response?.data || error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa quan hệ căn hộ',
        severity: 'error'
      });
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
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
            placeholder="Tìm kiếm cư dân..."
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
                  Thêm cư dân
                </Button>
              </Box>

          {showFilters && (
        <Paper sx={styles.searchFilterContainer}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={filters.gender}
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  label="Giới tính"
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
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
                  <CalendarIcon />
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
                  <HomeIcon />
                  <Typography>Căn hộ</Typography>
                </Box>
              </TableCell>
              <TableCell sx={styles.tableCell} align="right">
                <Typography>Thao tác</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {paginatedResidents.map((resident) => (
              <TableRow key={resident.residentId} sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  <Typography>{resident.fullName}</Typography>
                  </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{resident.idNumber}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{resident.gender}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>
                    {resident.birthDate ? format(new Date(resident.birthDate), 'dd/MM/yyyy') : '-'}
                  </Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{resident.phone}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography>{resident.email}</Typography>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {resident.apartments && resident.apartments.length > 0 ? (
                    <Box>
                      {resident.apartments.map((apt, index) => (
                        <Typography key={apt.apartmentId} variant="body2">
                          {apt.apartmentCode} {apt.isOwner === 1 ? '(Chủ hộ)' : ''}
                          {index < resident.apartments.length - 1 ? ', ' : ''}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                  </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                        onClick={() => handleOpenDialog(resident)}
                        sx={styles.actionButton}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                        onClick={() => handleOpenDeleteDialog(resident)}
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
          count={filteredResidents.length}
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

        <Dialog
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
          fullWidth
      >
        <DialogTitle sx={styles.dialogTitle}>
          {selectedResident ? 'Chỉnh sửa thông tin cư dân' : 'Thêm cư dân mới'}
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
                      <MenuItem value="Khác">Khác</MenuItem>
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
                Thông tin căn hộ
              </Typography>
              {selectedResident ? (
                // Edit mode - show existing apartments and add new apartment form
                <Box>
                  {residentApartments.length > 0 ? (
                    residentApartments.map((apt) => (
                      <Box key={apt.apartmentId} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1">
                            {apt.apartmentCode} - {apt.building} - Tầng {apt.floor}
                          </Typography>
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveApartment(apt.apartmentId)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <InputLabel>Vai trò</InputLabel>
                          <Select
                            value={apt.isOwner ? 1 : 0}
                            onChange={(e) => handleUpdateApartmentRole(apt.apartmentId, e.target.value === 1)}
                            label="Vai trò"
                          >
                            <MenuItem value={1}>Chủ hộ</MenuItem>
                            <MenuItem value={0}>Cư dân</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Cư dân chưa được gán vào căn hộ nào
                    </Typography>
                  )}

                  {/* Add new apartment button */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setShowAddApartmentForm(!showAddApartmentForm)}
                      startIcon={showAddApartmentForm ? <RemoveIcon /> : <AddIcon />}
                      fullWidth
                    >
                      {showAddApartmentForm ? 'Hủy thêm căn hộ' : 'Thêm căn hộ mới'}
                    </Button>
                  </Box>

                  {/* Add new apartment form */}
                  {showAddApartmentForm && (
                    <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Thêm căn hộ mới</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Mã căn hộ"
                            name="newApartmentCode"
                            value={formData.newApartmentCode || ''}
                            onChange={handleApartmentCodeChange}
                            sx={styles.formField}
                            helperText={
                              apartmentSearchLoading 
                                ? "Đang tìm kiếm..." 
                                : apartmentSearchError 
                                ? apartmentSearchError 
                                : apartmentSearchResult 
                                ? `Tìm thấy căn hộ: ${apartmentSearchResult.building} - Tầng ${apartmentSearchResult.floor}`
                                : "Nhập mã căn hộ để tìm kiếm"
                            }
                            error={!!apartmentSearchError}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={styles.formField}>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                              name="newIsOwner"
                              value={formData.newIsOwner || false}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                newIsOwner: e.target.value
                              }))}
                              label="Vai trò"
                              disabled={!apartmentSearchResult || existingOwner}
                            >
                              <MenuItem value={false}>Cư dân</MenuItem>
                              <MenuItem value={true} disabled={existingOwner}>
                                Chủ hộ {existingOwner && "(Đã có chủ hộ)"}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddNewApartment}
                            disabled={!apartmentSearchResult}
                            fullWidth
                          >
                            Thêm căn hộ
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              ) : (
                // Create mode - show apartment assignment form
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mã căn hộ"
                      name="apartmentCode"
                      value={formData.apartmentCode}
                      onChange={handleApartmentCodeChange}
                      sx={styles.formField}
                      helperText={
                        apartmentSearchLoading 
                          ? "Đang tìm kiếm..." 
                          : apartmentSearchError 
                          ? apartmentSearchError 
                          : apartmentSearchResult 
                          ? `Tìm thấy căn hộ: ${apartmentSearchResult.building} - Tầng ${apartmentSearchResult.floor}`
                          : "Nhập mã căn hộ để tìm kiếm"
                      }
                      error={!!apartmentSearchError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={styles.formField}>
                      <InputLabel>Vai trò</InputLabel>
                      <Select
                        name="isOwner"
                        value={formData.isOwner}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isOwner: e.target.value
                        }))}
                        label="Vai trò"
                        disabled={!apartmentSearchResult || existingOwner}
                      >
                        <MenuItem value={false}>Cư dân</MenuItem>
                        <MenuItem value={true} disabled={existingOwner}>
                          Chủ hộ {existingOwner && "(Đã có chủ hộ)"}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
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
                    value={formData.idNumber}
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
                    value={formData.idNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={styles.formField}
                    helperText="Mật khẩu mặc định giống số căn cước công dân"
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
          >
            {selectedResident ? 'Cập nhật' : 'Thêm mới'}
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
      >
        <DialogTitle sx={{ ...styles.dialogTitle, background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)' }}>
              Xác nhận xóa
          </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Bạn có chắc chắn muốn xóa cư dân này?
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {deleteDialog.residentName}
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

export default ResidentManagement;
