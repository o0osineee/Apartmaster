const express = require('express');
const PermissionController = require('../controllers/permissionController');
const validateRequest = require('../middlewares/validationMiddleware');
const { permissionSchema } = require('../validations/permissionValidation');

const router = express.Router();

router.get('/', PermissionController.getAllPermissions);
router.get('/:id', PermissionController.getPermissionById);
router.post('/', validateRequest(permissionSchema), PermissionController.createPermission);
router.put('/:id', validateRequest(permissionSchema), PermissionController.updatePermission);
router.delete('/:id', PermissionController.deletePermission);

module.exports = router; 