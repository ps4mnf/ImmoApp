import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any;

// Create a mock client for demo purposes when environment variables are not properly configured
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo')) {
  console.warn('Using demo Supabase configuration. Please set up your actual Supabase project.');
  
  // Create a chainable mock query builder
  const createMockQueryBuilder = () => {
    const mockBuilder = {
      eq: () => mockBuilder,
      order: () => mockBuilder,
      limit: () => mockBuilder,
      single: () => Promise.resolve({ data: null, error: null }),
      then: (resolve: any) => resolve({ data: [], error: null }),
    };
    return mockBuilder;
  };

  // Create a mock client that returns properly chainable objects
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Demo mode - authentication disabled') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Demo mode - authentication disabled') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => createMockQueryBuilder(),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Demo mode - database writes disabled') }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Demo mode - database writes disabled') }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: new Error('Demo mode - database writes disabled') }),
      }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };