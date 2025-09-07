const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'infrastructure',
      'sanitation',
      'water',
      'electricity',
      'roads',
      'healthcare',
      'education',
      'safety',
      'environment',
      'corruption',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  department: {
    type: String,
    required: true
  },
  // Location information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    country: String,
    pincode: String,
    landmark: String
  },
  // Media attachments
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // AI-generated data
  aiCategory: String,
  aiPriority: String,
  aiSummary: String,
  aiKeywords: [String],
  // Timeline and updates
  timeline: [{
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected']
    },
    comment: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      type: String,
      url: String,
      filename: String
    }]
  }],
  // Resolution details
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    evidence: [{
      type: String,
      url: String,
      description: String
    }]
  },
  // Feedback and rating
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  // Estimated resolution time
  estimatedResolution: Date,
  actualResolution: Date,
  // Escalation
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: Date,
  escalatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  escalationReason: String,
  // Tags for better organization
  tags: [String],
  // Visibility settings
  isPublic: {
    type: Boolean,
    default: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  // Points awarded
  pointsAwarded: {
    type: Number,
    default: 0
  },
  // Related grievances
  relatedGrievances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grievance'
  }],
  // Follow-up required
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
grievanceSchema.index({ location: '2dsphere' });
grievanceSchema.index({ citizen: 1, createdAt: -1 });
grievanceSchema.index({ assignedTo: 1, status: 1 });
grievanceSchema.index({ category: 1, status: 1 });
grievanceSchema.index({ status: 1, createdAt: -1 });
grievanceSchema.index({ department: 1, status: 1 });
grievanceSchema.index({ priority: 1, status: 1 });
grievanceSchema.index({ 'location.coordinates': '2dsphere' });

// Text index for search
grievanceSchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text'
});

// Virtual for resolution time
grievanceSchema.virtual('resolutionTime').get(function() {
  if (this.actualResolution && this.createdAt) {
    return this.actualResolution - this.createdAt;
  }
  return null;
});

// Virtual for days since creation
grievanceSchema.virtual('daysSinceCreation').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timeline
grievanceSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      updatedAt: new Date()
    });
  }
  next();
});

// Pre-save middleware to set resolution date
grievanceSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.actualResolution) {
    this.actualResolution = new Date();
  }
  next();
});

// Instance method to add timeline entry
grievanceSchema.methods.addTimelineEntry = function(status, comment, updatedBy, attachments = []) {
  this.timeline.push({
    status,
    comment,
    updatedBy,
    updatedAt: new Date(),
    attachments
  });
  this.status = status;
  return this.save();
};

// Instance method to assign to admin
grievanceSchema.methods.assignToAdmin = function(adminId) {
  this.assignedTo = adminId;
  this.status = 'in_progress';
  this.timeline.push({
    status: 'in_progress',
    comment: 'Grievance assigned to admin',
    updatedBy: adminId,
    updatedAt: new Date()
  });
  return this.save();
};

// Instance method to resolve grievance
grievanceSchema.methods.resolveGrievance = function(resolution, resolvedBy, evidence = []) {
  this.status = 'resolved';
  this.resolution = {
    description: resolution,
    resolvedAt: new Date(),
    resolvedBy,
    evidence
  };
  this.actualResolution = new Date();
  this.timeline.push({
    status: 'resolved',
    comment: resolution,
    updatedBy: resolvedBy,
    updatedAt: new Date(),
    attachments: evidence
  });
  return this.save();
};

// Instance method to escalate grievance
grievanceSchema.methods.escalate = function(escalatedTo, reason) {
  this.escalated = true;
  this.escalatedAt = new Date();
  this.escalatedTo = escalatedTo;
  this.escalationReason = reason;
  this.timeline.push({
    status: this.status,
    comment: `Escalated: ${reason}`,
    updatedBy: escalatedTo,
    updatedAt: new Date()
  });
  return this.save();
};

// Static method to find grievances by location
grievanceSchema.statics.findByLocation = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Static method to get grievance statistics
grievanceSchema.statics.getGrievanceStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResolutionTime: {
          $avg: {
            $cond: [
              { $ne: ['$actualResolution', null] },
              { $subtract: ['$actualResolution', '$createdAt'] },
              null
            ]
          }
        }
      }
    }
  ]);
};

// Static method to get category statistics
grievanceSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Grievance', grievanceSchema);
