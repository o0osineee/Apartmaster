const db = require('../config/database');

const Department = {
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT departmentId, name, description FROM Department WHERE isDeleted = FALSE');
      return rows;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT departmentId, name, description FROM Department WHERE departmentId = ? AND isDeleted = FALSE', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error fetching department with id ${id}:`, error);
      throw error;
    }
  },

  create: async (departmentData) => {
    const { name, description } = departmentData;
    try {
      const [result] = await db.query(
        'INSERT INTO Department (name, description) VALUES (?, ?)',
        [name, description]
      );
      return { id: result.insertId, ...departmentData };
    } catch (error) {
      console.error('Error creating department:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Department name already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  update: async (id, departmentData) => {
    const { name, description } = departmentData;
    try {
      const [check] = await db.query('SELECT * FROM Department WHERE departmentId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) {
        return null;
      }
      const [result] = await db.query(
        'UPDATE Department SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE departmentId = ? AND isDeleted = FALSE',
        [name, description, id]
      );
      if (result.affectedRows === 0) {
        return null;
      }
      return { id, ...departmentData };
    } catch (error) {
      console.error(`Error updating department with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Department name already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Department SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE departmentId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting department with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = Department; 