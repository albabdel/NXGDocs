// Mail Widget Types

export interface MailAccount {
  id: string;
  emailAddress: string;
  displayName: string;
  isPrimary: boolean;
  signature?: string;
}

export interface MailFolder {
  id: string;
  name: string;
  type: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'archive';
  unreadCount: number;
  totalCount: number;
  parentFolderId?: string;
  children?: MailFolder[];
}

export interface MailAttachment {
  id: string;
  name: string;
  size: number;
  contentType: string;
  href: string;
  previewHref?: string;
  inline?: boolean;
}

export interface MailSender {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
}

export interface MailRecipient {
  email: string;
  name?: string;
}

export interface MailMessage {
  id: string;
  subject: string;
  summary: string;
  content: string;
  contentType: 'html' | 'plainText';
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  inReplyTo?: string;
  timestamp: string;
  hasAttachment: boolean;
  isRead: boolean;
  isFlagged: boolean;
  folderId: string;
  sender: MailSender;
  toRecipients?: MailRecipient[];
  ccRecipients?: MailRecipient[];
  bccRecipients?: MailRecipient[];
  attachments?: MailAttachment[];
  thread?: {
    id: string;
    messages: MailMessage[];
  };
}

export interface MailThread {
  id: string;
  subject: string;
  messageCount: number;
  messages: MailMessage[];
  latestMessage: MailMessage;
}

export interface MailListResponse {
  data: MailMessage[];
  count: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface MailFolderListResponse {
  data: MailFolder[];
}

export interface SendMailParams {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  contentType?: 'html' | 'plainText';
  attachments?: File[];
  inReplyTo?: string;
}

export interface MailComposeState {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  content: string;
  attachments: File[];
}
