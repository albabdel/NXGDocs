import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { FileText, Activity, Filter, Download } from 'lucide-react';

function AuditLogsPageContent() {
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

  return (
    <AdminLayout title="Audit Logs">
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
            <FileText className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Audit Logs
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              System activity and change history
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 mb-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content-secondary)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: 'var(--ifm-color-content)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <option>All Actions</option>
              <option>Created</option>
              <option>Updated</option>
              <option>Deleted</option>
              <option>Login</option>
            </select>
          </div>
          <button
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: 'rgba(232,176,88,0.1)',
              color: '#E8B058',
              border: '1px solid rgba(232,176,88,0.2)',
              cursor: 'pointer',
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div
        className="rounded-xl p-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No audit logs available</p>
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center mt-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Audit Logs Coming Soon
        </h3>
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Track all system activities including user actions, content changes,
          configuration updates, and security events with detailed timestamps.
        </p>
      </div>
    </AdminLayout>
  );
}

function AuditLogsPage() {
  return (
    <ProtectedRoute>
      <AuditLogsPageContent />
    </ProtectedRoute>
  );
}

export default function AuditLogsPageWrapper() {
  return (
    <Layout title="Audit Logs | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <AuditLogsPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
