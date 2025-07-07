import { Stack } from 'expo-router';

export default function OwnerLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Owner Dashboard',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'Edit Profile',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="properties" 
        options={{ 
          title: 'My Properties',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="create-property" 
        options={{ 
          title: 'Add Property',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="featured" 
        options={{ 
          title: 'Featured Properties',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{ 
          title: 'Analytics',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}