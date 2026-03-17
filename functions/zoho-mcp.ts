// functions/zoho-mcp.ts
// Cloudflare Pages Function — MCP-like tools for Zoho Desk
//
// This implements the MCP tool patterns using the existing Zoho Desk REST API
// with our service account credentials.
//
// Tools implemented:
// - searchContacts: Find contact by email
// - searchTickets: Find ticket by ticket number
// - getTicketsByContact: Get all tickets for a contact
// - getTicket: Get ticket details
// - getTicketConversations: Get replies/comments
// - closeTickets: Close tickets

import { getCachedToken } from './lib/zoho-session';

interface Env {
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_ORG_ID: string;
  ZOHO_SESSION_SECRET: string;
}

const ZOHO_DESK_BASE = 'https://desk.zoho.eu/api/v1';

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

async function searchContacts(token: string, orgId: string, query: string, limit = 10) {
  // Search contacts using the search endpoint with searchField=email
  const searchUrl = `${ZOHO_DESK_BASE}/contacts/search?searchStr=${encodeURIComponent(query)}&searchField=email&limit=${limit}`;
  const res = await fetch(searchUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId },
  });
  if (!res.ok) {
    // Fallback: try listing contacts and filter locally
    const listUrl = `${ZOHO_DESK_BASE}/contacts?orgId=${orgId}&limit=${limit}`;
    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });
    if (!listRes.ok) {
      const error = await listRes.text();
      throw new Error(`Failed to search contacts: ${error}`);
    }
    const data = await listRes.json() as { data?: unknown[] };
    // Filter by email if query looks like an email
    if (query.includes('@') && data.data) {
      const filtered = (data.data as Record<string, unknown>[]).filter(
        (c: Record<string, unknown>) => 
          (c.email as string)?.toLowerCase().includes(query.toLowerCase())
      );
      return { data: filtered };
    }
    return data;
  }
  return res.json();
}
  }
  return res.json();
}

async function searchTickets(token: string, orgId: string, departmentId: string, ticketNumber: string) {
  const url = `${ZOHO_DESK_BASE}/tickets/search?orgId=${orgId}&departmentId=${departmentId}&ticketNumber=${encodeURIComponent(ticketNumber)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to search tickets: ${error}`);
  }
  return res.json();
}

async function getTicketsByContact(token: string, orgId: string, contactId: string, departmentId?: string, limit = 20) {
  // Use the contact-specific endpoint
  let url = `${ZOHO_DESK_BASE}/contacts/${contactId}/tickets?orgId=${orgId}&limit=${limit}`;
  if (departmentId) {
    url += `&departmentId=${departmentId}`;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get tickets by contact: ${error}`);
  }
  return res.json();
}

async function getTicket(token: string, orgId: string, ticketId: string) {
  const url = `${ZOHO_DESK_BASE}/tickets/${ticketId}?orgId=${orgId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get ticket: ${error}`);
  }
  return res.json();
}

async function getTicketConversations(token: string, orgId: string, ticketId: string) {
  const url = `${ZOHO_DESK_BASE}/tickets/${ticketId}/conversations?orgId=${orgId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get conversations: ${error}`);
  }
  return res.json();
}

async function closeTickets(token: string, orgId: string, ticketIds: string[]) {
  const url = `${ZOHO_DESK_BASE}/tickets/moveToTrash?orgId=${orgId}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: ticketIds }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to close tickets: ${error}`);
  }
  return res.json();
}

async function getDepartments(token: string, orgId: string) {
  const url = `${ZOHO_DESK_BASE}/departments?orgId=${orgId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get departments: ${error}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      tool: string;
      params: Record<string, unknown>;
    };

    const { tool, params } = body;
    const token = await getCachedToken(context.env);
    const orgId = context.env.ZOHO_ORG_ID;

    let result: unknown;

    switch (tool) {
      case 'searchContacts': {
        const query = params.query as string || params._all as string || '';
        const limit = (params.limit as number) || 10;
        result = await searchContacts(token, orgId, query, limit);
        break;
      }

      case 'searchTickets': {
        const ticketNumber = params.ticketNumber as string;
        const departmentId = params.departmentId as string;
        if (!ticketNumber) {
          return json({ error: 'ticketNumber is required' }, 400);
        }
        result = await searchTickets(token, orgId, departmentId, ticketNumber);
        break;
      }

      case 'getTicketsByContact': {
        const contactId = params.contactId as string;
        const departmentId = params.departmentId as string;
        const limit = (params.limit as number) || 20;
        if (!contactId) {
          return json({ error: 'contactId is required' }, 400);
        }
        result = await getTicketsByContact(token, orgId, contactId, departmentId, limit);
        break;
      }

      case 'getTicket': {
        const ticketId = params.ticketId as string;
        if (!ticketId) {
          return json({ error: 'ticketId is required' }, 400);
        }
        result = await getTicket(token, orgId, ticketId);
        break;
      }

      case 'getTicketConversations': {
        const ticketId = params.ticketId as string;
        if (!ticketId) {
          return json({ error: 'ticketId is required' }, 400);
        }
        result = await getTicketConversations(token, orgId, ticketId);
        break;
      }

      case 'closeTickets': {
        const ticketIds = params.ids as string[];
        if (!ticketIds || !Array.isArray(ticketIds)) {
          return json({ error: 'ids array is required' }, 400);
        }
        result = await closeTickets(token, orgId, ticketIds);
        break;
      }

      case 'getDepartments': {
        result = await getDepartments(token, orgId);
        break;
      }

      default:
        return json({ error: `Unknown tool: ${tool}` }, 400);
    }

    return json({ ok: true, result });

  } catch (e) {
    console.error('zoho-mcp error:', e);
    const message = e instanceof Error ? e.message : 'Internal error';
    return json({ error: message }, 500);
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const tool = url.searchParams.get('tool');

    if (!tool) {
      return json({
        tools: [
          { name: 'searchContacts', params: ['query', 'limit'] },
          { name: 'searchTickets', params: ['ticketNumber', 'departmentId'] },
          { name: 'getTicketsByContact', params: ['contactId', 'departmentId', 'limit'] },
          { name: 'getTicket', params: ['ticketId'] },
          { name: 'getTicketConversations', params: ['ticketId'] },
          { name: 'closeTickets', params: ['ids'] },
          { name: 'getDepartments', params: [] },
        ],
      });
    }

    const token = await getCachedToken(context.env);
    const orgId = context.env.ZOHO_ORG_ID;

    // Parse params from query string
    const params: Record<string, string | undefined> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== 'tool') params[key] = value;
    });

    let result: unknown;

    switch (tool) {
      case 'getDepartments': {
        result = await getDepartments(token, orgId);
        break;
      }
      case 'searchContacts': {
        result = await searchContacts(token, orgId, params.query || params._all || '', parseInt(params.limit || '10'));
        break;
      }
      default:
        return json({ error: `Unknown tool: ${tool}` }, 400);
    }

    return json({ ok: true, result });

  } catch (e) {
    console.error('zoho-mcp GET error:', e);
    return json({ error: e instanceof Error ? e.message : 'Internal error' }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
