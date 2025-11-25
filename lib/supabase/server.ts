/**
 * Supabase Server Utilities
 * 
 * This file contains server-side utilities for Supabase operations.
 * These are helper functions for API routes and server components.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client for server-side operations
 * Use this in API routes and server components
 */
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Validates authentication token from request headers
 * 
 * @param authHeader - Authorization header from request (Bearer token)
 * @returns User object if valid, null otherwise
 */
export const validateAuthToken = async (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createServerClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Standard success response formatter
 * 
 * @param data - Response data
 * @param message - Success message
 * @returns Formatted success response
 */
export const successResponse = (data: any, message = 'Operation successful') => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Standard error response formatter
 * 
 * @param error - Error message
 * @param details - Optional error details
 * @returns Formatted error response
 */
export const errorResponse = (error: string, details?: any) => {
  return {
    success: false,
    error,
    ...(details && { details }),
  };
};

/**
 * Gets user from authorization header
 * Shorthand for common pattern in API routes
 * 
 * @param request - Next.js request object
 * @returns User object or null
 */
export const getUserFromRequest = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  return await validateAuthToken(authHeader);
};
