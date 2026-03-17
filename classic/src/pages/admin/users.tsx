import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Users, UserCheck, Shield, Edit3, Eye, Filter, Loader2 } from 'lucide-react';

interface AdminUser {
  _id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'editor' | 'reviewer';
  lastLoginAt: string | null;
  loginCount: number;
  isActive: boolean;
  createdAt: string | null;
}

interface UsersData {
  users: AdminUser[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    adminCount: number;
    editorCount: number;
    reviewerCount: number;
  };
}

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'rgba(232,176,88,0.15)', text: '#E8B058' },
  editor: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  reviewer: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
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

function getUserStatus(user: AdminUser): boolean {
  if (!user.lastLoginAt) return false;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return new Date(user.lastLoginAt).getTime() > sevenDaysAgo;
}

function UsersPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin-users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const json: UsersData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const stats = [
    { icon: Users, label: 'Total Users', value: data?.stats.totalUsers?.toString() ?? '0' },
    { icon: UserCheck, label: 'Active Users', value: data?.stats.activeUsers?.toString() ?? '0' },
    { icon: Shield, label: 'Admins', value: data?.stats.adminCount?.toString() ?? '0' },
    { icon: Edit3, label: 'Editors', value: data?.stats.editorCount?.toString() ?? '0' },
  ];

  const users = data?.users ?? [];
  const filteredUsers = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

  const studioBaseUrl = '/studio/desk/adminUser';

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
              Users
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Manage user accounts and permissions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
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
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>{value}</p>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
            User List
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                  color: 'var(--ifm-color-content)',
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading users...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8" style={{ color: '#ef4444' }}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Name</th>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Email</th>
                  <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Role</th>
                  <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Last Login</th>
                  <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Logins</th>
                  <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Status</th>
                  <th className="text-center py-3 px-2 font-medium" style={{ color: 'var(--ifm-color-content-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isActive = getUserStatus(user);
                  const displayName = user.name || user.email.split('@')[0];
                  return (
                    <tr key={user._id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{
                              background: roleColors[user.role].bg,
                              color: roleColors[user.role].text,
                            }}
                          >
                            {getInitials(displayName)}
                          </div>
                          <span style={{ color: 'var(--ifm-color-content)' }}>{displayName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {user.email}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span
                          className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: roleColors[user.role].bg,
                            color: roleColors[user.role].text,
                          }}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="text-center py-3 px-2" style={{ color: 'var(--ifm-color-content)' }}>
                        {user.loginCount}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span
                          className="inline-block px-2 py-1 rounded-full text-xs"
                          style={{
                            background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)',
                            color: isActive ? '#22c55e' : '#6b7280',
                          }}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/admin/audit?userId=${user._id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              color: 'var(--ifm-color-content-secondary)',
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            Activity
                          </a>
                          <a
                            href={`${studioBaseUrl}/${user._id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{
                              background: 'rgba(232,176,88,0.1)',
                              color: '#E8B058',
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users match the selected filter</p>
          </div>
        )}
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
