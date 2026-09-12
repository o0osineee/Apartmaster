const db = require('../config/database');

const Vehicle = {
  createVehicle: async (vehicleData) => {
    const { licensePlate, type, residentId } = vehicleData;
    try {
      const [result] = await db.query(
        'INSERT INTO Vehicle (licensePlate, type, residentId) VALUES (?, ?, ?)',
        [licensePlate, type, residentId]
      );
      return { id: result.insertId, ...vehicleData };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Vehicle with this license plate already exists.'); err.statusCode = 409; throw err; }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid residentId. The specified resident does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  getAllVehicles: async () => {
    const [rows] = await db.query(`
      SELECT 
        v.vehicleId, v.licensePlate, v.type, v.createdAt, v.updatedAt, v.isDeleted,
        r.residentId as vehicle_residentId, r.fullName as residentFullName, r.username as residentUsername
      FROM Vehicle v
      JOIN Resident r ON v.residentId = r.residentId
      WHERE v.isDeleted = FALSE AND r.isDeleted = FALSE
    `);
    return rows.map(row => ({
      vehicleId: row.vehicleId,
      licensePlate: row.licensePlate,
      type: row.type,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.vehicle_residentId,
        fullName: row.residentFullName,
        username: row.residentUsername
      }
    }));
  },

  getVehicleById: async (vehicleId) => {
    const [rows] = await db.query(`
      SELECT 
        v.vehicleId, v.licensePlate, v.type, v.createdAt, v.updatedAt, v.isDeleted,
        r.residentId as vehicle_residentId, r.fullName as residentFullName, r.username as residentUsername
      FROM Vehicle v
      JOIN Resident r ON v.residentId = r.residentId
      WHERE v.vehicleId = ? AND v.isDeleted = FALSE AND r.isDeleted = FALSE
    `, [vehicleId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      vehicleId: row.vehicleId,
      licensePlate: row.licensePlate,
      type: row.type,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      resident: {
        residentId: row.vehicle_residentId,
        fullName: row.residentFullName,
        username: row.residentUsername
      }
    };
  },
  
  getVehiclesByResidentId: async (residentId) => {
    const [rows] = await db.query(`
      SELECT 
        v.vehicleId, v.licensePlate, v.type, v.createdAt, v.updatedAt
      FROM Vehicle v
      WHERE v.residentId = ? AND v.isDeleted = FALSE
      ORDER BY v.createdAt DESC
    `, [residentId]);
    return rows;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const { licensePlate, type, residentId } = vehicleData;
    try {
      const [result] = await db.query(
        'UPDATE Vehicle SET licensePlate = ?, type = ?, residentId = ?, updatedAt = CURRENT_TIMESTAMP WHERE vehicleId = ? AND isDeleted = FALSE',
        [licensePlate, type, residentId, vehicleId]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id: vehicleId, ...vehicleData };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Cannot update to a license plate that already exists for another vehicle.'); err.statusCode = 409; throw err; }
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid residentId for update. The specified resident does not exist.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  deleteVehicle: async (vehicleId) => {
    const [result] = await db.query(
      'UPDATE Vehicle SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE vehicleId = ? AND isDeleted = FALSE',
      [vehicleId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Vehicle; 