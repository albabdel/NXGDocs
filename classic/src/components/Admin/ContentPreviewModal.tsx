import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ExternalLink, Edit3, Loader2, FileText, Calendar, User, Tag, Globe, Check, XCircle, AlertCircle, Archive, Send, Rocket } from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string | null;
  contentType: string;
  contentSlug: string;
  contentTitle: string;
  studioBaseUrl: string;
  onWorkflowAction?: (contentId: string, action: WorkflowAction, notes?: string) => Promise<void>;
}

type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
type WorkflowAction = 'approve' | 'reject' | 'publish' | 'archive' | 'request_changes' | 'submit_for_review';

interface ContentDetail {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  body?: any;
  workflowConfig?: {
    workflowStatus?: string;
    source?: string;
    submittedAt?: string;
    submittedBy?: { name: string; email: string } | null;
    reviewedBy?: { name: string; email: string } | null;
    reviewedAt?: string;
    reviewNotes?: string;
    publishedAt?: string;
    publishedBy?: { name: string; email: string } | null;
  };
  _createdAt: string;
  _updatedAt: string;
  author?: string;
  tags?: string[];
  category?: string;
}

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  pending_review: { label: 'Pending Review', color: '#E8B058', bg: 'rgba(232,176,88,0.15)' },
  approved: { label: 'Approved', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  published: { label: 'Published', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  archived: { label: 'Archived', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

const TYPE_LABELS: Record<string, string> = {
  doc: 'Documentation',
  article: 'Article',
  release: 'Release',
  roadmapItem: 'Roadmap Item',
  landingPage: 'Landing Page',
};

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

export default function ContentPreviewModal({
  isOpen,
  onClose,
  contentId,
  contentType,
  contentSlug,
  contentTitle,
  studioBaseUrl,
  onWorkflowAction,
}: ContentPreviewModalProps) {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      fetchContentDetail();
    } else {
      setContent(null);
      setPreviewHtml('');
      setError(null);
    }
    return () => {
      if (!isOpen) previousActiveElement.current?.focus?.();
    };
  }, [isOpen, contentId]);

  useEffect(() => {
    if (modalRef.current && isOpen && !loading) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElementsRef.current = Array.from(focusable);
      if (focusableElementsRef.current.length > 0) {
        setTimeout(() => focusableElementsRef.current[0]?.focus(), 50);
      }
    }
  }, [isOpen, loading, content, showRejectInput]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      e.preventDefault();
      if (showRejectInput) {
        setShowRejectInput(false);
        setRejectNotes('');
      } else {
        onClose();
      }
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
  }, [isOpen, onClose, showRejectInput]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const fetchContentDetail = async () => {
    if (!contentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/admin-content/${contentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content details');
      }
      const data = await response.json();
      setContent(data);
      
      if (data.body && Array.isArray(data.body)) {
        const html = renderPortableText(data.body);
        setPreviewHtml(html);
      } else if (data.content) {
        setPreviewHtml(data.content);
      }
    } catch (err) {
      console.error('[ContentPreview] Error:', err);
      setError('Failed to load content preview');
    } finally {
      setLoading(false);
    }
  };

  const renderPortableText = (blocks: any[]): string => {
    if (!Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block._type === 'block') {
        let text = block.children?.map((child: any) => {
          let t = child.text || '';
          if (child.marks?.length) {
            child.marks.forEach((mark: string) => {
              if (mark === 'strong') t = `<strong>${t}</strong>`;
              if (mark === 'em') t = `<em>${t}</em>`;
              if (mark === 'code') t = `<code style="background:rgba(128,128,128,0.1);padding:0.1em 0.3em;border-radius:3px;font-size:0.9em;">${t}</code>`;
            });
          }
          return t;
        }).join('') || '';
        
        switch (block.style) {
          case 'h1': return `<h1 style="font-size:2em;font-weight:700;margin:1.5em 0 0.5em;">${text}</h1>`;
          case 'h2': return `<h2 style="font-size:1.5em;font-weight:600;margin:1.25em 0 0.5em;">${text}</h2>`;
          case 'h3': return `<h3 style="font-size:1.25em;font-weight:600;margin:1em 0 0.5em;">${text}</h3>`;
          case 'h4': return `<h4 style="font-size:1.1em;font-weight:600;margin:0.75em 0 0.5em;">${text}</h4>`;
          case 'blockquote': return `<blockquote style="border-left:4px solid #E8B058;padding-left:1em;margin:1em 0;font-style:italic;opacity:0.9;">${text}</blockquote>`;
          case 'normal':
          default:
            return `<p style="margin:0.75em 0;line-height:1.7;">${text || '&nbsp;'}</p>`;
        }
      }
      if (block._type === 'image') {
        const imgUrl = block.asset?.url || block.url || '';
        const alt = block.alt || block.caption || '';
        return `<figure style="margin:1.5em 0;"><img src="${imgUrl}" alt="${alt}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />${alt ? `<figcaption style="text-align:center;font-size:0.85em;opacity:0.7;margin-top:0.5em;">${alt}</figcaption>` : ''}</figure>`;
      }
      if (block._type === 'code') {
        const code = block.code || '';
        const lang = block.language || '';
        return `<pre style="background:rgba(0,0,0,0.05);padding:1em;border-radius:8px;overflow-x:auto;font-family:monospace;font-size:0.9em;"><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
      }
      if (block._type === 'list' && block.children) {
        const tag = block.listItem === 'bullet' ? 'ul' : 'ol';
        const items = block.children.map((item: any) => {
          const itemText = item.children?.map((c: any) => c.text || '').join('') || '';
          return `<li style="margin:0.25em 0;">${itemText}</li>`;
        }).join('');
        return `<${tag} style="margin:0.75em 0;padding-left:1.5em;">${items}</${tag}>`;
      }
      return '';
    }).join('');
  };

  const escapeHtml = (str: string): string => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleApprove = async () => {
    if (!contentId || !onWorkflowAction) return;
    setWorkflowLoading(true);
    try {
      await onWorkflowAction(contentId, 'approve');
      fetchContentDetail();
    } catch (e) {
      setError('Failed to approve content');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleReject = async () => {
    if (!contentId || !onWorkflowAction) return;
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectNotes.trim()) return;
    setWorkflowLoading(true);
    try {
      await onWorkflowAction(contentId, 'reject', rejectNotes);
      setShowRejectInput(false);
      setRejectNotes('');
      fetchContentDetail();
    } catch (e) {
      setError('Failed to reject content');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!contentId || !onWorkflowAction) return;
    setWorkflowLoading(true);
    try {
      await onWorkflowAction(contentId, 'publish');
      fetchContentDetail();
    } catch (e) {
      setError('Failed to publish content');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!contentId || !onWorkflowAction) return;
    setWorkflowLoading(true);
    try {
      await onWorkflowAction(contentId, 'archive');
      fetchContentDetail();
    } catch (e) {
      setError('Failed to archive content');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!contentId || !onWorkflowAction) return;
    setWorkflowLoading(true);
    try {
      await onWorkflowAction(contentId, 'submit_for_review');
      fetchContentDetail();
    } catch (e) {
      setError('Failed to submit for review');
    } finally {
      setWorkflowLoading(false);
    }
  };

  const status: WorkflowStatus = (content?.workflowConfig?.workflowStatus as WorkflowStatus) || 'draft';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const canWorkflow = onWorkflowAction;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        animation: 'modal-fade-in 0.2s ease-out',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-modal-title"
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
        className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: isDark ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          animation: 'modal-slide-up 0.25s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            background: isDark ? 'rgba(232,176,88,0.05)' : 'rgba(232,176,88,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{ color: '#E8B058' }} />
            <div>
              <h2 id="content-modal-title" className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                {content?.title || contentTitle || 'Content Preview'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: statusConfig.bg,
                    color: statusConfig.color,
                  }}
                >
                  {statusConfig.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {TYPE_LABELS[contentType] || contentType}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {canWorkflow && !showRejectInput && (
              <>
                {status === 'draft' && (
                  <button
                    onClick={handleSubmitForReview}
                    disabled={workflowLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(232,176,88,0.15)',
                      color: '#E8B058',
                      border: '1px solid rgba(232,176,88,0.3)',
                      cursor: workflowLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {workflowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit for Review
                  </button>
                )}
                {status === 'pending_review' && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={workflowLoading}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.3)',
                        cursor: workflowLoading ? 'wait' : 'pointer',
                      }}
                    >
                      {workflowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={workflowLoading}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        cursor: workflowLoading ? 'wait' : 'pointer',
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {status === 'approved' && (
                  <button
                    onClick={handlePublish}
                    disabled={workflowLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(139,92,246,0.15)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139,92,246,0.3)',
                      cursor: workflowLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {workflowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    Publish
                  </button>
                )}
                {status === 'published' && (
                  <button
                    onClick={handleArchive}
                    disabled={workflowLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(107,114,128,0.15)',
                      color: '#6b7280',
                      border: '1px solid rgba(107,114,128,0.3)',
                      cursor: workflowLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {workflowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                    Archive
                  </button>
                )}
                {status === 'rejected' && (
                  <button
                    onClick={handleSubmitForReview}
                    disabled={workflowLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(232,176,88,0.15)',
                      color: '#E8B058',
                      border: '1px solid rgba(232,176,88,0.3)',
                      cursor: workflowLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {workflowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Resubmit for Review
                  </button>
                )}
              </>
            )}
            <a
              href={`${studioBaseUrl}/${contentType};${contentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                textDecoration: 'none',
              }}
            >
              <Edit3 className="w-4 h-4" />
              Edit in Studio
            </a>
            {contentSlug && (
              <a
                href={`/docs/${contentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                style={{
                  background: 'rgba(232,176,88,0.1)',
                  color: '#E8B058',
                  border: '1px solid rgba(232,176,88,0.2)',
                  textDecoration: 'none',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            </button>
          </div>
        </div>

        {showRejectInput && (
          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              background: 'rgba(239,68,68,0.05)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
              <span className="text-sm font-medium" style={{ color: '#ef4444' }}>Rejection Reason</span>
            </div>
            <div className="flex gap-3">
              <textarea
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={2}
                className="flex-1 rounded-lg p-2 text-sm"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  color: 'var(--ifm-color-content)',
                  resize: 'vertical',
                }}
                autoFocus
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleReject}
                  disabled={workflowLoading || !rejectNotes.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: rejectNotes.trim() ? '#ef4444' : 'rgba(239,68,68,0.3)',
                    color: rejectNotes.trim() ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    cursor: !rejectNotes.trim() || workflowLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {workflowLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Confirm Reject
                </button>
                <button
                  onClick={() => { setShowRejectInput(false); setRejectNotes(''); }}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          <div
            className="w-64 flex-shrink-0 border-r p-4 overflow-y-auto hidden md:block"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            }}
          >
            {loading ? (
              <div className="space-y-4">
                <Skeleton width="100%" height="60px" />
                <Skeleton width="100%" height="40px" />
                <Skeleton width="100%" height="40px" />
                <Skeleton width="100%" height="40px" />
              </div>
            ) : error ? (
              <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchContentDetail}
                  className="mt-2 px-3 py-1 rounded text-xs"
                  style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058', border: 'none', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4" style={{ color: '#E8B058' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      URL Slug
                    </span>
                  </div>
                  <p className="text-sm break-all" style={{ color: 'var(--ifm-color-content)' }}>
                    /docs/{contentSlug || '—'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" style={{ color: '#E8B058' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      Author
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {content?.workflowConfig?.submittedBy?.name || content?.author || '—'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: '#E8B058' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      Created
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {formatDate(content?._createdAt)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: '#E8B058' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      Last Modified
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                    {formatDate(content?._updatedAt)}
                  </p>
                </div>

                {content?.workflowConfig?.submittedAt && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" style={{ color: '#E8B058' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Submitted
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {formatDate(content.workflowConfig.submittedAt)}
                    </p>
                  </div>
                )}

                {content?.workflowConfig?.reviewedBy && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" style={{ color: '#22c55e' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Reviewed By
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                      {content.workflowConfig.reviewedBy.name}
                    </p>
                  </div>
                )}

                {content?.tags && content.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4" style={{ color: '#E8B058' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {content.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                            color: 'var(--ifm-color-content-secondary)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {content?.workflowConfig?.reviewNotes && (
                  <div>
                    <span className="text-xs font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      Review Notes
                    </span>
                    <p
                      className="text-sm mt-1 p-2 rounded"
                      style={{
                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                        color: 'var(--ifm-color-content)',
                      }}
                    >
                      {content.workflowConfig.reviewNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
            {loading ? (
              <div className="space-y-4">
                <Skeleton width="100%" height="24px" />
                <Skeleton width="95%" height="16px" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="100%" height="200px" rounded="12px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
              </div>
            ) : error ? (
              <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{error}</p>
                <button
                  onClick={fetchContentDetail}
                  className="mt-3 px-4 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(232,176,88,0.1)',
                    color: '#E8B058',
                    border: '1px solid rgba(232,176,88,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div>
                {content?.description && (
                  <p
                    className="text-lg mb-6 pb-6 border-b"
                    style={{
                      color: 'var(--ifm-color-content-secondary)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    }}
                  >
                    {content.description}
                  </p>
                )}
                
                {previewHtml ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    style={{ color: 'var(--ifm-color-content)' }}
                  />
                ) : (
                  <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No content preview available</p>
                    <p className="text-sm mt-1">Edit in Studio to add content</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
