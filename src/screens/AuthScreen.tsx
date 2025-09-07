import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Card, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../hooks/useAuth';
import Toast from 'react-native-toast-message';

const AuthScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    age: '',
    region: '',
  });

  const { login, register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Email and password are required',
      });
      return false;
    }

    if (!isLogin) {
      if (!formData.name || !formData.gender || !formData.region) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Name, gender, and region are required',
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Passwords do not match',
        });
        return false;
      }

      if (formData.password.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Password must be at least 6 characters',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        Toast.show({
          type: 'success',
          text1: 'Welcome Back!',
          text2: 'You have successfully logged in',
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          gender: formData.gender as 'male' | 'female' | 'other',
          age: formData.age ? parseInt(formData.age) : undefined,
          region: formData.region,
        });
        Toast.show({
          type: 'success',
          text1: 'Account Created!',
          text2: 'Please check your email for verification',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      gender: '',
      age: '',
      region: '',
    });
  };

  return (
    <LinearGradient
      colors={['#2E7D32', '#4CAF50', '#81C784']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animatable.View
              animation="fadeInDown"
              style={styles.header}
            >
              <Text style={styles.logo}>🏛️</Text>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin
                  ? 'Sign in to continue your civic journey'
                  : 'Create your account to get started'
                }
              </Text>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              delay={300}
              style={styles.formContainer}
            >
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  {!isLogin && (
                    <TextInput
                      label="Full Name"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange('name', text)}
                      mode="outlined"
                      style={styles.input}
                      left={<TextInput.Icon icon="account" />}
                    />
                  )}

                  <TextInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                  />

                  {!isLogin && (
                    <TextInput
                      label="Phone Number (Optional)"
                      value={formData.phone}
                      onChangeText={(text) => handleInputChange('phone', text)}
                      mode="outlined"
                      keyboardType="phone-pad"
                      style={styles.input}
                      left={<TextInput.Icon icon="phone" />}
                    />
                  )}

                  <TextInput
                    label="Password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                  />

                  {!isLogin && (
                    <TextInput
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleInputChange('confirmPassword', text)}
                      mode="outlined"
                      secureTextEntry
                      style={styles.input}
                      left={<TextInput.Icon icon="lock-check" />}
                    />
                  )}

                  {!isLogin && (
                    <>
                      <TextInput
                        label="Gender"
                        value={formData.gender}
                        onChangeText={(text) => handleInputChange('gender', text)}
                        mode="outlined"
                        style={styles.input}
                        placeholder="male, female, or other"
                        left={<TextInput.Icon icon="gender-male-female" />}
                      />

                      <TextInput
                        label="Age (Optional)"
                        value={formData.age}
                        onChangeText={(text) => handleInputChange('age', text)}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        left={<TextInput.Icon icon="calendar" />}
                      />

                      <TextInput
                        label="Region"
                        value={formData.region}
                        onChangeText={(text) => handleInputChange('region', text)}
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="map-marker" />}
                      />
                    </>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                    labelStyle={styles.submitButtonText}
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>

                  <Divider style={styles.divider} />

                  <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    </Text>
                    <Button
                      mode="text"
                      onPress={toggleMode}
                      labelStyle={styles.toggleButtonText}
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </Button>
                  </View>

                  {isLogin && (
                    <Button
                      mode="text"
                      onPress={() => {
                        // Handle forgot password
                        Alert.alert(
                          'Forgot Password',
                          'Password reset functionality will be implemented soon.',
                          [{ text: 'OK' }]
                        );
                      }}
                      labelStyle={styles.forgotPasswordText}
                    >
                      Forgot Password?
                    </Button>
                  )}
                </Card.Content>
              </Card>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 8,
    backgroundColor: '#2E7D32',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    color: '#666666',
    fontSize: 16,
  },
  toggleButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: 14,
  },
});

export default AuthScreen;
