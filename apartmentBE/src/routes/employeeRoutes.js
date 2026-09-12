const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validations/employeeValidation');

const router = express.Router();

router.get('/', EmployeeController.getAllEmployees);
router.get('/department/:departmentId', EmployeeController.getEmployeesByDepartment);
router.get('/:id', EmployeeController.getEmployeeById);
router.post('/', validateRequest(createEmployeeSchema), EmployeeController.createEmployee);
router.put('/:id', validateRequest(updateEmployeeSchema), EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router; 