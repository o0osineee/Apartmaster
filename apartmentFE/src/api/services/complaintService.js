import api from '../config';

const getAllComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

const createComplaint = async (complaintData) => {
  const response = await api.post('/complaints', {
    ...complaintData,
    resident: {
      residentId: parseInt(complaintData.residentId)
    },
    department: {
      departmentId: parseInt(complaintData.departmentId)
    },
    employee: {
      employeeId: parseInt(complaintData.employeeId)
    }
  });
  return response.data;
};

const updateComplaint = async (id, complaintData) => {
  const response = await api.put(`/complaints/${id}`, {
    ...complaintData,
    resident: {
      residentId: parseInt(complaintData.residentId)
    },
    department: {
      departmentId: parseInt(complaintData.departmentId)
    },
    employee: {
      employeeId: parseInt(complaintData.employeeId)
    }
  });
  return response.data;
};

const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

const complaintService = {
  getAllComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintById,
};

export default complaintService;
 