import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  SafeAreaView,
  Image,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
  PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Responsive Design System - Spotify-inspired
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isDesktop = screenWidth >= 1024;
const isLandscape = screenWidth > screenHeight;
const isSmallScreen = screenWidth < 375; // iPhone SE, small Android
const isLargeScreen = screenWidth > 414; // iPhone Pro Max, large Android

// Responsive scaling factors
const scale = (size) => {
  if (isSmallScreen) return size * 0.9;
  if (isLargeScreen) return size * 1.1;
  return size;
};

const verticalScale = (size) => {
  if (isLandscape) return size * 0.8;
  return size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const Colors = {
  primary: '#1DB954', // Green
  secondary: '#FFFFFF',
  accent: '#1ED760', // Lighter Green
  success: '#1DB954',
  warning: '#FFA500',
  error: '#FF6B6B',
  background: '#000000', // Black background
  surface: '#000000', // Black surface
  text: '#FFFFFF', // White text
  textSecondary: '#CCCCCC', // Light gray text
  border: '#1DB954', // Green borders
  shadow: 'rgba(0, 0, 0, 0.3)',
  gradient: ['#000000', '#1DB954'],
  gradientAccent: ['#1DB954', '#1ED760'],
};

const Typography = {
  h1: { 
    fontSize: moderateScale(isDesktop ? 48 : isTablet ? 40 : 32), 
    fontWeight: '900', 
    lineHeight: moderateScale(isDesktop ? 56 : isTablet ? 48 : 40),
    textAlign: 'center'
  },
  h2: { 
    fontSize: moderateScale(isDesktop ? 36 : isTablet ? 32 : 28), 
    fontWeight: '800', 
    lineHeight: moderateScale(isDesktop ? 44 : isTablet ? 40 : 36),
    textAlign: 'center'
  },
  h3: { 
    fontSize: moderateScale(isDesktop ? 28 : isTablet ? 24 : 22), 
    fontWeight: '700', 
    lineHeight: moderateScale(isDesktop ? 36 : isTablet ? 32 : 30),
    textAlign: 'center'
  },
  h4: { 
    fontSize: moderateScale(isDesktop ? 22 : isTablet ? 20 : 18), 
    fontWeight: '600', 
    lineHeight: moderateScale(isDesktop ? 30 : isTablet ? 28 : 26),
    textAlign: 'center'
  },
  body: { 
    fontSize: moderateScale(isDesktop ? 18 : isTablet ? 16 : 14), 
    fontWeight: '400', 
    lineHeight: moderateScale(isDesktop ? 26 : isTablet ? 24 : 22),
    textAlign: 'center'
  },
  caption: { 
    fontSize: moderateScale(isDesktop ? 14 : isTablet ? 12 : 10), 
    fontWeight: '400', 
    lineHeight: moderateScale(isDesktop ? 20 : isTablet ? 18 : 16),
    textAlign: 'center'
  },
  button: {
    fontSize: moderateScale(isDesktop ? 18 : isTablet ? 16 : 14),
    fontWeight: '600',
    textAlign: 'center'
  },
  label: {
    fontSize: moderateScale(isDesktop ? 16 : isTablet ? 14 : 12),
    fontWeight: '500',
    textAlign: 'left'
  }
};

const Spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
  xxxl: scale(64),
  // Responsive spacing
  screenPadding: scale(isLandscape ? 16 : 20),
  sectionPadding: scale(isLandscape ? 12 : 16),
  cardPadding: scale(isLandscape ? 12 : 16),
  buttonPadding: scale(isLandscape ? 12 : 16),
  inputPadding: scale(isLandscape ? 12 : 16),
};

const BorderRadius = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
  full: 9999,
  // Responsive border radius
  button: scale(12),
  card: scale(16),
  input: scale(12),
  modal: scale(20),
};

// Animation configurations
const AnimationConfig = {
  spring: { type: 'spring', damping: 20, stiffness: 300 },
  timing: { duration: 300 },
  bounce: { type: 'spring', damping: 15, stiffness: 200 },
};

// Mock API functions (replace with actual API calls)
const API = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: {
        id: 1,
        email: email,
        name: 'John Doe',
        role: 'citizen', // citizen, admin, supervisor
        phone: '+1234567890'
      },
      token: 'mock-jwt-token'
    };
  },
  
  signup: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: {
        id: 2,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'citizen',
        phone: userData.phone
      },
      token: 'mock-jwt-token'
    };
  },
  
  sendOTP: async (phone) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'OTP sent successfully' };
  },
  
  verifyOTP: async (phone, otp) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, user: { id: 3, phone, role: 'citizen' } };
  },
  
  submitGrievance: async (grievance) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, id: Date.now() };
  },
  
  getGrievances: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, title: 'Road Repair Needed', status: 'Pending', date: '2025-01-07', category: 'Infrastructure', severity: 'Important', complexity: 'Medium' },
      { id: 2, title: 'Water Supply Issue', status: 'In Progress', date: '2025-01-06', category: 'Utilities', severity: 'Very Important', complexity: 'High' },
      { id: 3, title: 'Street Light Not Working', status: 'Resolved', date: '2025-01-05', category: 'Infrastructure', severity: 'Low', complexity: 'Low' }
    ];
  },
  
  categorizeGrievance: async (title, description) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Enhanced AI categorization logic
    const keywords = (title + ' ' + description).toLowerCase();
    let severity = 'Normal';
    let complexity = 'Low';
    let category = 'General';
    
    // Very Important - Emergency situations
    if (keywords.includes('emergency') || keywords.includes('urgent') || keywords.includes('fire') || 
        keywords.includes('flood') || keywords.includes('accident') || keywords.includes('crime') ||
        keywords.includes('gas leak') || keywords.includes('electrical hazard') || keywords.includes('structural damage')) {
      severity = 'Very Important';
      complexity = 'High';
    }
    // Important - Critical infrastructure
    else if (keywords.includes('water') || keywords.includes('electricity') || keywords.includes('road') || 
             keywords.includes('bridge') || keywords.includes('hospital') || keywords.includes('school') ||
             keywords.includes('sewage') || keywords.includes('traffic') || keywords.includes('safety')) {
      severity = 'Important';
      complexity = 'Medium';
    }
    // Normal - Regular maintenance
    else {
      severity = 'Normal';
      complexity = 'Low';
    }
    
    // Category classification
    if (keywords.includes('road') || keywords.includes('bridge') || keywords.includes('street') || keywords.includes('pothole')) {
      category = 'Infrastructure';
    } else if (keywords.includes('water') || keywords.includes('electricity') || keywords.includes('gas') || keywords.includes('sewage')) {
      category = 'Utilities';
    } else if (keywords.includes('hospital') || keywords.includes('health') || keywords.includes('medical') || keywords.includes('clinic')) {
      category = 'Health';
    } else if (keywords.includes('school') || keywords.includes('education') || keywords.includes('college') || keywords.includes('university')) {
      category = 'Education';
    } else if (keywords.includes('garbage') || keywords.includes('waste') || keywords.includes('pollution') || keywords.includes('environment')) {
      category = 'Environment';
    } else if (keywords.includes('crime') || keywords.includes('safety') || keywords.includes('security') || keywords.includes('police')) {
      category = 'Public Safety';
    }
    
    return { severity, complexity, category };
  },
  
  chatBot: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const responses = {
      'can this problem be reported': 'Yes! You can report any civic issue through our grievance system. Just go to Submit Grievance and provide details.',
      'how much points will i get': 'You earn 10 points for submitting a grievance, 5 points for updates, and 20 points when your issue is resolved!',
      'how to track my grievance': 'Go to Track Grievances to see the status of all your submitted issues in real-time.',
      'what categories can i report': 'You can report issues in Infrastructure, Utilities, Health, Education, Environment, and Public Safety.',
      'how long does it take': 'Simple issues are resolved within 2-3 days, while complex infrastructure problems may take 1-2 weeks.',
      'can i report anonymously': 'Yes, you can choose to report anonymously, though providing contact details helps with updates.',
      'what if my issue is urgent': 'Mark urgent issues and they will be prioritized. Emergency situations are handled within 24 hours.',
      'how to contact support': 'Use our chatbot, call the helpline at 1800-GRIEVANCE, or visit your local municipal office.',
      'hello': 'Hello! I\'m your AI assistant for the Citizen Grievance System. How can I help you today?',
      'hi': 'Hi there! I can help you with grievance submission, tracking, and general information. What do you need?',
      'help': 'I can help you with:\n• Submitting grievances\n• Tracking your reports\n• Understanding the system\n• Getting support\nWhat would you like to know?',
      'road': 'Road issues are categorized as Infrastructure problems. You can report potholes, broken roads, missing signs, or traffic issues.',
      'water': 'Water supply issues are high priority! Report water shortages, contamination, pipe leaks, or billing problems.',
      'electricity': 'Power issues are urgent! Report outages, faulty street lights, electrical hazards, or billing problems.',
      'hospital': 'Healthcare issues are very important! Report hospital problems, medical emergencies, or health service complaints.',
      'school': 'Education issues matter! Report school problems, teacher issues, infrastructure problems, or educational concerns.',
      'emergency': 'For emergencies, call 100 (Police), 101 (Fire), 102 (Ambulance), or 108 (Emergency). For civic emergencies, use our urgent reporting system.',
      'status': 'To check your grievance status, go to "Track Grievances" in your dashboard. You\'ll see real-time updates there.',
      'reward': 'You earn points for:\n• 10 points: Submitting a grievance\n• 5 points: Providing updates\n• 20 points: Issue resolved\n• 50 points: Referral bonus',
      'default': 'I can help you with grievance submission, tracking, rewards, and general information about our system. Try asking about:\n• "How to report a problem"\n• "Check my grievance status"\n• "What rewards do I get"\n• "Emergency reporting"'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return responses.default;
  }
};

