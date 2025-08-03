import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { createUserProfile } from '@/services/users';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, profileData: {
    fullName: string;
    phone?: string;
    bio?: string;
    isAgent?: boolean;
    isOwner?: boolean;
  }) => {
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
    
    // Create user profile in our custom users table
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
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    session,
    loading,
    user: session?.user ?? null,
    signIn,
    signUp,
    signOut,
    login: signIn,
    register: signUp,
    logout: signOut,
  };
}