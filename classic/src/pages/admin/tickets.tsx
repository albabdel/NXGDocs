import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Ticket, Inbox, Clock, CheckCircle, AlertTriangle, ExternalLink, Loader, AlertCircle } from 'lucide-react';
import { useZohoAuth } from '../../components/ZohoTickets/useZohoAuth';
import { listTickets } from '../../components/ZohoTickets/zohoApi';
import type { ZohoTicket } from '../../components/ZohoTickets/types';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Open', label: 'Open' },
  { key: 'On Hold', label: 'Pending' },
  { key: 'Closed', label: 'Closed' },
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function TicketsPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [tickets, setTickets] = useState<ZohoTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalCount, setTotalCount] = useState(0);

  const { token, isAuthenticated, mode } = useZohoAuth();

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
    setLoading(true);
    setError(null);
    listTickets({ status: statusFilter === 'all' ? undefined : statusFilter, limit: 100, isCustomer: false, token })
      .then(res => {
        setTickets(res.data ?? []);
        setTotalCount(res.count ?? (res.data?.length ?? 0));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter, isAuthenticated, mode, token]);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';
  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const pendingCount = tickets.filter(t => t.status === 'On Hold' || t.status === 'Waiting on customer feedback').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;

  const stats = [
    { icon: Inbox, label: 'Open', value: openCount, color: '#E8B058' },
    { icon: Clock, label: 'Pending', value: pendingCount, color: '#3b82f6' },
    { icon: CheckCircle, label: 'Closed', value: closedCount, color: '#22c55e' },
    { icon: AlertTriangle, label: 'Total', value: totalCount || tickets.length, color: '#ef4444' },
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
                Overview of support tickets
              </p>
            </div>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
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
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
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
        <div className="flex-1" />
        <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </span>
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

      {!loading && !error && tickets.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <Ticket className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            No tickets found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
          </p>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
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
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>ID</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Subject</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Priority</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Created</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Assignee</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => {
                  const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
                  const sStyle = STATUS_STYLES[ticket.status] ?? { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' };
                  return (
                    <tr
                      key={ticket.id}
                      style={{
                        borderTop: idx === 0 ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                      }}
                    >
                      <td className="p-3 font-mono text-xs" style={{ color: '#E8B058' }}>
                        #{ticket.ticketNumber}
                      </td>
                      <td className="p-3 max-w-xs truncate" style={{ color: 'var(--ifm-color-content)' }}>
                        {ticket.subject}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: sStyle.bg, color: sStyle.color }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: pStyle.bg, color: pStyle.color }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-3 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatDate(ticket.createdTime)}
                      </td>
                      <td className="p-3 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {ticket.assignee?.name ?? (ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : 'Unassigned')}
                      </td>
                      <td className="p-3">
                        <a
                          href={`/support?ticket=${ticket.id}`}
                          className="inline-flex items-center gap-1 text-xs hover:underline"
                          style={{ color: '#E8B058' }}
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
