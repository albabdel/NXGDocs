import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { getAuditLogs, AuditAction, ResourceType } from './lib/audit-service';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
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
    const url = new URL(request.url);

    const action = url.searchParams.get('action') as AuditAction | null;
    const actorId = url.searchParams.get('actorId');
    const resourceType = url.searchParams.get('resourceType') as ResourceType | null;
    const resourceId = url.searchParams.get('resourceId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const result = await getAuditLogs(env, {
      action: action || undefined,
      actorId: actorId || undefined,
      resourceType: resourceType || undefined,
      resourceId: resourceId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit,
      offset,
    });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[admin-audit-logs] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch audit logs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
