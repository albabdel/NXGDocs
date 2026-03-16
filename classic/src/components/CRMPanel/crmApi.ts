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

// MCP Configuration
const MCP_ENDPOINT = 'https://mcp2-20110877848.zohomcp.eu/mcp/message?key=143d7fe3ce88efe14ac703e0ef7cae39';
const PROXY_BASE = '/zoho-crm-proxy';
const DIRECT_BASE = 'https://www.zohoapis.eu/crm/v8';

let useProxy = true;
let mcpMessageId = 0;

/**
 * MCP Message format types
 */
interface MCPMessage {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: number;
  result?: {
    content: Array<{
      type: string;
      text?: string;
      data?: unknown;
    }>;
  };
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Generate unique message ID for MCP requests
 */
function getNextMessageId(): number {
  return ++mcpMessageId;
}

/**
 * Create an MCP-formatted request message
 */
function createMCPMessage(method: string, params?: Record<string, unknown>): MCPMessage {
  return {
    jsonrpc: '2.0',
    id: getNextMessageId(),
    method,
    params,
  };
}

/**
 * Parse MCP response and extract data
 */
function parseMCPResponse<T>(response: MCPResponse): T {
  if (response.error) {
    throw new Error(`MCP Error ${response.error.code}: ${response.error.message}`);
  }

  if (!response.result?.content) {
    throw new Error('MCP response missing content');
  }

  // Extract text content and parse JSON
  const textContent = response.result.content.find(c => c.type === 'text');
  if (textContent?.text) {
    try {
      return JSON.parse(textContent.text) as T;
    } catch {
      // If not JSON, return the text directly (for non-JSON responses)
      return textContent.text as unknown as T;
    }
  }

  // Check for direct data
  const dataContent = response.result.content.find(c => c.type === 'resource');
  if (dataContent?.data) {
    return dataContent.data as T;
  }

  throw new Error('MCP response contains no parseable content');
}

/**
 * Helper to make MCP requests through proxy
 */
async function mcpFetch<T>(
  endpoint: string,
  method: string,
  params?: Record<string, unknown>
): Promise<T> {
  const mcpMessage = createMCPMessage(method, params);

  const makeRequest = async (baseUrl: string): Promise<Response> => {
    const url = `${baseUrl}/mcp`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mcpMessage),
    });
  };

  let response: Response;

  if (useProxy) {
    response = await makeRequest(PROXY_BASE);
    if (response.status === 404) {
      const text = await response.text().catch(() => '');
      if (text.includes('Page Not Found') || text.includes('Docusaurus')) {
        useProxy = false;
        console.warn('Proxy not available, falling back to direct MCP endpoint');
        // Direct MCP endpoint
        response = await fetch(MCP_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mcpMessage),
        });
      }
    }
  } else {
    // Use direct MCP endpoint
    response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mcpMessage),
    });
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`MCP API error (${response.status}): ${errorText}`);
  }

  const mcpResponse: MCPResponse = await response.json();
  return parseMCPResponse<T>(mcpResponse);
}

/**
 * Helper to make traditional CRM API requests with proxy fallback
 * Used for non-MCP endpoints (like direct CRM REST API)
 */
