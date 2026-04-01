import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * AuthCallback component handles Auth0 redirect callback.
 * 
 * Flow:
 * 1. User is redirected here after Auth0 login
 * 2. Auth0 SDK automatically handles the callback
 * 3. Component redirects to stored path or home
 * 4. Shows loading state during processing
 */
export default function AuthCallback() {
  const { handleRedirectCallback, isAuthenticated, isLoading, error } = useAuth0();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if we have an auth result in the URL
        if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
          await handleRedirectCallback();
          setStatus('success');
        } else if (window.location.hash.includes('access_token') || window.location.hash.includes('id_token')) {
          // Handle implicit flow if used
          await handleRedirectCallback();
          setStatus('success');
        } else if (isAuthenticated) {
          // Already authenticated
          setStatus('success');
        } else if (error) {
          // Auth0 error
          setErrorMessage(error.message);
          setStatus('error');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setErrorMessage(message);
        setStatus('error');
      }
    };

    processCallback();
  }, [handleRedirectCallback, isAuthenticated, error]);

  // Redirect after successful authentication
  useEffect(() => {
    if (status === 'success' && isAuthenticated) {
      // Get stored redirect path or default to home
      const redirectPath = sessionStorage.getItem('auth0_redirect_path') || '/';
      sessionStorage.removeItem('auth0_redirect_path');
      
      // Use a small delay to ensure state is updated
      const timer = setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [status, isAuthenticated]);

  // Loading state
  if (isLoading || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Signing you in…
        </p>
      </div>
    );
  }

  // Error state
  if (status === 'error' || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Sign-in failed
        </h2>
        <p className="text-sm mb-6 text-center max-w-md" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {errorMessage || error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
            color: '#000',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </a>
      </div>
    );
  }

  // Success state - redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }}
      />
      <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
        Redirecting…
      </p>
    </div>
  );
}
