import { validateAdminSession, destroyAdminSession, AdminEnv } from './lib/admin-session';
import { logAuditEvent } from './lib/audit-service';

export async function onRequest(context: { request: Request; env: AdminEnv & { SANITY_PROJECT_ID: string; SANITY_DATASET: string; SANITY_API_TOKEN: string } }) {
  const { request, env } = context;

  const session = await validateAdminSession(request, env);

  if (session) {
    await logAuditEvent(env, {
      action: 'user.logout',
      actorId: session.userId,
      actorEmail: session.email,
      metadata: {
        ipAddress: request.headers.get('CF-Connecting-IP') || undefined,
        userAgent: request.headers.get('User-Agent') || undefined,
        source: 'admin-logout',
      },
    }).catch(err => console.error('[admin-logout] Failed to log audit event:', err));
  }

  const { cookieHeader } = await destroyAdminSession(request, env);

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader,
    },
  });
}
