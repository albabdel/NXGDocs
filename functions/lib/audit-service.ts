// functions/lib/audit-service.ts
// Audit logging service for admin actions

import { createClient } from '@sanity/client';

export type AuditAction =
  | 'content.create'
  | 'content.update'
  | 'content.delete'
  | 'content.publish'
  | 'content.approve'
  | 'content.reject'
  | 'route.create'
  | 'route.update'
  | 'route.delete'
  | 'user.login'
  | 'user.logout'
  | 'settings.update';

export type ResourceType = 'doc' | 'article' | 'release' | 'roadmapItem' | 'routeConfig' | 'adminUser';

interface AuditLogEntry {
  action: AuditAction;
  actorId: string;
  actorEmail: string;
  resourceType?: ResourceType;
  resourceId?: string;
  resourceTitle?: string;
  changes?: {
    before?: string;
    after?: string;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    source?: string;
  };
}

interface AuditEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

function getSanityClient(env: AuditEnv) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

export async function logAuditEvent(env: AuditEnv, entry: AuditLogEntry): Promise<void> {
  const client = getSanityClient(env);

  try {
    const adminUser = await client.fetch(
      `*[_type == "adminUser" && zohoId == $zohoId][0]._id`,
      { zohoId: entry.actorId }
    );

    if (!adminUser) {
      console.error(`[AuditService] Admin user not found for zohoId: ${entry.actorId}`);
      return;
    }

    await client.create({
      _type: 'auditLog',
      action: entry.action,
      actor: { _type: 'reference', _ref: adminUser },
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      resourceTitle: entry.resourceTitle,
      changes: entry.changes,
      metadata: entry.metadata,
      timestamp: new Date().toISOString(),
    });
    console.log(`[AuditService] Logged: ${entry.action} by ${entry.actorEmail}`);
  } catch (error) {
    console.error('[AuditService] Failed to log audit event:', error);
  }
}

export interface AuditLogResult {
  _id: string;
  action: AuditAction;
  actor: { name: string; email: string };
  resourceType?: ResourceType;
  resourceId?: string;
  resourceTitle?: string;
  timestamp: string;
  changes?: { before?: string; after?: string };
}

export interface AuditLogsResponse {
  logs: AuditLogResult[];
  total: number;
  hasMore: boolean;
}

export async function getAuditLogs(
  env: AuditEnv,
  options: {
    action?: AuditAction;
    actorId?: string;
    resourceType?: ResourceType;
    resourceId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<AuditLogsResponse> {
  const client = getSanityClient(env);

  const filters: string[] = [];
  const params: Record<string, unknown> = {};

  if (options.action) {
    filters.push(`action == $action`);
    params.action = options.action;
  }
  if (options.actorId) {
    filters.push(`actor->zohoId == $actorId`);
    params.actorId = options.actorId;
  }
  if (options.resourceType) {
    filters.push(`resourceType == $resourceType`);
    params.resourceType = options.resourceType;
  }
  if (options.resourceId) {
    filters.push(`resourceId == $resourceId`);
    params.resourceId = options.resourceId;
  }
  if (options.startDate) {
    filters.push(`timestamp >= $startDate`);
    params.startDate = options.startDate;
  }
  if (options.endDate) {
    filters.push(`timestamp <= $endDate`);
    params.endDate = options.endDate;
  }

  const filterStr = filters.length > 0 ? ` && ${filters.join(' && ')}` : '';
  const limit = options.limit || 50;
  const offset = options.offset || 0;

  const countQuery = `count(*[_type == "auditLog"${filterStr}])`;
  const total = await client.fetch(countQuery, params);

  const query = `
    *[_type == "auditLog"${filterStr}] | order(timestamp desc) [${offset}...${offset + limit}] {
      _id,
      action,
      actor->{ name, email },
      resourceType,
      resourceId,
      resourceTitle,
      timestamp,
      changes,
    }
  `;

  const logs = await client.fetch(query, params);

  return {
    logs,
    total,
    hasMore: offset + limit < total,
  };
}
