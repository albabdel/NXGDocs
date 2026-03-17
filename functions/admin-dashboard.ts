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

  try {
    const client = createClient({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_API_TOKEN,
      apiVersion: '2024-01-01',
      useCdn: false,
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Use coalesce to handle both old status field and new workflowConfig.workflowStatus
    const [
      pendingContent,
      publishedContent,
      totalUsers,
      activeUsers,
    ] = await Promise.all([
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage'] && coalesce(workflowConfig.workflowStatus, status) in ['pending_review', 'review'])`),
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage'] && coalesce(workflowConfig.workflowStatus, status) == 'published')`),
      client.fetch(`count(*[_type == 'adminUser'])`),
      client.fetch(`count(*[_type == 'adminUser' && lastLoginAt > $sevenDaysAgo])`, { sevenDaysAgo }),
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
  } catch (error) {
    console.error('[admin-dashboard] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dashboard data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
