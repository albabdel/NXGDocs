import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { checkConfluenceConnectivity, ConfluenceEnv } from './lib/confluence-service';
import { createClient } from '@sanity/client';

interface Env extends AdminEnv, ConfluenceEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
  ZOHO_REFRESH_TOKEN?: string;
  ZOHO_CLIENT_ID?: string;
  ZOHO_CLIENT_SECRET?: string;
  ZOHO_ORG_ID?: string;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  lastChecked: string;
  message?: string;
}

async function checkSanityConnection(env: Env): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const client = createClient({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_API_TOKEN,
      apiVersion: '2024-01-01',
      useCdn: false,
    });

    await client.fetch(`count(*)`);
    return {
      name: 'Sanity CMS',
      status: 'operational',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: 'Sanity CMS',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

async function checkZohoConnection(env: Env): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    if (!env.ZOHO_REFRESH_TOKEN || !env.ZOHO_CLIENT_ID || !env.ZOHO_CLIENT_SECRET) {
      return {
        name: 'Zoho Desk',
        status: 'degraded',
        responseTime: 0,
        lastChecked: new Date().toISOString(),
        message: 'Credentials not configured',
      };
    }

    const tokenRes = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: env.ZOHO_REFRESH_TOKEN,
        client_id: env.ZOHO_CLIENT_ID,
        client_secret: env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenRes.ok) {
      return {
        name: 'Zoho Desk',
        status: 'down',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: 'Failed to authenticate',
      };
    }

    const tokenData = await tokenRes.json() as { access_token?: string };
    if (!tokenData.access_token) {
      return {
        name: 'Zoho Desk',
        status: 'down',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        message: 'No access token received',
      };
    }

    const testRes = await fetch(`https://desk.zoho.eu/api/v1/tickets?limit=1`, {
      headers: { 'Authorization': `Zoho-oauthtoken ${tokenData.access_token}` },
    });

    return {
      name: 'Zoho Desk',
      status: testRes.ok ? 'operational' : 'degraded',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: testRes.ok ? undefined : `API returned ${testRes.status}`,
    };
  } catch (error) {
    return {
      name: 'Zoho Desk',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

async function checkConfluenceConnection(env: Env): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const result = await checkConfluenceConnectivity(env);

    if (!result.connected) {
      return {
        name: 'Confluence',
        status: result.message?.includes('not configured') ? 'degraded' : 'down',
        responseTime: result.responseTime,
        lastChecked: new Date().toISOString(),
        message: result.message,
      };
    }

    return {
      name: 'Confluence',
      status: 'operational',
      responseTime: result.responseTime,
      lastChecked: new Date().toISOString(),
      message: result.spaceName ? `Connected to "${result.spaceName}"` : undefined,
    };
  } catch (error) {
    return {
      name: 'Confluence',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

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
    const [sanityStatus, zohoStatus, confluenceStatus] = await Promise.all([
      checkSanityConnection(env),
      checkZohoConnection(env),
      checkConfluenceConnection(env),
    ]);

    const services = [sanityStatus, zohoStatus, confluenceStatus];
    const allOperational = services.every(s => s.status === 'operational');
    const anyDown = services.some(s => s.status === 'down');

    return new Response(JSON.stringify({
      services,
      overallStatus: allOperational ? 'operational' : (anyDown ? 'down' : 'degraded'),
      lastChecked: new Date().toISOString(),
    }), {
      status: allOperational ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-system-status] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to check system status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
