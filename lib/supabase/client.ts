/**
 * Supabase Client Configuration (Browser)
 * 
 * This file configures the Supabase client for browser-side operations.
 * Features:
 * - Adaptive storage (localStorage/sessionStorage based on "Keep me logged in")
 * - Automatic token refresh
 * - PKCE OAuth flow support
 * - Session persistence
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Custom Storage Adapter for "Keep me logged in" functionality
 * 
 * Behavior:
 * - If user checks "Keep me logged in": Uses localStorage (persists after browser close)
 * - If user doesn't check: Uses sessionStorage (clears on browser close)
 * - PKCE code verifiers always use localStorage for OAuth flow
 */
class AdaptiveStorage {
  private preferenceKey = 'heyprodata-keep-logged-in';

  /**
   * Determines which storage to use based on user preference
   */
  getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;

    const keepLoggedIn = 
      sessionStorage.getItem(this.preferenceKey) === 'true' ||
      localStorage.getItem(this.preferenceKey) === 'true';

    return keepLoggedIn !== false ? localStorage : sessionStorage;
  }

  /**
   * Gets item from storage
   * Always checks localStorage first for PKCE code verifiers
   */
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;

    // Always check localStorage first for PKCE code verifier
    let item = localStorage.getItem(key);

    if (!item) {
      item = sessionStorage.getItem(key);
    }

    return item;
  }

  /**
   * Sets item in storage
   * PKCE-related keys always go to localStorage
   */
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;

    const storage = this.getStorage();

    // For PKCE-related keys, always store in localStorage
    if (key.includes('pkce') || key.includes('code-verifier')) {
      localStorage.setItem(key, value);
    } else {
      storage?.setItem(key, value);
    }
  }

  /**
   * Removes item from both storages
   */
  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage?.removeItem(key);
    sessionStorage?.removeItem(key);
  }
}

const adaptiveStorage = new AdaptiveStorage();

/**
 * Supabase client instance for browser-side operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: adaptiveStorage as any,
  },
});

/**
 * Helper function to set storage preference
 * Call this when user interacts with "Keep me logged in" checkbox
 * 
 * @param keepLoggedIn - Whether to keep user logged in after browser close
 */
export const setStoragePreference = (keepLoggedIn: boolean): void => {
  if (typeof window === 'undefined') return;

  const key = 'heyprodata-keep-logged-in';

  if (keepLoggedIn) {
    localStorage.setItem(key, 'true');
    sessionStorage.setItem(key, 'true');
  } else {
    localStorage.removeItem(key);
    sessionStorage.setItem(key, 'false');
  }
};

/**
 * Helper function to get current access token
 * Useful for making authenticated API calls
 * 
 * @returns Access token or null if not authenticated
 */
export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

/**
 * Helper function to get current user
 * 
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
