import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type LoadingSpinnerProps = {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
};

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large',
  color = '#2563eb'
}: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});