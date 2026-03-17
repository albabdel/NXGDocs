import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { BarChart3, Eye, Users, Clock, FileStack, TrendingUp, PieChart } from 'lucide-react';

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

  const kpiCards = [
    { icon: Eye, label: 'Total Views', value: '12,345', change: '+12%' },
    { icon: Users, label: 'Active Users', value: '234', change: '+8%' },
    { icon: FileStack, label: 'Pending Reviews', value: '5', change: '-2' },
    { icon: Clock, label: 'Avg Approval Time', value: '2.3h', change: '-15%' },
  ];

  const topContent = [
    { title: 'Getting Started Guide', views: 3456, status: 'Published', updated: '2 hours ago' },
    { title: 'API Reference Overview', views: 2890, status: 'Published', updated: '1 day ago' },
    { title: 'Configuration Tutorial', views: 1876, status: 'Pending Review', updated: '3 hours ago' },
    { title: 'Security Best Practices', views: 1234, status: 'Draft', updated: '5 days ago' },
    { title: 'Deployment Guide', views: 987, status: 'Published', updated: '1 week ago' },
  ];

  const metrics = [
    { label: 'Approval Rate', value: '85%', color: '#22c55e' },
    { label: 'Rejection Rate', value: '10%', color: '#ef4444' },
    { label: 'Avg Review Time', value: '2.3 hours', color: '#E8B058' },
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
        {kpiCards.map(({ icon: Icon, label, value, change }) => (
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
                  color: change.startsWith('+') ? '#22c55e' : change.startsWith('-') ? '#22c55e' : 'var(--ifm-color-content-secondary)',
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
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: '#E8B058' }} />
            <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Content Views Over Time
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Line chart placeholder
              </p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5" style={{ color: '#E8B058' }} />
            <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Content by Status
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }}>
            <div className="text-center">
              <PieChart className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Pie chart placeholder
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
          Top Content
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Title</th>
                <th className="text-right py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Views</th>
                <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                <th className="text-right py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                  <td className="py-3 px-2" style={{ color: 'var(--ifm-color-content)' }}>{item.title}</td>
                  <td className="text-right py-3 px-2" style={{ color: 'var(--ifm-color-content)' }}>{item.views.toLocaleString()}</td>
                  <td className="text-center py-3 px-2">
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs"
                      style={{
                        background: item.status === 'Published' ? 'rgba(34,197,94,0.15)' : item.status === 'Pending Review' ? 'rgba(232,176,88,0.15)' : 'rgba(107,114,128,0.15)',
                        color: item.status === 'Published' ? '#22c55e' : item.status === 'Pending Review' ? '#E8B058' : '#6b7280',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          Review Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-lg p-4 text-center"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
              <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
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
