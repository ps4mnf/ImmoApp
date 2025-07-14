import { supabase } from '@/services/supabase';

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
}

export async function initializeSupabase(): Promise<void> {
  try {
    // Check if we can connect to Supabase
    const isConnected = await checkSupabaseConnection();
    
    if (!isConnected) {
      console.warn('Supabase connection failed. Using offline mode.');
      return;
    }
    
    console.log('Supabase connected successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
  }
}

export function handleSupabaseError(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  // Handle common Supabase errors
  if (error.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (error.code === '23505') {
    return 'This record already exists';
  }
  
  if (error.code === '42501') {
    return 'Permission denied';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Database operation failed';
}