// functions/admin-routes.ts
// CRUD endpoint for route configuration management

import { createClient } from '@sanity/client';
import { validateAdminSession } from './lib/admin-session';
import { logAuditEvent } from './lib/audit-service';

type RouteType = 'internal' | 'external' | 'redirect';
type ComponentType = 'DocPage' | 'LandingPage' | 'Article' | 'ReleasePage' | 'Redirect';

interface RouteConfig {
  _id: string;
  path: string;
  title?: string;
  contentRef?: { _id: string; _type: string; title?: string };
  component?: ComponentType;
  redirectUrl?: string;
  isPublished: boolean;
  order?: number;
  _createdAt: string;
  _updatedAt: string;
}

interface CreateRouteRequest {
  path: string;
  title?: string;
  contentId?: string;
  component?: ComponentType;
  redirectUrl?: string;
  isPublished?: boolean;
  order?: number;
}

interface UpdateRouteRequest {
  path?: string;
  title?: string;
  contentId?: string;
  component?: ComponentType;
  redirectUrl?: string;
  isPublished?: boolean;
  order?: number;
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

async function getRoutes(client: ReturnType<typeof getSanityClient>) {
  const query = `
    *[_type == "routeConfig"] | order(order asc, path asc) {
      _id,
      path,
      title,
      "contentRef": contentRef->{ _id, _type, title },
      component,
      redirectUrl,
      isPublished,
      order,
      _createdAt,
      _updatedAt,
    }
  `;
  return client.fetch<RouteConfig[]>(query);
}

async function getRouteById(client: ReturnType<typeof getSanityClient>, id: string) {
  const query = `
    *[_type == "routeConfig" && _id == $id][0] {
      _id,
      path,
      title,
      "contentRef": contentRef->{ _id, _type, title },
      component,
      redirectUrl,
      isPublished,
      order,
      _createdAt,
      _updatedAt,
    }
  `;
  return client.fetch<RouteConfig | null>(query, { id });
}

async function searchContent(client: ReturnType<typeof getSanityClient>, query: string, limit = 10) {
  const contentTypes = ['doc', 'article', 'release', 'roadmapItem', 'landingPage'];
  const queries = contentTypes.map(
    (t) => `*[_type == "${t}" && title match $query][0...${limit}] {
      _id,
      _type,
      title,
      "slug": slug.current,
    }`
  );
  const combinedQuery = `[${queries.join(',')}].[]`;
  return client.fetch(combinedQuery, { query: `*${query}*` });
}

async function handleGet(request: Request, env: Env, session: { userId: string; email: string }) {
  const client = getSanityClient(env);
  const url = new URL(request.url);

  const searchContentQuery = url.searchParams.get('contentSearch');
  if (searchContentQuery) {
    const results = await searchContent(client, searchContentQuery);
    return new Response(JSON.stringify({ items: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const routeId = url.searchParams.get('id');
  if (routeId) {
    const route = await getRouteById(client, routeId);
    if (!route) {
      return new Response(JSON.stringify({ error: 'Route not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ route }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const routes = await getRoutes(client);
  return new Response(JSON.stringify({ items: routes, total: routes.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePost(request: Request, env: Env, session: { userId: string; email: string }) {
  const client = getSanityClient(env);
  let body: CreateRouteRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { path, title, contentId, component, redirectUrl, isPublished, order } = body;

  if (!path) {
    return new Response(JSON.stringify({ error: 'Path is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existing = await client.fetch(
    `*[_type == "routeConfig" && path == $path][0]._id`,
    { path }
  );
  if (existing) {
    return new Response(JSON.stringify({ error: 'Route with this path already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const doc: Record<string, unknown> = {
    _type: 'routeConfig',
    path,
    title: title || path.split('/').pop() || path,
    component: component || 'DocPage',
    isPublished: isPublished ?? false,
  };

  if (contentId) {
    doc.contentRef = { _type: 'reference', _ref: contentId };
  }
  if (redirectUrl) {
    doc.redirectUrl = redirectUrl;
  }
  if (order !== undefined) {
    doc.order = order;
  }

  const created = await client.create(doc);

  await logAuditEvent(env, {
    action: 'route.create',
    actorId: session.userId,
    actorEmail: session.email,
    resourceType: 'routeConfig',
    resourceId: created._id,
    resourceTitle: path,
    changes: { after: JSON.stringify(body) },
    metadata: { source: 'admin-routes' },
  }).catch(err => console.error('[admin-routes] Audit log failed:', err));

  return new Response(JSON.stringify({ success: true, route: created }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePut(request: Request, env: Env, session: { userId: string; email: string }) {
  const client = getSanityClient(env);
  const url = new URL(request.url);
  const routeId = url.searchParams.get('id');

  if (!routeId) {
    return new Response(JSON.stringify({ error: 'Route ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: UpdateRouteRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existing = await getRouteById(client, routeId);
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.path && body.path !== existing.path) {
    const duplicate = await client.fetch(
      `*[_type == "routeConfig" && path == $path && _id != $id][0]._id`,
      { path: body.path, id: routeId }
    );
    if (duplicate) {
      return new Response(JSON.stringify({ error: 'Route with this path already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const updates: Record<string, unknown> = {};
  if (body.path !== undefined) updates.path = body.path;
  if (body.title !== undefined) updates.title = body.title;
  if (body.component !== undefined) updates.component = body.component;
  if (body.redirectUrl !== undefined) updates.redirectUrl = body.redirectUrl;
  if (body.isPublished !== undefined) updates.isPublished = body.isPublished;
  if (body.order !== undefined) updates.order = body.order;
  if (body.contentId !== undefined) {
    updates.contentRef = body.contentId ? { _type: 'reference', _ref: body.contentId } : null;
  }

  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: 'No updates provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await client.patch(routeId).set(updates).commit();

  await logAuditEvent(env, {
    action: 'route.update',
    actorId: session.userId,
    actorEmail: session.email,
    resourceType: 'routeConfig',
    resourceId: routeId,
    resourceTitle: body.path || existing.path,
    changes: {
      before: JSON.stringify(existing),
      after: JSON.stringify(body),
    },
    metadata: { source: 'admin-routes' },
  }).catch(err => console.error('[admin-routes] Audit log failed:', err));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleDelete(request: Request, env: Env, session: { userId: string; email: string }) {
  const client = getSanityClient(env);
  const url = new URL(request.url);
  const routeId = url.searchParams.get('id');

  if (!routeId) {
    return new Response(JSON.stringify({ error: 'Route ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const existing = await getRouteById(client, routeId);
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await client.delete(routeId);

  await logAuditEvent(env, {
    action: 'route.delete',
    actorId: session.userId,
    actorEmail: session.email,
    resourceType: 'routeConfig',
    resourceId: routeId,
    resourceTitle: existing.path,
    changes: { before: JSON.stringify(existing) },
    metadata: { source: 'admin-routes' },
  }).catch(err => console.error('[admin-routes] Audit log failed:', err));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
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
    switch (request.method) {
      case 'GET':
        return handleGet(request, env, session);
      case 'POST':
        return handlePost(request, env, session);
      case 'PUT':
        return handlePut(request, env, session);
      case 'DELETE':
        return handleDelete(request, env, session);
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[admin-routes] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
