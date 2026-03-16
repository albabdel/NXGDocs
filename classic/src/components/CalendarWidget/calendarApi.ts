import type {
  Calendar,
  CalendarEvent,
  CalendarListResponse,
  EventsListResponse,
  EventResponse,
  CreateEventInput,
  UpdateEventInput,
} from './types';

const PROXY_BASE = '/zoho-calendar-proxy';
const MCP_ENDPOINT = 'https://calendar-20110877848.zohomcp.eu/mcp/message?key=fbf99eb19f7517bbf700100abf90387d';

let useProxy = true;
let requestId = 0;

/**
 * MCP tool names for Zoho Calendar
 */
const MCP_TOOLS = {
  LIST_CALENDARS: 'list_calendars',
  LIST_EVENTS: 'list_events',
  GET_EVENT: 'get_event',
  CREATE_EVENT: 'create_event',
  UPDATE_EVENT: 'update_event',
  DELETE_EVENT: 'delete_event',
} as const;

/**
 * MCP Request format
 */
interface MCPRequest {
  jsonrpc: '2.0';
  method: 'tools/call';
  params: {
    name: string;
    arguments: Record<string, unknown>;
  };
  id: number;
}

/**
 * MCP Response format
 */
interface MCPResponse<T> {
  jsonrpc: '2.0';
  result?: {
    content: Array<{
      type: 'text' | 'image' | 'resource';
      text?: string;
      data?: string;
      mimeType?: string;
    }>;
    isError?: boolean;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number;
}

/**
 * Parse MCP response content to extract the actual data
 */
function parseMCPResponse<T>(response: MCPResponse<T>): T {
  if (response.error) {
    throw new Error(`MCP Error ${response.error.code}: ${response.error.message}`);
  }

  if (!response.result) {
    throw new Error('MCP Response missing result');
  }

  if (response.result.isError) {
    const errorContent = response.result.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('\n');
    throw new Error(`MCP Tool Error: ${errorContent}`);
  }

  // Extract text content and parse as JSON
  const textContent = response.result.content
    .filter(c => c.type === 'text')
    .map(c => c.text)
    .join('\n');

  try {
    return JSON.parse(textContent);
  } catch {
    // If it's not JSON, return as-is (for void responses)
    return textContent as unknown as T;
  }
}

/**
 * Create an MCP request
 */
function createMCPRequest(toolName: string, args: Record<string, unknown>): MCPRequest {
  return {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args,
    },
    id: ++requestId,
  };
}

/**
 * Generic MCP API call helper
 */
