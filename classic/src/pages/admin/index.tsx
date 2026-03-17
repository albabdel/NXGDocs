import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LogOut,
  LayoutDashboard,
  FileStack,
  Route,
  BarChart3,
  Ticket,
  Settings,
  Loader,
} from 'lucide-react';

function AdminDashboardContent() {
  const { user, logout, isLoading } = useAdminAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const sections = [
    { icon: FileStack, title: 'Content Queue', description: 'Manage and review content submissions', href: '/admin/content-queue' },
    { icon: Route, title: 'Routing', description: 'Configure ticket routing rules', href: '/admin/routing' },
    { icon: BarChart3, title: 'Analytics', description: 'View platform analytics and reports', href: '/admin/analytics' },
    { icon: Ticket, title: 'Tickets', description: 'Manage support tickets', href: '/admin/tickets' },
    { icon: Settings, title: 'Settings', description: 'Configure admin preferences', href: '/admin/settings' },
  ];

  return (
    <div>
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(232,176,88,0.12)',
                border: '1px solid rgba(232,176,88,0.2)',
              }}
            >
              <LayoutDashboard className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Admin Dashboard
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                Welcome, {user?.name || 'Admin'} · NXGEN Technology AG
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              color: 'var(--ifm-color-content-secondary)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ icon: Icon, title, description, href }) => (
          <a
            key={title}
            href={href}
            className="group rounded-xl p-5 transition-all hover:scale-[1.02]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              textDecoration: 'none',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(232,176,88,0.1)',
                  border: '1px solid rgba(232,176,88,0.2)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: '#E8B058' }} />
              </div>
              <div>
                <h3
                  className="font-semibold mb-1 group-hover:text-[#E8B058] transition-colors"
                  style={{ color: 'var(--ifm-color-content)' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }} />
    </div>
  );
}

function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

export default function AdminIndexPage() {
  return (
    <Layout
      title="Admin Dashboard | NXGEN"
      description="NXGEN admin dashboard for content management and analytics"
    >
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<DashboardLoader />}>
            {() => <AdminDashboard />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
