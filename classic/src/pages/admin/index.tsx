import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  LogOut,
  LayoutDashboard,
  FileStack,
  Route,
  BarChart3,
  Ticket,
  Users,
  FileText,
  Settings,
  Loader,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileCheck,
  Plus,
  Zap,
  Activity,
  Server,
  RefreshCw,
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

  const quickStats = [
    { icon: FileCheck, label: 'Pending Reviews', value: '12', href: '/admin/content?status=pending_review', color: '#E8B058' },
    { icon: Ticket, label: 'Open Tickets', value: '8', href: '/admin/tickets?status=open', color: '#f59e0b' },
    { icon: Users, label: 'Active Users', value: '234', href: '/admin/users', color: '#22c55e' },
    { icon: FileStack, label: 'Total Content', value: '156', href: '/admin/content', color: '#3b82f6' },
  ];

  const recentActivity = [
    { action: 'Content approved', user: 'Sarah Chen', timestamp: '5 minutes ago', resource: 'Getting Started Guide' },
    { action: 'Ticket resolved', user: 'Mike Johnson', timestamp: '12 minutes ago', resource: 'TKT-1234' },
    { action: 'User role updated', user: 'Admin', timestamp: '1 hour ago', resource: 'john.doe@nxgen.io' },
    { action: 'New route created', user: 'Sarah Chen', timestamp: '2 hours ago', resource: 'docs-support-routing' },
    { action: 'Content submitted', user: 'Alex Rivera', timestamp: '3 hours ago', resource: 'API Reference v2.1' },
  ];

  const sections = [
    { icon: FileStack, title: 'Content Queue', description: 'Manage and review content submissions', href: '/admin/content' },
    { icon: Route, title: 'Routing', description: 'Configure ticket routing rules', href: '/admin/routing' },
    { icon: BarChart3, title: 'Analytics', description: 'View platform analytics and reports', href: '/admin/analytics' },
    { icon: Ticket, title: 'Tickets', description: 'Manage support tickets', href: '/admin/tickets' },
    { icon: Users, title: 'Users', description: 'Manage user accounts and permissions', href: '/admin/users' },
    { icon: FileText, title: 'Audit Logs', description: 'View system audit trails', href: '/admin/audit' },
    { icon: Settings, title: 'Settings', description: 'Configure admin preferences', href: '/admin/settings' },
  ];

  return (
    <AdminLayout title="Dashboard">
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
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {user?.email || 'admin@nxgen.io'} · NXGEN Technology AG
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map(({ icon: Icon, label, value, href, color }) => (
          <a
            key={label}
            href={href}
            className="rounded-xl p-4 transition-all hover:scale-[1.02] group"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
              textDecoration: 'none',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" style={{ color }} />
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              {value}
            </p>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {label}
            </span>
          </a>
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
            <Activity className="w-5 h-5" style={{ color: '#E8B058' }} />
            <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: '#E8B058' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                      {event.action}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      by {event.user}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs truncate" style={{ color: '#E8B058' }}>
                      {event.resource}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      · {event.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            <Zap className="w-5 h-5" style={{ color: '#E8B058' }} />
            <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/content?status=pending_review"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                textDecoration: 'none',
              }}
            >
              <FileCheck className="w-5 h-5" style={{ color: '#E8B058' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                Review Pending
              </span>
            </a>
            <a
              href="/admin/tickets?status=open"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                textDecoration: 'none',
              }}
            >
              <Ticket className="w-5 h-5" style={{ color: '#f59e0b' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                View Tickets
              </span>
            </a>
            <a
              href="/admin/routing?action=new"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                textDecoration: 'none',
              }}
            >
              <Plus className="w-5 h-5" style={{ color: '#22c55e' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                Add New Route
              </span>
            </a>
            <a
              href="/studio"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                textDecoration: 'none',
              }}
            >
              <ExternalLink className="w-5 h-5" style={{ color: '#3b82f6' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                Open Studio
              </span>
            </a>
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
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5" style={{ color: '#E8B058' }} />
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            System Status
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>All Systems</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
            <RefreshCw className="w-5 h-5" style={{ color: '#22c55e' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>Last Deploy</p>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>Sanity CMS</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}>
            <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>Confluence Sync</p>
              <p className="text-xs" style={{ color: '#f59e0b' }}>Pending (5 min)</p>
            </div>
          </div>
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
    </AdminLayout>
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
