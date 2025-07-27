import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your route patterns
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/reset-password',
  '/verify-email',
];

const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/reset-password',
  '/verify-email',
];

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/products',
  '/orders',
];

const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or headers
  const token =
    request.cookies.get('access_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const isLoggedIn = !!token;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and trying to access protected or admin routes, redirect to signin
  if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow public routes to pass through
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
