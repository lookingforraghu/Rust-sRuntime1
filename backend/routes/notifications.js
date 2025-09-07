const express = require('express');
const {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  updateNotificationSettings
} = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', getNotifications);

// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', getNotification);

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', markAsRead);

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', markAllAsRead);

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', deleteNotification);

// @desc    Get unread count
// @route   GET /api/notifications/unread/count
// @access  Private
router.get('/unread/count', getUnreadCount);

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
router.put('/settings', updateNotificationSettings);

module.exports = router;
