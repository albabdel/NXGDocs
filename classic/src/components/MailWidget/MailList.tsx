import React, { useEffect, useState, useCallback } from 'react';
import { Loader, AlertCircle, Inbox, Star, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { listEmails, searchEmails, markAsRead } from './mailApi';
import type { MailMessage } from './types';

interface MailListProps {
  token: string;
  isDark: boolean;
  folderId: string;
  searchQuery?: string;
  onSelectEmail: (email: MailMessage) => void;
  selectedEmailId?: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function getSenderDisplay(email: MailMessage): string {
  if (email.sender.firstName || email.sender.lastName) {
    return `${email.sender.firstName} ${email.sender.lastName}`.trim();
  }
  return email.sender.email;
}

function getInitials(email: MailMessage): string {
  if (email.sender.firstName && email.sender.lastName) {
    return `${email.sender.firstName[0]}${email.sender.lastName[0]}`.toUpperCase();
  }
  return email.sender.email.slice(0, 2).toUpperCase();
}

export default function MailList({
  token,
  isDark,
  folderId,
  searchQuery = '',
  onSelectEmail,
  selectedEmailId,
}: MailListProps) {
  const [emails, setEmails] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = searchQuery
        ? await searchEmails(token, searchQuery, folderId)
        : await listEmails(token, folderId, page, 25);

      setEmails(response.data);
      setHasMore(response.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load emails');
    } finally {
      setLoading(false);
    }
  }, [token, folderId, page, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [folderId, searchQuery]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const handleSelectEmail = async (email: MailMessage) => {
    if (!email.isRead) {
      // Mark as read
      try {
        await markAsRead(token, email.id);
        setEmails(prev =>
          prev.map(e => (e.id === email.id ? { ...e, isRead: true } : e))
        );
      } catch {
        // Ignore error
      }
    }
    onSelectEmail(email);
  };

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
  };

  const selectedStyle = {
    background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.3)',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="w-6 h-6 animate-spin" style={{ color: '#3b82f6' }} />
          <p className="text-xs mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Loading emails...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4">
          <div
            className="flex items-start gap-3 rounded-xl p-4"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                Failed to load emails
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && emails.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Inbox className="w-12 h-12 mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
            {searchQuery ? 'No results found' : 'No emails'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {searchQuery
              ? 'Try a different search term'
              : 'This folder is empty'}
          </p>
        </div>
      )}

      {/* Email list */}
      {!loading && !error && emails.length > 0 && (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              {emails.map(email => {
                const isSelected = selectedEmailId === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className="w-full text-left p-4 transition-all hover:opacity-90"
                    style={{
                      background: isSelected ? selectedStyle.background : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderLeft: email.isRead ? 'none' : '3px solid #3b82f6',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                        style={{
                          background: email.isRead
                            ? isDark
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.08)'
                            : 'rgba(59,130,246,0.15)',
                          color: email.isRead
                            ? 'var(--ifm-color-content-secondary)'
                            : '#3b82f6',
                        }}
                      >
                        {getInitials(email)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-sm truncate ${email.isRead ? 'font-normal' : 'font-semibold'}`}
                            style={{ color: 'var(--ifm-color-content)' }}
                          >
                            {getSenderDisplay(email)}
                          </span>
                          <span
                            className="text-xs flex-shrink-0"
                            style={{ color: 'var(--ifm-color-content-secondary)' }}
                          >
                            {formatTimestamp(email.timestamp)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm truncate ${email.isRead ? 'font-normal' : 'font-medium'}`}
                            style={{ color: 'var(--ifm-color-content)' }}
                          >
                            {email.subject}
                          </p>
                          {email.isFlagged && <Star className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f59e0b' }} />}
                          {email.hasAttachment && (
                            <Paperclip className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                          )}
                        </div>

                        <p className="text-xs truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {email.summary}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {hasMore && (
            <div
              className="flex items-center justify-center gap-4 p-4 border-t"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
            >
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
                Page {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: hasMore ? 'var(--ifm-color-content)' : 'var(--ifm-color-content-secondary)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                  opacity: hasMore ? 1 : 0.5,
                  cursor: hasMore ? 'pointer' : 'not-allowed',
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
