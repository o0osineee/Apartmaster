import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentService from '../../api/services/departmentService';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentService.getAll();
      console.log('Department API response:', response);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return rejectWithValue(error.message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Departments updated in store:', state.items);
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Error in departments reducer:', action.payload);
      });
  },
});

export const { clearError } = departmentSlice.actions;
export default departmentSlice.reducer; 