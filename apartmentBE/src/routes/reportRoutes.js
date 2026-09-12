const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createReportSchema, updateReportSchema } = require('../validations/reportValidation');

// Get all reports
router.get('/', 
  ReportController.getAllReports
);

// Get dashboard data
router.get('/dashboard',
  ReportController.getDashboardData
);

// Create new report
router.post('/',
  validateRequest(createReportSchema),
  ReportController.createReport
);

// Update report
router.put('/:id',
  validateRequest(updateReportSchema),
  ReportController.updateReport
);

// Delete report
router.delete('/:id',
  ReportController.deleteReport
);

// Get reports by employee ID
router.get('/employee/:employeeId',
  ReportController.getReportsByEmployeeId
);

module.exports = router; 