// functions/customer-session.ts
// Cloudflare Pages Function — Get current customer session info
//
// Purpose: Return current customer session data including productAccess
// Used by ProductAccessContext to determine user's product entitlements

import { getSessionFromHeader, ZohoEnv } from './lib/zoho-session';

interface Env extends ZohoEnv {}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  const cookieHeader = request.headers.get('Cookie');
  const session = await getSessionFromHeader(cookieHeader, env.ZOHO_SESSION_SECRET);

  if (!session) {
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    user: {
      contactId: session.contactId,
      accountId: session.accountId,
      displayName: session.displayName,
      productAccess: session.productAccess,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
