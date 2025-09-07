import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#2E7D32', '#4CAF50', '#81C784']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            style={styles.logo}
          >
            🏛️
          </Animatable.Text>
        </Animated.View>

        <Animatable.View
          animation="fadeInUp"
          delay={500}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Citizen Grievance</Text>
          <Text style={styles.subtitle}>System</Text>
          <Text style={styles.tagline}>
            Your Voice, Our Priority
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeIn"
          delay={1500}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </Animatable.View>
      </View>

      <Animatable.View
        animation="fadeIn"
        delay={2000}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Empowering Citizens • Building Better Communities
        </Text>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#E8F5E8',
    textAlign: 'center',
    marginBottom: 15,
  },
  tagline: {
    fontSize: 16,
    color: '#C8E6C9',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    color: '#C8E6C9',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SplashScreen;
