import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { FileText, RefreshCw, Filter, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
  changes?: { before?: string; after?: string };
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
    changes: { before: 'v1.2.0', after: 'v1.3.0' },
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

const RESOURCE_TYPE_OPTIONS: { value: ResourceType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'doc', label: 'Doc' },
  { value: 'article', label: 'Article' },
  { value: 'release', label: 'Release' },
  { value: 'roadmapItem', label: 'Roadmap Item' },
  { value: 'routeConfig', label: 'Route Config' },
  { value: 'adminUser', label: 'Admin User' },
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
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    if (userId) setUserFilter(userId);
  }, []);

  const fetchLogs = useCallback(async (pageNum: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (actionFilter && actionFilter !== 'all') {
        params.append('action', actionFilter);
      }
      if (resourceTypeFilter) {
        params.append('resourceType', resourceTypeFilter);
      }
      if (userFilter) {
        params.append('actorId', userFilter);
      }
      if (startDate) {
        params.append('startDate', new Date(startDate).toISOString());
      }
      if (endDate) {
        params.append('endDate', new Date(endDate).toISOString());
      }
      params.append('limit', String(pageSize + 1));
      params.append('offset', String(pageNum * pageSize));

      const response = await fetch(`/admin-audit-logs?${params.toString()}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      const data = await response.json();
      const fetchedLogs = data.logs || [];
      setHasMore(fetchedLogs.length > pageSize);
      setLogs(fetchedLogs.slice(0, pageSize));
      setPage(pageNum);
    } catch (err) {
      console.warn('[AuditLogs] Endpoint not available, using placeholder data');
      let filtered = [...PLACEHOLDER_LOGS];
      if (actionFilter && actionFilter !== 'all') {
        filtered = filtered.filter(log => log.action === actionFilter);
      }
      if (resourceTypeFilter) {
        filtered = filtered.filter(log => log.resourceType === resourceTypeFilter);
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
      setHasMore(false);
      setPage(0);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, resourceTypeFilter, userFilter, startDate, endDate, pageSize]);

  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const handlePrevPage = () => {
    if (page > 0) fetchLogs(page - 1);
  };

  const handleNextPage = () => {
    if (hasMore) fetchLogs(page + 1);
  };

  const exportCsv = () => {
    const headers = ['Timestamp', 'Action', 'Actor Name', 'Actor Email', 'Resource Type', 'Resource ID', 'Resource Title', 'Changes Before', 'Changes After'];
    const rows = logs.map(log => [
      log.timestamp,
      log.action,
      log.actor.name,
      log.actor.email,
      log.resourceType || '',
      log.resourceId || '',
      log.resourceTitle || '',
      log.changes?.before || '',
      log.changes?.after || '',
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)';
  const cellHoverBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';

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
            <select
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              {RESOURCE_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="User ID filter"
              className="px-3 py-2 rounded-lg text-sm w-32"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            />
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
              onClick={() => fetchLogs(0)}
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
              onClick={exportCsv}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'rgba(232,176,88,0.1)',
                color: '#E8B058',
                border: '1px solid rgba(232,176,88,0.2)',
                cursor: logs.length === 0 ? 'not-allowed' : 'pointer',
                opacity: logs.length === 0 ? 0.5 : 1,
              }}
            >
              <Download className="w-4 h-4" />
              Export CSV
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
        ) : logs.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No audit logs found</p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="w-full text-sm" style={{ width: '100%', minWidth: 'auto' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                  <th className="text-left px-2 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '100px' }}>
                    Timestamp
                  </th>
                  <th className="text-left px-2 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '90px' }}>
                    Action
                  </th>
                  <th className="text-left px-2 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '100px' }}>
                    Actor
                  </th>
                  <th className="text-left px-2 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '70px' }}>
                    Type
                  </th>
                  <th className="text-left px-2 py-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Resource
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr
                      onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}
                      style={{
                        background: expandedId === log._id ? cellHoverBg : cellBg,
                        cursor: 'pointer',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      }}
                    >
                      <td className="px-2 py-2 whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: `${getActionColor(log.action)}20`,
                            color: getActionColor(log.action),
                            display: 'inline-block',
                          }}
                        >
                          {(ACTION_LABELS[log.action] || log.action).split(' ').slice(0, 2).join(' ')}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className="font-medium" style={{ color: 'var(--ifm-color-content)', maxWidth: '80px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.actor.name}>
                          {log.actor.name.length > 12 ? log.actor.name.slice(0, 12) + '...' : log.actor.name}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {log.resourceType ? log.resourceType.slice(0, 6) : '—'}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-between">
                          <div style={{ maxWidth: '150px' }}>
                            {log.resourceTitle && (
                              <div className="font-medium truncate" style={{ color: 'var(--ifm-color-content)' }} title={log.resourceTitle}>
                                {log.resourceTitle.length > 25 ? log.resourceTitle.slice(0, 25) + '...' : log.resourceTitle}
                              </div>
                            )}
                            {log.resourceId && (
                              <div className="text-xs truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                {log.resourceId}
                              </div>
                            )}
                            {!log.resourceId && !log.resourceTitle && '—'}
                          </div>
                          {expandedId === log._id ? (
                            <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                          ) : (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === log._id && log.changes && (
                      <tr style={{ background: cellHoverBg }}>
                        <td colSpan={5} className="px-2 py-2">
                          <div className="rounded-lg p-3" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
                            <div className="text-xs font-medium mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                              Changes
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#ef4444' }}>Before</div>
                                <pre className="p-2 rounded text-xs overflow-auto" style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', color: 'var(--ifm-color-content)' }}>
                                  {log.changes.before || '—'}
                                </pre>
                              </div>
                              <div>
                                <div className="text-xs mb-1" style={{ color: '#22c55e' }}>After</div>
                                <pre className="p-2 rounded text-xs overflow-auto" style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)', color: 'var(--ifm-color-content)' }}>
                                  {log.changes.after || '—'}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Page {page + 1} • {logs.length} log{logs.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: !hasMore ? 'not-allowed' : 'pointer',
                opacity: !hasMore ? 0.5 : 1,
              }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <AuditLogsPage />}
      </BrowserOnly>
    </Layout>
  );
}
