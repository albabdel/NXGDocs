// functions/admin-content/[id].ts
// GET endpoint to fetch a single content item by ID for preview modal

import { createClient } from '@sanity/client';
import { validateAdminSession } from '../lib/admin-session';

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

export async function onRequest(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;

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

  const contentId = params.id;
  if (!contentId) {
    return new Response(JSON.stringify({ error: 'Content ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = getSanityClient(env);

    // Fetch the content item with all details
    const query = `
      *[_id == $id][0] {
        _id,
        _type,
        title,
        "slug": slug.current,
        description,
        body,
        content,
        "workflowConfig": {
          "workflowStatus": coalesce(workflowConfig.workflowStatus, status, 'draft'),
          "source": coalesce(workflowConfig.source, 'sanity'),
          "submittedAt": workflowConfig.submittedAt,
          "submittedBy": workflowConfig.submittedBy->{ name, email },
          "reviewedBy": workflowConfig.reviewedBy->{ name, email },
          "reviewedAt": workflowConfig.reviewedAt,
          "reviewNotes": workflowConfig.reviewNotes,
          "publishedAt": workflowConfig.publishedAt,
          "publishedBy": workflowConfig.publishedBy->{ name, email },
        },
        _createdAt,
        _updatedAt,
        "author": author->{ name },
        "tags": tags[]?.value,
        "category": category->{ title },
      }
    `;

    const result = await client.fetch(query, { id: contentId });

    if (!result) {
      return new Response(JSON.stringify({ error: 'Content not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-content/[id]] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch content' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
