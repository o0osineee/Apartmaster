const db = require('../config/database');

const Complaint = {
  createComplaint: async (complaintData) => {
    const { title, content, residentId, departmentId } = complaintData;
    try {
      const [result] = await db.query(
        'INSERT INTO Complaint (title, content, status, residentId, departmentId) VALUES (?, ?, ?, ?, ?)',
        [title, content, 'Chờ xử lý', residentId, departmentId]
      );
      return { id: result.insertId, ...complaintData, status: 'Chờ xử lý' };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid residentId or departmentId. The specified record does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllComplaints: async () => {
    const [rows] = await db.query(`
      SELECT 
        c.complaintId, c.title, c.content, c.status, 
        c.createdAt, c.updatedAt, c.isDeleted,
        res.residentId, res.fullName as residentName, res.phone as residentPhone,
        d.departmentId, d.name as departmentName
      FROM Complaint c
      LEFT JOIN Resident res ON c.residentId = res.residentId
      LEFT JOIN Department d ON c.departmentId = d.departmentId
      WHERE c.isDeleted = FALSE
      ORDER BY 
        CASE c.status
          WHEN 'Chờ xử lý' THEN 1
          WHEN 'Đã tiếp nhận' THEN 2
          WHEN 'Đang xử lý' THEN 3
          WHEN 'Hoàn thành' THEN 4
          WHEN 'Đã hủy' THEN 5
        END,
        c.createdAt DESC
    `);
    return rows.map(row => ({
      complaintId: row.complaintId,
      title: row.title,
      content: row.content,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.residentId,
        fullName: row.residentName,
        phone: row.residentPhone
      },
      department: row.departmentId ? {
        departmentId: row.departmentId,
        name: row.departmentName
      } : null
    }));
  },

  getComplaintById: async (complaintId) => {
    const [rows] = await db.query(`
      SELECT 
        c.complaintId, c.title, c.content, c.status, 
        c.createdAt, c.updatedAt, c.isDeleted,
        res.residentId, res.fullName as residentName, res.phone as residentPhone,
        d.departmentId, d.name as departmentName
      FROM Complaint c
      LEFT JOIN Resident res ON c.residentId = res.residentId
      LEFT JOIN Department d ON c.departmentId = d.departmentId
      WHERE c.complaintId = ? AND c.isDeleted = FALSE
    `, [complaintId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      complaintId: row.complaintId,
      title: row.title,
      content: row.content,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.residentId,
        fullName: row.residentName,
        phone: row.residentPhone
      },
      department: row.departmentId ? {
        departmentId: row.departmentId,
        name: row.departmentName
      } : null
    };
  },

  updateComplaint: async (complaintId, complaintData) => {
    const { title, content, status, departmentId } = complaintData;
    try {
      const [result] = await db.query(
        'UPDATE Complaint SET title = ?, content = ?, status = ?, departmentId = ?, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ? AND isDeleted = FALSE',
        [title, content, status, departmentId, complaintId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: complaintId, ...complaintData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid departmentId for update.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  deleteComplaint: async (complaintId) => {
    const [result] = await db.query(
      'UPDATE Complaint SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ? AND isDeleted = FALSE',
      [complaintId]
    );
    return result.affectedRows > 0;
  },

  getComplaintsByResident: async (residentId) => {
    const [rows] = await db.query(`
      SELECT 
        c.complaintId, c.title, c.content, c.status, 
        c.createdAt, c.updatedAt,
        d.departmentId, d.name as departmentName
      FROM Complaint c
      LEFT JOIN Department d ON c.departmentId = d.departmentId
      WHERE c.residentId = ? AND c.isDeleted = FALSE
      ORDER BY c.createdAt DESC
    `, [residentId]);
    return rows.map(row => ({
      complaintId: row.complaintId,
      title: row.title,
      content: row.content,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      department: row.departmentId ? {
        departmentId: row.departmentId,
        name: row.departmentName
      } : null
    }));
  },

  getComplaintsByDepartment: async (departmentId) => {
    const [rows] = await db.query(`
      SELECT 
        c.complaintId, c.title, c.content, c.status, 
        c.createdAt, c.updatedAt,
        res.residentId, res.fullName as residentName, res.phone as residentPhone
      FROM Complaint c
      LEFT JOIN Resident res ON c.residentId = res.residentId
      WHERE c.departmentId = ? AND c.isDeleted = FALSE
      ORDER BY c.createdAt DESC
    `, [departmentId]);
    return rows.map(row => ({
      complaintId: row.complaintId,
      title: row.title,
      content: row.content,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.residentId,
        fullName: row.residentName,
        phone: row.residentPhone
      }
    }));
  },

  assignDepartment: async (complaintId, departmentId) => {
    try {
      const [result] = await db.query(
        'UPDATE Complaint SET departmentId = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ? AND isDeleted = FALSE',
        [departmentId, 'Đã tiếp nhận', complaintId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: complaintId, departmentId, status: 'Đã tiếp nhận' };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid departmentId provided.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  updateStatus: async (complaintId, status) => {
    const [result] = await db.query(
      'UPDATE Complaint SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE complaintId = ? AND isDeleted = FALSE',
      [status, complaintId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: complaintId, status };
  }
};

module.exports = Complaint; 