import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Citizen App Theme (Green/Blue - Trust, Transparency)
export const citizenTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Green
    primaryContainer: '#C8E6C9',
    secondary: '#1976D2', // Blue
    secondaryContainer: '#BBDEFB',
    tertiary: '#388E3C',
    tertiaryContainer: '#A5D6A7',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    outline: '#BDBDBD',
    shadow: '#000000',
  },
};

// Admin App Theme (Dark/Professional)
export const adminTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1976D2', // Blue
    primaryContainer: '#1565C0',
    secondary: '#424242', // Dark Gray
    secondaryContainer: '#616161',
    tertiary: '#FF9800', // Orange accent
    tertiaryContainer: '#FFB74D',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    background: '#0D1117',
    error: '#F44336',
    errorContainer: '#D32F2F',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    outline: '#424242',
    shadow: '#000000',
  },
};

// Supervisor App Theme (Purple/Orange - Authority, Analytics)
export const supervisorTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7B1FA2', // Purple
    primaryContainer: '#E1BEE7',
    secondary: '#FF9800', // Orange
    secondaryContainer: '#FFE0B2',
    tertiary: '#9C27B0',
    tertiaryContainer: '#F3E5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    outline: '#BDBDBD',
    shadow: '#000000',
  },
};

// Public Dashboard Theme (Neutral)
export const publicTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#424242', // Neutral Gray
    primaryContainer: '#E0E0E0',
    secondary: '#757575',
    secondaryContainer: '#F5F5F5',
    tertiary: '#9E9E9E',
    tertiaryContainer: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    background: '#FFFFFF',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    outline: '#BDBDBD',
    shadow: '#000000',
  },
};

// Default theme (Citizen)
export const theme = citizenTheme;

// Theme selector based on user role
export const getThemeByRole = (role: string) => {
  switch (role) {
    case 'citizen':
      return citizenTheme;
    case 'admin':
      return adminTheme;
    case 'supervisor':
      return supervisorTheme;
    case 'public':
      return publicTheme;
    default:
      return citizenTheme;
  }
};
