const express = require('express');
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFile
} = require('../controllers/uploadController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
router.post('/single', upload.single('file'), uploadFile);

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', upload.array('files', 5), uploadMultipleFiles);

// @desc    Get file
// @route   GET /api/upload/:filename
// @access  Private
router.get('/:filename', getFile);

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', deleteFile);

module.exports = router;
