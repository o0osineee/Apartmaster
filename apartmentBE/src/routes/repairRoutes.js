const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createRepairSchema, updateRepairSchema, assignEmployeeSchema, updateStatusSchema } = require('../validations/repairValidation');

// Get all repairs
router.get('/', repairController.getAllRepairs);

// Get repair by ID
router.get('/:id', repairController.getRepairById);

// Get repairs by resident ID
router.get('/resident/:residentId', repairController.getRepairsByResident);

// Get repairs by employee ID
router.get('/employee/:employeeId', repairController.getRepairsByEmployee);

// Create new repair
router.post('/', validateRequest(createRepairSchema), repairController.createRepair);

// Update repair
router.put('/:id', validateRequest(updateRepairSchema), repairController.updateRepair);

// Assign employee to repair
router.post('/:id/assign', validateRequest(assignEmployeeSchema), repairController.assignEmployee);

// Update repair status
router.put('/:id/status', validateRequest(updateStatusSchema), repairController.updateStatus);

// Delete repair
router.delete('/:id', repairController.deleteRepair);

module.exports = router; 