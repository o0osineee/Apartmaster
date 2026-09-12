const db = require('../config/database');

const Maintenance = {
  createMaintenance: async (maintenanceData) => {
    const { title, description, time, status, employeeId } = maintenanceData;
    try {
      const [result] = await db.query(
        'INSERT INTO Maintenance (title, description, time, status, employeeId) VALUES (?, ?, ?, ?, ?)',
        [title, description, time, status, employeeId]
      );
      return { id: result.insertId, ...maintenanceData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid employeeId. The specified employee does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllMaintenances: async () => {
    const [rows] = await db.query(`
      SELECT 
        m.maintenanceId, m.title, m.description, m.time, m.status,
        m.createdAt, m.updatedAt, m.isDeleted,
        emp.employeeId as maintenance_employeeId, emp.fullName as employeeFullName, emp.username as employeeUsername
      FROM Maintenance m
      JOIN Employee emp ON m.employeeId = emp.employeeId
      WHERE m.isDeleted = FALSE AND emp.isDeleted = FALSE
      ORDER BY m.time DESC, m.createdAt DESC
    `);
    return rows.map(row => ({
      maintenanceId: row.maintenanceId,
      title: row.title,
      description: row.description,
      time: row.time,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: {
        employeeId: row.maintenance_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      }
    }));
  },

  getMaintenanceById: async (maintenanceId) => {
    const [rows] = await db.query(`
      SELECT 
        m.maintenanceId, m.title, m.description, m.time, m.status,
        m.createdAt, m.updatedAt, m.isDeleted,
        emp.employeeId as maintenance_employeeId, emp.fullName as employeeFullName, emp.username as employeeUsername
      FROM Maintenance m
      JOIN Employee emp ON m.employeeId = emp.employeeId
      WHERE m.maintenanceId = ? AND m.isDeleted = FALSE AND emp.isDeleted = FALSE
    `, [maintenanceId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      maintenanceId: row.maintenanceId,
      title: row.title,
      description: row.description,
      time: row.time,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      employee: {
        employeeId: row.maintenance_employeeId,
        fullName: row.employeeFullName,
        username: row.employeeUsername
      }
    };
  },

  updateMaintenance: async (maintenanceId, maintenanceData) => {
    const { title, description, time, status, employeeId } = maintenanceData;
    try {
      const [result] = await db.query(
        'UPDATE Maintenance SET title = ?, description = ?, time = ?, status = ?, employeeId = ?, updatedAt = CURRENT_TIMESTAMP WHERE maintenanceId = ? AND isDeleted = FALSE',
        [title, description, time, status, employeeId, maintenanceId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: maintenanceId, ...maintenanceData };
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid employeeId for update.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  deleteMaintenance: async (maintenanceId) => {
    const [result] = await db.query(
      'UPDATE Maintenance SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE maintenanceId = ? AND isDeleted = FALSE',
      [maintenanceId]
    );
    return result.affectedRows > 0;
  },

  getMaintenancesByEmployee: async (employeeId) => {
    const [rows] = await db.query(`
      SELECT 
        m.maintenanceId, m.title, m.description, m.time, m.status,
        m.createdAt, m.updatedAt
      FROM Maintenance m
      WHERE m.employeeId = ? AND m.isDeleted = FALSE
      ORDER BY m.time DESC, m.createdAt DESC
    `, [employeeId]);
    return rows; // These rows won't have employee details as it's redundant for this query
  }
};

module.exports = Maintenance; 