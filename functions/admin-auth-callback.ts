// functions/admin-auth-callback.ts
// Cloudflare Pages Function — OAuth callback for Admin Command Center
//
// Flow:
//   1. Admin clicks login → redirected to Zoho OAuth authorize URL
//   2. Admin authenticates with Zoho → redirected back here with code
//   3. This function exchanges code for access token
//   4. Fetches user profile from Zoho userinfo endpoint
//   5. Verifies org membership (OrganizationId matches ZOHO_ORG_ID)
//   6. Creates admin session cookie
//   7. Redirects to /admin dashboard
//
// Env secrets required:
//   ZOHO_CLIENT_ID     — Zoho OAuth app client ID
//   ZOHO_CLIENT_SECRET — Zoho OAuth app client secret (server-side only)
//   ZOHO_ORG_ID        — Zoho Desk org ID (e.g. 20067436506)
//   ZOHO_SESSION_SECRET — Secret key for signing session cookies

import { createAdminSession, AdminUser, AdminEnv } from './lib/admin-session';
import { syncAdminUser } from './lib/sync-admin-user';
import { logAuditEvent } from './lib/audit-service';

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
}

interface ZohoUserInfo {
  id: string;
  email: string;
  name: string;
  OrganizationId: string;
  error?: string;
}

interface Env extends AdminEnv {
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_ORG_ID: string;
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        redirect_uri: `${url.origin}/admin-auth-callback`,
        code,
      }),
    });

    const tokens: ZohoTokenResponse = await tokenResponse.json();

    if (tokens.error || !tokens.access_token) {
      console.error('Token exchange error:', tokens.error);
      return new Response(`Token exchange failed: ${tokens.error}`, { status: 500 });
    }

    const profileResponse = await fetch('https://accounts.zoho.eu/oauth/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile: ZohoUserInfo = await profileResponse.json();

    if (profile.error) {
      return new Response(`Failed to fetch profile: ${profile.error}`, { status: 500 });
    }

    if (profile.OrganizationId !== env.ZOHO_ORG_ID) {
      return new Response('Unauthorized: Not a member of this organization', { status: 403 });
    }

    const user: AdminUser = {
      userId: profile.id,
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      orgId: profile.OrganizationId,
    };

    const { cookieHeader } = await createAdminSession(request, env, user);

    await syncAdminUser(env, user);

    await logAuditEvent(env, {
      action: 'user.login',
      actorId: user.userId,
      actorEmail: user.email,
      metadata: {
        ipAddress: request.headers.get('CF-Connecting-IP') || undefined,
        userAgent: request.headers.get('User-Agent') || undefined,
        source: 'admin-oauth',
      },
    }).catch(err => console.error('[admin-auth-callback] Failed to log audit event:', err));

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin',
        'Set-Cookie': cookieHeader,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 },
    );
  }
}
