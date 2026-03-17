import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { FileText, RefreshCw, Filter, Download, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

type AuditAction =
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

type ResourceType = 'doc' | 'article' | 'release' | 'roadmapItem' | 'routeConfig' | 'adminUser';

interface AuditLog {
  _id: string;
  action: AuditAction;
  actor: { name: string; email: string };
  resourceType?: ResourceType;
  resourceId?: string;
  resourceTitle?: string;
  timestamp: string;
}

const ACTION_LABELS: Record<AuditAction, string> = {
  'content.create': 'Content Created',
  'content.update': 'Content Updated',
  'content.delete': 'Content Deleted',
  'content.publish': 'Content Published',
  'content.approve': 'Content Approved',
  'content.reject': 'Content Rejected',
  'route.create': 'Route Created',
  'route.update': 'Route Updated',
  'route.delete': 'Route Deleted',
  'user.login': 'User Login',
  'user.logout': 'User Logout',
  'settings.update': 'Settings Updated',
};

const ACTION_COLORS: Record<string, string> = {
  create: '#22c55e',
  update: '#3b82f6',
  delete: '#ef4444',
  publish: '#8b5cf6',
  approve: '#22c55e',
  reject: '#ef4444',
  login: '#06b6d4',
  logout: '#6b7280',
};

const PLACEHOLDER_LOGS: AuditLog[] = [
  {
    _id: '1',
    action: 'user.login',
    actor: { name: 'John Admin', email: 'john@example.com' },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: '2',
    action: 'content.create',
    actor: { name: 'Jane Editor', email: 'jane@example.com' },
    resourceType: 'article',
    resourceId: 'art-001',
    resourceTitle: 'Getting Started Guide',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: '3',
    action: 'content.update',
    actor: { name: 'John Admin', email: 'john@example.com' },
    resourceType: 'doc',
    resourceId: 'doc-042',
    resourceTitle: 'API Reference',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: '4',
    action: 'content.publish',
    actor: { name: 'Jane Editor', email: 'jane@example.com' },
    resourceType: 'article',
    resourceId: 'art-001',
    resourceTitle: 'Getting Started Guide',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: '5',
    action: 'route.create',
    actor: { name: 'John Admin', email: 'john@example.com' },
    resourceType: 'routeConfig',
    resourceId: 'route-007',
    resourceTitle: '/docs/v2/*',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

function getActionColor(action: AuditAction): string {
  const key = action.split('.')[1] || action;
  return ACTION_COLORS[key] || '#6b7280';
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AuditLogsPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (actionFilter && actionFilter !== 'all') {
        params.append('action', actionFilter);
      }
      if (startDate) {
        params.append('startDate', new Date(startDate).toISOString());
      }
      if (endDate) {
        params.append('endDate', new Date(endDate).toISOString());
      }

      const response = await fetch(`/api/admin-audit-logs?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.warn('[AuditLogs] Endpoint not available, using placeholder data');
      let filtered = [...PLACEHOLDER_LOGS];
      if (actionFilter && actionFilter !== 'all') {
        filtered = filtered.filter(log => log.action === actionFilter);
      }
      if (startDate) {
        const start = new Date(startDate);
        filtered = filtered.filter(log => new Date(log.timestamp) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        filtered = filtered.filter(log => new Date(log.timestamp) <= end);
      }
      setLogs(filtered);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)';
  const cellHoverBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';

  const filteredLogs = logs.filter(log => {
    if (actionFilter && actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (startDate && new Date(log.timestamp) < new Date(startDate)) return false;
    if (endDate && new Date(log.timestamp) > new Date(endDate)) return false;
    return true;
  });

  return (
    <AdminLayout title="Audit Logs">
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
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
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(232,176,88,0.12)',
              border: '1px solid rgba(232,176,88,0.2)',
            }}
          >
            <FileText className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Audit Logs
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              System activity and change history
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <option value="all">All Actions</option>
                <option value="content.create">Content Created</option>
                <option value="content.update">Content Updated</option>
                <option value="content.delete">Content Deleted</option>
                <option value="content.publish">Content Published</option>
                <option value="content.approve">Content Approved</option>
                <option value="content.reject">Content Rejected</option>
                <option value="route.create">Route Created</option>
                <option value="route.update">Route Updated</option>
                <option value="route.delete">Route Deleted</option>
                <option value="user.login">User Login</option>
                <option value="user.logout">User Logout</option>
                <option value="settings.update">Settings Updated</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              />
              <span style={{ color: 'var(--ifm-color-content-secondary)' }}>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(232,176,88,0.1)',
                color: '#E8B058',
                border: '1px solid rgba(232,176,88,0.2)',
                cursor: 'pointer',
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
            <span className="ml-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Loading logs...
            </span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Action
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Actor
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Resource Type
                  </th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Resource
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}
                    style={{
                      background: expandedId === log._id ? cellHoverBg : cellBg,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  >
                    <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
                        style={{
                          background: `${getActionColor(log.action)}20`,
                          color: getActionColor(log.action),
                        }}
                      >
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                          {log.actor.name}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {log.actor.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {log.resourceType || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          {log.resourceTitle && (
                            <div className="font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                              {log.resourceTitle}
                            </div>
                          )}
                          {log.resourceId && (
                            <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                              {log.resourceId}
                            </div>
                          )}
                          {!log.resourceId && !log.resourceTitle && '—'}
                        </div>
                        {expandedId === log._id ? (
                          <ChevronUp className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                        ) : (
                          <ChevronDown className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredLogs.length > 0 && (
        <div className="mt-4 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
        </div>
      )}
    </AdminLayout>
  );
}

function AuditLogsPage() {
  return (
    <ProtectedRoute>
      <AuditLogsPageContent />
    </ProtectedRoute>
  );
}

export default function AuditLogsPageWrapper() {
  return (
    <Layout title="Audit Logs | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <AuditLogsPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
