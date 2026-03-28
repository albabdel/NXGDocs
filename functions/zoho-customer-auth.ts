// functions/zoho-customer-auth.ts
// Cloudflare Pages Function — Auth0 id_token → Zoho Desk session for customer portal
//
// Flow:
//   1. Browser does Auth0 implicit login (response_type=id_token) → gets id_token in URL hash
//   2. Browser POSTs { action: 'auth0-exchange', idToken } to this function
//   3. Function verifies the id_token signature using Auth0 JWKS (RS256)
//   4. Function extracts email, refreshes Zoho service account token
//   5. Function finds Zoho contact by email, creates HttpOnly session cookie
//   6. Browser receives safe profile data only (token NEVER exposed to JavaScript)
//
// SECURITY: The Zoho service account token is NEVER returned to the browser.
// Instead, an HttpOnly session cookie is set that JavaScript cannot access.
// This prevents customers from accessing other customers' tickets.
//
// Env secrets required (Cloudflare Pages dashboard → Settings → Environment variables):
//   AUTH0_DOMAIN         — e.g. nxgen.eu.auth0.com
//   AUTH0_AUDIENCE       — e.g. https://nxgen.eu.auth0.com/api/v2/ (or leave blank for basic id_token)
//   ZOHO_REFRESH_TOKEN   — Zoho service account refresh token (authorization_code grant)
//   ZOHO_CLIENT_ID       — Zoho OAuth app client ID (same as frontend)
//   ZOHO_CLIENT_SECRET   — Zoho OAuth app client secret (server-side only, never in browser)
//   ZOHO_ORG_ID          — Zoho Desk org ID (e.g. 20067436506)
//   SESSION_SECRET       — Secret key for signing session tokens (32+ chars recommended)

import { createSessionCookie, buildSessionCookieHeader } from './lib/zoho-session';

interface Env {
  AUTH0_DOMAIN: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_ORG_ID: string;
  ZOHO_SESSION_SECRET: string;
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
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nonce?: string;
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
// Zoho helpers
// ---------------------------------------------------------------------------

/** Exchange refresh token for a fresh Zoho access token (expires in 1 hour) */
async function refreshZohoToken(env: Env): Promise<{ accessToken: string; expiresIn: number }> {
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
  if (!res.ok) throw new Error(`Zoho token refresh failed: ${res.status}`);
  const data = await res.json() as { access_token?: string; expires_in?: number; error?: string };
  if (!data.access_token) throw new Error(`Zoho refresh error: ${data.error}`);
  return { accessToken: data.access_token, expiresIn: data.expires_in ?? 3600 };
}

interface ZohoOwner {
  id?: string;
  firstName?: string;
  lastName?: string;
  /** Zoho Desk uses "emailId" for agent email fields, not "email" */
  emailId?: string;
  email?: string;
  name?: string;
}

interface ZohoContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  secondaryEmail?: string;
  accountId: string | null;
  account?: { accountName: string };
  isEndUser?: boolean;
  /** Contact owner (CSM) — returned directly from search/contact endpoints */
  owner?: ZohoOwner;
}

interface ZohoAccount {
  id: string;
  accountName: string;
  ownerId?: string;
  owner?: ZohoOwner;
}

async function findContactByEmail(
  token: string,
  email: string,
  orgId: string,
): Promise<ZohoContact | null> {
  const headers = { Authorization: `Zoho-oauthtoken ${token}`, orgId };
  const lowerEmail = email.toLowerCase();

  // Fast path: global search endpoint (requires Desk.search.READ scope)
  try {
    const searchUrl = `https://desk.zoho.eu/api/v1/search?searchStr=${encodeURIComponent(email)}&module=contacts&limit=10`;
    const searchRes = await fetch(searchUrl, { headers });
    if (searchRes.ok) {
      const text = await searchRes.text();
      if (text) {
        const data = JSON.parse(text) as { data?: (ZohoContact & { secondaryEmail?: string })[] };
        const match = (data.data ?? []).find(
          c => c.email?.toLowerCase() === lowerEmail || c.secondaryEmail?.toLowerCase() === lowerEmail
        ) ?? null;
        if (match) return match;
      }
    }
  } catch {
    // Fall through to pagination
  }

  // Slow path: paginate contacts list (fallback if search scope unavailable)
  const limit = 100;
  for (let from = 0; from < 5000; from += limit) {
    const res = await fetch(`https://desk.zoho.eu/api/v1/contacts?limit=${limit}&from=${from}`, { headers });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    const data = JSON.parse(text) as { data?: ZohoContact[] };
    const contacts = data.data ?? [];
    const match = contacts.find(c => c.email?.toLowerCase() === lowerEmail);
    if (match) return match;
    if (contacts.length < limit) break;
  }

  return null;
}

