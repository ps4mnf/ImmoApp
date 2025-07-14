import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function getScreenDimensions() {
  const { width, height } = Dimensions.get('window');
  return { width, height };
}

export function isTablet(): boolean {
  const { width, height } = getScreenDimensions();
  const aspectRatio = width / height;
  
  // Consider it a tablet if the screen is large enough and has a tablet-like aspect ratio
  return (width >= 768 || height >= 768) && (aspectRatio > 1.2 && aspectRatio < 2.1);
}

export function getResponsiveValue<T>(phone: T, tablet: T, desktop?: T): T {
  if (isWeb && desktop !== undefined) {
    return desktop;
  }
  
  return isTablet() ? tablet : phone;
}

export function getSafeAreaPadding() {
  if (isIOS) {
    return {
      paddingTop: 44, // Status bar height on iOS
      paddingBottom: 34, // Home indicator height
    };
  }
  
  if (isAndroid) {
    return {
      paddingTop: 24, // Status bar height on Android
      paddingBottom: 0,
    };
  }
  
  return {
    paddingTop: 0,
    paddingBottom: 0,
  };
}