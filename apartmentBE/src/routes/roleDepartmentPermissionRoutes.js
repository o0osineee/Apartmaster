const express = require('express');
const RDPController = require('../controllers/roleDepartmentPermissionController');
const validateRequest = require('../middlewares/validationMiddleware');
const { rdpSchema } = require('../validations/roleDepartmentPermissionValidation');

const router = express.Router();

// Gán quyền
router.post('/', validateRequest(rdpSchema), RDPController.assignPermission);

// Thu hồi quyền (sử dụng body tương tự như gán để xác định bộ ba roleId, departmentId, permissionId)
router.delete('/', validateRequest(rdpSchema), RDPController.revokePermission);

// Lấy danh sách quyền của một vai trò trong một phòng ban
// Ví dụ: /api/rdp/roles/1/departments/1/permissions
router.get('/roles/:roleId/departments/:departmentId/permissions', RDPController.getPermissionsForRoleInDepartment);

module.exports = router; 