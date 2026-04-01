// functions/auth-session.ts
// Cloudflare Pages Function — Session validation and creation
//
// Flow:
//   1. Browser calls GET /auth/session
//   2. Function checks for existing session cookie
//   3. If valid session, returns user profile
//   4. If no session, checks for Auth0 ID token in Authorization header
//   5. Validates Auth0 ID token using JWKS (RS256)
//   6. Creates new session from Auth0 claims
//   7. Checks if Zoho contact exists for allowed domains
//   8. Returns user profile with Set-Cookie header
//
// SECURITY: Session cookie is HttpOnly - JavaScript cannot access it.

import {
  createSession,
  verifySession,
  buildSessionCookie,
  buildClearSessionCookie,
  getSessionFromHeader,
  type AuthSession,
  type AuthUser,
} from './lib/auth-session';

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

interface Env {
  AUTH0_DOMAIN: string;
  SESSION_SECRET: string;
  ZOHO_ALLOWED_DOMAINS?: string;
}

// ---------------------------------------------------------------------------
// Auth0 JWT verification (RS256)
// ---------------------------------------------------------------------------

interface JwkKey {
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
  x5c?: string[];
}

interface JwksResponse {
  keys: JwkKey[];
}

/** Fetch the JWKS from Auth0 and find the key matching the token's kid */
async function getSigningKey(domain: string, kid: string): Promise<CryptoKey> {
  const url = `https://${domain}/.well-known/jwks.json`;
  const res = await fetch(url, { cf: { cacheTtl: 3600 } } as RequestInit);
  if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`);
  const jwks = await res.json() as JwksResponse;
  const key = jwks.keys.find(k => k.kid === kid);
  if (!key) throw new Error(`No signing key found for kid: ${kid}`);

  // Import the RSA public key
  return crypto.subtle.importKey(
    'jwk',
    key as JsonWebKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

interface Auth0Claims {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nonce?: string;
  // Custom namespaced claims from Auth0 Actions
  'https://nxgen.cloud/claims/product_access'?: string[];
  'https://nxgen.cloud/claims/role'?: string;
  'https://nxgen.cloud/claims/org_id'?: string;
}

/**
 * Verify an Auth0 id_token (RS256).
 * Returns the decoded claims on success, throws on failure.
 */
async function verifyAuth0IdToken(idToken: string, domain: string): Promise<Auth0Claims> {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const [headerB64, payloadB64, signatureB64] = parts;

  const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64)));
  if (header.alg !== 'RS256') throw new Error(`Unexpected algorithm: ${header.alg}`);

  const signingKey = await getSigningKey(domain, header.kid);

  const dataToVerify = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecode(signatureB64);

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', signingKey, signature, dataToVerify);
  if (!valid) throw new Error('Invalid token signature');

  const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as Auth0Claims;

  // Validate expiry
  if (claims.exp < Math.floor(Date.now() / 1000)) throw new Error('Token has expired');

  // Validate issuer
  const expectedIss = `https://${domain}/`;
  if (claims.iss !== expectedIss) throw new Error(`Invalid issuer: ${claims.iss}`);

  return claims;
}

// ---------------------------------------------------------------------------
// Domain Allowlist Check
// ---------------------------------------------------------------------------

/**
 * Check if email domain is in the allowed list for auto-registration.
 * @param email - User email address
 * @param allowedDomains - Comma-separated list of allowed domains (e.g., "nxgen.io,partner.com")
 * @returns true if domain is allowed
 */
function isDomainAllowed(email: string, allowedDomains: string): boolean {
  if (!allowedDomains) return false;
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain) return false;
  
  const domains = allowedDomains.split(',').map(d => d.trim().toLowerCase());
  return domains.includes(emailDomain);
}

// ---------------------------------------------------------------------------
// Zoho Contact Check (calls internal endpoint)
// ---------------------------------------------------------------------------

interface ZohoRegisterResponse {
  success: boolean;
  contactId?: string;
  existing?: boolean;
  reason?: string;
}

/**
 * Call the Zoho registration endpoint to check/create a contact.
 * This is an internal call within the same Cloudflare Pages deployment.
 */
async function registerZohoContact(
  request: Request,
  env: Env,
  user: AuthUser,
): Promise<ZohoRegisterResponse> {
  try {
    // Build URL for internal endpoint
    const url = new URL(request.url);
    const registerUrl = `${url.origin}/auth/zoho-register`;
    
    // Call the registration endpoint
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the session cookie for authentication
        'Cookie': request.headers.get('Cookie') || '',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        userId: user.userId,
      }),
    });

    if (!response.ok) {
      console.warn(`Zoho registration failed: ${response.status}`);
      return { success: false, reason: 'registration_failed' };
    }

    return await response.json() as ZohoRegisterResponse;
  } catch (error) {
    console.error('Zoho registration error:', error);
    return { success: false, reason: 'registration_error' };
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: CORS });

/**
 * GET /auth/session
 * 
 * Validates existing session or creates new session from Auth0 token.
 * Returns user profile with session cookie.
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const cookieHeader = request.headers.get('Cookie');
    
    // Step 1: Check for existing session cookie
    const existingSession = await getSessionFromHeader(cookieHeader, env.SESSION_SECRET);
    
    if (existingSession) {
      // Valid session exists - return user profile
      return json({
        authenticated: true,
        user: {
          userId: existingSession.userId,
          email: existingSession.email,
          name: existingSession.name,
          picture: existingSession.picture,
          role: existingSession.role,
          productAccess: existingSession.productAccess,
        },
      });
    }
    
    // Step 2: No session - check for Auth0 ID token in Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      // No session and no token - not authenticated
      return json({ authenticated: false });
    }
    
    const idToken = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Step 3: Validate Auth0 ID token
    const claims = await verifyAuth0IdToken(idToken, env.AUTH0_DOMAIN);
    
    const email = (claims.email ?? '').toLowerCase();
    if (!email) {
      return json({ authenticated: false, error: 'No email in token' });
    }
    
    // Step 4: Build user from claims
    const role = (claims['https://nxgen.cloud/claims/role'] as AuthUser['role']) ?? 'user';
    const productAccess = claims['https://nxgen.cloud/claims/product_access'] ?? ['gcxone'];
    
    const user: AuthUser = {
      userId: claims.sub,
      email,
      name: claims.name ?? claims.given_name ?? email.split('@')[0],
      picture: claims.picture,
      role,
      orgId: claims['https://nxgen.cloud/claims/org_id'],
      productAccess,
    };
    
    // Step 5: Create session
    const sessionToken = await createSession(user, env.SESSION_SECRET);
    
    // Step 6: Check if Zoho contact should be created
    let zohoContactCreated = false;
    const allowedDomains = env.ZOHO_ALLOWED_DOMAINS ?? '';
    
    if (isDomainAllowed(email, allowedDomains)) {
      // Attempt Zoho contact registration
      const registerResult = await registerZohoContact(request, env, user);
      zohoContactCreated = registerResult.success && !registerResult.existing;
    }
    
    // Step 7: Return user profile with session cookie
    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        productAccess: user.productAccess,
      },
      zohoContactCreated,
    }), {
      headers: {
        'Set-Cookie': buildSessionCookie(sessionToken),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('auth-session error:', msg);
    
    // Don't leak internal error details for security issues
    const isAuthError = msg.includes('signature') || msg.includes('expired') || msg.includes('issuer');
    return json({ 
      authenticated: false, 
      error: isAuthError ? 'Authentication failed' : msg 
    }, isAuthError ? 401 : 500);
  }
};

/**
 * OPTIONS /auth/session - CORS preflight
 */
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
