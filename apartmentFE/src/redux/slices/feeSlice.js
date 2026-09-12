import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feeService from '../../api/services/feeService';

// Async thunks
export const fetchFees = createAsyncThunk(
  'fees/fetchFees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await feeService.getAllFees();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createFee = createAsyncThunk(
  'fees/createFee',
  async (feeData, { rejectWithValue }) => {
    try {
      const response = await feeService.createFee(feeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFee = createAsyncThunk(
  'fees/updateFee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await feeService.updateFee(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFee = createAsyncThunk(
  'fees/deleteFee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await feeService.deleteFee(id);
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
  selectedFee: null,
  filters: {
    type: 'all',
    search: '',
  },
};

const feeSlice = createSlice({
  name: 'fees',
  initialState,
  reducers: {
    setSelectedFee: (state, action) => {
      state.selectedFee = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        search: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch fees
      .addCase(fetchFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create fee
      .addCase(createFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data.push(action.payload.data);
      })
      .addCase(createFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update fee
      .addCase(updateFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.data.findIndex(fee => fee.feeId === action.payload.data.feeId);
        if (index !== -1) {
          state.items.data[index] = action.payload.data;
        }
      })
      .addCase(updateFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete fee
      .addCase(deleteFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFee.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data = state.items.data.filter(fee => fee.feeId !== action.payload.data.feeId);
      })
      .addCase(deleteFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedFee, setFilters, clearFilters, clearError } = feeSlice.actions;
export default feeSlice.reducer; 