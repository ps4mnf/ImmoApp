import { useState, useEffect } from 'react';
import { getOwnerProfile, updateOwnerProfile, createOwnerProfile } from '@/services/owners';
import { useAuth } from './useAuth';
import type { OwnerProfile } from '@/types/owner';

export function useOwnerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      let data = await getOwnerProfile(user.id);
      
      // Create profile if it doesn't exist
      if (!data) {
        data = await createOwnerProfile({
          userId: user.id,
          businessName: user.user_metadata?.full_name + ' Real Estate' || 'Real Estate Business',
          subscriptionTier: 'basic',
        });
      }
      
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<OwnerProfile>) => {
    if (!user) return;

    console.log('useOwnerProfile: Updating profile with:', updates);

    try {
      let updatedProfile;
      
      if (profile) {
        // Update existing profile
        updatedProfile = await updateOwnerProfile(user.id, updates);
      } else {
        // Create new profile if it doesn't exist
        updatedProfile = await createOwnerProfile({
          userId: user.id,
          ...updates,
        });
      }
      
      setProfile(updatedProfile);
      console.log('Profile updated successfully:', updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}