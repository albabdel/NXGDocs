/**
 * Cross-service linking utilities for Mail, Calendar, CRM, and Tickets
 * These helper functions enable workflows between different Zoho services
 */

import type { ZohoTicket } from '../ZohoTickets/types';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Email data structure from Zoho Mail API
 */
export interface ZohoEmail {
  id: string;
  subject: string;
  content: string;
  sender: {
    email: string;
    name: string;
  };
  receivedTime: string;
  summary?: string;
  hasAttachments: boolean;
  threadId?: string;
}

/**
 * Calendar event data structure from Zoho Calendar API
 */
export interface ZohoCalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  reminders: string[];
  attendees: { email: string; name: string }[];
}

/**
 * CRM contact data structure from Zoho CRM API
 */
export interface ZohoCRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accountId?: string;
  accountName?: string;
}

/**
 * Pre-populated ticket form data
 */
export interface TicketFormData {
  subject: string;
  description: string;
  email: string;
  contactName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  departmentId?: string;
}

/**
 * Cross-service link result
 */
export interface CrossServiceLinkResult {
  success: boolean;
  data?: unknown;
  error?: string;
  linkUrl?: string;
}

// ============================================================================
// API Configuration
// ============================================================================

const ZOHO_DESK_API_BASE = 'https://desk.zoho.com/api/v1';
const ZOHO_MAIL_API_BASE = 'https://mail.zoho.com/api/v1';
const ZOHO_CALENDAR_API_BASE = 'https://calendar.zoho.com/api/v1';
const ZOHO_CRM_API_BASE = 'https://www.zohoapis.com/crm/v2';

// ============================================================================
// Cross-Service Functions
// ============================================================================

/**
 * Creates a ticket from an email
 * Extracts subject, content, sender from email and pre-populates ticket creation form
 * 
 * @param email - The email to create a ticket from
 * @param token - Zoho Desk API token
 * @returns Pre-populated ticket form data for UI consumption
 */
export async function createTicketFromEmail(
  email: ZohoEmail,
  token: string
): Promise<TicketFormData> {
  // Extract relevant information from email
  const emailContent = email.content || email.summary || '';
  
  // Clean and format the description
  const description = formatEmailAsTicketDescription(email);
  
  // Determine priority based on email content (basic heuristics)
  const priority = determinePriorityFromContent(email.subject, emailContent);
  
  const ticketData: TicketFormData = {
    subject: `Email: ${email.subject}`,
    description,
    email: email.sender.email,
    contactName: email.sender.name,
    priority,
  };
  
  // Optionally create the ticket directly via API
  // This returns the form data so the UI can display a pre-populated form
  // or directly create if called with auto-create flag
  
  return ticketData;
}

/**
 * Creates a calendar event from a ticket
 * Title format: "Follow up: Ticket #12345"
 * Includes link to ticket in description
 * 
 * @param ticket - The ticket to create an event for
 * @param token - Zoho Calendar API token
 * @returns Created calendar event or error
 */
export async function createEventFromTicket(
  ticket: ZohoTicket,
  token: string
): Promise<CrossServiceLinkResult> {
  try {
    const eventTitle = `Follow up: Ticket #${ticket.ticketNumber}`;
    const eventDescription = formatTicketAsEventDescription(ticket);
    
    // Default to 1 hour from now for follow-up
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    const eventData = {
      title: eventTitle,
      description: eventDescription,
      starttime: startTime.toISOString(),
      endtime: endTime.toISOString(),
      isallday: false,
      reminders: ['15 minutes before'],
    };
    
    const response = await fetch(`${ZOHO_CALENDAR_API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create calendar event: ${response.status} ${errorText}`,
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      data: result,
      linkUrl: ticket.webUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error creating event',
    };
  }
}

/**
 * Finds emails for a CRM contact by searching mail by contact's email address
 * 
 * @param email - The contact's email address to search for
 * @param mailToken - Zoho Mail API token
 * @returns Array of emails involving this contact
 */
