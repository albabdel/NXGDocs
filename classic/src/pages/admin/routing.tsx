import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Route, Search, ExternalLink, Edit, Eye, Plus, Filter, CheckCircle, XCircle, Info, Layers, FileText, Settings } from 'lucide-react';

interface RouteItem {
  id: string;
  path: string;
  title: string;
  componentType: 'doc' | 'article' | 'landingPage' | 'releaseNote' | 'referencePage';
  contentReference: string;
  published: boolean;
}

const mockRoutes: RouteItem[] = [
  { id: '1', path: '/getting-started', title: 'Getting Started', componentType: 'landingPage', contentReference: 'landing-page:getting-started', published: true },
  { id: '2', path: '/docs/introduction', title: 'Introduction', componentType: 'doc', contentReference: 'doc:introduction', published: true },
  { id: '3', path: '/releases/v2.0', title: 'Version 2.0 Release', componentType: 'releaseNote', contentReference: 'release:v2.0', published: true },
  { id: '4', path: '/articles/security-best-practices', title: 'Security Best Practices', componentType: 'article', contentReference: 'article:security-bp', published: false },
  { id: '5', path: '/api/reference', title: 'API Reference', componentType: 'referencePage', contentReference: 'ref:api', published: false },
];

const componentTypeLabels: Record<string, string> = {
  doc: 'Documentation',
  article: 'Article',
  landingPage: 'Landing Page',
  releaseNote: 'Release Note',
  referencePage: 'Reference Page',
};

function RoutingEditorPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [routes, setRoutes] = useState<RouteItem[]>(mockRoutes);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchesSearch = route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = publishedFilter === 'all' ||
        (publishedFilter === 'published' && route.published) ||
        (publishedFilter === 'draft' && !route.published);
      return matchesSearch && matchesFilter;
    });
  }, [routes, searchQuery, publishedFilter]);

  const stats = [
    { label: 'Total Routes', value: routes.length, color: '#E8B058' },
    { label: 'Published', value: routes.filter(r => r.published).length, color: '#22c55e' },
    { label: 'Drafts', value: routes.filter(r => !r.published).length, color: '#f59e0b' },
  ];

  const togglePublished = (id: string) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));
  };

  const infoCards = [
    {
      icon: Route,
      title: 'How Routing Works',
      description: 'Routes map URL paths to content components. When a user visits a URL, the routing system resolves the path to render the appropriate content from Sanity CMS.',
    },
    {
      icon: Layers,
      title: 'Component Types',
      description: 'Different component types handle different content structures: Documentation for guides, Articles for blog posts, Landing Pages for marketing, Release Notes for changelogs.',
    },
    {
      icon: FileText,
      title: 'Best Practices',
      description: 'Use semantic paths that reflect content hierarchy. Keep slugs short and descriptive. Ensure all routes have unique paths and proper content references.',
    },
  ];

  return (
    <AdminLayout title="Routing Editor">
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
            <Route className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Routing Editor
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Manage URL routes and map them to content components
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {label}
            </span>
            <p className="text-2xl font-bold mt-1" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            Route List
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <input
                type="text"
                placeholder="Search by path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg text-sm w-full sm:w-64"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                  color: 'var(--ifm-color-content)',
                }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="pl-10 pr-8 py-2 rounded-lg text-sm appearance-none cursor-pointer"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                  color: 'var(--ifm-color-content)',
                }}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <a
              href="/studio/desk/route"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 justify-center"
              style={{
                background: 'rgba(232,176,88,0.1)',
                color: '#E8B058',
                border: '1px solid rgba(232,176,88,0.2)',
              }}
            >
              <Plus className="w-4 h-4" />
              Add Route
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}` }}>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Path</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Component Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Content Reference</th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)'}` }}>
                  <td className="py-3 px-4">
                    <code
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)',
                        color: '#E8B058',
                      }}
                    >
                      {route.path}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--ifm-color-content)' }}>{route.title}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)',
                        color: 'var(--ifm-color-content)',
                      }}
                    >
                      {componentTypeLabels[route.componentType]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)',
                        color: 'var(--ifm-color-content-secondary)',
                      }}
                    >
                      {route.contentReference}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublished(route.id)}
                      className="flex items-center gap-1.5 cursor-pointer"
                      title={route.published ? 'Click to unpublish' : 'Click to publish'}
                    >
                      {route.published ? (
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
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/studio/desk/route;${route.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)',
                          color: 'var(--ifm-color-content)',
                        }}
                        title="Edit in Sanity Studio"
                      >
                        <Edit className="w-4 h-4" />
                      </a>
                      <a
                        href={route.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)',
                          color: 'var(--ifm-color-content)',
                        }}
                        title="View page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRoutes.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              <Route className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No routes found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infoCards.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl p-5"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <Icon className="w-6 h-6 mb-3" style={{ color: '#E8B058' }} />
            <h3 className="font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {description}
            </p>
          </div>
        ))}
      </div>
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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <RoutingEditorPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
