import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Loader, ExternalLink, LayoutGrid, List } from 'lucide-react';
import { listTickets, listAgents, listStatuses } from './zohoApi';
import type { ZohoTicket, ZohoAgent, ZohoStatus } from './types';

interface Props {
  token: string;
  isDark: boolean;
  isCustomer?: boolean;
  accountId?: string | null;
  contactId?: string | null;
  onSelect: (ticket: ZohoTicket) => void;
}

const STATUS_FILTER_OPTIONS = ['all', 'Open', 'On Hold', 'Closed'] as const;

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  High:     { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  Medium:   { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Low:      { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Open:       { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' },
  'On Hold':  { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  Closed:     { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'Waiting on customer feedback': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
};

const KANBAN_COLUMNS = ['Open', 'On Hold', 'Waiting on customer feedback', 'Closed'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function TicketCard({ ticket, onSelect, isDark, style }: {
  ticket: ZohoTicket;
  onSelect: (t: ZohoTicket) => void;
  isDark: boolean;
  style?: React.CSSProperties;
}) {
  const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
  const sStyle = STATUS_STYLES[ticket.status] ?? { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' };
  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
    ...style,
  };

  return (
    <button
      key={ticket.id}
      onClick={() => onSelect(ticket)}
      className="w-full text-left rounded-xl border p-4 transition-all duration-200 hover:scale-[1.005]"
      style={{ ...cardStyle, cursor: 'pointer', display: 'block' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono font-medium" style={{ color: '#E8B058' }}>
              #{ticket.ticketNumber}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: sStyle.bg, color: sStyle.color }}>
              {ticket.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: pStyle.bg, color: pStyle.color }}>
              {ticket.priority}
            </span>
            {ticket.isOverDue && ticket.status !== 'Closed' && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                Overdue
              </span>
            )}
          </div>
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--ifm-color-content)' }}>
            {ticket.subject}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {ticket.email} · {formatDate(ticket.createdTime)} · {ticket.channel}
          </p>
          {ticket.assignee && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Assigned: {ticket.assignee.name || `${ticket.assignee.firstName} ${ticket.assignee.lastName}`}
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }} />
      </div>
    </button>
  );
}

function KanbanView({ tickets, onSelect, isDark, statuses }: {
  tickets: ZohoTicket[];
  onSelect: (t: ZohoTicket) => void;
  isDark: boolean;
  statuses: ZohoStatus[];
}) {
  // Build column list: use fetched statuses or fallback to defaults
  const columns = statuses.length > 0
    ? statuses.map(s => s.displayName)
    : KANBAN_COLUMNS;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4" style={{ minWidth: `${columns.length * 260}px` }}>
        {columns.map(col => {
          const colTickets = tickets.filter(t => t.status === col);
          const statusColor = statuses.find(s => s.displayName === col)?.colorCode;
          return (
            <div key={col} className="flex-shrink-0" style={{ width: 250 }}>
              <div
                className="flex items-center justify-between px-3 py-2 rounded-t-xl"
                style={{
                  background: statusColor ? `${statusColor}18` : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                  border: `1px solid ${statusColor ? `${statusColor}33` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                  borderBottom: 'none',
                }}
              >
                <span className="text-xs font-semibold" style={{ color: statusColor ?? 'var(--ifm-color-content)' }}>
                  {col}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: statusColor ? `${statusColor}22` : 'rgba(107,114,128,0.12)',
                    color: statusColor ?? '#6b7280',
                  }}
                >
                  {colTickets.length}
                </span>
              </div>
              <div
                className="rounded-b-xl p-2 space-y-2 overflow-y-auto"
                style={{
                  border: `1px solid ${statusColor ? `${statusColor}33` : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                  borderTop: 'none',
                  minHeight: 120,
                  maxHeight: 'calc(100vh - 300px)',
                  background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
                }}
              >
                {colTickets.length === 0 ? (
                  <p className="text-xs text-center py-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    No tickets
                  </p>
                ) : (
                  colTickets.map(t => (
                    <TicketCard key={t.id} ticket={t} onSelect={onSelect} isDark={isDark} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TicketList({ token, isDark, isCustomer, accountId, contactId, onSelect }: Props) {
  const [tickets, setTickets] = useState<ZohoTicket[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<ZohoAgent[]>([]);
  const [statuses, setStatuses] = useState<ZohoStatus[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  // Kanban loads all tickets (no pagination)
  const [kanbanTickets, setKanbanTickets] = useState<ZohoTicket[]>([]);
  const [kanbanLoading, setKanbanLoading] = useState(false);

  // Load agents + statuses once (agents only — customers don't need these)
  useEffect(() => {
    if (!isCustomer) {
      listAgents(token).then(r => setAgents(r.data ?? [])).catch(() => {});
    }
    listStatuses(token).then(r => setStatuses(r.data ?? [])).catch(() => {});
  }, [token, isCustomer]);

  const hasAgentFilter = agentFilter !== 'all';

  // Load paginated tickets for list view
  // When agent filter is active, fetch 100 tickets and filter client-side
  useEffect(() => {
    if (viewMode !== 'list') return;
    setLoading(true);
    setError(null);
    const pageArg = hasAgentFilter ? 1 : page;
    const limitArg = hasAgentFilter ? 100 : 25;
    listTickets(token, pageArg, statusFilter, limitArg, accountId, contactId)
      .then(res => {
        const all = res.data ?? [];
        const filtered = hasAgentFilter
          ? all.filter(t => t.assigneeId === agentFilter)
          : all;
        setTickets(filtered);
        setTotal(hasAgentFilter ? filtered.length : (res.count ?? 0));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, page, statusFilter, agentFilter, viewMode]);

  // Load all tickets for kanban
  useEffect(() => {
    if (viewMode !== 'kanban') return;
    setKanbanLoading(true);
    Promise.all(
      (statusFilter === 'all'
        ? ['Open', 'On Hold', 'Waiting on customer feedback', 'Closed']
        : [statusFilter]
      ).map(s =>
        listTickets(token, 1, s, 100, accountId, contactId)
          .then(r => r.data ?? [])
          .catch(() => [] as ZohoTicket[])
      )
    )
      .then(groups => {
        const all = groups.flat();
        setKanbanTickets(hasAgentFilter ? all.filter(t => t.assigneeId === agentFilter) : all);
      })
      .finally(() => setKanbanLoading(false));
  }, [token, statusFilter, agentFilter, viewMode]);

  const totalPages = hasAgentFilter ? 1 : Math.ceil(total / 25);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Status filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTER_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { setStatusFilter(opt); setPage(1); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: statusFilter === opt ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                color: statusFilter === opt ? '#000' : 'var(--ifm-color-content-secondary)',
                border: `1px solid ${statusFilter === opt ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                cursor: 'pointer',
              }}
            >
              {opt === 'all' ? 'All Tickets' : opt}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Agent filter — agents only */}
        {!isCustomer && agents.length > 0 && (
          <select
            value={agentFilter}
            onChange={e => { setAgentFilter(e.target.value); setPage(1); }}
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              color: 'var(--ifm-color-content)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: '0.5rem',
              padding: '0.3rem 0.7rem',
              fontSize: '0.75rem',
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

        {/* View mode toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
        >
          <button
            onClick={() => setViewMode('list')}
            title="List view"
            className="px-2.5 py-1.5 transition-all"
            style={{
              background: viewMode === 'list' ? 'rgba(232,176,88,0.15)' : 'transparent',
              color: viewMode === 'list' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            title="Kanban view"
            className="px-2.5 py-1.5 transition-all"
            style={{
              background: viewMode === 'kanban' ? 'rgba(232,176,88,0.15)' : 'transparent',
              color: viewMode === 'kanban' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {viewMode === 'list' && total > 0 && (
          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {total} ticket{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 mb-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Failed to load tickets</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>{error}</p>
            {(error.includes('CORS') || error.includes('Failed to fetch')) && (
              <p className="text-xs mt-2" style={{ color: '#E8B058' }}>
                CORS restriction detected. The API proxy may need to be configured for this domain.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Kanban view */}
      {viewMode === 'kanban' && (
        kanbanLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
            <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Loading...</span>
          </div>
        ) : (
          <KanbanView tickets={kanbanTickets} onSelect={onSelect} isDark={isDark} statuses={statuses} />
        )
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <>
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
              <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Loading tickets...
              </span>
            </div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              <p className="text-sm">No tickets found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}{agentFilter !== 'all' ? ' for this agent' : ''}.</p>
            </div>
          )}

          {!loading && !error && tickets.length > 0 && (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onSelect={onSelect} isDark={isDark} />
              ))}
            </div>
          )}

          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
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
              <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
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
    </div>
  );
}