async function mcpCall<T>(
  toolName: string,
  args: Record<string, unknown>,
  token: string
): Promise<T> {
  const mcpRequest = createMCPRequest(toolName, args);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const makeRequest = async (baseUrl: string): Promise<Response> => {
    return fetch(`${baseUrl}/message`, {
      method: 'POST',
      headers: {
        ...headers,
        // MCP servers often need the endpoint key in headers or query
        'X-MCP-Key': 'fbf99eb19f7517bbf700100abf90387d',
      },
      body: JSON.stringify(mcpRequest),
    });
  };

  let res: Response;

  if (useProxy) {
    // Use proxy - the proxy will handle the MCP endpoint
    res = await fetch(PROXY_BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...mcpRequest,
        _mcpEndpoint: MCP_ENDPOINT,
      }),
    });

    if (res.status === 404) {
      const text = await res.text().catch(() => '');
      if (text.includes('Page Not Found') || text.includes('Docusaurus')) {
        useProxy = false;
        console.warn('Proxy not available, falling back to direct MCP');
        // Direct MCP call
        res = await fetch(MCP_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify(mcpRequest),
        });
      }
    }
  } else {
    // Direct call to MCP endpoint
    res = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(mcpRequest),
    });
  }

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Zoho MCP API ${res.status}: ${err}`);
  }

  const mcpResponse: MCPResponse<T> = await res.json();
  return parseMCPResponse<T>(mcpResponse);
}

/**
 * List all calendars
 */
export async function listCalendars(token: string): Promise<CalendarListResponse> {
  return mcpCall<CalendarListResponse>(MCP_TOOLS.LIST_CALENDARS, {}, token);
}

/**
 * List events for a specific calendar within a date range
 */
export async function listEvents(
  token: string,
  calendarUid: string,
  start: string,
  end: string
): Promise<EventsListResponse> {
  return mcpCall<EventsListResponse>(MCP_TOOLS.LIST_EVENTS, {
    calendarUid,
    start,
    end,
    limit: 100,
  }, token);
}

/**
 * List all events across all calendars within a date range
 */
export async function listAllEvents(
  token: string,
  start: string,
  end: string
): Promise<EventsListResponse> {
  return mcpCall<EventsListResponse>(MCP_TOOLS.LIST_EVENTS, {
    start,
    end,
    limit: 200,
    allCalendars: true,
  }, token);
}

/**
 * Get a specific event
 */
export async function getEvent(
  token: string,
  calendarUid: string,
  eventId: string
): Promise<EventResponse> {
  return mcpCall<EventResponse>(MCP_TOOLS.GET_EVENT, {
    calendarUid,
    eventId,
  }, token);
}

/**
 * Create a new event
 */
export async function createEvent(
  token: string,
  data: CreateEventInput
): Promise<EventResponse> {
  return mcpCall<EventResponse>(MCP_TOOLS.CREATE_EVENT, {
    event: data,
  }, token);
}

/**
 * Update an existing event
 */
export async function updateEvent(
  token: string,
  calendarUid: string,
  eventId: string,
  data: UpdateEventInput
): Promise<EventResponse> {
  return mcpCall<EventResponse>(MCP_TOOLS.UPDATE_EVENT, {
    calendarUid,
    eventId,
    updates: data,
  }, token);
}

/**
 * Delete an event
 */
export async function deleteEvent(
  token: string,
  calendarUid: string,
  eventId: string
): Promise<void> {
  await mcpCall<void>(MCP_TOOLS.DELETE_EVENT, {
    calendarUid,
    eventId,
  }, token);
}

/**
 * Get today's events
 */
export async function getTodayEvents(token: string): Promise<CalendarEvent[]> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const response = await listAllEvents(
    token,
    start.toISOString(),
    end.toISOString()
  );
  return response.data ?? [];
}

/**
 * Get events for a date range
 */
export async function getEventsInRange(
  token: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const response = await listAllEvents(
    token,
    startDate.toISOString(),
    endDate.toISOString()
  );
  return response.data ?? [];
}

/**
 * Get the next upcoming event
 */
export async function getNextEvent(token: string): Promise<CalendarEvent | null> {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 7); // Look ahead 7 days

  const events = await getEventsInRange(token, now, end);
  const upcoming = events
    .filter(e => new Date(e.start) > now && e.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return upcoming[0] ?? null;
}

/**
 * Format event time for display
 */
export function formatEventTime(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = new Date(event.end);

  if (event.isAllDay) {
    return 'All Day';
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Calculate countdown to next event
 */
export function getCountdownToEvent(event: CalendarEvent): string {
  const now = new Date();
  const start = new Date(event.start);
  const diffMs = start.getTime() - now.getTime();

  if (diffMs < 0) return 'Started';

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  if (diffHours > 0) {
    return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
  if (diffMins > 0) {
    return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  }
  return 'Starting now';
}

/**
 * Get the color for an event based on calendar or default
 */
export function getEventColor(event: CalendarEvent, calendars: Calendar[]): string {
  const calendar = calendars.find(c => c.uid === event.calendarUid);
  return calendar?.color ?? '#22c55e';
}

/**
 * Export the MCP endpoint for proxy configuration
 */
export { MCP_ENDPOINT, PROXY_BASE };
