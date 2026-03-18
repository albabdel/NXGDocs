import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';
import { logAuditEvent } from './lib/audit-service';

interface Env extends AdminEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

interface UpdateRequest {
  userId: string;
  action: 'update_role' | 'activate' | 'deactivate' | 'reset_session';
  role?: 'admin' | 'editor' | 'reviewer';
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

  const client = createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  try {
    const body: UpdateRequest = await request.json();
    const { userId, action, role } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingUser = await client.fetch(
      `*[_type == "adminUser" && _id == $userId][0]{ _id, name, email, role, isActive }`,
      { userId }
    );

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let updateFields: Record<string, unknown> = {};
    let auditAction: string = '';
    let changes: { before?: string; after?: string } = {};

    switch (action) {
      case 'update_role':
        if (!role || !['admin', 'editor', 'reviewer'].includes(role)) {
          return new Response(JSON.stringify({ error: 'Invalid role' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        updateFields = { role };
        auditAction = 'user.role_update';
        changes = { before: existingUser.role, after: role };
        break;

      case 'activate':
        updateFields = { isActive: true };
        auditAction = 'user.activate';
        changes = { before: 'inactive', after: 'active' };
        break;

      case 'deactivate':
        updateFields = { isActive: false };
        auditAction = 'user.deactivate';
        changes = { before: 'active', after: 'inactive' };
        break;

      case 'reset_session':
        updateFields = { 
          sessionToken: null, 
          sessionExpiresAt: null,
          lastLoginAt: null,
        };
        auditAction = 'user.session_reset';
        changes = { before: 'active_session', after: 'session_cleared' };
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    await client
      .patch(userId)
      .set(updateFields)
      .commit();

    await logAuditEvent(env, {
      action: auditAction as any,
      actorId: session.zohoId,
      actorEmail: session.email,
      resourceType: 'adminUser',
      resourceId: userId,
      resourceTitle: existingUser.name || existingUser.email,
      changes,
    });

    return new Response(JSON.stringify({
      success: true,
      message: `User ${action} completed successfully`,
      user: { ...existingUser, ...updateFields },
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[AdminUserAction] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update user',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
