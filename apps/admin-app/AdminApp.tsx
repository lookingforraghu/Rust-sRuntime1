import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Import screens
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AssignedGrievancesScreen from './screens/AssignedGrievancesScreen';
import UpdateStatusScreen from './screens/UpdateStatusScreen';
import PerformanceScreen from './screens/PerformanceScreen';
import AdminProfileScreen from './screens/AdminProfileScreen';
import GrievanceDetailScreen from './screens/GrievanceDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack Navigator
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={AdminDashboardScreen} />
    <Stack.Screen name="GrievanceDetail" component={GrievanceDetailScreen} />
  </Stack.Navigator>
);

// Grievances Stack Navigator
const GrievancesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GrievancesMain" component={AssignedGrievancesScreen} />
    <Stack.Screen name="GrievanceDetail" component={GrievanceDetailScreen} />
    <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
  </Stack.Navigator>
);

// Performance Stack Navigator
const PerformanceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerformanceMain" component={PerformanceScreen} />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={AdminProfileScreen} />
  </Stack.Navigator>
);

const AdminApp: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Grievances':
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
              break;
            case 'Performance':
              iconName = focused ? 'chart-line' : 'chart-line-variant';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Grievances" 
        component={GrievancesStack}
        options={{
          tabBarLabel: 'Grievances',
        }}
      />
      <Tab.Screen 
        name="Performance" 
        component={PerformanceStack}
        options={{
          tabBarLabel: 'Performance',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminApp;
