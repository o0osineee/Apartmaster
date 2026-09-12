const express = require('express');
const SRController = require('../controllers/serviceResidentController');
const validateRequest = require('../middlewares/validationMiddleware');
const { assignServiceSchema, updateServiceAssignmentSchema } = require('../validations/serviceResidentValidation');

const router = express.Router();

// Assign a service to a resident
// POST /api/service-residents/
router.post('/', validateRequest(assignServiceSchema), SRController.assignServiceToResident);

// Get all services for a specific resident
// GET /api/service-residents/residents/:residentId/services
router.get('/residents/:residentId/services', SRController.getServicesByResident);

// Get all residents for a specific service
// GET /api/service-residents/services/:serviceId/residents
router.get('/services/:serviceId/residents', SRController.getResidentsByService);

// Get a specific active assignment between a service and a resident
// GET /api/service-residents/services/:serviceId/residents/:residentId
router.get('/services/:serviceId/residents/:residentId', SRController.getSpecificActiveAssignment);

// Update a specific service assignment (e.g., change dates, rating)
// PUT /api/service-residents/services/:serviceId/residents/:residentId
router.put('/services/:serviceId/residents/:residentId', validateRequest(updateServiceAssignmentSchema), SRController.updateServiceAssignment);

// Remove a service from a resident (soft delete)
// DELETE /api/service-residents/services/:serviceId/residents/:residentId
router.delete('/services/:serviceId/residents/:residentId', SRController.removeServiceFromResident);

module.exports = router; 