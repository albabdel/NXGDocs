import type { ZohoTicket, ZohoConversationItem, ZohoAgent, ZohoStatus, ZohoAttachment, ZohoContact } from './types';

const ORG_ID = '20067436506';
const DEPT_ID = '17599000000007061';
const API_BASE = 'https://desk.zoho.eu/api/v1';

async function apiCall<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const isWrite = options.method === 'POST' || options.method === 'PATCH' || options.method === 'PUT';
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'orgId': ORG_ID,
      ...(isWrite && !isFormData ? { 'Content-Type': 'application/json' } : {}),
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
  status?: string,
  limit = 25,
  accountId?: string | null,
  contactId?: string | null
): Promise<{ data: ZohoTicket[]; count: number }> {
  const params = new URLSearchParams({
    departmentId: DEPT_ID,
    from: String((page - 1) * limit),
    limit: String(limit),
    sortBy: '-createdTime',
  });
  if (status && status !== 'all') params.set('status', status);
  // Tenant isolation for customer mode — accountId is a documented Zoho Desk filter
  if (accountId) params.set('accountId', accountId);
  else if (contactId) params.set('contactId', contactId);
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
  content: string,
  isPublic = true
): Promise<void> {
  await apiCall(`/tickets/${ticketId}/comments`, token, {
    method: 'POST',
    body: JSON.stringify({ content, isPublic, contentType: 'plainText' }),
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

export async function updateTicket(
  token: string,
  ticketId: string,
  fields: Partial<{ status: string; assigneeId: string; priority: string; customFields: Record<string, string> }>
): Promise<ZohoTicket> {
  return apiCall(`/tickets/${ticketId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function listStatuses(token: string): Promise<{ data: ZohoStatus[] }> {
  return apiCall(`/statuses?type=ticketStatuses`, token);
}

export async function listAgents(token: string): Promise<{ data: ZohoAgent[] }> {
  return apiCall(`/agents?departmentId=${DEPT_ID}&limit=100`, token);
}

export async function getAttachments(
  token: string,
  ticketId: string
): Promise<{ data: ZohoAttachment[] }> {
  return apiCall(`/tickets/${ticketId}/attachments`, token);
}

export async function uploadAttachment(
  token: string,
  ticketId: string,
  file: File
): Promise<ZohoAttachment> {
  const form = new FormData();
  form.append('file', file, file.name);
  return apiCall(`/tickets/${ticketId}/attachments`, token, {
    method: 'POST',
    body: form,
  });
}

export async function createTicket(
  token: string,
  data: {
    subject: string;
    description: string;
    email: string;
    priority: string;
    status: string;
    contactId?: string;
    assigneeId?: string;
    customFields?: Record<string, string>;
  }
): Promise<ZohoTicket> {
  return apiCall(`/tickets`, token, {
    method: 'POST',
    body: JSON.stringify({ ...data, departmentId: DEPT_ID }),
  });
}

/** Fetch the Zoho profile for the currently authenticated user (uses accounts.zoho.eu) */
export async function getUserProfile(accessToken: string): Promise<{ Email?: string; email?: string; Display_Name?: string }> {
  const res = await fetch('https://accounts.zoho.eu/oauth/v2/user', {
    headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
  return res.json();
}

/** Find a Zoho Desk Contact record by email address */
export async function searchContactByEmail(token: string, email: string): Promise<ZohoContact | null> {
  const res = await apiCall<{ data: ZohoContact[] }>(
    `/contacts/search?searchStr=${encodeURIComponent(email)}&searchField=email`,
    token
  );
  return (res.data ?? [])[0] ?? null;
}

export async function translateText(text: string): Promise<string> {
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!stripped) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(stripped)}&langpair=auto|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation failed');
  const json = await res.json();
  return (json.responseData?.translatedText as string) ?? text;
}
