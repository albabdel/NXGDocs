import { validateAdminSession, AdminEnv } from './lib/admin-session';

export async function onRequest(context: { request: Request; env: AdminEnv }) {
  const { request, env } = context;

  const session = await validateAdminSession(request, env);

  if (!session) {
    return new Response(JSON.stringify({ user: null }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      orgId: session.orgId,
      role: session.role,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
