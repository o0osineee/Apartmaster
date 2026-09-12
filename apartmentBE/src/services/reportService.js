const pool = require('../config/database');

class ReportService {
  // Get all reports
  static async getAllReports() {
    try {
      const query = `
        SELECT r.*, e.fullName as employeeName
        FROM Report r
        LEFT JOIN Employee e ON r.employeeId = e.employeeId
        WHERE r.isDeleted = FALSE
        ORDER BY r.createdAt DESC
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error('Error getting reports: ' + error.message);
    }
  }

  // Lấy dữ liệu tổng hợp cho trang Dashboard
  static async getDashboardData() {
    try {
      const [apartments] = await pool.query('SELECT COUNT(*) as total FROM Apartment WHERE isDeleted = FALSE');
      const [residents] = await pool.query('SELECT COUNT(*) as total FROM Resident WHERE isDeleted = FALSE');
      const [employees] = await pool.query('SELECT COUNT(*) as total FROM Employee WHERE isDeleted = FALSE');
      const [services] = await pool.query('SELECT COUNT(*) as total FROM Service WHERE isDeleted = FALSE');
      const [tasks] = await pool.query('SELECT COUNT(*) as total FROM Task WHERE isDeleted = FALSE');
      const [bills] = await pool.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN isPaid = TRUE THEN money ELSE 0 END) as totalPaid,
          SUM(CASE WHEN isPaid = FALSE THEN money ELSE 0 END) as totalUnpaid,
          SUM(CASE WHEN isPaid = TRUE THEN 1 ELSE 0 END) as paidCount,
          SUM(CASE WHEN isPaid = FALSE THEN 1 ELSE 0 END) as unpaidCount
        FROM Bill
        WHERE isDeleted = FALSE
      `);
      const [monthlyRevenue] = await pool.query(`
        SELECT month, SUM(CASE WHEN isPaid = TRUE THEN money ELSE 0 END) as revenue
        FROM Bill
        WHERE isDeleted = FALSE
        GROUP BY month
        ORDER BY month
      `);
      const [occupancyData] = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM Apartment
        WHERE isDeleted = FALSE
        GROUP BY status
      `);
      const [taskData] = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM Task
        WHERE isDeleted = FALSE
        GROUP BY status
      `);

