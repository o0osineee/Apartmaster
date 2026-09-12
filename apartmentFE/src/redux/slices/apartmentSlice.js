import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apartmentService } from '../../api/services/apartmentService';

// Async thunks
export const fetchApartments = createAsyncThunk(
  'apartments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apartmentService.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchApartmentById = createAsyncThunk(
  'apartments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apartmentService.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createApartment = createAsyncThunk(
  'apartments/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apartmentService.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateApartment = createAsyncThunk(
  'apartments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apartmentService.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteApartment = createAsyncThunk(
  'apartments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apartmentService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null
};

const apartmentSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchApartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchApartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.apartmentId === action.payload.apartmentId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.apartmentId !== action.payload);
      })
      .addCase(deleteApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSelectedItem } = apartmentSlice.actions;
export default apartmentSlice.reducer; 