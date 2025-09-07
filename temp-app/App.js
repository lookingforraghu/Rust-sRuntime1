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
import { motion } from 'framer-motion';

// Nike-inspired Design System
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isDesktop = screenWidth >= 1024;

const Colors = {
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#FF6B35',
  success: '#00C851',
  warning: '#FFBB33',
  error: '#FF4444',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  shadow: 'rgba(0, 0, 0, 0.1)',
  gradient: ['#000000', '#333333'],
  gradientAccent: ['#FF6B35', '#FF8C42'],
};

const Typography = {
  h1: { fontSize: isDesktop ? 48 : isTablet ? 40 : 32, fontWeight: '900', lineHeight: isDesktop ? 56 : isTablet ? 48 : 40 },
  h2: { fontSize: isDesktop ? 36 : isTablet ? 32 : 28, fontWeight: '800', lineHeight: isDesktop ? 44 : isTablet ? 40 : 36 },
  h3: { fontSize: isDesktop ? 28 : isTablet ? 24 : 22, fontWeight: '700', lineHeight: isDesktop ? 36 : isTablet ? 32 : 30 },
  h4: { fontSize: isDesktop ? 22 : isTablet ? 20 : 18, fontWeight: '600', lineHeight: isDesktop ? 30 : isTablet ? 28 : 26 },
  body: { fontSize: isDesktop ? 18 : isTablet ? 16 : 14, fontWeight: '400', lineHeight: isDesktop ? 26 : isTablet ? 24 : 22 },
  caption: { fontSize: isDesktop ? 14 : isTablet ? 12 : 10, fontWeight: '400', lineHeight: isDesktop ? 20 : isTablet ? 18 : 16 },
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
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
    // AI categorization logic
    const keywords = (title + ' ' + description).toLowerCase();
    let severity = 'Low';
    let complexity = 'Low';
    let category = 'General';
    
    if (keywords.includes('emergency') || keywords.includes('urgent') || keywords.includes('water') || keywords.includes('electricity')) {
      severity = 'Very Important';
      complexity = 'High';
    } else if (keywords.includes('road') || keywords.includes('bridge') || keywords.includes('hospital')) {
      severity = 'Important';
      complexity = 'Medium';
    }
    
    if (keywords.includes('road') || keywords.includes('bridge') || keywords.includes('street')) {
      category = 'Infrastructure';
    } else if (keywords.includes('water') || keywords.includes('electricity') || keywords.includes('gas')) {
      category = 'Utilities';
    } else if (keywords.includes('hospital') || keywords.includes('health') || keywords.includes('medical')) {
      category = 'Health';
    } else if (keywords.includes('school') || keywords.includes('education') || keywords.includes('college')) {
      category = 'Education';
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
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [newGrievance, setNewGrievance] = useState({ title: '', description: '', category: 'Infrastructure' });
  const [loginData, setLoginData] = useState({ email: '', password: '', phone: '', otp: '', userType: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen', userType: '' });
  const [loginMode, setLoginMode] = useState('email'); // email, phone
  const [showOTP, setShowOTP] = useState(false);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [screenTransition, setScreenTransition] = useState(false);

  useEffect(() => {
    if (user) {
      loadGrievances();
    }
  }, [user]);

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
            userType: loginData.userType
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
            name: loginData.userType === 'citizen_male' ? 'John Doe' : 
                  loginData.userType === 'citizen_female' ? 'Jane Smith' : 'Admin User',
            email: loginData.email,
            userType: loginData.userType,
            role: loginData.userType === 'government' ? 'admin' : 'citizen'
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
            userType: loginData.userType
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
            name: loginData.userType === 'citizen_male' ? 'John Doe' : 
                  loginData.userType === 'citizen_female' ? 'Jane Smith' : 'Admin User',
            phone: loginData.phone,
            userType: loginData.userType,
            role: loginData.userType === 'government' ? 'admin' : 'citizen'
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
        name: loginData.userType === 'citizen_male' ? 'John Doe' : 
              loginData.userType === 'citizen_female' ? 'Jane Smith' : 'Admin User',
        email: loginData.email || loginData.phone,
        userType: loginData.userType,
        role: loginData.userType === 'government' ? 'admin' : 'citizen'
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

  const submitGrievance = async () => {
    if (!newGrievance.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your grievance');
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
        category: categorization.category
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
        setGrievances([data.grievance, ...grievances]);
        setNewGrievance({ title: '', description: '', category: 'Infrastructure' });
        Alert.alert('Success', `Grievance submitted successfully!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
        setCurrentScreen('track');
      } else {
        // Fallback to local storage
        setGrievances([grievance, ...grievances]);
        setNewGrievance({ title: '', description: '', category: 'Infrastructure' });
        Alert.alert('Success', `Grievance submitted successfully!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
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
        category: categorization.category
      };
      setGrievances([grievance, ...grievances]);
      setNewGrievance({ title: '', description: '', category: 'Infrastructure' });
      Alert.alert('Success', `Grievance submitted successfully!\n\nAI Analysis:\nSeverity: ${categorization.severity}\nComplexity: ${categorization.complexity}\nCategory: ${categorization.category}`);
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

  const renderLogin = () => (
    <LinearGradient colors={Colors.gradient} style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContainer} showsVerticalScrollIndicator={false}>
        <AnimatedCard delay={0} style={styles.authCard}>
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
                )}
              </>
            )}
          </AnimatedCard>

          {/* Action Buttons */}
          <AnimatedCard delay={600} style={styles.actionContainer}>
            <AnimatedButton
              variant="primary"
              onPress={() => setShowUserTypeSelection(true)}
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

            <AnimatedButton variant="ghost" style={styles.googleButton}>
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
    <View style={styles.screen}>
      {/* Header Section */}
      <AnimatedCard delay={0} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, Typography.h3]}>Welcome back,</Text>
            <Text style={[styles.userName, Typography.h2]}>{user?.name}</Text>
          </View>
          <AnimatedButton
            variant="ghost"
            style={styles.chatButton}
            onPress={() => setShowChat(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color={Colors.accent} />
          </AnimatedButton>
        </View>
      </AnimatedCard>

      {/* Hero Section */}
      <AnimatedCard delay={200} style={styles.heroSection}>
        <LinearGradient colors={Colors.gradientAccent} style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, Typography.h1]}>CITIZEN</Text>
            <Text style={[styles.heroSubtitle, Typography.h2]}>GRIEVANCE SYSTEM</Text>
            <Text style={[styles.heroDescription, Typography.body]}>Digital Platform for Government Services</Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark" size={isDesktop ? 120 : isTablet ? 80 : 60} color={Colors.secondary} />
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
          {user?.userType === 'citizen_male' ? '👨 Male Citizen Portal' : 
           user?.userType === 'citizen_female' ? '👩 Female Citizen Portal' : 
           '🏛️ Government Employee Portal'}
        </Text>
        
        {user?.userType === 'citizen_male' && (
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
                  const response = await fetch(`http://localhost:3000/api/users/${user?.id}/rewards`);
                  if (response.ok) {
                    const data = await response.json();
                    Alert.alert('Rewards', `You have ${data.points} points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends`);
                  } else {
                    Alert.alert('Rewards', 'You have 150 points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends');
                  }
                } catch (error) {
                  Alert.alert('Rewards', 'You have 150 points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends');
                }
              }}
            >
              <Ionicons name="trophy-outline" size={28} color={Colors.warning} />
              <Text style={[styles.actionButtonText, Typography.h4]}>My Rewards</Text>
              <Text style={[styles.actionButtonSubtext, Typography.caption]}>150 points</Text>
            </AnimatedButton>
          </View>
        )}
      </AnimatedCard>

      {user?.userType === 'citizen_female' && (
        <>
          <Text style={styles.userTypeText}>👩 Female Citizen Portal</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('submit')}>
            <Text style={styles.buttonText}>📝 Submit Grievance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('track')}>
            <Text style={styles.secondaryButtonText}>📊 Track Grievances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={async () => {
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
          }}>
            <Text style={styles.secondaryButtonText}>🛡️ Safety Features</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/users/${user?.id}/rewards`);
              if (response.ok) {
                const data = await response.json();
                Alert.alert('Rewards', `You have ${data.points} points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends`);
              } else {
                Alert.alert('Rewards', 'You have 200 points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends');
              }
            } catch (error) {
              Alert.alert('Rewards', 'You have 200 points!\n\nEarn more by:\n• Submitting grievances\n• Providing updates\n• Referring friends');
            }
          }}>
            <Text style={styles.secondaryButtonText}>🏆 My Rewards</Text>
          </TouchableOpacity>
        </>
      )}

      {user?.userType === 'government' && (
        <>
          <Text style={styles.userTypeText}>🏛️ Government Employee Portal</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('admin')}>
            <Text style={styles.buttonText}>⚙️ Admin Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('manage')}>
            <Text style={styles.secondaryButtonText}>🔧 Manage Grievances</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={async () => {
            try {
              const response = await fetch('http://localhost:3000/api/analytics', {
                headers: {
                  'Authorization': `Bearer ${user?.token || 'mock-token'}`,
                },
              });
              if (response.ok) {
                const data = await response.json();
                const analytics = data.analytics;
                Alert.alert('📊 Government Analytics', 
                  `📈 Performance Metrics:\n• Total Grievances: ${analytics.totalGrievances}\n• Pending: ${analytics.pendingGrievances}\n• Resolved: ${analytics.resolvedGrievances}\n• In Progress: ${analytics.inProgressGrievances}\n\n🎯 Resolution Rate: ${analytics.resolutionRate}%\n\n⏱️ Average Response Time: 2.3 days\n👥 Citizen Satisfaction: 4.2/5\n🏛️ Department Efficiency: 78%`);
              } else {
                Alert.alert('📊 Government Analytics', 
                  `📈 Performance Metrics:\n• Total Grievances: 1,247\n• Pending: 89\n• Resolved: 1,058\n• In Progress: 100\n\n🎯 Resolution Rate: 84.8%\n\n⏱️ Average Response Time: 2.3 days\n👥 Citizen Satisfaction: 4.2/5\n🏛️ Department Efficiency: 78%`);
              }
            } catch (error) {
              Alert.alert('📊 Government Analytics', 
                `📈 Performance Metrics:\n• Total Grievances: 1,247\n• Pending: 89\n• Resolved: 1,058\n• In Progress: 100\n\n🎯 Resolution Rate: 84.8%\n\n⏱️ Average Response Time: 2.3 days\n👥 Citizen Satisfaction: 4.2/5\n🏛️ Department Efficiency: 78%`);
            }
          }}>
            <Text style={styles.secondaryButtonText}>📈 View Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={async () => {
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
          }}>
            <Text style={styles.secondaryButtonText}>📋 Reports</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('public')}>
        <Text style={styles.secondaryButtonText}>🌐 Public Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => {
        setUser(null);
        setCurrentScreen('login');
      }}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubmit = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>📝 Submit Grievance</Text>
      <Text style={styles.subtitle}>Report Issues in Your Area</Text>
      
      <TextInput
        style={styles.input}
        placeholder="What's the issue? (e.g., Broken street light)"
        placeholderTextColor="#888"
        value={newGrievance.title}
        onChangeText={(text) => setNewGrievance({...newGrievance, title: text})}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the issue in detail..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={newGrievance.description}
        onChangeText={(text) => setNewGrievance({...newGrievance, description: text})}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={submitGrievance} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Submit Grievance</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrack = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>📊 Track Grievances</Text>
      <Text style={styles.subtitle}>View Status of Your Reports</Text>
      
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

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdmin = () => (
    <View style={styles.screen}>
      <Text style={styles.title}>⚙️ Admin Dashboard</Text>
      <Text style={styles.subtitle}>Government Employee Portal</Text>
      
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
      <Text style={styles.title}>🔧 Manage Grievances</Text>
      <Text style={styles.subtitle}>Admin Grievance Management</Text>
      
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
      <Text style={styles.title}>🌐 Public Dashboard</Text>
      <Text style={styles.subtitle}>Open Access Statistics & Transparency</Text>
      
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

      <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Public Feedback', 'Public feedback system available!')}>
        <Text style={styles.secondaryButtonText}>💬 Public Feedback</Text>
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

  const renderChat = () => (
    <Modal visible={showChat} animationType="slide">
      <SafeAreaView style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>AI Assistant</Text>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.chatHistory}>
          {chatHistory.length === 0 && (
            <View style={styles.welcomeMessage}>
              <Text style={styles.welcomeMessageText}>👋 Hi! I'm your AI assistant. I can help you with:</Text>
              <Text style={styles.welcomeMessageText}>• Submitting grievances</Text>
              <Text style={styles.welcomeMessageText}>• Tracking your reports</Text>
              <Text style={styles.welcomeMessageText}>• Understanding the system</Text>
              <Text style={styles.welcomeMessageText}>• Getting support</Text>
              
              <View style={styles.quickActions}>
                <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('How to report a problem')}>
                  <Text style={styles.quickActionText}>How to report a problem</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Check my grievance status')}>
                  <Text style={styles.quickActionText}>Check my grievance status</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('What rewards do I get')}>
                  <Text style={styles.quickActionText}>What rewards do I get</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => setChatMessage('Emergency reporting')}>
                  <Text style={styles.quickActionText}>Emergency reporting</Text>
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
      {currentScreen === 'login' && renderLogin()}
      {currentScreen === 'signup' && renderSignup()}
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'submit' && renderSubmit()}
      {currentScreen === 'track' && renderTrack()}
      {currentScreen === 'admin' && renderAdmin()}
      {currentScreen === 'manage' && renderManage()}
      {currentScreen === 'supervisor' && renderSupervisor()}
      {currentScreen === 'public' && renderPublic()}
      {renderUserTypeSelection()}
      {renderChat()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
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
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    color: Colors.text,
    paddingVertical: Spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  googleButtonText: {
    color: Colors.textSecondary,
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
  chatButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    minHeight: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: Colors.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionButtonSubtext: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
    color: '#FFFFFF',
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
});