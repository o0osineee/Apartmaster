const db = require('../config/database');

const Repair = {
  createRepair: async (repairData) => {
    const { title, description, residentId } = repairData;
    try {
      const [result] = await db.query(
        'INSERT INTO Repair (title, description, status, residentId) VALUES (?, ?, ?, ?)',
        [title, description, 'Chờ xử lý', residentId]
      );
      return { id: result.insertId, ...repairData, status: 'Chờ xử lý' };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid residentId. The specified resident does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllRepairs: async () => {
    const [rows] = await db.query(`
      SELECT 
        r.repairId, r.title, r.description, r.status, 
        r.createdAt, r.updatedAt, r.isDeleted,
        res.residentId, res.fullName as residentName, res.phone as residentPhone,
        emp.employeeId, emp.fullName as employeeName, emp.phone as employeePhone
      FROM Repair r
      LEFT JOIN Resident res ON r.residentId = res.residentId
      LEFT JOIN Employee emp ON r.employeeId = emp.employeeId
      WHERE r.isDeleted = FALSE
      ORDER BY 
        CASE r.status
          WHEN 'Chờ xử lý' THEN 1
          WHEN 'Đã tiếp nhận' THEN 2
          WHEN 'Đang xử lý' THEN 3
          WHEN 'Hoàn thành' THEN 4
          WHEN 'Đã hủy' THEN 5
        END,
        r.createdAt DESC
    `);
    return rows.map(row => ({
      repairId: row.repairId,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.residentId,
        fullName: row.residentName,
        phone: row.residentPhone
      },
      employee: row.employeeId ? {
        employeeId: row.employeeId,
        fullName: row.employeeName,
        phone: row.employeePhone
      } : null
    }));
  },

  getRepairById: async (repairId) => {
    const [rows] = await db.query(`
      SELECT 
        r.repairId, r.title, r.description, r.status, 
        r.createdAt, r.updatedAt, r.isDeleted,
        res.residentId, res.fullName as residentName, res.phone as residentPhone,
        emp.employeeId, emp.fullName as employeeName, emp.phone as employeePhone
      FROM Repair r
      LEFT JOIN Resident res ON r.residentId = res.residentId
      LEFT JOIN Employee emp ON r.employeeId = emp.employeeId
      WHERE r.repairId = ? AND r.isDeleted = FALSE
    `, [repairId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      repairId: row.repairId,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.residentId,
        fullName: row.residentName,
        phone: row.residentPhone
      },
      employee: row.employeeId ? {
        employeeId: row.employeeId,
        fullName: row.employeeName,
        phone: row.employeePhone
      } : null
    };
  },

  updateRepair: async (repairId, repairData) => {
    const { title, description, status, employeeId } = repairData;
    try {
      const [result] = await db.query(
        'UPDATE Repair SET title = ?, description = ?, status = ?, employeeId = ?, updatedAt = CURRENT_TIMESTAMP WHERE repairId = ? AND isDeleted = FALSE',
        [title, description, status, employeeId, repairId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: repairId, ...repairData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid employeeId for update.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  deleteRepair: async (repairId) => {
    const [result] = await db.query(
      'UPDATE Repair SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE repairId = ? AND isDeleted = FALSE',
      [repairId]
    );
    return result.affectedRows > 0;
  },

  getRepairsByResident: async (residentId) => {
    const [rows] = await db.query(`
      SELECT 
        r.repairId, r.title, r.description, r.status, 
        r.createdAt, r.updatedAt,
        emp.employeeId, emp.fullName as employeeName, emp.phone as employeePhone
      FROM Repair r
      LEFT JOIN Employee emp ON r.employeeId = emp.employeeId
      WHERE r.residentId = ? AND r.isDeleted = FALSE
      ORDER BY r.createdAt DESC
    `, [residentId]);
    return rows.map(row => ({
      repairId: row.repairId,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: row.employeeId ? {
        employeeId: row.employeeId,
        fullName: row.employeeName,
        phone: row.employeePhone
      } : null
    }));
  },

  getRepairsByEmployee: async (employeeId) => {
    const [rows] = await db.query(`
      SELECT 
        r.repairId, r.title, r.description, r.status, 
        r.createdAt, r.updatedAt,
        res.residentId, res.fullName as residentName, res.phone as residentPhone
      FROM Repair r
      LEFT JOIN Resident res ON r.residentId = res.residentId
      WHERE r.employeeId = ? AND r.isDeleted = FALSE
      ORDER BY r.createdAt DESC
    `, [employeeId]);
    return rows.map(row => ({
      repairId: row.repairId,
      title: row.title,
      description: row.description,
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

  assignEmployee: async (repairId, employeeId) => {
    try {
      const [result] = await db.query(
        'UPDATE Repair SET employeeId = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE repairId = ? AND isDeleted = FALSE',
        [employeeId, 'Đã tiếp nhận', repairId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: repairId, employeeId, status: 'Đã tiếp nhận' };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid employeeId provided.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  updateStatus: async (repairId, status) => {
    const [result] = await db.query(
      'UPDATE Repair SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE repairId = ? AND isDeleted = FALSE',
      [status, repairId]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return { id: repairId, status };
  }
};

module.exports = Repair; 