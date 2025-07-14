import React from 'react';
import { Platform, Image as RNImage, ImageProps as RNImageProps } from 'react-native';

// Create a unified image component that works reliably across platforms
type ImageWrapperProps = RNImageProps & {
  source: { uri: string } | number;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
};

export default function ImageWrapper(props: ImageWrapperProps) {
  // Use React Native Image for reliability
  return <RNImage {...props} />;
}

// Export as Image for compatibility
export { ImageWrapper as Image };