const db = require('../config/database');

const FeeModel = {
  // Lấy tất cả phí
  async getAll() {
    try {
      const query = `
        SELECT 
          feeId, name, type, price,
          createdAt, updatedAt
        FROM Fee
        WHERE isDeleted = FALSE
        ORDER BY createdAt DESC
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error fetching fees:', error);
      throw error;
    }
  },

  // Lấy thông tin một phí theo ID
  async getById(id) {
    try {
      const query = `
        SELECT 
          feeId, name, type, price,
          createdAt, updatedAt
        FROM Fee
        WHERE feeId = ? AND isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error(`Error fetching fee with id ${id}:`, error);
      throw error;
    }
  },

  // Tìm phí theo tên
  async findByName(name) {
    try {
      const query = `
        SELECT * FROM Fee 
        WHERE name = ? AND isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [name]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding fee by name:', error);
      throw error;
    }
  },

  // Tạo phí mới
  async create(feeData) {
    try {
      const { name, type, price } = feeData;
      const query = `
        INSERT INTO Fee (name, type, price)
        VALUES (?, ?, ?)
      `;
      const [result] = await db.query(query, [name, type, price]);
      return { feeId: result.insertId, ...feeData };
    } catch (error) {
      console.error('Error creating fee:', error);
      throw error;
    }
  },

  // Cập nhật thông tin phí
  async update(id, feeData) {
    try {
      const { name, type, price } = feeData;
      const query = `
        UPDATE Fee 
        SET name = ?, type = ?, price = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE feeId = ? AND isDeleted = FALSE
      `;
      const [result] = await db.query(query, [name, type, price, id]);
      if (result.affectedRows === 0) return null;
      return { feeId: id, ...feeData };
    } catch (error) {
      console.error(`Error updating fee with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa phí (soft delete)
  async softDelete(id) {
    try {
      const query = `
        UPDATE Fee 
        SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP
        WHERE feeId = ? AND isDeleted = FALSE
      `;
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error soft deleting fee with id ${id}:`, error);
      throw error;
    }
  }
};

module.exports = FeeModel; 