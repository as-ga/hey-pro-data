/**
 * Authentication Context Provider
 * 
 * This context provides authentication state and methods throughout the application.
 * It handles:
 * - Session management
 * - User state
 * - Authentication state changes
 * - Sign out functionality
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

/**
 * Custom hook to use auth context
 * 
 * @returns Auth context value
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Wrap your app with this to provide auth context
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setUser(session?.user ?? null);

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          // Clear local storage
          localStorage.removeItem('heyprodata-keep-logged-in');
          sessionStorage.removeItem('heyprodata-keep-logged-in');
          router.push('/login');
        }

        // Handle sign in
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  /**
   * Sign out the current user
   * Clears session and redirects to login
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear storage preferences
      localStorage.removeItem('heyprodata-keep-logged-in');
      sessionStorage.removeItem('heyprodata-keep-logged-in');
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
