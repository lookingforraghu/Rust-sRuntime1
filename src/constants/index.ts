// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// App Configuration
export const APP_CONFIG = {
  name: 'Citizen Grievance System',
  version: '1.0.0',
  supportEmail: 'support@citizengrievance.gov',
  supportPhone: '+1-800-GRIEVANCE',
};

// Grievance Categories
export const GRIEVANCE_CATEGORIES = [
  { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️' },
  { id: 'sanitation', name: 'Sanitation & Hygiene', icon: '🧹' },
  { id: 'water', name: 'Water Supply', icon: '💧' },
  { id: 'electricity', name: 'Electricity', icon: '⚡' },
  { id: 'roads', name: 'Roads & Transportation', icon: '🛣️' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'safety', name: 'Public Safety', icon: '🚨' },
  { id: 'environment', name: 'Environment', icon: '🌱' },
  { id: 'corruption', name: 'Corruption', icon: '⚖️' },
  { id: 'other', name: 'Other', icon: '📝' },
];

// Grievance Status
export const GRIEVANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const;

export const STATUS_LABELS = {
  [GRIEVANCE_STATUS.PENDING]: 'Pending',
  [GRIEVANCE_STATUS.IN_PROGRESS]: 'In Progress',
  [GRIEVANCE_STATUS.RESOLVED]: 'Resolved',
  [GRIEVANCE_STATUS.REJECTED]: 'Rejected',
};

export const STATUS_COLORS = {
  [GRIEVANCE_STATUS.PENDING]: '#FF9800',
  [GRIEVANCE_STATUS.IN_PROGRESS]: '#2196F3',
  [GRIEVANCE_STATUS.RESOLVED]: '#4CAF50',
  [GRIEVANCE_STATUS.REJECTED]: '#F44336',
};

// User Roles
export const USER_ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  PUBLIC: 'public',
} as const;

// Reward Tiers
export const REWARD_TIERS = {
  BRONZE: { min: 0, max: 100, name: 'Bronze', color: '#CD7F32' },
  SILVER: { min: 101, max: 500, name: 'Silver', color: '#C0C0C0' },
  GOLD: { min: 501, max: 1000, name: 'Gold', color: '#FFD700' },
  PLATINUM: { min: 1001, max: Infinity, name: 'Platinum', color: '#E5E4E2' },
};

// Gender-based Rewards
export const GENDER_REWARDS = {
  male: [
    { id: 'food_coupon', name: 'Food Coupon', points: 50, icon: '🍕' },
    { id: 'grocery_discount', name: 'Grocery Discount', points: 100, icon: '🛒' },
    { id: 'event_entry', name: 'Event Entry', points: 200, icon: '🎫' },
  ],
  female: [
    { id: 'bus_pass', name: 'Bus Pass', points: 50, icon: '🚌' },
    { id: 'healthcare_voucher', name: 'Healthcare Voucher', points: 100, icon: '🏥' },
    { id: 'childcare_credit', name: 'Childcare Credit', points: 150, icon: '👶' },
    { id: 'essentials_voucher', name: 'Essentials Voucher', points: 200, icon: '🛍️' },
  ],
};

// Employee Rewards
export const EMPLOYEE_REWARDS = [
  { id: 'salary_bonus', name: 'Salary Bonus', points: 1000, icon: '💰' },
  { id: 'free_rations', name: 'Free Rations', points: 500, icon: '🍞' },
  { id: 'extra_leave', name: 'Extra Leave', points: 300, icon: '🏖️' },
  { id: 'family_scholarship', name: 'Family Scholarship', points: 2000, icon: '🎓' },
];

// Points System
export const POINTS_SYSTEM = {
  GRIEVANCE_SUBMITTED: 10,
  GRIEVANCE_RESOLVED: 50,
  FEEDBACK_PROVIDED: 20,
  RATING_5_STAR: 30,
  RATING_4_STAR: 20,
  RATING_3_STAR: 10,
  FIRST_GRIEVANCE: 25,
  MONTHLY_ACTIVE: 100,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  GRIEVANCE_UPDATE: 'grievance_update',
  REWARD_UNLOCKED: 'reward_unlocked',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  REMINDER: 'reminder',
} as const;

// Map Configuration
export const MAP_CONFIG = {
  defaultRegion: {
    latitude: 28.6139, // Delhi coordinates
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  markers: {
    grievance: {
      color: '#FF5722',
      size: 30,
    },
    resolved: {
      color: '#4CAF50',
      size: 25,
    },
  },
};

// File Upload Configuration
export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'],
  maxFiles: 5,
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_SETTINGS: 'notification_settings',
  THEME_PREFERENCE: 'theme_preference',
};
