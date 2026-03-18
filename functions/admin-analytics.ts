import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

interface AnalyticsData {
  contentByStatus: { status: string; count: number }[];
  contentByType: { type: string; count: number }[];
  contentBySource: { source: string; count: number }[];
  activityByDay: { date: string; count: number }[];
  topAuthors: { name: string; email: string; count: number }[];
  period: { start: string; end: string };
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const [byStatus, byType, bySource, activity, topAuthors] = await Promise.all([
      client.fetch(`
        *[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage']] {
          "status": coalesce(workflowConfig.workflowStatus, status, 'draft')
        } | groupBy(status) { 
          "status": key, 
          "count": count 
        }
      `),
      client.fetch(`
        *[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage']] | groupBy(_type) { 
          "type": key, 
          "count": count 
        }
      `),
      client.fetch(`
        *[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage']] {
          "source": coalesce(workflowConfig.source, 'sanity')
        } | groupBy(source) { 
          "source": key, 
          "count": count 
        }
      `),
      client.fetch(`
        *[_type == "auditLog" && timestamp >= $startDate && timestamp <= $endDate] | groupBy(date(timestamp)) { 
          "date": key, 
          "count": count 
        } | order(date asc)
      `, { startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
      client.fetch(`
        *[_type == "auditLog" && timestamp >= $startDate && timestamp <= $endDate] {
          actor->{ name, email }
        } | groupBy(actor._id) {
          "name": actor[0].name,
          "email": actor[0].email,
          "count": count
        } | order(count desc)[0...10]
      `, { startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
    ]);

    const analytics: AnalyticsData = {
      contentByStatus: byStatus || [],
      contentByType: byType || [],
      contentBySource: bySource || [],
      activityByDay: activity || [],
      topAuthors: topAuthors || [],
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    };

    return new Response(JSON.stringify(analytics), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-analytics] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
