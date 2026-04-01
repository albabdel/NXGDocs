// functions/lib/auth-session.ts
// Shared session utilities for Auth0-based authentication
//
// Purpose: Server-side session management for Auth0 authenticated users
// - Session cookies (signed format) for user identity
// - HMAC-SHA256 signing for tamper-proof sessions
// - Separate from Zoho session (different cookie name, different claims)
//
// Environment variables required:
//   SESSION_SECRET  — HMAC secret for signing session cookies (32+ bytes recommended)
//   AUTH0_DOMAIN    — Auth0 tenant domain for JWKS verification

// ---------------------------------------------------------------------------
// Crypto utilities (inline to avoid module resolution issues in Cloudflare)
// ---------------------------------------------------------------------------

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacSign(secret: string, data: string): Promise<string> {
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

async function hmacVerify(secret: string, data: string, signature: string): Promise<boolean> {
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
// Types
// ---------------------------------------------------------------------------

export interface AuthSession {
  userId: string;        // Auth0 'sub' claim
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin' | 'operator' | 'manager';
  orgId?: string;
  productAccess: string[]; // Products user has access to (e.g., 'gcxone', 'gcsurge')
  iat: number;           // Issued at (Unix seconds)
  exp: number;           // Expiration (Unix seconds)
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  picture?: string;
  role?: 'user' | 'admin' | 'operator' | 'manager';
  orgId?: string;
  productAccess?: string[];
}

export interface AuthEnv {
  SESSION_SECRET: string;
  AUTH0_DOMAIN: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const AUTH_SESSION_COOKIE_NAME = 'nxgen_auth_session';
const AUTH_SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours

// ---------------------------------------------------------------------------
// Session Cookie Utilities
// ---------------------------------------------------------------------------

/**
 * Create a signed session token.
 * Format: base64url(payload).signature
 * Where payload is JSON of AuthSession, signature is HMAC-SHA256 of payload.
 */
export async function createSession(
  user: AuthUser,
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // Default to 'user' role and 'gcxone' product access for backwards compatibility
  const role = user.role ?? 'user';
  const productAccess = user.productAccess ?? ['gcxone'];
  
  const session: AuthSession = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    picture: user.picture,
    role,
    orgId: user.orgId,
    productAccess,
    iat: now,
    exp: now + AUTH_SESSION_DURATION_SECONDS,
  };

  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await hmacSign(secret, payload);
  return `${payload}.${signature}`;
}

/**
 * Verify and decode a session token.
 * Returns the AuthSession if valid, null if invalid/expired.
 */
export async function verifySession(
  token: string,
  secret: string,
): Promise<AuthSession | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;

    // Verify signature
    const valid = await hmacVerify(secret, payload, signature);
    if (!valid) return null;

    // Decode payload
    const session = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload)),
    ) as AuthSession;

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
 * Build a Set-Cookie header value for the session cookie.
 */
export function buildSessionCookie(
  token: string,
  secure = true,
): string {
  const parts = [
    `${AUTH_SESSION_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${AUTH_SESSION_DURATION_SECONDS}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

/**
 * Build a Set-Cookie header value to clear the session cookie.
 */
export function buildClearSessionCookie(): string {
  return `${AUTH_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Extract session from cookie header.
 * Returns AuthSession if valid, null otherwise.
 */
export async function getSessionFromHeader(
  cookieHeader: string | null,
  secret: string,
): Promise<AuthSession | null> {
  if (!cookieHeader) return null;

  // Parse cookie header to find our session cookie
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const sessionCookie = cookies.find((c) =>
    c.startsWith(`${AUTH_SESSION_COOKIE_NAME}=`),
  );
  if (!sessionCookie) return null;

  const value = sessionCookie.substring(AUTH_SESSION_COOKIE_NAME.length + 1);
  return verifySession(value, secret);
}

/**
 * Create a full session from user info.
 * Returns both the session object and the Set-Cookie header.
 */
export async function createFullSession(
  user: AuthUser,
  secret: string,
): Promise<{ session: AuthSession; cookieHeader: string }> {
  const token = await createSession(user, secret);
  const cookieHeader = buildSessionCookie(token);

  const now = Math.floor(Date.now() / 1000);
  const role = user.role ?? 'user';
  const productAccess = user.productAccess ?? ['gcxone'];
  
  const session: AuthSession = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    picture: user.picture,
    role,
    orgId: user.orgId,
    productAccess,
    iat: now,
    exp: now + AUTH_SESSION_DURATION_SECONDS,
  };

  return { session, cookieHeader };
}
