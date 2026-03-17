// functions/admin-content.ts
// GET endpoint to list content with workflow status

import { createClient } from '@sanity/client';
import { validateAdminSession } from './lib/admin-session';
import { logAuditEvent } from './lib/audit-service';

type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
type ContentSource = 'sanity' | 'confluence';
type ContentType = 'doc' | 'article' | 'release' | 'roadmapItem' | 'landingPage';

interface ContentItem {
  _id: string;
  _type: ContentType;
  title: string;
  slug: string;
  workflowConfig?: {
    workflowStatus?: WorkflowStatus;
    source?: ContentSource;
    submittedAt?: string;
    submittedBy?: { name: string; email: string } | null;
    reviewedBy?: { name: string; email: string } | null;
    reviewedAt?: string;
    reviewNotes?: string;
    publishedAt?: string;
    publishedBy?: { name: string; email: string } | null;
  };
  _createdAt: string;
  _updatedAt: string;
}

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
  ZOHO_SESSION_SECRET: string;
}

function getSanityClient(env: Env) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

const CONTENT_TYPES: ContentType[] = ['doc', 'article', 'release', 'roadmapItem', 'landingPage'];

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

  const url = new URL(request.url);
  const status = url.searchParams.get('status') as WorkflowStatus | null;
  const source = url.searchParams.get('source') as ContentSource | null;
  const type = url.searchParams.get('type') as ContentType | null;
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  try {
    const client = getSanityClient(env);
    const typesToQuery = type ? [type] : CONTENT_TYPES;

    const filters: string[] = [];
    const params: Record<string, unknown> = {};

    if (status) {
      filters.push(`workflowConfig.workflowStatus == $status`);
      params.status = status;
    }
    if (source) {
      filters.push(`workflowConfig.source == $source`);
      params.source = source;
    }

    const filterClause = filters.length > 0 ? ` && ${filters.join(' && ')}` : '';

    const queries = typesToQuery.map(
      (t) => `
        *[_type == "${t}"${filterClause}] {
          _id,
          _type,
          title,
          "slug": slug.current,
          workflowConfig {
            workflowStatus,
            source,
            submittedAt,
            submittedBy->{ name, email },
            reviewedBy->{ name, email },
            reviewedAt,
            reviewNotes,
            publishedAt,
            publishedBy->{ name, email },
          },
          _createdAt,
          _updatedAt,
        }
      `
    );

    const combinedQuery = `[${queries.join(',')}].[]`;
    const results = await client.fetch<ContentItem[]>(combinedQuery, params);

    const sortedResults = results.sort(
      (a, b) => new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime()
    );

    const paginatedResults = sortedResults.slice(offset, offset + limit);

    await logAuditEvent(env, {
      action: 'content.update',
      actorId: session.userId,
      actorEmail: session.email,
      metadata: {
        source: 'admin-content-list',
      },
    });

    return new Response(
      JSON.stringify({
        items: paginatedResults,
        total: results.length,
        limit,
        offset,
        hasMore: offset + limit < results.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[admin-content] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch content' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
