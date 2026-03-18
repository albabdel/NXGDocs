import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

interface SystemStatus {
  sanity: { status: 'ok' | 'error'; latency?: number; error?: string };
  timestamp: string;
}

async function checkSanityConnection(env: Env): Promise<{ status: 'ok' | 'error'; latency?: number; error?: string }> {
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
    return { status: 'ok', latency: Date.now() - start };
  } catch (error) {
    return { status: 'error', latency: Date.now() - start, error: error instanceof Error ? error.message : 'Unknown error' };
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
    const [sanityStatus] = await Promise.all([
      checkSanityConnection(env),
    ]);

    const status: SystemStatus = {
      sanity: sanityStatus,
      timestamp: new Date().toISOString(),
    };

    const allOk = sanityStatus.status === 'ok';

    return new Response(JSON.stringify(status), {
      status: allOk ? 200 : 503,
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
