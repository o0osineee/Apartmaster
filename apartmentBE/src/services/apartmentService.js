const ApartmentModel = require('../models/apartmentModel');
const pool = require('../config/database');

const ApartmentService = {
  getAllApartments: async () => {
    return ApartmentModel.getAll();
  },

  getApartmentById: async (id) => {
    return ApartmentModel.getById(id);
  },

  createApartment: async (apartmentData) => {
    return ApartmentModel.create(apartmentData);
  },

  updateApartment: async (id, apartmentData) => {
    return ApartmentModel.update(id, apartmentData);
  },

  deleteApartment: async (id) => {
    return ApartmentModel.softDelete(id);
  },

  findByCode: async (code) => {
    try {
      const [apartment] = await pool.query(
        'SELECT * FROM Apartment WHERE code = ? AND isDeleted = FALSE',
        [code]
      );
      return apartment[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ApartmentService; 