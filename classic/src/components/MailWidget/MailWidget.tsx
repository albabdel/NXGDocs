import React, { useEffect, useState } from 'react';
import { Mail, Loader, AlertCircle, ChevronRight, Inbox, Star } from 'lucide-react';
import { getRecentEmails, getUnreadCount } from './mailApi';
import type { MailMessage } from './types';

export interface MailWidgetProps {
  token: string;
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenFullView?: () => void;
  accentColor?: string;
  /**
   * When true (default), renders as a self-contained widget with its own header.
   * When false, renders just the content for embedding in a parent WidgetCard.
   */
  showHeader?: boolean;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function getSenderName(email: MailMessage): string {
  if (email.sender.firstName || email.sender.lastName) {
    return `${email.sender.firstName} ${email.sender.lastName}`.trim();
  }
  return email.sender.email.split('@')[0];
}

export default function MailWidget({
  token,
  isDark,
  isExpanded,
  onToggle,
  onOpenFullView,
  accentColor = '#3b82f6',
  showHeader = true,
}: MailWidgetProps) {
  const [emails, setEmails] = useState<MailMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isExpanded) return;

    setLoading(true);
    setError(null);

    Promise.all([getRecentEmails(token, 3), getUnreadCount(token)])
      .then(([emailsRes, unread]) => {
        setEmails(emailsRes);
        setUnreadCount(unread);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load emails'))
      .finally(() => setLoading(false));
  }, [token, isExpanded]);

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.15)',
  };

  // Render just the content for embedded mode (parent WidgetCard handles header)
  const renderContent = () => (
    <div className="p-4">
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader className="w-5 h-5 animate-spin" style={{ color: accentColor }} />
          <p className="text-xs mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Loading emails...
          </p>
        </div>
      )}

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl p-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <div>
            <p className="text-xs font-medium" style={{ color: '#ef4444' }}>
              Failed to load emails
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {error}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && emails.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <Inbox className="w-8 h-8 mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            No emails to display
          </p>
        </div>
      )}

      {!loading && !error && emails.length > 0 && (
        <div className="space-y-2">
          {emails.map(email => (
            <div
              key={email.id}
              className="rounded-lg p-3 transition-all hover:opacity-80 cursor-pointer"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                borderLeft: email.isRead ? 'none' : `3px solid ${accentColor}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs truncate ${email.isRead ? 'font-normal' : 'font-semibold'}`}
                      style={{ color: 'var(--ifm-color-content)' }}
                    >
                      {getSenderName(email)}
                    </span>
                    {email.isFlagged && <Star className="w-3 h-3" style={{ color: '#f59e0b' }} />}
                    {!email.isRead && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: accentColor }}
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs truncate mb-1 ${email.isRead ? 'font-normal' : 'font-medium'}`}
                    style={{ color: 'var(--ifm-color-content)' }}
                  >
                    {email.subject}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    {email.summary}
                  </p>
                </div>
                <span
                  className="text-xs flex-shrink-0"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  {formatTimestamp(email.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Open Mail Button */}
          <button
            onClick={onOpenFullView}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 mt-3"
            style={{
              background: accentColor,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Mail className="w-4 h-4" />
            Open Mail
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  // Embedded mode: just render content (parent WidgetCard handles header and wrapper)
  if (!showHeader) {
    return isExpanded ? renderContent() : null;
  }

  // Self-contained mode: render full widget with header
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
        ...cardBorder,
      }}
    >
      {/* Widget Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 transition-all hover:opacity-80"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          cursor: 'pointer',
          border: 'none',
          borderBottom: isExpanded
            ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
            : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            <Mail className="w-4 h-4" style={{ color: accentColor }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  background: accentColor,
                  color: '#fff',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Mail
            </h3>
            {unreadCount > 0 && !isExpanded && (
              <span className="text-xs" style={{ color: accentColor }}>
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Widget Content */}
      {isExpanded && renderContent()}
    </div>
  );
}
