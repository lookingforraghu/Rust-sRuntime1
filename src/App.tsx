import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';

// Import theme and context
import { theme } from './constants/theme';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotifications';

// Import screens
import SplashScreenComponent from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import CitizenApp from './apps/citizen-app/CitizenApp';
import AdminApp from './apps/admin-app/AdminApp';
import SupervisorApp from './apps/supervisor-app/SupervisorApp';
import PublicDashboard from './apps/public-dashboard/PublicDashboard';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : (
          <>
            {userRole === 'citizen' && (
              <Stack.Screen name="CitizenApp" component={CitizenApp} />
            )}
            {userRole === 'admin' && (
              <Stack.Screen name="AdminApp" component={AdminApp} />
            )}
            {userRole === 'supervisor' && (
              <Stack.Screen name="SupervisorApp" component={SupervisorApp} />
            )}
            {userRole === 'public' && (
              <Stack.Screen name="PublicDashboard" component={PublicDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NotificationProvider>
          <AppNavigator />
          <StatusBar style="auto" />
          <Toast />
        </NotificationProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
