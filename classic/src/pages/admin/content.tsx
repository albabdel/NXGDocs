import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { FileStack, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function ContentQueuePageContent() {
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

  const stats = [
    { icon: Clock, label: 'Pending Review', value: '0', color: '#E8B058' },
    { icon: CheckCircle, label: 'Approved', value: '0', color: '#22c55e' },
    { icon: XCircle, label: 'Rejected', value: '0', color: '#ef4444' },
    { icon: AlertCircle, label: 'Flagged', value: '0', color: '#f59e0b' },
  ];

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
        {stats.map(({ icon: Icon, label, value, color }) => (
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
        className="rounded-xl p-8 text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <FileStack className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Content Queue Coming Soon
        </h3>
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          This feature will allow editors to submit content for review and approval.
          Administrators will be able to approve, reject, or request changes to submissions.
        </p>
      </div>
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
