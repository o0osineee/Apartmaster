const express = require('express');
const RolePermissionController = require('../controllers/rolePermissionController');
const router = express.Router();

// Lấy tất cả phân quyền
router.get('/', RolePermissionController.getAllRolePermissions);

// Lấy phân quyền theo vai trò và phòng ban
router.get('/:roleId/:departmentId', RolePermissionController.getRolePermissions);

// Cập nhật phân quyền cho vai trò trong phòng ban
router.put('/update', RolePermissionController.updateRolePermissions);

// Cập nhật nhiều phân quyền cùng lúc
router.post('/', RolePermissionController.updateRolePermissions);

// Xóa một permission cụ thể cho role và department
router.delete('/:roleId/:departmentId/:permissionId', RolePermissionController.deletePermission);

// Thêm một permission cụ thể cho role và department
router.post('/:roleId/:departmentId/:permissionId', RolePermissionController.addPermission);

module.exports = router; 