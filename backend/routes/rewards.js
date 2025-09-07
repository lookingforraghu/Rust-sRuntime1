const express = require('express');
const {
  getRewards,
  getReward,
  claimReward,
  getUserRewards,
  getRewardStats,
  createReward,
  updateReward,
  deleteReward
} = require('../controllers/rewardController');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @desc    Get all available rewards
// @route   GET /api/rewards
// @access  Private
router.get('/', getRewards);

// @desc    Get reward by ID
// @route   GET /api/rewards/:id
// @access  Private
router.get('/:id', getReward);

// @desc    Claim reward
// @route   POST /api/rewards/:id/claim
// @access  Private
router.post('/:id/claim', claimReward);

// @desc    Get user's rewards
// @route   GET /api/rewards/user/:userId
// @access  Private
router.get('/user/:userId', getUserRewards);

// @desc    Get reward statistics
// @route   GET /api/rewards/stats
// @access  Private
router.get('/stats', getRewardStats);

// Admin/Supervisor routes
// @desc    Create reward (Admin/Supervisor only)
// @route   POST /api/rewards
// @access  Private (Admin/Supervisor)
router.post('/', authorize('admin', 'supervisor'), createReward);

// @desc    Update reward (Admin/Supervisor only)
// @route   PUT /api/rewards/:id
// @access  Private (Admin/Supervisor)
router.put('/:id', authorize('admin', 'supervisor'), updateReward);

// @desc    Delete reward (Admin/Supervisor only)
// @route   DELETE /api/rewards/:id
// @access  Private (Admin/Supervisor)
router.delete('/:id', authorize('admin', 'supervisor'), deleteReward);

module.exports = router;
