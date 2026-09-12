const repairService = require('../services/repairService');

const repairController = {
  getAllRepairs: async (req, res) => {
    try {
      const repairs = await repairService.getAllRepairs();
      res.json({
        success: true,
        message: 'Repairs retrieved successfully',
        data: repairs
      });
    } catch (error) {
      console.error('Error in getAllRepairs:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving repairs',
        error: error.message
      });
    }
  },

  getRepairById: async (req, res) => {
    try {
      const repair = await repairService.getRepairById(req.params.id);
      res.json({
        success: true,
        message: 'Repair retrieved successfully',
        data: repair
      });
    } catch (error) {
      console.error('Error in getRepairById:', error);
      if (error.message === 'Repair not found') {
        res.status(404).json({
          success: false,
          message: 'Repair not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error retrieving repair',
          error: error.message
        });
      }
    }
  },

  createRepair: async (req, res) => {
    try {
      const repair = await repairService.createRepair(req.body);
      res.status(201).json({
        success: true,
        message: 'Repair created successfully',
        data: repair
      });
    } catch (error) {
      console.error('Error in createRepair:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating repair',
        error: error.message
      });
    }
  },

  updateRepair: async (req, res) => {
    try {
      const repair = await repairService.updateRepair(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Repair updated successfully',
        data: repair
      });
    } catch (error) {
      console.error('Error in updateRepair:', error);
      if (error.message === 'Repair not found') {
        res.status(404).json({
          success: false,
          message: 'Repair not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error updating repair',
          error: error.message
        });
      }
    }
  },

  deleteRepair: async (req, res) => {
    try {
      await repairService.deleteRepair(req.params.id);
      res.json({
        success: true,
        message: 'Repair deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteRepair:', error);
      if (error.message === 'Repair not found') {
        res.status(404).json({
          success: false,
          message: 'Repair not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error deleting repair',
          error: error.message
        });
      }
    }
  },

  getRepairsByResident: async (req, res) => {
    try {
      const repairs = await repairService.getRepairsByResident(req.params.residentId);
      res.json({
        success: true,
        message: 'Repairs retrieved successfully',
        data: repairs
      });
    } catch (error) {
      console.error('Error in getRepairsByResident:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving repairs',
        error: error.message
      });
    }
  },

  getRepairsByEmployee: async (req, res) => {
    try {
      const repairs = await repairService.getRepairsByEmployee(req.params.employeeId);
      res.json({
        success: true,
        message: 'Repairs retrieved successfully',
        data: repairs
      });
    } catch (error) {
      console.error('Error in getRepairsByEmployee:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving repairs',
        error: error.message
      });
    }
  },

  assignEmployee: async (req, res) => {
    try {
      const { employeeId } = req.body;
      const result = await repairService.assignEmployee(req.params.id, employeeId);
      res.json({
        success: true,
        message: 'Employee assigned successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in assignEmployee:', error);
      if (error.message === 'Repair not found') {
        res.status(404).json({
          success: false,
          message: 'Repair not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error assigning employee',
          error: error.message
        });
      }
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const result = await repairService.updateStatus(req.params.id, status);
      res.json({
        success: true,
        message: 'Status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in updateStatus:', error);
      if (error.message === 'Repair not found') {
        res.status(404).json({
          success: false,
          message: 'Repair not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error updating status',
          error: error.message
        });
      }
    }
  }
};

module.exports = repairController; 