const RAService = require('../services/residentApartmentService');
const db = require('../config/database');

const ResidentApartmentController = {
  assignResidentToApartment: async (req, res, next) => {
    try {
      const assignment = await RAService.assignResidentToApartment(req.body);
      res.status(201).json({ 
        success: true, 
        data: assignment, 
        message: 'Gán cư dân vào căn hộ thành công.' 
      });
    } catch (error) {
      console.error('Error in assignResidentToApartment:', error);
      if (error.message.includes('đã được gán')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  },

  updateAssignment: async (req, res, next) => {
    try {
      const { residentId, apartmentId } = req.params;
      // Validate IDs
      if (isNaN(parseInt(residentId)) || isNaN(parseInt(apartmentId))){
        const err = new Error('residentId và apartmentId phải là số.');
        err.statusCode = 400;
        return next(err);
      }

      // Log the request data for debugging
      console.log('Updating assignment with data:', {
        residentId,
        apartmentId,
        updateData: req.body
      });

      // Check if apartment already has an owner when setting isOwner to true
      if (req.body.isOwner === true) {
        const [existingOwner] = await db.query(
          'SELECT * FROM Resident_Apartment WHERE apartmentId = ? AND isOwner = 1 AND isDeleted = 0 AND residentId != ?',
          [apartmentId, residentId]
        );

        if (existingOwner.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Căn hộ này đã có chủ hộ khác'
          });
        }
      }

      const updatedAssignment = await RAService.updateAssignment(
        parseInt(residentId), 
        parseInt(apartmentId), 
        req.body
      );

      res.status(200).json({ 
        success: true, 
        data: updatedAssignment, 
        message: 'Cập nhật vai trò thành công.' 
      });
    } catch (error) {
      console.error('Error updating assignment:', error);
      if (error.message.includes('Không tìm thấy')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  },

  setMoveOutDate: async (req, res, next) => {
    try {
      const { residentId, apartmentId } = req.params;
      const { moveOutDate } = req.body;

      if (isNaN(parseInt(residentId)) || isNaN(parseInt(apartmentId))) {
        const err = new Error('residentId và apartmentId phải là số.');
        err.statusCode = 400;
        return next(err);
      }

      const result = await RAService.setMoveOutDate(
        parseInt(residentId),
        parseInt(apartmentId),
        moveOutDate
      );

      res.status(200).json({
        success: true,
        data: result,
        message: 'Cập nhật ngày chuyển đi thành công.'
      });
    } catch (error) {
      console.error('Error setting move out date:', error);
      if (error.message.includes('Không tìm thấy')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  },

  // Xóa mềm quan hệ cư dân-căn hộ
  removeRelationship: async (req, res, next) => {
    try {
      const { residentId, apartmentId } = req.params;
      if (isNaN(parseInt(residentId)) || isNaN(parseInt(apartmentId))){
        const err = new Error('residentId và apartmentId phải là số.');
        err.statusCode = 400;
        return next(err);
      }

      const result = await RAService.removeRelationship(
        parseInt(residentId), 
        parseInt(apartmentId)
      );

      res.status(200).json({ 
        success: true, 
        message: result.message 
      });
    } catch (error) {
      console.error('Error removing relationship:', error);
      if (error.message.includes('Không tìm thấy')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  },

  getApartmentsByResident: async (req, res, next) => {
    try {
      const { residentId } = req.params;
      if (isNaN(parseInt(residentId))){
        const err = new Error('residentId phải là số.');
        err.statusCode = 400;
        return next(err);
      }
      const apartments = await RAService.getApartmentsByResident(parseInt(residentId));
      res.status(200).json({ success: true, data: apartments });
    } catch (error) {
      next(error);
    }
  },

  getResidentsByApartment: async (req, res, next) => {
    try {
      const { apartmentId } = req.params;
      if (isNaN(parseInt(apartmentId))){
        const err = new Error('apartmentId phải là số.');
        err.statusCode = 400;
        return next(err);
      }
      const residents = await RAService.getResidentsByApartment(parseInt(apartmentId));
      res.status(200).json({ success: true, data: residents });
    } catch (error) {
      next(error);
    }
  },
  
  getSpecificAssignment: async (req, res, next) => {
    try {
        const { residentId, apartmentId } = req.params;
        if (isNaN(parseInt(residentId)) || isNaN(parseInt(apartmentId))){
            const err = new Error('residentId and apartmentId must be numbers.');
            err.statusCode = 400;
            return next(err);
        }
        const assignment = await RAService.getSpecificAssignment(parseInt(residentId), parseInt(apartmentId));
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

module.exports = ResidentApartmentController; 