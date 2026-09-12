const db = require('../config/database');

const Permission = {
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT permissionId, name, description FROM Permission WHERE isDeleted = FALSE');
      return rows;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT permissionId, name, description FROM Permission WHERE permissionId = ? AND isDeleted = FALSE', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching permission with id ${id}:`, error);
      throw error;
    }
  },

  create: async (permissionData) => {
    const { name, description } = permissionData;
    try {
      const [result] = await db.query(
        'INSERT INTO Permission (name, description) VALUES (?, ?)',
        [name, description]
      );
      return { id: result.insertId, ...permissionData };
    } catch (error) {
      console.error('Error creating permission:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Permission name already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  update: async (id, permissionData) => {
    const { name, description } = permissionData;
    try {
      const [check] = await db.query('SELECT * FROM Permission WHERE permissionId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) {
        return null;
      }
      const [result] = await db.query(
        'UPDATE Permission SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE permissionId = ? AND isDeleted = FALSE',
        [name, description, id]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id, ...permissionData };
    } catch (error) {
      console.error(`Error updating permission with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Permission name already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Permission SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE permissionId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting permission with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = Permission; 