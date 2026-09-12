const db = require('../config/database');

const Apartment = {
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT 
          a.apartmentId, 
          a.code, 
          a.building, 
          a.floor, 
          a.area, 
          a.status, 
          a.contract
        FROM Apartment a
        WHERE a.isDeleted = FALSE
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          a.apartmentId, 
          a.code, 
          a.building, 
          a.floor, 
          a.area, 
          a.status, 
          a.contract
        FROM Apartment a
        WHERE a.apartmentId = ? AND a.isDeleted = FALSE
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching apartment with id ${id}:`, error);
      throw error;
    }
  },

  create: async (apartmentData) => {
    const { code, building, floor, area, status, contract } = apartmentData;
    try {
      // Check if apartment with same code exists but is soft deleted
      const [existingApartment] = await db.query(
        'SELECT apartmentId FROM Apartment WHERE code = ? AND isDeleted = TRUE',
        [code]
      );

      if (existingApartment.length > 0) {
        // Update the soft deleted apartment instead of creating new one
        const [result] = await db.query(
          'UPDATE Apartment SET building = ?, floor = ?, area = ?, status = ?, contract = ?, isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE apartmentId = ?',
          [building, floor, area, status, contract, existingApartment[0].apartmentId]
        );
        return { id: existingApartment[0].apartmentId, ...apartmentData };
      }

      // If no soft deleted apartment exists, create new one
      const [result] = await db.query(
        'INSERT INTO Apartment (code, building, floor, area, status, contract) VALUES (?, ?, ?, ?, ?, ?)',
        [code, building, floor, area, status, contract]
      );
      return { id: result.insertId, ...apartmentData };
    } catch (error) {
      console.error('Error creating apartment:', error);
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('code')) {
        { const err = new Error('Apartment code already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  update: async (id, apartmentData) => {
    const { code, building, floor, area, status, contract } = apartmentData;
    try {
      const [check] = await db.query('SELECT * FROM Apartment WHERE apartmentId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) return null;

      const [result] = await db.query(
        'UPDATE Apartment SET code = ?, building = ?, floor = ?, area = ?, status = ?, contract = ?, updatedAt = CURRENT_TIMESTAMP WHERE apartmentId = ? AND isDeleted = FALSE',
        [code, building, floor, area, status, contract, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, ...apartmentData };
    } catch (error) {
      console.error(`Error updating apartment with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('code')) {
        { const err = new Error('Apartment code already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Apartment SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE apartmentId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting apartment with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = Apartment; 