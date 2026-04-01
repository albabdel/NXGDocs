// classic/src/pages/auth/callback.tsx
// Auth0 callback handler — handles both Auth0 SDK callback and Zoho session exchange
//
// Two callback modes:
// 1. Auth0 SDK callback (code in URL search params) — for general auth
// 2. Zoho callback (id_token in URL hash) — for support portal session
//
// Flow for Auth0 SDK:
//   1. Auth0 redirects here after login: /auth/callback?code=...&state=...
//   2. Auth0 SDK handles the callback automatically
//   3. Redirects to stored path or home
//
// Flow for Zoho:
//   1. Auth0 redirects here after login: /auth/callback#id_token=...&nonce=...
//   2. This page extracts the id_token from the hash
//   3. POSTs to /zoho-customer-auth with { action: 'auth0-exchange', idToken }
//   4. On success: stores profile in sessionStorage, redirects to /support
//   5. On error: shows error message with link back to /support

import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthCallback } from '../../components/Auth';
import '../../css/components/admin.css';

const SESSION_STORAGE_KEY = 'zoho_customer_session';
const PENDING_NONCE_KEY = 'zoho_pending_nonce';
const PENDING_MODE_KEY = 'zoho_pending_mode';

/**
 * Zoho callback handler for support portal authentication.
 * Exchanges Auth0 id_token for Zoho session.
 */
function ZohoCallbackHandler() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    // Handle Auth0 error response
    const hashParams = new URLSearchParams(hash);
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    if (error) {
      setErrorMessage(errorDescription ?? error);
      setStatus('error');
      return;
    }

    const idToken = hashParams.get('id_token');
    if (!idToken) {
      setErrorMessage('No token received from Auth0. Please try signing in again.');
      setStatus('error');
      return;
    }

    // Verify nonce to prevent replay attacks
    const storedNonce = localStorage.getItem(PENDING_NONCE_KEY);
    localStorage.removeItem(PENDING_NONCE_KEY);
    localStorage.removeItem(PENDING_MODE_KEY);

    if (storedNonce) {
      try {
        const payload = JSON.parse(
          atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );
        if (payload.nonce !== storedNonce) {
          setErrorMessage('Security check failed. Please try signing in again.');
          setStatus('error');
          return;
        }
      } catch {
        // If nonce decode fails, let the server-side check handle it
      }
    }

    // Clear hash from URL immediately
    window.history.replaceState(null, '', window.location.pathname);

    // Exchange the id_token for a Zoho session
    (async () => {
      try {
        const res = await fetch('/zoho-customer-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'auth0-exchange', idToken }),
        });

        let data: Record<string, unknown>;
        try {
          data = await res.json();
        } catch {
          throw new Error(`Server error (${res.status})`);
        }

        if (!res.ok || !data.ok) {
          throw new Error((data.error as string) ?? 'Failed to set up support access');
        }

        // Store profile data (session cookie is HttpOnly — set by server)
        const sessionData = {
          mode: 'customer',
          contactId: data.contactId ?? '',
          accountId: data.accountId ?? null,
          displayName: data.displayName ?? '',
          account: data.account ?? null,
          sessionExpiry: Date.now() + 24 * 60 * 60 * 1000,
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));

        setStatus('success');
        // Redirect to support portal
        window.location.href = '/support';
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setErrorMessage(msg);
        setStatus('error');
      }
    })();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Signing you in…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="auth-error-card">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
            Sign-in failed
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {errorMessage}
          </p>
          <a
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            Back to Support Portal
          </a>
        </div>
      </div>
    );
  }

  // Success — redirect is in progress
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }}
      />
      <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
        Redirecting to support portal…
      </p>
    </div>
  );
}

/**
 * Router component that determines which callback handler to use.
 * - Auth0 SDK callback (code in search params) → AuthCallback component
 * - Zoho callback (id_token in hash) → ZohoCallbackHandler
 */
function CallbackRouter() {
  const { isAuthenticated } = useAuth0();

  // Check callback type based on URL
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
  const hashParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.hash.substring(1))
    : new URLSearchParams();

  const hasAuthCode = searchParams.has('code') || searchParams.has('error');
  const hasZohoToken = hashParams.has('id_token') || hashParams.has('error');

  // Auth0 SDK callback (authorization code flow)
  if (hasAuthCode) {
    return <AuthCallback />;
  }

  // Zoho callback (implicit flow with id_token in hash)
  if (hasZohoToken) {
    return <ZohoCallbackHandler />;
  }

  // Already authenticated (returning after SDK handled callback)
  if (isAuthenticated) {
    // Redirect to stored path or home
    const redirectPath = sessionStorage.getItem('auth0_redirect_path') || '/';
    sessionStorage.removeItem('auth0_redirect_path');
    window.location.href = redirectPath;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Redirecting…
        </p>
      </div>
    );
  }

  // No callback detected - show loading while SDK initializes
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
      />
      <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
        Signing you in…
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Layout
      title="Signing in… | NXGEN"
      description="Completing sign-in"
    >
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <BrowserOnly fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
            />
          </div>
        }>
          {() => <CallbackRouter />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
