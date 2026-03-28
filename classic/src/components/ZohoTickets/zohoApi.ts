import type { ZohoTicket, ZohoConversationItem, ZohoAgent, ZohoStatus, ZohoAttachment, ZohoContact } from './types';

const ORG_ID = '20067436506';
const DEPT_ID = '17599000000007061';
const CUSTOMER_PROXY_BASE = '/zoho-customer-proxy';
const AGENT_PROXY_BASE = '/zoho-proxy';

/**
 * Get the appropriate proxy base URL based on user type.
 * - Customers use /zoho-customer-proxy (new secure proxy with session auth)
 * - Agents use /zoho-proxy (existing proxy)
 */
function getProxyBase(isCustomer = false): string {
  return isCustomer ? CUSTOMER_PROXY_BASE : AGENT_PROXY_BASE;
}

/**
 * Make an authenticated API call.
 * - Agents: Pass token in Authorization header (OAuth)
 * - Customers: Session cookie sent automatically by browser
 */
async function apiCall<T>(
  path: string,
  options: {
    isCustomer?: boolean;
    token?: string; // Required for agent mode
    method?: RequestInit['method'];
    body?: RequestInit['body'];
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { isCustomer = false, token, method, body, headers: extraHeaders = {} } = options;
  const isWrite = method === 'POST' || method === 'PATCH' || method === 'PUT';
  const isFormData = body instanceof FormData;
  const proxyBase = getProxyBase(isCustomer);
  
  const headers: Record<string, string> = {
    'orgId': ORG_ID,
    ...(isWrite && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    // For agents, pass OAuth token in Authorization header
    ...(!isCustomer && token ? { 'Authorization': `Zoho-oauthtoken ${token}` } : {}),
    ...extraHeaders,
  };

  const res = await fetch(`${proxyBase}${path}`, {
    method,
    body,
    headers,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Zoho API ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

/** Options for listing tickets */
export interface ListTicketsOptions {
  page?: number;
  status?: string;
  limit?: number;
  isCustomer?: boolean;
  token?: string;
}

export async function listTickets(
  options: ListTicketsOptions = {}
): Promise<{ data: ZohoTicket[]; count: number }> {
  const { page = 1, status, limit = 50, isCustomer = false, token } = options;
  
  const params = new URLSearchParams({
    from: String((page - 1) * limit),
    limit: String(limit),
    sortBy: '-createdTime',
    include: 'team,contacts,assignee',
  });
  
  if (isCustomer) {
    params.set('departmentId', DEPT_ID);
  }
  
  if (status && status !== 'all') {
    params.set('status', status);
  }
  
  return apiCall(`/tickets?${params}`, { isCustomer, token });
}

/** Options for getting a single ticket */
export interface GetTicketOptions {
  id: string;
  isCustomer?: boolean;
  token?: string;
}

export async function getTicket(options: GetTicketOptions): Promise<ZohoTicket> {
  const { id, isCustomer = false, token } = options;
  return apiCall(`/tickets/${id}?include=team,contacts,assignee`, { isCustomer, token });
}

/** Options for getting conversations */
export interface GetConversationsOptions {
  ticketId: string;
  isCustomer?: boolean;
  token?: string;
}

export async function getConversations(
  options: GetConversationsOptions
): Promise<{ data: ZohoConversationItem[] }> {
  const { ticketId, isCustomer = false, token } = options;
  return apiCall(`/tickets/${ticketId}/conversations`, { isCustomer, token });
}

/** Options for adding a comment */
export interface AddCommentOptions {
  ticketId: string;
  content: string;
  isPublic?: boolean;
  isCustomer?: boolean;
  token?: string;
  replyType?: 'reply' | 'replyAll' | 'forward' | 'comment';
}

export async function addComment(options: AddCommentOptions): Promise<void> {
  const { ticketId, content, isPublic = true, isCustomer = false, token, replyType } = options;
  await apiCall(`/tickets/${ticketId}/comments`, {
    isCustomer,
    token,
    method: 'POST',
    body: JSON.stringify({
      content,
      isPublic,
      contentType: 'plainText',
      ...(replyType ? { type: replyType } : {}),
    }),
  });
}

/** Options for updating ticket status */
export interface UpdateTicketStatusOptions {
  ticketId: string;
  status: string;
  isCustomer?: boolean;
  token?: string;
}

export async function updateTicketStatus(options: UpdateTicketStatusOptions): Promise<ZohoTicket> {
  const { ticketId, status, isCustomer = false, token } = options;
  return apiCall(`/tickets/${ticketId}?include=team,contacts`, {
    isCustomer,
    token,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/** Options for updating a ticket */
export interface UpdateTicketOptions {
  ticketId: string;
  fields: Partial<{ status: string; assigneeId: string; priority: string; customFields: Record<string, string> }>;
  isCustomer?: boolean;
  token?: string;
}

export async function updateTicket(options: UpdateTicketOptions): Promise<ZohoTicket> {
  const { ticketId, fields, isCustomer = false, token } = options;
  return apiCall(`/tickets/${ticketId}?include=team,contacts`, {
    isCustomer,
    token,
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

/** Options for listing statuses */
export interface ListStatusesOptions {
  isCustomer?: boolean;
  token?: string;
}

export async function listStatuses(options: ListStatusesOptions = {}): Promise<{ data: ZohoStatus[] }> {
  const { isCustomer = false, token } = options;
  return apiCall(`/statuses?type=ticketStatuses`, { isCustomer, token });
}

/** Options for listing agents */
export interface ListAgentsOptions {
  isCustomer?: boolean;
  token?: string;
}

export async function listAgents(options: ListAgentsOptions = {}): Promise<{ data: ZohoAgent[] }> {
  const { isCustomer = false, token } = options;
  return apiCall(`/agents?departmentId=${DEPT_ID}&limit=100`, { isCustomer, token });
}

/** Options for getting attachments */
export interface GetAttachmentsOptions {
  ticketId: string;
  isCustomer?: boolean;
  token?: string;
}

export async function getAttachments(options: GetAttachmentsOptions): Promise<{ data: ZohoAttachment[] }> {
  const { ticketId, isCustomer = false, token } = options;
  return apiCall(`/tickets/${ticketId}/attachments`, { isCustomer, token });
}

/** Options for uploading an attachment */
export interface UploadAttachmentOptions {
  ticketId: string;
  file: File;
  isCustomer?: boolean;
  token?: string;
}

export async function uploadAttachment(options: UploadAttachmentOptions): Promise<ZohoAttachment> {
  const { ticketId, file, isCustomer = false, token } = options;
  const form = new FormData();
  form.append('file', file, file.name);
  return apiCall(`/tickets/${ticketId}/attachments`, {
    isCustomer,
    token,
    method: 'POST',
    body: form,
  });
}

/** Options for creating a ticket */
export interface CreateTicketOptions {
  data: {
    subject: string;
    description: string;
    email: string;
    priority: string;
    status: string;
    contactId?: string;
    assigneeId?: string;
    customFields?: Record<string, string>;
  };
  isCustomer?: boolean;
  token?: string;
}

export async function createTicket(options: CreateTicketOptions): Promise<ZohoTicket> {
  const { data, isCustomer = false, token } = options;
  return apiCall(`/tickets?include=team,contacts`, {
    isCustomer,
    token,
    method: 'POST',
    body: JSON.stringify({ ...data, departmentId: DEPT_ID }),
  });
}

/** Options for getting user profile */
export interface GetUserProfileOptions {
  isCustomer?: boolean;
  token?: string;
}

/** Fetch the Zoho profile for the currently authenticated user (uses accounts.zoho.eu) */
export async function getUserProfile(options: GetUserProfileOptions = {}): Promise<{ Email?: string; email?: string; Display_Name?: string }> {
  const { isCustomer = false, token } = options;
  const proxyBase = getProxyBase(isCustomer);
  const headers: Record<string, string> = {};
  if (!isCustomer && token) {
    headers['Authorization'] = `Zoho-oauthtoken ${token}`;
  }
  const res = await fetch(`${proxyBase}/accounts/oauth/v2/user`, {
    credentials: 'include',
    headers,
  });
  if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
  return res.json();
}

/** Options for searching contact by email */
export interface SearchContactByEmailOptions {
  email: string;
  isCustomer?: boolean;
  token?: string;
}

/** Find a Zoho Desk Contact record by email address */
export async function searchContactByEmail(options: SearchContactByEmailOptions): Promise<ZohoContact | null> {
  const { email, isCustomer = false, token } = options;
  const res = await apiCall<{ data: ZohoContact[] }>(
    `/contacts/search?searchStr=${encodeURIComponent(email)}&searchField=email`,
    { isCustomer, token }
  );
  return (res.data ?? [])[0] ?? null;
}

export async function translateText(text: string): Promise<string> {
  if (!text) return text;
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!stripped) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(stripped)}&langpair=auto|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation failed');
  const json = await res.json();
  return (json.responseData?.translatedText as string) ?? text;
}
