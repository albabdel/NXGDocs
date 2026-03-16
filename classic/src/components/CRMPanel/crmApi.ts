import type { ZohoTokenData } from '../ZohoTickets/types';
import type {
  CRMContact,
  CRMAccount,
  CRMContactSearchResult,
  CRMContactListResponse,
  CRMContactSearchResponse,
  CRMAccountResponse,
  CRMTicketSummary,
  CRMTicketsResponse,
} from './types';

const PROXY_BASE = '/zoho-proxy';
const ORG_ID = '20067436506';

interface DeskContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  accountId: string | null;
  account?: {
    id: string;
    accountName: string;
  } | null;
  createdTime?: string;
  modifiedTime?: string;
}

interface DeskAccount {
  id: string;
  accountName: string;
  website?: string;
  phone?: string;
  industry?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface DeskTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  statusType: string;
  priority: string;
  createdTime: string;
  closedTime: string | null;
}

function mapDeskContactToCRM(contact: DeskContact): CRMContact {
  return {
    id: contact.id,
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    email: contact.email || '',
    phone: contact.phone,
    mobile: contact.mobile,
    accountId: contact.accountId,
    account: contact.account ? {
      id: contact.account.id,
      accountName: contact.account.accountName,
    } : null,
    createdTime: contact.createdTime,
    modifiedTime: contact.modifiedTime,
  };
}

function mapDeskAccountToCRM(account: DeskAccount): CRMAccount {
  return {
    id: account.id,
    accountName: account.accountName,
    website: account.website,
    phone: account.phone,
    industry: account.industry,
    createdTime: account.createdTime,
    modifiedTime: account.modifiedTime,
  };
}

function mapDeskTicketToCRM(ticket: DeskTicket): CRMTicketSummary {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    status: ticket.status,
    statusType: ticket.statusType,
    priority: ticket.priority,
    createdTime: ticket.createdTime,
    closedTime: ticket.closedTime,
  };
}

async function deskApiCall<T>(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'orgId': ORG_ID,
    ...(options.headers as Record<string, string> ?? {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${PROXY_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Desk API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function searchContacts(
  token: string,
  query: string,
  limit: number = 10
): Promise<CRMContactSearchResponse> {
  try {
    const searchStr = encodeURIComponent(query);
    
    const response = await deskApiCall<{ data: DeskContact[] }>(
      token,
      `/contacts/search?searchStr=${searchStr}&limit=${limit}`
    );

    const contacts = response.data || [];
    
    return {
      data: contacts.map(contact => ({
        id: contact.id,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone,
        company: contact.account?.accountName,
        accountId: contact.accountId,
      })),
      count: contacts.length,
    };
  } catch (error) {
    console.warn('Desk contact search failed:', error);
    return { data: [], count: 0 };
  }
}

export async function getContact(
  token: string,
  contactId: string
): Promise<CRMContact | null> {
  try {
    const response = await deskApiCall<{ data: DeskContact[] }>(
      token,
      `/contacts/${contactId}`
    );

    const contact = response.data?.[0];
    return contact ? mapDeskContactToCRM(contact) : null;
  } catch (error) {
    console.warn('Failed to fetch contact:', error);
    return null;
  }
}

export async function getContactByEmail(
  token: string,
  email: string
): Promise<CRMContact | null> {
  try {
    const searchStr = encodeURIComponent(email);
    
    const response = await deskApiCall<{ data: DeskContact[] }>(
      token,
      `/contacts/search?searchStr=${searchStr}&searchField=email&limit=1`
    );

    const contact = response.data?.[0];
    return contact ? mapDeskContactToCRM(contact) : null;
  } catch (error) {
    console.warn('Failed to fetch contact by email:', error);
    return null;
  }
}

export async function getAccount(
  token: string,
  accountId: string
): Promise<CRMAccount | null> {
  try {
    const response = await deskApiCall<{ data: DeskAccount[] }>(
      token,
      `/accounts/${accountId}`
    );

    const account = response.data?.[0];
    return account ? mapDeskAccountToCRM(account) : null;
  } catch (error) {
    console.warn('Failed to fetch account:', error);
    return null;
  }
}

export async function getContactTickets(
  deskToken: string,
  contactId?: string,
  accountId?: string | null,
  limit: number = 10
): Promise<CRMTicketsResponse> {
  try {
    let endpoint = `/tickets?limit=${limit}&sortBy=-createdTime&include=accounts,contacts`;
    
    if (contactId) {
      endpoint += `&contactId=${contactId}`;
    } else if (accountId) {
      endpoint += `&accountId=${accountId}`;
    }

    const response = await deskApiCall<{ data: DeskTicket[] }>(
      deskToken,
      endpoint
    );

    const tickets = response.data || [];

    return {
      data: tickets.map(mapDeskTicketToCRM),
      count: tickets.length,
    };
  } catch (error) {
    console.warn('Failed to fetch contact tickets:', error);
    return { data: [], count: 0 };
  }
}

export async function getAccountOpenTicketsCount(
  deskToken: string,
  accountId: string
): Promise<number> {
  try {
    const response = await deskApiCall<{ data: DeskTicket[] }>(
      deskToken,
      `/tickets?accountId=${accountId}&statusType=Open&limit=1`
    );

    return response.data?.length || 0;
  } catch (error) {
    console.warn('Failed to fetch open tickets count:', error);
    return 0;
  }
}

export async function createContact(
  token: string,
  contactData: Partial<CRMContact>
): Promise<CRMContact | null> {
  console.warn('createContact not implemented for Desk API');
  return null;
}

export async function updateContact(
  token: string,
  contactId: string,
  contactData: Partial<CRMContact>
): Promise<CRMContact | null> {
  console.warn('updateContact not implemented for Desk API');
  return null;
}

export async function listMCPTools(): Promise<string[]> {
  return [];
}

export type {
  CRMContact,
  CRMAccount,
  CRMContactSearchResult,
  CRMContactListResponse,
  CRMContactSearchResponse,
  CRMAccountResponse,
  CRMTicketSummary,
  CRMTicketsResponse,
};