async function crmFetch<T>(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  const makeRequest = async (baseUrl: string): Promise<Response> => {
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response: Response;

  if (useProxy) {
    response = await makeRequest(PROXY_BASE);
    if (response.status === 404) {
      const text = await response.text().catch(() => '');
      if (text.includes('Page Not Found') || text.includes('Docusaurus')) {
        useProxy = false;
        console.warn('Proxy not available, falling back to direct CRM API');
        response = await makeRequest(DIRECT_BASE);
      }
    }
  } else {
    response = await makeRequest(DIRECT_BASE);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`CRM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * MCP Tool: Search contacts by email or name
 * Uses the zoho_crm_search_records MCP tool
 */
export async function searchContacts(
  token: string,
  query: string,
  limit: number = 10
): Promise<CRMContactSearchResponse> {
  try {
    // Use MCP tool for searching
    const response = await mcpFetch<{ data: CRMContact[] }>(
      '/Contacts/search',
      'tools/call',
      {
        name: 'zoho_crm_search_records',
        arguments: {
          module: 'Contacts',
          criteria: `(email:equals:${query}) or (First_Name:equals:${query}) or (Last_Name:equals:${query}) or (Full_Name:contains:${query})`,
          page: 1,
          per_page: limit,
        },
      }
    );

    return {
      data: response.data.map(contact => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.account?.accountName,
        accountId: contact.accountId,
      })),
      count: response.data.length,
    };
  } catch (error) {
    // Fallback to traditional API if MCP fails
    console.warn('MCP search failed, trying traditional API:', error);
    
    try {
      const searchCriteria = encodeURIComponent(
        `(email:equals:${query}) or (First_Name:equals:${query}) or (Last_Name:equals:${query}) or (Full_Name:contains:${query})`
      );
      
      const response = await crmFetch<{ data: CRMContact[] }>(
        token,
        `/Contacts/search?criteria=${searchCriteria}&per_page=${limit}`
      );

      return {
        data: response.data.map(contact => ({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          company: contact.account?.accountName,
          accountId: contact.accountId,
        })),
        count: response.data.length,
      };
    } catch (fallbackError) {
      console.warn('CRM search failed:', fallbackError);
      return { data: [], count: 0 };
    }
  }
}

/**
 * MCP Tool: Get a single contact by ID
 * Uses the zoho_crm_get_record MCP tool
 */
export async function getContact(
  token: string,
  contactId: string
): Promise<CRMContact | null> {
  try {
    const response = await mcpFetch<{ data: CRMContact[] }>(
      `/Contacts/${contactId}`,
      'tools/call',
      {
        name: 'zoho_crm_get_record',
        arguments: {
          module: 'Contacts',
          id: contactId,
        },
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    // Fallback to traditional API
    console.warn('MCP get contact failed, trying traditional API:', error);
    
    try {
      const response = await crmFetch<{ data: CRMContact[] }>(
        token,
        `/Contacts/${contactId}`
      );
      return response.data?.[0] || null;
    } catch (fallbackError) {
      console.warn('Failed to fetch contact:', fallbackError);
      return null;
    }
  }
}

/**
 * MCP Tool: Get contact by email address
 * Uses the zoho_crm_search_records MCP tool
 */
export async function getContactByEmail(
  token: string,
  email: string
): Promise<CRMContact | null> {
  try {
    const response = await mcpFetch<{ data: CRMContact[] }>(
      '/Contacts/search',
      'tools/call',
      {
        name: 'zoho_crm_search_records',
        arguments: {
          module: 'Contacts',
          criteria: `email:equals:${email}`,
          page: 1,
          per_page: 1,
        },
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    // Fallback to traditional API
    console.warn('MCP get contact by email failed, trying traditional API:', error);
    
    try {
      const searchCriteria = encodeURIComponent(`email:equals:${email}`);
      const response = await crmFetch<{ data: CRMContact[] }>(
        token,
        `/Contacts/search?criteria=${searchCriteria}&per_page=1`
      );
      return response.data?.[0] || null;
    } catch (fallbackError) {
      console.warn('Failed to fetch contact by email:', fallbackError);
      return null;
    }
  }
}

/**
 * MCP Tool: Get account by ID
 * Uses the zoho_crm_get_record MCP tool
 */
export async function getAccount(
  token: string,
  accountId: string
): Promise<CRMAccount | null> {
  try {
    const response = await mcpFetch<{ data: CRMAccount[] }>(
      `/Accounts/${accountId}`,
      'tools/call',
      {
        name: 'zoho_crm_get_record',
        arguments: {
          module: 'Accounts',
          id: accountId,
        },
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    // Fallback to traditional API
    console.warn('MCP get account failed, trying traditional API:', error);
    
    try {
      const response = await crmFetch<{ data: CRMAccount[] }>(
        token,
        `/Accounts/${accountId}`
      );
      return response.data?.[0] || null;
    } catch (fallbackError) {
      console.warn('Failed to fetch account:', fallbackError);
      return null;
    }
  }
}

/**
 * MCP Tool: Get recent tickets for a contact from Desk API
 * This cross-references with the Desk API using contactId or accountId
 */
export async function getContactTickets(
  deskToken: string,
  contactId?: string,
  accountId?: string | null,
  limit: number = 10
): Promise<CRMTicketsResponse> {
  // Use the Desk API proxy for ticket lookups
  const deskApiBase = '/zoho-desk-proxy';
  
  try {
    // Try MCP tool for Desk tickets
    const response = await mcpFetch<{ data: any[] }>(
      '/tickets',
      'tools/call',
      {
        name: 'zoho_desk_get_tickets',
        arguments: {
          contactId: contactId || undefined,
          accountId: accountId || undefined,
          limit,
          include: 'accounts,contacts',
        },
      }
    );

    return {
      data: (response.data || []).map((ticket: any) => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        statusType: ticket.statusType,
        priority: ticket.priority,
        createdTime: ticket.createdTime,
        closedTime: ticket.closedTime,
      })),
      count: response.data?.length || 0,
    };
  } catch (error) {
    // Fallback to traditional Desk API
    console.warn('MCP get tickets failed, trying traditional Desk API:', error);
    
    try {
      let endpoint = `/tickets?limit=${limit}&include=accounts,contacts`;
      
      if (contactId) {
        endpoint += `&contactId=${contactId}`;
      } else if (accountId) {
        endpoint += `&accountId=${accountId}`;
      }

      const response = await fetch(`${deskApiBase}${endpoint}`, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${deskToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Desk API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        data: (data.data || []).map((ticket: any) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          status: ticket.status,
          statusType: ticket.statusType,
          priority: ticket.priority,
          createdTime: ticket.createdTime,
          closedTime: ticket.closedTime,
        })),
        count: data.data?.length || 0,
      };
    } catch (fallbackError) {
      console.warn('Failed to fetch contact tickets:', fallbackError);
      return { data: [], count: 0 };
    }
  }
}

/**
 * MCP Tool: Get open tickets count for an account
 */
export async function getAccountOpenTicketsCount(
  deskToken: string,
  accountId: string
): Promise<number> {
  const deskApiBase = '/zoho-desk-proxy';
  
  try {
    // Try MCP tool first
    const response = await mcpFetch<{ count: number; data?: any[] }>(
      '/tickets/count',
      'tools/call',
      {
        name: 'zoho_desk_get_tickets',
        arguments: {
          accountId,
          statusType: 'Open',
          limit: 1,
        },
      }
    );

    return response.count || response.data?.length || 0;
  } catch (error) {
    // Fallback to traditional API
    console.warn('MCP get tickets count failed, trying traditional API:', error);
    
    try {
      const response = await fetch(
        `${deskApiBase}/tickets?accountId=${accountId}&statusType=Open&limit=1`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${deskToken}`,
          },
        }
      );

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return data.count || data.data?.length || 0;
    } catch (fallbackError) {
      console.warn('Failed to fetch open tickets count:', fallbackError);
      return 0;
    }
  }
}

