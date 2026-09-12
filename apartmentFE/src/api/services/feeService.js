import api from '../config';

const getAllFees = async () => {
  const response = await api.get('/fees');
  return response.data;
};

const createFee = async (feeData) => {
  const response = await api.post('/fees', feeData);
  return response.data;
};

const updateFee = async (id, feeData) => {
  const response = await api.put(`/fees/${id}`, feeData);
  return response.data;
};

const deleteFee = async (id) => {
  const response = await api.delete(`/fees/${id}`);
  return response.data;
};

const getFeeById = async (id) => {
  const response = await api.get(`/fees/${id}`);
  return response.data;
};

const feeService = {
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
  getFeeById,
};

export default feeService; 