// functions/lib/admin-session.ts
// Admin session management with HttpOnly cookies for Admin Command Center
//
// Purpose: Secure session management for admin authentication
// - Session cookies (signed format) for admin identity
// - HMAC-SHA256 signing for tamper-proof sessions
//
// Environment variables required:
//   ZOHO_SESSION_SECRET  — HMAC secret for signing session cookies

// ---------------------------------------------------------------------------
// Crypto utilities (inline to avoid module resolution issues in Cloudflare)
// ---------------------------------------------------------------------------

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const base64 = btoa(String.fromCharCode(...bytes));
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

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  orgId: string;
  role: 'admin';
  loginTimestamp: number;
  expiresAt: number;
}

export interface AdminUser {
  userId: string;
  email: string;
  name: string;
  orgId: string;
}

export interface AdminEnv {
  ZOHO_SESSION_SECRET: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ADMIN_SESSION_COOKIE_NAME = 'nxgen_admin_session';
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours

// ---------------------------------------------------------------------------
// Session Cookie Utilities
// ---------------------------------------------------------------------------

async function createAdminSessionCookie(
  user: AdminUser,
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    orgId: user.orgId,
    role: 'admin',
    loginTimestamp: now,
    expiresAt: now + ADMIN_SESSION_DURATION_SECONDS,
  };

  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await hmacSign(secret, payload);
  return `${payload}.${signature}`;
}

async function verifyAdminSessionCookie(
  cookie: string,
  secret: string,
): Promise<AdminSession | null> {
  try {
    const parts = cookie.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;

    const valid = await hmacVerify(secret, payload, signature);
    if (!valid) return null;

    const session = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload)),
    ) as AdminSession;

    if (session.expiresAt < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie Header Helpers
// ---------------------------------------------------------------------------

export function buildAdminSessionCookieHeader(
  cookieValue: string,
  secure = true,
): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=${cookieValue}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${ADMIN_SESSION_DURATION_SECONDS}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function buildClearAdminCookieHeader(): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function getAdminSessionFromHeader(
  cookieHeader: string | null,
  secret: string,
): Promise<AdminSession | null> {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const sessionCookie = cookies.find((c) =>
    c.startsWith(`${ADMIN_SESSION_COOKIE_NAME}=`),
  );
  if (!sessionCookie) return null;

  const value = sessionCookie.substring(ADMIN_SESSION_COOKIE_NAME.length + 1);
  return verifyAdminSessionCookie(value, secret);
}

// ---------------------------------------------------------------------------
// Main Session Functions
// ---------------------------------------------------------------------------

export async function createAdminSession(
  request: Request,
  env: AdminEnv,
  user: AdminUser,
): Promise<{ session: AdminSession; cookieHeader: string }> {
  const cookieValue = await createAdminSessionCookie(
    user,
    env.ZOHO_SESSION_SECRET,
  );

  const secure = request.url.startsWith('https://');
  const cookieHeader = buildAdminSessionCookieHeader(cookieValue, secure);

  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    userId: user.userId,
    email: user.email,
    name: user.name,
    orgId: user.orgId,
    role: 'admin',
    loginTimestamp: now,
    expiresAt: now + ADMIN_SESSION_DURATION_SECONDS,
  };

  return { session, cookieHeader };
}

export async function validateAdminSession(
  request: Request,
  env: AdminEnv,
): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get('Cookie');
  return getAdminSessionFromHeader(cookieHeader, env.ZOHO_SESSION_SECRET);
}

export async function destroyAdminSession(
  request: Request,
  env: AdminEnv,
): Promise<{ cookieHeader: string }> {
  return { cookieHeader: buildClearAdminCookieHeader() };
}

export async function refreshAdminSession(
  request: Request,
  env: AdminEnv,
): Promise<{ session: AdminSession; cookieHeader: string } | null> {
  const existingSession = await validateAdminSession(request, env);
  if (!existingSession) return null;

  const user: AdminUser = {
    userId: existingSession.userId,
    email: existingSession.email,
    name: existingSession.name,
    orgId: existingSession.orgId,
  };

  return createAdminSession(request, env, user);
}
