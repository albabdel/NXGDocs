import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Ticket, Inbox, Clock, CheckCircle, AlertTriangle, ExternalLink, Loader, AlertCircle, Search, ChevronLeft, ChevronRight, Mail, User, RefreshCw } from 'lucide-react';
import { useZohoAuth } from '../../components/ZohoTickets/useZohoAuth';
import { listTickets, listAgents } from '../../components/ZohoTickets/zohoApi';
import type { ZohoTicket, ZohoAgent } from '../../components/ZohoTickets/types';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Open', label: 'Open' },
  { key: 'On Hold', label: 'Pending' },
  { key: 'Waiting on customer feedback', label: 'Waiting on Customer' },
  { key: 'Closed', label: 'Closed' },
];

const PRIORITY_FILTERS = [
  { key: 'all', label: 'All Priorities' },
  { key: 'Critical', label: 'Critical' },
  { key: 'High', label: 'High' },
  { key: 'Medium', label: 'Medium' },
  { key: 'Low', label: 'Low' },
];

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  High: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  Medium: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Low: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Open: { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' },
  'On Hold': { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  Closed: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'Waiting on customer feedback': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
};

const CHANNEL_ICONS: Record<string, string> = {
  Email: '✉️',
  Phone: '📞',
  Chat: '💬',
  Web: '🌐',
  Facebook: '📘',
  Twitter: '🐦',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

interface TicketStats {
  open: number;
  pending: number;
  closed: number;
  total: number;
}

function TicketsPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [tickets, setTickets] = useState<ZohoTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [agents, setAgents] = useState<ZohoAgent[]>([]);
  const [stats, setStats] = useState<TicketStats>({ open: 0, pending: 0, closed: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const { token, isAuthenticated, mode } = useZohoAuth();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || mode !== 'agent' || !token) {
      setLoading(false);
      return;
    }
    listAgents({ isCustomer: false, token })
      .then(res => setAgents(res.data ?? []))
      .catch(() => {});
  }, [isAuthenticated, mode, token]);

  useEffect(() => {
    if (!isAuthenticated || mode !== 'agent' || !token) {
      setLoading(false);
      setStatsLoading(false);
      return;
    }

    setStatsLoading(true);
    Promise.all([
      listTickets({ status: 'Open', limit: 1, isCustomer: false, token }),
      listTickets({ status: 'On Hold', limit: 1, isCustomer: false, token }),
      listTickets({ status: 'Waiting on customer feedback', limit: 1, isCustomer: false, token }),
      listTickets({ status: 'Closed', limit: 1, isCustomer: false, token }),
    ])
      .then(([openRes, onHoldRes, waitingRes, closedRes]) => {
        const openCount = openRes.count ?? 0;
        const pendingCount = (onHoldRes.count ?? 0) + (waitingRes.count ?? 0);
        const closedCount = closedRes.count ?? 0;
        const total = openCount + pendingCount + closedCount;
        setStats({ open: openCount, pending: pendingCount, closed: closedCount, total });
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [isAuthenticated, mode, token]);

  useEffect(() => {
    if (!isAuthenticated || mode !== 'agent' || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    listTickets({ status: statusFilter === 'all' ? undefined : statusFilter, limit: 100, isCustomer: false, token })
      .then(res => {
        setTickets(res.data ?? []);
        setTotalCount(res.count ?? (res.data?.length ?? 0));
        setPage(1);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter, isAuthenticated, mode, token]);

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    if (agentFilter !== 'all') {
      filtered = filtered.filter(t => t.assigneeId === agentFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.subject.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        (t.contact?.firstName?.toLowerCase().includes(query)) ||
        (t.contact?.lastName?.toLowerCase().includes(query)) ||
        t.ticketNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tickets, priorityFilter, agentFilter, searchQuery]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, page]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [priorityFilter, agentFilter, searchQuery]);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';
  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const statsCards = [
    { icon: Inbox, label: 'Open', value: stats.open, color: '#E8B058' },
    { icon: Clock, label: 'Pending', value: stats.pending, color: '#3b82f6' },
    { icon: CheckCircle, label: 'Closed', value: stats.closed, color: '#22c55e' },
    { icon: AlertTriangle, label: 'Total', value: stats.total, color: '#ef4444' },
  ];

  if (!isAuthenticated || mode !== 'agent') {
    return (
      <AdminLayout title="Tickets">
        <div
          className="relative overflow-hidden rounded-2xl p-6 mb-8"
          style={{ background: cardBg, border: `1px solid ${borderColor}` }}
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
              style={{ background: 'rgba(232,176,88,0.12)', border: '1px solid rgba(232,176,88,0.2)' }}
            >
              <Ticket className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Support Tickets
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Manage and respond to support tickets
              </p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#E8B058' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
            Agent Login Required
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Please log in via the Support page with agent credentials to view tickets.
          </p>
          <a
            href="/support"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: '#E8B058',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            Go to Support <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tickets">
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{ background: cardBg, border: `1px solid ${borderColor}` }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(232,176,88,0.12)', border: '1px solid rgba(232,176,88,0.2)' }}
            >
              <Ticket className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Support Tickets
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Overview of support tickets from Zoho Desk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/support"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: 'rgba(232,176,88,0.12)',
                border: '1px solid rgba(232,176,88,0.2)',
                color: '#E8B058',
                textDecoration: 'none',
              }}
            >
              Full Ticket System <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" style={{ color }} />
              <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {label}
              </span>
              {statsLoading && <Loader className="w-3 h-3 animate-spin" style={{ color }} />}
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-4 mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: statusFilter === key ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: statusFilter === key ? '#000' : 'var(--ifm-color-content-secondary)',
                  border: `1px solid ${statusFilter === key ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px mx-1" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: 'var(--ifm-color-content)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {PRIORITY_FILTERS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {agents.length > 0 && (
            <select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">All Agents</option>
              {agents.map(ag => (
                <option key={ag.id} value={ag.id}>
                  {ag.name || `${ag.firstName} ${ag.lastName}`}
                </option>
              ))}
            </select>
          )}

          <div className="flex-1" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg text-xs w-48"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                outline: 'none',
              }}
            />
          </div>

          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            {totalCount > filteredTickets.length && ` (of ${totalCount} total)`}
          </span>
        </div>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 mb-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Failed to load tickets</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
          <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Loading tickets...</span>
        </div>
      )}

      {!loading && !error && filteredTickets.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <Ticket className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            No tickets found
            {statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}
            {priorityFilter !== 'all' ? ` and priority "${priorityFilter}"` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}.
          </p>
        </div>
      )}

      {!loading && !error && paginatedTickets.length > 0 && (
        <>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Ticket #</th>
                    <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Subject</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Requester</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Priority</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Channel</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Assignee</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Created</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>Updated</th>
                    <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket, idx) => {
                    const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
                    const sStyle = STATUS_STYLES[ticket.status] ?? { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' };
                    const channelIcon = CHANNEL_ICONS[ticket.channel] || '📝';
                    const requesterName = ticket.contact
                      ? `${ticket.contact.firstName} ${ticket.contact.lastName}`.trim()
                      : ticket.email.split('@')[0];
                    return (
                      <tr
                        key={ticket.id}
                        style={{
                          borderTop: idx === 0 ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        <td className="p-3 font-mono text-xs whitespace-nowrap" style={{ color: '#E8B058' }}>
                          #{ticket.ticketNumber}
                        </td>
                        <td className="p-3 max-w-[300px]">
                          <div className="truncate" style={{ color: 'var(--ifm-color-content)' }}>
                            {ticket.subject}
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                            <div>
                              <p className="text-xs" style={{ color: 'var(--ifm-color-content)' }}>
                                {requesterName}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                {ticket.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: sStyle.bg, color: sStyle.color }}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: pStyle.bg, color: pStyle.color }}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-sm">{channelIcon}</span>
                          <span className="text-xs ml-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            {ticket.channel}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-xs" style={{ color: 'var(--ifm-color-content)' }}>
                            {ticket.assignee?.name ?? (ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : 'Unassigned')}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            {formatDate(ticket.createdTime)}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                            <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                              {timeAgo(ticket.modifiedTime)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={`/support?ticket=${ticket.id}`}
                              className="inline-flex items-center gap-1 text-xs hover:underline"
                              style={{ color: '#E8B058' }}
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                            {ticket.webUrl && (
                              <a
                                href={ticket.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs hover:underline"
                                style={{ color: 'var(--ifm-color-content-secondary)' }}
                                title="Open in Zoho Desk"
                              >
                                Zoho <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: page === 1 ? 'var(--ifm-color-content-secondary)' : 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: page === totalPages ? 'var(--ifm-color-content-secondary)' : 'var(--ifm-color-content)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                  opacity: page === totalPages ? 0.5 : 1,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

function TicketsPage() {
  return (
    <ProtectedRoute>
      <TicketsPageContent />
    </ProtectedRoute>
  );
}

export default function TicketsPageWrapper() {
  return (
    <Layout title="Tickets | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <TicketsPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
