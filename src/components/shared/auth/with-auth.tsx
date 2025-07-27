'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { ROUTES } from '@/config/routes';

interface WithAuthOptions {
  requireAuth?: boolean;
  requiredRole?: 'ADMIN' | 'USER';
  redirectTo?: string;
  allowedRoles?: ('ADMIN' | 'USER')[];
}

export function withAuth<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    requiredRole,
    redirectTo,
    allowedRoles,
  } = options;

  return function AuthenticatedComponent(props: T) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (isLoading) return;

      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        const signInUrl =
          redirectTo ||
          `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`;
        router.push(signInUrl);
        return;
      }

      // If user is authenticated but accessing auth routes
      if (
        isAuthenticated &&
        ROUTES.AUTH.includes(pathname as (typeof ROUTES.AUTH)[number])
      ) {
        router.push('/dashboard');
        return;
      }

      // Check role-based access
      if (isAuthenticated && user) {
        // If specific role is required
        if (requiredRole && user.role !== requiredRole) {
          router.push('/dashboard');
          return;
        }

        // If allowed roles are specified
        if (allowedRoles && !allowedRoles.includes(user.role || 'USER')) {
          router.push('/dashboard');
          return;
        }
      }
    }, [isAuthenticated, isLoading, user, router, pathname]);

    // Show loading state
    if (isLoading) {
      return <AuthLoadingComponent />;
    }

    // Show nothing while redirecting
    if (requireAuth && !isAuthenticated) {
      return null;
    }

    // Render the wrapped component
    return <WrappedComponent {...props} />;
  };
}

// Loading component for auth states
function AuthLoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Convenience HOCs for common use cases
export const withProtectedRoute = <T extends object>(
  Component: ComponentType<T>
) => withAuth(Component, { requireAuth: true });

export const withPublicRoute = <T extends object>(
  Component: ComponentType<T>
) => withAuth(Component, { requireAuth: false });

export const withAdminRoute = <T extends object>(Component: ComponentType<T>) =>
  withAuth(Component, { requireAuth: true, requiredRole: 'ADMIN' });

export const withGuestRoute = <T extends object>(Component: ComponentType<T>) =>
  withAuth(Component, { requireAuth: false });
