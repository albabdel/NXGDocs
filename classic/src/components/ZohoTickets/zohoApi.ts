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
 * Make an authenticated API call using session-based authentication.
 * The browser automatically sends session cookies - no tokens in client code.
 */
async function apiCall<T>(
  path: string,
  options: {
    isCustomer?: boolean;
    method?: RequestInit['method'];
    body?: RequestInit['body'];
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { isCustomer = false, method, body, headers: extraHeaders = {} } = options;
  const isWrite = method === 'POST' || method === 'PATCH' || method === 'PUT';
  const isFormData = body instanceof FormData;
  const proxyBase = getProxyBase(isCustomer);
  
  const headers: Record<string, string> = {
    'orgId': ORG_ID,
    ...(isWrite && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...extraHeaders,
  };
  // No Authorization header - session cookie is sent automatically by browser

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
}

export async function listTickets(
  options: ListTicketsOptions = {}
): Promise<{ data: ZohoTicket[]; count: number }> {
  const { page = 1, status, limit = 50, isCustomer = false } = options;
  
  const params = new URLSearchParams({
    from: String((page - 1) * limit),
    limit: String(limit),
    sortBy: '-createdTime',
  });
  
  // For customer queries, scope to the configured department
  // The proxy handles contactId scoping server-side based on session
  if (isCustomer) {
    params.set('departmentId', DEPT_ID);
  }
  
  if (status && status !== 'all') {
    params.set('status', status);
  }
  
  return apiCall(`/tickets?${params}`, { isCustomer });
}

/** Options for getting a single ticket */
export interface GetTicketOptions {
  id: string;
  isCustomer?: boolean;
}

export async function getTicket(options: GetTicketOptions): Promise<ZohoTicket> {
  const { id, isCustomer = false } = options;
  return apiCall(`/tickets/${id}`, { isCustomer });
}

/** Options for getting conversations */
export interface GetConversationsOptions {
  ticketId: string;
  isCustomer?: boolean;
}

export async function getConversations(
  options: GetConversationsOptions
): Promise<{ data: ZohoConversationItem[] }> {
  const { ticketId, isCustomer = false } = options;
  return apiCall(`/tickets/${ticketId}/conversations`, { isCustomer });
}

/** Options for adding a comment */
export interface AddCommentOptions {
  ticketId: string;
  content: string;
  isPublic?: boolean;
  isCustomer?: boolean;
}

export async function addComment(options: AddCommentOptions): Promise<void> {
  const { ticketId, content, isPublic = true, isCustomer = false } = options;
  await apiCall(`/tickets/${ticketId}/comments`, {
    isCustomer,
    method: 'POST',
    body: JSON.stringify({ content, isPublic, contentType: 'plainText' }),
  });
}

/** Options for updating ticket status */
export interface UpdateTicketStatusOptions {
  ticketId: string;
  status: string;
  isCustomer?: boolean;
}

export async function updateTicketStatus(options: UpdateTicketStatusOptions): Promise<ZohoTicket> {
  const { ticketId, status, isCustomer = false } = options;
  return apiCall(`/tickets/${ticketId}`, {
    isCustomer,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/** Options for updating a ticket */
export interface UpdateTicketOptions {
  ticketId: string;
  fields: Partial<{ status: string; assigneeId: string; priority: string; customFields: Record<string, string> }>;
  isCustomer?: boolean;
}

export async function updateTicket(options: UpdateTicketOptions): Promise<ZohoTicket> {
  const { ticketId, fields, isCustomer = false } = options;
  return apiCall(`/tickets/${ticketId}`, {
    isCustomer,
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

/** Options for listing statuses */
export interface ListStatusesOptions {
  isCustomer?: boolean;
}

export async function listStatuses(options: ListStatusesOptions = {}): Promise<{ data: ZohoStatus[] }> {
  const { isCustomer = false } = options;
  return apiCall(`/statuses?type=ticketStatuses`, { isCustomer });
}

/** Options for listing agents */
export interface ListAgentsOptions {
  isCustomer?: boolean;
}

export async function listAgents(options: ListAgentsOptions = {}): Promise<{ data: ZohoAgent[] }> {
  const { isCustomer = false } = options;
  return apiCall(`/agents?departmentId=${DEPT_ID}&limit=100`, { isCustomer });
}

/** Options for getting attachments */
export interface GetAttachmentsOptions {
  ticketId: string;
  isCustomer?: boolean;
}

export async function getAttachments(options: GetAttachmentsOptions): Promise<{ data: ZohoAttachment[] }> {
  const { ticketId, isCustomer = false } = options;
  return apiCall(`/tickets/${ticketId}/attachments`, { isCustomer });
}

/** Options for uploading an attachment */
export interface UploadAttachmentOptions {
  ticketId: string;
  file: File;
  isCustomer?: boolean;
}

export async function uploadAttachment(options: UploadAttachmentOptions): Promise<ZohoAttachment> {
  const { ticketId, file, isCustomer = false } = options;
  const form = new FormData();
  form.append('file', file, file.name);
  return apiCall(`/tickets/${ticketId}/attachments`, {
    isCustomer,
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
}

export async function createTicket(options: CreateTicketOptions): Promise<ZohoTicket> {
  const { data, isCustomer = false } = options;
  return apiCall(`/tickets`, {
    isCustomer,
    method: 'POST',
    body: JSON.stringify({ ...data, departmentId: DEPT_ID }),
  });
}

/** Options for getting user profile */
export interface GetUserProfileOptions {
  isCustomer?: boolean;
}

/** Fetch the Zoho profile for the currently authenticated user (uses accounts.zoho.eu) */
export async function getUserProfile(options: GetUserProfileOptions = {}): Promise<{ Email?: string; email?: string; Display_Name?: string }> {
  const { isCustomer = false } = options;
  const proxyBase = getProxyBase(isCustomer);
  const res = await fetch(`${proxyBase}/accounts/oauth/v2/user`, {
    credentials: 'include', // Ensure session cookie is sent
  });
  if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
  return res.json();
}

/** Options for searching contact by email */
export interface SearchContactByEmailOptions {
  email: string;
  isCustomer?: boolean;
}

/** Find a Zoho Desk Contact record by email address */
export async function searchContactByEmail(options: SearchContactByEmailOptions): Promise<ZohoContact | null> {
  const { email, isCustomer = false } = options;
  const res = await apiCall<{ data: ZohoContact[] }>(
    `/contacts/search?searchStr=${encodeURIComponent(email)}&searchField=email`,
    { isCustomer }
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
