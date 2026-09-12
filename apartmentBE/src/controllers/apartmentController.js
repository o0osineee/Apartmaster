const ApartmentService = require('../services/apartmentService');

const ApartmentController = {
  getAllApartments: async (req, res, next) => {
    try {
      const apartments = await ApartmentService.getAllApartments();
      res.status(200).json({ success: true, data: apartments });
    } catch (error) {
      next(error);
    }
  },

  getApartmentById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (isNaN(parseInt(id))) {
        const err = new Error('Apartment ID must be a number');
        err.statusCode = 400;
        return next(err);
      }
      const apartment = await ApartmentService.getApartmentById(id);
      if (!apartment) {
        const err = new Error('Apartment not found');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: apartment });
    } catch (error) {
      next(error);
    }
  },

  createApartment: async (req, res, next) => {
    try {
      const apartmentData = req.body;
      const newApartment = await ApartmentService.createApartment(apartmentData);
      res.status(201).json({ success: true, data: newApartment, message: 'Apartment created successfully' });
    } catch (error) {
      if (error.message === 'Apartment code already exists.') {
        error.statusCode = 409;
      }
      next(error);
    }
  },

  updateApartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const apartmentData = req.body;
      const updatedApartment = await ApartmentService.updateApartment(id, apartmentData);
      if (!updatedApartment) {
        const err = new Error('Apartment not found or not updated');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: updatedApartment, message: 'Apartment updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteApartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await ApartmentService.deleteApartment(id);
      if (!success) {
        const err = new Error('Apartment not found or already deleted');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, message: 'Apartment deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  findApartmentByCode: async (req, res, next) => {
    try {
      const { code } = req.params;
      const apartment = await ApartmentService.findByCode(code);
      
      if (!apartment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy căn hộ với mã này'
        });
      }

      res.json({
        success: true,
        data: apartment
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ApartmentController; 