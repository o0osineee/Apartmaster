const express = require('express');
const RoleController = require('../controllers/roleController');
const validateRequest = require('../middlewares/validationMiddleware');
const { roleSchema } = require('../validations/roleValidation');

const router = express.Router();

// Định nghĩa route để lấy tất cả roles
// GET /api/roles/
router.get('/', RoleController.getAllRoles);

// GET /api/roles/:id
router.get('/:id', RoleController.getRoleById);

// POST /api/roles/
router.post('/', validateRequest(roleSchema), RoleController.createRole);

// PUT /api/roles/:id
router.put('/:id', validateRequest(roleSchema), RoleController.updateRole);

// DELETE /api/roles/:id
router.delete('/:id', RoleController.deleteRole);

// Thêm các routes khác ở đây (DELETE, GET by ID)

module.exports = router; 