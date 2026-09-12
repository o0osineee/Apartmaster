const express = require('express');
const NotificationController = require('../controllers/notificationController');
const validateRequest = require('../middlewares/validationMiddleware');
const { createNotificationSchema, updateNotificationSchema } = require('../validations/notificationValidation');

const router = express.Router();

// Create a new notification
router.post('/', validateRequest(createNotificationSchema), NotificationController.createNotification);

// Get all notifications
router.get('/', NotificationController.getAllNotifications);

// Get a single notification by ID
router.get('/:id', NotificationController.getNotificationById);

// Update a notification by ID
router.put('/:id', validateRequest(updateNotificationSchema), NotificationController.updateNotification);

// Delete a notification by ID
router.delete('/:id', NotificationController.deleteNotification);


// Get notifications by recipient
router.get('/recipient/:recipientId/:recipientType', NotificationController.getNotificationsByRecipient);

// Get unread count for recipient
router.get('/unread/:recipientId/:recipientType', NotificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', NotificationController.markAsRead);

// Mark all notifications as read for recipient
router.put('/recipient/:recipientId/:recipientType/read-all', NotificationController.markAllAsRead);

module.exports = router; 