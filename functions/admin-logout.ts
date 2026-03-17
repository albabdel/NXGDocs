import { validateAdminSession, destroyAdminSession, AdminEnv } from './lib/admin-session';

export async function onRequest(context: { request: Request; env: AdminEnv }) {
  const { request, env } = context;

  const session = await validateAdminSession(request, env);

  const { cookieHeader } = await destroyAdminSession(request, env);

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader,
    },
  });
}
