import React, { useEffect, useState, useCallback, useRef } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { ProtectedRoute } from '../../components/Admin/ProtectedRoute';
import { AdminLayout } from '../../components/Admin/AdminLayout';
import { Users, UserCheck, Shield, Edit3, Eye, Filter, Loader2, X, Mail, Calendar, Activity, Clock, Power, LogOut, Search, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminUser {
  _id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'editor' | 'reviewer';
  lastLoginAt: string | null;
  loginCount: number;
  isActive: boolean;
  createdAt: string | null;
  lastAction: string | null;
  lastActionTime: string | null;
  actionsToday: number;
  actionsThisWeek: number;
}

interface UsersData {
  users: AdminUser[];
  stats: {
    totalUsers: number;
    activeToday: number;
    activeThisWeek: number;
    adminCount: number;
    editorCount: number;
    reviewerCount: number;
    activeStatusCount: number;
    inactiveCount: number;
  };
}

interface AuditLog {
  _id: string;
  action: string;
  resourceType?: string;
  resourceTitle?: string;
  timestamp: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  editor: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  reviewer: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
};

const actionLabels: Record<string, string> = {
  'content.create': 'Created content',
  'content.update': 'Updated content',
  'content.delete': 'Deleted content',
  'content.publish': 'Published content',
  'content.approve': 'Approved content',
  'content.reject': 'Rejected content',
  'user.login': 'Logged in',
  'user.logout': 'Logged out',
  'user.role_update': 'Role updated',
  'user.activate': 'Account activated',
  'user.deactivate': 'Account deactivated',
  'user.session_reset': 'Session reset',
  'settings.update': 'Updated settings',
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

function formatFullDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getUserLoginStatus(user: AdminUser): 'active' | 'recent' | 'inactive' {
  if (!user.lastLoginAt) return 'inactive';
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const lastLogin = new Date(user.lastLoginAt).getTime();
  
  if (lastLogin > oneDayAgo) return 'active';
  if (lastLogin > sevenDaysAgo) return 'recent';
  return 'inactive';
}

function UserDetailModal({
  isOpen,
  onClose,
  user,
  isDark,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  isDark: boolean;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'reviewer'>('editor');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      setSelectedRole(user.role);
      fetchUserAuditLogs();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const fetchUserAuditLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/admin-audit-logs?actorId=${user._id}&limit=20`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'update_role' | 'activate' | 'deactivate' | 'reset_session') => {
    if (!user) return;
    setActionLoading(action);
    try {
      const body: Record<string, unknown> = { userId: user._id, action };
      if (action === 'update_role') {
        body.role = selectedRole;
      }
      
      const res = await fetch('/admin-user-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Action failed');
      }
      
      setToast({ message: 'Action completed successfully', type: 'success' });
      setShowRoleSelect(false);
      onUpdate();
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Action failed', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen || !user) return null;

  const loginStatus = getUserLoginStatus(user);
  const statusColor = loginStatus === 'active' ? '#22c55e' : loginStatus === 'recent' ? '#E8B058' : '#6b7280';
  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: isDark ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${borderColor}`,
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            background: isDark ? 'rgba(232,176,88,0.05)' : 'rgba(232,176,88,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: roleColors[user.role].bg, color: roleColors[user.role].text }}
            >
              {getInitials(user.name || user.email.split('@')[0])}
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                {user.name || user.email.split('@')[0]}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: roleColors[user.role].bg, color: roleColors[user.role].text }}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: statusColor }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
                  {loginStatus === 'active' ? 'Online' : loginStatus === 'recent' ? 'Recent' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <X className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          </button>
        </div>

        {toast && (
          <div
            className="px-6 py-2 flex items-center gap-2"
            style={{ background: toast.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
            ) : (
              <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
            )}
            <span className="text-sm" style={{ color: toast.type === 'success' ? '#22c55e' : '#ef4444' }}>
              {toast.message}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ background: cellBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Email</span>
              </div>
              <p className="text-sm font-medium break-all" style={{ color: 'var(--ifm-color-content)' }}>{user.email}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: cellBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Created</span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>{formatFullDate(user.createdAt)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: cellBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Last Login</span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>{formatFullDate(user.lastLoginAt)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: cellBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>Activity</span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>{user.actionsToday} today / {user.actionsThisWeek} this week</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ifm-color-content)' }}>Actions</h3>
            <div className="flex flex-wrap gap-2">
              {showRoleSelect ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'editor' | 'reviewer')}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: 'var(--ifm-color-content)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                  <button
                    onClick={() => handleAction('update_role')}
                    disabled={actionLoading !== null}
                    className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                    style={{
                      background: 'rgba(59,130,246,0.15)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59,130,246,0.3)',
                      cursor: actionLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {actionLoading === 'update_role' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    Confirm
                  </button>
                  <button onClick={() => setShowRoleSelect(false)} className="px-2 py-1.5 rounded-lg text-sm" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: 'var(--ifm-color-content-secondary)' }}>Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRoleSelect(true)}
                  disabled={actionLoading !== null}
                  className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', cursor: actionLoading ? 'wait' : 'pointer' }}
                >
                  <Edit3 className="w-3 h-3" /> Change Role
                </button>
              )}
              {user.isActive !== false ? (
                <button
                  onClick={() => handleAction('deactivate')}
                  disabled={actionLoading !== null}
                  className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: actionLoading ? 'wait' : 'pointer' }}
                >
                  {actionLoading === 'deactivate' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />} Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleAction('activate')}
                  disabled={actionLoading !== null}
                  className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', cursor: actionLoading ? 'wait' : 'pointer' }}
                >
                  {actionLoading === 'activate' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />} Activate
                </button>
              )}
              <button
                onClick={() => handleAction('reset_session')}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                style={{ background: 'rgba(232,176,88,0.15)', color: '#E8B058', border: '1px solid rgba(232,176,88,0.3)', cursor: actionLoading ? 'wait' : 'pointer' }}
              >
                {actionLoading === 'reset_session' ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />} Reset Session
              </button>
              <Link to={`/admin/audit?userId=${user._id}`} className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: 'var(--ifm-color-content)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, textDecoration: 'none' }}>
                <Eye className="w-3 h-3" /> View Full Audit
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ifm-color-content)' }}>Recent Activity</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} /></div>
            ) : auditLogs.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>No recent activity</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log._id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: cellBg }}>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058' }}>{actionLabels[log.action] || log.action}</span>
                      {log.resourceTitle && <span className="text-sm truncate" style={{ color: 'var(--ifm-color-content)', maxWidth: '200px' }}>{log.resourceTitle}</span>}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>{formatDate(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersPageContent() {
  const [isDark, setIsDark] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/admin-users', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const json: UsersData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)';
  const cellHoverBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';

  const stats = [
    { icon: Users, label: 'Total', value: data?.stats.totalUsers?.toString() ?? '0', color: '#E8B058' },
    { icon: UserCheck, label: 'Active Today', value: data?.stats.activeToday?.toString() ?? '0', color: '#22c55e' },
    { icon: Shield, label: 'Admins', value: data?.stats.adminCount?.toString() ?? '0', color: '#ef4444' },
    { icon: Edit3, label: 'Editors', value: data?.stats.editorCount?.toString() ?? '0', color: '#3b82f6' },
  ];

  const users = data?.users ?? [];
  
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all') {
      const loginStatus = getUserLoginStatus(u);
      if (statusFilter === 'active' && loginStatus !== 'active') return false;
      if (statusFilter === 'inactive' && loginStatus === 'active') return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = (u.name || '').toLowerCase();
      const email = u.email.toLowerCase();
      if (!name.includes(query) && !email.includes(query)) return false;
    }
    return true;
  });

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
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>{value}</p>
            <span className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>{label}</span>
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>User List</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm w-32"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                  color: 'var(--ifm-color-content)',
                }}
              />
            </div>
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                  color: 'var(--ifm-color-content)',
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table className="w-full text-sm" style={{ width: '100%', minWidth: 'auto' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                  <th className="text-left py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '140px' }}>Name</th>
                  <th className="text-left py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '160px' }}>Email</th>
                  <th className="text-center py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '70px' }}>Role</th>
                  <th className="text-center py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '80px' }}>Last Login</th>
                  <th className="text-center py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '60px' }}>Actions</th>
                  <th className="text-center py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '50px' }}>Status</th>
                  <th className="text-center py-2 px-2 font-medium whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)', width: '80px' }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const loginStatus = getUserLoginStatus(user);
                  const statusColor = loginStatus === 'active' ? '#22c55e' : loginStatus === 'recent' ? '#E8B058' : '#6b7280';
                  const displayName = user.name || user.email.split('@')[0];
                  const isDisabled = user.isActive === false;
                  
                  return (
                    <tr
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      style={{
                        background: cellBg,
                        cursor: 'pointer',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                        opacity: isDisabled ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = cellHoverBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = cellBg; }}
                    >
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                            style={{ background: roleColors[user.role].bg, color: roleColors[user.role].text }}
                          >
                            {getInitials(displayName)}
                          </div>
                          <span className="truncate" style={{ color: 'var(--ifm-color-content)', maxWidth: '100px' }} title={displayName}>
                            {displayName.length > 14 ? displayName.slice(0, 14) + '...' : displayName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <span className="truncate" style={{ display: 'inline-block', maxWidth: '140px' }} title={user.email}>
                          {user.email.length > 18 ? user.email.slice(0, 18) + '...' : user.email}
                        </span>
                      </td>
                      <td className="text-center py-2 px-2">
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: roleColors[user.role].bg,
                            color: roleColors[user.role].text,
                            display: 'inline-block',
                          }}
                        >
                          {user.role.charAt(0).toUpperCase()}
                        </span>
                      </td>
                      <td className="text-center py-2 px-2 whitespace-nowrap" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="text-center py-2 px-2" style={{ color: 'var(--ifm-color-content)' }}>
                        <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                          {user.actionsToday}/{user.actionsThisWeek}
                        </span>
                      </td>
                      <td className="text-center py-2 px-2">
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: statusColor,
                            display: 'inline-block',
                          }}
                          title={loginStatus === 'active' ? 'Online' : loginStatus === 'recent' ? 'Recent' : 'Offline'}
                        />
                      </td>
                      <td className="text-center py-2 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/admin/audit?userId=${user._id}`}
                            className="inline-flex items-center justify-center w-6 h-6 rounded text-xs"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              color: 'var(--ifm-color-content-secondary)',
                              textDecoration: 'none',
                            }}
                            title="Activity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="w-3 h-3" />
                          </Link>
                          <a
                            href={`${studioBaseUrl}/${user._id}`}
                            className="inline-flex items-center justify-center w-6 h-6 rounded text-xs"
                            style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058' }}
                            title="Edit in Studio"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit3 className="w-3 h-3" />
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
            <p className="text-sm">No users match the selected filters</p>
          </div>
        )}
      </div>

      <UserDetailModal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        isDark={isDark}
        onUpdate={fetchUsers}
      />
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
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <UsersPage />}
      </BrowserOnly>
    </Layout>
  );
}
