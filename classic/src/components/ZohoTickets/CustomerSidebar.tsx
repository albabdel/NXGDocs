import React from 'react';
import { Plus, Mail, ChevronRight, Building2, UserCircle } from 'lucide-react';
import type { ZohoTicket, ZohoSessionData } from './types';

interface Props {
  session: ZohoSessionData;
  isDark: boolean;
  tickets: ZohoTicket[];
  onNewTicket: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Open: { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' },
  'On Hold': { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  Closed: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'Waiting on customer feedback': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
};

function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function CustomerSidebar({ session, isDark, tickets, onNewTicket }: Props) {
  const { displayName, contactId, account, csmEmail, csmName } = session;
  const userTickets = tickets.filter(t => t.contactId === contactId);
  const totalTickets = userTickets.length;
  const activeTickets = userTickets.filter(t => t.status !== 'Closed').length;
  const overdueTickets = userTickets.filter(t => t.isOverDue).length;

  const statusCounts: Record<string, number> = {
    Open: 0,
    'On Hold': 0,
    Closed: 0,
    'Waiting on customer feedback': 0,
  };
  userTickets.forEach(ticket => {
    if (statusCounts[ticket.status] !== undefined) statusCounts[ticket.status]++;
  });

  const initials = getInitials(displayName || 'U');
  const companyName = account || userTickets[0]?.account?.accountName || null;

  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const sectionPadding = 'px-4 py-3';

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
      }}
    >
      {/* User Info */}
      <div className={sectionPadding}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.1) 100%)',
              border: '2px solid rgba(59,130,246,0.25)',
            }}
          >
            <span className="text-base font-bold" style={{ color: '#3b82f6' }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate" style={{ color: 'var(--ifm-color-content)' }}>
              {displayName || 'Customer'}
            </h3>
            {companyName && (
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 flex-shrink-0" style={{ color: '#3b82f6' }} />
                <span className="text-xs truncate" style={{ color: '#3b82f6' }}>{companyName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Inline stats */}
        <div className="flex items-center gap-0 mb-3" style={{ borderRadius: '0.5rem', overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}` }}>
          {[
            { label: 'Total', value: totalTickets, color: 'var(--ifm-color-content)' },
            { label: 'Active', value: activeTickets, color: '#E8B058' },
            { label: 'Overdue', value: overdueTickets, color: overdueTickets > 0 ? '#ef4444' : 'var(--ifm-color-content)' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 text-center py-2"
              style={{
                borderLeft: i > 0 ? `1px solid ${dividerColor}` : 'none',
                background: stat.label === 'Overdue' && overdueTickets > 0 ? 'rgba(239,68,68,0.06)' : 'transparent',
              }}
            >
              <div className="text-base font-bold leading-none" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onNewTicket}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" />
          New Support Ticket
        </button>
      </div>

      {/* CSM section */}
      <div style={{ borderTop: `1px solid ${dividerColor}` }} className={sectionPadding}>
        <div className="flex items-center gap-2 mb-2">
          <UserCircle className="w-3.5 h-3.5" style={{ color: '#E8B058' }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Your CSM
          </span>
        </div>
        {csmName && (
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--ifm-color-content)' }}>{csmName}</p>
        )}
        <a
          href={`mailto:${csmEmail ?? 'support@nxgen.io'}`}
          className="flex items-center gap-2 p-2 rounded-lg transition-all hover:opacity-80 no-underline"
          style={{ background: isDark ? 'rgba(232,176,88,0.08)' : 'rgba(232,176,88,0.06)', border: `1px solid rgba(232,176,88,0.15)` }}
        >
          <Mail className="w-3.5 h-3.5" style={{ color: '#E8B058' }} />
          <span className="text-xs flex-1" style={{ color: 'var(--ifm-color-content)' }}>Email your CSM</span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        </a>
      </div>

      {/* Status breakdown */}
      {totalTickets > 0 && (
        <div style={{ borderTop: `1px solid ${dividerColor}` }} className={sectionPadding}>
          <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            By Status
          </h4>
          <div className="space-y-1.5">
            {Object.entries(statusCounts)
              .filter(([, count]) => count > 0)
              .map(([status, count]) => {
                const st = STATUS_STYLES[status] ?? STATUS_STYLES.Open;
                const pct = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs" style={{ color: st.color }}>
                        {status === 'Waiting on customer feedback' ? 'Awaiting Reply' : status}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
                        {count}
                      </span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: st.color }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
