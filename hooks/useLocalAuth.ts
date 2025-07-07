import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, getSession } from '@/services/localAuth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signIn(email, password);
      setUser(user);
      return { user };
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const { user } = await signUp(email, password, fullName);
      setUser(user);
      return { user };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    session: user ? { user } : null,
    login,
    register,
    logout,
    signIn: login,
    signUp: register,
    signOut: logout,
  };
}