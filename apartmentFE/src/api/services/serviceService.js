import api from '../config';

const getAllServices = () => {
  return api.get('/services');
};

const getServiceById = (id) => {
  return api.get(`/services/${id}`);
};

const createService = (data) => {
  const serviceData = {
    name: data.name,
    description: data.description,
    feeId: data.feeId
  };
  return api.post('/services', serviceData);
};

const updateService = (id, data) => {
  const serviceData = {
    name: data.name,
    description: data.description,
    feeId: data.feeId
  };
  return api.put(`/services/${id}`, serviceData);
};

const deleteService = (id) => {
  return api.delete(`/services/${id}`);
};

// New service-resident relationship endpoints
const getServicesByResident = (residentId) => {
  return api.get(`/service-residents/residents/${residentId}/services`);
};

const getResidentsByService = (serviceId) => {
  return api.get(`/service-residents/services/${serviceId}/residents`);
};

const getSpecificAssignment = (serviceId, residentId) => {
  return api.get(`/service-residents/services/${serviceId}/residents/${residentId}`);
};

const assignServiceToResident = (data) => {
  return api.post('/service-residents', data);
};

const updateServiceAssignment = (serviceId, residentId, data) => {
  return api.put(`/service-residents/services/${serviceId}/residents/${residentId}`, data);
};

const removeServiceFromResident = (serviceId, residentId) => {
  return api.delete(`/service-residents/services/${serviceId}/residents/${residentId}`);
};

// Get registered residents for a service
const getRegisteredResidents = (serviceId) => {
  return api.get(`/services/${serviceId}/residents`);
};

const serviceService = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByResident,
  getResidentsByService,
  getSpecificAssignment,
  assignServiceToResident,
  updateServiceAssignment,
  removeServiceFromResident,
  getRegisteredResidents
};

export default serviceService; 