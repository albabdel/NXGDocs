import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { BarChart3, TrendingUp, Users, Clock, Ticket } from 'lucide-react';

function AnalyticsDashboardPageContent() {
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

  const metrics = [
    { icon: Ticket, label: 'Total Tickets', value: '0', change: '+0%' },
    { icon: Clock, label: 'Avg. Response Time', value: '0m', change: '0%' },
    { icon: Users, label: 'Active Users', value: '0', change: '+0%' },
    { icon: TrendingUp, label: 'Resolution Rate', value: '0%', change: '+0%' },
  ];

  return (
    <AdminLayout title="Analytics Dashboard">
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
            <BarChart3 className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Analytics Dashboard
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Platform metrics and performance insights
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(({ icon: Icon, label, value, change }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" style={{ color: '#E8B058' }} />
              <span
                className="text-xs"
                style={{
                  color: change.startsWith('+') ? '#22c55e' : change.startsWith('-') ? '#ef4444' : 'var(--ifm-color-content-secondary)',
                }}
              >
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              {value}
            </p>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div
          className="rounded-xl p-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
            Ticket Volume
          </h3>
          <div className="h-40 flex items-center justify-center rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Chart placeholder
            </p>
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <h3 className="font-semibold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
            Response Time Distribution
          </h3>
          <div className="h-40 flex items-center justify-center rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Chart placeholder
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Full Analytics Coming Soon
        </h3>
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Detailed analytics including ticket trends, team performance, customer satisfaction metrics,
          and customizable reports will be available here.
        </p>
      </div>
    </AdminLayout>
  );
}

function AnalyticsDashboardPage() {
  return (
    <ProtectedRoute>
      <AnalyticsDashboardPageContent />
    </ProtectedRoute>
  );
}

export default function AnalyticsDashboardPageWrapper() {
  return (
    <Layout title="Analytics | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <AnalyticsDashboardPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
