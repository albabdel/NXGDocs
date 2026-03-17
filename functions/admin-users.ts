import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  const session = await validateAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const users = await client.fetch(
    `*[_type == "adminUser"] | order(name asc) {
      _id,
      name,
      email,
      role,
      lastLoginAt,
      loginCount,
      isActive,
      createdAt
    }`
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u: { lastLoginAt: string | null }) => 
    u.lastLoginAt && new Date(u.lastLoginAt) > new Date(sevenDaysAgo)
  ).length;
  const adminCount = users.filter((u: { role: string }) => u.role === 'admin').length;
  const editorCount = users.filter((u: { role: string }) => u.role === 'editor').length;
  const reviewerCount = users.filter((u: { role: string }) => u.role === 'reviewer').length;

  return new Response(JSON.stringify({
    users,
    stats: {
      totalUsers,
      activeUsers,
      adminCount,
      editorCount,
      reviewerCount,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
