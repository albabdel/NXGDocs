// classic/src/components/Auth/UserProtectedRoute.tsx
// Protected route wrapper for user-facing authenticated pages
//
// Purpose:
//   - Protect user pages (profile, settings, bookmarks, etc.)
//   - Redirect to login if not authenticated
//   - Show loading state while checking auth

import React from 'react';
import { Redirect } from '@docusaurus/router';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from 'lucide-react';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protects user-facing pages that require authentication.
 * Redirects to login if user is not authenticated.
 */
export function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, then back to the original page
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
