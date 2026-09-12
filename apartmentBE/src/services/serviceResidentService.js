const SRModel = require('../models/serviceResidentModel');
const ServiceModel = require('../models/serviceModel'); // To check if service exists
const ResidentModel = require('../models/residentModel'); // To check if resident exists

const ServiceResidentService = {
  assignServiceToResident: async (data) => {
    const { serviceId, residentId } = data;
    // Check if service and resident exist before assigning
    const service = await ServiceModel.getServiceById(serviceId);
    if (!service) {
      const err = new Error('Service not found.');
      err.statusCode = 404;
      throw err;
    }
    const resident = await ResidentModel.getResidentById(residentId);
    if (!resident) {
      const err = new Error('Resident not found.');
      err.statusCode = 404;
      throw err;
    }
    return SRModel.assignServiceToResident(data);
  },

  updateServiceAssignment: async (serviceId, residentId, updateData) => {
    // Additional checks can be added here if needed, e.g., ensuring service/resident still exist
    return SRModel.updateServiceAssignment(serviceId, residentId, updateData);
  },

  removeServiceFromResident: async (serviceId, residentId) => {
    return SRModel.removeServiceFromResident(serviceId, residentId);
  },

  getServicesByResident: async (residentId) => {
    // Check if resident exists
    const resident = await ResidentModel.getResidentById(residentId);
    if (!resident) {
      const err = new Error('Resident not found.');
      err.statusCode = 404;
      throw err;
    }
    return SRModel.getServicesByResident(residentId);
  },

  getResidentsByService: async (serviceId) => {
    // Check if service exists
    const service = await ServiceModel.getServiceById(serviceId);
    if (!service) {
      const err = new Error('Service not found.');
      err.statusCode = 404;
      throw err;
    }
    return SRModel.getResidentsByService(serviceId);
  },

  getSpecificActiveAssignment: async (serviceId, residentId) => {
    return SRModel.getSpecificActiveAssignment(serviceId, residentId);
  }
};

module.exports = ServiceResidentService; 