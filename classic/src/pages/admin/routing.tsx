import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Route, GitBranch, ArrowRight, Layers } from 'lucide-react';

function RoutingEditorPageContent() {
  const [isDark, setIsDark] = useState(true);

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

  const features = [
    { icon: GitBranch, title: 'Rule-Based Routing', description: 'Configure automatic ticket routing based on category, priority, and custom rules' },
    { icon: ArrowRight, title: 'Assignment Rules', description: 'Define how tickets are assigned to team members or departments' },
    { icon: Layers, title: 'Priority Queues', description: 'Set up priority-based queues for different ticket types' },
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
              Configure ticket routing and assignment rules
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {features.map(({ icon: Icon, title, description }) => (
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

      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <Route className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Routing Editor Coming Soon
        </h3>
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Create and manage routing rules to automatically direct tickets to the right team members
          based on category, priority, language, or custom criteria.
        </p>
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
