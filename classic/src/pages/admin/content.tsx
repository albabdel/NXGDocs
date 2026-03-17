import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import ContentPreviewModal from '../../components/Admin/ContentPreviewModal';
import { FileStack, Clock, CheckCircle, XCircle, AlertCircle, Filter, RefreshCw, Loader2, ExternalLink, Edit3, Eye } from 'lucide-react';

type WorkflowStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'archived';
type ContentSource = 'sanity' | 'confluence';
type ContentType = 'doc' | 'article' | 'release' | 'roadmapItem' | 'landingPage';
type WorkflowAction = 'approve' | 'reject' | 'publish' | 'archive' | 'request_changes' | 'submit_for_review';

interface ContentItem {
  _id: string;
  _type: ContentType;
  title: string;
  slug: string;
  workflowConfig?: {
    workflowStatus?: WorkflowStatus;
    source?: ContentSource;
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
}

interface ContentResponse {
  items: ContentItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  pending_review: { label: 'Pending Review', color: '#E8B058', bg: 'rgba(232,176,88,0.15)' },
  approved: { label: 'Approved', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  published: { label: 'Published', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  archived: { label: 'Archived', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

const TYPE_LABELS: Record<ContentType, string> = {
  doc: 'Documentation',
  article: 'Article',
  release: 'Release',
  roadmapItem: 'Roadmap Item',
  landingPage: 'Landing Page',
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  sanity: 'Sanity',
  confluence: 'Confluence',
};

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function ContentQueuePageContent() {
  const [isDark, setIsDark] = useState(true);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    contentId: string | null;
    contentType: string;
    contentSlug: string;
    contentTitle: string;
  }>({ isOpen: false, contentId: null, contentType: '', contentSlug: '', contentTitle: '' });
  const [stats, setStats] = useState({
    pending_review: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    draft: 0,
  });

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (typeFilter && typeFilter !== 'all') {
        params.append('type', typeFilter);
      }
      if (sourceFilter && sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/admin-content?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data: ContentResponse = await response.json();
      setItems(data.items);

      const statusCounts = {
        pending_review: 0,
        approved: 0,
        rejected: 0,
        published: 0,
        draft: 0,
      };
      
      for (const item of data.items) {
        const status = item.workflowConfig?.workflowStatus || 'draft';
        if (status in statusCounts) {
          statusCounts[status as keyof typeof statusCounts]++;
        }
      }
      
      setStats(statusCounts);
    } catch (err) {
      console.error('[ContentQueue] Error:', err);
      setError('Failed to load content');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, sourceFilter]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleAction = async (action: WorkflowAction, contentId: string, contentType: ContentType, notes?: string) => {
    setActionLoading(contentId);
    try {
      const response = await fetch('/api/admin-content-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, contentId, contentType, notes }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Action failed');
      }
      
      await fetchContent();
    } catch (err) {
      console.error('[ContentAction] Error:', err);
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const openPreview = (item: ContentItem) => {
    setPreviewModal({
      isOpen: true,
      contentId: item._id,
      contentType: item._type,
      contentSlug: item.slug,
      contentTitle: item.title,
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      contentId: null,
      contentType: '',
      contentSlug: '',
      contentTitle: '',
    });
  };

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)';

  const statsDisplay = [
    { icon: Clock, label: 'Pending Review', value: stats.pending_review, color: '#E8B058' },
    { icon: CheckCircle, label: 'Approved', value: stats.approved, color: '#22c55e' },
    { icon: XCircle, label: 'Rejected', value: stats.rejected, color: '#ef4444' },
    { icon: AlertCircle, label: 'Draft', value: stats.draft, color: '#6b7280' },
  ];

  const studioBaseUrl = '/studio/desk';

  return (
    <AdminLayout title="Content Queue">
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(232,176,88,0.12)',
              border: '1px solid rgba(232,176,88,0.2)',
            }}
          >
            <FileStack className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Content Queue
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Review and approve content submissions from editors
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsDisplay.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" style={{ color }} />
              <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {label}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <option value="all">All Types</option>
              <option value="doc">Documentation</option>
              <option value="article">Article</option>
              <option value="release">Release</option>
              <option value="roadmapItem">Roadmap Item</option>
              <option value="landingPage">Landing Page</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <option value="all">All Sources</option>
              <option value="sanity">Sanity</option>
              <option value="confluence">Confluence</option>
            </select>
          </div>
          <button
            onClick={fetchContent}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: 'var(--ifm-color-content)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
            <span className="ml-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Loading content...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <FileStack className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No content found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Title</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Type</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Source</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Author</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Modified</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Submitted</th>
                  <th className="text-center px-4 py-3 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = item.workflowConfig?.workflowStatus || 'draft';
                  const statusConfig = STATUS_CONFIG[status];
                  const isActionInProgress = actionLoading === item._id;
                  
                  return (
                    <tr
                      key={item._id}
                      style={{
                        background: cellBg,
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      }}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openPreview(item)}
                          className="font-medium text-left hover:underline"
                          style={{ color: '#E8B058', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                        >
                          {item.title}
                        </button>
                        {item.slug && (
                          <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            /{item.slug}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {TYPE_LABELS[item._type] || item._type}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: statusConfig.bg,
                            color: statusConfig.color,
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {item.workflowConfig?.source ? SOURCE_LABELS[item.workflowConfig.source] : '—'}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {item.workflowConfig?.submittedBy?.name || item.workflowConfig?.reviewedBy?.name || '—'}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatDate(item._updatedAt)}
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatDate(item.workflowConfig?.submittedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {isActionInProgress ? (
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#E8B058' }} />
                          ) : (
                            <>
                              {status === 'pending_review' && (
                                <>
                                  <button
                                    onClick={() => handleAction('approve', item._id, item._type)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                    style={{
                                      background: 'rgba(34,197,94,0.1)',
                                      color: '#22c55e',
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleAction('reject', item._id, item._type)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                    style={{
                                      background: 'rgba(239,68,68,0.1)',
                                      color: '#ef4444',
                                    }}
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {status === 'approved' && (
                                <button
                                  onClick={() => handleAction('publish', item._id, item._type)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                  style={{
                                    background: 'rgba(139,92,246,0.1)',
                                    color: '#8b5cf6',
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Publish
                                </button>
                              )}
                              {status === 'draft' && (
                                <button
                                  onClick={() => handleAction('submit_for_review', item._id, item._type)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                  style={{
                                    background: 'rgba(232,176,88,0.1)',
                                    color: '#E8B058',
                                  }}
                                >
                                  Submit
                                </button>
                              )}
                              <button
                                onClick={() => openPreview(item)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{
                                  background: 'rgba(232,176,88,0.1)',
                                  color: '#E8B058',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              <a
                                href={`${studioBaseUrl}/${item._type};${item._id}`}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{
                                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                  color: 'var(--ifm-color-content-secondary)',
                                }}
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Showing {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      )}

      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        contentId={previewModal.contentId}
        contentType={previewModal.contentType}
        contentSlug={previewModal.contentSlug}
        contentTitle={previewModal.contentTitle}
        studioBaseUrl={studioBaseUrl}
      />
    </AdminLayout>
  );
}

function ContentQueuePage() {
  return (
    <ProtectedRoute>
      <ContentQueuePageContent />
    </ProtectedRoute>
  );
}

export default function ContentQueuePageWrapper() {
  return (
    <Layout title="Content Queue | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <ContentQueuePage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
