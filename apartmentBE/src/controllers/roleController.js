const RoleService = require('../services/roleService');

const RoleController = {
  getAllRoles: async (req, res) => {
    try {
      const roles = await RoleService.getAllRoles();
      res.status(200).json({ success: true, data: roles });
    } catch (error) {
      console.error('Controller error fetching roles:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch roles', error: error.message });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ success: false, message: 'Role ID must be a number' });
      }
      const role = await RoleService.getRoleById(id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      console.error(`Controller error fetching role with id ${req.params.id}:`, error);
      res.status(500).json({ success: false, message: 'Failed to fetch role', error: error.message });
    }
  },

  createRole: async (req, res) => {
    try {
      const roleData = req.body;
      const newRole = await RoleService.createRole(roleData);
      res.status(201).json({ success: true, data: newRole, message: 'Role created successfully' });
    } catch (error) {
      console.error('Controller error creating role:', error);
      if (error.message === 'Role name already exists.') {
        return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
      }
      res.status(500).json({ success: false, message: 'Failed to create role', error: error.message });
    }
  },

  updateRole: async (req, res) => {
    try {
      const { id } = req.params;
      const roleData = req.body;
      const updatedRole = await RoleService.updateRole(id, roleData);

      if (!updatedRole) {
        return res.status(404).json({ success: false, message: 'Role not found or not updated' });
      }
      res.status(200).json({ success: true, data: updatedRole, message: 'Role updated successfully' });
    } catch (error) {
      console.error(`Controller error updating role with id ${req.params.id}:`, error);
      if (error.message === 'Role name already exists.') {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Failed to update role', error: error.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await RoleService.deleteRole(id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Role not found or already deleted' });
      }
      res.status(200).json({ success: true, message: 'Role deleted successfully' }); // Hoặc 204 No Content
    } catch (error) {
      console.error(`Controller error deleting role with id ${req.params.id}:`, error);
      res.status(500).json({ success: false, message: 'Failed to delete role', error: error.message });
    }
  },

  // Thêm các controller methods khác ở đây
};

module.exports = RoleController; 