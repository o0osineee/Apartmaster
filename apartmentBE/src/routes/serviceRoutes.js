const express = require('express');
const ServiceController = require('../controllers/serviceController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createServiceSchema, updateServiceSchema } = require('../validations/serviceValidation');

const router = express.Router();

// Create a new service
router.post('/', validateRequest(createServiceSchema), ServiceController.createService);

// Get all services
router.get('/', ServiceController.getAllServices);

// Get a single service by ID
router.get('/:id', ServiceController.getServiceById);

// Update a service by ID
router.put('/:id', validateRequest(updateServiceSchema), ServiceController.updateService);

// Delete a service by ID (soft delete)
router.delete('/:id', ServiceController.deleteService);

// Lấy danh sách cư dân đăng ký dịch vụ
router.get('/:serviceId/residents', ServiceController.getRegisteredResidents);

module.exports = router; 