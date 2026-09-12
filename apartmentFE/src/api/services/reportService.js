import api from '../config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

const reportService = {
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  deleteReport: async (id) => {
    await api.delete(`/reports/${id}`);
    return id;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  generatePDF: async (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

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
      ['Tổng số căn hộ', data.apartments?.length || 0],
      ['Tổng số cư dân', data.residents?.length || 0],
      ['Tổng số nhân viên', data.employees?.length || 0],
      ['Tổng số hóa đơn', data.bills?.length || 0],
      ['Tổng số khiếu nại', data.complaints?.length || 0],
      ['Tổng số công việc', data.tasks?.length || 0],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Chỉ số', 'Giá trị']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [25, 118, 210] },
    });

    yPosition = doc.lastAutoTable.finalY + 20;

    // Add charts
    if (data.charts) {
      Object.entries(data.charts).forEach(([title, chartData]) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text(title, margin, yPosition);
        yPosition += 10;

        // Create canvas for chart
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        new Chart(ctx, chartData);

        // Add chart image to PDF
        const chartImage = canvas.toDataURL('image/png');
        doc.addImage(chartImage, 'PNG', margin, yPosition, contentWidth, 100);
        yPosition += 120;
      });
    }

    // Add detailed tables
    if (data.tables) {
      Object.entries(data.tables).forEach(([title, tableData]) => {
        if (yPosition > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text(title, margin, yPosition);
        yPosition += 10;

        autoTable(doc, {
          startY: yPosition,
          head: [tableData.headers],
          body: tableData.rows,
          theme: 'grid',
          headStyles: { fillColor: [25, 118, 210] },
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      });
    }

    return doc;
  }
};

export default reportService; 