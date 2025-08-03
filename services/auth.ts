import { supabase } from './supabase';
import { createUserProfile } from './users';

export async function signUp(email: string, password: string, profileData: {
  fullName: string;
  phone?: string;
  bio?: string;
  isAgent?: boolean;
  isOwner?: boolean;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: profileData.fullName,
      },
    },
  });

  if (error) throw error;
  
  // Create user profile after successful signup
  if (data.user) {
    await createUserProfile({
      id: data.user.id,
      fullName: profileData.fullName,
      phone: profileData.phone,
      bio: profileData.bio,
      isAgent: profileData.isAgent || false,
      isOwner: profileData.isOwner || false,
    });
  }
  
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}