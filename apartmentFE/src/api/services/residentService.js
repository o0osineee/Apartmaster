import api from '../config';

const residentService = {
  getAll: async () => {
    try {
      const response = await api.get('/residents');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/residents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (residentData) => {
    try {
      console.log('Creating resident with data:', { ...residentData, password: '[REDACTED]' });
      const response = await api.post('/residents', residentData);
      return response.data;
    } catch (error) {
      console.error('Error creating resident:', error.response?.data || error);
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.map(err => err.message).join(', '));
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, residentData) => {
    try {
      const response = await api.put(`/residents/${id}`, residentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/residents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getResidentsByApartment: async (apartmentId) => {
    try {
      const response = await api.get(`/residents/apartment/${apartmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách căn hộ của cư dân
  getResidentApartments: async (id) => {
    const response = await api.get(`/residents/${id}/apartments`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-Modified-Since': '0'
      }
    });
    return response.data;
  },

  // Thêm căn hộ cho cư dân
  assignApartment: async (residentId, apartmentData) => {
    const formattedData = {
      apartmentId: apartmentData.apartmentId,
      startDate: apartmentData.startDate,
      endDate: apartmentData.endDate,
      status: apartmentData.status
    };
    const response = await api.post(`/residents/${residentId}/apartments`, formattedData);
    return response.data;
  },

  // Xóa căn hộ khỏi cư dân
  removeApartment: async (residentId, apartmentId) => {
    const response = await api.delete(`/residents/${residentId}/apartments/${apartmentId}`);
    return response.data;
  },

  findByIdNumber: async (idNumber) => {
    try {
      const response = await api.get(`/residents/id-number/${idNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default residentService;