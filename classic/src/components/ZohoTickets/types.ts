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

export interface ZohoTokenData {
  accessToken: string;
  expiry: number;
}
