import { useState, useEffect, useCallback } from 'react';
import type { ZohoTokenData, LoginMode } from './types';

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

const PORTAL_SCOPES = [
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.tickets.CREATE',
  'Desk.basic.READ',
].join(',');

// ---------------------------------------------------------------------------
// Auth0 customer OAuth (implicit, id_token only)
// ---------------------------------------------------------------------------

const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'ygWwMxVGpKHSxLLdNxfxPs8GHCIQRwES'; // "NXGEN Docs Portal" SPA app

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'zoho_agent_token';
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

function buildZohoPortalUrl(): string {
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: ZOHO_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: PORTAL_SCOPES,
    access_type: 'online',
    prompt: 'consent',
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
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const data: ZohoTokenData = JSON.parse(stored);
    if (data.expiry < Date.now() + 60_000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useZohoAuth() {
  const [token, setToken] = useState<ZohoTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for Zoho OAuth callback (access_token in hash - works for both agent and portal)
    const zohoRaw = parseZohoHash();
    if (zohoRaw) {
      window.history.replaceState(null, '', window.location.pathname);
      const pendingMode = localStorage.getItem(PENDING_MODE_KEY) as LoginMode | null;
      localStorage.removeItem(PENDING_MODE_KEY);
      
      const tokenData: ZohoTokenData = {
        accessToken: zohoRaw.accessToken,
        expiry: zohoRaw.expiry,
        mode: pendingMode || 'agent',
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
      setToken(tokenData);
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
          setLoginError('Security check failed (nonce mismatch). Please try again.');
          setLoading(false);
          return;
        }
      } catch {
        // nonce check failed silently — Cloudflare Function will still verify the signature
      }

      // Exchange the id_token for a Zoho session via Cloudflare Function
      (async () => {
        try {
          const res = await fetch('/zoho-customer-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'auth0-exchange', idToken: auth0Raw.idToken }),
          });
          const text = await res.text();
          let data: Record<string, unknown>;
          try { data = JSON.parse(text); } catch { throw new Error(`Server error (${res.status}): ${text.slice(0, 200)}`); }
          data = data as {
            ok?: boolean;
            accessToken?: string;
            expiry?: number;
            accountId?: string | null;
            contactId?: string | null;
            displayName?: string;
            error?: string;
          };

          if (!res.ok || !data.ok || !data.accessToken) {
            throw new Error(data.error ?? 'Failed to set up support access');
          }

          const tokenData: ZohoTokenData = {
            accessToken: data.accessToken,
            expiry: data.expiry ?? Date.now() + 3600 * 1000,
            mode: 'customer',
            accountId: data.accountId ?? null,
            contactId: data.contactId ?? null,
            displayName: data.displayName,
          };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
          setToken(tokenData);
        } catch (e: unknown) {
          setLoginError(e instanceof Error ? e.message : 'Login failed. Please try again.');
          setToken(null);
        } finally {
          setLoading(false);
        }
      })();
      return; // keep loading=true until async block completes
    }

    // 3. Restore from sessionStorage
    const stored = loadStoredToken();
    setToken(stored);
    setLoading(false);
  }, []);

  /** Redirect to Zoho OAuth for agent login */
  const loginAgent = useCallback(() => {
    setLoginError(null);
    localStorage.setItem(PENDING_MODE_KEY, 'agent');
    window.location.href = buildZohoAgentUrl();
  }, []);

  /** Redirect to Zoho Portal OAuth for customer login */
  const loginPortal = useCallback(() => {
    setLoginError(null);
    localStorage.setItem(PENDING_MODE_KEY, 'customer');
    window.location.href = buildZohoPortalUrl();
  }, []);

  /** Redirect to Auth0 for customer login (legacy fallback) */
  const loginCustomer = useCallback(() => {
    setLoginError(null);
    const nonce = randomString(16);
    localStorage.setItem(PENDING_NONCE_KEY, nonce);
    localStorage.setItem(PENDING_MODE_KEY, 'customer');
    window.location.href = buildAuth0Url(nonce);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_MODE_KEY);
    localStorage.removeItem(PENDING_NONCE_KEY);
    setToken(null);
    setLoginError(null);
  }, []);

  return {
    token: token?.accessToken ?? null,
    tokenData: token,
    isAuthenticated: !!token,
    loading,
    loginError,
    login: useCallback((mode: LoginMode = 'agent') => {
      if (mode === 'customer') loginPortal();
      else loginAgent();
    }, [loginAgent, loginPortal]),
    loginAgent,
    loginPortal,
    loginCustomer,
    logout,
    mode: token?.mode ?? null,
    accountId: token?.accountId ?? null,
    contactId: token?.contactId ?? null,
    displayName: token?.displayName ?? null,
  };
}
