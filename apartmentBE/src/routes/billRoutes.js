const express = require('express');
const router = express.Router();
const BillController = require('../controllers/billController');
const validateRequest = require('../middlewares/validationMiddleware');
const { calculateBillSchema, updateBillPaymentSchema } = require('../validations/billValidation');


// Get all bills
router.get('/',BillController.getAllBills);

// Calculate bill
router.post('/calculate', 
  validateRequest(calculateBillSchema),
  BillController.calculateBill
);

// Update bill payment
router.put('/:billId/payment',
  validateRequest(updateBillPaymentSchema),
  BillController.updateBillPayment
);

// Delete bill
router.delete('/:billId', BillController.deleteBill);

module.exports = router; 