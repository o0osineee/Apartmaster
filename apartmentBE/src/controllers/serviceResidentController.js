const SRService = require('../services/serviceResidentService');

const ServiceResidentController = {
  assignServiceToResident: async (req, res, next) => {
    try {
      const assignment = await SRService.assignServiceToResident(req.body);
      // Depending on the model's return (creation vs reactivation), the message might differ.
      // For simplicity, a generic success message or one from the service/model.
      res.status(201).json({ 
        success: true, 
        data: assignment, 
        message: assignment.message || 'Service assigned to resident successfully.' 
      });
    } catch (error) {
      next(error);
    }
  },

  updateServiceAssignment: async (req, res, next) => {
    try {
      const { serviceId, residentId } = req.params;
      // Validate IDs
      if (isNaN(parseInt(serviceId)) || isNaN(parseInt(residentId))){
        const err = new Error('Service ID and Resident ID in URL must be numbers.');
        err.statusCode = 400;
        return next(err);
      }
      const updatedAssignment = await SRService.updateServiceAssignment(parseInt(serviceId), parseInt(residentId), req.body);
      // Fetch the full details to return, as update only returns input data
      const assignmentDetails = await SRService.getSpecificActiveAssignment(parseInt(serviceId), parseInt(residentId));
      res.status(200).json({ success: true, data: assignmentDetails || updatedAssignment, message: 'Service assignment updated successfully.' });
    } catch (error) {
      next(error);
    }
  },

  removeServiceFromResident: async (req, res, next) => {
    try {
      const { serviceId, residentId } = req.params;
      if (isNaN(parseInt(serviceId)) || isNaN(parseInt(residentId))){
        const err = new Error('Service ID and Resident ID in URL must be numbers.');
        err.statusCode = 400;
        return next(err);
      }
      const result = await SRService.removeServiceFromResident(parseInt(serviceId), parseInt(residentId));
      res.status(200).json({ success: true, message: result.message || 'Service removed from resident successfully.' });
    } catch (error) {
      next(error);
    }
  },

  getServicesByResident: async (req, res, next) => {
    try {
      const { residentId } = req.params;
      if (isNaN(parseInt(residentId))){
        const err = new Error('Resident ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const services = await SRService.getServicesByResident(parseInt(residentId));
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      next(error);
    }
  },

  getResidentsByService: async (req, res, next) => {
    try {
      const { serviceId } = req.params;
      if (isNaN(parseInt(serviceId))){
        const err = new Error('Service ID must be a number.');
        err.statusCode = 400;
        return next(err);
      }
      const residents = await SRService.getResidentsByService(parseInt(serviceId));
      res.status(200).json({ success: true, data: residents });
    } catch (error) {
      next(error);
    }
  },

  getSpecificActiveAssignment: async (req, res, next) => {
    try {
      const { serviceId, residentId } = req.params;
       if (isNaN(parseInt(serviceId)) || isNaN(parseInt(residentId))){
        const err = new Error('Service ID and Resident ID must be numbers.');
        err.statusCode = 400;
        return next(err);
      }
      const assignment = await SRService.getSpecificActiveAssignment(parseInt(serviceId), parseInt(residentId));
      if (!assignment) {
        const err = new Error('Active assignment not found.');
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({ success: true, data: assignment });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ServiceResidentController; 