/**
 * Fetch account owner (CSM) using the search endpoint.
 * The search endpoint returns the owner object directly — no extra scopes needed.
 * Strategy:
 *  1. GET /search?searchStr={accountId}&module=accounts — owner in result by default
 *  2. Fallback: GET /accounts/{id}?include=owner (may or may not return owner)
 */
async function fetchAccountWithOwner(
  token: string,
  accountId: string,
  orgId: string,
): Promise<ZohoAccount | null> {
  const headers = { Authorization: `Zoho-oauthtoken ${token}`, orgId };

  // Primary: search for the account by ID — the search endpoint returns owner by default
  try {
    const searchUrl = `https://desk.zoho.eu/api/v1/search?searchStr=${encodeURIComponent(accountId)}&module=accounts&limit=5`;
    const searchRes = await fetch(searchUrl, { headers });
    if (searchRes.ok) {
      const searchText = await searchRes.text();
      if (searchText) {
        const searchData = JSON.parse(searchText) as { data?: (ZohoAccount & { ownerId?: string })[] };
        const match = (searchData.data ?? []).find(a => a.id === accountId);
        if (match?.owner?.emailId || match?.owner?.email) {
          return match;
        }
      }
    }
  } catch {
    // fall through to direct fetch
  }

  // Fallback: direct account fetch (ownerId only, no owner object)
  const accountRes = await fetch(`https://desk.zoho.eu/api/v1/accounts/${accountId}?include=owner`, { headers });
  if (!accountRes.ok) return null;
  const accountText = await accountRes.text();
  if (!accountText) return null;
  return JSON.parse(accountText) as ZohoAccount;
}

/**
 * Auto-provision a new Zoho contact for customers who don't exist yet.
 * Called when findContactByEmail returns null.
 */
