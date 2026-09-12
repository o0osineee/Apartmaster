const express = require('express');
const ApartmentController = require('../controllers/apartmentController');
const validateRequest = require('../middlewares/validationMiddleware');
const { apartmentSchema, updateApartmentSchema } = require('../validations/apartmentValidation');


const router = express.Router();

router.get('/', ApartmentController.getAllApartments);
router.get('/:id', ApartmentController.getApartmentById);
router.post('/', validateRequest(apartmentSchema), ApartmentController.createApartment);
router.put('/:id', validateRequest(updateApartmentSchema), ApartmentController.updateApartment);
router.delete('/:id', ApartmentController.deleteApartment);
router.get('/code/:code', validateRequest(apartmentSchema), ApartmentController.findApartmentByCode);

module.exports = router; 