const db = require('../config/database');

const RoleDepartmentPermission = {
  assignPermission: async (roleId, departmentId, permissionId) => {
    try {
      // Kiểm tra xem bản ghi đã tồn tại và isDeleted = TRUE không, nếu có thì cập nhật isDeleted = FALSE
      const [existing] = await db.query(
        'SELECT * FROM Role_Department_Permission WHERE roleId = ? AND departmentId = ? AND permissionId = ?',
        [roleId, departmentId, permissionId]
      );

      if (existing.length > 0) {
        if (existing[0].isDeleted) {
          // Cập nhật isDeleted = FALSE và updatedAt
          await db.query(
            'UPDATE Role_Department_Permission SET isDeleted = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE roleId = ? AND departmentId = ? AND permissionId = ?',
            [roleId, departmentId, permissionId]
          );
          return { roleId, departmentId, permissionId, message: 'Permission re-assigned successfully.' };
        } else {
          // Đã tồn tại và không bị xóa, không cần làm gì hoặc báo lỗi tùy logic
          { const err = new Error('Permission already assigned to this role in this department.'); err.statusCode = 409; throw err; }
        }
      } else {
        // Tạo mới
        await db.query(
          'INSERT INTO Role_Department_Permission (roleId, departmentId, permissionId) VALUES (?, ?, ?)',
          [roleId, departmentId, permissionId]
        );
        return { roleId, departmentId, permissionId, message: 'Permission assigned successfully.' };
      }
    } catch (error) {
      console.error('Error assigning permission:', error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        { const err = new Error('Invalid roleId, departmentId, or permissionId provided.'); err.statusCode = 400; throw err; }
      }
      throw error;
    }
  },

  revokePermission: async (roleId, departmentId, permissionId) => {
    try {
      const [result] = await db.query(
        'UPDATE Role_Department_Permission SET isDeleted = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE roleId = ? AND departmentId = ? AND permissionId = ? AND isDeleted = FALSE',
        [roleId, departmentId, permissionId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error revoking permission:', error);
      throw error;
    }
  },

  getPermissionsForRoleInDepartment: async (roleId, departmentId) => {
    try {
      const query = `
        SELECT p.permissionId, p.name, p.description
        FROM Permission p
        JOIN Role_Department_Permission rdp ON p.permissionId = rdp.permissionId
        WHERE rdp.roleId = ? AND rdp.departmentId = ? AND rdp.isDeleted = FALSE AND p.isDeleted = FALSE
      `;
      const [rows] = await db.query(query, [roleId, departmentId]);
      return rows;
    } catch (error) {
      console.error('Error fetching permissions for role in department:', error);
      throw error;
    }
  }
};

module.exports = RoleDepartmentPermission; 