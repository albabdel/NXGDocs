import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
  CF_PAGES_BRANCH?: string;
  CF_PAGES_COMMIT?: string;
  CF_PAGES_URL?: string;
  CF_PAGES_SITE_NAME?: string;
}

interface BuildMetrics {
  deployment: {
    branch: string | null;
    commitSha: string | null;
    url: string | null;
    siteName: string | null;
    deployedAt: string;
  };
  content: {
    totalDocuments: number;
    byType: Record<string, number>;
    published: number;
    draft: number;
    inReview: number;
  };
  build: {
    timestamp: string;
    environment: string;
  };
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

    const [totalDocuments, documentsByType, publishedCount, draftCount, reviewCount] = await Promise.all([
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage', 'guide']])`),
      client.fetch(`
        {
          "doc": count(*[_type == 'doc']),
          "article": count(*[_type == 'article']),
          "release": count(*[_type == 'release']),
          "roadmapItem": count(*[_type == 'roadmapItem']),
          "landingPage": count(*[_type == 'landingPage']),
          "guide": count(*[_type == 'guide'])
        }
      `),
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage', 'guide'] && coalesce(workflowConfig.workflowStatus, status) == 'published'])`),
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage', 'guide'] && coalesce(workflowConfig.workflowStatus, status) == 'draft'])`),
      client.fetch(`count(*[_type in ['doc', 'article', 'release', 'roadmapItem', 'landingPage', 'guide'] && coalesce(workflowConfig.workflowStatus, status) in ['pending_review', 'review']])`),
    ]);

    const metrics: BuildMetrics = {
      deployment: {
        branch: env.CF_PAGES_BRANCH || null,
        commitSha: env.CF_PAGES_COMMIT || null,
        url: env.CF_PAGES_URL || null,
        siteName: env.CF_PAGES_SITE_NAME || null,
        deployedAt: new Date().toISOString(),
      },
      content: {
        totalDocuments,
        byType: documentsByType,
        published: publishedCount,
        draft: draftCount,
        inReview: reviewCount,
      },
      build: {
        timestamp: new Date().toISOString(),
        environment: env.CF_PAGES_BRANCH === 'main' ? 'production' : 'preview',
      },
    };

    return new Response(JSON.stringify(metrics), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-build-metrics] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch build metrics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
