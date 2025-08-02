import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a comprehensive mock client for development when Supabase is not configured
const createMockClient = () => {
  const mockQuery = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    eq: () => mockQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    order: () => mockQuery,
    gte: () => mockQuery,
    lte: () => mockQuery,
    ilike: () => mockQuery,
    contains: () => mockQuery,
    then: (resolve: any) => resolve({ data: [], error: null }),
  };

  return {
    from: () => mockQuery,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  };
};

// Check if environment variables are properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'your-supabase-url' && 
         supabaseAnonKey !== 'your-supabase-anon-key' &&
         supabaseUrl.startsWith('https://') &&
         supabaseUrl.includes('.supabase.co');
};

let supabase: any;

if (!isSupabaseConfigured()) {
  console.warn('Supabase not configured or using placeholder values. Using mock client for development.');
  supabase = createMockClient();
} else {
  supabase = createClient<Database>(
    supabaseUrl!, 
    supabaseAnonKey!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );
}

export { supabase };