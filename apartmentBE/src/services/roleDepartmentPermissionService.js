const RDPModel = require('../models/roleDepartmentPermissionModel');

const RoleDepartmentPermissionService = {
  assignPermission: async (data) => {
    const { roleId, departmentId, permissionId } = data;
    return RDPModel.assignPermission(roleId, departmentId, permissionId);
  },

  revokePermission: async (data) => {
    const { roleId, departmentId, permissionId } = data;
    return RDPModel.revokePermission(roleId, departmentId, permissionId);
  },

  getPermissionsForRoleInDepartment: async (roleId, departmentId) => {
    return RDPModel.getPermissionsForRoleInDepartment(roleId, departmentId);
  }
};

module.exports = RoleDepartmentPermissionService; 