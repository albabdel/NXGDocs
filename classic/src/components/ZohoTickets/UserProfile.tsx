import React from 'react';
import { User, Ticket } from 'lucide-react';
import type { ZohoTicket } from './types';

interface Props {
  displayName: string;
  contactId: string;
  isDark: boolean;
  tickets: ZohoTicket[];
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

export default function UserProfile({ displayName, contactId, isDark, tickets }: Props) {
  const userTickets = tickets.filter(t => t.contactId === contactId);
  const totalTickets = userTickets.length;

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

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  const initials = getInitials(displayName || 'Unknown');

  return (
    <div className="rounded-xl border p-5" style={cardStyle}>
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(232,176,88,0.15)',
            color: '#E8B058',
          }}
        >
          {initials ? (
            <span className="text-lg font-bold">{initials}</span>
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate" style={{ color: 'var(--ifm-color-content)' }}>
            {displayName || 'Unknown User'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Ticket className="w-3.5 h-3.5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {totalTickets} ticket{totalTickets !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => {
          const style = STATUS_STYLES[status] ?? STATUS_STYLES.Open;
          return (
            <div
              key={status}
              className="flex flex-col items-center justify-center rounded-xl p-3 text-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <span
                className="text-xl font-bold mb-1"
                style={{ color: style.color }}
              >
                {count}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: style.bg, color: style.color }}
              >
                {status === 'Waiting on customer feedback' ? 'Waiting' : status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
