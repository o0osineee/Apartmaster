import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/bills');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách hóa đơn');
    }
  }
);

export const calculateBill = createAsyncThunk(
  'bills/calculateBill',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bills/calculate', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi tính hóa đơn');
    }
  }
);

export const updateBillPayment = createAsyncThunk(
  'bills/updateBillPayment',
  async ({ billId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/bills/${billId}/payment`, paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
    }
  }
);

export const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (billId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/bills/${billId}`);
      return billId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra khi xóa hóa đơn');
    }
  }
);

const initialState = {
  bills: [],
  loading: false,
  error: null,
  success: false
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Calculate bill
      .addCase(calculateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bills = [action.payload, ...state.bills];
      })
      .addCase(calculateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update bill payment
      .addCase(updateBillPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bills = state.bills.map(bill =>
          bill.billId === action.payload.billId ? action.payload : bill
        );
      })
      .addCase(updateBillPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete bill
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bills = state.bills.filter(bill => bill.billId !== action.payload);
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = billSlice.actions;
export default billSlice.reducer; 