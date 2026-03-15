import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { listTickets } from './zohoApi';
import type { ZohoTicket } from './types';

interface Props {
  token: string;
  isDark: boolean;
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
  Open:     { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' },
  'On Hold':{ bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  Closed:   { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function TicketList({ token, isDark, onSelect }: Props) {
  const [tickets, setTickets] = useState<ZohoTicket[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listTickets(token, page, status)
      .then(res => {
        setTickets(res.data ?? []);
        setTotal(res.count ?? 0);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, page, status]);

  const totalPages = Math.ceil(total / 25);

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {STATUS_FILTER_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => { setStatus(opt); setPage(1); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: status === opt ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
              color: status === opt ? '#000' : 'var(--ifm-color-content-secondary)',
              border: `1px solid ${status === opt ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
              cursor: 'pointer',
            }}
          >
            {opt === 'all' ? 'All Tickets' : opt}
          </button>
        ))}
        {total > 0 && (
          <span className="ml-auto text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
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
            {error.includes('CORS') || error.includes('Failed to fetch') ? (
              <p className="text-xs mt-2" style={{ color: '#E8B058' }}>
                CORS restriction detected. The API proxy may need to be configured for this domain.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
          <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Loading tickets...
          </span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tickets.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          <p className="text-sm">No tickets found{status !== 'all' ? ` with status "${status}"` : ''}.</p>
        </div>
      )}

      {/* Ticket cards */}
      {!loading && !error && tickets.length > 0 && (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
            const sStyle = STATUS_STYLES[ticket.status] ?? STATUS_STYLES.Open;
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
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: sStyle.bg, color: sStyle.color }}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: pStyle.bg, color: pStyle.color }}
                      >
                        {ticket.priority}
                      </span>
                      {ticket.isOverDue && ticket.status !== 'Closed' && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                        >
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
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
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
    </div>
  );
}
