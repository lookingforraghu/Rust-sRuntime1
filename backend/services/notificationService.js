const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');

// Create notification
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    
    // Send notifications through different channels
    await sendNotificationChannels(notification);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send notification through all configured channels
const sendNotificationChannels = async (notification) => {
  const recipient = notification.recipient;
  
  // Send push notification (if user has push token)
  if (recipient.pushToken) {
    await sendPushNotification(notification);
  }
  
  // Send email notification
  if (recipient.notificationSettings?.email) {
    await sendEmailNotification(notification);
  }
  
  // Send SMS notification
  if (recipient.notificationSettings?.sms && recipient.phone) {
    await sendSMSNotification(notification);
  }
};

// Send push notification
const sendPushNotification = async (notification) => {
  try {
    // This would integrate with FCM or Expo push notifications
    // For now, we'll just log it
    console.log('Push notification sent:', {
      to: notification.recipient,
      title: notification.title,
      body: notification.body,
    });
    
    // Mark push notification as sent
    notification.channels.push.sent = true;
    notification.channels.push.sentAt = new Date();
    await notification.save();
    
    return { success: true };
  } catch (error) {
    console.error('Push notification failed:', error);
    notification.channels.push.error = error.message;
    await notification.save();
    return { success: false, error: error.message };
  }
};

// Send email notification
const sendEmailNotification = async (notification) => {
  try {
    const result = await sendEmail({
      email: notification.recipient.email,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2E7D32; color: white; padding: 20px; text-align: center;">
            <h1>🏛️ Citizen Grievance System</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>${notification.title}</h2>
            <p>${notification.body}</p>
            ${notification.data?.actionUrl ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${notification.data.actionUrl}" style="background-color: #2E7D32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a>
              </div>
            ` : ''}
          </div>
        </div>
      `,
    });
    
    // Mark email as sent
    notification.channels.email.sent = true;
    notification.channels.email.sentAt = new Date();
    await notification.save();
    
    return result;
  } catch (error) {
    console.error('Email notification failed:', error);
    notification.channels.email.error = error.message;
    await notification.save();
    return { success: false, error: error.message };
  }
};

// Send SMS notification
const sendSMSNotification = async (notification) => {
  try {
    const result = await sendSMS({
      to: notification.recipient.phone,
      message: `${notification.title}: ${notification.body}`,
    });
    
    // Mark SMS as sent
    notification.channels.sms.sent = true;
    notification.channels.sms.sentAt = new Date();
    await notification.save();
    
    return result;
  } catch (error) {
    console.error('SMS notification failed:', error);
    notification.channels.sms.error = error.message;
    await notification.save();
    return { success: false, error: error.message };
  }
};

// Get user notifications
const getUserNotifications = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;
    
    const query = { recipient: userId };
    if (unreadOnly) {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .populate('grievance', 'title status');
    
    const total = await Notification.countDocuments(query);
    
    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
    
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { 
        read: true, 
        readAt: new Date() 
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Get unread count
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });
    
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Send grievance update notification
const sendGrievanceUpdateNotification = async (grievance, update, updatedBy) => {
  try {
    const notification = await createNotification({
      title: 'Grievance Update',
      body: `Your grievance "${grievance.title}" status has been updated to ${update.status}`,
      type: 'grievance_update',
      recipient: grievance.citizen,
      sender: updatedBy,
      grievance: grievance._id,
      data: {
        grievanceId: grievance._id,
        status: update.status,
        comment: update.comment,
      },
    });
    
    return notification;
  } catch (error) {
    console.error('Error sending grievance update notification:', error);
    throw error;
  }
};

// Send reward notification
const sendRewardNotification = async (user, reward) => {
  try {
    const notification = await createNotification({
      title: 'Reward Unlocked!',
      body: `Congratulations! You've unlocked a new reward: ${reward.name}`,
      type: 'reward_unlocked',
      recipient: user._id,
      reward: reward._id,
      data: {
        rewardId: reward._id,
        rewardName: reward.name,
        points: reward.points,
      },
    });
    
    return notification;
  } catch (error) {
    console.error('Error sending reward notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  sendNotificationChannels,
  sendPushNotification,
  sendEmailNotification,
  sendSMSNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  sendGrievanceUpdateNotification,
  sendRewardNotification,
};
