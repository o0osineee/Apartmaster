const Complaint = require('../models/complaintModel');

const complaintService = {
  getAllComplaints: async () => {
    return await Complaint.getAllComplaints();
  },

  getComplaintById: async (complaintId) => {
    const complaint = await Complaint.getComplaintById(complaintId);
    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }
    return complaint;
  },

  createComplaint: async (complaintData) => {
    return await Complaint.createComplaint(complaintData);
  },

  updateComplaint: async (complaintId, complaintData) => {
    const updatedComplaint = await Complaint.updateComplaint(complaintId, complaintData);
    if (!updatedComplaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }
    return updatedComplaint;
  },

  deleteComplaint: async (complaintId) => {
    const deleted = await Complaint.deleteComplaint(complaintId);
    if (!deleted) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }
    return true;
  },

  getComplaintsByResident: async (residentId) => {
    return await Complaint.getComplaintsByResident(residentId);
  },

  getComplaintsByDepartment: async (departmentId) => {
    return await Complaint.getComplaintsByDepartment(departmentId);
  },

  assignDepartment: async (complaintId, departmentId) => {
    const assigned = await Complaint.assignDepartment(complaintId, departmentId);
    if (!assigned) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }
    return assigned;
  },

  updateStatus: async (complaintId, status) => {
    const validStatuses = ['Chờ xử lý', 'Đã tiếp nhận', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'];
    if (!validStatuses.includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      throw err;
    }
    const updated = await Complaint.updateStatus(complaintId, status);
    if (!updated) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }
};

module.exports = complaintService;
