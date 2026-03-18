import { validateAdminSession, AdminEnv } from './lib/admin-session';
import { createClient } from '@sanity/client';

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
    const client = createClient({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_API_TOKEN,
      apiVersion: '2024-01-01',
      useCdn: false,
    });

    const now = Date.now();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const users = await client.fetch(
    `*[_type == "adminUser"] | order(name asc) {
      _id,
      name,
      email,
      role,
      lastLoginAt,
      loginCount,
      isActive,
      createdAt,
      zohoId
    }`
  );

  const auditLogs = await client.fetch(
    `*[_type == "auditLog" && timestamp >= $oneWeekAgo] | order(timestamp desc) {
      _id,
      action,
      actor->{_id, name, email},
      resourceType,
      resourceId,
      resourceTitle,
      timestamp
    }`,
    { oneWeekAgo }
  );

  const userActivityMap = new Map<string, {
    lastAction: string | null;
    lastActionTime: string | null;
    actionsToday: number;
    actionsThisWeek: number;
  }>();

  for (const log of auditLogs) {
    if (!log.actor?._id) continue;
    const userId = log.actor._id;
    const logTime = new Date(log.timestamp);
    
    if (!userActivityMap.has(userId)) {
      userActivityMap.set(userId, {
        lastAction: null,
        lastActionTime: null,
        actionsToday: 0,
        actionsThisWeek: 0,
      });
    }

    const activity = userActivityMap.get(userId)!;
    
    if (!activity.lastActionTime || logTime > new Date(activity.lastActionTime)) {
      activity.lastAction = log.action;
      activity.lastActionTime = log.timestamp;
    }
    
    activity.actionsThisWeek++;
    
    if (log.timestamp >= oneDayAgo) {
      activity.actionsToday++;
    }
  }

  const usersWithActivity = users.map((u: any) => {
    const activity = userActivityMap.get(u._id) || {
      lastAction: null,
      lastActionTime: null,
      actionsToday: 0,
      actionsThisWeek: 0,
    };
    
    return {
      ...u,
      lastAction: activity.lastAction,
      lastActionTime: activity.lastActionTime,
      actionsToday: activity.actionsToday,
      actionsThisWeek: activity.actionsThisWeek,
    };
  });

  const totalUsers = users.length;
  const activeToday = users.filter((u: { lastLoginAt: string | null }) => 
    u.lastLoginAt && new Date(u.lastLoginAt) >= new Date(oneDayAgo)
  ).length;
  const activeThisWeek = users.filter((u: { lastLoginAt: string | null }) => 
    u.lastLoginAt && new Date(u.lastLoginAt) >= new Date(sevenDaysAgo)
  ).length;
  const adminCount = users.filter((u: { role: string }) => u.role === 'admin').length;
  const editorCount = users.filter((u: { role: string }) => u.role === 'editor').length;
  const reviewerCount = users.filter((u: { role: string }) => u.role === 'reviewer').length;
  const activeStatusCount = users.filter((u: { isActive: boolean }) => u.isActive !== false).length;
  const inactiveCount = users.filter((u: { isActive: boolean }) => u.isActive === false).length;

  return new Response(JSON.stringify({
    users: usersWithActivity,
    stats: {
      totalUsers,
      activeToday,
      activeThisWeek,
      adminCount,
      editorCount,
      reviewerCount,
      activeStatusCount,
      inactiveCount,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  } catch (error) {
    console.error('[admin-users] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
