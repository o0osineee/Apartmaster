const express = require('express');
const ResidentController = require('../controllers/residentController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createResidentSchema, updateResidentSchema } = require('../validations/residentValidation');

const router = express.Router();

router.get('/', ResidentController.getAllResidents);
router.get('/:id', ResidentController.getResidentById);
router.post('/', validateRequest(createResidentSchema), ResidentController.createResident);
router.put('/:id', validateRequest(updateResidentSchema), ResidentController.updateResident);
router.delete('/:id', ResidentController.deleteResident);

// Tìm cư dân bằng số CMND/CCCD
router.get('/id-number/:idNumber', ResidentController.findByIdNumber);


module.exports = router; 