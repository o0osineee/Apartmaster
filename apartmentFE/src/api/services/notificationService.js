import api from '../config';

const getAllNotifications = () => {
  return api.get('/notifications');
};

const getNotificationById = (id) => {
  return api.get(`/notifications/${id}`);
};

const createNotification = (data) => {
  const notificationData = {
    title: data.title,
    content: data.content,
    status: data.status,
    employeeId: 1 // Tạm thời hardcode employeeId là 1
  };
  return api.post('/notifications', notificationData);
};

const updateNotification = (id, data) => {
  // Chỉ gửi các trường có giá trị
  const notificationData = {};
  if (data.title) notificationData.title = data.title;
  if (data.content) notificationData.content = data.content;
  if (data.status) notificationData.status = data.status;
  
  return api.put(`/notifications/${id}`, notificationData);
};

const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};

const notificationService = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};

export default notificationService; 