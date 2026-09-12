import api from '../config';


const getAllVehicles = () => {
  return api.get('/vehicles');
};


const getVehicleById = (id) => {
  return api.get(`/vehicles/${id}`);
};


const createVehicle = (data) => {
  const vehicleData = {
    licensePlate: data.licensePlate,
    type: data.type,
    residentId: parseInt(data.residentId)
  };
  return api.post('/vehicles', vehicleData);
};


const updateVehicle = (id, data) => {
  const vehicleData = {
    licensePlate: data.licensePlate,
    type: data.type,
    residentId: parseInt(data.residentId)
  };
  return api.put(`/vehicles/${id}`, vehicleData);
};


const deleteVehicle = (id) => {
  return api.delete(`/vehicles/${id}`);
};


const vehicleService = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};


export default vehicleService;
 

