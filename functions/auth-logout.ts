// functions/auth-logout.ts
// Cloudflare Pages Function — Clear Auth session cookie
//
// Flow:
//   1. Browser calls POST /auth/logout
//   2. Function clears session cookie (Max-Age=0)
//   3. Returns success response
//
// Note: This only clears the Auth0 session cookie (nxgen_auth_session).
// The Zoho session (zoho_session) is preserved for /support portal.

import { buildClearSessionCookie } from './lib/auth-session';

/**
 * POST /auth/logout
 * 
 * Clears the Auth session cookie.
 * Does NOT clear the Zoho session - that is managed separately.
 */
export const onRequestPost: PagesFunction = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Set-Cookie': buildClearSessionCookie(),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

/**
 * OPTIONS /auth/logout - CORS preflight
 */
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
