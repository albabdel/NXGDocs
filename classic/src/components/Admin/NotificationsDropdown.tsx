import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Check, FileText, CheckCircle, XCircle, Ticket, AlertTriangle, User, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export type NotificationType =
  | 'content.submitted'
  | 'content.approved'
  | 'content.rejected'
  | 'ticket.assigned'
  | 'ticket.status_changed'
  | 'system.alert'
  | 'user.new_device_login';

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

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
}

function getNotificationIcon(type: NotificationType): React.ReactNode {
  switch (type) {
    case 'content.submitted':
      return <FileText className="w-4 h-4" style={{ color: '#E8B058' }} />;
    case 'content.approved':
      return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />;
    case 'content.rejected':
      return <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />;
    case 'ticket.assigned':
    case 'ticket.status_changed':
      return <Ticket className="w-4 h-4" style={{ color: '#3b82f6' }} />;
    case 'system.alert':
      return <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />;
    case 'user.new_device_login':
      return <User className="w-4 h-4" style={{ color: '#8b5cf6' }} />;
    default:
      return <Bell className="w-4 h-4" style={{ color: '#6b7280' }} />;
  }
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export function NotificationsDropdown() {
  const { user } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(async (offset = 0) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
      });
      const response = await fetch(`/admin-notifications?${params}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data: NotificationsResponse = await response.json();
        if (offset === 0) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }
        setUnreadCount(data.unreadCount);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('[Notifications] Fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch('/admin-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'markRead', notificationId }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('[Notifications] Mark read failed:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/admin-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('[Notifications] Mark all read failed:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      pollingRef.current = setInterval(() => fetchNotifications(), 30000);
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [user, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const timer = setTimeout(() => markAllAsRead(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:opacity-80"
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          cursor: 'pointer',
        }}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold rounded-full"
            style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '10px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl overflow-hidden shadow-lg"
          style={{
            background: isDark ? 'rgba(17, 17, 17, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}
          >
            <span className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Notifications
              {unreadCount > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded"
                  style={{ background: 'rgba(232, 176, 88, 0.15)', color: '#E8B058' }}
                >
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs font-medium transition-all hover:opacity-80"
                style={{ color: '#E8B058', cursor: 'pointer' }}
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin"
                  style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-8 h-8 mb-2" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.5 }} />
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  No notifications
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                  className="flex items-start gap-3 px-4 py-3 transition-all cursor-pointer hover:opacity-90"
                  style={{
                    background: notification.read
                      ? 'transparent'
                      : isDark
                        ? 'rgba(232, 176, 88, 0.05)'
                        : 'rgba(232, 176, 88, 0.08)',
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--ifm-color-content)' }}
                    >
                      {notification.title}
                    </p>
                    <p
                      className="text-xs mt-0.5 line-clamp-2"
                      style={{ color: 'var(--ifm-color-content-secondary)' }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.7 }}
                    >
                      {formatRelativeTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div
                      className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full"
                      style={{ background: '#E8B058' }}
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div
              className="px-4 py-3 text-center"
              style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}
            >
              <button
                onClick={() => fetchNotifications(notifications.length)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-xs font-medium transition-all hover:opacity-80"
                style={{ color: '#E8B058', cursor: isLoading ? 'wait' : 'pointer' }}
              >
                <ExternalLink className="w-3 h-3" />
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
