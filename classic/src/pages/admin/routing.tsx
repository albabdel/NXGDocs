import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import {
  Route,
  Search,
  Edit,
  Eye,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  X,
  Save,
  Loader2,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  ArrowRight,
} from 'lucide-react';

type ComponentType = 'DocPage' | 'LandingPage' | 'Article' | 'ReleasePage' | 'Redirect';
type RouteType = 'internal' | 'external' | 'redirect';

interface ContentRef {
  _id: string;
  _type: string;
  title?: string;
  slug?: string;
}

interface RouteConfig {
  _id: string;
  path: string;
  title?: string;
  contentRef?: ContentRef;
  component?: ComponentType;
  redirectUrl?: string;
  isPublished: boolean;
  order?: number;
  _createdAt: string;
  _updatedAt: string;
}

interface ContentSearchResult {
  _id: string;
  _type: string;
  title: string;
  slug?: string;
}

const COMPONENT_LABELS: Record<ComponentType, string> = {
  DocPage: 'Documentation',
  LandingPage: 'Landing Page',
  Article: 'Article',
  ReleasePage: 'Release Notes',
  Redirect: 'Redirect',
};

const TYPE_LABELS: Record<string, string> = {
  doc: 'Doc',
  article: 'Article',
  release: 'Release',
  roadmapItem: 'Roadmap',
  landingPage: 'Landing',
};

function formatDate(dateStr: string): string {
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

function getRouteType(route: RouteConfig): RouteType {
  if (route.component === 'Redirect' || route.redirectUrl) return 'redirect';
  if (route.contentRef) return 'internal';
  return 'external';
}

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: RouteConfig | null;
  onSave: (data: {
    path: string;
    title: string;
    contentId?: string;
    component: ComponentType;
    redirectUrl?: string;
    isPublished: boolean;
    order?: number;
  }) => Promise<void>;
  isDark: boolean;
  loading: boolean;
}

