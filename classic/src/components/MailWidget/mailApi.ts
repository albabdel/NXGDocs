import type {
  MailFolder,
  MailMessage,
  MailAttachment,
  MailListResponse,
  MailFolderListResponse,
  SendMailParams,
  MailAccount,
} from './types';

// API Configuration
const PROXY_BASE = '/zoho-mail-proxy';

// Cache for account ID (Zoho Mail requires account ID in API paths)
let cachedAccountId: string | null = null;

/**
 * Get the user's primary mail account ID
 * Zoho Mail API requires account ID in most endpoints
 */
async function getAccountId(token: string): Promise<string> {
  if (cachedAccountId) {
    return cachedAccountId;
  }

  const response = await fetch(`${PROXY_BASE}/accounts`, {
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to get mail accounts (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  
  // Zoho returns accounts in data.accounts array
  const accounts = data.accounts || data.data || [];
  
  if (!Array.isArray(accounts) || accounts.length === 0) {
    throw new Error('No mail accounts found');
  }

  // Use primary account or first account
  const primaryAccount = accounts.find((acc: { isPrimary?: boolean }) => acc.isPrimary) || accounts[0];
  cachedAccountId = primaryAccount.accountId || primaryAccount.id || accounts[0].accountId || accounts[0].id;
  
  return cachedAccountId;
}

/**
 * Helper to make authenticated requests through the MCP proxy
 * The proxy handles MCP JSON-RPC format translation
 */
async function mailFetch<T>(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isWrite = options.method === 'POST' || options.method === 'PATCH' || options.method === 'PUT';
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    ...(isWrite && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const url = `${PROXY_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Mail API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get all mail accounts
 */
export async function listAccounts(token: string): Promise<MailAccount[]> {
  const response = await mailFetch<{ accounts?: MailAccount[]; data?: MailAccount[] }>(
    token,
    '/accounts'
  );
  
  const accounts = response.accounts || response.data || [];
  return accounts.map((acc: Record<string, unknown>) => ({
    id: (acc.accountId as string) || (acc.id as string),
    emailAddress: acc.emailAddress as string,
    displayName: acc.displayName as string,
    isPrimary: acc.isPrimary as boolean,
    signature: acc.signature as string | undefined,
  }));
}

/**
 * Get all mail folders
 */
export async function listFolders(token: string): Promise<MailFolderListResponse> {
  const accountId = await getAccountId(token);
  const response = await mailFetch<{ folders?: unknown[]; data?: unknown[] }>(
    token,
    `/accounts/${accountId}/folders`
  );
  
  const folders = response.folders || response.data || [];
  
  // Map Zoho folder format to our MailFolder type
  const mappedFolders: MailFolder[] = folders.map((folder: Record<string, unknown>) => {
    // Determine folder type from Zoho's folderId or attributes
    const folderId = (folder.folderId as string) || (folder.id as string) || '';
    const folderName = (folder.folderName as string) || (folder.name as string) || 'Unknown';
    
    let type: MailFolder['type'] = 'inbox';
    const lowerId = folderId.toLowerCase();
    const lowerName = folderName.toLowerCase();
    
    if (lowerId.includes('inbox') || lowerName === 'inbox') type = 'inbox';
    else if (lowerId.includes('sent') || lowerName === 'sent') type = 'sent';
    else if (lowerId.includes('draft') || lowerName === 'drafts') type = 'drafts';
    else if (lowerId.includes('spam') || lowerName === 'spam') type = 'spam';
    else if (lowerId.includes('trash') || lowerName === 'trash') type = 'trash';
    else if (lowerId.includes('archive') || lowerName === 'archive') type = 'archive';
    
    return {
      id: folderId,
      name: folderName,
      type,
      unreadCount: (folder.unreadCount as number) || 0,
      totalCount: (folder.totalCount as number) || (folder.count as number) || 0,
      parentFolderId: folder.parentFolderId as string | undefined,
    };
  });
  
  return { data: mappedFolders };
}

/**
 * Get emails from a specific folder
 */
export async function listEmails(
  token: string,
  folderId: string,
  page: number = 1,
  limit: number = 25,
  cursor?: string
): Promise<MailListResponse> {
  const accountId = await getAccountId(token);
  
  // Build query params
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (page > 1) {
    params.set('start', String((page - 1) * limit + 1));
  }
  if (cursor) {
    params.set('nextCursor', cursor);
  }
  
  const response = await mailFetch<{ messages?: unknown[]; data?: unknown[] }>(
    token,
    `/accounts/${accountId}/folders/${folderId}/messages?${params.toString()}`
  );
  
  const messages = response.messages || response.data || [];
  
  // Map Zoho message format to our MailMessage type
  const mappedMessages: MailMessage[] = messages.map((msg: Record<string, unknown>) => ({
    id: (msg.messageId as string) || (msg.id as string),
    subject: (msg.subject as string) || '(No Subject)',
    summary: (msg.preview as string) || (msg.excerpt as string) || '',
    content: '', // Full content not included in list view
    contentType: ((msg.contentType as string) || 'html').includes('text/plain') ? 'plainText' : 'html',
    from: (msg.from as string) || (msg.sender as string) || '',
    to: Array.isArray(msg.to) 
      ? (msg.to as string[]).map((r: string | Record<string, string>) => typeof r === 'string' ? r : r.email)
      : [(msg.to as string) || ''],
    cc: msg.cc ? (Array.isArray(msg.cc) ? (msg.cc as string[]) : [msg.cc as string]) : undefined,
    bcc: msg.bcc ? (Array.isArray(msg.bcc) ? (msg.bcc as string[]) : [msg.bcc as string]) : undefined,
    timestamp: (msg.receivedTime as string) || (msg.timestamp as string) || new Date().toISOString(),
    hasAttachment: (msg.hasAttachment as boolean) || (msg.attachmentsCount as number) > 0 || false,
    isRead: (msg.status as string) === 'read' || (msg.isRead as boolean) === true || (msg.unread as boolean) === false,
    isFlagged: (msg.isFlagged as boolean) || (msg.flagged as boolean) || false,
    folderId,
    sender: {
      id: (msg.senderId as string) || '',
      firstName: (msg.senderFirstName as string) || '',
      lastName: (msg.senderLastName as string) || '',
      email: (msg.senderEmail as string) || (msg.from as string) || '',
    },
  }));
  
  return {
    data: mappedMessages,
    count: mappedMessages.length,
    hasMore: mappedMessages.length === limit, // Assume more if we got full limit
    nextCursor: response.nextCursor as string | undefined,
  };
}

/**
 * Get a single email by ID
 */
export async function getEmail(token: string, emailId: string): Promise<MailMessage> {
  const accountId = await getAccountId(token);
  
  // Find which folder the email is in - try inbox first, then sent
  let folderId = 'inbox';
  
  // Try to get from common folders
  const folders = await listFolders(token);
  for (const folder of folders.data) {
    try {
      const response = await mailFetch<{ data?: Record<string, unknown>; message?: Record<string, unknown> }>(
        token,
        `/accounts/${accountId}/folders/${folder.id}/messages/${emailId}`
      );
      
      const msg = response.message || response.data;
      if (msg) {
        const message = msg as Record<string, unknown>;
        return {
          id: (message.messageId as string) || emailId,
          subject: (message.subject as string) || '(No Subject)',
          summary: (message.preview as string) || (message.excerpt as string) || '',
          content: (message.content as string) || (message.body as string) || '',
          contentType: ((message.contentType as string) || 'html').includes('text/plain') ? 'plainText' : 'html',
          from: (message.from as string) || (message.sender as string) || '',
          to: Array.isArray(message.to)
            ? (message.to as (string | Record<string, string>)[]).map((r) => typeof r === 'string' ? r : r.email)
            : [(message.to as string) || ''],
          cc: message.cc 
            ? (Array.isArray(message.cc) ? (message.cc as string[]) : [message.cc as string]) 
            : undefined,
          bcc: message.bcc 
            ? (Array.isArray(message.bcc) ? (message.bcc as string[]) : [message.bcc as string]) 
            : undefined,
          timestamp: (message.receivedTime as string) || (message.timestamp as string) || new Date().toISOString(),
          hasAttachment: (message.hasAttachment as boolean) || (message.attachmentsCount as number) > 0 || false,
          isRead: (message.status as string) === 'read' || (message.isRead as boolean) === true,
          isFlagged: (message.isFlagged as boolean) || false,
          folderId: folder.id,
          sender: {
            id: (message.senderId as string) || '',
            firstName: (message.senderFirstName as string) || '',
            lastName: (message.senderLastName as string) || '',
            email: (message.senderEmail as string) || '',
          },
          attachments: Array.isArray(message.attachments)
            ? (message.attachments as Record<string, unknown>[]).map((att) => ({
                id: (att.attachmentId as string) || (att.id as string) || '',
                name: (att.filename as string) || (att.name as string) || 'Attachment',
                size: (att.size as number) || 0,
                contentType: (att.contentType as string) || 'application/octet-stream',
                href: (att.url as string) || (att.href as string) || '',
                previewHref: (att.previewUrl as string) || (att.previewHref as string),
                inline: (att.inline as boolean) || false,
              }))
            : undefined,
        };
      }
    } catch {
      // Email not in this folder, try next
      continue;
    }
  }
  
  throw new Error('Email not found in any folder');
}

/**
 * Get email thread
 */
export async function getEmailThread(token: string, emailId: string): Promise<MailMessage[]> {
  const accountId = await getAccountId(token);
  
  // Try to get thread information
  try {
    const response = await mailFetch<{ data?: Record<string, unknown>[]; messages?: Record<string, unknown>[] }>(
      token,
      `/accounts/${accountId}/messages/${emailId}/thread`
    );
    
    const threadMessages = response.data || response.messages || [];
    
    if (threadMessages.length > 0) {
      return threadMessages.map((msg: Record<string, unknown>) => ({
        id: (msg.messageId as string) || (msg.id as string),
        subject: (msg.subject as string) || '(No Subject)',
        summary: (msg.preview as string) || '',
        content: (msg.content as string) || (msg.body as string) || '',
        contentType: ((msg.contentType as string) || 'html').includes('text/plain') ? 'plainText' : 'html',
        from: (msg.from as string) || '',
        to: Array.isArray(msg.to)
          ? (msg.to as (string | Record<string, string>)[]).map((r) => typeof r === 'string' ? r : r.email)
          : [(msg.to as string) || ''],
        timestamp: (msg.receivedTime as string) || (msg.timestamp as string) || new Date().toISOString(),
        hasAttachment: (msg.hasAttachment as boolean) || false,
        isRead: (msg.status as string) === 'read' || (msg.isRead as boolean) === true,
        isFlagged: (msg.isFlagged as boolean) || false,
        folderId: (msg.folderId as string) || (msg.folder as string) || 'inbox',
        sender: {
          id: (msg.senderId as string) || '',
          firstName: (msg.senderFirstName as string) || '',
          lastName: (msg.senderLastName as string) || '',
          email: (msg.senderEmail as string) || (msg.from as string) || '',
        },
      }));
    }
  } catch {
    // Thread endpoint not available, return single email
  }
  
  // Fallback: return single email as thread
  const email = await getEmail(token, emailId);
  return [email];
}

/**
 * Send an email
 */
export async function sendEmail(
  token: string,
  params: SendMailParams
): Promise<{ id: string; success: boolean }> {
  const accountId = await getAccountId(token);
  
  // Build email payload in Zoho format
  const payload: Record<string, unknown> = {
    from: `${params.to[0]}`, // Will be set by Zoho based on account
    to: params.to,
    subject: params.subject,
    content: params.content,
    contentType: params.contentType || 'html',
  };
  
  if (params.cc && params.cc.length > 0) {
    payload.cc = params.cc;
  }
  if (params.bcc && params.bcc.length > 0) {
    payload.bcc = params.bcc;
  }
  if (params.inReplyTo) {
    payload.inReplyTo = params.inReplyTo;
  }
  
  const response = await mailFetch<{ data?: { messageId?: string }; messageId?: string }>(
    token,
    `/accounts/${accountId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
  
  return {
    id: response.data?.messageId || response.messageId || `sent-${Date.now()}`,
    success: true,
  };
}

/**
 * Mark email as read
 */
export async function markAsRead(token: string, emailId: string): Promise<void> {
  const accountId = await getAccountId(token);
  
  // Need folder ID for the update endpoint
  const email = await getEmail(token, emailId);
  
  await mailFetch(
    token,
    `/accounts/${accountId}/folders/${email.folderId}/messages/${emailId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        status: 'read',
      }),
    }
  );
}

/**
 * Mark email as unread
 */
export async function markAsUnread(token: string, emailId: string): Promise<void> {
  const accountId = await getAccountId(token);
  
  const email = await getEmail(token, emailId);
  
  await mailFetch(
    token,
    `/accounts/${accountId}/folders/${email.folderId}/messages/${emailId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        status: 'unread',
      }),
    }
  );
}

/**
 * Delete an email
 */
export async function deleteEmail(token: string, emailId: string): Promise<void> {
  const accountId = await getAccountId(token);
  
  const email = await getEmail(token, emailId);
  
  await mailFetch(
    token,
    `/accounts/${accountId}/folders/${email.folderId}/messages/${emailId}`,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Move email to folder
 */
export async function moveEmail(token: string, emailId: string, targetFolderId: string): Promise<void> {
  const accountId = await getAccountId(token);
  
  const email = await getEmail(token, emailId);
  
  await mailFetch(
    token,
    `/accounts/${accountId}/folders/${email.folderId}/messages/${emailId}/move`,
    {
      method: 'PUT',
      body: JSON.stringify({
        destFolderId: targetFolderId,
      }),
    }
  );
}

/**
 * Get unread count for inbox
 */
export async function getUnreadCount(token: string): Promise<number> {
  const folders = await listFolders(token);
  const inbox = folders.data.find(f => f.type === 'inbox');
  return inbox?.unreadCount || 0;
}

/**
 * Get recent emails (last N) for widget preview
 */
export async function getRecentEmails(token: string, limit: number = 3): Promise<MailMessage[]> {
  const folders = await listFolders(token);
  const inbox = folders.data.find(f => f.type === 'inbox');
  
  if (!inbox) {
    return [];
  }
  
  const response = await listEmails(token, inbox.id, 1, limit);
  return response.data;
}

/**
 * Search emails
 */
export async function searchEmails(
  token: string,
  query: string,
  folderId?: string
): Promise<MailListResponse> {
  const accountId = await getAccountId(token);
  
  // Use search endpoint
  const params = new URLSearchParams();
  params.set('searchKey', query);
  if (folderId) {
    params.set('folderId', folderId);
  }
  
  const response = await mailFetch<{ data?: unknown[]; messages?: unknown[] }>(
    token,
    `/accounts/${accountId}/messages/search?${params.toString()}`
  );
  
  const messages = response.data || response.messages || [];
  
  const mappedMessages: MailMessage[] = messages.map((msg: Record<string, unknown>) => ({
    id: (msg.messageId as string) || (msg.id as string),
    subject: (msg.subject as string) || '(No Subject)',
    summary: (msg.preview as string) || '',
    content: '',
    contentType: 'html',
    from: (msg.from as string) || '',
    to: Array.isArray(msg.to)
      ? (msg.to as (string | Record<string, string>)[]).map((r) => typeof r === 'string' ? r : r.email)
      : [(msg.to as string) || ''],
    timestamp: (msg.receivedTime as string) || (msg.timestamp as string) || new Date().toISOString(),
    hasAttachment: (msg.hasAttachment as boolean) || false,
    isRead: (msg.status as string) === 'read' || (msg.isRead as boolean) === true,
    isFlagged: false,
    folderId: (msg.folderId as string) || 'inbox',
    sender: {
      id: '',
      firstName: '',
      lastName: '',
      email: (msg.from as string) || '',
    },
  }));
  
  return {
    data: mappedMessages,
    count: mappedMessages.length,
    hasMore: false,
  };
}

/**
 * Clear cached account ID (useful after logout)
 */
export function clearAccountCache(): void {
  cachedAccountId = null;
}

// Re-export types
export type {
  MailFolder,
  MailMessage,
  MailAttachment,
  MailListResponse,
  MailFolderListResponse,
  SendMailParams,
  MailAccount,
};
