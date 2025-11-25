import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  const url = request.nextUrl.pathname;

  // Define auth routes (accessible only when not authenticated)
  const authRoutes = ['/login', '/signup', '/forget-password', '/reset-password', '/otp', '/callback'];
  
  // Define protected routes (require authentication)
  const protectedRoutes = ['/home', '/dashboard', '/profile', '/gig', '/job'];

  const isAuthRoute = authRoutes.some((route) => url.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => url.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${url}`, request.url)
    );
  }

  // If user is authenticated and trying to access auth routes
  if (session && isAuthRoute && url !== '/callback') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
