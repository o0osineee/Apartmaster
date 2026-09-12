import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import residentService from '../../api/services/residentService';

// Async thunks
export const fetchResidents = createAsyncThunk(
  'residents/fetchAll',
  async () => {
    const response = await residentService.getAll();
    return response.data;
  }
);

export const fetchResidentById = createAsyncThunk(
  'residents/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await residentService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createResident = createAsyncThunk(
  'residents/create',
  async (data) => {
    const response = await residentService.create(data);
    return response.data;
  }
);
export const findResidentByIdNumber = createAsyncThunk(
  'residents/findByIdNumber',
  async (idNumber) => {
    const response = await residentService.findByIdNumber(idNumber);
    return response.data;
  }
);
export const updateResident = createAsyncThunk(
  'residents/update',
  async ({ id, data }) => {
    const response = await residentService.update(id, data);
    return response.data;
  }
);

export const deleteResident = createAsyncThunk(
  'residents/delete',
  async (id) => {
    await residentService.delete(id);
    return id;
  }
);

export const fetchResidentsByApartment = createAsyncThunk(
  'residents/fetchByApartment',
  async (apartmentId) => {
    const response = await residentService.getResidentsByApartment(apartmentId);
    return response.data;
  }
);

const initialState = {
  items: [],
  apartmentResidents: [],
  selectedResident: null,
  loading: false,
  error: null,
};

const residentSlice = createSlice({
  name: 'residents',
  initialState,
  reducers: {
    clearSelectedResident: (state) => {
      state.selectedResident = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all residents
      .addCase(fetchResidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchResidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch resident by ID
      .addCase(fetchResidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedResident = action.payload;
      })
      .addCase(fetchResidentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create resident
      .addCase(createResident.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update resident
      .addCase(updateResident.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.residentId === action.payload.residentId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete resident
      .addCase(deleteResident.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.residentId !== action.payload);
      })
      // Fetch residents by apartment
      .addCase(fetchResidentsByApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentsByApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartmentResidents = action.payload;
      })
      .addCase(fetchResidentsByApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedResident, clearError, setItems } = residentSlice.actions;
export default residentSlice.reducer; 