const express = require('express');
const {
  getPublicStats,
  getPublicGrievances,
  getPublicCategories,
  getPublicRegions,
  getPublicTrends,
  getPublicLeaderboard
} = require('../controllers/publicController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required, but optional for enhanced features)

// @desc    Get public statistics
// @route   GET /api/public/stats
// @access  Public
router.get('/stats', getPublicStats);

// @desc    Get public grievances (limited data)
// @route   GET /api/public/grievances
// @access  Public
router.get('/grievances', getPublicGrievances);

// @desc    Get public categories
// @route   GET /api/public/categories
// @access  Public
router.get('/categories', getPublicCategories);

// @desc    Get public regions
// @route   GET /api/public/regions
// @access  Public
router.get('/regions', getPublicRegions);

// @desc    Get public trends
// @route   GET /api/public/trends
// @access  Public
router.get('/trends', getPublicTrends);

// @desc    Get public leaderboard (top contributors)
// @route   GET /api/public/leaderboard
// @access  Public
router.get('/leaderboard', getPublicLeaderboard);

module.exports = router;
