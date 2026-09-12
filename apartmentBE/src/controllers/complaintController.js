const complaintService = require('../services/complaintService');

const complaintController = {
  getAllComplaints: async (req, res) => {
    try {
      const complaints = await complaintService.getAllComplaints();
      res.json({
        success: true,
        data: complaints
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  getComplaintById: async (req, res) => {
    try {
      const complaint = await complaintService.getComplaintById(req.params.id);
      res.json({
        success: true,
        data: complaint
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  createComplaint: async (req, res) => {
    try {
      const complaint = await complaintService.createComplaint(req.body);
      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateComplaint: async (req, res) => {
    try {
      const complaint = await complaintService.updateComplaint(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: complaint
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteComplaint: async (req, res) => {
    try {
      await complaintService.deleteComplaint(req.params.id);
      res.json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  },

  getComplaintsByResident: async (req, res) => {
    try {
      const complaints = await complaintService.getComplaintsByResident(req.params.residentId);
      res.json({
        success: true,
        data: complaints
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  getComplaintsByDepartment: async (req, res) => {
    try {
      const complaints = await complaintService.getComplaintsByDepartment(req.params.departmentId);
      res.json({
        success: true,
        data: complaints
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  assignDepartment: async (req, res) => {
    try {
      const { departmentId } = req.body;
      if (!departmentId) {
        return res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
      }
      const complaint = await complaintService.assignDepartment(req.params.id, departmentId);
      res.json({
        success: true,
        message: 'Department assigned successfully',
        data: complaint
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }
      const complaint = await complaintService.updateStatus(req.params.id, status);
      res.json({
        success: true,
        message: 'Status updated successfully',
        data: complaint
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = complaintController;
