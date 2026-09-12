const RoleModel = require('../models/roleModel');

const RoleService = {
  getAllRoles: async () => {
    try {
      const roles = await RoleModel.getAll();
      return roles;
    } catch (error) {
      // Ở đây có thể thêm logging hoặc xử lý lỗi cụ thể cho service
      console.error('Service error fetching roles:', error);
      throw error; // Ném lại lỗi để controller xử lý
    }
  },

  getRoleById: async (id) => {
    try {
      const role = await RoleModel.getById(id);
      return role;
    } catch (error) {
      console.error(`Service error fetching role with id ${id}:`, error);
      throw error;
    }
  },

  createRole: async (roleData) => {
    try {
      // Ở đây có thể thêm logic validate hoặc xử lý dữ liệu trước khi tạo
      const newRole = await RoleModel.create(roleData);
      return newRole;
    } catch (error) {
      console.error('Service error creating role:', error);
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      const updatedRole = await RoleModel.update(id, roleData);
      return updatedRole;
    } catch (error) {
      console.error(`Service error updating role with id ${id}:`, error);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const success = await RoleModel.softDelete(id);
      return success;
    } catch (error) {
      console.error(`Service error deleting role with id ${id}:`, error);
      throw error;
    }
  },

  // Thêm các service methods khác ở đây
};

module.exports = RoleService; 