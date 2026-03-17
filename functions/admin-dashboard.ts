// functions/admin-dashboard.ts
// Dashboard summary endpoint

import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { getAuditLogs } from './lib/audit-service';
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

  const [
    pendingContent,
    publishedContent,
    totalUsers,
    activeUsers,
  ] = await Promise.all([
    client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage'] && workflowConfig.workflowStatus == 'pending_review'])`),
    client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage'] && workflowConfig.workflowStatus == 'published'])`),
    client.fetch(`count(*[_type == 'adminUser'])`),
    client.fetch(`count(*[_type == 'adminUser' && lastLoginAt > $sevenDaysAgo])`, { sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }),
  ]);

  const recentActivity = await getAuditLogs(env, { limit: 5 });

  return new Response(JSON.stringify({
    stats: {
      pendingContent,
      publishedContent,
      totalUsers,
      activeUsers,
    },
    recentActivity,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
