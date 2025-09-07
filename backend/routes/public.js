const express = require('express');
const router = express.Router();

// Public routes that don't require authentication

// Get public statistics
router.get('/stats', async (req, res) => {
  try {
    // Mock public statistics
    const stats = {
      totalGrievances: 1250,
      resolvedGrievances: 980,
      pendingGrievances: 270,
      resolutionRate: 78.4,
      averageResolutionTime: 5.2
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public statistics'
    });
  }
});

// Get public grievances (limited info)
router.get('/grievances', async (req, res) => {
  try {
    // Mock public grievances
    const grievances = [
      {
        id: 1,
        title: 'Road Repair Needed',
        category: 'Infrastructure',
        status: 'In Progress',
        date: '2025-01-07'
      },
      {
        id: 2,
        title: 'Water Supply Issue',
        category: 'Utilities',
        status: 'Resolved',
        date: '2025-01-06'
      }
    ];
    
    res.json({
      success: true,
      data: grievances
    });
  } catch (error) {
    console.error('Public grievances error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public grievances'
    });
  }
});

module.exports = router;
