import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Report Issues',
    description: 'Easily report civic issues like potholes, broken streetlights, or sanitation problems in your area.',
    icon: '📝',
    color: '#2E7D32',
  },
  {
    id: 2,
    title: 'Track Progress',
    description: 'Monitor the status of your complaints and get real-time updates on resolution progress.',
    icon: '📊',
    color: '#1976D2',
  },
  {
    id: 3,
    title: 'Earn Rewards',
    description: 'Get rewarded with points and exclusive benefits for your civic participation and feedback.',
    icon: '🏆',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'Build Community',
    description: 'Join thousands of citizens working together to make our city a better place to live.',
    icon: '🤝',
    color: '#9C27B0',
  },
];

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      navigation.navigate('Auth');
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const renderSlide = (item: OnboardingSlide, index: number) => (
    <View key={item.id} style={styles.slide}>
      <LinearGradient
        colors={[item.color, `${item.color}CC`, `${item.color}99`]}
        style={styles.slideGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animatable.View
          animation="fadeInUp"
          delay={index * 200}
          style={styles.slideContent}
        >
          <Animatable.Text
            animation="bounceIn"
            delay={index * 200 + 300}
            style={styles.icon}
          >
            {item.icon}
          </Animatable.Text>

          <Animatable.Text
            animation="fadeInUp"
            delay={index * 200 + 500}
            style={styles.title}
          >
            {item.title}
          </Animatable.Text>

          <Animatable.Text
            animation="fadeInUp"
            delay={index * 200 + 700}
            style={styles.description}
          >
            {item.description}
          </Animatable.Text>
        </Animatable.View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentIndex ? '#FFFFFF' : '#FFFFFF80',
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <Button
              mode="outlined"
              onPress={handlePrevious}
              style={[styles.button, styles.previousButton]}
              labelStyle={styles.buttonText}
            >
              Previous
            </Button>
          )}

          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.button, styles.nextButton]}
            labelStyle={styles.buttonText}
          >
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.7,
  },
  slideGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  icon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  previousButton: {
    borderColor: '#2E7D32',
  },
  nextButton: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
