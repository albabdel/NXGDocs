// functions/admin-content-action.ts
// POST endpoint for approve/reject/publish actions

import { createClient } from '@sanity/client';
import { validateAdminSession, AdminSession } from './lib/admin-session.js';
import { logAuditEvent, AuditAction } from './lib/audit-service.js';

type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
type ContentSource = 'sanity' | 'confluence';
type ContentType = 'doc' | 'article' | 'release' | 'roadmapItem' | 'landingPage';

type WorkflowAction = 'approve' | 'reject' | 'publish' | 'archive' | 'request_changes' | 'submit_for_review';

interface ActionRequest {
  action: WorkflowAction;
  contentId: string;
  contentType: ContentType;
  notes?: string;
}

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
  ZOHO_SESSION_SECRET: string;
}

function getSanityClient(env: Env) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

const ACTION_TO_STATUS: Record<WorkflowAction, WorkflowStatus> = {
  submit_for_review: 'pending_review',
  approve: 'approved',
  reject: 'rejected',
  publish: 'published',
  archive: 'archived',
  request_changes: 'draft',
};

const ACTION_TO_AUDIT: Record<WorkflowAction, AuditAction> = {
  submit_for_review: 'content.update',
  approve: 'content.approve',
  reject: 'content.reject',
  publish: 'content.publish',
  archive: 'content.update',
  request_changes: 'content.update',
};

async function getAdminUserId(env: Env, zohoId: string): Promise<string | null> {
  const client = getSanityClient(env);
  const admin = await client.fetch(
    `*[_type == "adminUser" && zohoId == $zohoId][0]._id`,
    { zohoId }
  );
  return admin || null;
}

async function updateWorkflowConfig(
  env: Env,
  contentId: string,
  action: WorkflowAction,
  session: AdminSession,
  notes?: string
): Promise<{ success: boolean; error?: string; title?: string }> {
  const client = getSanityClient(env);
  const now = new Date().toISOString();
  const newStatus = ACTION_TO_STATUS[action];

  const adminUserId = await getAdminUserId(env, session.userId);
  if (!adminUserId) {
    return { success: false, error: 'Admin user not found in database' };
  }

  try {
    const existing = await client.fetch(
      `*[_id == $id][0]{
        title,
        workflowConfig
      }`,
      { id: contentId }
    );

    if (!existing) {
      return { success: false, error: 'Content not found' };
    }

    const reviewEntry = {
      action,
      by: { _type: 'reference', _ref: adminUserId },
      at: now,
      notes: notes || undefined,
    };

    const existingHistory = existing.workflowConfig?.reviewHistory || [];

    const updates: Record<string, unknown> = {
      'workflowConfig.workflowStatus': newStatus,
      'workflowConfig.reviewHistory': [...existingHistory, reviewEntry],
    };

    if (action === 'submit_for_review') {
      updates['workflowConfig.submittedAt'] = now;
      updates['workflowConfig.submittedBy'] = { _type: 'reference', _ref: adminUserId };
    }

    if (action === 'approve' || action === 'reject' || action === 'request_changes') {
      updates['workflowConfig.reviewedAt'] = now;
      updates['workflowConfig.reviewedBy'] = { _type: 'reference', _ref: adminUserId };
      if (notes) {
        updates['workflowConfig.reviewNotes'] = notes;
      }
    }

    if (action === 'publish') {
      updates['workflowConfig.publishedAt'] = now;
      updates['workflowConfig.publishedBy'] = { _type: 'reference', _ref: adminUserId };
    }

    await client.patch(contentId).set(updates).commit();

    return { success: true, title: existing.title };
  } catch (error) {
    console.error('[admin-content-action] Update error:', error);
    return { success: false, error: 'Failed to update content' };
  }
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await validateAdminSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: ActionRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { action, contentId, contentType, notes } = body;

  if (!action || !contentId || !contentType) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: action, contentId, contentType' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const validActions: WorkflowAction[] = [
    'submit_for_review',
    'approve',
    'reject',
    'publish',
    'archive',
    'request_changes',
  ];

  if (!validActions.includes(action)) {
    return new Response(
      JSON.stringify({ error: `Invalid action. Valid actions: ${validActions.join(', ')}` }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const validTypes: ContentType[] = ['doc', 'article', 'release', 'roadmapItem', 'landingPage'];
  if (!validTypes.includes(contentType)) {
    return new Response(
      JSON.stringify({ error: `Invalid contentType. Valid types: ${validTypes.join(', ')}` }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const result = await updateWorkflowConfig(env, contentId, action, session, notes);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error || 'Failed to update workflow' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  await logAuditEvent(env, {
    action: ACTION_TO_AUDIT[action],
    actorId: session.userId,
    actorEmail: session.email,
    resourceType: contentType,
    resourceId: contentId,
    resourceTitle: result.title,
    changes: {
      after: JSON.stringify({ action, newStatus: ACTION_TO_STATUS[action], notes }),
    },
    metadata: {
      source: 'admin-content-action',
    },
  }).catch(err => console.error('[admin-content-action] Audit log failed:', err));

  return new Response(
    JSON.stringify({
      success: true,
      action,
      contentId,
      newStatus: ACTION_TO_STATUS[action],
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
