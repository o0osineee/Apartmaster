const express = require('express');
const RAController = require('../controllers/residentApartmentController');
const validateRequest = require('../middlewares/validationMiddleware');
const { assignSchema, updateAssignmentSchema, setMoveOutDateSchema } = require('../validations/residentApartmentValidation');

const router = express.Router();

// Gán cư dân vào căn hộ
// POST /api/resident-apartments/
router.post('/', validateRequest(assignSchema), RAController.assignResidentToApartment);

// Cập nhật thông tin của một mối quan hệ (ví dụ: isOwner, moveInDate, moveOutDate)
// PUT /api/resident-apartments/residents/:residentId/apartments/:apartmentId
router.put('/residents/:residentId/apartments/:apartmentId', validateRequest(updateAssignmentSchema), RAController.updateAssignment);

// Đặt ngày chuyển đi cho một mối quan hệ cụ thể
// PATCH /api/resident-apartments/residents/:residentId/apartments/:apartmentId/set-move-out
router.patch('/residents/:residentId/apartments/:apartmentId/set-move-out', validateRequest(setMoveOutDateSchema), RAController.setMoveOutDate);

// Lấy các căn hộ của một cư dân
// GET /api/resident-apartments/residents/:residentId/apartments
router.get('/residents/:residentId/apartments', RAController.getApartmentsByResident);

// Lấy các cư dân của một căn hộ
// GET /api/resident-apartments/apartments/:apartmentId/residents
router.get('/apartments/:apartmentId/residents', RAController.getResidentsByApartment);

// Lấy thông tin assignment cụ thể (active)
// GET /api/resident-apartments/residents/:residentId/apartments/:apartmentId
router.get('/residents/:residentId/apartments/:apartmentId', RAController.getSpecificAssignment);

// Xóa mềm quan hệ cư dân-căn hộ
router.delete('/residents/:residentId/apartments/:apartmentId', RAController.removeRelationship);

module.exports = router; 