const db = require('../config/database');

const Report = {
  createReport: async (reportData) => {
    const { content, employeeId } = reportData;
    try {
      const [result] = await db.query(
        'INSERT INTO Report (content, employeeId) VALUES (?, ?)',
        [content, employeeId]
      );
      return { id: result.insertId, ...reportData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid employeeId. The specified employee does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllReports: async () => {
    const [rows] = await db.query(`
      SELECT 
        r.reportId, r.content, 
        r.createdAt, r.updatedAt, r.isDeleted,
        e.employeeId as report_employeeId, e.fullName as employeeFullName, e.username as employeeUsername
      FROM Report r
      JOIN Employee e ON r.employeeId = e.employeeId
      WHERE r.isDeleted = FALSE AND e.isDeleted = FALSE
      ORDER BY r.createdAt DESC
    `);
    return rows.map(row => ({
      reportId: row.reportId,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: {
        employeeId: row.report_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      }
    }));
  },

  getReportById: async (reportId) => {
    const [rows] = await db.query(`
      SELECT 
        r.reportId, r.content, 
        r.createdAt, r.updatedAt, r.isDeleted,
        e.employeeId as report_employeeId, e.fullName as employeeFullName, e.username as employeeUsername
      FROM Report r
      JOIN Employee e ON r.employeeId = e.employeeId
      WHERE r.reportId = ? AND r.isDeleted = FALSE AND e.isDeleted = FALSE
    `, [reportId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      reportId: row.reportId,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: {
        employeeId: row.report_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      }
    };
  },

  updateReport: async (reportId, reportData) => {
    const { content } = reportData; // Only content is typically updatable for a report
    const [result] = await db.query(
      'UPDATE Report SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE reportId = ? AND isDeleted = FALSE',
      [content, reportId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: reportId, content }; // Return the updated part
  },

  deleteReport: async (reportId) => {
    const [result] = await db.query(
      'UPDATE Report SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE reportId = ? AND isDeleted = FALSE',
      [reportId]
    );
    return result.affectedRows > 0;
  },

  getReportsByEmployeeId: async (employeeId) => {
    const [rows] = await db.query(`
      SELECT 
        r.reportId, r.content, 
        r.createdAt, r.updatedAt
      FROM Report r
      WHERE r.employeeId = ? AND r.isDeleted = FALSE
      ORDER BY r.createdAt DESC
    `, [employeeId]);
    // For this specific query, we don't need to join Employee again as employeeId is the filter
    return rows.map(row => ({
        reportId: row.reportId,
        content: row.content,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
        // employeeId is known from the query parameter
    }));
  }
};

module.exports = Report; 