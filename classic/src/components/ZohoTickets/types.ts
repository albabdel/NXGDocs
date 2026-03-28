export type LoginMode = 'agent' | 'customer';

export interface ZohoTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  statusType: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  createdTime: string;
  modifiedTime: string;
  closedTime: string | null;
  contactId: string;
  accountId: string | null;
  departmentId: string;
  email: string;
  commentCount: string;
  threadCount: string;
  webUrl: string;
  channel: string;
  isOverDue: boolean;
  customFields: Record<string, string | null>;
  assigneeId?: string | null;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    photoURL?: string;
  } | null;
  contact?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  account?: {
    accountName: string;
  };
}

export interface ZohoConversationItem {
  id: string;
  type: string;
  content: string;
  contentType: string;
  commentedTime?: string;
  createdTime?: string;
  isPublic: boolean;
  isDescriptionThread?: boolean;
  commenter?: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    photoURL: string;
    roleName: string;
    type: string;
  };
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    photoURL: string;
    type: string;
  };
}

export interface ZohoAgent {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  photoURL: string;
  roleId: string;
  roleName: string;
  isEnabled: boolean;
}

export interface ZohoStatus {
  id: string;
  type: string;
  displayName: string;
  colorCode: string;
}

export interface ZohoAttachment {
  id: string;
  attachmentId: string;
  name: string;
  size: string;
  fileType: string;
  href: string;
  previewHref?: string;
}

export interface ZohoContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountId: string | null;
  account?: {
    accountName: string;
  };
}

/** Token data for agent mode (Zoho OAuth) - stores access token for API calls */
export interface ZohoTokenData {
  accessToken: string;
  expiry: number;
  mode: 'agent';
}

/** Session data for customer mode (Auth0 -> session cookie) - NO secrets stored */
export interface ZohoSessionData {
  mode: 'customer';
  contactId: string;
  accountId: string | null;
  displayName: string;
  account?: string | null;
  csmEmail?: string | null;
  csmName?: string | null;
  sessionExpiry?: number;
}

/** Union type for stored auth data */
export type ZohoAuthData = ZohoTokenData | ZohoSessionData;

// ---------------------------------------------------------------------------
// Auth Error Types
// ---------------------------------------------------------------------------

export type AuthErrorType =
  | 'network_error'
  | 'invalid_token'
  | 'contact_not_found'
  | 'portal_access_denied'
  | 'session_expired'
  | 'nonce_mismatch'
  | 'server_error'
  | 'unknown';

export interface AuthError {
  type: AuthErrorType;
  message: string;
  action?: string;
  retryable?: boolean;
}
