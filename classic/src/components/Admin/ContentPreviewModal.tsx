import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Edit3, Loader2, FileText, Calendar, User, Tag, Globe } from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string | null;
  contentType: string;
  contentSlug: string;
  contentTitle: string;
  studioBaseUrl: string;
}

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
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

export default function ContentPreviewModal({
  isOpen,
  onClose,
  contentId,
  contentType,
  contentSlug,
  contentTitle,
  studioBaseUrl,
}: ContentPreviewModalProps) {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchContentDetail();
    } else {
      setContent(null);
      setPreviewHtml('');
    }
  }, [isOpen, contentId]);

  const fetchContentDetail = async () => {
    if (!contentId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin-content/${contentId}`);
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
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        switch (block.style) {
          case 'h1': return `<h1>${text}</h1>`;
          case 'h2': return `<h2>${text}</h2>`;
          case 'h3': return `<h3>${text}</h3>`;
          case 'h4': return `<h4>${text}</h4>`;
          case 'blockquote': return `<blockquote>${text}</blockquote>`;
          case 'normal':
          default:
            return `<p>${text}</p>`;
        }
      }
      if (block._type === 'image') {
        return `<img src="${block.asset?.url || ''}" alt="${block.alt || ''}" style="max-width:100%;border-radius:8px;margin:1rem 0;" />`;
      }
      if (block._type === 'code') {
        return `<pre><code>${block.code || ''}</code></pre>`;
      }
      return '';
    }).join('');
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

  const status = content?.workflowConfig?.workflowStatus || 'draft';
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      />
      
      <div
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: isDark ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
        }}
        onClick={(e) => e.stopPropagation()}
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
              <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
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
            <a
              href={`${studioBaseUrl}/${contentType};${contentId}`}
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
            >
              <X className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div
            className="w-64 flex-shrink-0 border-r p-4 overflow-y-auto"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
              </div>
            ) : error ? (
              <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                <p className="text-sm">{error}</p>
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

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
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
                    style={{
                      color: 'var(--ifm-color-content)',
                    }}
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