      return {
        counts: {
          apartments: apartments[0].total,
          residents: residents[0].total,
          employees: employees[0].total,
          bills: bills[0].total,
          services: services[0].total,
          tasks: tasks[0].total
        },
        financial: {
          totalPaid: Number(bills[0].totalPaid) || 0,
          totalUnpaid: Number(bills[0].totalUnpaid) || 0,
          paidCount: bills[0].paidCount || 0,
          unpaidCount: bills[0].unpaidCount || 0
        },
        charts: {
          monthlyRevenue: monthlyRevenue.map(r => ({ month: r.month, revenue: Number(r.revenue) || 0 })),
          occupancyData: occupancyData.map(r => ({ status: r.status, count: r.count })),
          taskData: taskData.map(r => ({ status: r.status, count: r.count }))
        }
      };
    } catch (error) {
      throw new Error('Error getting dashboard data: ' + error.message);
    }
  }

  // Tổng hợp dữ liệu và sinh nội dung báo cáo
  static async generateReportContent(note = '') {
    // Lấy dữ liệu tổng hợp từ các bảng
    const [apartments] = await pool.query('SELECT COUNT(*) as total FROM Apartment WHERE isDeleted = FALSE');
    const [residents] = await pool.query('SELECT COUNT(*) as total FROM Resident WHERE isDeleted = FALSE');
    const [employees] = await pool.query('SELECT COUNT(*) as total FROM Employee WHERE isDeleted = FALSE');
    const [bills] = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN isPaid = TRUE THEN money ELSE 0 END) as totalPaid, SUM(CASE WHEN isPaid = FALSE THEN money ELSE 0 END) as totalUnpaid FROM Bill WHERE isDeleted = FALSE');
    const [tasks] = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "Hoàn thành" THEN 1 ELSE 0 END) as completed FROM Task WHERE isDeleted = FALSE');
    const [services] = await pool.query('SELECT COUNT(*) as total FROM Service WHERE isDeleted = FALSE');

    // Tạo nội dung tổng hợp
    let content = `BÁO CÁO TỔNG HỢP CHUNG CƯ\n\n`;
    content += `1. Thông tin chung:\n`;
    content += `- Tổng số căn hộ: ${apartments[0].total}\n`;
    content += `- Tổng số cư dân: ${residents[0].total}\n`;
    content += `- Tổng số nhân viên: ${employees[0].total}\n`;
    content += `- Tổng số dịch vụ: ${services[0].total}\n`;
    content += `\n2. Tài chính:\n`;
    content += `- Tổng số hóa đơn: ${bills[0].total}\n`;
    content += `- Doanh thu đã thu: ${(bills[0].totalPaid || 0).toLocaleString('vi-VN')}đ\n`;
    content += `- Doanh thu chưa thu: ${(bills[0].totalUnpaid || 0).toLocaleString('vi-VN')}đ\n`;
    content += `\n3. Công việc:\n`;
    content += `- Tổng số công việc: ${tasks[0].total}\n`;
    content += `- Số công việc hoàn thành: ${tasks[0].completed}\n`;
    if (note && note.trim()) {
      content += `\n4. Ghi chú bổ sung:\n${note.trim()}\n`;
    }
    return content;
  }

  // Create new report
  static async createReport(reportData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { employeeId, note } = reportData;
      // Validate employee exists
      const [employee] = await connection.query(
        'SELECT employeeId FROM Employee WHERE employeeId = ? AND isDeleted = FALSE',
        [employeeId]
      );
      if (!employee.length) {
        throw new Error('Nhân viên không tồn tại');
      }
      // Sinh nội dung tổng hợp
      const content = await this.generateReportContent(note);
      // Tạo báo cáo
      const query = `
        INSERT INTO Report (content, employeeId, createdAt, updatedAt)
        VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      const [result] = await connection.query(query, [content, employeeId]);
      const [newReport] = await connection.query(
        'SELECT r.*, e.fullName as employeeName FROM Report r LEFT JOIN Employee e ON r.employeeId = e.employeeId WHERE r.reportId = ?',
        [result.insertId]
      );
      await connection.commit();
      return newReport[0];
    } catch (error) {
      await connection.rollback();
      throw new Error('Error creating report: ' + error.message);
    } finally {
      connection.release();
    }
  }

  // Update report: chỉ cho phép cập nhật ghi chú bổ sung (nếu muốn)
  static async updateReport(id, reportData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { employeeId, note } = reportData;
      // Validate report exists
      const [report] = await connection.query(
        'SELECT reportId FROM Report WHERE reportId = ? AND isDeleted = FALSE',
        [id]
      );
      if (!report.length) {
        throw new Error('Báo cáo không tồn tại');
      }
      // Validate employee exists
      const [employee] = await connection.query(
        'SELECT employeeId FROM Employee WHERE employeeId = ? AND isDeleted = FALSE',
        [employeeId]
      );
      if (!employee.length) {
        throw new Error('Nhân viên không tồn tại');
      }
      // Sinh lại nội dung tổng hợp (có thể cập nhật ghi chú)
      const content = await this.generateReportContent(note);
      const query = `
        UPDATE Report 
        SET content = ?, employeeId = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE reportId = ? AND isDeleted = FALSE
      `;
      await connection.query(query, [content, employeeId, id]);
      const [updatedReport] = await connection.query(
        'SELECT r.*, e.fullName as employeeName FROM Report r LEFT JOIN Employee e ON r.employeeId = e.employeeId WHERE r.reportId = ?',
        [id]
      );
      await connection.commit();
      return updatedReport[0];
    } catch (error) {
      await connection.rollback();
      throw new Error('Error updating report: ' + error.message);
    } finally {
      connection.release();
    }
  }

  // Delete report (soft delete)
  static async deleteReport(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const query = `
        UPDATE Report
        SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP
        WHERE reportId = ? AND isDeleted = FALSE
      `;
      const [result] = await connection.query(query, [id]);
      if (result.affectedRows === 0) {
        throw new Error('Báo cáo không tồn tại');
      }
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error deleting report: ' + error.message);
    } finally {
      connection.release();
    }
  }

  // Get reports by employee ID
  static async getReportsByEmployeeId(employeeId) {
    try {
      const query = `
        SELECT r.*, e.fullName as employeeName
        FROM Report r
        LEFT JOIN Employee e ON r.employeeId = e.employeeId
        WHERE r.employeeId = ? AND r.isDeleted = FALSE
        ORDER BY r.createdAt DESC
      `;
      const [rows] = await pool.query(query, [employeeId]);
      return rows;
    } catch (error) {
      throw new Error('Error getting reports by employee: ' + error.message);
    }
  }
}

module.exports = ReportService; 