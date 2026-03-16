import { useState, useEffect, useCallback } from 'react';
import type { ZohoTokenData, ZohoSessionData, ZohoAuthData, LoginMode, AuthError, AuthErrorType } from './types';

// ---------------------------------------------------------------------------
// Zoho agent OAuth (unchanged from original)
// ---------------------------------------------------------------------------

const ZOHO_CLIENT_ID = '1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN';
const ZOHO_AUTH_URL = 'https://accounts.zoho.eu/oauth/v2/auth';

const AGENT_SCOPES = [
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.tickets.CREATE',
  'Desk.contacts.READ',
  'Desk.agents.READ',
  'Desk.search.READ',
  'Desk.basic.READ',
  'aaaserver.profile.read',
].join(',');

// ---------------------------------------------------------------------------
// Auth0 customer OAuth (implicit, id_token only)
// ---------------------------------------------------------------------------

const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'ygWwMxVGpKHSxLLdNxfxPs8GHCIQRwES'; // "NXGEN Docs Portal" SPA app

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const TOKEN_STORAGE_KEY = 'zoho_agent_token';
const SESSION_STORAGE_KEY = 'zoho_customer_session';
const PENDING_MODE_KEY = 'zoho_pending_mode';
const PENDING_NONCE_KEY = 'zoho_pending_nonce';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRedirectUri(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/support`;
}

function randomString(len = 32): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// --- Zoho agent ---

function buildZohoAgentUrl(): string {
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: ZOHO_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: AGENT_SCOPES,
    access_type: 'online',
  });
  return `${ZOHO_AUTH_URL}?${params}`;
}

function parseZohoHash(): { accessToken: string; expiry: number } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.substring(1);
  if (!hash || !hash.includes('access_token')) return null;
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');
  if (!accessToken) return null;
  return { accessToken, expiry: Date.now() + parseInt(expiresIn ?? '3600') * 1000 };
}

// --- Auth0 customer ---

function buildAuth0Url(nonce: string): string {
  const params = new URLSearchParams({
    response_type: 'id_token',
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: 'openid email profile',
    nonce,
  });
  return `https://${AUTH0_DOMAIN}/authorize?${params}`;
}

function parseAuth0Hash(): { idToken: string; nonce?: string } | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.substring(1);
  if (!hash || !hash.includes('id_token')) return null;
  const params = new URLSearchParams(hash);
  const idToken = params.get('id_token');
  if (!idToken) return null;
  return { idToken };
}

// --- Storage ---

