# Citizen Grievance Management System

A comprehensive citizen grievance and reward management system built with React Native and Node.js, designed to bridge the gap between citizens and government services.

## 🏛️ Overview

This system provides a complete solution for managing citizen grievances with role-based access for different stakeholders:

- **Citizens**: Report issues, track progress, earn rewards
- **Government Employees (Admins)**: Manage and resolve grievances
- **Supervisors**: Oversee operations and analytics
- **Public**: View transparent statistics

## ✨ Features

### 🏠 Citizen App
- **Onboarding & Authentication**: Secure sign-up/login with email verification
- **Grievance Submission**: Easy reporting with photo/video uploads and location mapping
- **Real-time Tracking**: Monitor grievance status with timeline updates
- **Rewards System**: Earn points and unlock gender-specific benefits
- **Gamification**: Bronze, Silver, Gold, Platinum tiers with badges
- **Notifications**: Push notifications for updates and reward unlocks

### 👨‍💼 Admin App (Government Employees)
- **Dashboard**: Overview of assigned grievances and performance metrics
- **Grievance Management**: Update status, add comments, upload evidence
- **Performance Tracking**: Monitor resolution times and citizen feedback
- **Reward System**: Earn employee-specific rewards (salary bonuses, leave, etc.)

### 📊 Supervisor App (Higher Authority)
- **Analytics Dashboard**: Comprehensive statistics and performance metrics
- **Department Management**: Oversee all departments and their performance
- **Grievance Reassignment**: Route grievances to appropriate departments
- **Employee Leaderboard**: Track top-performing employees

### 🌐 Public Dashboard
- **Transparent Statistics**: Open access to grievance data
- **Real-time Metrics**: Total grievances, resolution rates, average times
- **Category Breakdown**: Issues by type and region
- **Interactive Maps**: Geographic distribution of grievances

## 🚀 Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens
- **React Native Paper**: Material Design components
- **React Native Maps**: Location services
- **React Native Camera**: Photo/video capture
- **React Native Charts**: Data visualization

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Socket.io**: Real-time communication
- **Cloudinary**: File storage
- **Nodemailer**: Email services
- **Twilio**: SMS services
- **OpenAI**: AI categorization and routing

## 📱 Apps Included

1. **Citizen App** - Mobile app for citizens to report and track grievances
2. **Admin App** - Mobile app for government employees to manage grievances
3. **Supervisor App** - Mobile app for supervisors to oversee operations
4. **Public Dashboard** - Web dashboard for public transparency

## 🎯 Key Features

### AI-Powered Features
- **Smart Categorization**: Automatically categorize grievances using AI
- **Intelligent Routing**: Route grievances to appropriate departments
- **Priority Assessment**: AI-determined priority levels
- **Summary Generation**: Auto-generate grievance summaries

### Reward System
- **Gender-Specific Rewards**:
  - Men: Food coupons, grocery discounts, event entries
  - Women: Bus passes, healthcare vouchers, childcare credits, essentials vouchers
- **Employee Rewards**: Salary bonuses, free rations, extra leave, family scholarships
- **Tier System**: Bronze, Silver, Gold, Platinum with increasing benefits

### Gamification
- **Points System**: Earn points for various activities
- **Badges**: Unlock achievements and milestones
- **Leaderboards**: Compete with other citizens and employees
- **Progress Tracking**: Visual progress bars and statistics

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Expo CLI
- React Native development environment

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Configure your environment variables in .env
npm run dev
```

### Frontend Setup
```bash
npm install
npx expo start
```

### Environment Variables
Create a `.env` file in the backend directory with:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/citizen-grievance
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
OPENAI_API_KEY=your-openai-key
# ... other variables
```

## 📊 Database Schema

### User Model
- Personal information (name, email, phone, gender, age, region)
- Authentication (password, tokens, verification)
- Gamification (points, reward tier, badges)
- Location data (coordinates, address)

### Grievance Model
- Basic info (title, description, category, priority)
- Location (coordinates, address, landmark)
- Media attachments (photos, videos, documents)
- AI data (category, priority, summary, keywords)
- Timeline (status updates, comments, evidence)
- Resolution details and feedback

### Notification Model
- Multi-channel delivery (push, email, SMS)
- Template system with variables
- Delivery tracking and retry mechanism
- Expiration and priority handling

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- XSS protection
- SQL injection prevention
- File upload security
- Account lockout after failed attempts

## 📈 Analytics & Reporting

- Real-time statistics
- Performance metrics
- Resolution time tracking
- Category-wise analysis
- Geographic distribution
- Employee performance
- Citizen engagement metrics

## 🎨 Design System

### Role-Based Themes
- **Citizen App**: Green/Blue (trust, transparency)
- **Admin App**: Dark/Professional
- **Supervisor App**: Purple/Orange (authority, analytics)
- **Public Dashboard**: Neutral (grey/white with accents)

### Components
- Responsive layouts
- Material Design components
- Custom animations
- Accessibility support
- Dark/Light mode support

## 🚀 Deployment

### Backend Deployment
- Docker containerization
- Environment-specific configurations
- Database migrations
- Health checks and monitoring

### Frontend Deployment
- Expo build services
- App store distribution
- OTA updates
- Performance monitoring

## 📱 Mobile Features

- Offline support
- Push notifications
- Camera integration
- GPS location services
- File upload/download
- Biometric authentication
- Deep linking

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Grievances
- `GET /api/grievances` - Get grievances
- `POST /api/grievances` - Create grievance
- `GET /api/grievances/:id` - Get grievance details
- `PUT /api/grievances/:id` - Update grievance
- `POST /api/grievances/:id/assign` - Assign grievance

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/grievances` - Assigned grievances
- `PUT /api/admin/grievances/:id/status` - Update status

### Public
- `GET /api/public/stats` - Public statistics
- `GET /api/public/grievances` - Public grievances

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@citizengrievance.gov
- Phone: +1-800-GRIEVANCE
- Documentation: [Link to docs]

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Voice-to-text grievance submission
- [ ] Blockchain integration for transparency
- [ ] Machine learning for predictive analytics
- [ ] Integration with government databases
- [ ] Advanced reporting and analytics
- [ ] Mobile app for supervisors
- [ ] Web portal for citizens

## 📊 Statistics

- **Total Grievances**: Real-time counter
- **Resolution Rate**: Percentage of resolved issues
- **Average Resolution Time**: Time to resolve grievances
- **Citizen Satisfaction**: Rating-based feedback
- **Department Performance**: Comparative analytics

---

**Built with ❤️ for better governance and citizen engagement**
