import React from 'react';
import { Platform } from 'react-native';
import { Image as ExpoImage, ImageProps as ExpoImageProps } from 'expo-image';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

// Create a unified image component that handles platform differences
type ImageWrapperProps = ExpoImageProps & {
  fallback?: boolean;
};

export default function ImageWrapper({ fallback = false, ...props }: ImageWrapperProps) {
  // Use React Native Image as fallback if expo-image fails
  if (fallback || Platform.OS === 'web') {
    const rnProps: RNImageProps = {
      source: typeof props.source === 'string' ? { uri: props.source } : props.source,
      style: props.style,
      onLoad: props.onLoad,
      onError: props.onError,
      resizeMode: props.contentFit as any,
    };
    return <RNImage {...rnProps} />;
  }

  try {
    return <ExpoImage {...props} />;
  } catch (error) {
    console.warn('Expo Image failed, falling back to React Native Image:', error);
    const rnProps: RNImageProps = {
      source: typeof props.source === 'string' ? { uri: props.source } : props.source,
      style: props.style,
      onLoad: props.onLoad,
      onError: props.onError,
      resizeMode: props.contentFit as any,
    };
    return <RNImage {...rnProps} />;
  }
}

// Export both for compatibility
export { ExpoImage as Image };
export { ImageWrapper };