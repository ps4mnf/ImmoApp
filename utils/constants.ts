import { Platform } from 'react-native';

export const APP_CONFIG = {
  name: 'Real Estate App',
  version: '1.0.0',
  supportEmail: 'support@realestateapp.com',
};

export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: '@real_estate_app:user_preferences',
  SEARCH_HISTORY: '@real_estate_app:search_history',
  FAVORITES: '@real_estate_app:favorites',
};

export const SCREEN_NAMES = {
  HOME: 'Home',
  SEARCH: 'Search',
  FAVORITES: 'Favorites',
  MESSAGES: 'Messages',
  PROFILE: 'Profile',
  PROPERTY_DETAILS: 'PropertyDetails',
  LOGIN: 'Login',
  REGISTER: 'Register',
} as const;

export const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e5e7eb',
} as const;

export const FONTS = {
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const SHADOW = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    },
  }),
};