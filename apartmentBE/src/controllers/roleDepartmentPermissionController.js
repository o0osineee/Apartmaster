const RDPService = require('../services/roleDepartmentPermissionService');

const RoleDepartmentPermissionController = {
  assignPermission: async (req, res, next) => {
    try {
      const result = await RDPService.assignPermission(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  revokePermission: async (req, res, next) => {
    try {
      // Dữ liệu có thể lấy từ req.body hoặc req.query tùy thiết kế API của bạn
      // Ở đây giả định lấy từ req.body giống như assign
      const success = await RDPService.revokePermission(req.body);
      if (!success) {
        const err = new Error('Permission not found for this role/department or already revoked.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Permission revoked successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getPermissionsForRoleInDepartment: async (req, res, next) => {
    try {
      const { roleId, departmentId } = req.params;
      // Validate roleId and departmentId are numbers if not done by a route-level regex
      if (isNaN(parseInt(roleId)) || isNaN(parseInt(departmentId))){
          const err = new Error('roleId and departmentId must be numbers.');
          err.statusCode = 400;
          return next(err);
      }
      const permissions = await RDPService.getPermissionsForRoleInDepartment(parseInt(roleId), parseInt(departmentId));
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = RoleDepartmentPermissionController; 