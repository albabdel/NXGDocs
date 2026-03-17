import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Users, UserCheck, UserPlus, Shield, User } from 'lucide-react';

function UsersPageContent() {
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
    { icon: Users, label: 'Total Users', value: '0', color: '#E8B058' },
    { icon: UserCheck, label: 'Active', value: '0', color: '#22c55e' },
    { icon: UserPlus, label: 'New This Month', value: '0', color: '#3b82f6' },
    { icon: Shield, label: 'Admins', value: '0', color: '#8b5cf6' },
  ];

  return (
    <AdminLayout title="Users">
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
            <Users className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              User Management
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Manage user accounts and permissions
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
        className="rounded-xl p-6 mb-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            User List
          </h3>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: 'rgba(232,176,88,0.1)',
              color: '#E8B058',
              border: '1px solid rgba(232,176,88,0.2)',
              cursor: 'pointer',
            }}
          >
            Add User
          </button>
        </div>
        <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No users to display</p>
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          User Management Coming Soon
        </h3>
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Create, edit, and manage user accounts. Assign roles and permissions,
          view activity history, and control access to admin features.
        </p>
      </div>
    </AdminLayout>
  );
}

function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  );
}

export default function UsersPageWrapper() {
  return (
    <Layout title="Users | Admin">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <UsersPage />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