// Animated Components
const AnimatedButton = ({ children, onPress, style, variant = 'primary', ...props }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      ...AnimationConfig.spring,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      ...AnimationConfig.spring,
    }).start();
  };
  
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'ghost' && styles.ghostButton,
    style,
  ];
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedCard = ({ children, style, delay = 0, ...props }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);
  
  return (
    <Animated.View
      style={[
        styles.card,
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [newGrievance, setNewGrievance] = useState({ title: '', description: '', category: 'Infrastructure', email: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '', phone: '', otp: '', userType: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen', userType: '' });
  const [loginMode, setLoginMode] = useState('email'); // email, phone
  const [showOTP, setShowOTP] = useState(false);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [screenTransition, setScreenTransition] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalGrievances: 1247,
    resolved: 1058,
    pending: 89,
    inProgress: 100,
    resolutionRate: 84.8,
    severityBreakdown: { Low: 45, Medium: 35, High: 20 }
  });
  const [feedback, setFeedback] = useState({ rating: 5, comment: '', category: 'General' });
  const [currentRewardCategory, setCurrentRewardCategory] = useState(null);

  useEffect(() => {
    if (user) {
      loadGrievances();
      loadStoredData();
    }
  }, [user]);

  const loadStoredData = () => {
    try {
      // Load stored grievances from localStorage
      const storedGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
      if (storedGrievances.length > 0) {
        setGrievances(prev => [...prev, ...storedGrievances.filter(g => !prev.find(p => p.id === g.id))]);
      }
      
      // Load stored feedback from localStorage
      const storedFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
      console.log('Loaded stored feedback:', storedFeedback);
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigateToScreen = (screen) => {
    setScreenTransition(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setScreenTransition(false);
    }, 150);
  };

  const loadGrievances = async () => {
    try {
      const data = await API.getGrievances();
      setGrievances(data);
    } catch (error) {
      console.error('Error loading grievances:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (loginMode === 'email') {
        // Try backend API first
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            userType: selectedRole
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCurrentScreen('home');
          Alert.alert('Success', 'Login successful!');
        } else {
          // Fallback to mock login
          const mockUser = {
            id: Date.now(),
            name: loginData.email ? loginData.email.split('@')[0] : 
                  selectedRole === 'citizen' ? 'John Doe' : 
                  selectedRole === 'woman_citizen' ? 'Jane Smith' : 'Admin User',
            email: loginData.email,
            userType: selectedRole,
            role: selectedRole === 'official' ? 'admin' : 'citizen'
          };
          setUser(mockUser);
          setCurrentScreen('home');
          Alert.alert('Success', 'Login successful!');
        }
      } else {
        // Try backend API for OTP verification
        const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: loginData.phone,
            otp: loginData.otp,
            userType: selectedRole
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setCurrentScreen('home');
          Alert.alert('Success', 'Login successful!');
        } else {
          // Fallback to mock login
          const mockUser = {
            id: Date.now(),
            name: loginData.phone ? `User_${loginData.phone.slice(-4)}` : 
                  selectedRole === 'citizen' ? 'John Doe' : 
                  selectedRole === 'woman_citizen' ? 'Jane Smith' : 'Admin User',
            phone: loginData.phone,
            userType: selectedRole,
            role: selectedRole === 'official' ? 'admin' : 'citizen'
          };
          setUser(mockUser);
          setCurrentScreen('home');
          Alert.alert('Success', 'Login successful!');
        }
      }
    } catch (error) {
      // Fallback to mock login
      const mockUser = {
        id: Date.now(),
        name: selectedRole === 'citizen' ? 'John Doe' : 
              selectedRole === 'woman_citizen' ? 'Jane Smith' : 'Admin User',
        email: loginData.email || loginData.phone,
        userType: selectedRole,
        role: selectedRole === 'official' ? 'admin' : 'citizen'
      };
      setUser(mockUser);
      setCurrentScreen('home');
      Alert.alert('Success', 'Login successful!');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await API.signup(signupData);
      if (response.success) {
        setUser(response.user);
        setCurrentScreen('home');
      }
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const response = await API.sendOTP(loginData.phone);
      if (response.success) {
        setShowOTP(true);
        Alert.alert('Success', 'OTP sent to your phone');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const response = await API.verifyOTP(loginData.phone, loginData.otp);
      if (response.success) {
        const mockUser = {
          id: Date.now(),
          name: loginData.phone ? `User_${loginData.phone.slice(-4)}` : 
                selectedRole === 'citizen' ? 'John Doe' : 
                selectedRole === 'woman_citizen' ? 'Jane Smith' : 'Admin User',
          phone: loginData.phone,
          userType: selectedRole,
          role: selectedRole === 'official' ? 'admin' : 'citizen'
        };
        setUser(mockUser);
        setCurrentScreen('home');
        Alert.alert('Success', 'OTP verified successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  const submitGrievance = async () => {
    if (!newGrievance.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your grievance');
      return;
    }

    if (!newGrievance.description.trim()) {
      Alert.alert('Error', 'Please enter a description for your grievance');
      return;
    }

    if (newGrievance.email && !isValidEmail(newGrievance.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // AI categorization
      const categorization = await API.categorizeGrievance(newGrievance.title, newGrievance.description);
      
      const grievance = {
        ...newGrievance,
        id: Date.now(),
        userId: user?.id,
        userType: user?.userType,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        severity: categorization.severity,
        complexity: categorization.complexity,
        category: categorization.category,
        email: newGrievance.email || user?.email || 'No email provided'
      };

      // Try backend API first
      const response = await fetch('http://localhost:3000/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grievance),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Grievance stored in database:', data);
        setGrievances([data.grievance, ...grievances]);
        setNewGrievance({ title: '', description: '', category: 'Infrastructure', email: '' });
        Alert.alert('Success', `Grievance submitted successfully and stored in database!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
        setCurrentScreen('track');
      } else {
        // Fallback to local storage
        const localGrievance = {
          ...grievance,
          storedLocally: true
        };
        // Store in localStorage for persistence
        const existingGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
        existingGrievances.push(localGrievance);
        localStorage.setItem('grievances', JSON.stringify(existingGrievances));
        
        setGrievances([grievance, ...grievances]);
        setNewGrievance({ title: '', description: '', category: 'Infrastructure', email: '' });
        Alert.alert('Success', `Grievance submitted successfully and stored locally!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
        setCurrentScreen('track');
      }
    } catch (error) {
      // Fallback to local storage
      const categorization = await API.categorizeGrievance(newGrievance.title, newGrievance.description);
      const grievance = {
        ...newGrievance,
        id: Date.now(),
        userId: user?.id,
        userType: user?.userType,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        severity: categorization.severity,
        complexity: categorization.complexity,
        category: categorization.category,
        storedLocally: true
      };
      
      // Store in localStorage for persistence
      const existingGrievances = JSON.parse(localStorage.getItem('grievances') || '[]');
      existingGrievances.push(grievance);
      localStorage.setItem('grievances', JSON.stringify(existingGrievances));
      
      setGrievances([grievance, ...grievances]);
      setNewGrievance({ title: '', description: '', category: 'Infrastructure' });
      Alert.alert('Success', `Grievance submitted successfully and stored locally!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
      setCurrentScreen('track');
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    
    // Add user message to chat immediately
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      // Try backend API first
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage, 
          userId: user?.id,
          userType: user?.userType 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { type: 'bot', message: data.response }]);
      } else {
        // Fallback to local AI
        const response = await API.chatBot(userMessage);
        setChatHistory(prev => [...prev, { type: 'bot', message: response }]);
      }
    } catch (error) {
      // Fallback to local AI if API fails
      const response = await API.chatBot(userMessage);
      setChatHistory(prev => [...prev, { type: 'bot', message: response }]);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear all user data
            setUser(null);
            setCurrentScreen('landing');
            setGrievances([]);
            setChatHistory([]);
            setNewGrievance({ title: '', description: '', category: 'Infrastructure', email: '' });
            setLoginData({ email: '', password: '', phone: '', otp: '', userType: '' });
            setSignupData({ name: '', email: '', password: '', phone: '', role: 'citizen', userType: '' });
            setSelectedRole(null);
            setShowChat(false);
            setShowOTP(false);
            setShowUserTypeSelection(false);
            setScreenTransition(false);
            setFeedback({ rating: 5, comment: '', category: 'General' });
            setChatMessage('');
            setLoginMode('email');
            
            // Clear localStorage
            try {
              localStorage.removeItem('user');
              localStorage.removeItem('grievances');
              localStorage.removeItem('feedback');
              localStorage.removeItem('chatHistory');
            } catch (error) {
              console.log('Error clearing localStorage:', error);
            }
            
            Alert.alert('Success', 'Logged out successfully!');
          },
        },
      ]
    );
  };

  const submitFeedback = async () => {
    if (!feedback.comment.trim()) {
      Alert.alert('Error', 'Please enter your feedback comment');
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        ...feedback,
        userId: user?.id,
        userType: user?.userType,
        timestamp: new Date().toISOString()
      };

      // Try backend API first
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feedback stored in database:', data);
        Alert.alert('Success', 'Thank you for your feedback! Your input has been stored and helps us improve our services.');
        setFeedback({ rating: 5, comment: '', category: 'General' });
        setCurrentScreen('home');
      } else {
        // Fallback to local storage
        const localFeedback = {
          ...feedbackData,
          id: Date.now(),
          storedLocally: true
        };
        // Store in localStorage for persistence
        const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        existingFeedback.push(localFeedback);
        localStorage.setItem('feedback', JSON.stringify(existingFeedback));
        
        Alert.alert('Success', 'Thank you for your feedback! Your input has been stored locally and helps us improve our services.');
        setFeedback({ rating: 5, comment: '', category: 'General' });
        setCurrentScreen('home');
      }
    } catch (error) {
      // Fallback to local storage
      const localFeedback = {
        ...feedback,
        userId: user?.id,
        userType: user?.userType,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        storedLocally: true
      };
      // Store in localStorage for persistence
      const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
      existingFeedback.push(localFeedback);
      localStorage.setItem('feedback', JSON.stringify(existingFeedback));
      
      Alert.alert('Success', 'Thank you for your feedback! Your input has been stored locally and helps us improve our services.');
      setFeedback({ rating: 5, comment: '', category: 'General' });
      setCurrentScreen('home');
    }
    setLoading(false);
  };

  const renderLanding = () => (
    <LinearGradient colors={Colors.gradient} style={styles.landingContainer}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.landingScrollContainer} 
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={false}
        >
          {/* Hero Section */}
          <AnimatedCard delay={0} style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <Ionicons 
                  name="shield-checkmark" 
                  size={moderateScale(isDesktop ? 100 : isTablet ? 80 : isLandscape ? 50 : 60)} 
                  color={Colors.accent} 
                />
              </View>
              <Text style={[styles.heroTitle, Typography.h1]}>CITIZEN</Text>
              <Text style={[styles.heroSubtitle, Typography.h2]}>GRIEVANCE SYSTEM</Text>
              <Text style={[styles.heroDescription, Typography.body]}>Digital Platform for Government Services</Text>
            </View>
          </AnimatedCard>

          {/* Role Selection */}
          <AnimatedCard delay={200} style={styles.roleSelectionContainer}>
            <Text style={[styles.sectionTitle, Typography.h3]}>Choose Your Role</Text>
            
            <View style={styles.roleGrid}>
              <AnimatedButton
                variant="primary"
                style={styles.roleCard}
                onPress={() => {
                  setSelectedRole('citizen');
                  setCurrentScreen('login');
                }}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons 
                    name="person" 
                    size={moderateScale(isLandscape ? 32 : 40)} 
                    color={Colors.secondary} 
                  />
                </View>
                <Text style={[styles.roleTitle, Typography.h4]}>CITIZEN</Text>
                <Text style={[styles.roleDescription, Typography.caption]}>Submit grievances, track progress, earn rewards</Text>
              </AnimatedButton>

              <AnimatedButton
                variant="primary"
                style={styles.roleCard}
                onPress={() => {
                  setSelectedRole('woman_citizen');
                  setCurrentScreen('login');
                }}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons 
                    name="woman" 
                    size={moderateScale(isLandscape ? 32 : 40)} 
                    color={Colors.secondary} 
                  />
                </View>
                <Text style={[styles.roleTitle, Typography.h4]}>WOMAN CITIZEN</Text>
                <Text style={[styles.roleDescription, Typography.caption]}>Enhanced safety features, priority support</Text>
              </AnimatedButton>

              <AnimatedButton
                variant="primary"
                style={styles.roleCard}
                onPress={() => {
                  setSelectedRole('official');
                  setCurrentScreen('login');
                }}
              >
                <View style={styles.roleIconContainer}>
                  <Ionicons 
                    name="business" 
                    size={moderateScale(isLandscape ? 32 : 40)} 
                    color={Colors.secondary} 
                  />
                </View>
                <Text style={[styles.roleTitle, Typography.h4]}>OFFICIAL</Text>
                <Text style={[styles.roleDescription, Typography.caption]}>Manage grievances, analytics, assignments</Text>
              </AnimatedButton>
            </View>
          </AnimatedCard>

        {/* Features Section */}
        <AnimatedCard delay={400} style={styles.featuresContainer}>
          <Text style={[styles.sectionTitle, Typography.h3]}>Key Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubble-ellipses" size={32} color={Colors.secondary} />
              <Text style={[styles.featureText, Typography.body]}>AI Chatbot</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={32} color={Colors.secondary} />
              <Text style={[styles.featureText, Typography.body]}>Real-time Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.secondary} />
              <Text style={[styles.featureText, Typography.body]}>Secure Platform</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={32} color={Colors.secondary} />
              <Text style={[styles.featureText, Typography.body]}>Reward System</Text>
            </View>
          </View>
        </AnimatedCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderLogin = () => (
    <LinearGradient colors={Colors.gradient} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContainer} showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0} style={styles.authCard}>
          {/* Back Button */}
          <AnimatedButton
            variant="ghost"
            style={styles.backButtonContainer}
            onPress={() => setCurrentScreen('landing')}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={styles.backButtonText}>Back to Role Selection</Text>
          </AnimatedButton>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={isDesktop ? 80 : isTablet ? 60 : 50} color={Colors.accent} />
            </View>
            <Text style={[styles.authTitle, Typography.h1]}>CITIZEN</Text>
            <Text style={[styles.authSubtitle, Typography.h3]}>GRIEVANCE SYSTEM</Text>
            <Text style={[styles.authDescription, Typography.body]}>Digital Platform for Government Services</Text>
          </View>

          {/* Login Mode Tabs */}
          <AnimatedCard delay={200} style={styles.tabContainer}>
            <AnimatedButton
              variant={loginMode === 'email' ? 'primary' : 'ghost'}
              style={[styles.tab, loginMode === 'email' && styles.activeTab]}
              onPress={() => setLoginMode('email')}
            >
              <Ionicons name="mail" size={20} color={loginMode === 'email' ? Colors.primary : Colors.textSecondary} />
              <Text style={[styles.tabText, loginMode === 'email' && styles.activeTabText]}>Email</Text>
            </AnimatedButton>
            <AnimatedButton
              variant={loginMode === 'phone' ? 'primary' : 'ghost'}
              style={[styles.tab, loginMode === 'phone' && styles.activeTab]}
              onPress={() => setLoginMode('phone')}
            >
              <Ionicons name="call" size={20} color={loginMode === 'phone' ? Colors.primary : Colors.textSecondary} />
              <Text style={[styles.tabText, loginMode === 'phone' && styles.activeTabText]}>Phone</Text>
            </AnimatedButton>
          </AnimatedCard>

          {/* Input Fields */}
          <AnimatedCard delay={400} style={styles.inputContainer}>
            {loginMode === 'email' ? (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, Typography.body]}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.textSecondary}
                    value={loginData.email}
                    onChangeText={(text) => setLoginData({...loginData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, Typography.body]}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.textSecondary}
                    value={loginData.password}
                    onChangeText={(text) => setLoginData({...loginData, password: text})}
                    secureTextEntry
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, Typography.body]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={Colors.textSecondary}
                    value={loginData.phone}
                    onChangeText={(text) => setLoginData({...loginData, phone: text})}
                    keyboardType="phone-pad"
                  />
                </View>
                {!showOTP ? (
                  <AnimatedButton variant="secondary" onPress={sendOTP} disabled={loading}>
                    <Ionicons name="send" size={20} color={Colors.primary} />
                    <Text style={[styles.buttonText, Typography.h4]}>Send OTP</Text>
                  </AnimatedButton>
                ) : (
                  <>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="keypad-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, Typography.body]}
                        placeholder="Enter OTP"
                        placeholderTextColor={Colors.textSecondary}
                        value={loginData.otp}
                        onChangeText={(text) => setLoginData({...loginData, otp: text})}
                        keyboardType="number-pad"
                      />
                    </View>
                    <AnimatedButton variant="primary" onPress={verifyOTP} disabled={loading}>
                      <Ionicons name="checkmark" size={20} color={Colors.primary} />
                      <Text style={[styles.buttonText, Typography.h4]}>Verify OTP</Text>
                    </AnimatedButton>
                  </>
                )}
              </>
            )}
          </AnimatedCard>

          {/* Action Buttons */}
          <AnimatedCard delay={600} style={styles.actionContainer}>
            <AnimatedButton
              variant="primary"
              onPress={handleLogin}
              disabled={loading}
              style={styles.signInButton}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} size="large" />
              ) : (
                <>
                  <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
                  <Text style={[styles.buttonText, Typography.h4]}>SIGN IN</Text>
                </>
              )}
            </AnimatedButton>

            <AnimatedButton 
              variant="ghost" 
              style={styles.googleButton}
              onPress={() => {
                const mockUser = {
                  id: Date.now(),
                  name: 'user@gmail.com'.split('@')[0],
                  email: 'user@gmail.com',
                  userType: selectedRole,
                  role: selectedRole === 'official' ? 'admin' : 'citizen'
                };
                setUser(mockUser);
                setCurrentScreen('home');
                Alert.alert('Success', 'Google login successful!');
              }}
            >
              <Ionicons name="logo-google" size={24} color={Colors.textSecondary} />
              <Text style={[styles.googleButtonText, Typography.body]}>Continue with Google</Text>
            </AnimatedButton>

            <TouchableOpacity onPress={() => navigateToScreen('signup')} style={styles.signUpLink}>
              <Text style={[styles.linkText, Typography.body]}>Don't have an account? </Text>
              <Text style={[styles.linkTextBold, Typography.body]}>Sign Up</Text>
            </TouchableOpacity>
          </AnimatedCard>
        </AnimatedCard>
      </ScrollView>
    </LinearGradient>
  );

  const renderSignup = () => (
    <View style={styles.authContainer}>
      <View style={styles.authCard}>
        <Image source={{ uri: 'https://via.placeholder.com/100x100/1DB954/FFFFFF?text=🏛️' }} style={styles.logo} />
        <Text style={styles.authTitle}>Create Account</Text>
        <Text style={styles.authSubtitle}>Join the Citizen Grievance System</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={signupData.name}
          onChangeText={(text) => setSignupData({...signupData, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={signupData.email}
          onChangeText={(text) => setSignupData({...signupData, email: text})}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          value={signupData.phone}
          onChangeText={(text) => setSignupData({...signupData, phone: text})}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={signupData.password}
          onChangeText={(text) => setSignupData({...signupData, password: text})}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHome = () => (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.homeScrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <AnimatedCard delay={0} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={[styles.welcomeText, Typography.h4]}>Welcome back,</Text>
              <Text style={[styles.userName, Typography.h3]}>{user?.name}</Text>
            </View>
            <View style={styles.headerButtons}>
              <AnimatedButton
                variant="ghost"
                style={styles.chatButton}
                onPress={() => setShowChat(true)}
              >
                <Ionicons 
                  name="chatbubble-ellipses" 
                  size={moderateScale(isLandscape ? 20 : 24)} 
                  color={Colors.accent} 
                />
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons 
                  name="log-out" 
                  size={moderateScale(isLandscape ? 20 : 24)} 
                  color={Colors.error} 
                />
              </AnimatedButton>
            </View>
          </View>
        </AnimatedCard>

        {/* Hero Section */}
        <AnimatedCard delay={200} style={styles.heroSection}>
          <LinearGradient colors={Colors.gradientAccent} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, Typography.h2]}>CITIZEN</Text>
              <Text style={[styles.heroSubtitle, Typography.h3]}>GRIEVANCE SYSTEM</Text>
              <Text style={[styles.heroDescription, Typography.body]}>Digital Platform for Government Services</Text>
            </View>
            <View style={styles.heroIcon}>
              <Ionicons 
                name="shield-checkmark" 
                size={moderateScale(isDesktop ? 120 : isTablet ? 80 : isLandscape ? 50 : 60)} 
                color={Colors.secondary} 
              />
            </View>
          </LinearGradient>
        </AnimatedCard>
      
      {/* Stats Section */}
      <AnimatedCard delay={400} style={styles.statsSection}>
        <Text style={[styles.sectionTitle, Typography.h3]}>Your Dashboard</Text>
        <View style={styles.statsContainer}>
          <AnimatedCard delay={500} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="document-text" size={32} color={Colors.accent} />
            </View>
            <Text style={[styles.statNumber, Typography.h2]}>{grievances.length}</Text>
            <Text style={[styles.statLabel, Typography.caption]}>Total Grievances</Text>
          </AnimatedCard>
          <AnimatedCard delay={600} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            </View>
            <Text style={[styles.statNumber, Typography.h2]}>{grievances.filter(g => g.status === 'Resolved').length}</Text>
            <Text style={[styles.statLabel, Typography.caption]}>Resolved</Text>
          </AnimatedCard>
          <AnimatedCard delay={700} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={32} color={Colors.warning} />
            </View>
            <Text style={[styles.statNumber, Typography.h2]}>{grievances.filter(g => g.status === 'Pending').length}</Text>
            <Text style={[styles.statLabel, Typography.caption]}>Pending</Text>
          </AnimatedCard>
        </View>
      </AnimatedCard>

      {/* Action Buttons Section */}
      <AnimatedCard delay={800} style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, Typography.h3]}>
          {user?.userType === 'citizen' ? '👨 Citizen Portal' : 
           user?.userType === 'woman_citizen' ? '👩 Woman Citizen Portal' : 
           '🏛️ Government Employee Portal'}
        </Text>
        
        {user?.userType === 'citizen' && (
          <View style={styles.actionGrid}>
            <AnimatedButton
              variant="primary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('submit')}
            >
              <Ionicons name="create-outline" size={28} color={Colors.primary} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Submit Grievance</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Report new issues</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('track')}
            >
              <Ionicons name="analytics-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Track Grievances</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Monitor progress</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              style={styles.actionButton}
              onPress={() => setCurrentScreen('rewards')}
            >
              <Ionicons name="trophy-outline" size={28} color={Colors.warning} />
              <Text style={[styles.actionButtonText, Typography.h4]}>My Rewards</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>150 points</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('feedback')}
            >
              <Ionicons name="chatbubble-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Feedback System</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Share your experience</Text>
            </AnimatedButton>
          </View>
        )}
      </AnimatedCard>

        {user?.userType === 'woman_citizen' && (
          <View style={styles.actionGrid}>
            <AnimatedButton
              variant="primary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('submit')}
            >
              <Ionicons name="create-outline" size={28} color={Colors.primary} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Submit Grievance</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Report new issues</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('track')}
            >
              <Ionicons name="analytics-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Track Grievances</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Monitor progress</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              style={styles.actionButton}
              onPress={async () => {
                try {
                  const response = await fetch(`http://localhost:3000/api/users/${user?.id}/safety-features`);
                  if (response.ok) {
                    const data = await response.json();
                    Alert.alert('Safety Features', `Women Safety Features:\n• Emergency reporting\n• Safe location sharing\n• Women-only support\n• Priority handling\n\nEmergency Contacts: ${data.emergencyContacts || '100, 101, 102'}`);
                  } else {
                    Alert.alert('Safety Features', 'Women Safety Features:\n• Emergency reporting\n• Safe location sharing\n• Women-only support\n• Priority handling\n\nEmergency Contacts: 100, 101, 102');
                  }
                } catch (error) {
                  Alert.alert('Safety Features', 'Women Safety Features:\n• Emergency reporting\n• Safe location sharing\n• Women-only support\n• Priority handling\n\nEmergency Contacts: 100, 101, 102');
                }
              }}
            >
              <Ionicons name="shield-outline" size={28} color={Colors.success} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Safety Features</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Enhanced protection</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              style={styles.actionButton}
              onPress={() => setCurrentScreen('rewards')}
            >
              <Ionicons name="trophy-outline" size={28} color={Colors.warning} />
              <Text style={[styles.actionButtonText, Typography.h4]}>My Rewards</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>200 points</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('feedback')}
            >
              <Ionicons name="chatbubble-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Feedback System</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Share your experience</Text>
            </AnimatedButton>
          </View>
        )}

        {user?.userType === 'official' && (
          <View style={styles.actionGrid}>
            <AnimatedButton
              variant="primary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('admin')}
            >
              <Ionicons name="settings-outline" size={28} color={Colors.primary} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Admin Dashboard</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Manage system</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('manage')}
            >
              <Ionicons name="construct-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Manage Grievances</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Handle reports</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              style={styles.actionButton}
              onPress={async () => {
                try {
                  // AI Model for Statistics - Using local fallback since model is not ready
                  const mockAnalytics = {
                    totalGrievances: 1247,
                    pendingGrievances: 89,
                    resolvedGrievances: 1058,
                    inProgressGrievances: 100,
                    resolutionRate: 84.8,
                    averageResponseTime: '2.3 days',
                    citizenSatisfaction: '4.2/5',
                    departmentEfficiency: '78%',
                    severityBreakdown: { Low: 45, Medium: 35, High: 20 },
                    categoryBreakdown: { Infrastructure: 40, Utilities: 25, Health: 15, Education: 10, Other: 10 }
                  };
                  
                  Alert.alert('📊 Government Analytics', 
                    `📈 Performance Metrics:\n• Total Grievances: ${mockAnalytics.totalGrievances}\n• Pending: ${mockAnalytics.pendingGrievances}\n• Resolved: ${mockAnalytics.resolvedGrievances}\n• In Progress: ${mockAnalytics.inProgressGrievances}\n\n🎯 Resolution Rate: ${mockAnalytics.resolutionRate}%\n\n⏱️ Average Response Time: ${mockAnalytics.averageResponseTime}\n👥 Citizen Satisfaction: ${mockAnalytics.citizenSatisfaction}\n🏛️ Department Efficiency: ${mockAnalytics.departmentEfficiency}\n\n📊 Severity Breakdown:\n• Low: ${mockAnalytics.severityBreakdown.Low}%\n• Medium: ${mockAnalytics.severityBreakdown.Medium}%\n• High: ${mockAnalytics.severityBreakdown.High}%`);
                } catch (error) {
                  Alert.alert('📊 Government Analytics', 
                    `📈 Performance Metrics:\n• Total Grievances: 1,247\n• Pending: 89\n• Resolved: 1,058\n• In Progress: 100\n\n🎯 Resolution Rate: 84.8%\n\n⏱️ Average Response Time: 2.3 days\n👥 Citizen Satisfaction: 4.2/5\n🏛️ Department Efficiency: 78%`);
                }
              }}
            >
              <Ionicons name="bar-chart-outline" size={28} color={Colors.success} />
              <Text style={[styles.actionButtonText, Typography.h4]}>View Analytics</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Performance insights</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              style={styles.actionButton}
              onPress={async () => {
                try {
                  const response = await fetch('http://localhost:3000/api/reports/generate', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user?.id, reportType: 'monthly' }),
                  });
                  if (response.ok) {
                    const data = await response.json();
                    Alert.alert('Reports', `Report Generated Successfully!\n\n• Monthly performance: ${data.performance || '85%'}\n• Department efficiency: ${data.efficiency || '78%'}\n• Citizen feedback: ${data.feedback || '4.2/5'}\n• Resource allocation: ${data.resources || 'Optimal'}`);
                  } else {
                    Alert.alert('Reports', 'Generate Reports:\n• Monthly performance: 85%\n• Department efficiency: 78%\n• Citizen feedback: 4.2/5\n• Resource allocation: Optimal');
                  }
                } catch (error) {
                  Alert.alert('Reports', 'Generate Reports:\n• Monthly performance: 85%\n• Department efficiency: 78%\n• Citizen feedback: 4.2/5\n• Resource allocation: Optimal');
                }
              }}
            >
              <Ionicons name="document-text-outline" size={28} color={Colors.warning} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Reports</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Generate insights</Text>
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              style={styles.actionButton}
              onPress={() => navigateToScreen('feedback')}
            >
              <Ionicons name="chatbubble-outline" size={28} color={Colors.accent} />
              <Text style={[styles.actionButtonText, Typography.h4]}>Feedback System</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>Share your experience</Text>
            </AnimatedButton>
          </View>
        )}

        <AnimatedButton
          variant="secondary"
          style={styles.publicDashboardButton}
          onPress={() => setCurrentScreen('public')}
        >
          <Ionicons name="globe-outline" size={24} color={Colors.primary} />
          <Text style={[styles.publicDashboardButtonText, Typography.body]}>🌐 Public Dashboard</Text>
        </AnimatedButton>
      </ScrollView>
    </SafeAreaView>
  );

  const renderSubmit = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>📝 Submit Grievance</Text>
        <Text style={[styles.subtitle, Typography.body]}>Report Issues in Your Area</Text>
      </View>
      
      <ScrollView style={styles.submitContainer} showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0} style={styles.submitCard}>
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, Typography.h4]}>Issue Title *</Text>
            <TextInput
              style={[styles.submitInput, Typography.body]}
              placeholder="What's the issue? (e.g., Broken street light)"
              placeholderTextColor={Colors.textSecondary}
              value={newGrievance.title}
              onChangeText={(text) => setNewGrievance({...newGrievance, title: text})}
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, Typography.h4]}>Description *</Text>
            <TextInput
              style={[styles.submitInput, styles.submitTextArea, Typography.body]}
              placeholder="Describe the issue in detail..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={6}
              value={newGrievance.description}
              onChangeText={(text) => setNewGrievance({...newGrievance, description: text})}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, Typography.h4]}>Contact Email (Optional)</Text>
            <TextInput
              style={[styles.submitInput, Typography.body]}
              placeholder="your.email@example.com"
              placeholderTextColor={Colors.textSecondary}
              value={newGrievance.email || ''}
              onChangeText={(text) => setNewGrievance({...newGrievance, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {newGrievance.email && !isValidEmail(newGrievance.email) && (
              <Text style={styles.errorText}>Please enter a valid email address</Text>
            )}
          </View>

          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, Typography.h4]}>Category</Text>
            <View style={styles.categorySelector}>
              {['Infrastructure', 'Utilities', 'Health', 'Education', 'Environment', 'Public Safety'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newGrievance.category === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setNewGrievance({...newGrievance, category})}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    newGrievance.category === category && styles.selectedCategoryButtonText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </AnimatedCard>

        <AnimatedButton
          variant="primary"
          style={styles.submitButton}
          onPress={submitGrievance}
          disabled={loading || !newGrievance.title.trim() || !newGrievance.description.trim()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text} size="large" />
          ) : (
            <>
              <Ionicons name="send" size={24} color={Colors.text} />
              <Text style={[styles.submitButtonText, Typography.h4]}>Submit Grievance</Text>
            </>
          )}
        </AnimatedButton>
      </ScrollView>
    </View>
  );

  const renderTrack = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>📊 Track Grievances</Text>
        <Text style={[styles.subtitle, Typography.body]}>View Status of Your Reports</Text>
      </View>
      
      <ScrollView style={styles.grievanceList}>
        {grievances.map((grievance) => (
          <View key={grievance.id} style={styles.grievanceCard}>
            <Text style={styles.grievanceTitle}>{grievance.title}</Text>
            <Text style={styles.grievanceDate}>Date: {grievance.date}</Text>
            <Text style={styles.grievanceCategory}>Category: {grievance.category}</Text>
            <View style={styles.severityContainer}>
              <Text style={styles.severityLabel}>Severity: </Text>
              <View style={[styles.severityBadge, 
                grievance.severity === 'Very Important' ? styles.severityHigh :
                grievance.severity === 'Important' ? styles.severityMedium : styles.severityLow
              ]}>
                <Text style={styles.severityText}>{grievance.severity}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, 
              grievance.status === 'Resolved' ? styles.statusResolved :
              grievance.status === 'In Progress' ? styles.statusProgress : styles.statusPending
            ]}>
              <Text style={styles.statusText}>{grievance.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAdmin = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>⚙️ Admin Dashboard</Text>
        <Text style={[styles.subtitle, Typography.body]}>Government Employee Portal</Text>
      </View>
      
      <View style={styles.adminStats}>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>{grievances.filter(g => g.status === 'Pending').length}</Text>
          <Text style={styles.adminLabel}>Pending Review</Text>
        </View>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>{grievances.filter(g => g.status === 'In Progress').length}</Text>
          <Text style={styles.adminLabel}>In Progress</Text>
        </View>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>{grievances.filter(g => g.status === 'Resolved').length}</Text>
          <Text style={styles.adminLabel}>Resolved</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('manage')}>
        <Text style={styles.buttonText}>🔧 Manage Grievances</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Analytics', 'Advanced analytics dashboard available!')}>
        <Text style={styles.secondaryButtonText}>📈 View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Notifications', 'Notification management system available!')}>
        <Text style={styles.secondaryButtonText}>🔔 Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderManage = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('admin')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Admin</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>🔧 Manage Grievances</Text>
        <Text style={[styles.subtitle, Typography.body]}>Admin Grievance Management</Text>
      </View>
      
      <ScrollView style={styles.grievanceList}>
        {grievances.map((grievance) => (
          <View key={grievance.id} style={styles.grievanceCard}>
            <Text style={styles.grievanceTitle}>{grievance.title}</Text>
            <Text style={styles.grievanceDate}>Date: {grievance.date}</Text>
            <Text style={styles.grievanceCategory}>Category: {grievance.category}</Text>
            <View style={styles.severityContainer}>
              <Text style={styles.severityLabel}>Severity: </Text>
              <View style={[styles.severityBadge, 
                grievance.severity === 'Very Important' ? styles.severityHigh :
                grievance.severity === 'Important' ? styles.severityMedium : styles.severityLow
              ]}>
                <Text style={styles.severityText}>{grievance.severity}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, 
              grievance.status === 'Resolved' ? styles.statusResolved :
              grievance.status === 'In Progress' ? styles.statusProgress : styles.statusPending
            ]}>
              <Text style={styles.statusText}>{grievance.status}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Update Status', 'Status update functionality available!')}>
                <Text style={styles.actionButtonText}>Update Status</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Assign', 'Assignment functionality available!')}>
                <Text style={styles.actionButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('admin')}>
        <Text style={styles.backButtonText}>← Back to Admin</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSupervisor = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>📈 Supervisor Dashboard</Text>
      <Text style={styles.subtitle}>Higher Authority Analytics & Oversight</Text>
      
      <View style={styles.adminStats}>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>{grievances.length}</Text>
          <Text style={styles.adminLabel}>Total Grievances</Text>
        </View>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>{Math.round((grievances.filter(g => g.status === 'Resolved').length / grievances.length) * 100) || 0}%</Text>
          <Text style={styles.adminLabel}>Resolution Rate</Text>
        </View>
        <View style={styles.adminCard}>
          <Text style={styles.adminNumber}>2.3</Text>
          <Text style={styles.adminLabel}>Avg. Days</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Performance Analytics', 'Advanced performance analytics available!')}>
        <Text style={styles.buttonText}>📊 Performance Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Generate Reports', 'Comprehensive reporting system available!')}>
        <Text style={styles.secondaryButtonText}>📋 Generate Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Department Oversight', 'Department oversight tools available!')}>
        <Text style={styles.secondaryButtonText}>👥 Department Oversight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPublic = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>🌐 Public Dashboard</Text>
        <Text style={[styles.subtitle, Typography.body]}>Open Access Statistics & Transparency</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{grievances.length}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{grievances.filter(g => g.status === 'Resolved').length}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round((grievances.filter(g => g.status === 'Resolved').length / grievances.length) * 100) || 0}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => Alert.alert('Public Reports', 'Public transparency reports available!')}>
        <Text style={styles.buttonText}>📊 Public Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Public Statistics', 'Detailed public statistics available!')}>
        <Text style={styles.secondaryButtonText}>📈 Public Statistics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Public Feedback', 'Public feedback system coming soon!')}>
        <Text style={styles.secondaryButtonText}>💬 Public Feedback (Coming Soon)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserTypeSelection = () => (
    <Modal visible={showUserTypeSelection} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Your Role</Text>
          <Text style={styles.modalSubtitle}>Choose how you want to use the system</Text>
          
          <TouchableOpacity style={styles.userTypeButton} onPress={() => {
            setLoginData({...loginData, userType: 'citizen_male'});
            setShowUserTypeSelection(false);
            handleLogin();
          }}>
            <Text style={styles.userTypeButtonText}>👨 Citizen (Male)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userTypeButton} onPress={() => {
            setLoginData({...loginData, userType: 'citizen_female'});
            setShowUserTypeSelection(false);
            handleLogin();
          }}>
            <Text style={styles.userTypeButtonText}>👩 Citizen (Female)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.userTypeButton} onPress={() => {
            setLoginData({...loginData, userType: 'government'});
            setShowUserTypeSelection(false);
            handleLogin();
          }}>
            <Text style={styles.userTypeButtonText}>🏛️ Government Employee</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowUserTypeSelection(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderFeedback = () => (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, Typography.h2]}>💬 Feedback System</Text>
        <Text style={[styles.subtitle, Typography.body]}>Help us improve our services</Text>
      </View>

      <ScrollView style={styles.feedbackContainer} showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0} style={styles.feedbackCard}>
          <Text style={[styles.feedbackTitle, Typography.h3]}>Rate Your Experience</Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setFeedback({...feedback, rating: star})}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= feedback.rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= feedback.rating ? Colors.warning : Colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={[styles.ratingText, Typography.body]}>
            {feedback.rating === 1 ? 'Poor' :
             feedback.rating === 2 ? 'Fair' :
             feedback.rating === 3 ? 'Good' :
             feedback.rating === 4 ? 'Very Good' : 'Excellent'}
          </Text>
        </AnimatedCard>

        <AnimatedCard delay={200} style={styles.feedbackCard}>
          <Text style={[styles.feedbackTitle, Typography.h3]}>Feedback Category</Text>
          <View style={styles.categoryContainer}>
            {['General', 'Service Quality', 'User Interface', 'Response Time', 'Feature Request', 'Bug Report'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  feedback.category === category && styles.selectedCategoryButton
                ]}
                onPress={() => setFeedback({...feedback, category})}
              >
                <Text style={[
                  styles.categoryButtonText,
                  feedback.category === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedCard>

        <AnimatedCard delay={400} style={styles.feedbackCard}>
          <Text style={[styles.feedbackTitle, Typography.h3]}>Your Comments</Text>
          <TextInput
            style={[styles.feedbackTextArea, Typography.body]}
            placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
            placeholderTextColor={Colors.textSecondary}
            value={feedback.comment}
            onChangeText={(text) => setFeedback({...feedback, comment: text})}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </AnimatedCard>

        <AnimatedButton
          variant="primary"
          style={styles.submitFeedbackButton}
          onPress={submitFeedback}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" />
          ) : (
            <>
              <Ionicons name="send" size={24} color={Colors.primary} />
              <Text style={[styles.buttonText, Typography.h4]}>Submit Feedback</Text>
            </>
          )}
        </AnimatedButton>
      </ScrollView>
    </View>
  );

  const renderRewards = () => (
    <View style={styles.screen}>
      {/* Header with Back Button */}
      <View style={styles.submitHeader}>
        <AnimatedButton
          variant="ghost"
          style={styles.backButtonContainer}
          onPress={() => setCurrentScreen('home')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </AnimatedButton>
        <Text style={[styles.title, Typography.h2]}>🎁 My Rewards</Text>
        <Text style={[styles.subtitle, Typography.body]}>
          {user?.userType === 'citizen' ? 'Citizen Rewards & Benefits' :
           user?.userType === 'woman_citizen' ? 'Woman Citizen Special Rewards' :
           'Official Employee Benefits'}
        </Text>
      </View>
      
      <ScrollView style={styles.rewardsContainer} showsVerticalScrollIndicator={false}>
        {/* Points Section */}
        <AnimatedCard delay={0} style={styles.rewardsCard}>
          <View style={styles.pointsSection}>
            <Ionicons name="trophy" size={60} color={Colors.primary} />
            <Text style={[styles.pointsTitle, Typography.h2]}>
              {user?.userType === 'citizen' ? '150' :
               user?.userType === 'woman_citizen' ? '200' : '300'} Points
            </Text>
            <Text style={[styles.pointsSubtitle, Typography.body]}>Available Balance</Text>
          </View>
        </AnimatedCard>

        {/* Discounts Section */}
        <AnimatedCard delay={200} style={styles.rewardsCard}>
          <Text style={[styles.sectionTitle, Typography.h3]}>🏪 Store Discounts</Text>
          <View style={styles.discountsGrid}>
            {user?.userType === 'citizen' ? (
              <>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Walmart</Text>
                  <Text style={[styles.discountText, Typography.body]}>15% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: CITIZEN15</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Target</Text>
                  <Text style={[styles.discountText, Typography.body]}>10% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: CITIZEN10</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Amazon</Text>
                  <Text style={[styles.discountText, Typography.body]}>5% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: CITIZEN5</Text>
                </View>
              </>
            ) : user?.userType === 'woman_citizen' ? (
              <>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Sephora</Text>
                  <Text style={[styles.discountText, Typography.body]}>20% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: WOMAN20</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Victoria's Secret</Text>
                  <Text style={[styles.discountText, Typography.body]}>25% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: WOMAN25</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Ulta Beauty</Text>
                  <Text style={[styles.discountText, Typography.body]}>15% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: WOMAN15</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Office Depot</Text>
                  <Text style={[styles.discountText, Typography.body]}>30% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: OFFICIAL30</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Staples</Text>
                  <Text style={[styles.discountText, Typography.body]}>25% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: OFFICIAL25</Text>
                </View>
                <View style={styles.discountItem}>
                  <Text style={[styles.storeName, Typography.h4]}>Best Buy</Text>
                  <Text style={[styles.discountText, Typography.body]}>20% OFF</Text>
                  <Text style={[styles.discountCode, Typography.caption]}>Code: OFFICIAL20</Text>
                </View>
              </>
            )}
          </View>
        </AnimatedCard>

        {/* Coupons Section */}
        <AnimatedCard delay={400} style={styles.rewardsCard}>
          <Text style={[styles.sectionTitle, Typography.h3]}>🎫 Digital Coupons</Text>
          <View style={styles.couponsList}>
            {user?.userType === 'citizen' ? (
              <>
                <View style={styles.couponItem}>
                  <Ionicons name="restaurant" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>McDonald's</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>Free Medium Fries with any purchase</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 30 days</Text>
                  </View>
                </View>
                <View style={styles.couponItem}>
                  <Ionicons name="car" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>Shell Gas</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>$0.10 OFF per gallon</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 15 days</Text>
                  </View>
                </View>
              </>
            ) : user?.userType === 'woman_citizen' ? (
              <>
                <View style={styles.couponItem}>
                  <Ionicons name="fitness" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>Planet Fitness</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>1 Month Free Membership</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 45 days</Text>
                  </View>
                </View>
                <View style={styles.couponItem}>
                  <Ionicons name="medical" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>CVS Pharmacy</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>$5 OFF Health & Beauty</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 20 days</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.couponItem}>
                  <Ionicons name="business" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>Hilton Hotels</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>20% OFF Business Travel</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 60 days</Text>
                  </View>
                </View>
                <View style={styles.couponItem}>
                  <Ionicons name="airplane" size={24} color={Colors.primary} />
                  <View style={styles.couponDetails}>
                    <Text style={[styles.couponTitle, Typography.h4]}>Delta Airlines</Text>
                    <Text style={[styles.couponDesc, Typography.body]}>15% OFF Government Travel</Text>
                    <Text style={[styles.couponExpiry, Typography.caption]}>Expires: 90 days</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </AnimatedCard>

        {/* Special Benefits */}
        <AnimatedCard delay={600} style={styles.rewardsCard}>
          <Text style={[styles.sectionTitle, Typography.h3]}>⭐ Special Benefits</Text>
          <View style={styles.benefitsList}>
            {user?.userType === 'citizen' ? (
              <>
                <View style={styles.benefitItem}>
                  <Ionicons name="library" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Free Library Membership</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="school" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Community Center Access</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="bus" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Public Transport Discount</Text>
                </View>
              </>
            ) : user?.userType === 'woman_citizen' ? (
              <>
                <View style={styles.benefitItem}>
                  <Ionicons name="shield" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Women's Safety App Premium</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="medical" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Free Health Checkups</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="school" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Skill Development Programs</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.benefitItem}>
                  <Ionicons name="car" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Government Vehicle Access</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="medical" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Premium Health Insurance</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="school" size={20} color={Colors.primary} />
                  <Text style={[styles.benefitText, Typography.body]}>Professional Development Fund</Text>
                </View>
              </>
            )}
          </View>
        </AnimatedCard>
      </ScrollView>
    </View>
  );

  const renderChat = () => (
    <Modal visible={showChat} animationType="slide">
      <SafeAreaView style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>🤖 Gemini Pro AI Assistant</Text>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.chatHistory}>
          {chatHistory.length === 0 && (
            <View style={styles.welcomeMessage}>
              <Text style={styles.welcomeMessageText}>👋 Hi! I'm your Gemini Pro AI assistant. I can help you with:</Text>
              <Text style={styles.welcomeMessageText}>• Advanced grievance analysis</Text>
              <Text style={styles.welcomeMessageText}>• Real-time status tracking</Text>
              <Text style={styles.welcomeMessageText}>• Smart recommendations</Text>
              <Text style={styles.welcomeMessageText}>• Priority assessment</Text>
              <Text style={styles.welcomeMessageText}>• Government policy insights</Text>
              
              <View style={styles.quickActions}>
                <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Analyze my grievance priority')}>
                  <Text style={styles.quickActionText}>Analyze my grievance priority</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Get status update')}>
                  <Text style={styles.quickActionText}>Get status update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Suggest improvements')}>
                  <Text style={styles.quickActionText}>Suggest improvements</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Emergency assistance')}>
                  <Text style={styles.quickActionText}>Emergency assistance</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {chatHistory.map((msg, index) => (
            <View key={index} style={[styles.chatMessage, msg.type === 'user' ? styles.userMessage : styles.botMessage]}>
              <Text style={styles.chatMessageText}>{msg.message}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.chatInput}>
          <TextInput
            style={styles.chatInputField}
            placeholder="Ask me anything about grievances..."
            placeholderTextColor="#888"
            value={chatMessage}
            onChangeText={setChatMessage}
            onSubmitEditing={handleChat}
          />
          <TouchableOpacity style={styles.chatSendButton} onPress={handleChat}>
            <Text style={styles.chatSendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {screenTransition ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={[styles.loadingText, Typography.h4]}>Loading...</Text>
        </View>
      ) : (
        <>
          {currentScreen === 'landing' && renderLanding()}
          {currentScreen === 'login' && renderLogin()}
          {currentScreen === 'signup' && renderSignup()}
          {currentScreen === 'home' && renderHome()}
          {currentScreen === 'submit' && renderSubmit()}
          {currentScreen === 'track' && renderTrack()}
          {currentScreen === 'admin' && renderAdmin()}
          {currentScreen === 'manage' && renderManage()}
          {currentScreen === 'supervisor' && renderSupervisor()}
          {currentScreen === 'public' && renderPublic()}
          {currentScreen === 'feedback' && renderFeedback()}
          {currentScreen === 'rewards' && renderRewards()}
          {renderUserTypeSelection()}
          {renderChat()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Base responsive styles
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.accent,
    marginTop: Spacing.lg,
  },
  
  // Landing Page Styles - Responsive
  landingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  landingScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionPadding,
    paddingBottom: Spacing.xxxl, // Extra padding for scroll
  },
  // Hero Section - Responsive
  heroSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  heroTitle: {
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  heroDescription: {
    color: Colors.textSecondary,
    opacity: 0.8,
  },
  
  // Role Selection - Responsive
  roleSelectionContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  roleGrid: {
    gap: Spacing.lg,
    paddingHorizontal: isLandscape ? Spacing.sm : 0,
  },
  roleCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    alignItems: 'center',
    minHeight: verticalScale(isLandscape ? 120 : 160),
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginHorizontal: isLandscape ? Spacing.sm : 0,
  },
  roleIconContainer: {
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
  },
  roleTitle: {
    color: Colors.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
  },
  roleDescription: {
    color: Colors.secondary,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: moderateScale(18),
  },
  // Features Section - Responsive
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featuresGrid: {
    flexDirection: isLandscape ? 'row' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: isLandscape ? Spacing.sm : 0,
  },
  featureItem: {
    width: isLandscape ? '30%' : isDesktop ? '22%' : isTablet ? '45%' : '45%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    alignItems: 'center',
    minHeight: verticalScale(isLandscape ? 80 : 100),
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  featureText: {
    color: Colors.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  authContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  authScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    minHeight: screenHeight,
  },
  authCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: isDesktop ? 120 : isTablet ? 100 : 80,
    height: isDesktop ? 120 : isTablet ? 100 : 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  authTitle: {
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 2,
  },
  authSubtitle: {
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  authDescription: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  activeTab: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.inputPadding,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: verticalScale(isLandscape ? 50 : 60),
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    color: Colors.text,
    paddingVertical: Spacing.buttonPadding,
    fontSize: moderateScale(16),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.buttonPadding,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    gap: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    minHeight: verticalScale(isLandscape ? 50 : 60),
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  googleButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  signInButton: {
    marginBottom: Spacing.lg,
    minHeight: 60,
  },
  actionContainer: {
    marginTop: Spacing.lg,
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  linkText: {
    color: Colors.textSecondary,
  },
  linkTextBold: {
    color: Colors.accent,
    fontWeight: '700',
  },
  otpButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  otpButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1DB954',
    textAlign: 'center',
    fontSize: 16,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    color: Colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chatButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  logoutButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  heroSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: isDesktop ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: isDesktop ? 200 : isTablet ? 160 : 140,
  },
  heroContent: {
    flex: 1,
    alignItems: isDesktop ? 'flex-start' : 'center',
  },
  heroTitle: {
    color: Colors.secondary,
    marginBottom: Spacing.xs,
    letterSpacing: 2,
  },
  heroSubtitle: {
    color: Colors.secondary,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  heroDescription: {
    color: Colors.secondary,
    opacity: 0.9,
  },
  heroIcon: {
    marginTop: isDesktop ? 0 : Spacing.lg,
  },
  statsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: isDesktop ? 'row' : 'column',
    gap: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statNumber: {
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  actionGrid: {
    gap: Spacing.lg,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 100,
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: Colors.secondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionButtonSubtext: {
    color: Colors.secondary,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.9,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#1DB954',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1DB954',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#B3B3B3',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  statLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 5,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1DB954',
    alignSelf: 'center',
    minWidth: 200,
  },
  secondaryButtonText: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  grievanceList: {
    flex: 1,
    marginBottom: 20,
  },
  grievanceCard: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#333',
  },
  grievanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  grievanceDate: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  grievanceCategory: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 10,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityLabel: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityHigh: {
    backgroundColor: '#FF4444',
  },
  severityMedium: {
    backgroundColor: '#FFA500',
  },
  severityLow: {
    backgroundColor: '#1DB954',
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusPending: {
    backgroundColor: '#FFA500',
  },
  statusProgress: {
    backgroundColor: '#1DB954',
  },
  statusResolved: {
    backgroundColor: '#00CED1',
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adminStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  adminCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 80,
  },
  adminNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  adminLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 5,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  closeButton: {
    fontSize: 24,
    color: '#B3B3B3',
  },
  chatHistory: {
    flex: 1,
    padding: 20,
  },
  chatMessage: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 15,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  chatMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  chatInput: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 25,
    marginRight: 10,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#333',
  },
  chatSendButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
  },
  chatSendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {  
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1DB954',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#B3B3B3',
  },
  userTypeButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  userTypeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userTypeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1DB954',
  },
  welcomeMessage: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  welcomeMessageText: {
    color: '#B3B3B3',
    fontSize: 14,
    marginBottom: 5,
  },
  quickActions: {
    marginTop: 20,
  },
  quickActionsTitle: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quickActionButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Feedback System Styles
  feedbackContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  feedbackCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  feedbackTitle: {
    color: Colors.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  starButton: {
    padding: Spacing.xs,
  },
  ratingText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  feedbackTextArea: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  submitFeedbackButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  
  // Submit Grievance Page Styles
  submitHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  submitCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  inputSection: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  submitInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    color: Colors.text,
    fontSize: 16,
  },
  submitTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: Colors.secondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // Public Dashboard Button Styles
  publicDashboardButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  publicDashboardButtonText: {
    color: Colors.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // Rewards Page Styles
  rewardsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  rewardsCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  pointsSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  pointsTitle: {
    color: Colors.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  pointsSubtitle: {
    color: Colors.textSecondary,
  },
  discountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  discountItem: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    minWidth: '30%',
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  storeName: {
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  discountText: {
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  discountCode: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  couponsList: {
    gap: Spacing.md,
  },
  couponItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  couponDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  couponTitle: {
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  couponDesc: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  couponExpiry: {
    color: Colors.primary,
    fontSize: 12,
  },
  benefitsList: {
    gap: Spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  benefitText: {
    color: Colors.text,
    marginLeft: Spacing.md,
    flex: 1,
  },
  
  // Additional Responsive Styles
  primaryButton: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  // Responsive button variants
  smallButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: verticalScale(40),
  },
  largeButton: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    minHeight: verticalScale(70),
  },
  
  buttonText: {
    color: Colors.text,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.secondary,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  ghostButtonText: {
    color: Colors.textSecondary,
  },
  
  // Back button styles
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.button,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  backButtonText: {
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  
  // Responsive card styles
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginHorizontal: Spacing.screenPadding,
  },
  
  // Responsive grid layouts
  gridContainer: {
    flexDirection: isLandscape ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  gridItem: {
    width: isLandscape ? '48%' : '100%',
    marginBottom: Spacing.md,
  },
  
  // Responsive text styles
  responsiveText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: Colors.text,
  },
  responsiveTitle: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    color: Colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  // Home Screen Responsive Styles
  homeScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionPadding,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: isLandscape ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isLandscape ? 'center' : 'flex-start',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sectionPadding,
  },
  welcomeSection: {
    flex: 1,
    marginBottom: isLandscape ? 0 : Spacing.md,
  },
  welcomeText: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    color: Colors.primary,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chatButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.button,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.button,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  
  // Hero Section Responsive
  heroSection: {
    marginBottom: Spacing.xl,
  },
  heroCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    flexDirection: isLandscape ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: verticalScale(isLandscape ? 120 : 180),
  },
  heroContent: {
    flex: 1,
    alignItems: isLandscape ? 'flex-start' : 'center',
    marginBottom: isLandscape ? 0 : Spacing.lg,
  },
  heroTitle: {
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    color: Colors.secondary,
    marginBottom: Spacing.md,
  },
  heroDescription: {
    color: Colors.secondary,
    opacity: 0.9,
  },
  heroIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});