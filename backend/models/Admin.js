const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  permissions: [{
    type: String,
    enum: ['read_grievances', 'update_grievances', 'assign_grievances', 'resolve_grievances', 'escalate_grievances']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  performance: {
    totalGrievancesAssigned: {
      type: Number,
      default: 0
    },
    totalGrievancesResolved: {
      type: Number,
      default: 0
    },
    averageResolutionTime: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  rewards: [{
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    points: Number
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
adminSchema.index({ user: 1 });
adminSchema.index({ department: 1 });
adminSchema.index({ employeeId: 1 });

// Virtual for resolution rate
adminSchema.virtual('resolutionRate').get(function() {
  if (this.performance.totalGrievancesAssigned === 0) return 0;
  return (this.performance.totalGrievancesResolved / this.performance.totalGrievancesAssigned) * 100;
});

module.exports = mongoose.model('Admin', adminSchema);
