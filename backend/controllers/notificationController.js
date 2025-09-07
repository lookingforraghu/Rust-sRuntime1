// Placeholder notification controller functions
const getNotifications = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { notifications: [] } });
};

const getNotification = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { notification: {} } });
};

const markAsRead = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Notification marked as read' });
};

const markAllAsRead = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
};

const deleteNotification = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Notification deleted' });
};

const getUnreadCount = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { count: 0 } });
};

const updateNotificationSettings = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Settings updated' });
};

module.exports = {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  updateNotificationSettings
};
