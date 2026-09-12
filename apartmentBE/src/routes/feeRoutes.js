const express = require('express');
const FeeController = require('../controllers/feeController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createFeeSchema, updateFeeSchema } = require('../validations/feeValidation');

const router = express.Router();

// Create a new fee
router.post('/', validateRequest(createFeeSchema), FeeController.createFee);

// Get all fees
router.get('/', FeeController.getAllFees);

// Get a single fee by ID
router.get('/:id', FeeController.getFeeById);

// Update a fee by ID
router.put('/:id', validateRequest(updateFeeSchema), FeeController.updateFee);

// Delete a fee by ID (soft delete)
router.delete('/:id', FeeController.deleteFee);

module.exports = router; 