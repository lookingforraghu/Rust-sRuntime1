const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Reward name is required'],
    trim: true,
    maxlength: [100, 'Reward name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Reward description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['citizen', 'employee'],
    required: true
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'healthcare', 'education', 'entertainment', 'other'],
    required: true
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Points required is required'],
    min: [1, 'Points required must be at least 1']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'all'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: Date,
  maxRedemptions: {
    type: Number,
    default: null
  },
  currentRedemptions: {
    type: Number,
    default: 0
  },
  image: String,
  terms: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
rewardSchema.index({ type: 1, isActive: 1 });
rewardSchema.index({ pointsRequired: 1 });
rewardSchema.index({ gender: 1 });

// Virtual for availability
rewardSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false;
  if (this.expiryDate && this.expiryDate < new Date()) return false;
  if (this.maxRedemptions && this.currentRedemptions >= this.maxRedemptions) return false;
  return true;
});

module.exports = mongoose.model('Reward', rewardSchema);
