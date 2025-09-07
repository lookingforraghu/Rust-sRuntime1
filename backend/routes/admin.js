const express = require('express');
const {
  getAdminDashboard,
  getAssignedGrievances,
  getAdminStats,
  getAdminPerformance,
  updateAdminProfile,
  getAdminNotifications,
  markNotificationAsRead,
  getAdminRewards,
  claimAdminReward
} = require('../controllers/adminController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorize('admin'));

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', getAdminDashboard);

// @desc    Get assigned grievances
// @route   GET /api/admin/grievances
// @access  Private (Admin)
router.get('/grievances', getAssignedGrievances);

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
router.get('/stats', getAdminStats);

// @desc    Get admin performance metrics
// @route   GET /api/admin/performance
// @access  Private (Admin)
router.get('/performance', getAdminPerformance);

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
router.put('/profile', updateAdminProfile);

// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Private (Admin)
router.get('/notifications', getAdminNotifications);

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private (Admin)
router.put('/notifications/:id/read', markNotificationAsRead);

// @desc    Get admin rewards
// @route   GET /api/admin/rewards
// @access  Private (Admin)
router.get('/rewards', getAdminRewards);

// @desc    Claim admin reward
// @route   POST /api/admin/rewards/:id/claim
// @access  Private (Admin)
router.post('/rewards/:id/claim', claimAdminReward);

module.exports = router;
