import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/otp',
  '/callback',
  '/forget-password',
  '/reset-password',
  '/form',
];

// Routes that authenticated users should be redirected away from
const authRoutes = ['/login', '/signup'];

// Routes that require authentication
const protectedRoutes = [
  '/home',
  '/profile',
  '/dashboard',
  '/explore',
  '/gigs',
  '/collab',
  '/whatson',
  '/notifications',
  '/settings',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check for Supabase auth token in cookies
  // Supabase stores session in cookies with format: sb-<project-ref>-auth-token
  const supabaseAuthCookie = request.cookies.getAll().find(
    cookie => cookie.name.includes('auth-token') || cookie.name.includes('supabase')
  );

  // Also check for legacy accessToken cookie
  const legacyToken = request.cookies.get('accessToken')?.value;

  // Try to get session from Supabase auth cookie
  let isAuthenticated = false;
  
  if (supabaseAuthCookie?.value) {
    try {
      // Parse the auth cookie to check if session is valid
      const authData = JSON.parse(supabaseAuthCookie.value);
      if (authData?.access_token && authData?.expires_at) {
        // Check if token is not expired
        const expiresAt = authData.expires_at * 1000; // Convert to milliseconds
        isAuthenticated = Date.now() < expiresAt;
      }
    } catch (e) {
      // Cookie parsing failed, try alternative check
      isAuthenticated = false;
    }
  }

  // Fallback to legacy token check
  if (!isAuthenticated && legacyToken) {
    isAuthenticated = true;
  }

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
