const Notification = require('../models/notificationModel');

function notFound(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

const notificationService = {
  getAllNotifications: async () => {
    return await Notification.getAllNotifications();
  },

  getNotificationById: async (notificationId) => {
    const notification = await Notification.getNotificationById(notificationId);
    if (!notification) {
      throw notFound('Notification not found');
    }
    return notification;
  },

  createNotification: async (notificationData) => {
    return await Notification.createNotification(notificationData);
  },

  updateNotification: async (notificationId, notificationData) => {
    const updatedNotification = await Notification.updateNotification(notificationId, notificationData);
    if (!updatedNotification) {
      throw notFound('Notification not found');
    }
    return updatedNotification;
  },

  deleteNotification: async (notificationId) => {
    const deleted = await Notification.deleteNotification(notificationId);
    if (!deleted) {
      throw notFound('Notification not found');
    }
    return true;
  },

  getNotificationsByEmployee: async (employeeId) => {
    return await Notification.getNotificationsByEmployee(employeeId);
  },

  updateStatus: async (notificationId, status) => {
    const updated = await Notification.updateStatus(notificationId, status);
    if (!updated) {
      throw notFound('Notification not found');
    }
    return updated;
  },

  getNotificationsByRecipient: async (recipientId, recipientType) => {
    return await Notification.getNotificationsByRecipient(recipientId, recipientType);
  },

  markAsRead: async (notificationId) => {
    const marked = await Notification.markAsRead(notificationId);
    if (!marked) {
      throw notFound('Notification not found');
    }
    return marked;
  },

  markAllAsRead: async (recipientId, recipientType) => {
    return await Notification.markAllAsRead(recipientId, recipientType);
  },

  getUnreadCount: async (recipientId, recipientType) => {
    return await Notification.getUnreadCount(recipientId, recipientType);
  }
};

module.exports = notificationService;
