import { validateAdminSession, AdminEnv } from './lib/admin-session';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from './lib/notification-service';

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

  if (request.method === 'GET') {
    return handleGetNotifications(request, env, session.userId);
  }

  if (request.method === 'POST') {
    return handlePostAction(request, env, session.userId);
  }

  if (request.method === 'DELETE') {
    return handleDeleteNotification(request, env, session.userId);
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleGetNotifications(
  request: Request,
  env: Env,
  userId: string
): Promise<Response> {
  const url = new URL(request.url);

  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

  try {
    const result = await getNotifications(env, userId, { limit, offset, unreadOnly });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Notifications] GET error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handlePostAction(
  request: Request,
  env: Env,
  userId: string
): Promise<Response> {
  try {
    const body = await request.json();
    const { action, notificationId } = body as { action: string; notificationId?: string };

    switch (action) {
      case 'markRead': {
        if (!notificationId) {
          return new Response(JSON.stringify({ error: 'notificationId required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const success = await markNotificationAsRead(env, notificationId);
        return new Response(JSON.stringify({ success }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'markAllRead': {
        const count = await markAllNotificationsAsRead(env, userId);
        return new Response(JSON.stringify({ success: true, count }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[Notifications] POST error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process action' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleDeleteNotification(
  request: Request,
  env: Env,
  userId: string
): Promise<Response> {
  const url = new URL(request.url);
  const notificationId = url.searchParams.get('id');

  if (!notificationId) {
    return new Response(JSON.stringify({ error: 'Notification ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const success = await deleteNotification(env, notificationId);
    return new Response(JSON.stringify({ success }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Notifications] DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
