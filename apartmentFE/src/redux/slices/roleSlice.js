import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roleService from '../../api/services/roleService';

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getAll();
      console.log('Role API response:', response);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching roles:', error);
      return rejectWithValue(error.message);
    }
  }
);

const roleSlice = createSlice({
  name: 'roles',
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
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Roles updated in store:', state.items);
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Error in roles reducer:', action.payload);
      });
  },
});

export const { clearError } = roleSlice.actions;
export default roleSlice.reducer; 