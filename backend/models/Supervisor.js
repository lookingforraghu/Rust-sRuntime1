const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
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
  permissions: [{
    type: String,
    enum: ['view_all_data', 'manage_admins', 'view_analytics', 'escalate_grievances', 'export_data']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  managedDepartments: [{
    type: String,
    trim: true
  }],
  performance: {
    totalAdminsManaged: {
      type: Number,
      default: 0
    },
    totalGrievancesOversaw: {
      type: Number,
      default: 0
    },
    averageDepartmentRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
supervisorSchema.index({ user: 1 });
supervisorSchema.index({ department: 1 });
supervisorSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Supervisor', supervisorSchema);
