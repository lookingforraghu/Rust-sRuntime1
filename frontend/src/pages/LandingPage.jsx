import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Award, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rust-900 via-rust-800 to-orange-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            RUST'S RUNTIME
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Citizen Grievance & Reward System
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto">
            A modern platform for citizens to submit grievances, track progress, and earn rewards for their civic engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              Get Started <ArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/public-dashboard" 
              className="border-2 border-white text-white hover:bg-white hover:text-rust-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Rust's Runtime?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <Shield className="w-16 h-16 text-rust-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Transparent</h3>
              <p className="text-gray-600">Your grievances are handled with complete transparency and security.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <Users className="w-16 h-16 text-rust-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600">Built for citizens, by citizens. Your voice matters.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <Award className="w-16 h-16 text-rust-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reward System</h3>
              <p className="text-gray-600">Earn points and rewards for active civic participation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Our Platform</h2>
              <p className="text-lg text-gray-600 mb-6">
                Rust's Runtime is a comprehensive citizen grievance management system that bridges the gap between citizens and local government. 
                Our platform ensures that every voice is heard and every concern is addressed.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With advanced AI categorization, real-time tracking, and a rewarding system, we make civic engagement both effective and rewarding.
              </p>
              <div className="flex items-center space-x-4">
                <BarChart3 className="w-8 h-8 text-rust-600" />
                <span className="text-lg font-semibold text-gray-900">Real-time Analytics</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-rust-600 rounded-full mr-3"></div>
                  <span>AI-powered grievance categorization</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-rust-600 rounded-full mr-3"></div>
                  <span>Real-time status tracking</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-rust-600 rounded-full mr-3"></div>
                  <span>Reward points system</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-rust-600 rounded-full mr-3"></div>
                  <span>Mobile-responsive design</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-rust-600 rounded-full mr-3"></div>
                  <span>Secure file uploads</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-rust-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of citizens who are already making a difference in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white hover:bg-white hover:text-rust-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