function RouteModal({ isOpen, onClose, route, onSave, isDark, loading }: RouteModalProps) {
  const [path, setPath] = useState('');
  const [title, setTitle] = useState('');
  const [component, setComponent] = useState<ComponentType>('DocPage');
  const [contentId, setContentId] = useState('');
  const [contentSearch, setContentSearch] = useState('');
  const [contentResults, setContentResults] = useState<ContentSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [order, setOrder] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (route) {
      setPath(route.path);
      setTitle(route.title || '');
      setComponent(route.component || 'DocPage');
      setContentId(route.contentRef?._id || '');
      setRedirectUrl(route.redirectUrl || '');
      setIsPublished(route.isPublished);
      setOrder(route.order);
    } else {
      setPath('');
      setTitle('');
      setComponent('DocPage');
      setContentId('');
      setRedirectUrl('');
      setIsPublished(false);
      setOrder(undefined);
    }
    setContentSearch('');
    setContentResults([]);
  }, [route, isOpen]);

  const searchContent = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setContentResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/admin-routes?contentSearch=${encodeURIComponent(query)}`);
      const data = await res.json();
      setContentResults(data.items || []);
    } catch (err) {
      console.error('Content search error:', err);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentSearch) searchContent(contentSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [contentSearch, searchContent]);

  const handleSave = async () => {
    await onSave({
      path,
      title,
      contentId: component !== 'Redirect' ? contentId : undefined,
      component,
      redirectUrl: component === 'Redirect' ? redirectUrl : undefined,
      isPublished,
      order,
    });
  };

  if (!isOpen) return null;

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
    color: 'var(--ifm-color-content)',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: isDark ? 'rgba(20,20,20,0.98)' : 'rgba(255,255,255,0.98)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            {route ? 'Edit Route' : 'Add New Route'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Path *</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/docs/getting-started"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Getting Started"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Type</label>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value as ComponentType)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            >
              {Object.entries(COMPONENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {component === 'Redirect' ? (
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Redirect URL</label>
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Content (search to link)</label>
              <div className="relative">
                <input
                  type="text"
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  placeholder="Search content by title..."
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={inputStyle}
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#E8B058' }} />
                )}
              </div>
              {contentId && (
                <div className="mt-2 px-3 py-2 rounded-lg text-sm flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  <span>Linked: {contentResults.find(c => c._id === contentId)?.title || contentId}</span>
                  <button onClick={() => setContentId('')} className="hover:opacity-70"><X className="w-4 h-4" /></button>
                </div>
              )}
              {contentResults.length > 0 && !contentId && (
                <div className="mt-2 rounded-lg overflow-hidden border" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)' }}>
                  {contentResults.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => { setContentId(result._id); setContentResults([]); setContentSearch(''); }}
                      className="w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:opacity-70"
                      style={{
                        color: 'var(--ifm-color-content)',
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)'}`,
                      }}
                    >
                      <span>{result.title}</span>
                      <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>{TYPE_LABELS[result._type] || result._type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Order (optional)</label>
            <input
              type="number"
              value={order ?? ''}
              onChange={(e) => setOrder(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="isPublished" className="text-sm" style={{ color: 'var(--ifm-color-content)' }}>Published</label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.15)'}` }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: 'var(--ifm-color-content)' }}>Cancel</button>
          <button onClick={handleSave} disabled={loading || !path} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058', border: '1px solid rgba(232,176,88,0.2)', opacity: loading || !path ? 0.6 : 1 }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  route: RouteConfig | null;
  isDark: boolean;
  loading: boolean;
}

function DeleteConfirm({ isOpen, onClose, onConfirm, route, isDark, loading }: DeleteConfirmProps) {
  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: isDark ? 'rgba(20,20,20,0.98)' : 'rgba(255,255,255,0.98)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>Delete Route</h2>
            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>This action cannot be undone</p>
          </div>
        </div>
        <p className="mb-6 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Are you sure you want to delete the route <code style={{ color: '#E8B058' }}>{route.path}</code>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: 'var(--ifm-color-content)' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function RoutingEditorPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [routes, setRoutes] = useState<RouteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteConfig | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; route: RouteConfig | null }>({ open: false, route: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/admin-routes');
      if (!res.ok) throw new Error('Failed to fetch routes');
      const data = await res.json();
      setRoutes(data.items || []);
    } catch (err) {
      console.error('[Routing] Error:', err);
      setError('Failed to load routes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const matchesSearch = route.path.toLowerCase().includes(searchQuery.toLowerCase()) || (route.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' && route.isPublished) || (statusFilter === 'draft' && !route.isPublished);
      const routeType = getRouteType(route);
      const matchesType = typeFilter === 'all' || routeType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [routes, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: routes.length,
    published: routes.filter((r) => r.isPublished).length,
    drafts: routes.filter((r) => !r.isPublished).length,
    redirects: routes.filter((r) => r.component === 'Redirect' || r.redirectUrl).length,
  }), [routes]);

  const handleTogglePublished = async (route: RouteConfig) => {
    try {
      const res = await fetch(`/admin-routes?id=${route._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !route.isPublished }),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchRoutes();
    } catch (err) {
      console.error('Toggle error:', err);
      alert('Failed to update route status');
    }
  };

  const handleSaveRoute = async (data: { path: string; title: string; contentId?: string; component: ComponentType; redirectUrl?: string; isPublished: boolean; order?: number }) => {
    setActionLoading(true);
    try {
      const url = editingRoute ? `/admin-routes?id=${editingRoute._id}` : '/admin-routes';
      const method = editingRoute ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || 'Failed to save'); }
      setModalOpen(false);
      setEditingRoute(null);
      await fetchRoutes();
    } catch (err) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : 'Failed to save route');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoute = async () => {
    if (!deleteConfirm.route) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/admin-routes?id=${deleteConfirm.route._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteConfirm({ open: false, route: null });
      await fetchRoutes();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete route');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (route: RouteConfig) => { setEditingRoute(route); setModalOpen(true); };
  const openAddModal = () => { setEditingRoute(null); setModalOpen(true); };

  const cardBg = isDark ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)' : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';
  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const statsDisplay = [
    { label: 'Total Routes', value: stats.total, color: '#E8B058' },
    { label: 'Published', value: stats.published, color: '#22c55e' },
    { label: 'Drafts', value: stats.drafts, color: '#f59e0b' },
    { label: 'Redirects', value: stats.redirects, color: '#8b5cf6' },
  ];

  return (
    <AdminLayout title="Routing Editor">
      <div className="relative overflow-hidden rounded-2xl p-6 mb-8" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,176,88,0.12)', border: '1px solid rgba(232,176,88,0.2)' }}>
            <Route className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Routing Management</h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Create, edit, and delete URL routes for the documentation site</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsDisplay.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}` }}>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>{label}</span>
            <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 mb-8" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>Route List</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <input type="text" placeholder="Search by path..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`, color: 'var(--ifm-color-content)' }} />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')} className="pl-10 pr-8 py-2 rounded-lg text-sm appearance-none cursor-pointer" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`, color: 'var(--ifm-color-content)' }}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="pl-10 pr-8 py-2 rounded-lg text-sm appearance-none cursor-pointer" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`, color: 'var(--ifm-color-content)' }}>
                <option value="all">All Types</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="redirect">Redirect</option>
              </select>
            </div>
            <button onClick={openAddModal} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 justify-center" style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058', border: '1px solid rgba(232,176,88,0.2)' }}>
              <Plus className="w-4 h-4" />
              Add Route
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
            <span className="ml-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Loading routes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}` }}>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Path</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Target</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Modified</th>
                  <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => {
                  const routeType = getRouteType(route);
                  const typeLabel = routeType === 'redirect' ? 'Redirect' : routeType === 'internal' ? 'Internal' : 'External';
                  const typeColor = routeType === 'redirect' ? '#8b5cf6' : routeType === 'internal' ? '#22c55e' : '#E8B058';

                  return (
                    <tr key={route._id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)'}` }}>
                      <td className="py-3 px-4">
                        <code className="px-2 py-1 rounded text-sm" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)', color: '#E8B058' }}>{route.path}</code>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                        {routeType === 'redirect' ? (
                          <div className="flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" style={{ color: '#8b5cf6' }} />
                            <span className="truncate max-w-[200px]" title={route.redirectUrl}>{route.redirectUrl}</span>
                          </div>
                        ) : route.contentRef ? (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" style={{ color: '#22c55e' }} />
                            <span className="truncate max-w-[150px]" title={route.contentRef.title}>{route.contentRef.title || route.contentRef._id}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--ifm-color-content-secondary)' }}>—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs" style={{ background: `${typeColor}20`, color: typeColor }}>{typeLabel}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleTogglePublished(route)} className="flex items-center gap-1.5 cursor-pointer" title={route.isPublished ? 'Click to unpublish' : 'Click to publish'}>
                          {route.isPublished ? (
                            <>
                              <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
                              <span className="text-xs" style={{ color: '#22c55e' }}>Published</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
                              <span className="text-xs" style={{ color: '#f59e0b' }}>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>{formatDate(route._updatedAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(route)} className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)', color: 'var(--ifm-color-content)' }} title="Edit"><Edit className="w-4 h-4" /></button>
                          <a href={route.path} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)', color: 'var(--ifm-color-content)' }} title="View"><Eye className="w-4 h-4" /></a>
                          <button onClick={() => setDeleteConfirm({ open: true, route })} className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }} title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRoutes.length === 0 && (
              <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                <Route className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No routes found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </div>

      <RouteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} route={editingRoute} onSave={handleSaveRoute} isDark={isDark} loading={actionLoading} />
      <DeleteConfirm isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, route: null })} onConfirm={handleDeleteRoute} route={deleteConfirm.route} isDark={isDark} loading={actionLoading} />
    </AdminLayout>
  );
}

function RoutingEditorPage() {
  return (
    <ProtectedRoute>
      <RoutingEditorPageContent />
    </ProtectedRoute>
  );
}

export default function RoutingEditorPageWrapper() {
  return (
    <Layout title="Routing Editor | Admin">
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <RoutingEditorPage />}
      </BrowserOnly>
    </Layout>
  );
}
