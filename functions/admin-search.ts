import { createClient } from '@sanity/client';
import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { getCachedToken } from './lib/zoho-session';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
  ZOHO_ORG_ID: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
}

interface ContentResult {
  id: string;
  title: string;
  type: string;
  status: string;
}

interface TicketResult {
  id: string;
  subject: string;
  status: string;
  ticketNumber: string;
}

interface UserResult {
  id: string;
  name: string;
  email: string;
}

interface SearchResults {
  content: ContentResult[];
  tickets: TicketResult[];
  users: UserResult[];
}

const ZOHO_DESK_BASE = 'https://desk.zoho.eu/api/v1';

async function searchContent(client: ReturnType<typeof createClient>, query: string): Promise<ContentResult[]> {
  const results = await client.fetch(
    `*[(_type in ["doc", "article", "release", "roadmapItem", "landingPage"]) && 
      (title match $query || slug.current match $query)] {
      "id": _id,
      title,
      "type": _type,
      "status": coalesce(workflowConfig.workflowStatus, status, 'draft')
    }[0...10]`,
    { query: `*${query}*` }
  );
  return results || [];
}

async function searchUsers(client: ReturnType<typeof createClient>, query: string): Promise<UserResult[]> {
  const results = await client.fetch(
    `*[_type == "adminUser" && (name match $query || email match $query)] {
      "id": _id,
      name,
      email
    }[0...10]`,
    { query: `*${query}*` }
  );
  return results || [];
}

async function searchTickets(token: string, orgId: string, query: string): Promise<TicketResult[]> {
  try {
    const url = `${ZOHO_DESK_BASE}/tickets/search?orgId=${orgId}&limit=10&from=0`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: query,
      }),
    });
    
    if (!res.ok) {
      const deptUrl = new URL(`${ZOHO_DESK_BASE}/tickets`);
      deptUrl.searchParams.set('orgId', orgId);
      deptUrl.searchParams.set('limit', '50');
      
      const deptRes = await fetch(deptUrl.toString(), {
        headers: { 'Authorization': `Zoho-oauthtoken ${token}` },
      });
      
      if (!deptRes.ok) return [];
      
      const text = await deptRes.text();
      if (!text) return [];
      
      const data = JSON.parse(text);
      const tickets = data.data || [];
      const q = query.toLowerCase();
      
      return tickets
        .filter((t: { subject?: string; ticketNumber?: string }) => 
          (t.subject?.toLowerCase().includes(q)) || 
          (t.ticketNumber?.toLowerCase().includes(q))
        )
        .slice(0, 10)
        .map((t: { id: string; subject: string; status: string; ticketNumber: string }) => ({
          id: t.id,
          subject: t.subject,
          status: t.status?.status || t.status || 'Open',
          ticketNumber: t.ticketNumber,
        }));
    }
    
    const data = await res.json();
    return (data.data || []).slice(0, 10).map((t: { id: string; subject: string; status: { status?: string } | string; ticketNumber: string }) => ({
      id: t.id,
      subject: t.subject,
      status: typeof t.status === 'object' ? t.status?.status || 'Open' : t.status || 'Open',
      ticketNumber: t.ticketNumber,
    }));
  } catch (error) {
    console.error('[admin-search] Ticket search error:', error);
    return [];
  }
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

  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const types = url.searchParams.get('types')?.split(',') || ['content', 'tickets', 'users'];

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ content: [], tickets: [], users: [] }), {
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

    const results: SearchResults = { content: [], tickets: [], users: [] };

    const promises: Promise<void>[] = [];

    if (types.includes('content')) {
      promises.push(
        searchContent(client, query).then(r => { results.content = r; })
      );
    }

    if (types.includes('users')) {
      promises.push(
        searchUsers(client, query).then(r => { results.users = r; })
      );
    }

    if (types.includes('tickets')) {
      promises.push(
        getCachedToken(env).then(token => 
          searchTickets(token, env.ZOHO_ORG_ID, query).then(r => { results.tickets = r; })
        )
      );
    }

    await Promise.all(promises);

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-search] Error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
