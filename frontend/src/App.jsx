import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitGrievance from './pages/SubmitGrievance';
import TrackGrievances from './pages/TrackGrievances';
import RewardsPage from './pages/RewardsPage';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import PublicDashboard from './pages/PublicDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/submit-grievance" element={<SubmitGrievance />} />
            <Route path="/track-grievances" element={<TrackGrievances />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/public-dashboard" element={<PublicDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
