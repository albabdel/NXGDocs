import { createClient } from '@sanity/client';

export type NotificationType =
  | 'content.submitted'
  | 'content.approved'
  | 'content.rejected'
  | 'ticket.assigned'
  | 'ticket.status_changed'
  | 'system.alert'
  | 'user.new_device_login';

export interface NotificationInput {
  type: NotificationType;
  recipientId: string;
  title: string;
  message: string;
  resourceType?: string;
  resourceId?: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: {
    ticketId?: string;
    ticketStatus?: string;
    contentTitle?: string;
    deviceName?: string;
    location?: string;
    ipAddress?: string;
    alertLevel?: string;
  };
}

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  resourceType?: string;
  resourceId?: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

interface NotificationEnv {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;
}

function getSanityClient(env: NotificationEnv) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

export async function createNotification(
  env: NotificationEnv,
  input: NotificationInput
): Promise<string> {
  const client = getSanityClient(env);

  const adminUser = await client.fetch(
    `*[_type == "adminUser" && zohoId == $zohoId][0]._id`,
    { zohoId: input.recipientId }
  );

  if (!adminUser) {
    throw new Error(`Admin user not found for zohoId: ${input.recipientId}`);
  }

  const doc = await client.create({
    _type: 'notification',
    type: input.type,
    recipient: { _type: 'reference', _ref: adminUser },
    title: input.title,
    message: input.message,
    read: false,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    priority: input.priority || 'medium',
    metadata: input.metadata,
    timestamp: new Date().toISOString(),
  });

  console.log(`[NotificationService] Created notification: ${doc._id}`);
  return doc._id;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
}

export async function getNotifications(
  env: NotificationEnv,
  recipientId: string,
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  } = {}
): Promise<NotificationsResponse> {
  const client = getSanityClient(env);

  const limit = options.limit || 20;
  const offset = options.offset || 0;

  const unreadFilter = options.unreadOnly ? ' && read == false' : '';

  const countQuery = `count(*[_type == "notification" && recipient->zohoId == $recipientId${unreadFilter}])`;
  const total = await client.fetch(countQuery, { recipientId });

  const unreadCountQuery = `count(*[_type == "notification" && recipient->zohoId == $recipientId && read == false])`;
  const unreadCount = await client.fetch(unreadCountQuery, { recipientId });

  const query = `
    *[_type == "notification" && recipient->zohoId == $recipientId${unreadFilter}] | order(timestamp desc) [${offset}...${offset + limit}] {
      _id,
      type,
      title,
      message,
      read,
      timestamp,
      resourceType,
      resourceId,
      priority,
      metadata,
    }
  `;

  const notifications = await client.fetch(query, { recipientId });

  return {
    notifications,
    unreadCount,
    total,
    hasMore: offset + limit < total,
  };
}

export async function markNotificationAsRead(
  env: NotificationEnv,
  notificationId: string
): Promise<boolean> {
  const client = getSanityClient(env);

  try {
    await client
      .patch(notificationId)
      .set({ read: true, readAt: new Date().toISOString() })
      .commit();
    return true;
  } catch (error) {
    console.error('[NotificationService] Failed to mark as read:', error);
    return false;
  }
}

export async function markAllNotificationsAsRead(
  env: NotificationEnv,
  recipientId: string
): Promise<number> {
  const client = getSanityClient(env);

  const query = `
    *[_type == "notification" && recipient->zohoId == $recipientId && read == false]._id
  `;
  const unreadIds = await client.fetch(query, { recipientId });

  if (unreadIds.length === 0) return 0;

  const now = new Date().toISOString();
  await Promise.all(
    unreadIds.map((id: string) =>
      client.patch(id).set({ read: true, readAt: now }).commit()
    )
  );

  return unreadIds.length;
}

export async function deleteNotification(
  env: NotificationEnv,
  notificationId: string
): Promise<boolean> {
  const client = getSanityClient(env);

  try {
    await client.delete(notificationId);
    return true;
  } catch (error) {
    console.error('[NotificationService] Failed to delete:', error);
    return false;
  }
}

export async function createContentSubmittedNotification(
  env: NotificationEnv,
  recipientId: string,
  contentTitle: string,
  contentId: string,
  contentType: string
): Promise<string> {
  return createNotification(env, {
    type: 'content.submitted',
    recipientId,
    title: 'Content submitted for review',
    message: `Content "${contentTitle}" has been submitted and needs your review.`,
    resourceType: contentType,
    resourceId: contentId,
    priority: 'medium',
    metadata: { contentTitle },
  });
}

export async function createContentApprovedNotification(
  env: NotificationEnv,
  recipientId: string,
  contentTitle: string,
  contentId: string,
  contentType: string
): Promise<string> {
  return createNotification(env, {
    type: 'content.approved',
    recipientId,
    title: 'Content approved',
    message: `Your content "${contentTitle}" has been approved and published.`,
    resourceType: contentType,
    resourceId: contentId,
    priority: 'low',
    metadata: { contentTitle },
  });
}

export async function createContentRejectedNotification(
  env: NotificationEnv,
  recipientId: string,
  contentTitle: string,
  contentId: string,
  contentType: string,
  reason?: string
): Promise<string> {
  return createNotification(env, {
    type: 'content.rejected',
    recipientId,
    title: 'Content rejected',
    message: reason
      ? `Your content "${contentTitle}" was rejected. Reason: ${reason}`
      : `Your content "${contentTitle}" was rejected. Please review and resubmit.`,
    resourceType: contentType,
    resourceId: contentId,
    priority: 'medium',
    metadata: { contentTitle },
  });
}

export async function createTicketAssignedNotification(
  env: NotificationEnv,
  recipientId: string,
  ticketId: string,
  ticketSubject: string
): Promise<string> {
  return createNotification(env, {
    type: 'ticket.assigned',
    recipientId,
    title: 'New ticket assigned',
    message: `Ticket #${ticketId}: "${ticketSubject}" has been assigned to you.`,
    resourceType: 'ticket',
    resourceId: ticketId,
    priority: 'high',
    metadata: { ticketId },
  });
}

export async function createTicketStatusChangedNotification(
  env: NotificationEnv,
  recipientId: string,
  ticketId: string,
  ticketSubject: string,
  newStatus: string
): Promise<string> {
  return createNotification(env, {
    type: 'ticket.status_changed',
    recipientId,
    title: 'Ticket status updated',
    message: `Ticket #${ticketId}: "${ticketSubject}" status changed to ${newStatus}.`,
    resourceType: 'ticket',
    resourceId: ticketId,
    priority: 'medium',
    metadata: { ticketId, ticketStatus: newStatus },
  });
}

export async function createSystemAlertNotification(
  env: NotificationEnv,
  recipientId: string,
  title: string,
  message: string,
  alertLevel: 'info' | 'warning' | 'critical' = 'warning'
): Promise<string> {
  return createNotification(env, {
    type: 'system.alert',
    recipientId,
    title,
    message,
    priority: alertLevel === 'critical' ? 'high' : alertLevel === 'warning' ? 'medium' : 'low',
    metadata: { alertLevel },
  });
}

export async function createNewDeviceLoginNotification(
  env: NotificationEnv,
  recipientId: string,
  deviceName: string,
  location: string,
  ipAddress: string
): Promise<string> {
  return createNotification(env, {
    type: 'user.new_device_login',
    recipientId,
    title: 'New device login detected',
    message: `Login from ${deviceName} in ${location}. If this wasn't you, please secure your account.`,
    priority: 'medium',
    metadata: { deviceName, location, ipAddress },
  });
}