/**
 * MCP Tool: Create a new contact
 */
export async function createContact(
  token: string,
  contactData: Partial<CRMContact>
): Promise<CRMContact | null> {
  try {
    const response = await mcpFetch<{ data: CRMContact[] }>(
      '/Contacts',
      'tools/call',
      {
        name: 'zoho_crm_create_record',
        arguments: {
          module: 'Contacts',
          data: [contactData],
        },
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.warn('MCP create contact failed:', error);
    return null;
  }
}

/**
 * MCP Tool: Update an existing contact
 */
export async function updateContact(
  token: string,
  contactId: string,
  contactData: Partial<CRMContact>
): Promise<CRMContact | null> {
  try {
    const response = await mcpFetch<{ data: CRMContact[] }>(
      `/Contacts/${contactId}`,
      'tools/call',
      {
        name: 'zoho_crm_update_record',
        arguments: {
          module: 'Contacts',
          id: contactId,
          data: contactData,
        },
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.warn('MCP update contact failed:', error);
    return null;
  }
}

/**
 * List available MCP tools (for debugging/inspection)
 */
export async function listMCPTools(): Promise<string[]> {
  try {
    const response = await mcpFetch<{ tools: Array<{ name: string }> }>(
      '/tools',
      'tools/list'
    );
    return response.tools?.map(t => t.name) || [];
  } catch (error) {
    console.warn('Failed to list MCP tools:', error);
    return [];
  }
}

// Re-export types
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