function loadStoredToken(): ZohoTokenData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    const data: ZohoTokenData = JSON.parse(stored);
    if (data.expiry < Date.now() + 60_000) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function loadStoredSession(): ZohoSessionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const data: ZohoSessionData = JSON.parse(stored);
    // Session cookie validity is checked by server; we just check local expiry
    if (data.sessionExpiry < Date.now()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Error Classification
// ---------------------------------------------------------------------------

function classifyAuthError(error: unknown): AuthError {
  if (!(error instanceof Error)) {
    return { type: 'unknown', message: 'An unexpected error occurred.', retryable: false };
  }

  const msg = error.message.toLowerCase();

  // Network errors
  if (
    msg.includes('network') ||
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('connection') ||
    msg.includes('timeout')
  ) {
    return {
      type: 'network_error',
      message: 'Unable to connect to the server.',
      action: 'Check your internet connection and try again.',
      retryable: true,
    };
  }

  // Contact not found (no Zoho Desk account)
  if (msg.includes('no support account found') || msg.includes('contact not found')) {
    return {
      type: 'contact_not_found',
      message: 'No support account found.',
      action: 'Contact NXGEN support to set up your portal access.',
      retryable: false,
    };
  }

  // Portal access denied
  if (msg.includes('portal access denied') || msg.includes('access denied') || msg.includes('unauthorized')) {
    return {
      type: 'portal_access_denied',
      message: 'Portal access denied.',
      action: 'Your account does not have permission to access this portal.',
      retryable: false,
    };
  }

  // Invalid or expired token
  if (msg.includes('invalid token') || msg.includes('invalid_token') || msg.includes('token expired')) {
    return {
      type: 'invalid_token',
      message: 'Your session is invalid.',
      action: 'Please sign in again.',
      retryable: false,
    };
  }

  // Session expired
  if (msg.includes('session expired') || msg.includes('session_expired')) {
    return {
      type: 'session_expired',
      message: 'Your session has expired.',
      action: 'Please sign in again.',
      retryable: false,
    };
  }

  // Server errors (5xx)
  if (msg.includes('server error') || msg.includes('500') || msg.includes('502') || msg.includes('503')) {
    return {
      type: 'server_error',
      message: 'Server is temporarily unavailable.',
      action: 'Please try again in a few moments.',
      retryable: true,
    };
  }

  // Generic error
  return {
    type: 'unknown',
    message: error.message || 'An error occurred during sign in.',
    action: 'Please try again.',
    retryable: true,
  };
}

// ---------------------------------------------------------------------------
// Retry Logic
// ---------------------------------------------------------------------------

async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delayMs?: number; shouldRetry?: (error: unknown) => boolean } = {}
): Promise<T> {
  const { retries = 3, delayMs = 1000, shouldRetry = () => true } = options;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries - 1 || !shouldRetry(error)) {
        throw error;
      }
      // Exponential backoff with jitter
      const delay = delayMs * Math.pow(2, attempt) + Math.random() * 500;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  // This should never be reached, but TypeScript needs it
  throw new Error('Retry exhausted');
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useZohoAuth() {
  const [authData, setAuthData] = useState<ZohoAuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<AuthError | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // 1. Check for Zoho OAuth callback (access_token in hash - agent mode only)
    const zohoRaw = parseZohoHash();
    if (zohoRaw) {
      window.history.replaceState(null, '', window.location.pathname);
      const pendingMode = localStorage.getItem(PENDING_MODE_KEY) as LoginMode | null;
      localStorage.removeItem(PENDING_MODE_KEY);
      
      // Agent token from Zoho OAuth
      const tokenData: ZohoTokenData = {
        accessToken: zohoRaw.accessToken,
        expiry: zohoRaw.expiry,
        mode: 'agent',
      };
      sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
      setAuthData(tokenData);
      setLoading(false);
      return;
    }

    // 2. Check for Auth0 customer callback (id_token in hash)
    const auth0Raw = parseAuth0Hash();
    if (auth0Raw) {
      window.history.replaceState(null, '', window.location.pathname);

      const storedNonce = localStorage.getItem(PENDING_NONCE_KEY);
      localStorage.removeItem(PENDING_NONCE_KEY);
      localStorage.removeItem(PENDING_MODE_KEY);

      // Verify nonce in id_token payload
      try {
        const payload = JSON.parse(atob(auth0Raw.idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (storedNonce && payload.nonce !== storedNonce) {
          setLoginError({
            type: 'nonce_mismatch',
            message: 'Security check failed.',
            action: 'Please try signing in again.',
            retryable: false,
          });
          setLoading(false);
          return;
        }
      } catch {
        // nonce check failed silently — Cloudflare Function will still verify the signature
      }

      // Exchange the id_token for a Zoho session via Cloudflare Function
      // Response no longer contains accessToken - session cookie is HttpOnly
      (async () => {
        try {
          setRetrying(true);

          const data = await withRetry(
            async () => {
              const res = await fetch('/zoho-customer-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'auth0-exchange', idToken: auth0Raw.idToken }),
              });
              const text = await res.text();
              let parsed: Record<string, unknown>;
              try {
                parsed = JSON.parse(text);
              } catch {
                throw new Error(`Server error (${res.status}): ${text.slice(0, 200)}`);
              }

              if (!res.ok || !parsed.ok) {
                throw new Error((parsed.error as string) ?? 'Failed to set up support access');
              }

              return parsed as {
                contactId?: string;
                accountId?: string | null;
                displayName?: string;
                account?: string | null;
                sessionExpiry?: number;
              };
            },
            {
              retries: 3,
              delayMs: 500,
              shouldRetry: (error) => {
                const classified = classifyAuthError(error);
                return classified.retryable ?? false;
              },
            }
          );

          setRetrying(false);

          // Store only profile data - NO access token
          // Session cookie is HttpOnly (JS can't access it)
          const sessionData: ZohoSessionData = {
            mode: 'customer',
            contactId: data.contactId ?? '',
            accountId: data.accountId ?? null,
            displayName: data.displayName ?? '',
            account: data.account ?? null,
            sessionExpiry: data.sessionExpiry ?? Date.now() + 3600 * 1000,
          };
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
          setAuthData(sessionData);
          setLoginError(null);
        } catch (e: unknown) {
          setRetrying(false);
          const classifiedError = classifyAuthError(e);
          setLoginError(classifiedError);
          setAuthData(null);
        } finally {
          setLoading(false);
        }
      })();
      return; // keep loading=true until async block completes
    }

    // 3. Restore from sessionStorage (check both token and session)
    const storedToken = loadStoredToken();
    const storedSession = loadStoredSession();
    setAuthData(storedToken ?? storedSession);
    setLoading(false);
  }, []);

  /** Redirect to Zoho OAuth for agent login */
  const loginAgent = useCallback(() => {
    setLoginError(null);
    setRetrying(false);
    localStorage.setItem(PENDING_MODE_KEY, 'agent');
    window.location.href = buildZohoAgentUrl();
  }, []);

  /** Redirect to Auth0 for customer login */
  const loginCustomer = useCallback(() => {
    setLoginError(null);
    setRetrying(false);
    const nonce = randomString(16);
    localStorage.setItem(PENDING_NONCE_KEY, nonce);
    localStorage.setItem(PENDING_MODE_KEY, 'customer');
    window.location.href = buildAuth0Url(nonce);
  }, []);

  /** Clear error and retry login */
  const clearError = useCallback(() => {
    setLoginError(null);
    setRetrying(false);
  }, []);

  const logout = useCallback(async () => {
    // Clear local storage
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(PENDING_MODE_KEY);
    localStorage.removeItem(PENDING_NONCE_KEY);
    setAuthData(null);
    setLoginError(null);
    setRetrying(false);

    // For customer mode, notify server to clear session cookie
    if (authData?.mode === 'customer') {
      try {
        await fetch('/zoho-logout', { method: 'POST' });
      } catch {
        // Ignore logout errors - session will expire on server anyway
      }
    }
  }, [authData?.mode]);

  // Extract values based on auth type
  const token = authData?.mode === 'agent' ? authData.accessToken : null;
  const session = authData?.mode === 'customer' ? authData : null;

  return {
    // Token for agents (API calls need it)
    token,
    // Session data for customers (no secrets)
    session,
    isAuthenticated: !!authData,
    loading,
    loginError,
    retrying,
    login: useCallback((mode: LoginMode = 'agent') => {
      if (mode === 'customer') loginCustomer();
      else loginAgent();
    }, [loginAgent, loginCustomer]),
    loginAgent,
    loginCustomer,
    logout,
    clearError,
    mode: authData?.mode ?? null,
    contactId: session?.contactId ?? null,
    accountId: session?.accountId ?? null,
    displayName: authData?.mode === 'customer'
      ? authData.displayName
      : authData?.mode === 'agent'
        ? 'Agent'
        : null,
  };
}
