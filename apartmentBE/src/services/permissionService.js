const PermissionModel = require('../models/permissionModel');
const db = require('../config/database');

const PermissionService = {
  getAllPermissions: async () => {
    return PermissionModel.getAll();
  },

  getPermissionById: async (id) => {
    return PermissionModel.getById(id);
  },

  createPermission: async (permissionData) => {
    return PermissionModel.create(permissionData);
  },

  updatePermission: async (id, permissionData) => {
    return PermissionModel.update(id, permissionData);
  },

  deletePermission: async (id) => {
    return PermissionModel.softDelete(id);
  },

  // Lấy danh sách quyền của một tài khoản dựa trên roleId và departmentId
  async getUserPermissions(roleId, departmentId) {
    try {
      const [permissions] = await db.query(`
        SELECT 
          p.permissionId,
          p.name as permissionName,
          p.description as permissionDescription,
          r.name as roleName,
          d.name as departmentName
        FROM Role_Department_Permission rdp
        JOIN Permission p ON rdp.permissionId = p.permissionId
        JOIN Role r ON rdp.roleId = r.roleId
        JOIN Department d ON rdp.departmentId = d.departmentId
        WHERE rdp.roleId = ? 
          AND rdp.departmentId = ?
          AND rdp.isDeleted = FALSE
          AND p.isDeleted = FALSE
          AND r.isDeleted = FALSE
          AND d.isDeleted = FALSE
      `, [roleId, departmentId]);

      return permissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      throw error;
    }
  },

  // Kiểm tra xem user có quyền thực hiện một hành động không
  async hasPermission(roleId, departmentId, permissionName) {
    try {
      const [permissions] = await db.query(`
        SELECT COUNT(*) as count
        FROM Role_Department_Permission rdp
        JOIN Permission p ON rdp.permissionId = p.permissionId
        WHERE rdp.roleId = ? 
          AND rdp.departmentId = ?
          AND p.name = ?
          AND rdp.isDeleted = FALSE
          AND p.isDeleted = FALSE
      `, [roleId, departmentId, permissionName]);

      return permissions[0].count > 0;
    } catch (error) {
      console.error('Error checking permission:', error);
      throw error;
    }
  }
};

module.exports = PermissionService; 