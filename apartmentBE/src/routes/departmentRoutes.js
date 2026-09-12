const express = require('express');
const DepartmentController = require('../controllers/departmentController');
const validateRequest = require('../middlewares/validationMiddleware');
const { departmentSchema } = require('../validations/departmentValidation');

const router = express.Router();

router.get('/', DepartmentController.getAllDepartments);
router.get('/:id', DepartmentController.getDepartmentById);
router.post('/', validateRequest(departmentSchema), DepartmentController.createDepartment);
router.put('/:id', validateRequest(departmentSchema), DepartmentController.updateDepartment);
router.delete('/:id', DepartmentController.deleteDepartment);

module.exports = router; 