export async function getEmailsForContact(
  email: string,
  mailToken: string
): Promise<ZohoEmail[]> {
  try {
    // Search for emails from/to this contact
    const searchQuery = encodeURIComponent(`from:${email} OR to:${email}`);
    
    const response = await fetch(
      `${ZOHO_MAIL_API_BASE}/messages?search=${searchQuery}&limit=50`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${mailToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Failed to search emails:', response.status);
      return [];
    }
    
    const result = await response.json();
    
    // Transform the API response to our ZohoEmail format
    const emails: ZohoEmail[] = (result.data || result.messages || []).map(
      (msg: Record<string, unknown>) => ({
        id: msg.id as string,
        subject: msg.subject as string || '(No Subject)',
        content: msg.content as string || msg.preview as string || '',
        sender: {
          email: (msg.sender as Record<string, string>)?.email || (msg.from as Record<string, string>)?.email || '',
          name: (msg.sender as Record<string, string>)?.name || (msg.from as Record<string, string>)?.name || '',
        },
        receivedTime: msg.receivedTime as string || msg.date as string || new Date().toISOString(),
        hasAttachments: Boolean(msg.hasAttachments || msg.attachments),
        threadId: msg.threadId as string || msg.conversationId as string,
      })
    );
    
    return emails;
  } catch (error) {
    console.error('Error fetching emails for contact:', error);
    return [];
  }
}

/**
 * Gets all tickets for an account by filtering tickets by accountId from Desk API
 * 
 * @param accountId - The CRM account ID to filter tickets by
 * @param deskToken - Zoho Desk API token
 * @returns Array of tickets for the account
 */
export async function getTicketsForAccount(
  accountId: string,
  deskToken: string
): Promise<ZohoTicket[]> {
  try {
    // Fetch tickets filtered by account
    const response = await fetch(
      `${ZOHO_DESK_API_BASE}/tickets?accountId=${accountId}&limit=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${deskToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch tickets for account:', response.status);
      return [];
    }
    
    const result = await response.json();
    
    // Transform API response to ZohoTicket format
    const tickets: ZohoTicket[] = (result.data || []).map(
      (ticket: Record<string, unknown>) => ({
        id: ticket.id as string,
        ticketNumber: ticket.ticketNumber as string,
        subject: ticket.subject as string || '(No Subject)',
        description: ticket.description as string || '',
        status: ticket.status as string,
        statusType: ticket.statusType as string,
        priority: ticket.priority as ZohoTicket['priority'],
        createdTime: ticket.createdTime as string,
        modifiedTime: ticket.modifiedTime as string,
        closedTime: ticket.closedTime as string | null,
        contactId: ticket.contactId as string,
        accountId: ticket.accountId as string | null,
        departmentId: ticket.departmentId as string,
        email: ticket.email as string,
        commentCount: String(ticket.commentCount || 0),
        threadCount: String(ticket.threadCount || 0),
        webUrl: ticket.webUrl as string,
        channel: ticket.channel as string,
        isOverDue: Boolean(ticket.isOverDue),
        customFields: ticket.customFields as Record<string, string | null> || {},
        assigneeId: ticket.assigneeId as string | null | undefined,
        assignee: ticket.assignee as ZohoTicket['assignee'],
        contact: ticket.contact as ZohoTicket['contact'],
        account: ticket.account as ZohoTicket['account'],
      })
    );
    
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets for account:', error);
    return [];
  }
}

/**
 * Links a ticket to a CRM contact by updating ticket's contact association
 * 
 * @param ticketId - The ticket ID to update
 * @param contactId - The CRM contact ID to link
 * @param token - Zoho Desk API token
 * @returns Result of the linking operation
 */
export async function linkTicketToContact(
  ticketId: string,
  contactId: string,
  token: string
): Promise<CrossServiceLinkResult> {
  try {
    const updateData = {
      contactId: contactId,
    };
    
    const response = await fetch(
      `${ZOHO_DESK_API_BASE}/tickets/${ticketId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to link ticket to contact: ${response.status} ${errorText}`,
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error linking ticket',
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats email content as a ticket description
 */
function formatEmailAsTicketDescription(email: ZohoEmail): string {
  const lines: string[] = [];
  
  lines.push('--- Original Email ---');
  lines.push(`From: ${email.sender.name} <${email.sender.email}>`);
  lines.push(`Subject: ${email.subject}`);
  lines.push(`Date: ${new Date(email.receivedTime).toLocaleString()}`);
  lines.push('');
  lines.push('Content:');
  lines.push(email.content || email.summary || '(No content)');
  
  if (email.hasAttachments) {
    lines.push('');
    lines.push('[This email has attachments that may need to be reviewed]');
  }
  
  lines.push('--- End of Email ---');
  
  return lines.join('\n');
}

/**
 * Formats ticket information as a calendar event description
 */
function formatTicketAsEventDescription(ticket: ZohoTicket): string {
  const lines: string[] = [];
  
  lines.push(`Ticket: #${ticket.ticketNumber}`);
  lines.push(`Subject: ${ticket.subject}`);
  lines.push(`Status: ${ticket.status}`);
  lines.push(`Priority: ${ticket.priority}`);
  
  if (ticket.contact) {
    lines.push(`Contact: ${ticket.contact.firstName} ${ticket.contact.lastName} <${ticket.contact.email}>`);
  }
  
  if (ticket.account) {
    lines.push(`Account: ${ticket.account.accountName}`);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`View Ticket: ${ticket.webUrl}`);
  
  if (ticket.description) {
    lines.push('');
    lines.push('Description:');
    lines.push(ticket.description.substring(0, 500) + (ticket.description.length > 500 ? '...' : ''));
  }
  
  return lines.join('\n');
}

/**
 * Determines ticket priority based on email content analysis
 */
function determinePriorityFromContent(
  subject: string,
  content: string
): 'Low' | 'Medium' | 'High' | 'Critical' {
  const combinedText = `${subject} ${content}`.toLowerCase();
  
  // Critical indicators
  const criticalKeywords = [
    'urgent', 'emergency', 'critical', 'down', 'outage',
    'security breach', 'data loss', 'system down', 'not working at all',
  ];
  
  // High priority indicators
  const highKeywords = [
    'important', 'asap', 'immediately', 'high priority',
    'production issue', 'cannot access', 'broken', 'failed',
  ];
  
  // Low priority indicators
  const lowKeywords = [
    'minor', 'question', 'inquiry', 'when you have time',
    'low priority', 'f.y.i', 'fyi', 'just wondering',
  ];
  
  // Check for critical
  if (criticalKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'Critical';
  }
  
  // Check for high
  if (highKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'High';
  }
  
  // Check for low
  if (lowKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'Low';
  }
  
  // Default to medium
  return 'Medium';
}

/**
 * Creates a direct ticket from an email (bypassing form)
 * Use this for automated workflows where user confirmation is not needed
 */
export async function createTicketFromEmailDirect(
  email: ZohoEmail,
  token: string,
  departmentId: string
): Promise<CrossServiceLinkResult> {
  try {
    const formData = await createTicketFromEmail(email, token);
    
    const ticketPayload = {
      subject: formData.subject,
      description: formData.description,
      email: formData.email,
      priority: formData.priority,
      departmentId: departmentId,
      channel: 'Email',
    };
    
    const response = await fetch(`${ZOHO_DESK_API_BASE}/tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create ticket: ${response.status} ${errorText}`,
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      data: result,
      linkUrl: result.webUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error creating ticket',
    };
  }
}

/**
 * Gets a quick summary of all cross-service data for a contact
 */
export async function getContactCrossServiceSummary(
  contact: ZohoCRMContact,
  mailToken: string,
  deskToken: string
): Promise<{
  emails: ZohoEmail[];
  tickets: ZohoTicket[];
}> {
  const [emails, tickets] = await Promise.all([
    getEmailsForContact(contact.email, mailToken),
    contact.accountId 
      ? getTicketsForAccount(contact.accountId, deskToken)
      : Promise.resolve([]),
  ]);
  
  return { emails, tickets };
}
