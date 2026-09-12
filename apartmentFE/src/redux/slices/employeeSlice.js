import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../api/services/employeeService';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async () => {
    const response = await employeeService.getAll();
    return response.data;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data) => {
    const response = await employeeService.create(data);
    return response.data;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }) => {
    const response = await employeeService.update(id, data);
    return response.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id) => {
    await employeeService.delete(id);
    return id;
  }
);

export const fetchEmployeesByDepartment = createAsyncThunk(
  'employees/fetchByDepartment',
  async (departmentId) => {
    const response = await employeeService.getEmployeesByDepartment(departmentId);
    return response.data;
  }
);

const initialState = {
  items: [],
  departmentEmployees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
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
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch employee by ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create employee
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.residentId === action.payload.residentId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.residentId !== action.payload);
      })
      // Fetch employees by department
      .addCase(fetchEmployeesByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentEmployees = action.payload;
      })
      .addCase(fetchEmployeesByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedEmployee, clearError, setItems } = employeeSlice.actions;
export default employeeSlice.reducer; 