import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Grievance API
export const grievanceAPI = {
  getGrievances: async (params?: any) => {
    const response = await api.get('/grievances', { params });
    return response.data;
  },

  getGrievance: async (id: string) => {
    const response = await api.get(`/grievances/${id}`);
    return response.data;
  },

  createGrievance: async (grievanceData: any) => {
    const response = await api.post('/grievances', grievanceData);
    return response.data;
  },

  updateGrievance: async (id: string, grievanceData: any) => {
    const response = await api.put(`/grievances/${id}`, grievanceData);
    return response.data;
  },

  deleteGrievance: async (id: string) => {
    const response = await api.delete(`/grievances/${id}`);
    return response.data;
  },

  getGrievanceStats: async () => {
    const response = await api.get('/grievances/stats');
    return response.data;
  },

  getGrievancesByLocation: async (coordinates: [number, number], radius?: number) => {
    const response = await api.get('/grievances/location', {
      params: { coordinates, radius },
    });
    return response.data;
  },

  getGrievancesByCategory: async (category: string) => {
    const response = await api.get(`/grievances/category/${category}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  getUserGrievances: async (id: string) => {
    const response = await api.get(`/users/${id}/grievances`);
    return response.data;
  },

  getUserRewards: async (id: string) => {
    const response = await api.get(`/users/${id}/rewards`);
    return response.data;
  },

  updateUserPoints: async (id: string, points: number) => {
    const response = await api.put(`/users/${id}/points`, { points });
    return response.data;
  },

  addUserBadge: async (id: string, badgeData: any) => {
    const response = await api.post(`/users/${id}/badges`, badgeData);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (params?: any) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getNotification: async (id: string) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  },
};

// Reward API
export const rewardAPI = {
  getRewards: async () => {
    const response = await api.get('/rewards');
    return response.data;
  },

  getReward: async (id: string) => {
    const response = await api.get(`/rewards/${id}`);
    return response.data;
  },

  claimReward: async (id: string) => {
    const response = await api.post(`/rewards/${id}/claim`);
    return response.data;
  },

  getUserRewards: async (userId: string) => {
    const response = await api.get(`/rewards/user/${userId}`);
    return response.data;
  },

  getRewardStats: async () => {
    const response = await api.get('/rewards/stats');
    return response.data;
  },
};

// Public API
export const publicAPI = {
  getStats: async () => {
    const response = await api.get('/public/stats');
    return response.data;
  },

  getPublicGrievances: async (params?: any) => {
    const response = await api.get('/public/grievances', { params });
    return response.data;
  },

  getPublicCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  getPublicRegions: async () => {
    const response = await api.get('/public/regions');
    return response.data;
  },

  getPublicTrends: async () => {
    const response = await api.get('/public/trends');
    return response.data;
  },

  getPublicLeaderboard: async () => {
    const response = await api.get('/public/leaderboard');
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultipleFiles: async (files: any[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (filename: string) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },
};

export default api;
