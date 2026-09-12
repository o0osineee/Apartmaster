import api  from '../config';

export const apartmentService = {
  getAll: () => {
    return api.get('/apartments', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-Modified-Since': '0'
      }
    });
  },

  getById: (id) => {
    return api.get(`/apartments/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-Modified-Since': '0'
      }
    });
  },

  create: (data) => {
    const formattedData = {
      code: data.code,
      building: data.building,
      floor: parseInt(data.floor),
      area: parseFloat(data.area),
      status: data.status,
      contract: data.contract || ''
    };
    return api.post('/apartments', formattedData);
  },

  update: (id, data) => {
    const formattedData = {
      code: data.code,
      building: data.building,
      floor: parseInt(data.floor),
      area: parseFloat(data.area),
      status: data.status,
      contract: data.contract || ''
    };
    return api.put(`/apartments/${id}`, formattedData);
  },

  delete: (id) => {
    return api.delete(`/apartments/${id}`);
  }
}; 