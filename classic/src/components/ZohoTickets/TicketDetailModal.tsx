import React, { useEffect, useState } from 'react';
import { X, Loader, AlertCircle, User, Mail, Clock, Phone, MessageSquare, Paperclip, ExternalLink, RefreshCw, Send } from 'lucide-react';
import { getTicket, getConversations, getAttachments, addComment, updateTicket } from './zohoApi';
import type { ZohoTicket, ZohoConversationItem, ZohoAttachment, ZohoStatus } from './types';

interface Props {
  ticketId: string | null;
  isDark: boolean;
  onClose: () => void;
  token?: string;
}

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  High: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  Medium: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Low: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Open: { bg: 'rgba(232,176,88,0.12)', color: '#E8B058' },
  'On Hold': { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  Closed: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'Waiting on customer feedback': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TicketDetailModal({ ticketId, isDark, onClose, token }: Props) {
  const [ticket, setTicket] = useState<ZohoTicket | null>(null);
  const [conversations, setConversations] = useState<ZohoConversationItem[]>([]);
  const [attachments, setAttachments] = useState<ZohoAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  useEffect(() => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getTicket({ id: ticketId, isCustomer: false, token }),
      getConversations({ ticketId, isCustomer: false, token }),
      getAttachments({ ticketId, isCustomer: false, token }),
    ])
      .then(([ticketRes, convRes, attRes]) => {
        setTicket(ticketRes);
        setConversations(convRes.data ?? []);
        setAttachments(attRes.data ?? []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticketId, token]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketId || !comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment({ ticketId, content: comment.trim(), isPublic: true, isCustomer: false, token });
      const convRes = await getConversations({ ticketId, isCustomer: false, token });
      setConversations(convRes.data ?? []);
      setComment('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }

  const overlayBg = 'rgba(0,0,0,0.7)';
  const modalBg = isDark ? '#0d1117' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)';

  if (!ticketId) return null;

  const pStyle = ticket ? (PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium) : PRIORITY_STYLES.Medium;
  const sStyle = ticket ? (STATUS_STYLES[ticket.status] ?? STATUS_STYLES.Open) : STATUS_STYLES.Open;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: overlayBg, backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl my-8"
        style={{ background: modalBg, border: `1px solid ${borderColor}` }}
      >
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 z-10"
          style={{
            background: isDark ? 'rgba(232,176,88,0.08)' : 'rgba(232,176,88,0.05)',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              {loading ? 'Loading...' : ticket ? `#${ticket.ticketNumber}` : 'Ticket Details'}
            </h2>
            {ticket && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: sStyle.bg, color: sStyle.color }}
              >
                {ticket.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ticket?.webUrl && (
              <a
                href={ticket.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  color: 'var(--ifm-color-content-secondary)',
                  textDecoration: 'none',
                }}
              >
                Open in Zoho <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
            <span className="ml-3 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Loading ticket...</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Failed to load ticket</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && ticket && (
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--ifm-color-content)' }}>
                  {ticket.subject}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: pStyle.bg, color: pStyle.color }}
                  >
                    {ticket.priority} Priority
                  </span>
                  <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    via {ticket.channel}
                  </span>
                </div>
              </div>

              <div className="flex border-b mb-4" style={{ borderColor }}>
                <button
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    color: activeTab === 'details' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                    borderBottom: activeTab === 'details' ? '2px solid #E8B058' : '2px solid transparent',
                  }}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className="px-4 py-2 text-sm font-medium transition-all flex items-center gap-1"
                  style={{
                    color: activeTab === 'comments' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                    borderBottom: activeTab === 'comments' ? '2px solid #E8B058' : '2px solid transparent',
                  }}
                >
                  <MessageSquare className="w-3 h-3" />
                  Comments ({conversations.length})
                </button>
              </div>

              {activeTab === 'details' && (
                <div
                  className="rounded-xl p-4 mb-6"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ifm-color-content)' }}>
                    {ticket.description || 'No description provided.'}
                  </p>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      No comments yet.
                    </p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className="rounded-xl p-4"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-3 h-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                            {conv.commenter?.name || conv.author?.name || 'Unknown'}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            {formatDateTime(conv.commentedTime || conv.createdTime || '')}
                          </span>
                          {!conv.isPublic && (
                            <span
                              className="px-1.5 py-0.5 rounded text-xs"
                              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                            >
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ifm-color-content)' }}>
                          {conv.content}
                        </p>
                      </div>
                    ))
                  )}

                  <form onSubmit={handleAddComment} className="mt-4">
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full rounded-xl p-3 text-sm"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                        color: 'var(--ifm-color-content)',
                        resize: 'vertical',
                      }}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!comment.trim() || submitting}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: comment.trim() && !submitting ? '#E8B058' : 'rgba(232,176,88,0.3)',
                          color: comment.trim() && !submitting ? '#000' : 'rgba(0,0,0,0.4)',
                          cursor: !comment.trim() || submitting ? 'not-allowed' : 'pointer',
                          border: 'none',
                        }}
                      >
                        {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Comment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--ifm-color-content)' }}>
                    <Paperclip className="w-4 h-4" />
                    Attachments ({attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map(att => (
                      <a
                        key={att.id}
                        href={att.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                          color: 'var(--ifm-color-content)',
                          textDecoration: 'none',
                        }}
                      >
                        <Paperclip className="w-3 h-3" />
                        {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="w-full lg:w-72 p-6 border-t lg:border-t-0 lg:border-l"
              style={{ borderColor, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Ticket Info
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Requester</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" style={{ color: '#E8B058' }} />
                    <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {ticket.contact ? `${ticket.contact.firstName} ${ticket.contact.lastName}`.trim() : ticket.email.split('@')[0]}
                    </span>
                  </div>
                  <p className="text-xs mt-1 ml-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    <Mail className="w-3 h-3 inline mr-1" />
                    {ticket.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Assignee</p>
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {ticket.assignee?.name ?? (ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : 'Unassigned')}
                  </span>
                </div>

                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Created</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                    <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {formatDateTime(ticket.createdTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Last Updated</p>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                    <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {formatDateTime(ticket.modifiedTime)}
                    </span>
                  </div>
                </div>

                {ticket.closedTime && (
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Closed</p>
                    <span className="text-sm" style={{ color: '#22c55e' }}>
                      {formatDateTime(ticket.closedTime)}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Thread Count</p>
                  <span className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {ticket.threadCount} threads
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
