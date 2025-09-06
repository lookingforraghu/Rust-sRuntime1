# Rust's Runtime - Citizen Grievance & Reward System

A comprehensive citizen grievance and reward management system built with React and Node.js.

## Features
- Citizen grievance submission and tracking
- Reward points system with QR codes
- Admin dashboard for grievance management
- Supervisor analytics and reporting
- Public dashboard with statistics
- AI-powered categorization and routing

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB, JWT
- **File Upload**: Multer, Cloudinary
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure
```
Rust-sRuntime1/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── contexts/  # React contexts
│   │   └── components/ # Reusable components
│   └── package.json
├── backend/           # Node.js API server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── package.json
└── README.md
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Features Overview

### Citizen Features
- Submit grievances with AI categorization
- Track grievance status with timeline
- Earn reward points for civic engagement
- View personalized dashboard

### Admin Features
- Manage all grievances
- Update status and add comments
- Upload resolution proof
- Track performance metrics

### Supervisor Features
- Department analytics
- Employee performance tracking
- Re-assign grievances
- Generate reports

### Public Dashboard
- Real-time statistics
- Grievance category breakdown
- Regional heatmap
- Resolution time analytics

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Grievances
- `GET /api/grievances` - List grievances
- `POST /api/grievances` - Create grievance
- `PATCH /api/grievances/:id` - Update grievance
- `GET /api/grievances/:id` - Get grievance details

### Rewards
- `GET /api/rewards/points` - Get user points
- `POST /api/rewards/claim` - Claim reward
- `GET /api/rewards/history` - Reward history

### Analytics
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/departments` - Department performance
- `GET /api/analytics/leaderboard` - Employee leaderboard

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/rust-runtime
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
