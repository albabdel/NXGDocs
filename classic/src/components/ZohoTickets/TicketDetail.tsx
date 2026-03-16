import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ArrowLeft, Loader, AlertCircle, Send, User, MessageSquare,
  ExternalLink, Paperclip, X, Lock, Globe, Languages, ChevronDown,
  ImageIcon, Download, Eye, EyeOff, Plus, Clock, FileText, Zap,
} from 'lucide-react';
import {
  getTicket, getConversations, addComment, updateTicket,
  listStatuses, listAgents, getAttachments, uploadAttachment, translateText,
} from './zohoApi';
import type { ZohoTicket, ZohoConversationItem, ZohoAgent, ZohoStatus, ZohoAttachment } from './types';
import CRMPanel from '../CRMPanel/CRMPanel';
import {
  getCannedResponsesByCategory,
  calculateSLARemaining,
  formatSLARemaining,
} from './supportConfig';

interface Props {
  token: string;
  ticketId: string;
  isDark: boolean;
  isCustomer?: boolean;
  onBack: () => void;
}

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  Critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  High:     { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  Medium:   { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Low:      { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

function SLATimer({ ticket, isDark }: { ticket: ZohoTicket; isDark: boolean }) {
  const [slaData, setSlaData] = useState<ReturnType<typeof calculateSLARemaining>>(null);
  
  useEffect(() => {
    const updateSLA = () => {
      const responseSLA = calculateSLARemaining(ticket.createdTime, ticket.priority, 'response');
      setSlaData(responseSLA);
    };
    
    updateSLA();
    const interval = setInterval(updateSLA, 60000);
    return () => clearInterval(interval);
  }, [ticket.createdTime, ticket.priority]);
  
  if (!slaData || ticket.status === 'Closed') return null;
  
  const isWarning = slaData.percentage < 30 && !slaData.isBreached;
  const bgColor = slaData.isBreached 
    ? 'rgba(239,68,68,0.12)' 
    : isWarning 
      ? 'rgba(245,158,11,0.12)' 
      : 'rgba(34,197,94,0.12)';
  const textColor = slaData.isBreached 
    ? '#ef4444' 
    : isWarning 
      ? '#f59e0b' 
      : '#22c55e';
  const borderColor = slaData.isBreached 
    ? 'rgba(239,68,68,0.3)' 
    : isWarning 
      ? 'rgba(245,158,11,0.3)' 
      : 'rgba(34,197,94,0.3)';
  
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bgColor, color: textColor, border: `1px solid ${borderColor}` }}
    >
      <Clock className="w-3 h-3" />
      {formatSLARemaining(slaData.remainingMs)}
    </div>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function htmlToText(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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

function TranslateButton({ text, isDark }: { text: string | null | undefined; isDark: boolean }) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const plain = htmlToText(text);

  async function handleTranslate() {
    if (translated) { setShow(s => !s); return; }
    setLoading(true);
    try {
      const result = await translateText(plain);
      setTranslated(result);
      setShow(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleTranslate}
        title="Translate to English"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-2 transition-all hover:opacity-80"
        style={{
          background: show ? 'rgba(59,130,246,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
          color: show ? '#3b82f6' : 'var(--ifm-color-content-secondary)',
          border: `1px solid ${show ? 'rgba(59,130,246,0.3)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
          cursor: 'pointer',
        }}
      >
        {loading ? <Loader className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
        {show ? 'Original' : 'Translate'}
      </button>
      {show && translated && (
        <div
          className="mt-2 p-3 rounded-lg text-sm"
          style={{
            background: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: 'var(--ifm-color-content)',
            lineHeight: '1.5',
          }}
        >
          <p className="text-xs mb-1.5" style={{ color: '#3b82f6' }}>English (translated)</p>
          {translated}
        </div>
      )}
    </div>
  );
}

function AttachmentItem({ att, token, isDark }: { att: ZohoAttachment; token: string; isDark: boolean }) {
  const [lightbox, setLightbox] = useState(false);
  const isImage = IMAGE_TYPES.includes(att.fileType);

  return (
    <>
      <div
        className="flex items-center gap-3 rounded-xl p-3"
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
            <ImageIcon className="w-4 h-4" style={{ color: '#E8B058' }} />
          ) : (
            <Paperclip className="w-4 h-4" style={{ color: '#6b7280' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
            {att.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            {formatBytes(parseInt(att.size, 10) || 0)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isImage && (
            <button
              onClick={() => setLightbox(true)}
              title="Preview"
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058', cursor: 'pointer', border: 'none' }}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          <a
            href={att.href}
            target="_blank"
            rel="noopener noreferrer"
            title="Download"
            className="p-1.5 rounded-lg transition-all hover:opacity-80 inline-flex"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: 'var(--ifm-color-content-secondary)', border: 'none' }}
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={att.previewHref ?? att.href}
            alt={att.name}
            className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  isDark: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function StyledSelect({ value, onChange, isDark, children, style }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        color: 'var(--ifm-color-content)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        borderRadius: '0.5rem',
        padding: '0.25rem 0.6rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        outline: 'none',
        ...style,
      }}
    >
      {children}
    </select>
  );
}

export default function TicketDetail({ token, ticketId, isDark, isCustomer, onBack }: Props) {
  const [ticket, setTicket] = useState<ZohoTicket | null>(null);
  const [conversations, setConversations] = useState<ZohoConversationItem[]>([]);
  const [attachments, setAttachments] = useState<ZohoAttachment[]>([]);
  const [agents, setAgents] = useState<ZohoAgent[]>([]);
  const [statuses, setStatuses] = useState<ZohoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isPublicComment, setIsPublicComment] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attachFile, setAttachFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAssignee, setUpdatingAssignee] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  const showMsg = useCallback((text: string, ok = true) => {
    setActionMsg({ text, ok });
    setTimeout(() => setActionMsg(null), 4000);
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const agentPromise = (!isCustomer && !agents.length)
        ? listAgents(token).catch(() => ({ data: [] }))
        : Promise.resolve({ data: agents });
      const statusPromise = (!isCustomer && !statuses.length)
        ? listStatuses(token).catch(() => ({ data: [] }))
        : Promise.resolve({ data: statuses });

      const [t, c, a, st, ag] = await Promise.all([
        getTicket(token, ticketId),
        getConversations(token, ticketId),
        getAttachments(token, ticketId).catch(() => ({ data: [] })),
        statusPromise,
        agentPromise,
      ]);
      setTicket(t);
      const sorted = (c.data ?? []).sort((a, b) => {
        if (a.isDescriptionThread) return -1;
        if (b.isDescriptionThread) return 1;
        const aTime = a.commentedTime ?? a.createdTime ?? '';
        const bTime = b.commentedTime ?? b.createdTime ?? '';
        return aTime.localeCompare(bTime);
      });
      setConversations(sorted);
      setAttachments(a.data ?? []);
      if (!isCustomer && !statuses.length) setStatuses(st.data ?? []);
      if (!isCustomer && !agents.length) setAgents(ag.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [ticketId]);

  async function handleStatusChange(newStatus: string) {
    if (!ticket || updatingStatus || newStatus === ticket.status) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicket(token, ticketId, { status: newStatus });
      setTicket(updated);
      showMsg(`Status changed to ${newStatus}.`);
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : 'Failed to update status', false);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAssigneeChange(assigneeId: string) {
    if (!ticket || updatingAssignee) return;
    setUpdatingAssignee(true);
    try {
      const updated = await updateTicket(token, ticketId, { assigneeId: assigneeId || '' });
      setTicket({ ...updated, assignee: agents.find(a => a.id === assigneeId) ? {
        id: assigneeId,
        firstName: agents.find(a => a.id === assigneeId)?.firstName ?? '',
        lastName: agents.find(a => a.id === assigneeId)?.lastName ?? '',
        name: agents.find(a => a.id === assigneeId)?.name ?? '',
        email: agents.find(a => a.id === assigneeId)?.email ?? '',
      } : null });
      showMsg(`Ticket assigned.`);
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : 'Failed to assign', false);
    } finally {
      setUpdatingAssignee(false);
    }
  }

  async function handleAddComment() {
    if ((!comment.trim() && !attachFile) || submitting) return;
    setSubmitting(true);
    try {
      if (comment.trim()) {
        await addComment(token, ticketId, comment.trim(), isPublicComment);
      }
      if (attachFile) {
        setUploading(true);
        await uploadAttachment(token, ticketId, attachFile);
        setAttachFile(null);
        setUploading(false);
      }
      setComment('');
      showMsg('Comment added.');
      await load();
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : 'Failed to add comment', false);
      setUploading(false);
    } finally {
      setSubmitting(false);
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
  const nonDescConvs = conversations.filter(c => !c.isDescriptionThread);

  const statusColor = statuses.find(s => s.displayName === ticket.status)?.colorCode;

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

      {/* Main content grid: Ticket detail on left, CRM panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Header card */}
          <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
        <div className="flex items-start gap-3 justify-between flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono font-semibold" style={{ color: '#E8B058' }}>
                #{ticket.ticketNumber}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: statusColor ? `${statusColor}22` : 'rgba(232,176,88,0.12)',
                  color: statusColor ?? '#E8B058',
                }}
              >
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
              <SLATimer ticket={ticket} isDark={isDark} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
              {ticket.subject}
            </h2>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {ticket.email} · Created {formatDateTime(ticket.createdTime)} · {ticket.channel}
              {ticket.modifiedTime !== ticket.createdTime && ` · Updated ${formatDateTime(ticket.modifiedTime)}`}
            </p>
          </div>
          <a
            href={ticket.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 no-underline flex-shrink-0"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            <ExternalLink className="w-3 h-3" /> Zoho
          </a>
        </div>
      </div>

      {/* Properties panel — agents only (read-only summary for customers) */}
      {isCustomer ? (
        <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
          <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <span>Status: <strong style={{ color: 'var(--ifm-color-content)' }}>{ticket.status}</strong></span>
            <span>Priority: <strong style={{ color: 'var(--ifm-color-content)' }}>{ticket.priority}</strong></span>
            <span>Channel: <strong style={{ color: 'var(--ifm-color-content)' }}>{ticket.channel}</strong></span>
          </div>
        </div>
      ) : null}
      {!isCustomer && <div className="rounded-xl border mb-4 overflow-hidden" style={cardStyle}>
        <button
          className="w-full flex items-center justify-between px-5 py-3 text-left"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content)' }}
          onClick={() => setShowProperties(s => !s)}
        >
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8B058' }}>
            Ticket Properties
          </span>
          <ChevronDown
            className="w-4 h-4 transition-transform"
            style={{ color: '#E8B058', transform: showProperties ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {showProperties && (
          <div className="px-5 pb-5 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
            {/* Status */}
            <div className="pt-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Status
              </label>
              <div className="flex items-center gap-2">
                <StyledSelect
                  value={ticket.status}
                  onChange={handleStatusChange}
                  isDark={isDark}
                  style={{ flex: 1 }}
                >
                  {statuses.length > 0
                    ? statuses.map(s => <option key={s.id} value={s.displayName}>{s.displayName}</option>)
                    : ['Open', 'On Hold', 'Closed', 'Waiting on customer feedback'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))
                  }
                </StyledSelect>
                {updatingStatus && <Loader className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: '#E8B058' }} />}
              </div>
            </div>

            {/* Assignee */}
            <div className="pt-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <StyledSelect
                  value={ticket.assigneeId ?? ''}
                  onChange={handleAssigneeChange}
                  isDark={isDark}
                  style={{ flex: 1 }}
                >
                  <option value="">Unassigned</option>
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>{ag.name || `${ag.firstName} ${ag.lastName}`}</option>
                  ))}
                </StyledSelect>
                {updatingAssignee && <Loader className="w-3.5 h-3.5 animate-spin flex-shrink-0" style={{ color: '#E8B058' }} />}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Priority
              </label>
              <StyledSelect
                value={ticket.priority}
                onChange={val => updateTicket(token, ticketId, { priority: val }).then(setTicket).catch(() => {})}
                isDark={isDark}
                style={{ width: '100%' }}
              >
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
              </StyledSelect>
            </div>

            {/* Channel */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Channel
              </label>
              <span className="text-xs" style={{ color: 'var(--ifm-color-content)' }}>{ticket.channel}</span>
            </div>

            {/* Custom fields */}
            {Object.entries(ticket.customFields ?? {})
              .filter(([, v]) => v != null && v !== '')
              .map(([k, v]) => (
                <div key={k}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </label>
                  <span className="text-xs" style={{ color: 'var(--ifm-color-content)' }}>{v}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#E8B058' }}>
            <Paperclip className="w-3.5 h-3.5" /> Attachments ({attachments.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {attachments.map(att => (
              <AttachmentItem key={att.id ?? att.attachmentId} att={att} token={token} isDark={isDark} />
            ))}
          </div>
        </div>
      )}

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
          <TranslateButton text={ticket.description} isDark={isDark} />
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
          <div className="space-y-5">
            {nonDescConvs.map(conv => {
              const person = conv.commenter ?? conv.author;
              const time = conv.commentedTime ?? conv.createdTime;
              const isAgent = conv.commenter?.type === 'AGENT' || conv.author?.type === 'AGENT';
              const typeLabel = conv.type === 'replyAll' ? 'Reply All'
                : conv.type === 'reply' ? 'Reply'
                : conv.type === 'comment' ? 'Comment'
                : conv.type;

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
                      {/* Visibility badge */}
                      <span
                        className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded font-medium"
                        title={conv.isPublic ? 'Visible to customer' : 'Internal note'}
                        style={{
                          background: conv.isPublic ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
                          color: conv.isPublic ? '#22c55e' : '#8b5cf6',
                        }}
                      >
                        {conv.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                        {conv.isPublic ? 'Public' : 'Private'}
                      </span>
                      {/* Reply type */}
                      {typeLabel && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                          color: 'var(--ifm-color-content-secondary)',
                        }}>
                          {typeLabel}
                        </span>
                      )}
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
                    <TranslateButton text={conv.content} isDark={isDark} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add comment */}
      <div className="rounded-xl border p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8B058' }}>
              Add Comment
            </h3>
            {!isCustomer && (
              <div className="relative">
                <select
                  onChange={e => {
                    if (e.target.value) {
                      const responsesByCategory = getCannedResponsesByCategory();
                      for (const cats of Object.values(responsesByCategory)) {
                        const found = cats.find(r => r.id === e.target.value);
                        if (found) {
                          const content = found.content.replace('{ticketNumber}', ticket.ticketNumber);
                          setComment(prev => prev ? `${prev}\n\n${content}` : content);
                          break;
                        }
                      }
                      e.target.value = '';
                    }
                  }}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    color: 'var(--ifm-color-content-secondary)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '0.375rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Canned Responses...</option>
                  {Object.entries(getCannedResponsesByCategory()).map(([category, responses]) => (
                    <optgroup key={category} label={category}>
                      {responses.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
          </div>
          {/* Public / Private toggle — agents only */}
          {!isCustomer && <div className="flex items-center gap-1.5 rounded-full p-0.5" style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}>
            <button
              onClick={() => setIsPublicComment(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: isPublicComment ? 'rgba(34,197,94,0.15)' : 'transparent',
                color: isPublicComment ? '#22c55e' : 'var(--ifm-color-content-secondary)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Globe className="w-3 h-3" /> Public
            </button>
            <button
              onClick={() => setIsPublicComment(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: !isPublicComment ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: !isPublicComment ? '#8b5cf6' : 'var(--ifm-color-content-secondary)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Lock className="w-3 h-3" /> Private
            </button>
          </div>}
        </div>

        <textarea
          ref={commentRef}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={isPublicComment ? 'Reply to customer...' : 'Internal note (not visible to customer)...'}
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
          style={{
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isPublicComment
              ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)')
              : 'rgba(139,92,246,0.3)'}`,
            color: 'var(--ifm-color-content)',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment();
          }}
        />

        {/* Attachment preview */}
        {attachFile && (
          <div
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              color: 'var(--ifm-color-content)',
            }}
          >
            <Paperclip className="w-3 h-3 flex-shrink-0" style={{ color: '#E8B058' }} />
            <span className="flex-1 truncate">{attachFile.name}</span>
            <span style={{ color: 'var(--ifm-color-content-secondary)' }}>{formatBytes(attachFile.size)}</span>
            <button
              onClick={() => setAttachFile(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)', padding: 0 }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content-secondary)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <Paperclip className="w-3.5 h-3.5" /> Attach
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={e => setAttachFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Cmd/Ctrl + Enter to submit
            </span>
          </div>

          <button
            onClick={handleAddComment}
            disabled={(!comment.trim() && !attachFile) || submitting || uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: (comment.trim() || attachFile) && !submitting ? '#E8B058' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
              color: (comment.trim() || attachFile) && !submitting ? '#000' : 'var(--ifm-color-content-secondary)',
              cursor: (!comment.trim() && !attachFile) || submitting ? 'not-allowed' : 'pointer',
              opacity: (!comment.trim() && !attachFile) || submitting ? 0.6 : 1,
              border: 'none',
            }}
          >
            {(submitting || uploading) ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send
          </button>
        </div>

        {actionMsg && (
          <p className="text-xs mt-2" style={{ color: actionMsg.ok ? '#22c55e' : '#ef4444' }}>
            {actionMsg.text}
          </p>
        )}
      </div>
        </div>

        {/* CRM Panel - right side */}
        <div>
          <CRMPanel token={token} email={ticket.email} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
