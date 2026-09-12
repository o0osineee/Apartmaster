import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../api/services/notificationService';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getAllNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách thông báo');
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await notificationService.createNotification(notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo thông báo mới');
    }
  }
);

export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await notificationService.updateNotification(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật thông báo');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa thông báo');
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
  selectedNotification: null,
  filters: {
    status: ''
  }
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
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
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data.push(action.payload);
        state.items.total += 1;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update notification
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.data.findIndex(item => item.notificationId === action.payload.notificationId);
        if (index !== -1) {
          state.items.data[index] = action.payload;
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.items.data = state.items.data.filter(item => item.notificationId !== action.payload);
        state.items.total -= 1;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedNotification, setFilters, clearFilters, clearError } = notificationSlice.actions;

export default notificationSlice.reducer; 