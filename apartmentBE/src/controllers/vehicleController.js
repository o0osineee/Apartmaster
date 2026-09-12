const VehicleService = require('../services/vehicleService');

const VehicleController = {
  createVehicle: async (req, res, next) => {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      // Fetch the full vehicle details to include resident info in response
      const newVehicleDetails = await VehicleService.getVehicleById(vehicle.id);
      res.status(201).json({ success: true, data: newVehicleDetails, message: 'Vehicle created successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getAllVehicles: async (req, res, next) => {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
      next(error);
    }
  },

  getVehicleById: async (req, res, next) => {
    try {
      const vehicleId = parseInt(req.params.id);
      if (isNaN(vehicleId)) {
        const err = new Error('Vehicle ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const vehicle = await VehicleService.getVehicleById(vehicleId);
      if (!vehicle) {
        const err = new Error('Vehicle not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  },
  
  getVehiclesByResidentId: async (req, res, next) => {
    try {
      const residentId = parseInt(req.params.residentId);
      if (isNaN(residentId)) {
        const err = new Error('Resident ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const vehicles = await VehicleService.getVehiclesByResidentId(residentId);
      // Note: This currently returns vehicles without full resident details for this specific route
      // If full details are needed, the service/model method would need to be adjusted or another call made.
      res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
      next(error);
    }
  },

  updateVehicle: async (req, res, next) => {
    try {
      const vehicleId = parseInt(req.params.id);
      if (isNaN(vehicleId)) {
        const err = new Error('Vehicle ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const updatedVehicle = await VehicleService.updateVehicle(vehicleId, req.body);
      if (!updatedVehicle) {
        const err = new Error('Vehicle not found or no changes could be made (e.g., invalid new residentId).');
        err.statusCode = 404; 
        return next(err);
      }
      const vehicleWithDetails = await VehicleService.getVehicleById(vehicleId); // Fetch full details
      res.status(200).json({ success: true, data: vehicleWithDetails, message: 'Vehicle updated successfully.' });
    } catch (error) {
      next(error);
    }
  },

  deleteVehicle: async (req, res, next) => {
    try {
      const vehicleId = parseInt(req.params.id);
      if (isNaN(vehicleId)) {
        const err = new Error('Vehicle ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const success = await VehicleService.deleteVehicle(vehicleId);
      if (!success) {
        const err = new Error('Vehicle not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Vehicle deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = VehicleController; 