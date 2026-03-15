import type { ZohoTicket, ZohoConversationItem } from './types';

const ORG_ID = '20067436506';
const DEPT_ID = '17599000000007061';
const API_BASE = 'https://desk.zoho.eu/api/v1';

async function apiCall<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const isWrite = options.method === 'POST' || options.method === 'PATCH';
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'orgId': ORG_ID,
      ...(isWrite ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Zoho API ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

export async function listTickets(
  token: string,
  page = 1,
  status?: string
): Promise<{ data: ZohoTicket[]; count: number }> {
  const params = new URLSearchParams({
    departmentId: DEPT_ID,
    from: String((page - 1) * 25),
    limit: '25',
    sortBy: '-createdTime',
  });
  if (status && status !== 'all') {
    params.set('status', status);
  }
  return apiCall(`/tickets?${params}`, token);
}

export async function getTicket(token: string, id: string): Promise<ZohoTicket> {
  return apiCall(`/tickets/${id}`, token);
}

export async function getConversations(
  token: string,
  ticketId: string
): Promise<{ data: ZohoConversationItem[] }> {
  return apiCall(`/tickets/${ticketId}/conversations`, token);
}

export async function addComment(
  token: string,
  ticketId: string,
  content: string
): Promise<void> {
  await apiCall(`/tickets/${ticketId}/comments`, token, {
    method: 'POST',
    body: JSON.stringify({ content, isPublic: true, contentType: 'plainText' }),
  });
}

export async function updateTicketStatus(
  token: string,
  ticketId: string,
  status: string
): Promise<ZohoTicket> {
  return apiCall(`/tickets/${ticketId}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
