import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ArrowLeft, Loader, AlertCircle, Send, User, MessageSquare,
  ExternalLink, Paperclip, X, Lock, Globe, Languages, ChevronDown,
  ImageIcon, Download, Eye, EyeOff, Plus, Clock, FileText, Zap,
  BookOpen, CheckCircle, Activity, Mail, Copy, Check, RotateCcw,
} from 'lucide-react';
import {
  getTicket, getConversations, addComment, addThread, sendReply, updateTicket,
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
  ticketId: string;
  isDark: boolean;
  isCustomer?: boolean;
  onBack: () => void;
  /** Agent token (only for agents - used by CRMPanel) */
  token?: string;
  /** Customer's Zoho contactId — used to identify own messages in chat view */
  contactId?: string;
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

/**
 * Strip any legacy [cid:...] markers left over from a previous implementation.
 * These should no longer be injected, but old messages may still have them.
 */
function stripCidMarker(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw.replace(/^\[cid:\d+(?:\|[^\]]+)?\]\s*/, '');
}

/** Parses "Label: Value" pairs from HTML content. Returns array if ≥3 pairs found, null otherwise. */
function parseKeyValuePairs(html: string | null | undefined): { label: string; value: string }[] | null {
  if (!html) return null;
  const text = htmlToText(html);
  const lines = text.split(/[\n;]/).map(l => l.trim()).filter(Boolean);
  const pairs: { label: string; value: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^([^:\n]{2,45}):\s*(.{1,200})$/);
    if (m) pairs.push({ label: m[1].trim(), value: m[2].trim() });
  }
  return pairs.length >= 3 ? pairs : null;
}

/** Renders content that is either HTML or plaintext-markdown into safe HTML. */
function renderContent(text: string | null | undefined): string {
  if (!text) return '';
  if (/<[a-zA-Z][^>]*>/.test(text)) return text; // already HTML
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\[x\]/gi, '<span style="color:#22c55e">☑</span>')
    .replace(/\[ \]/g, '<span style="color:#9ca3af">☐</span>')
    .replace(/\n\n+/g, '</p><p style="margin:0.5em 0">')
    .replace(/\n/g, '<br />')
    .replace(/^/, '<p style="margin:0">')
    .replace(/$/, '</p>');
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      title={`Copy ${label}`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-all hover:opacity-80 ticket-button ${copied ? 'ticket-tag status-closed' : ''}`}
    >
      {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function Avatar({ name, photoURL, type }: {
  name: string; photoURL?: string; type?: string;
}) {
  const initials = (name || 'Unknown').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
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
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ticket-avatar ${isAgent ? 'agent' : ''}`}
      style={{ color: isAgent ? '#E8B058' : 'var(--ifm-color-content-secondary)' }}
    >
      {initials || <User className="w-3.5 h-3.5" />}
    </div>
  );
}

