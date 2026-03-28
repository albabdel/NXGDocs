import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Loader, ExternalLink, LayoutGrid, List, Clock, Ticket } from 'lucide-react';
import { listTickets, listAgents, listStatuses } from './zohoApi';
import type { ZohoTicket, ZohoAgent, ZohoStatus } from './types';
import { calculateSLARemaining, formatSLARemaining } from './supportConfig';

interface Props {
  isDark: boolean;
  isCustomer?: boolean;
  onSelect: (ticket: ZohoTicket) => void;
  token?: string;
}

const STATUS_FILTER_OPTIONS = ['all', 'Open', 'On Hold', 'Waiting on customer feedback', 'Closed'] as const;

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

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

function htmlToPlain(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function SLATimerMini({ ticket }: { ticket: ZohoTicket }) {
  const [slaData, setSlaData] = useState<ReturnType<typeof calculateSLARemaining>>(null);
  
  useEffect(() => {
    const updateSLA = () => {
      const responseSLA = calculateSLARemaining(ticket.createdTime, ticket.priority, 'response');
      setSlaData(responseSLA);
    };
    
    updateSLA();
    const interval = setInterval(updateSLA, 60000);
    return () => clearInterval(interval);
  }, [ticket.createdTime, ticket.priority]);
  
  if (!slaData || ticket.status === 'Closed') return null;
  
  const isWarning = slaData.percentage < 30 && !slaData.isBreached;
  const textColor = slaData.isBreached ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';
  
  return (
    <span className="inline-flex items-center gap-0.5 text-xs" style={{ color: textColor }}>
      <Clock className="w-2.5 h-2.5" />
      {formatSLARemaining(slaData.remainingMs)}
    </span>
  );
}

function TicketCard({ ticket, onSelect, isDark, style }: {
  ticket: ZohoTicket;
  onSelect: (t: ZohoTicket) => void;
  isDark: boolean;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
  const sStyle = STATUS_STYLES[ticket.status] ?? { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' };
  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: hovered
      ? (isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.25)')
      : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'),
    boxShadow: hovered ? (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.08)') : 'none',
    ...style,
  };
  const preview = htmlToPlain(ticket.description);

  return (
    <button
      key={ticket.id}
      onClick={() => onSelect(ticket)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left rounded-xl border p-3.5 transition-all duration-200"
      style={{ ...cardStyle, cursor: 'pointer', display: 'block' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
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
            <span className="text-xs ml-auto" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.6 }}>
              {formatRelativeTime(ticket.modifiedTime)}
            </span>
          </div>
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--ifm-color-content)' }}>
            {ticket.subject}
          </p>
          {preview && (
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
              {preview.slice(0, 110)}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
              {ticket.channel} · {formatDate(ticket.createdTime)}
            </p>
            <SLATimerMini ticket={ticket} />
            {ticket.assignee && (
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
                · {ticket.assignee.name || `${ticket.assignee.firstName} ${ticket.assignee.lastName}`}
              </p>
            )}
          </div>
        </div>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-1 transition-all" style={{ color: hovered ? '#3b82f6' : 'var(--ifm-color-content-secondary)', opacity: hovered ? 1 : 0.5 }} />
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

export default function TicketList({ isDark, isCustomer, onSelect, token }: Props) {
  const [tickets, setTickets] = useState<ZohoTicket[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
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
      listAgents({ isCustomer, token }).then(r => setAgents(r.data ?? [])).catch(() => {});
    }
    listStatuses({ isCustomer, token }).then(r => setStatuses(r.data ?? [])).catch(() => {});
  }, [isCustomer, token]);

  const hasAgentFilter = agentFilter !== 'all';

  // Load paginated tickets for list view
  // For customers: fetch ALL tickets and filter client-side (Zoho /contacts/{id}/tickets doesn't support status filter)
  // For agents: use server-side filtering when possible
  useEffect(() => {
    if (viewMode !== 'list') return;
    setLoading(true);
    setError(null);
    
    const needsClientFiltering = isCustomer || hasAgentFilter;
    const pageArg = needsClientFiltering ? 1 : page;
    const limitArg = needsClientFiltering ? 100 : 50;
    
    listTickets({ page: pageArg, limit: limitArg, isCustomer, token })
      .then(res => {
        let all = res.data ?? [];
        
        // Client-side filtering for customers (status) and agents (assignee)
        if (isCustomer && statusFilter !== 'all') {
          all = all.filter(t => t.status === statusFilter);
        }
        if (hasAgentFilter) {
          all = all.filter(t => t.assigneeId === agentFilter);
        }
        
        setTickets(all);
        setTotal(all.length);
        setHasMore(!needsClientFiltering && res.data?.length === limitArg);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, statusFilter, agentFilter, viewMode, isCustomer, token]);

  // Load all tickets for kanban
  // For customers: fetch all tickets once and distribute to columns client-side
  // For agents: fetch by status to reduce data transfer
  useEffect(() => {
    if (viewMode !== 'kanban') return;
    setKanbanLoading(true);
    
    if (isCustomer) {
      // Customer mode: fetch all tickets once, filter client-side
      listTickets({ page: 1, limit: 100, isCustomer, token })
        .then(res => {
          let all = res.data ?? [];
          if (hasAgentFilter) {
            all = all.filter(t => t.assigneeId === agentFilter);
          }
          setKanbanTickets(all);
        })
        .catch(() => setKanbanTickets([]))
        .finally(() => setKanbanLoading(false));
    } else {
      // Agent mode: can use server-side status filtering
      Promise.all(
        (statusFilter === 'all'
          ? ['Open', 'On Hold', 'Waiting on customer feedback', 'Closed']
          : [statusFilter]
        ).map(s =>
          listTickets({ page: 1, status: s, limit: 100, isCustomer, token })
            .then(r => r.data ?? [])
            .catch(() => [] as ZohoTicket[])
        )
      )
        .then(groups => {
          const all = groups.flat();
          setKanbanTickets(hasAgentFilter ? all.filter(t => t.assigneeId === agentFilter) : all);
        })
        .finally(() => setKanbanLoading(false));
    }
  }, [statusFilter, agentFilter, viewMode, isCustomer, token]);

  const totalPages = hasAgentFilter ? 1 : Math.max(Math.ceil(total / 50), hasMore ? page + 1 : page);

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
            onClick={() => { setViewMode('list'); setError(null); }}
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
            onClick={() => { setViewMode('kanban'); setError(null); }}
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

        {viewMode === 'list' && (tickets.length > 0 || total > 0) && (
          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {total > tickets.length ? `${total}` : tickets.length} ticket{(total || tickets.length) !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error - only show in list view */}
      {error && viewMode === 'list' && (
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
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Ticket className="w-10 h-10 opacity-20" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                {statusFilter !== 'all' ? `No "${statusFilter}" tickets` : 'No tickets found'}
              </p>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {isCustomer ? 'Create a new support request to get started.' : 'No tickets match the current filters.'}
              </p>
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
