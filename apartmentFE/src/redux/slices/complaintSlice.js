import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import complaintService from '../../api/services/complaintService';

// Async thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await complaintService.getAllComplaints();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách khiếu nại');
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await complaintService.createComplaint(complaintData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo khiếu nại mới');
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/updateComplaint',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await complaintService.updateComplaint(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật khiếu nại');
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  'complaints/deleteComplaint',
  async (id, { rejectWithValue }) => {
    try {
      await complaintService.deleteComplaint(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khiếu nại');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedComplaint: null,
  filters: {
    status: '',
    departmentId: '',
    employeeId: ''
  }
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setSelectedComplaint: (state, action) => {
      state.selectedComplaint = action.payload;
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
      // Fetch complaints
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update complaint
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.complaintId === action.payload.data.complaintId);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete complaint
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.complaintId !== action.payload);
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedComplaint, setFilters, clearFilters, clearError } = complaintSlice.actions;

export default complaintSlice.reducer;
 