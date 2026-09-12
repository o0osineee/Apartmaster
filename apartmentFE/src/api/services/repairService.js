import api from '../config';

const repairService = {
  getAllRepairs: async () => {
    try {
      const response = await api.get('/repairs');
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch repairs');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error in getAllRepairs:', error);
      throw error;
    }
  },

  createRepair: async (repairData) => {
    try {
      const response = await api.post('/repairs', repairData);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to create repair');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error in createRepair:', error);
      throw error;
    }
  },

  updateRepair: async (id, repairData) => {
    try {
      const response = await api.put(`/repairs/${id}`, repairData);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update repair');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error in updateRepair:', error);
      throw error;
    }
  },

  deleteRepair: async (id) => {
    try {
      const response = await api.delete(`/repairs/${id}`);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to delete repair');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error in deleteRepair:', error);
      throw error;
    }
  },

  getRepairById: async (id) => {
    try {
      const response = await api.get(`/repairs/${id}`);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch repair');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error in getRepairById:', error);
      throw error;
    }
  },
};

export default repairService; 