// classic/src/hooks/useAuthSession.ts
// React hook for Auth0 session management with server-side validation
//
// Purpose:
//   - Combine Auth0 SDK auth state with server session
//   - Validate/create server session on mount
//   - Provide unified auth state for the entire app
//
// Usage:
//   const { isAuthenticated, isLoading, user, sessionChecked, login, logout } = useAuthSession();

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin' | 'operator' | 'manager';
  productAccess: string[];
}

export interface SessionResponse {
  authenticated: boolean;
  user?: AuthUser;
  zohoContactCreated?: boolean;
  error?: string;
}

export interface UseAuthSessionResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  sessionChecked: boolean;
  zohoContactCreated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing Auth0 authentication with server-side session validation.
 * 
 * This hook wraps the Auth0 SDK and adds:
 * - Server-side session creation/validation
 * - Zoho contact auto-registration status
 * - Unified logout (clears both Auth0 and server session)
 */
export function useAuthSession(): UseAuthSessionResult {
  const {
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [zohoContactCreated, setZohoContactCreated] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check/create server session on mount and when Auth0 state changes
  useEffect(() => {
    // Wait for Auth0 to finish loading
    if (auth0Loading) {
      return;
    }

    // If Auth0 says not authenticated, check if we have a server session
    // (session cookie might exist from a previous login)
    if (!auth0Authenticated) {
      // Check for existing server session
      fetch('/auth/session', {
        method: 'GET',
        credentials: 'include', // Include cookies
      })
        .then(res => res.json())
        .then((data: SessionResponse) => {
          if (data.authenticated && data.user) {
            setSessionUser(data.user);
            setZohoContactCreated(data.zohoContactCreated ?? false);
          } else {
            setSessionUser(null);
          }
          setSessionChecked(true);
          setSessionLoading(false);
        })
        .catch(err => {
          console.error('Session check failed:', err);
          setError('Failed to verify session');
          setSessionChecked(true);
          setSessionLoading(false);
        });
      return;
    }

    // Auth0 is authenticated - get token and create server session
    getAccessTokenSilently()
      .then(idToken => {
        // Send token to server to create session
        return fetch('/auth/session', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
          credentials: 'include', // Include cookies
        });
      })
      .then(res => res.json())
      .then((data: SessionResponse) => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
          setZohoContactCreated(data.zohoContactCreated ?? false);
        } else {
          setSessionUser(null);
          if (data.error) {
            setError(data.error);
          }
        }
        setSessionChecked(true);
        setSessionLoading(false);
      })
      .catch(err => {
        console.error('Session creation failed:', err);
        setError('Failed to create session');
        setSessionChecked(true);
        setSessionLoading(false);
      });
  }, [auth0Authenticated, auth0Loading, getAccessTokenSilently]);

  // Login function - redirects to Auth0
  const login = useCallback(() => {
    setError(null);
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  }, [loginWithRedirect]);

  // Logout function - clears both Auth0 and server session
  const logout = useCallback(async () => {
    try {
      // Clear server session first
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Server logout failed:', err);
      // Continue with Auth0 logout even if server logout fails
    }

    // Clear local state
    setSessionUser(null);
    setZohoContactCreated(false);
    setSessionChecked(false);
    setError(null);

    // Logout from Auth0
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [auth0Logout]);

  // Combine Auth0 and server session state
  const isLoading = auth0Loading || sessionLoading;
  const isAuthenticated = !!(sessionUser || (auth0Authenticated && sessionChecked));
  
  // Prefer session user (has role, productAccess) over Auth0 user
  const user = sessionUser ?? (auth0User ? {
    userId: auth0User.sub || '',
    email: auth0User.email || '',
    name: auth0User.name || auth0User.email?.split('@')[0] || '',
    picture: auth0User.picture,
    role: 'user' as const,
    productAccess: ['gcxone'],
  } : null);

  return {
    isAuthenticated,
    isLoading,
    user,
    sessionChecked,
    zohoContactCreated,
    login,
    logout,
    error,
  };
}

// ---------------------------------------------------------------------------
// Utility hook for user profile data
// ---------------------------------------------------------------------------

/**
 * Hook for accessing just the user profile data.
 * Useful for components that only need user info, not auth state.
 */
export function useUserProfile() {
  const { user, isAuthenticated, isLoading } = useAuthSession();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    // Convenience properties
    email: user?.email ?? null,
    name: user?.name ?? null,
    picture: user?.picture ?? null,
    role: user?.role ?? null,
    productAccess: user?.productAccess ?? [],
  };
}
