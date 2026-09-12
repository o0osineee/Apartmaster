const db = require('../config/database');

const Role = {
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT roleId, name, description FROM Role WHERE isDeleted = FALSE');
      return rows;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error; // Ném lỗi để service có thể bắt và xử lý
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT roleId, name, description FROM Role WHERE roleId = ? AND isDeleted = FALSE', [id]);
      return rows[0]; // Trả về role đầu tiên tìm thấy hoặc undefined
    } catch (error) {
      console.error(`Error fetching role with id ${id}:`, error);
      throw error;
    }
  },

  create: async (roleData) => {
    const { name, description } = roleData;
    try {
      const [result] = await db.query(
        'INSERT INTO Role (name, description) VALUES (?, ?)',
        [name, description]
      );
      return { id: result.insertId, ...roleData }; // Trả về role mới tạo với ID
    } catch (error) {
      console.error('Error creating role:', error);
      // Kiểm tra lỗi trùng lặp UNIQUE constraint cho `name`
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Role name already exists.'); err.statusCode = 409; throw err; } // Ném lỗi cụ thể hơn
      }
      throw error;
    }
  },

  update: async (id, roleData) => {
    const { name, description } = roleData;
    try {
      // Kiểm tra xem role có tồn tại không trước khi cập nhật (tùy chọn, nhưng tốt)
      const [check] = await db.query('SELECT * FROM Role WHERE roleId = ? AND isDeleted = FALSE', [id]);
      if (check.length === 0) {
        return null; // Hoặc ném lỗi tùy theo cách bạn muốn xử lý
      }

      const [result] = await db.query(
        'UPDATE Role SET name = ?, description = ?, updatedAt = CURRENT_TIMESTAMP WHERE roleId = ? AND isDeleted = FALSE',
        [name, description, id]
      );
      if (result.affectedRows === 0) {
        return null; // Không có role nào được cập nhật (có thể đã bị xóa hoặc ID sai)
      }
      return { id, ...roleData };
    } catch (error) {
      console.error(`Error updating role with id ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
        { const err = new Error('Role name already exists.'); err.statusCode = 409; throw err; }
      }
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const [result] = await db.query(
        'UPDATE Role SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE roleId = ? AND isDeleted = FALSE',
        [id]
      );
      return result.affectedRows > 0; // Trả về true nếu có dòng nào được cập nhật (xóa thành công)
    } catch (error) {
      console.error(`Error soft deleting role with id ${id}:`, error);
      throw error;
    }
  },

  // Thêm các hàm khác ở đây sau này (ví dụ: delete)
};

module.exports = Role; 