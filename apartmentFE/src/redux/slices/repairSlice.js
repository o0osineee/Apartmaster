import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import repairService from '../../api/services/repairService';

// Async thunks
export const fetchRepairs = createAsyncThunk(
  'repairs/fetchRepairs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await repairService.getAllRepairs();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRepair = createAsyncThunk(
  'repairs/createRepair',
  async (repairData, { rejectWithValue }) => {
    try {
      const response = await repairService.createRepair(repairData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRepair = createAsyncThunk(
  'repairs/updateRepair',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await repairService.updateRepair(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRepair = createAsyncThunk(
  'repairs/deleteRepair',
  async (id, { rejectWithValue }) => {
    try {
      await repairService.deleteRepair(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const repairSlice = createSlice({
  name: 'repairs',
  initialState,
  reducers: {
    clearRepairs: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch repairs
      .addCase(fetchRepairs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepairs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRepairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create repair
      .addCase(createRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRepair.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createRepair.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update repair
      .addCase(updateRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRepair.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.repairId === action.payload.repairId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateRepair.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete repair
      .addCase(deleteRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRepair.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.repairId !== action.payload);
      })
      .addCase(deleteRepair.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRepairs } = repairSlice.actions;
export default repairSlice.reducer; 