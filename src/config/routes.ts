// Route configuration for the application
export const ROUTES = {
  // Public routes - accessible without authentication
  PUBLIC: [
    '/',
    '/about',
    '/contact',
    '/products/catalog', // If you want public product browsing
  ],

  // Authentication routes - redirect to dashboard if already logged in
  AUTH: [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/reset-password',
    '/verify-email',
  ],

  // Protected routes - require authentication
  PROTECTED: [
    '/dashboard',
    '/profile',
    '/settings',
    '/products',
    '/orders',
    '/cart',
    '/checkout',
  ],

  // Admin routes - require admin role
  ADMIN: ['/admin', '/admin/users', '/admin/products', '/admin/orders'],
} as const;

export const DEFAULT_REDIRECT_AFTER_LOGIN = '/dashboard';
export const DEFAULT_REDIRECT_AFTER_LOGOUT = '/auth/signin';
