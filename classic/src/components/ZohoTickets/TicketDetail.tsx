import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft, Loader, AlertCircle, Send, CheckCircle,
  RefreshCw, User, MessageSquare, ExternalLink,
} from 'lucide-react';
import { getTicket, getConversations, addComment, updateTicketStatus } from './zohoApi';
import type { ZohoTicket, ZohoConversationItem } from './types';

interface Props {
  token: string;
  ticketId: string;
  isDark: boolean;
  onBack: () => void;
}

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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Avatar({ name, photoURL, type, isDark }: {
  name: string; photoURL?: string; type?: string; isDark: boolean;
}) {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const isAgent = type === 'AGENT';
  return photoURL ? (
    <img
      src={photoURL}
      alt={name}
      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  ) : (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
      style={{
        background: isAgent ? 'rgba(232,176,88,0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
        color: isAgent ? '#E8B058' : 'var(--ifm-color-content-secondary)',
      }}
    >
      {initials || <User className="w-3.5 h-3.5" />}
    </div>
  );
}

export default function TicketDetail({ token, ticketId, isDark, onBack }: Props) {
  const [ticket, setTicket] = useState<ZohoTicket | null>(null);
  const [conversations, setConversations] = useState<ZohoConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [t, c] = await Promise.all([
        getTicket(token, ticketId),
        getConversations(token, ticketId),
      ]);
      setTicket(t);
      // Sort: description thread first, then by time ascending
      const sorted = (c.data ?? []).sort((a, b) => {
        if (a.isDescriptionThread) return -1;
        if (b.isDescriptionThread) return 1;
        const aTime = a.commentedTime ?? a.createdTime ?? '';
        const bTime = b.commentedTime ?? b.createdTime ?? '';
        return aTime.localeCompare(bTime);
      });
      setConversations(sorted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [ticketId]);

  async function handleAddComment() {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(token, ticketId, comment.trim());
      setComment('');
      setActionMsg('Comment added successfully.');
      await load();
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? `Error: ${e.message}` : 'Failed to add comment');
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionMsg(null), 4000);
    }
  }

  async function handleToggleStatus() {
    if (!ticket || statusUpdating) return;
    const newStatus = ticket.status === 'Closed' ? 'Open' : 'Closed';
    setStatusUpdating(true);
    try {
      const updated = await updateTicketStatus(token, ticketId, newStatus);
      setTicket(updated);
      setActionMsg(`Ticket marked as ${newStatus}.`);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? `Error: ${e.message}` : 'Failed to update status');
    } finally {
      setStatusUpdating(false);
      setTimeout(() => setActionMsg(null), 4000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Loading ticket...
        </span>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm hover:underline" style={{ color: '#E8B058', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft className="w-4 h-4" /> Back to tickets
        </button>
        <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#ef4444' }} />
          <p className="text-sm" style={{ color: '#ef4444' }}>{error ?? 'Ticket not found'}</p>
        </div>
      </div>
    );
  }

  const pStyle = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
  const sStyle = STATUS_STYLES[ticket.status] ?? STATUS_STYLES.Open;
  const nonDescConvs = conversations.filter(c => !c.isDescriptionThread);

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-sm transition-colors hover:opacity-80"
        style={{ color: '#E8B058', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to tickets
      </button>

      {/* Header card */}
      <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
        <div className="flex items-start gap-3 justify-between flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono font-semibold" style={{ color: '#E8B058' }}>
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
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
              {ticket.subject}
            </h2>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {ticket.email} · Created {formatDateTime(ticket.createdTime)} · {ticket.channel}
              {ticket.modifiedTime !== ticket.createdTime && ` · Updated ${formatDateTime(ticket.modifiedTime)}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={ticket.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 no-underline"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: 'var(--ifm-color-content-secondary)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <ExternalLink className="w-3 h-3" /> Zoho
            </a>
            <button
              onClick={handleToggleStatus}
              disabled={statusUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: ticket.status === 'Closed' ? 'rgba(232,176,88,0.12)' : 'rgba(34,197,94,0.12)',
                color: ticket.status === 'Closed' ? '#E8B058' : '#22c55e',
                border: `1px solid ${ticket.status === 'Closed' ? 'rgba(232,176,88,0.25)' : 'rgba(34,197,94,0.25)'}`,
                cursor: statusUpdating ? 'not-allowed' : 'pointer',
                opacity: statusUpdating ? 0.7 : 1,
              }}
            >
              {statusUpdating ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : ticket.status === 'Closed' ? (
                <RefreshCw className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {ticket.status === 'Closed' ? 'Reopen' : 'Close Ticket'}
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#E8B058' }}>
            Description
          </h3>
          <div
            className="text-sm prose-sm max-w-none"
            style={{ color: 'var(--ifm-color-content)', lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
        </div>
      )}

      {/* Conversation thread */}
      {nonDescConvs.length > 0 && (
        <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4" style={{ color: '#E8B058' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8B058' }}>
              Comments ({nonDescConvs.length})
            </h3>
          </div>
          <div className="space-y-4">
            {nonDescConvs.map(conv => {
              const person = conv.commenter ?? conv.author;
              const time = conv.commentedTime ?? conv.createdTime;
              const isAgent = conv.commenter?.type === 'AGENT' || conv.author?.type === 'AGENT';
              return (
                <div key={conv.id} className="flex gap-3">
                  <Avatar
                    name={person?.name ?? '?'}
                    photoURL={person?.photoURL}
                    type={conv.commenter?.type ?? conv.author?.type}
                    isDark={isDark}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                        {person?.name ?? person?.email ?? 'Unknown'}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{
                          background: isAgent ? 'rgba(232,176,88,0.1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                          color: isAgent ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                        }}
                      >
                        {isAgent ? 'Agent' : 'Customer'}
                      </span>
                      {time && (
                        <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {formatDateTime(time)}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-sm rounded-xl p-3"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        color: 'var(--ifm-color-content)',
                        lineHeight: '1.5',
                      }}
                      dangerouslySetInnerHTML={{ __html: conv.content }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add comment */}
      <div className="rounded-xl border p-5" style={cardStyle}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#E8B058' }}>
          Add Comment
        </h3>
        <textarea
          ref={commentRef}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
          style={{
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
            color: 'var(--ifm-color-content)',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment();
          }}
        />
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Cmd/Ctrl + Enter to submit
          </span>
          <button
            onClick={handleAddComment}
            disabled={!comment.trim() || submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: comment.trim() && !submitting ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
              color: comment.trim() && !submitting ? '#000' : 'var(--ifm-color-content-secondary)',
              cursor: !comment.trim() || submitting ? 'not-allowed' : 'pointer',
              opacity: !comment.trim() || submitting ? 0.6 : 1,
              border: 'none',
            }}
          >
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Comment
          </button>
        </div>
        {actionMsg && (
          <p
            className="text-xs mt-2"
            style={{ color: actionMsg.startsWith('Error') ? '#ef4444' : '#22c55e' }}
          >
            {actionMsg}
          </p>
        )}
      </div>
    </div>
  );
}
