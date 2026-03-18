import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Loader, AlertCircle, User, Mail, Clock, MessageSquare, Paperclip, ExternalLink, RefreshCw, Send, ChevronDown, Check } from 'lucide-react';
import { getTicket, getConversations, getAttachments, addComment, updateTicket } from './zohoApi';
import type { ZohoTicket, ZohoConversationItem, ZohoAttachment, ZohoStatus, ZohoAgent } from './types';

/** Decode HTML entities if the content is double-encoded (e.g. &lt;div&gt; → <div>) */
function decodeHtmlEntities(html: string): string {
  if (!html) return html;
  // If there are no real HTML tags but there are encoded entities, decode once
  if (!/<[a-zA-Z]/.test(html) && /&lt;|&amp;|&quot;|&#/.test(html)) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }
  return html;
}

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

function Skeleton({ width, height, rounded = '8px' }: { width: string; height: string; rounded?: string }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, rgba(128,128,128,0.1) 25%, rgba(128,128,128,0.2) 50%, rgba(128,128,128,0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

export default function TicketDetailModal({ ticketId, isDark, onClose, token }: Props) {
  const [ticket, setTicket] = useState<ZohoTicket | null>(null);
  const [conversations, setConversations] = useState<ZohoConversationItem[]>([]);
  const [attachments, setAttachments] = useState<ZohoAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [agents, setAgents] = useState<ZohoAgent[]>([]);
  const [statuses, setStatuses] = useState<ZohoStatus[]>([]);
  const [updating, setUpdating] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    return () => {
      previousActiveElement.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElementsRef.current = Array.from(focusable);
      if (focusableElementsRef.current.length > 0) {
        focusableElementsRef.current[0].focus();
      }
    }
  }, [loading, ticket, activeTab]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusable = focusableElementsRef.current;
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const loadTicketData = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError(null);
    try {
      const [ticketRes, convRes, attRes] = await Promise.all([
        getTicket({ id: ticketId, isCustomer: false, token }),
        getConversations({ ticketId, isCustomer: false, token }),
        getAttachments({ ticketId, isCustomer: false, token }),
      ]);
      setTicket(ticketRes);
      setConversations(convRes.data ?? []);
      setAttachments(attRes.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }, [ticketId, token]);

  useEffect(() => {
    loadTicketData();
  }, [loadTicketData]);

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

  async function handleStatusChange(newStatus: string) {
    if (!ticket || newStatus === ticket.status) return;
    setUpdating(true);
    try {
      await updateTicket({ ticketId: ticket.id, fields: { status: newStatus }, isCustomer: false, token });
      setTicket(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setUpdating(false);
      setShowStatusDropdown(false);
    }
  }

  async function handleAssigneeChange(agentId: string | null) {
    if (!ticket) return;
    setUpdating(true);
    try {
      await updateTicket({ ticketId: ticket.id, fields: { assigneeId: agentId ?? undefined }, isCustomer: false, token });
      const agent = agents.find(a => a.id === agentId);
      setTicket(prev => prev ? { ...prev, assigneeId: agentId, assignee: agent || null } : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update assignee');
    } finally {
      setUpdating(false);
      setShowAssigneeDropdown(false);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: overlayBg,
        backdropFilter: 'blur(4px)',
        animation: 'modal-fade-in 0.2s ease-out',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes skeleton-pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div
        ref={modalRef}
        className="w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: modalBg,
          border: `1px solid ${borderColor}`,
          maxWidth: '900px',
          width: '90%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modal-slide-up 0.25s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: isDark ? 'rgba(232,176,88,0.08)' : 'rgba(232,176,88,0.05)',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <h2 id="modal-title" className="text-base font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              {loading ? 'Loading...' : ticket ? `#${ticket.ticketNumber}` : 'Ticket Details'}
            </h2>
            {ticket && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(v => !v)}
                  disabled={updating}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all hover:opacity-80"
                  style={{ background: sStyle.bg, color: sStyle.color, cursor: updating ? 'wait' : 'pointer', border: 'none' }}
                >
                  {ticket.status}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStatusDropdown && (
                  <div
                    className="absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-20 min-w-[180px]"
                    style={{ background: modalBg, border: `1px solid ${borderColor}` }}
                  >
                    {Object.keys(STATUS_STYLES).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:opacity-80"
                        style={{ color: 'var(--ifm-color-content)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ color: STATUS_STYLES[status]?.color }}>{status}</span>
                        {ticket.status === status && <Check className="w-3 h-3" style={{ color: '#22c55e' }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {loading && (
            <div className="p-6">
              <Skeleton width="60%" height="24px" rounded="4px" />
              <div className="flex gap-2 mt-3">
                <Skeleton width="80px" height="20px" rounded="10px" />
                <Skeleton width="60px" height="20px" rounded="10px" />
              </div>
              <div className="mt-6 space-y-3">
                <Skeleton width="100%" height="16px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="80%" height="16px" />
              </div>
              <div className="mt-6">
                <Skeleton width="100%" height="200px" rounded="12px" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Failed to load ticket</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>{error}</p>
                <button
                  onClick={loadTicketData}
                  className="mt-2 px-3 py-1 rounded-lg text-xs"
                  style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058', border: 'none', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && ticket && (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6">
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
                  {(['details', 'comments', 'history'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-4 py-2 text-sm font-medium transition-all"
                      style={{
                        color: activeTab === tab ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: activeTab === tab ? '2px solid #E8B058' : '2px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab === 'comments' && <MessageSquare className="w-3 h-3 inline mr-1" />}
                      {tab} {tab === 'comments' && `(${conversations.length})`}
                    </button>
                  ))}
                </div>

                {activeTab === 'details' && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    }}
                  >
                    {ticket.description ? (
                      <div
                        className="text-sm prose-sm max-w-none ticket-content"
                        style={{ color: 'var(--ifm-color-content)', lineHeight: '1.6' }}
                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(ticket.description) }}
                      />
                    ) : (
                      <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        No description provided.
                      </p>
                    )}
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
                          <div
                            className="text-sm ticket-content"
                            style={{ color: 'var(--ifm-color-content)', lineHeight: '1.5' }}
                            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(conv.content) }}
                          />
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

                {activeTab === 'history' && (
                  <div className="rounded-xl p-4 text-center" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      Ticket history available in Zoho Desk
                    </p>
                    {ticket.webUrl && (
                      <a
                        href={`${ticket.webUrl}/history`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs"
                        style={{ color: '#E8B058' }}
                      >
                        View in Zoho <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
                className="w-full md:w-72 p-6 border-t md:border-t-0 md:border-l flex-shrink-0"
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
                        {ticket.contact ? `${ticket.contact.firstName} ${ticket.contact.lastName}`.trim() : (ticket.email ?? 'Unknown').split('@')[0]}
                      </span>
                    </div>
                    <p className="text-xs mt-1 ml-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      <Mail className="w-3 h-3 inline mr-1" />
                      {ticket.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Assignee</p>
                    <div className="relative">
                      <button
                        onClick={() => setShowAssigneeDropdown(v => !v)}
                        disabled={updating}
                        className="inline-flex items-center gap-1 text-sm transition-all hover:opacity-80"
                        style={{
                          color: 'var(--ifm-color-content)',
                          background: 'none',
                          border: 'none',
                          cursor: updating ? 'wait' : 'pointer',
                          padding: 0,
                        }}
                      >
                        {ticket.assignee?.name ?? (ticket.assignee ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` : 'Unassigned')}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showAssigneeDropdown && (
                        <div
                          className="absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-20 min-w-[160px]"
                          style={{ background: modalBg, border: `1px solid ${borderColor}` }}
                        >
                          <button
                            onClick={() => handleAssigneeChange(null)}
                            className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:opacity-80"
                            style={{ color: 'var(--ifm-color-content)', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <span>Unassigned</span>
                            {!ticket.assigneeId && <Check className="w-3 h-3" style={{ color: '#22c55e' }} />}
                          </button>
                          {agents.map(agent => (
                            <button
                              key={agent.id}
                              onClick={() => handleAssigneeChange(agent.id)}
                              className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:opacity-80"
                              style={{ color: 'var(--ifm-color-content)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <span>{agent.name}</span>
                              {ticket.assigneeId === agent.id && <Check className="w-3 h-3" style={{ color: '#22c55e' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
    </div>
  );
}
