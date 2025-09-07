const Grievance = require('../models/Grievance');

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private
const getGrievances = async (req, res, next) => {
  try {
    const grievances = await Grievance.find().populate('citizen', 'name email');
    res.status(200).json({
      status: 'success',
      data: { grievances }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
const getGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id).populate('citizen', 'name email');
    if (!grievance) {
      return res.status(404).json({
        status: 'error',
        message: 'Grievance not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: { grievance }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new grievance
// @route   POST /api/grievances
// @access  Private (Citizen)
const createGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.create({
      ...req.body,
      citizen: req.user.id
    });
    res.status(201).json({
      status: 'success',
      data: { grievance }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private
const updateGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!grievance) {
      return res.status(404).json({
        status: 'error',
        message: 'Grievance not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { grievance }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private
const deleteGrievance = async (req, res, next) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);
    if (!grievance) {
      return res.status(404).json({
        status: 'error',
        message: 'Grievance not found'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Grievance deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get grievance statistics
// @route   GET /api/grievances/stats
// @access  Private
const getGrievanceStats = async (req, res, next) => {
  try {
    const stats = await Grievance.getGrievanceStats();
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// Placeholder functions for other routes
const assignGrievance = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Grievance assigned' });
};

const updateGrievanceStatus = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Status updated' });
};

const resolveGrievance = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Grievance resolved' });
};

const escalateGrievance = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Grievance escalated' });
};

const getGrievancesByLocation = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { grievances: [] } });
};

const getGrievancesByCategory = async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { grievances: [] } });
};

const addGrievanceComment = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Comment added' });
};

const uploadGrievanceEvidence = async (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'Evidence uploaded' });
};

module.exports = {
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
};
