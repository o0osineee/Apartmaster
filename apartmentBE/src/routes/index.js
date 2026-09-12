const express = require('express');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const rdpRoutes = require('./roleDepartmentPermissionRoutes');
const residentRoutes = require('./residentRoutes');
const apartmentRoutes = require('./apartmentRoutes');
const residentApartmentRoutes = require('./residentApartmentRoutes');
const feeRoutes = require('./feeRoutes');
const serviceRoutes = require('./serviceRoutes');
const taskRoutes = require('./taskRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const serviceResidentRoutes = require('./serviceResidentRoutes');
const repairRoutes = require('./repairRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const complaintRoutes = require('./complaintRoutes');
const notificationRoutes = require('./notificationRoutes');
const reportRoutes = require('./reportRoutes');
const authRoutes = require('./authRoutes');
const rolePermissionRoutes = require('./rolePermissionRoutes');
const billRoutes = require('./billRoutes');
const feeApartmentRoutes = require('./feeApartmentRoutes');


const router = express.Router();

// Bỏ tiền tố /api cho tất cả các routes
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/rdp', rdpRoutes);
router.use('/residents', residentRoutes);
router.use('/apartments', apartmentRoutes);
router.use('/resident-apartments', residentApartmentRoutes);
router.use('/fees', feeRoutes);
router.use('/services', serviceRoutes);
router.use('/tasks', taskRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/service-residents', serviceResidentRoutes);
router.use('/repairs', repairRoutes);
router.use('/maintenances', maintenanceRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/auth', authRoutes);
router.use('/role-permissions', rolePermissionRoutes);
router.use('/bills', billRoutes);
router.use('/fee-apartments', feeApartmentRoutes);
// router.use('/users', userRoutes);

module.exports = router; 