import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  Reply,
  ReplyAll,
  Forward,
  Star,
  Paperclip,
  Download,
  User,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';
import { getEmail, getEmailThread, markAsRead, markAsUnread, deleteEmail } from './mailApi';
import type { MailMessage, MailAttachment } from './types';

interface MailThreadProps {
  token: string;
  isDark: boolean;
  emailId: string;
  onBack: () => void;
  onReply: (email: MailMessage) => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

function AttachmentItem({ attachment, isDark }: { attachment: MailAttachment; isDark: boolean }) {
  const isImage = attachment.contentType.startsWith('image/');

  return (
    <div
      className="flex items-center gap-3 rounded-lg p-3"
      style={{
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: isImage ? 'rgba(232,176,88,0.1)' : 'rgba(107,114,128,0.1)' }}
      >
        {isImage ? (
          <Paperclip className="w-4 h-4" style={{ color: '#E8B058' }} />
        ) : (
          <Paperclip className="w-4 h-4" style={{ color: '#6b7280' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
          {attachment.name}
        </p>
        <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {formatBytes(attachment.size)}
        </p>
      </div>
      <a
        href={attachment.href}
        target="_blank"
        rel="noopener noreferrer"
        title="Download"
        className="p-1.5 rounded-lg transition-all hover:opacity-80 inline-flex"
        style={{
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          color: 'var(--ifm-color-content-secondary)',
          border: 'none',
        }}
      >
        <Download className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export default function MailThread({ token, isDark, emailId, onBack, onReply }: MailThreadProps) {
  const [email, setEmail] = useState<MailMessage | null>(null);
  const [thread, setThread] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getEmail(token, emailId), getEmailThread(token, emailId)])
      .then(([emailData, threadData]) => {
        setEmail(emailData);
        setThread(threadData.length > 1 ? threadData : []);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load email'))
      .finally(() => setLoading(false));
  }, [token, emailId]);

  const handleToggleFlagged = async () => {
    if (!email) return;
    // Toggle flagged status (mock)
    setEmail({ ...email, isFlagged: !email.isFlagged });
  };

  const handleMarkUnread = async () => {
    if (!email) return;
    try {
      await markAsUnread(token, email.id);
      setEmail({ ...email, isRead: false });
    } catch {
      // Ignore
    }
    setShowActions(false);
  };

  const handleDelete = async () => {
    if (!email) return;
    try {
      await deleteEmail(token, email.id);
      onBack();
    } catch {
      // Ignore
    }
    setShowActions(false);
  };

  const handleReply = () => {
    if (email) onReply(email);
  };

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };

  const accentColor = '#3b82f6';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm transition-all hover:opacity-80"
          style={{ color: accentColor, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleReply}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: accentColor,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Reply className="w-3.5 h-3.5" />
            Reply
          </button>

          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showActions && (
            <div
              className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden shadow-lg z-10"
              style={{
                background: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                minWidth: 120,
              }}
            >
              <button
                onClick={handleToggleFlagged}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: 'var(--ifm-color-content)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Star className="w-3.5 h-3.5" style={{ color: email?.isFlagged ? '#f59e0b' : 'inherit' }} />
                {email?.isFlagged ? 'Unstar' : 'Star'}
              </button>
              <button
                onClick={handleMarkUnread}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: 'var(--ifm-color-content)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mark as unread
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-all hover:opacity-80"
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="w-6 h-6 animate-spin" style={{ color: accentColor }} />
          <p className="text-xs mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Loading email...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4">
          <div
            className="flex items-start gap-3 rounded-xl p-4"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                Failed to load email
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email content */}
      {!loading && !error && email && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Thread indicator */}
          {thread.length > 1 && (
            <div className="mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <Reply className="w-3 h-3" />
                {thread.length} messages in this thread
              </span>
            </div>
          )}

          {/* Email header */}
          <div
            className="rounded-xl border p-5 mb-4"
            style={cardStyle}
          >
            <div className="flex items-start gap-3 mb-4">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
                style={{
                  background: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {getInitials(email)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                    {getSenderDisplay(email)}
                  </span>
                  {email.isFlagged && <Star className="w-4 h-4" style={{ color: '#f59e0b' }} />}
                </div>
                <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {email.sender.email}
                </p>
              </div>

              <span className="text-xs flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {formatDateTime(email.timestamp)}
              </span>
            </div>

            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
              {email.subject}
            </h2>

            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              <span>
                To: {email.to.join(', ')}
              </span>
              {email.cc && email.cc.length > 0 && (
                <span>
                  Cc: {email.cc.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Email body */}
          <div
            className="rounded-xl border p-5 mb-4"
            style={cardStyle}
          >
            <div
              className="prose-sm max-w-none text-sm"
              style={{ color: 'var(--ifm-color-content)', lineHeight: '1.7' }}
              dangerouslySetInnerHTML={{
                __html: email.content || `<p>${email.summary}</p>`,
              }}
            />
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#E8B058' }}>
                <Paperclip className="w-3.5 h-3.5" />
                Attachments ({email.attachments.length})
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {email.attachments.map(att => (
                  <AttachmentItem key={att.id} attachment={att} isDark={isDark} />
                ))}
              </div>
            </div>
          )}

          {/* Thread messages */}
          {thread.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Thread History
              </h3>
              {thread.slice(0, -1).map((msg, idx) => (
                <div
                  key={msg.id}
                  className="rounded-xl border p-4"
                  style={{
                    ...cardStyle,
                    opacity: 0.8,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        color: 'var(--ifm-color-content-secondary)',
                      }}
                    >
                      {getInitials(msg)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                        {getSenderDisplay(msg)}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {formatDateTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    {msg.summary}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleReply}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: accentColor,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
            <button
              onClick={() => onReply(email)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <ReplyAll className="w-4 h-4" />
              Reply All
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <Forward className="w-4 h-4" />
              Forward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