function TranslateButton({ text }: { text: string | null | undefined }) {
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
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-2 transition-all hover:opacity-80 ticket-button ${show ? 'ticket-tag status-open' : ''}`}
      >
        {loading ? <Loader className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
        {show ? 'Original' : 'Translate'}
      </button>
      {show && translated && (
        <div
          className="mt-2 p-3 rounded-lg text-sm ticket-comment"
          style={{
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

// ─── Search index utilities ───────────────────────────────────────────────────

interface SearchEntry { id: string; type: string; title: string; excerpt: string; content: string; }
let _searchCache: SearchEntry[] | null = null;

async function getSearchIndex(): Promise<SearchEntry[]> {
  if (_searchCache) return _searchCache;
  try {
    const res = await fetch('/search-index.json');
    if (!res.ok) return [];
    const data = await res.json() as Record<string, SearchEntry>;
    _searchCache = Object.values(data).filter(e => e.type === 'page');
    return _searchCache;
  } catch { return []; }
}

function extractKeywords(text: string): string[] {
  const stop = new Set(['the','a','an','is','in','on','at','to','for','of','and','or','not','with','be','it','this','that','how','why','what','when','where','my','can','i','we','our','have','has','been','was','are','does','did','using','use','used']);
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stop.has(w));
}

function scoreEntry(entry: SearchEntry, keywords: string[]): number {
  const title = (entry.title ?? '').toLowerCase();
  const body = (entry.excerpt ?? '').toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (title.includes(kw)) score += 4;
    if (body.includes(kw)) score += 1;
  }
  return score;
}

function RelatedArticles({ subject }: { subject: string }) {
  const [articles, setArticles] = useState<Array<{ title: string; url: string; excerpt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keywords = extractKeywords(subject);
    if (!keywords.length) { setLoading(false); return; }
    getSearchIndex().then(index => {
      const results = index
        .map(e => ({ ...e, score: scoreEntry(e, keywords) }))
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(e => ({
          title: e.title,
          url: e.id.replace(/^doc:/, ''),
          excerpt: (e.excerpt ?? '').replace(/\n/g, ' ').substring(0, 90),
        }));
      setArticles(results);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [subject]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader className="w-3 h-3 animate-spin" style={{ color: '#3b82f6' }} />
        <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Finding relevant docs…</span>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-3">
        <BookOpen className="w-6 h-6 opacity-30" style={{ color: '#3b82f6' }} />
        <p className="text-xs text-center" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          No related articles found. Try <a href="/docs" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>searching docs</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {articles.map(a => (
        <a
          key={a.url}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2.5 p-2.5 rounded-lg no-underline transition-all hover:opacity-80 related-article"
        >
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>{a.title}</p>
            {a.excerpt && (
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {a.excerpt}…
              </p>
            )}
          </div>
          <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AttachmentItem({ att }: { att: ZohoAttachment }) {
  const [lightbox, setLightbox] = useState(false);
  const isImage = att.fileType && IMAGE_TYPES.includes(att.fileType);

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl p-3 ticket-attachment">
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
            className="p-1.5 rounded-lg transition-all hover:opacity-80 inline-flex ticket-button"
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
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function StyledSelect({ value, onChange, children, style }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="ticket-input"
      style={{
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

export default function TicketDetail({ ticketId, isDark, isCustomer, onBack, token, contactId }: Props) {
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
  const [replyType, setReplyType] = useState<'comment' | 'reply' | 'replyAll' | 'forward'>('comment');
  const [showReplyDropdown, setShowReplyDropdown] = useState(false);
  const [requestingArticle, setRequestingArticle] = useState(false);
  const [articleRequested, setArticleRequested] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(new Set());
  const [ownCommentIds, setOwnCommentIds] = useState<Set<string>>(new Set());
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

  async function load(): Promise<ZohoConversationItem[]> {
    setLoading(true);
    setError(null);
    try {
      const agentPromise = (!isCustomer && !agents.length)
        ? listAgents({ isCustomer, token }).catch(() => ({ data: [] }))
        : Promise.resolve({ data: agents });
      const statusPromise = (!isCustomer && !statuses.length)
        ? listStatuses({ isCustomer, token }).catch(() => ({ data: [] }))
        : Promise.resolve({ data: statuses });

      const [t, c, a, st, ag] = await Promise.all([
        getTicket({ id: ticketId, isCustomer, token }),
        getConversations({ ticketId, isCustomer, token }),
        getAttachments({ ticketId, isCustomer, token }).catch(() => ({ data: [] })),
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
      return sorted;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load ticket');
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [ticketId]);

  async function handleStatusChange(newStatus: string) {
    if (!ticket || updatingStatus || newStatus === ticket.status) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateTicket({ ticketId, fields: { status: newStatus }, isCustomer, token });
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
      const updated = await updateTicket({ ticketId, fields: { assigneeId: assigneeId || '' }, isCustomer, token });
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
        if (isCustomer) {
          // Zoho REST API v1 has no way to post a message attributed to a contact
          // via a service account token. POST /threads doesn't exist (405), sendReply
          // is agent-to-customer direction only. Comments is the only working endpoint.
          await addComment({
            ticketId,
            content: comment.trim(),
            isPublic: true,
            isCustomer,
            token,
          });
        } else if (!isCustomer && replyType !== 'comment') {
          // Agent email reply — sends via Zoho's sendReply (outbound email to customer)
          await sendReply({
            ticketId,
            content: comment.trim(),
            to: ticket?.contact?.email ?? ticket?.email,
            token,
          });
        } else {
          // Agent internal/public note
          await addComment({
            ticketId,
            content: comment.trim(),
            isPublic: isPublicComment,
            isCustomer: false,
            token,
          });
        }
      }
      if (attachFile) {
        setUploading(true);
        await uploadAttachment({ ticketId, file: attachFile, isCustomer, token });
        setAttachFile(null);
        setUploading(false);
      }
      setComment('');
      showMsg('Comment added.');
      const prevIds = new Set(conversations.map(c => c.id));
      const newConvs = await load();
      if (isCustomer) {
        const newIds = newConvs.filter(c => !prevIds.has(c.id)).map(c => c.id);
        if (newIds.length > 0) {
          setOwnCommentIds(prev => {
            const next = new Set(prev);
            newIds.forEach(id => next.add(id));
            return next;
          });
        }
      }
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : 'Failed to add comment', false);
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRequestArticle() {
    if (!ticket || requestingArticle || articleRequested) return;
    setRequestingArticle(true);
    try {
      await fetch('/request-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ticketId: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          requesterEmail: ticket.email,
        }),
      });
      setArticleRequested(true);
    } catch {
      showMsg('Failed to send request. Please try again.', false);
    } finally {
      setRequestingArticle(false);
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

      {/* Main content grid: Ticket detail on left, sidebar on right */}
      <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'minmax(0,1fr) 260px' }}>
        <div>
          {/* Header card */}
          <div className="rounded-xl border p-5 mb-4" style={cardStyle}>
        <div className="flex items-start gap-3 justify-between flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-semibold" style={{ color: '#E8B058' }}>
                  #{ticket.ticketNumber}
                </span>
                <CopyButton value={ticket.ticketNumber} label="ID" />
              </div>
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
            <h2 className="text-2xl font-extrabold mb-1.5 leading-tight" style={{ color: 'var(--ifm-color-content)', letterSpacing: '-0.02em' }}>
              {ticket.subject}
            </h2>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
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

      {/* Description */}
      {ticket.description && (() => {
        const kvPairs = parseKeyValuePairs(ticket.description);
        const plainText = htmlToText(ticket.description);
        const isLong = kvPairs ? kvPairs.length > 6 : plainText.length > 400;
        const showCollapse = isLong;
        return (
          <div
            className="rounded-xl border p-5 mb-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
              borderColor: isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)',
              borderLeft: '3px solid #E8B058',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: '#E8B058' }}>
                <FileText className="w-3.5 h-3.5" /> Description
              </h3>
              {showCollapse && (
                <button
                  onClick={() => setDescExpanded(s => !s)}
                  className="text-xs transition-all hover:opacity-80"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8B058' }}
                >
                  {descExpanded ? 'Collapse ↑' : 'Expand ↓'}
                </button>
              )}
            </div>
            {kvPairs ? (
              <div
                className="grid gap-x-6 gap-y-2"
                style={{
                  gridTemplateColumns: 'auto 1fr',
                  maxHeight: showCollapse && !descExpanded ? '9rem' : 'none',
                  overflow: showCollapse && !descExpanded ? 'hidden' : 'visible',
                }}
              >
                {(showCollapse && !descExpanded ? kvPairs.slice(0, 4) : kvPairs).map((pair, i) => (
                  <React.Fragment key={i}>
                    <span className="text-xs font-medium py-0.5 whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {pair.label}
                    </span>
                    <span className="text-sm py-0.5" style={{ color: 'var(--ifm-color-content)' }}>
                      {pair.value}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div
                className="text-sm max-w-none"
                style={{
                  color: 'var(--ifm-color-content)',
                  lineHeight: '1.7',
                  fontSize: '0.9rem',
                  maxHeight: showCollapse && !descExpanded ? '8rem' : 'none',
                  overflow: showCollapse && !descExpanded ? 'hidden' : 'visible',
                }}
                dangerouslySetInnerHTML={{ __html: renderContent(ticket.description) }}
              />
            )}
            <TranslateButton text={ticket.description} />
          </div>
        );
      })()}

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
                onChange={val => updateTicket({ ticketId, fields: { priority: val }, isCustomer, token }).then(setTicket).catch(() => {})}
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
              <AttachmentItem key={att.id ?? att.attachmentId} att={att} />
            ))}
          </div>
        </div>
      )}

      {/* Conversation thread */}
      {nonDescConvs.length === 0 && (
        <div
          className="rounded-xl border mb-4 p-8 flex flex-col items-center justify-center gap-2"
          style={cardStyle}
        >
          <MessageSquare className="w-8 h-8 opacity-25" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            No responses yet. Our support team will reply soon.
          </p>
        </div>
      )}
      {nonDescConvs.length > 0 && (
        <div className="rounded-xl border mb-4 overflow-hidden" style={cardStyle}>
          {/* Header */}
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
          >
            <MessageSquare className="w-4 h-4" style={{ color: '#E8B058' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8B058' }}>
              {isCustomer ? 'Conversation' : 'Comments'} ({nonDescConvs.length})
            </h3>
            {isCustomer && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                style={{
                  background: ticket.status === 'Closed' ? 'rgba(34,197,94,0.1)' : 'rgba(232,176,88,0.1)',
                  color: ticket.status === 'Closed' ? '#22c55e' : '#E8B058',
                }}
              >
                {ticket.status === 'Closed' ? 'Resolved' : 'In Progress'}
              </span>
            )}
          </div>

          {isCustomer ? (
            /* ── Chat-bubble layout for customers ── */
            <div className="p-5 space-y-5">
              {nonDescConvs.filter(c => c.isPublic !== false).map(conv => {
                const convContent = stripCidMarker(conv.content);
                // A message is "mine" if we submitted it this session (tracked client-side)
                const isOwnMessage = ownCommentIds.has(conv.id);
                const isConvAgent = !isOwnMessage && (conv.commenter?.type === 'AGENT' || conv.author?.type === 'AGENT');
                const person = conv.commenter ?? conv.author;
                const time = conv.commentedTime ?? conv.createdTime;
                const typeTag = conv.type === 'replyAll' ? 'Reply All'
                  : conv.type === 'forward' ? 'Forward'
                  : null;
                const isEmailType = conv.type === 'replyAll' || conv.type === 'reply' || conv.type === 'forward';
                const agentBubbleBg = isConvAgent
                  ? (isEmailType
                    ? (isDark ? 'rgba(232,176,88,0.08)' : 'rgba(232,176,88,0.06)')
                    : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'))
                  : (isDark ? 'rgba(59,130,246,0.14)' : 'rgba(59,130,246,0.09)');
                const agentBubbleBorder = isConvAgent
                  ? (isEmailType
                    ? (isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.15)')
                    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'))
                  : 'rgba(59,130,246,0.2)';
                return (
                  <div key={conv.id} className={`flex gap-3 ${isConvAgent ? '' : 'flex-row-reverse'}`}>
                    <Avatar
                      name={person?.name ?? (isConvAgent ? 'Support' : '?')}
                      photoURL={person?.photoURL}
                      type={isConvAgent ? 'AGENT' : ''}
                    />
                    <div className={`flex flex-col gap-1 max-w-[76%] ${isConvAgent ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-1.5 flex-wrap text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.8 }}>
                        {isConvAgent ? (
                          <>
                            <span className="font-semibold" style={{ color: '#E8B058' }}>{person?.name ?? 'Support Team'}</span>
                            {typeTag && (
                              <span
                                className="px-1.5 py-0.5 rounded text-xs font-medium"
                                style={{
                                  background: isEmailType ? 'rgba(232,176,88,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                                  color: isEmailType ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                                }}
                              >{typeTag}</span>
                            )}
                            {!typeTag && (
                              <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'var(--ifm-color-content-secondary)' }}>
                                Comment
                              </span>
                            )}
                            {time && <><span>·</span><span>{formatDateTime(time)}</span></>}
                          </>
                        ) : (
                          <>
                            {time && <><span>{formatDateTime(time)}</span><span>·</span></>}
                            {typeTag && <span className="px-1.5 rounded" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>{typeTag}</span>}
                            <span className="font-semibold" style={{ color: '#3b82f6' }}>You</span>
                          </>
                        )}
                      </div>
                      {(() => {
                        const msgText = htmlToText(convContent);
                        const isLongMsg = msgText.length > 600;
                        const isMsgExpanded = expandedMsgs.has(conv.id);
                        return (
                          <>
                            <div
                              className="text-sm p-3.5 leading-relaxed"
                              style={{
                                background: agentBubbleBg,
                                borderRadius: isConvAgent ? '2px 16px 16px 16px' : '16px 2px 16px 16px',
                                color: 'var(--ifm-color-content)',
                                border: `1px solid ${agentBubbleBorder}`,
                                borderLeft: isConvAgent ? '3px solid #E8B058' : '3px solid #3b82f6',
                                maxHeight: isLongMsg && !isMsgExpanded ? '8rem' : 'none',
                                overflow: isLongMsg && !isMsgExpanded ? 'hidden' : 'visible',
                              }}
                              dangerouslySetInnerHTML={{ __html: renderContent(convContent) }}
                            />
                            {isLongMsg && (
                              <button
                                onClick={() => setExpandedMsgs(prev => {
                                  const next = new Set(prev);
                                  if (next.has(conv.id)) next.delete(conv.id); else next.add(conv.id);
                                  return next;
                                })}
                                className="text-xs mt-1 transition-all hover:opacity-80"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isConvAgent ? '#E8B058' : '#3b82f6', padding: 0 }}
                              >
                                {isMsgExpanded ? 'Show less ↑' : 'Show more ↓'}
                              </button>
                            )}
                          </>
                        );
                      })()}
                      <TranslateButton text={conv.content} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Table layout for agents ── */
            <div className="p-5 space-y-5">
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
                    <Avatar name={person?.name ?? '?'} photoURL={person?.photoURL} type={conv.commenter?.type ?? conv.author?.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                          {person?.name ?? person?.email ?? 'Unknown'}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                          background: isAgent ? 'rgba(232,176,88,0.1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                          color: isAgent ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                        }}>
                          {isAgent ? 'Agent' : 'Customer'}
                        </span>
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
                        {typeLabel && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                            color: 'var(--ifm-color-content-secondary)',
                          }}>
                            {typeLabel}
                          </span>
                        )}
                        {time && <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>{formatDateTime(time)}</span>}
                      </div>
                      <div
                        className="text-sm rounded-xl p-3"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                          color: 'var(--ifm-color-content)',
                          lineHeight: '1.5',
                        }}
                        dangerouslySetInnerHTML={{ __html: renderContent(conv.content) }}
                      />
                      <TranslateButton text={conv.content} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add comment — sticky at bottom */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
      <div className="rounded-xl border p-5" style={{
        ...cardStyle,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `2px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'}`,
      }}>
        {/* Reply type selector */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
            }}
          >
            {/* Leave a Comment */}
            <button
              onClick={() => { setReplyType('comment'); setShowReplyDropdown(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: replyType === 'comment' ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)') : 'transparent',
                color: replyType === 'comment' ? 'var(--ifm-color-content)' : 'var(--ifm-color-content-secondary)',
                border: replyType === 'comment' ? `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}` : '1px solid transparent',
                boxShadow: replyType === 'comment' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Leave a Comment
            </button>

            {/* Reply All with dropdown */}
            <div className="relative flex">
              <button
                onClick={() => { setReplyType('replyAll'); setShowReplyDropdown(false); }}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-l-lg text-xs font-medium transition-all"
                style={{
                  background: replyType !== 'comment' ? (isDark ? 'rgba(232,176,88,0.15)' : 'rgba(232,176,88,0.1)') : 'transparent',
                  color: replyType !== 'comment' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                  border: replyType !== 'comment' ? `1px solid rgba(232,176,88,0.25)` : '1px solid transparent',
                  borderRight: 'none',
                  boxShadow: replyType !== 'comment' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  borderRadius: '0.5rem 0 0 0.5rem',
                }}
              >
                <Mail className="w-3.5 h-3.5" />
                {replyType === 'reply' ? 'Reply' : replyType === 'forward' ? 'Forward' : 'Reply All'}
              </button>
              <button
                onClick={() => setShowReplyDropdown(s => !s)}
                className="inline-flex items-center justify-center px-1.5 py-1.5 rounded-r-lg text-xs transition-all"
                style={{
                  background: replyType !== 'comment' ? (isDark ? 'rgba(232,176,88,0.15)' : 'rgba(232,176,88,0.1)') : 'transparent',
                  color: replyType !== 'comment' ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                  border: replyType !== 'comment' ? `1px solid rgba(232,176,88,0.25)` : '1px solid transparent',
                  borderLeft: `1px solid ${isDark ? 'rgba(232,176,88,0.15)' : 'rgba(232,176,88,0.1)'}`,
                  boxShadow: replyType !== 'comment' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  borderRadius: '0 0.5rem 0.5rem 0',
                }}
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showReplyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showReplyDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-20 min-w-[130px]"
                  style={{
                    background: isDark ? '#1e2028' : '#fff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                >
                  {(['replyAll', 'reply', 'forward'] as const).map(t => {
                    const labels = { replyAll: 'Reply All', reply: 'Reply', forward: 'Forward' };
                    return (
                      <button
                        key={t}
                        onClick={() => { setReplyType(t); setShowReplyDropdown(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-all hover:opacity-80 text-left"
                        style={{
                          background: replyType === t ? (isDark ? 'rgba(232,176,88,0.12)' : 'rgba(232,176,88,0.08)') : 'transparent',
                          color: replyType === t ? '#E8B058' : 'var(--ifm-color-content)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {replyType === t && <span style={{ color: '#E8B058' }}>✓</span>}
                        {replyType !== t && <span style={{ width: '0.75rem' }} />}
                        {labels[t]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#E8B058' }}>
              {isCustomer ? 'Your Reply' : 'Add Comment'}
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
          placeholder={isCustomer ? 'Type your reply here... Our support team will respond as soon as possible.' : (isPublicComment ? 'Reply to customer...' : 'Internal note (not visible to customer)...')}
          rows={isCustomer ? 7 : 5}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
          style={{
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isCustomer 
              ? 'rgba(232,176,88,0.3)' 
              : (isPublicComment
                ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)')
                : 'rgba(139,92,246,0.3)')}`,
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
            <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.45 }}>
              Cmd/Ctrl + Enter
            </span>
          </div>

          <button
            onClick={handleAddComment}
            disabled={(!comment.trim() && !attachFile) || submitting || uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: (comment.trim() || attachFile) && !submitting ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
              color: (comment.trim() || attachFile) && !submitting ? '#fff' : 'var(--ifm-color-content-secondary)',
              cursor: (!comment.trim() && !attachFile) || submitting ? 'not-allowed' : 'pointer',
              opacity: (!comment.trim() && !attachFile) || submitting ? 0.6 : 1,
              border: 'none',
              boxShadow: (comment.trim() || attachFile) && !submitting ? '0 0 0 3px rgba(59,130,246,0.2)' : 'none',
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
      </div>{/* end sticky wrapper */}
        </div>{/* end center column */}

        {/* Right panel: Customer Info (customers) or CRM Panel (agents) */}
        {isCustomer ? (
          <div className="space-y-4" style={{ position: 'sticky', top: 16, alignSelf: 'start' }}>

            {/* Response Status */}
            <div className="rounded-xl border p-4" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#E8B058' }}>
                <Activity className="w-3.5 h-3.5" /> Response Status
              </h3>
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
                >
                  <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Priority</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: pStyle.bg, color: pStyle.color }}>
                    {ticket.priority}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
                >
                  <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: statusColor ? `${statusColor}22` : 'rgba(232,176,88,0.12)',
                      color: statusColor ?? '#E8B058',
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
                >
                  <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Assigned to</span>
                  <span className="text-xs font-medium" style={{ color: ticket.assignee ? 'var(--ifm-color-content)' : 'var(--ifm-color-content-secondary)' }}>
                    {ticket.assignee
                      ? (ticket.assignee.name || `${ticket.assignee.firstName} ${ticket.assignee.lastName}`.trim())
                      : 'Unassigned'}
                  </span>
                </div>
                {ticket.status !== 'Closed' && (
                  <div className="py-1.5">
                    <span className="text-xs block mb-1.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>SLA</span>
                    <SLATimer ticket={ticket} isDark={isDark} />
                  </div>
                )}
                <div
                  className="p-3 rounded-lg text-xs leading-relaxed"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    color: 'var(--ifm-color-content-secondary)',
                  }}
                >
                  {ticket.priority === 'Critical'
                    ? '⚡ Critical — we aim to respond within 1 hour'
                    : ticket.priority === 'High'
                    ? '🚀 High priority — response within 4 hours'
                    : ticket.priority === 'Medium'
                    ? '📬 Response within 8 business hours'
                    : '📋 Response within 24 business hours'}
                </div>
              </div>
            </div>

            {/* Ticket Timeline */}
            <div className="rounded-xl border p-4" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#E8B058' }}>
                <Clock className="w-3.5 h-3.5" /> Timeline
              </h3>
              <div className="relative">
                <div
                  className="absolute top-2 bottom-2 w-px"
                  style={{ left: 5, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <div className="space-y-1.5 pl-4">
                  <div className="relative">
                    <div
                      className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full"
                      style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.15)' }}
                    />
                    <p className="text-xs font-medium" style={{ color: 'var(--ifm-color-content)' }}>Ticket Created</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {formatDateTime(ticket.createdTime)}
                    </p>
                  </div>

                  {nonDescConvs.map(conv => {
                    const isConvAgent = conv.commenter?.type === 'AGENT' || conv.author?.type === 'AGENT';
                    const convTime = conv.commentedTime ?? conv.createdTime;
                    return (
                      <div key={conv.id} className="relative">
                        <div
                          className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full"
                          style={{
                            background: isConvAgent ? '#E8B058' : '#3b82f6',
                            boxShadow: `0 0 0 3px ${isConvAgent ? 'rgba(232,176,88,0.15)' : 'rgba(59,130,246,0.15)'}`,
                          }}
                        />
                        <p className="text-xs font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                          {isConvAgent ? 'Support replied' : 'You replied'}
                        </p>
                        {convTime && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            {formatDateTime(convTime)}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {ticket.status === 'Closed' ? (
                    <div className="relative">
                      <div
                        className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full"
                        style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.15)' }}
                      />
                      <p className="text-xs font-medium" style={{ color: '#22c55e' }}>Resolved</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>Ticket closed</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2"
                        style={{
                          background: 'transparent',
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        }}
                      />
                      <p className="text-xs italic" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Awaiting resolution…
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div
              className="rounded-xl border p-4"
              style={{
                background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.03)',
                borderColor: 'rgba(59,130,246,0.18)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: '#3b82f6' }}>
                  <BookOpen className="w-3.5 h-3.5" /> Related Articles
                </h3>
                <a
                  href="/docs"
                  className="text-xs no-underline hover:opacity-80 transition-all"
                  style={{ color: '#3b82f6' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  All docs →
                </a>
              </div>
              <RelatedArticles subject={ticket.subject} />
            </div>

            {/* Request new article */}
            <div className="rounded-xl border p-4" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                <FileText className="w-3.5 h-3.5" /> Missing Documentation?
              </h3>
              <p className="text-xs mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Can't find an answer in our docs? Request that we write an article covering this topic.
              </p>
              <button
                onClick={handleRequestArticle}
                disabled={requestingArticle || articleRequested}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                style={{
                  background: articleRequested ? 'rgba(34,197,94,0.1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                  color: articleRequested ? '#22c55e' : 'var(--ifm-color-content)',
                  border: `1px solid ${articleRequested ? 'rgba(34,197,94,0.25)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                  cursor: requestingArticle || articleRequested ? 'not-allowed' : 'pointer',
                  opacity: requestingArticle ? 0.7 : 1,
                }}
              >
                {requestingArticle ? (
                  <><Loader className="w-3.5 h-3.5 animate-spin" /> Sending request…</>
                ) : articleRequested ? (
                  <><CheckCircle className="w-3.5 h-3.5" /> Request sent!</>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /> Request a new article</>
                )}
              </button>
            </div>

            {/* Ticket Status Action */}
            {ticket.status !== 'Closed' ? (
              <div className="rounded-xl border p-4" style={cardStyle}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  <CheckCircle className="w-3.5 h-3.5" /> Issue Resolved?
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  If your issue has been resolved, close this ticket so we can track it properly.
                </p>
                <button
                  onClick={() => handleStatusChange('Closed')}
                  disabled={updatingStatus}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.25)',
                    cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  }}
                >
                  {updatingStatus ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Mark as Resolved
                </button>
              </div>
            ) : (
              <div className="rounded-xl border p-4" style={cardStyle}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Need More Help?
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  If your issue has returned or you need further assistance, reopen this ticket.
                </p>
                <button
                  onClick={() => handleStatusChange('Open')}
                  disabled={updatingStatus}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59,130,246,0.25)',
                    cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  }}
                >
                  {updatingStatus ? <Loader className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  Reopen Ticket
                </button>
              </div>
            )}

          </div>
        ) : token && (
          <div>
            <CRMPanel token={token} email={ticket.email} isDark={isDark} />
          </div>
        )}
      </div>
    </div>
  );
}
