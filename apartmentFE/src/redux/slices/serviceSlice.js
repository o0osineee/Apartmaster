import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from '../../api/services/serviceService';

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceService.getAllServices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchRegisteredResidents = createAsyncThunk(
  'services/fetchRegisteredResidents',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await serviceService.getRegisteredResidents(serviceId);
      return { serviceId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch registered residents');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serviceService.createService(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await serviceService.updateService(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await serviceService.deleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

// New service-resident relationship thunks
export const fetchResidentsByService = createAsyncThunk(
  'services/fetchResidentsByService',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await serviceService.getResidentsByService(serviceId);
      return { serviceId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch residents for service');
    }
  }
);

export const fetchServicesByResident = createAsyncThunk(
  'services/fetchServicesByResident',
  async (residentId, { rejectWithValue }) => {
    try {
      const response = await serviceService.getServicesByResident(residentId);
      return { residentId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services for resident');
    }
  }
);

export const assignServiceToResident = createAsyncThunk(
  'services/assignServiceToResident',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serviceService.assignServiceToResident(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign service to resident');
    }
  }
);

export const updateServiceAssignment = createAsyncThunk(
  'services/updateServiceAssignment',
  async ({ serviceId, residentId, data }, { rejectWithValue }) => {
    try {
      const response = await serviceService.updateServiceAssignment(serviceId, residentId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service assignment');
    }
  }
);

export const removeServiceFromResident = createAsyncThunk(
  'services/removeServiceFromResident',
  async ({ serviceId, residentId }, { rejectWithValue }) => {
    try {
      await serviceService.removeServiceFromResident(serviceId, residentId);
      return { serviceId, residentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove service from resident');
    }
  }
);

const initialState = {
  items: {
    data: [],
    total: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null,
  selectedService: null,
  serviceResidents: {},
  filters: {
    name: '',
    type: ''
  }
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload is an array
        const services = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
        state.items = {
          data: services,
          total: services.length,
          page: 1,
          limit: 10
        };
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.data.findIndex(item => item.serviceId === action.payload.serviceId);
        if (index !== -1) {
          state.items.data[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data = state.items.data.filter(item => item.serviceId !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch residents by service
      .addCase(fetchResidentsByService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentsByService.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceResidents[action.payload.serviceId] = action.payload.data;
      })
      .addCase(fetchResidentsByService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign service to resident
      .addCase(assignServiceToResident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignServiceToResident.fulfilled, (state, action) => {
        state.loading = false;
        const { serviceId } = action.payload;
        if (!state.serviceResidents[serviceId]) {
          state.serviceResidents[serviceId] = [];
        }
        state.serviceResidents[serviceId].push(action.payload);
      })
      .addCase(assignServiceToResident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update service assignment
      .addCase(updateServiceAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const { serviceId, residentId } = action.payload;
        if (state.serviceResidents[serviceId]) {
          const index = state.serviceResidents[serviceId].findIndex(
            item => item.residentId === residentId
          );
          if (index !== -1) {
            state.serviceResidents[serviceId][index] = action.payload;
          }
        }
      })
      .addCase(updateServiceAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove service from resident
      .addCase(removeServiceFromResident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeServiceFromResident.fulfilled, (state, action) => {
        state.loading = false;
        const { serviceId, residentId } = action.payload;
        if (state.serviceResidents[serviceId]) {
          state.serviceResidents[serviceId] = state.serviceResidents[serviceId].filter(
            item => item.residentId !== residentId
          );
        }
      })
      .addCase(removeServiceFromResident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch registered residents
      .addCase(fetchRegisteredResidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredResidents.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceResidents[action.payload.serviceId] = action.payload.data;
      })
      .addCase(fetchRegisteredResidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedService, setFilters, clearFilters, clearError } = serviceSlice.actions;

export default serviceSlice.reducer; 