async function createContact(
  token: string,
  email: string,
  firstName: string,
  lastName: string,
  orgId: string,
): Promise<ZohoContact> {
  const res = await fetch('https://desk.zoho.eu/api/v1/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'orgId': orgId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      type: 'customerContact',
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create contact: ${res.status} - ${errorText}`);
  }

  const data = await res.json() as { id?: string; firstName?: string; lastName?: string; email?: string; accountId?: string | null };
  
  return {
    id: data.id!,
    firstName: data.firstName ?? firstName,
    lastName: data.lastName ?? lastName,
    email: data.email ?? email,
    accountId: data.accountId ?? null,
  };
}

/**
 * Ensure the contact has portal access (isEndUser flag).
 * If not already an end user, invite them to access the customer portal.
 * This is non-blocking - errors are logged but don't fail the login.
 */
async function ensurePortalAccess(
  token: string,
  contactId: string,
  email: string,
  orgId: string,
): Promise<void> {
  try {
    // First check if already an end user
    const contactRes = await fetch(`https://desk.zoho.eu/api/v1/contacts/${contactId}`, {
      headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId },
    });

    if (!contactRes.ok) {
      console.warn(`ensurePortalAccess: Failed to fetch contact ${contactId}: ${contactRes.status}`);
      return;
    }

    const contact = await contactRes.json() as ZohoContact;

    if (contact.isEndUser) {
      // Already has portal access
      return;
    }

    // Invite as end user to enable portal access
    const inviteRes = await fetch(`https://desk.zoho.eu/api/v1/contacts/${contactId}/inviteAsEndUser`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'orgId': orgId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!inviteRes.ok) {
      const errorText = await inviteRes.text();
      console.warn(`ensurePortalAccess: Failed to invite ${email}: ${inviteRes.status} - ${errorText}`);
    } else {
      console.log(`ensurePortalAccess: Invited ${email} as end user for contact ${contactId}`);
    }
  } catch (e) {
    // Non-blocking: log error but don't fail the login
    console.error(`ensurePortalAccess: Unexpected error for ${email}:`, e instanceof Error ? e.message : e);
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: CORS });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as { action?: string; idToken?: string; email?: string };

    // Handle email-lookup action (for popup-based customer login)
    if (body.action === 'email-lookup') {
      const email = (body.email ?? '').toLowerCase().trim();
      if (!email) return json({ error: 'Email is required' }, 400);

      // Get a Zoho service account token and look up the contact
      const { accessToken: zToken } = await refreshZohoToken(context.env);
      const contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);

      if (!contact) {
        return json({
          error: `No support account found for ${email}. Please contact NXGEN support.`,
        }, 404);
      }

      // Ensure portal access is enabled (non-blocking)
      await ensurePortalAccess(zToken, contact.id, email, context.env.ZOHO_ORG_ID);

      // Resolve CSM: always use the account (parent company) owner — not the contact owner.
      // The account owner is the assigned CSM for that customer company.
      let csmEmail: string | null = null;
      let csmName: string | null = null;
      if (contact.accountId) {
        const account = await fetchAccountWithOwner(zToken, contact.accountId, context.env.ZOHO_ORG_ID);
        if (account?.owner) {
          csmEmail = account.owner.emailId ?? account.owner.email ?? null;
          csmName = account.owner.name || `${account.owner.firstName ?? ''} ${account.owner.lastName ?? ''}`.trim() || null;
        }
      }

      // SECURITY: Create HttpOnly session cookie - token NEVER exposed to JavaScript
      const displayName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || email;

      const sessionToken = await createSessionCookie(
        contact.id,
        contact.accountId ?? null,
        displayName,
        context.env.ZOHO_SESSION_SECRET,
      );

      // Return only safe profile data - NO access token
      return new Response(JSON.stringify({
        ok: true,
        contactId: contact.id,
        accountId: contact.accountId ?? null,
        displayName,
        account: contact.account?.accountName ?? null,
        csmEmail,
        csmName,
      }), {
        headers: {
          'Set-Cookie': buildSessionCookieHeader(sessionToken),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Handle auth0-exchange action (legacy Auth0 flow)
    if (body.action !== 'auth0-exchange') {
      return json({ error: 'Unknown action' }, 400);
    }

    const idToken = (body.idToken ?? '').trim();
    if (!idToken) return json({ error: 'idToken is required' }, 400);

    // Verify the Auth0 id_token
    const claims = await verifyAuth0IdToken(idToken, context.env.AUTH0_DOMAIN);

    const email = (claims.email ?? '').toLowerCase();
    if (!email) return json({ error: 'No email in token' }, 400);

    // Get a Zoho service account token and look up the contact
    const { accessToken: zToken, expiresIn } = await refreshZohoToken(context.env);
    const contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);

    if (!contact) {
      return json({
        error: `No support account found for ${email}. Please contact NXGEN support.`,
      }, 404);
    }

    // Ensure portal access is enabled (non-blocking)
    await ensurePortalAccess(zToken, contact.id, email, context.env.ZOHO_ORG_ID);

    // Resolve CSM: always use the account (parent company) owner — not the contact owner.
    // The account owner is the assigned CSM for that customer company.
    let csmEmail: string | null = null;
    let csmName: string | null = null;
    if (contact.accountId) {
      const account = await fetchAccountWithOwner(zToken, contact.accountId, context.env.ZOHO_ORG_ID);
      if (account?.owner) {
        csmEmail = account.owner.emailId ?? account.owner.email ?? null;
        csmName = account.owner.name || `${account.owner.firstName ?? ''} ${account.owner.lastName ?? ''}`.trim() || null;
      }
    }

    // SECURITY: Create HttpOnly session cookie - token NEVER exposed to JavaScript
    const displayName = claims.name
      ?? (`${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || email);

    const sessionToken = await createSessionCookie(
      contact.id,
      contact.accountId ?? null,
      displayName,
      context.env.ZOHO_SESSION_SECRET,
    );

    // Return only safe profile data - NO access token
    return new Response(JSON.stringify({
      ok: true,
      contactId: contact.id,
      accountId: contact.accountId ?? null,
      displayName,
      account: contact.account?.accountName ?? null,
      csmEmail,
      csmName,
    }), {
      headers: {
        'Set-Cookie': buildSessionCookieHeader(sessionToken),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('zoho-customer-auth error:', msg);
    // Don't leak internal error details for security issues
    const isAuthError = msg.includes('signature') || msg.includes('expired') || msg.includes('issuer');
    return json({ error: isAuthError ? 'Authentication failed' : msg }, isAuthError ? 401 : 500);
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
