import api from '../config';

export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response;
  },

  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response;
  },

  create: async (taskData) => {
    const response = await api.post('/tasks', taskData, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response;
  },

  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response;
  }
}; 