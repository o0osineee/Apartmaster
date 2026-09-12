const PermissionService = require('../services/permissionService');

const PermissionController = {
  getAllPermissions: async (req, res) => {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch permissions', error: error.message });
    }
  },

  getPermissionById: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ success: false, message: 'Permission ID must be a number' });
      }
      const permission = await PermissionService.getPermissionById(id);
      if (!permission) {
        return res.status(404).json({ success: false, message: 'Permission not found' });
      }
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch permission', error: error.message });
    }
  },

  createPermission: async (req, res) => {
    try {
      const permissionData = req.body;
      const newPermission = await PermissionService.createPermission(permissionData);
      res.status(201).json({ success: true, data: newPermission, message: 'Permission created successfully' });
    } catch (error) {
      if (error.message === 'Permission name already exists.') {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Failed to create permission', error: error.message });
    }
  },

  updatePermission: async (req, res) => {
    try {
      const { id } = req.params;
      const permissionData = req.body;
      const updatedPermission = await PermissionService.updatePermission(id, permissionData);
      if (!updatedPermission) {
        return res.status(404).json({ success: false, message: 'Permission not found or not updated' });
      }
      res.status(200).json({ success: true, data: updatedPermission, message: 'Permission updated successfully' });
    } catch (error) {
      if (error.message === 'Permission name already exists.') {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Failed to update permission', error: error.message });
    }
  },

  deletePermission: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await PermissionService.deletePermission(id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Permission not found or already deleted' });
      }
      res.status(200).json({ success: true, message: 'Permission deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete permission', error: error.message });
    }
  }
};

module.exports = PermissionController; 