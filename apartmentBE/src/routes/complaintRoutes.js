const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createComplaintSchema, updateComplaintSchema, assignDepartmentSchema, updateStatusSchema } = require('../validations/complaintValidation');

// Get all complaints
router.get('/', complaintController.getAllComplaints);

// Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// Get complaints by resident
router.get('/resident/:residentId', complaintController.getComplaintsByResident);

// Get complaints by department
router.get('/department/:departmentId', complaintController.getComplaintsByDepartment);

// Create new complaint
router.post('/', validateRequest(createComplaintSchema), complaintController.createComplaint);

// Update complaint
router.put('/:id', validateRequest(updateComplaintSchema), complaintController.updateComplaint);

// Assign department to complaint
router.post('/:id/assign', validateRequest(assignDepartmentSchema), complaintController.assignDepartment);

// Update complaint status
router.put('/:id/status', validateRequest(updateStatusSchema), complaintController.updateStatus);

// Delete complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router;