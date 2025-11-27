import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Storage key for persistence preference
const STORAGE_PREFERENCE_KEY = 'supabase-storage-preference';

// Get storage preference from localStorage (default: sessionStorage behavior)
const getStoragePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_PREFERENCE_KEY) === 'true';
};

// Custom storage adapter that switches between localStorage and sessionStorage
const createAdaptiveStorage = () => {
  return {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      
      // PKCE verifiers should always use localStorage
      if (key.includes('code-verifier')) {
        return localStorage.getItem(key);
      }
      
      // Check preference for session storage
      const useLocalStorage = getStoragePreference();
      
      if (useLocalStorage) {
        return localStorage.getItem(key);
      } else {
        // Try sessionStorage first, then localStorage for existing sessions
        return sessionStorage.getItem(key) || localStorage.getItem(key);
      }
    },
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined') return;
      
      // PKCE verifiers should always use localStorage
      if (key.includes('code-verifier')) {
        localStorage.setItem(key, value);
        return;
      }
      
      const useLocalStorage = getStoragePreference();
      
      if (useLocalStorage) {
        localStorage.setItem(key, value);
        // Clear sessionStorage copy if exists
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        // Clear localStorage copy if exists (except for migration)
        // localStorage.removeItem(key);
      }
    },
    removeItem: (key: string): void => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    },
  };
};

// Create Supabase client with adaptive storage
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createAdaptiveStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

/**
 * Set storage preference for "Keep me logged in" functionality
 * @param keepLoggedIn - true for localStorage (persistent), false for sessionStorage
 */
export const setStoragePreference = (keepLoggedIn: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_PREFERENCE_KEY, keepLoggedIn ? 'true' : 'false');
};

/**
 * Get the current access token from the session
 * @returns The access token or null if not authenticated
 */
export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

/**
 * Get the current authenticated user
 * @returns The user object or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Check if user is currently authenticated
 * @returns true if user has an active session
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Sign out the current user and clear all auth data
 */
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
  // Clear storage preference on logout
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_PREFERENCE_KEY);
  }
};

export default supabase;
