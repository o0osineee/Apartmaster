const DepartmentService = require('../services/departmentService');

const DepartmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const departments = await DepartmentService.getAllDepartments();
      res.status(200).json({ success: true, data: departments });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch departments', error: error.message });
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        return res.status(400).json({ success: false, message: 'Department ID must be a number' });
      }
      const department = await DepartmentService.getDepartmentById(id);
      if (!department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
      }
      res.status(200).json({ success: true, data: department });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch department', error: error.message });
    }
  },

  createDepartment: async (req, res) => {
    try {
      const departmentData = req.body;
      const newDepartment = await DepartmentService.createDepartment(departmentData);
      res.status(201).json({ success: true, data: newDepartment, message: 'Department created successfully' });
    } catch (error) {
      if (error.message === 'Department name already exists.') {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Failed to create department', error: error.message });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const departmentData = req.body;
      const updatedDepartment = await DepartmentService.updateDepartment(id, departmentData);
      if (!updatedDepartment) {
        return res.status(404).json({ success: false, message: 'Department not found or not updated' });
      }
      res.status(200).json({ success: true, data: updatedDepartment, message: 'Department updated successfully' });
    } catch (error) {
      if (error.message === 'Department name already exists.') {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Failed to update department', error: error.message });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await DepartmentService.deleteDepartment(id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Department not found or already deleted' });
      }
      res.status(200).json({ success: true, message: 'Department deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete department', error: error.message });
    }
  }
};

module.exports = DepartmentController; 