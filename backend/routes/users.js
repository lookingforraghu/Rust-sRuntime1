const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  getUserGrievances,
  getUserRewards,
  updateUserPoints,
  addUserBadge
} = require('../controllers/userController');
const { authenticateToken, authorize, hasPermission } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  body('region')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Region must be between 2 and 100 characters')
];

// @desc    Get all users (Admin/Supervisor only)
// @route   GET /api/users
// @access  Private (Admin/Supervisor)
router.get('/', authorize('admin', 'supervisor'), getUsers);

// @desc    Get user statistics (Admin/Supervisor only)
// @route   GET /api/users/stats
// @access  Private (Admin/Supervisor)
router.get('/stats', authorize('admin', 'supervisor'), getUserStats);

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
router.get('/me', getUser);

// @desc    Get user by ID (Admin/Supervisor only)
// @route   GET /api/users/:id
// @access  Private (Admin/Supervisor)
router.get('/:id', authorize('admin', 'supervisor'), getUser);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', updateUserValidation, validateRequest, updateUser);

// @desc    Update user by ID (Admin/Supervisor only)
// @route   PUT /api/users/:id
// @access  Private (Admin/Supervisor)
router.put('/:id', authorize('admin', 'supervisor'), updateUserValidation, validateRequest, updateUser);

// @desc    Delete user (Admin/Supervisor only)
// @route   DELETE /api/users/:id
// @access  Private (Admin/Supervisor)
router.delete('/:id', authorize('admin', 'supervisor'), deleteUser);

// @desc    Get user grievances
// @route   GET /api/users/:id/grievances
// @access  Private
router.get('/:id/grievances', hasPermission('read_own_grievances'), getUserGrievances);

// @desc    Get user rewards
// @route   GET /api/users/:id/rewards
// @access  Private
router.get('/:id/rewards', getUserRewards);

// @desc    Update user points (Admin/Supervisor only)
// @route   PUT /api/users/:id/points
// @access  Private (Admin/Supervisor)
router.put('/:id/points', authorize('admin', 'supervisor'), updateUserPoints);

// @desc    Add user badge (Admin/Supervisor only)
// @route   POST /api/users/:id/badges
// @access  Private (Admin/Supervisor)
router.post('/:id/badges', authorize('admin', 'supervisor'), addUserBadge);

module.exports = router;
