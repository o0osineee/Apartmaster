import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from '../../api/services/maintenanceService';


// Async thunks
export const fetchMaintenances = createAsyncThunk(
  'maintenances/fetchMaintenances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await maintenanceService.getAllMaintenances();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createMaintenance = createAsyncThunk(
  'maintenances/createMaintenance',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await maintenanceService.createMaintenance(maintenanceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateMaintenance = createAsyncThunk(
  'maintenances/updateMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await maintenanceService.updateMaintenance(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteMaintenance = createAsyncThunk(
  'maintenances/deleteMaintenance',
  async (id, { rejectWithValue }) => {
    try {
      const response = await maintenanceService.deleteMaintenance(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  items: { success: true, data: [] },
  loading: false,
  error: null,
  selectedMaintenance: null,
  filters: {
    status: 'all',
    search: '',
  },
};


const maintenanceSlice = createSlice({
  name: 'maintenances',
  initialState,
  reducers: {
    setSelectedMaintenance: (state, action) => {
      state.selectedMaintenance = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        search: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch maintenances
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create maintenance
      .addCase(createMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data.push(action.payload.data);
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update maintenance
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.data.findIndex(maintenance => maintenance.maintenanceId === action.payload.data.maintenanceId);
        if (index !== -1) {
          state.items.data[index] = action.payload.data;
        }
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete maintenance
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const maintenanceId = action.meta.arg;
        state.items.data = state.items.data.filter(maintenance => maintenance.maintenanceId !== maintenanceId);
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { setSelectedMaintenance, setFilters, clearFilters, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;


