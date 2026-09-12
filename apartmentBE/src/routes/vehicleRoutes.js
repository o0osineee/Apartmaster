const express = require('express');
const VehicleController = require('../controllers/vehicleController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createVehicleSchema, updateVehicleSchema } = require('../validations/vehicleValidation');

const router = express.Router();

// Create a new vehicle
router.post('/', validateRequest(createVehicleSchema), VehicleController.createVehicle);

// Get all vehicles
router.get('/', VehicleController.getAllVehicles);

// Get all vehicles for a specific resident
router.get('/resident/:residentId', VehicleController.getVehiclesByResidentId);

// Get a single vehicle by ID
router.get('/:id', VehicleController.getVehicleById);

// Update a vehicle by ID
router.put('/:id', validateRequest(updateVehicleSchema), VehicleController.updateVehicle);

// Delete a vehicle by ID (soft delete)
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router; 