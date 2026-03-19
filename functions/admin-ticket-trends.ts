// functions/admin-ticket-trends.ts
// Ticket trends endpoint for admin dashboard - daily ticket counts for last 7 days

import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { getCachedToken, ZohoEnv } from './lib/zoho-session';

interface Env extends AdminEnv, ZohoEnv {}

interface TicketTrendsResponse {
  daily: number[];
  labels: string[];
}

interface ZohoTicketsResponse {
  data?: Array<{ id: string }>;
  count?: number;
}

const ZOHO_DESK_BASE = 'https://desk.zoho.eu/api/v1';

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  const session = await validateAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const accessToken = await getCachedToken(env);
    const orgId = env.ZOHO_ORG_ID;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCounts: number[] = [];
    const labels: string[] = [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const fetchPromises: Promise<number>[] = [];
    const dates: Date[] = [];

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      dates.push(dayStart);
      labels.push(dayNames[dayStart.getDay()]);

      const fromDate = dayStart.toISOString();
      const toDate = dayEnd.toISOString();

      const fetchPromise = fetchTicketCountForDay(accessToken, orgId, fromDate, toDate);
      fetchPromises.push(fetchPromise);
    }

    const results = await Promise.all(fetchPromises);
    dailyCounts.push(...results);

    const response: TicketTrendsResponse = {
      daily: dailyCounts,
      labels,
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-ticket-trends] Error:', error);
    const emptyResponse: TicketTrendsResponse = {
      daily: [0, 0, 0, 0, 0, 0, 0],
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    };
    return new Response(JSON.stringify(emptyResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function fetchTicketCountForDay(
  accessToken: string,
  orgId: string,
  fromDate: string,
  toDate: string,
): Promise<number> {
  const searchCriteria = `createdTime:${fromDate},${toDate}`;

  const url = `${ZOHO_DESK_BASE}/tickets?searchCriteria=${encodeURIComponent(searchCriteria)}&limit=1`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId,
    },
  });

  if (!response.ok) {
    console.error(`[admin-ticket-trends] Zoho API error: ${response.status}`);
    return 0;
  }

  const data = (await response.json()) as ZohoTicketsResponse;

  if (data.count !== undefined) {
    return data.count;
  }

  if (data.data && Array.isArray(data.data)) {
    return data.data.length;
  }

  return 0;
}
