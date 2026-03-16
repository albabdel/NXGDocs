// CRM Panel Types

export interface CRMAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface CRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  accountId?: string | null;
  account?: CRMAccount | null;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdTime?: string;
  modifiedTime?: string;
  photoUrl?: string;
  address?: CRMAddress;
  mailingAddress?: CRMAddress;
  otherAddress?: CRMAddress;
}

export interface CRMAccount {
  id: string;
  accountName: string;
  website?: string;
  phone?: string;
  industry?: string;
  employees?: string | number;
  annualRevenue?: string | number;
  billingAddress?: CRMAddress;
  shippingAddress?: CRMAddress;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdTime?: string;
  modifiedTime?: string;
  logoUrl?: string;
  description?: string;
}

export interface CRMContactSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  accountId?: string | null;
}

export interface CRMContactListResponse {
  data: CRMContact[];
  count: number;
  hasMore: boolean;
}

export interface CRMContactSearchResponse {
  data: CRMContactSearchResult[];
  count: number;
}

export interface CRMAccountResponse {
  data: CRMAccount;
}

export interface CRMTicketSummary {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  statusType: string;
  priority: string;
  createdTime: string;
  closedTime: string | null;
}

export interface CRMTicketsResponse {
  data: CRMTicketSummary[];
  count: number;
}
