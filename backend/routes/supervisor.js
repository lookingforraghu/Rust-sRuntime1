const express = require('express');
const {
  getSupervisorDashboard,
  getAllDepartments,
  getDepartmentStats,
  getEmployeeLeaderboard,
  reassignGrievance,
  getSupervisorAnalytics,
  getSystemOverview,
  getPerformanceMetrics,
  getGrievanceTrends,
  exportData
} = require('../controllers/supervisorController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and supervisor role
router.use(authenticateToken);
router.use(authorize('supervisor'));

// @desc    Get supervisor dashboard
// @route   GET /api/supervisor/dashboard
// @access  Private (Supervisor)
router.get('/dashboard', getSupervisorDashboard);

// @desc    Get all departments
// @route   GET /api/supervisor/departments
// @access  Private (Supervisor)
router.get('/departments', getAllDepartments);

// @desc    Get department statistics
// @route   GET /api/supervisor/departments/:id/stats
// @access  Private (Supervisor)
router.get('/departments/:id/stats', getDepartmentStats);

// @desc    Get employee leaderboard
// @route   GET /api/supervisor/leaderboard
// @access  Private (Supervisor)
router.get('/leaderboard', getEmployeeLeaderboard);

// @desc    Reassign grievance
// @route   POST /api/supervisor/grievances/:id/reassign
// @access  Private (Supervisor)
router.post('/grievances/:id/reassign', reassignGrievance);

// @desc    Get supervisor analytics
// @route   GET /api/supervisor/analytics
// @access  Private (Supervisor)
router.get('/analytics', getSupervisorAnalytics);

// @desc    Get system overview
// @route   GET /api/supervisor/overview
// @access  Private (Supervisor)
router.get('/overview', getSystemOverview);

// @desc    Get performance metrics
// @route   GET /api/supervisor/metrics
// @access  Private (Supervisor)
router.get('/metrics', getPerformanceMetrics);

// @desc    Get grievance trends
// @route   GET /api/supervisor/trends
// @access  Private (Supervisor)
router.get('/trends', getGrievanceTrends);

// @desc    Export data
// @route   GET /api/supervisor/export
// @access  Private (Supervisor)
router.get('/export', exportData);

module.exports = router;
