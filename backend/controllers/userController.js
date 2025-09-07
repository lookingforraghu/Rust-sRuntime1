const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Supervisor)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin/Supervisor)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/Supervisor)
const getUserStats = async (req, res, next) => {
  try {
    const stats = await User.getUserStats();
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user grievances
// @route   GET /api/users/:id/grievances
// @access  Private
const getUserGrievances = async (req, res, next) => {
  try {
    // This would be implemented with the Grievance model
    res.status(200).json({
      status: 'success',
      data: { grievances: [] }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user rewards
// @route   GET /api/users/:id/rewards
// @access  Private
const getUserRewards = async (req, res, next) => {
  try {
    // This would be implemented with the Reward model
    res.status(200).json({
      status: 'success',
      data: { rewards: [] }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user points
// @route   PUT /api/users/:id/points
// @access  Private (Admin/Supervisor)
const updateUserPoints = async (req, res, next) => {
  try {
    const { points } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { points } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add user badge
// @route   POST /api/users/:id/badges
// @access  Private (Admin/Supervisor)
const addUserBadge = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { badges: { name, description, earnedAt: new Date() } } },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserGrievances,
  getUserRewards,
  updateUserPoints,
  addUserBadge
};
