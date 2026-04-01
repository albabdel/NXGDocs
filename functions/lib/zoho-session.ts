// functions/lib/zoho-session.ts
// Shared session utilities for Zoho authentication
//
// Purpose: Server-side session management to prevent service account token leakage to browser
// - Session cookies (signed JWT-like format) for user identity
// - In-memory token cache (per-worker) for Zoho service account tokens
//
// Environment variables required:
//   ZOHO_SESSION_SECRET  — HMAC secret for signing session cookies (32+ bytes recommended)
//   ZOHO_REFRESH_TOKEN   — Service account refresh token
//   ZOHO_CLIENT_ID       — OAuth client ID
//   ZOHO_CLIENT_SECRET   — OAuth client secret
//   ZOHO_ORG_ID          — Organization ID

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ZohoSession {
  contactId: string;
  accountId: string | null;
  displayName: string;
  productAccess: string[]; // Products user has access to (e.g., 'gcxone', 'gcsurge')
  iat: number; // Issued at (Unix seconds)
  exp: number; // Expiration (Unix seconds)
}

export interface ZohoEnv {
  ZOHO_SESSION_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_ORG_ID: string;
}

export interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp (ms)
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SESSION_COOKIE_NAME = 'zoho_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours
const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutes (tokens last 60 min)

// Global token cache (per-worker, isolated between workers)
let tokenCache: TokenCache | null = null;

// ---------------------------------------------------------------------------
// Crypto utilities (Web Crypto API, no external deps)
// ---------------------------------------------------------------------------

export function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function hmacVerify(secret: string, data: string, signature: string): Promise<boolean> {
  const expectedSignature = await hmacSign(secret, data);
  // Constant-time comparison to prevent timing attacks
  if (expectedSignature.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

// ---------------------------------------------------------------------------
// Session Cookie Utilities
// ---------------------------------------------------------------------------

/**
 * Create a signed session cookie value.
 * Format: base64url(payload).signature
 * Where payload is JSON of ZohoSession, signature is HMAC-SHA256 of payload.
 *
 * @param productAccess - Array of products user has access to. Defaults to ['gcxone'] for backwards compatibility.
 */
export async function createSessionCookie(
  contactId: string,
  accountId: string | null,
  displayName: string,
  secret: string,
  productAccess: string[] = ['gcxone'],
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: ZohoSession = {
    contactId,
    accountId,
    displayName,
    productAccess,
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  };

  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await hmacSign(secret, payload);
  return `${payload}.${signature}`;
}

/**
 * Verify and decode a session cookie.
 * Returns the ZohoSession if valid, null if invalid/expired.
 */
export async function verifySessionCookie(
  cookie: string,
  secret: string,
): Promise<ZohoSession | null> {
  try {
    const parts = cookie.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;

    // Verify signature
    const valid = await hmacVerify(secret, payload, signature);
    if (!valid) return null;

    // Decode payload
    const session = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload)),
    ) as ZohoSession;

    // Check expiration
    if (session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Extract session from cookie header.
 * Returns ZohoSession if valid, null otherwise.
 */
export async function getSessionFromHeader(
  cookieHeader: string | null,
  secret: string,
): Promise<ZohoSession | null> {
  if (!cookieHeader) return null;

  // Parse cookie header to find our session cookie
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!sessionCookie) return null;

  const value = sessionCookie.substring(SESSION_COOKIE_NAME.length + 1);
  return verifySessionCookie(value, secret);
}

// ---------------------------------------------------------------------------
// Token Caching
// ---------------------------------------------------------------------------

/**
 * Get a cached Zoho access token or refresh if expired.
 * Uses in-memory cache (per-worker) with 50-minute TTL.
 */
export async function getCachedToken(env: ZohoEnv): Promise<string> {
  const now = Date.now();

  // Check if cache is valid
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  // Refresh the token
  const newToken = await refreshZohoToken(env);

  // Update cache
  tokenCache = {
    accessToken: newToken.accessToken,
    expiresAt: now + TOKEN_CACHE_TTL_MS,
  };

  return newToken.accessToken;
}

/**
 * Force refresh the cached token (e.g., after a 401 error).
 */
export async function forceRefreshToken(env: ZohoEnv): Promise<string> {
  // Clear cache
  tokenCache = null;

  // Get fresh token
  return getCachedToken(env);
}

/**
 * Exchange refresh token for a fresh Zoho access token.
 * Tokens expire in 1 hour.
 */
async function refreshZohoToken(env: ZohoEnv): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: env.ZOHO_REFRESH_TOKEN,
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Zoho token refresh failed: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!data.access_token) {
    throw new Error(`Zoho refresh error: ${data.error ?? 'Unknown error'}`);
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in ?? 3600,
  };
}

// ---------------------------------------------------------------------------
// Cookie Header Helpers
// ---------------------------------------------------------------------------

/**
 * Build a Set-Cookie header value for the session cookie.
 */
export function buildSessionCookieHeader(
  cookieValue: string,
  secure = true,
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax',
): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${cookieValue}`,
    'Path=/',
    'HttpOnly',
    `SameSite=${sameSite}`,
    `Max-Age=${SESSION_DURATION_SECONDS}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

/**
 * Build a Set-Cookie header value to clear the session cookie.
 */
export function buildClearCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
