const RAModel = require('../models/residentApartmentModel');

const ResidentApartmentService = {
  assignResidentToApartment: async (data) => {
    return await RAModel.assignResidentToApartment(data);
  },

  updateAssignment: async (residentId, apartmentId, updateData) => {
    return await RAModel.updateAssignment(residentId, apartmentId, updateData);
  },
  
  setMoveOutDate: async (residentId, apartmentId, moveOutDate) => {
    return await RAModel.setMoveOutDate(residentId, apartmentId, moveOutDate);
  },

  getApartmentsByResident: async (residentId) => {
    return await RAModel.getApartmentsByResident(residentId);
  },

  getResidentsByApartment: async (apartmentId) => {
    return await RAModel.getResidentsByApartment(apartmentId);
  },
  
  getSpecificAssignment: async (residentId, apartmentId) => {
    return await RAModel.getSpecificAssignment(residentId, apartmentId);
  },

  removeRelationship: async (residentId, apartmentId) => {
    return await RAModel.removeRelationship(residentId, apartmentId);
  }
};

module.exports = ResidentApartmentService; 