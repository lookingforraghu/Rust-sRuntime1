const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true,
    maxlength: [500, 'Body cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: [
      'grievance_update',
      'reward_unlocked',
      'system_announcement',
      'reminder',
      'escalation',
      'assignment',
      'resolution',
      'feedback_request'
    ],
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Related entities
  grievance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grievance',
    default: null
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    default: null
  },
  // Delivery channels
  channels: {
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      token: String,
      error: String
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    }
  },
  // Notification data
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Priority and scheduling
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  // Read status
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  // Action tracking
  actionTaken: {
    type: String,
    enum: ['none', 'viewed', 'clicked', 'dismissed'],
    default: 'none'
  },
  actionTakenAt: Date,
  // Expiration
  expiresAt: Date,
  // Retry mechanism
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  lastRetryAt: Date,
  // Template information
  template: {
    name: String,
    variables: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ read: 1, recipient: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for delivery status
notificationSchema.virtual('deliveryStatus').get(function() {
  const channels = this.channels;
  const sentChannels = Object.keys(channels).filter(
    channel => channels[channel].sent
  );
  
  if (sentChannels.length === 0) return 'not_sent';
  if (sentChannels.length === Object.keys(channels).length) return 'fully_sent';
  return 'partially_sent';
});

// Virtual for time since creation
notificationSchema.virtual('timeSinceCreation').get(function() {
  return Date.now() - this.createdAt;
});

// Pre-save middleware to set expiration if not provided
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Default expiration: 30 days
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  this.actionTaken = 'viewed';
  this.actionTakenAt = new Date();
  return this.save();
};

// Instance method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channel) {
  if (this.channels[channel]) {
    this.channels[channel].sent = true;
    this.channels[channel].sentAt = new Date();
  }
  
  // Check if all channels are sent
  const allChannelsSent = Object.values(this.channels).every(
    channel => channel.sent
  );
  
  if (allChannelsSent && this.status === 'pending') {
    this.status = 'sent';
  }
  
  return this.save();
};

// Instance method to mark as failed
notificationSchema.methods.markAsFailed = function(channel, error) {
  if (this.channels[channel]) {
    this.channels[channel].error = error;
  }
  
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  
  if (this.retryCount >= this.maxRetries) {
    this.status = 'failed';
  }
  
  return this.save();
};

// Instance method to retry sending
notificationSchema.methods.canRetry = function() {
  return this.retryCount < this.maxRetries && this.status !== 'failed';
};

// Static method to get notification statistics
notificationSchema.statics.getNotificationStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        sent: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
        },
        delivered: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        failed: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        read: {
          $sum: { $cond: ['$read', 1, 0] }
        }
      }
    }
  ]);
};

// Static method to get user notification stats
notificationSchema.statics.getUserNotificationStats = function(userId) {
  return this.aggregate([
    { $match: { recipient: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
        read: { $sum: { $cond: ['$read', 1, 0] } },
        byType: {
          $push: {
            type: '$type',
            read: '$read'
          }
        }
      }
    }
  ]);
};

// Static method to find notifications for retry
notificationSchema.statics.findForRetry = function() {
  return this.find({
    status: 'pending',
    retryCount: { $lt: '$maxRetries' },
    $or: [
      { lastRetryAt: { $exists: false } },
      { lastRetryAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } } // 5 minutes ago
    ]
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
