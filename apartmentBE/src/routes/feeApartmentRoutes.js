const express = require('express');
const router = express.Router();
const FeeApartmentController = require('../controllers/feeApartmentController');

// Get fees by apartment ID
router.get('/:apartmentId', FeeApartmentController.getFeesByApartment);

module.exports = router; 