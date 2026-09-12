import api from '../config';


const getAllMaintenances = async () => {
  const response = await api.get('/maintenances');
  return response.data;
};


const createMaintenance = async (maintenanceData) => {
  const response = await api.post('/maintenances', {
    ...maintenanceData,
    employee: {
      employeeId: parseInt(maintenanceData.employeeId)
    }
  });
  return response.data;
};


const updateMaintenance = async (id, maintenanceData) => {
  const response = await api.put(`/maintenances/${id}`, {
    ...maintenanceData,
    employee: {
      employeeId: parseInt(maintenanceData.employeeId)
    }
  });
  return response.data;
};


const deleteMaintenance = async (id) => {
  await api.delete(`/maintenances/${id}`);
  return { success: true, data: { maintenanceId: id } };
};


const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenances/${id}`);
  return response.data;
};


const maintenanceService = {
  getAllMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceById,
};


export default maintenanceService;


