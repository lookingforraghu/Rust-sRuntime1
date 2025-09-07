const express = require('express');
const { body } = require('express-validator');
const {
  getGrievances,
  getGrievance,
  createGrievance,
  updateGrievance,
  deleteGrievance,
  assignGrievance,
  updateGrievanceStatus,
  resolveGrievance,
  escalateGrievance,
  getGrievanceStats,
  getGrievancesByLocation,
  getGrievancesByCategory,
  addGrievanceComment,
  uploadGrievanceEvidence
} = require('../controllers/grievanceController');
const { authenticateToken, authorize, hasPermission, authorizeOwnershipOrAdmin } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const createGrievanceValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn(['infrastructure', 'sanitation', 'water', 'electricity', 'roads', 'healthcare', 'education', 'safety', 'environment', 'corruption', 'other'])
    .withMessage('Invalid category'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of 2 numbers'),
  body('location.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters')
];

const updateGrievanceValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['infrastructure', 'sanitation', 'water', 'electricity', 'roads', 'healthcare', 'education', 'safety', 'environment', 'corruption', 'other'])
    .withMessage('Invalid category')
];

const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
];

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private
router.get('/', getGrievances);

// @desc    Get grievance statistics
// @route   GET /api/grievances/stats
// @access  Private
router.get('/stats', getGrievanceStats);

// @desc    Get grievances by location
// @route   GET /api/grievances/location
// @access  Private
router.get('/location', getGrievancesByLocation);

// @desc    Get grievances by category
// @route   GET /api/grievances/category/:category
// @access  Private
router.get('/category/:category', getGrievancesByCategory);

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
router.get('/:id', getGrievance);

// @desc    Create new grievance
// @route   POST /api/grievances
// @access  Private (Citizen)
router.post('/', hasPermission('create_grievance'), createGrievanceValidation, validateRequest, createGrievance);

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private
router.put('/:id', authorizeOwnershipOrAdmin('citizen'), updateGrievanceValidation, validateRequest, updateGrievance);

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private
router.delete('/:id', authorizeOwnershipOrAdmin('citizen'), deleteGrievance);

// @desc    Assign grievance to admin
// @route   POST /api/grievances/:id/assign
// @access  Private (Admin/Supervisor)
router.post('/:id/assign', authorize('admin', 'supervisor'), assignGrievance);

// @desc    Update grievance status
// @route   PUT /api/grievances/:id/status
// @access  Private (Admin/Supervisor)
router.put('/:id/status', authorize('admin', 'supervisor'), statusUpdateValidation, validateRequest, updateGrievanceStatus);

// @desc    Resolve grievance
// @route   POST /api/grievances/:id/resolve
// @access  Private (Admin/Supervisor)
router.post('/:id/resolve', authorize('admin', 'supervisor'), resolveGrievance);

// @desc    Escalate grievance
// @route   POST /api/grievances/:id/escalate
// @access  Private (Admin/Supervisor)
router.post('/:id/escalate', authorize('admin', 'supervisor'), escalateGrievance);

// @desc    Add comment to grievance
// @route   POST /api/grievances/:id/comments
// @access  Private
router.post('/:id/comments', addGrievanceComment);

// @desc    Upload evidence for grievance
// @route   POST /api/grievances/:id/evidence
// @access  Private (Admin/Supervisor)
router.post('/:id/evidence', authorize('admin', 'supervisor'), upload.array('files', 5), uploadGrievanceEvidence);

module.exports = router;
