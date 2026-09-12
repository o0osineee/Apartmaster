import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

// Async thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reports');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Fetch reports error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Có lỗi xảy ra khi tải danh sách báo cáo'
      );
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'reports/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reports/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Fetch dashboard data error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Có lỗi xảy ra khi tải dữ liệu dashboard'
      );
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      // Validate required fields
      if (!reportData.employeeId) {
        throw new Error('Vui lòng chọn người tạo báo cáo');
      }
      // Không kiểm tra reportType, title, content nữa
      const response = await axios.post('/api/reports', reportData);
      return response.data.data;
    } catch (error) {
      console.error('Create report error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
        'Có lỗi xảy ra khi tạo báo cáo'
      );
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!data.employeeId) {
        throw new Error('Vui lòng chọn người tạo báo cáo');
      }
      // Không kiểm tra reportType, title, content nữa
      const response = await axios.put(`/api/reports/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update report error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
        'Có lỗi xảy ra khi cập nhật báo cáo'
      );
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/reports/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Delete report error:', error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message ||
        'Có lỗi xảy ra khi xóa báo cáo'
      );
    }
  }
);

export const generatePDF = createAsyncThunk(
  'reports/generatePDF',
  async (data, { rejectWithValue }) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Add title
      doc.setFontSize(20);
      doc.text('Báo cáo tổng hợp', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, pageWidth / 2, 30, { align: 'center' });

      let yPosition = 40;

      // Add summary statistics
      doc.setFontSize(16);
      doc.text('Thống kê tổng quan', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      const stats = [
        ['Tổng số căn hộ', data.counts.apartments],
        ['Tổng số cư dân', data.counts.residents],
        ['Tổng số nhân viên', data.counts.employees],
        ['Tổng số hóa đơn', data.counts.bills],
        ['Tổng số dịch vụ', data.counts.services],
        ['Tổng số công việc', data.counts.tasks],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Chỉ số', 'Giá trị']],
        body: stats,
        theme: 'grid',
        headStyles: { fillColor: [25, 118, 210] },
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Add financial data
      doc.setFontSize(16);
      doc.text('Thông tin tài chính', margin, yPosition);
      yPosition += 10;

      const financialData = [
        ['Tổng doanh thu đã thu', `${data.financial.totalPaid.toLocaleString('vi-VN')}đ`],
        ['Tổng doanh thu chưa thu', `${data.financial.totalUnpaid.toLocaleString('vi-VN')}đ`],
        ['Số hóa đơn đã thanh toán', data.financial.paidCount],
        ['Số hóa đơn chưa thanh toán', data.financial.unpaidCount],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Chỉ số', 'Giá trị']],
        body: financialData,
        theme: 'grid',
        headStyles: { fillColor: [25, 118, 210] },
      });

      yPosition = doc.lastAutoTable.finalY + 20;

      // Add charts
      if (data.charts) {
        // Monthly Revenue Chart
        doc.setFontSize(16);
        doc.text('Doanh thu theo tháng', margin, yPosition);
        yPosition += 10;

        const monthlyData = data.charts.monthlyRevenue.map(item => [
          item.month,
          `${item.revenue.toLocaleString('vi-VN')}đ`
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Tháng', 'Doanh thu']],
          body: monthlyData,
          theme: 'grid',
          headStyles: { fillColor: [25, 118, 210] },
        });

        yPosition = doc.lastAutoTable.finalY + 20;

        // Apartment Occupancy Chart
        doc.setFontSize(16);
        doc.text('Tình trạng căn hộ', margin, yPosition);
        yPosition += 10;

        const occupancyData = data.charts.occupancyData.map(item => [
          item.status,
          item.count
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Trạng thái', 'Số lượng']],
          body: occupancyData,
          theme: 'grid',
          headStyles: { fillColor: [25, 118, 210] },
        });

        yPosition = doc.lastAutoTable.finalY + 20;

        // Task Status Chart
        doc.setFontSize(16);
        doc.text('Tình trạng công việc', margin, yPosition);
        yPosition += 10;

        const taskData = data.charts.taskData.map(item => [
          item.status,
          item.count
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Trạng thái', 'Số lượng']],
          body: taskData,
          theme: 'grid',
          headStyles: { fillColor: [25, 118, 210] },
        });
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Trang ${i} / ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save(`bao-cao-${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('Generate PDF error:', error);
      return rejectWithValue('Có lỗi xảy ra khi tạo file PDF');
    }
  }
);

const initialState = {
  items: [],
  dashboardData: null,
  loading: false,
  error: null,
  success: false,
  pdfGenerating: false
};

const reportSlice = createSlice({
  name: 'reports',
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
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.report);
        state.dashboardData = action.payload.dashboardData;
        state.success = true;
        state.error = null;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update report
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.reportId === action.payload.report.reportId);
        if (index !== -1) {
          state.items[index] = action.payload.report;
        }
        state.dashboardData = action.payload.dashboardData;
        state.success = true;
        state.error = null;
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.items = state.items.filter(item => item.reportId !== deletedId);
        state.success = true;
        state.error = null;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Generate PDF
      .addCase(generatePDF.pending, (state) => {
        state.pdfGenerating = true;
        state.error = null;
      })
      .addCase(generatePDF.fulfilled, (state) => {
        state.pdfGenerating = false;
        state.error = null;
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.pdfGenerating = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = reportSlice.actions;
export default reportSlice.reducer; 