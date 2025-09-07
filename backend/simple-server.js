const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:19006",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Citizen Grievance System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Auth routes (simplified)
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully (demo mode)',
    data: {
      user: {
        id: 'demo-user-id',
        name: req.body.name || 'Demo User',
        email: req.body.email || 'demo@example.com',
        role: 'citizen'
      },
      token: 'demo-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Login successful (demo mode)',
    data: {
      user: {
        id: 'demo-user-id',
        name: 'Demo User',
        email: req.body.email || 'demo@example.com',
        role: 'citizen',
        points: 150
      },
      token: 'demo-jwt-token'
    }
  });
});

// Grievance routes (simplified)
app.get('/api/grievances', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      grievances: [
        {
          id: '1',
          title: 'Broken Street Light',
          description: 'Street light is not working on Main Street',
          status: 'pending',
          category: 'infrastructure',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Pothole on Road',
          description: 'Large pothole causing traffic issues',
          status: 'in_progress',
          category: 'roads',
          createdAt: new Date().toISOString()
        }
      ]
    }
  });
});

app.post('/api/grievances', (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'Grievance created successfully (demo mode)',
    data: {
      grievance: {
        id: 'new-grievance-id',
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    }
  });
});

// Public stats
app.get('/api/public/stats', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      totalGrievances: 1250,
      resolvedGrievances: 980,
      pendingGrievances: 270,
      averageResolutionTime: 3.5
    }
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Public Stats: http://localhost:${PORT}/api/public/stats`);
});

module.exports = app;
