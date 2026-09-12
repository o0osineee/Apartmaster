const MaintenanceService = require('../services/maintenanceService');

const MaintenanceController = {
  createMaintenance: async (req, res, next) => {
    try {
      const maintenance = await MaintenanceService.createMaintenance(req.body);
      const newMaintenanceDetails = await MaintenanceService.getMaintenanceById(maintenance.id);
      res.status(201).json({ success: true, data: newMaintenanceDetails, message: 'Maintenance task created successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getAllMaintenances: async (req, res, next) => {
    try {
      const maintenances = await MaintenanceService.getAllMaintenances();
      res.status(200).json({ success: true, data: maintenances });
    } catch (error) {
      next(error);
    }
  },

  getMaintenanceById: async (req, res, next) => {
    try {
      const maintenanceId = parseInt(req.params.id);
      if (isNaN(maintenanceId)) {
        const err = new Error('Maintenance ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const maintenance = await MaintenanceService.getMaintenanceById(maintenanceId);
      if (!maintenance) {
        const err = new Error('Maintenance task not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: maintenance });
    } catch (error) {
      next(error);
    }
  },

  updateMaintenance: async (req, res, next) => {
    try {
      const maintenanceId = parseInt(req.params.id);
      if (isNaN(maintenanceId)) {
        const err = new Error('Maintenance ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const updatedMaintenance = await MaintenanceService.updateMaintenance(maintenanceId, req.body);
      if (!updatedMaintenance) {
        const err = new Error('Maintenance task not found or no changes made.');
        err.statusCode = 404;
        return next(err);
      }
      const maintenanceWithDetails = await MaintenanceService.getMaintenanceById(maintenanceId);
      res.status(200).json({ success: true, data: maintenanceWithDetails, message: 'Maintenance task updated successfully.' });
    } catch (error) {
      next(error);
    }
  },

  deleteMaintenance: async (req, res, next) => {
    try {
      const maintenanceId = parseInt(req.params.id);
      if (isNaN(maintenanceId)) {
        const err = new Error('Maintenance ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const success = await MaintenanceService.deleteMaintenance(maintenanceId);
      if (!success) {
        const err = new Error('Maintenance task not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Maintenance task deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getMaintenancesByEmployee: async (req, res, next) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      if (isNaN(employeeId)) {
        const err = new Error('Employee ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const maintenances = await MaintenanceService.getMaintenancesByEmployee(employeeId);
      res.status(200).json({ success: true, data: maintenances });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = MaintenanceController; 