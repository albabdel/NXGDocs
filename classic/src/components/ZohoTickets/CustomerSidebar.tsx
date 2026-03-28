import React from 'react';
import { User, Ticket, Building2, Plus, Mail, Clock, ChevronRight, AlertCircle, UserCircle } from 'lucide-react';
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
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
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
    if (statusCounts[ticket.status] !== undefined) {
      statusCounts[ticket.status]++;
    }
  });

  const initials = getInitials(displayName || 'U');
  const companyName = account || userTickets[0]?.account?.accountName || null;

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <div className="rounded-xl border p-5" style={cardStyle}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.1) 100%)',
              border: '2px solid rgba(59,130,246,0.3)',
            }}
          >
            <span className="text-xl font-bold" style={{ color: '#3b82f6' }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate" style={{ color: 'var(--ifm-color-content)' }}>
              {displayName || 'Customer'}
            </h3>
            {companyName && (
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                <span className="text-xs font-medium truncate" style={{ color: '#3b82f6' }}>
                  {companyName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>{totalTickets}</div>
            <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Total</div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
            <div className="text-xl font-bold" style={{ color: '#E8B058' }}>{activeTickets}</div>
            <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Active</div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: overdueTickets > 0 ? 'rgba(239,68,68,0.1)' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)') }}>
            <div className="text-xl font-bold" style={{ color: overdueTickets > 0 ? '#ef4444' : 'var(--ifm-color-content)' }}>{overdueTickets}</div>
            <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Overdue</div>
          </div>
        </div>

        {/* New Ticket Button */}
        <button
          onClick={onNewTicket}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
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

      {/* CSM Card */}
      {csmEmail && (
        <div
          className="rounded-xl border p-4"
          style={{
            background: isDark ? 'rgba(232,176,88,0.06)' : 'rgba(232,176,88,0.04)',
            borderColor: isDark ? 'rgba(232,176,88,0.15)' : 'rgba(232,176,88,0.2)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(232,176,88,0.15)' }}
            >
              <UserCircle className="w-4 h-4" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                Your CSM
              </h4>
              {csmName && (
                <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {csmName}
                </p>
              )}
            </div>
          </div>
          <a
            href={`mailto:${csmEmail}`}
            className="flex items-center gap-2 p-2.5 rounded-lg transition-all hover:opacity-80 no-underline"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
          >
            <Mail className="w-4 h-4" style={{ color: '#E8B058' }} />
            <span className="text-sm flex-1" style={{ color: 'var(--ifm-color-content)' }}>Email your CSM</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          </a>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="rounded-xl border p-4" style={cardStyle}>
        <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Tickets by Status
        </h4>
        <div className="space-y-2">
          {Object.entries(statusCounts).map(([status, count]) => {
            const style = STATUS_STYLES[status] ?? STATUS_STYLES.Open;
            const percentage = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
            return (
              <div key={status} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: style.color }}>
                      {status === 'Waiting on customer feedback' ? 'Awaiting Reply' : status}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: style.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border p-4" style={cardStyle}>
        <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Quick Actions
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={onNewTicket}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
          >
            <Plus className="w-4 h-4" style={{ color: '#3b82f6' }} />
            <span className="text-sm flex-1 text-left" style={{ color: 'var(--ifm-color-content)' }}>Create New Ticket</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          </button>
          <a
            href={`mailto:${csmEmail ?? 'support@nxgen.io'}`}
            className="flex items-center gap-3 p-2.5 rounded-lg transition-all hover:opacity-80 no-underline"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
          >
            <Mail className="w-4 h-4" style={{ color: '#E8B058' }} />
            <span className="text-sm flex-1" style={{ color: 'var(--ifm-color-content)' }}>Email your CSM</span>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          </a>
        </div>
      </div>

      {/* Need Help Card */}
      <div
        className="rounded-xl border p-4"
        style={{
          background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
          borderColor: 'rgba(59,130,246,0.2)',
        }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#3b82f6' }} />
          <div>
            <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--ifm-color-content)' }}>Need Help?</h4>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Our support team typically responds within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
