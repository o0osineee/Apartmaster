const notificationService = require('../services/notificationService');

const notificationController = {
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await notificationService.getAllNotifications();
      res.json({
        status: 'success',
        message: 'Lấy danh sách thông báo thành công',
        data: notifications
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getNotificationById: async (req, res) => {
    try {
      if (isNaN(parseInt(req.params.id))) {
        return res.status(400).json({ status: 'error', message: 'Notification ID must be a number' });
      }
      const notification = await notificationService.getNotificationById(req.params.id);
      res.json({
        status: 'success',
        message: 'Lấy thông tin thông báo thành công',
        data: notification
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  createNotification: async (req, res) => {
    try {
      const notification = await notificationService.createNotification(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Tạo thông báo thành công',
        data: notification
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateNotification: async (req, res) => {
    try {
      const notification = await notificationService.updateNotification(req.params.id, req.body);
      res.json({
        status: 'success',
        message: 'Cập nhật thông báo thành công',
        data: notification
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      await notificationService.deleteNotification(req.params.id);
      res.json({
        status: 'success',
        message: 'Xóa thông báo thành công'
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getNotificationsByEmployee: async (req, res) => {
    try {
      const notifications = await notificationService.getNotificationsByEmployee(req.params.employeeId);
      res.json({
        status: 'success',
        message: 'Lấy danh sách thông báo của nhân viên thành công',
        data: notifications
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const notification = await notificationService.updateStatus(req.params.id, req.body.status);
      if (!notification) {
        return res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy thông báo để cập nhật trạng thái'
        });
      }
      res.json({
        status: 'success',
        message: 'Cập nhật trạng thái thông báo thành công',
        data: notification
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  getNotificationsByRecipient: async (req, res) => {
    try {
      const { recipientId, recipientType } = req.params;
      const notifications = await notificationService.getNotificationsByRecipient(recipientId, recipientType);
      res.json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const notification = await notificationService.markAsRead(req.params.id);
      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      res.status(error.statusCode || 400).json({ status: 'error', message: error.message });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      const { recipientId, recipientType } = req.params;
      const result = await notificationService.markAllAsRead(recipientId, recipientType);
      res.json({ status: 'success', message: 'All notifications marked as read', count: result.affectedRows });
    } catch (error) {
      res.status(error.statusCode || 400).json({ status: 'error', message: error.message });
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const { recipientId, recipientType } = req.params;
      const count = await notificationService.getUnreadCount(recipientId, recipientType);
      res.json({ status: 'success', unreadCount: count });
    } catch (error) {
      res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = notificationController;
