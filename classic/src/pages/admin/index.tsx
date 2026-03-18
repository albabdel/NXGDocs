import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { QuickActions } from '../../components/Admin/QuickActions';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LogOut,
  LayoutDashboard,
  FileStack,
  Route,
  BarChart3,
  Ticket,
  Users,
  FileText,
  Settings,
  Loader,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileCheck,
  Plus,
  Zap,
  Activity,
  Server,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
} from 'lucide-react';

interface DashboardStats {
  pendingContent: number;
  publishedContent: number;
  totalUsers: number;
  activeUsers: number;
}

interface AuditLogEntry {
  _id: string;
  action: string;
  actor: { name: string; email: string };
  resourceType?: string;
  resourceId?: string;
  resourceTitle?: string;
  timestamp: string;
}

interface TicketStats {
  open: number;
  pending: number;
  closed: number;
  onHold: number;
}

function AdminDashboardContent() {
  const { user, logout, isLoading } = useAdminAuth();
  const [isDark, setIsDark] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditLogEntry[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({ open: 0, pending: 0, closed: 0, onHold: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setDataLoading(true);
        setError(null);

        const [dashboardRes, auditRes] = await Promise.all([
          fetch('/admin-dashboard', { credentials: 'include' }),
          fetch('/admin-audit-logs?limit=10', { credentials: 'include' }),
        ]);

        if (!dashboardRes.ok || !auditRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData = await dashboardRes.json();
        const auditData = await auditRes.json();

        setDashboardStats(dashboardData.stats);
        setRecentActivity(auditData.logs || []);

        try {
          const [openTickets, pendingTickets, closedTickets, onHoldTickets] = await Promise.all([
            fetch('/zoho-proxy/tickets?status=open&limit=1', { credentials: 'include' }).then(r => r.json()),
            fetch('/zoho-proxy/tickets?status=pending&limit=1', { credentials: 'include' }).then(r => r.json()),
            fetch('/zoho-proxy/tickets?status=closed&limit=1', { credentials: 'include' }).then(r => r.json()),
            fetch('/zoho-proxy/tickets?status=onHold&limit=1', { credentials: 'include' }).then(r => r.json()),
          ]);

          setTicketStats({
            open: openTickets?.count || 0,
            pending: pendingTickets?.count || 0,
            closed: closedTickets?.count || 0,
            onHold: onHoldTickets?.count || 0,
          });
        } catch {
          console.warn('Could not fetch Zoho ticket stats');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setDataLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const quickStats = [
    { icon: FileCheck, label: 'Pending Reviews', value: dashboardStats?.pendingContent ?? 0, href: '/admin/content?status=pending_review', color: '#E8B058', trend: '+12%', trendUp: true },
    { icon: Ticket, label: 'Open Tickets', value: ticketStats.open, href: '/admin/tickets?status=open', color: '#f59e0b', trend: '-5%', trendUp: false },
    { icon: Users, label: 'Active Users', value: dashboardStats?.activeUsers ?? 0, href: '/admin/users', color: '#22c55e', trend: '+8%', trendUp: true },
    { icon: FileStack, label: 'Total Content', value: dashboardStats?.publishedContent ?? 0, href: '/admin/content', color: '#3b82f6', trend: '+3%', trendUp: true },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'content.create': 'Content created',
      'content.update': 'Content updated',
      'content.delete': 'Content deleted',
      'content.publish': 'Content published',
      'content.approve': 'Content approved',
      'content.reject': 'Content rejected',
      'route.create': 'Route created',
      'route.update': 'Route updated',
      'route.delete': 'Route deleted',
      'user.login': 'User logged in',
      'user.logout': 'User logged out',
      'settings.update': 'Settings updated',
    };
    return actionMap[action] || action;
  };

  const sections = [
    { icon: FileStack, title: 'Content Queue', description: 'Manage and review content submissions', href: '/admin/content' },
    { icon: Route, title: 'Routing', description: 'Configure ticket routing rules', href: '/admin/routing' },
    { icon: BarChart3, title: 'Analytics', description: 'View platform analytics and reports', href: '/admin/analytics' },
    { icon: Ticket, title: 'Tickets', description: 'Manage support tickets', href: '/admin/tickets' },
    { icon: Users, title: 'Users', description: 'Manage user accounts and permissions', href: '/admin/users' },
    { icon: FileText, title: 'Audit Logs', description: 'View system audit trails', href: '/admin/audit' },
    { icon: Settings, title: 'Settings', description: 'Configure admin preferences', href: '/admin/settings' },
    { icon: Zap, title: 'Integrations', description: 'Manage external service connections', href: '/admin/integrations' },
  ];

  const notifications = [
    { id: 1, message: 'New content pending review', time: '2 min ago', type: 'info' },
    { id: 2, message: 'Ticket #1234 escalated', time: '15 min ago', type: 'warning' },
    { id: 3, message: 'Deployment completed', time: '1 hour ago', type: 'success' },
  ];

  const refreshData = () => {
    setDataLoading(true);
    setError(null);
    fetch('/admin-dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setDashboardStats(data.stats))
      .catch(err => setError(err.message))
      .finally(() => setDataLoading(false));
  };

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center gap-3"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: '#ef4444' }} />
          <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
            {error}
          </span>
          <button
            onClick={refreshData}
            className="ml-auto text-sm underline"
            style={{ color: '#ef4444', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-6"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(232,176,88,0.12)',
                border: '1px solid rgba(232,176,88,0.2)',
              }}
            >
              <LayoutDashboard className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {user?.email || 'admin@nxgen.io'} · NXGEN Technology AG
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {quickStats.map(({ icon: Icon, label, value, href, color, trend, trendUp }) => (
          <Link
            key={label}
            to={href}
            className="rounded-xl p-5 transition-all hover:scale-[1.02] group"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              textDecoration: 'none',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: trendUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                {trendUp ? (
                  <ArrowUpRight className="w-3 h-3" style={{ color: '#22c55e' }} />
                ) : (
                  <ArrowDownRight className="w-3 h-3" style={{ color: '#ef4444' }} />
                )}
                <span className="text-xs font-medium" style={{ color: trendUp ? '#22c55e' : '#ef4444' }}>
                  {trend}
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
              {dataLoading ? '...' : value}
            </p>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {label}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 space-y-6">
          <div
            className="rounded-xl p-6"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: '#E8B058' }} />
                <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  Ticket Trends
                </h3>
              </div>
              <select
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{ticketStats.open}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Open</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{ticketStats.pending}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Pending</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{ticketStats.closed}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Closed</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-2xl font-bold" style={{ color: '#6366f1' }}>{ticketStats.onHold}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>On Hold</p>
              </div>
            </div>
            <div className="h-40 flex items-end gap-2">
              {[65, 45, 78, 52, 88, 42, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <div
                    className="rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      background: 'linear-gradient(180deg, #E8B058 0%, #C89446 100%)',
                    }}
                  />
                  <span className="text-xs text-center" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-6"
              style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: '#E8B058' }} />
                <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  Recent Activity
                </h3>
              </div>
              {dataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  No recent activity
                </p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.slice(0, 5).map((event) => (
                    <div
                      key={event._id}
                      className="flex items-start gap-3 p-2 rounded-lg"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: '#E8B058' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                            {formatAction(event.action)}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            by {event.actor?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs truncate" style={{ color: '#E8B058' }}>
                            {event.resourceTitle || event.resourceId || 'Unknown resource'}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/admin/audit"
                className="flex items-center justify-center gap-2 mt-4 p-2 rounded-lg text-sm transition-all hover:opacity-80"
                style={{
                  background: isDark ? 'rgba(232,176,88,0.1)' : 'rgba(232,176,88,0.15)',
                  color: '#E8B058',
                  textDecoration: 'none',
                }}
              >
                View all activity
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileStack className="w-5 h-5" style={{ color: '#E8B058' }} />
                <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  Content Pipeline
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Draft</div>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-lg" style={{ width: '30%', background: '#6366f1' }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--ifm-color-content)' }}>12</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Review</div>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-lg" style={{ width: '15%', background: '#f59e0b' }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--ifm-color-content)' }}>6</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Approved</div>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-lg" style={{ width: '20%', background: '#22c55e' }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--ifm-color-content)' }}>8</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Published</div>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <div className="h-full rounded-lg" style={{ width: '85%', background: '#E8B058' }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right" style={{ color: 'var(--ifm-color-content)' }}>{dashboardStats?.publishedContent ?? 34}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <QuickActions />

          <div
            className="rounded-xl p-5"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: '#E8B058' }} />
                <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  Notifications
                </h3>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                3
              </span>
            </div>
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-2 rounded-lg"
                  style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: notif.type === 'warning' ? '#f59e0b' : notif.type === 'success' ? '#22c55e' : '#3b82f6',
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {notif.message}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {notif.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5" style={{ color: '#E8B058' }} />
              <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                System Status
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>All Systems</span>
                </div>
                <span className="text-xs" style={{ color: '#22c55e' }}>Operational</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>Sanity CMS</span>
                </div>
                <span className="text-xs" style={{ color: '#22c55e' }}>Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>Sync Queue</span>
                </div>
                <span className="text-xs" style={{ color: '#f59e0b' }}>3 pending</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>Last Deploy</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sections.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            to={href}
            className="group rounded-xl p-5 transition-all hover:scale-[1.02]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              textDecoration: 'none',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(232,176,88,0.1)',
                  border: '1px solid rgba(232,176,88,0.2)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: '#E8B058' }} />
              </div>
              <div>
                <h3
                  className="font-semibold mb-1 group-hover:text-[#E8B058] transition-colors"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }} />
    </div>
  );
}

function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

export default function AdminIndexPage() {
  return (
    <Layout
      title="Admin Dashboard | NXGEN"
      description="NXGEN admin dashboard for content management and analytics"
    >
      <BrowserOnly fallback={<DashboardLoader />}>
        {() => <AdminDashboard />}
      </BrowserOnly>
    </Layout>
  );
}
