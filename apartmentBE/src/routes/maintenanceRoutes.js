const express = require('express');
const MaintenanceController = require('../controllers/maintenanceController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createMaintenanceSchema, updateMaintenanceSchema } = require('../validations/maintenanceValidation');

const router = express.Router();

router.post('/', validateRequest(createMaintenanceSchema), MaintenanceController.createMaintenance);
router.get('/', MaintenanceController.getAllMaintenances);
router.get('/employee/:employeeId', MaintenanceController.getMaintenancesByEmployee);
router.get('/:id', MaintenanceController.getMaintenanceById);
router.put('/:id', validateRequest(updateMaintenanceSchema), MaintenanceController.updateMaintenance);
router.delete('/:id', MaintenanceController.deleteMaintenance);

module.exports = router; 