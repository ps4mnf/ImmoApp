import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export async function requestImagePermissions(): Promise<boolean> {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
  }
  return true;
}

export async function requestCameraPermissions(): Promise<boolean> {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
  }
  return true;
}

export function getImageUri(uri: string): string {
  // Handle different URI formats
  if (uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('http')) {
    return uri;
  }
  
  // For web, ensure proper URL format
  if (Platform.OS === 'web' && !uri.startsWith('http')) {
    return `data:image/jpeg;base64,${uri}`;
  }
  
  return uri;
}

export function validateImageUri(uri: string): boolean {
  if (!uri) return false;
  
  const validFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUri = uri.toLowerCase();
  
  return validFormats.some(format => lowerUri.includes(format)) || 
         uri.startsWith('data:image/') ||
         uri.startsWith('file://') ||
         uri.startsWith('content://') ||
         uri.startsWith('http');
}