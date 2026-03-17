import React from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import {
  LayoutDashboard,
  FileStack,
  Route,
  BarChart3,
  Ticket,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Content Queue', path: '/admin/content', icon: FileStack },
  { label: 'Routing', path: '/admin/routing', icon: Route },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Tickets', path: '/admin/tickets', icon: Ticket },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Audit Logs', path: '/admin/audit', icon: FileText },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({ collapsed, onNavigate, onToggleCollapse }: AdminSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (itemPath: string): boolean => {
    if (itemPath === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '220px',
        background: 'var(--ifm-background-color)',
        borderRight: `1px solid var(--ifm-color-emphasis-200)`,
      }}
    >
      <div
        className="flex items-center justify-between px-3 h-14 border-b"
        style={{
          borderColor: 'var(--ifm-color-emphasis-200)',
        }}
      >
        {!collapsed && (
          <span
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            Admin Panel
          </span>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
            style={{
              background: 'var(--ifm-color-emphasis-100)',
              border: '1px solid var(--ifm-color-emphasis-200)',
              cursor: 'pointer',
              marginLeft: collapsed ? 'auto' : '0',
              marginRight: collapsed ? 'auto' : '0',
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            ) : (
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            )}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    background: active ? 'rgba(232, 176, 88, 0.12)' : 'transparent',
                    border: active ? '1px solid rgba(232, 176, 88, 0.25)' : '1px solid transparent',
                    color: active ? '#E8B058' : 'var(--ifm-color-content-secondary)',
                    textDecoration: 'none',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: active ? '#E8B058' : 'var(--ifm-color-content-secondary)' }}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className="px-3 py-3 border-t"
        style={{
          borderColor: 'var(--ifm-color-emphasis-200)',
        }}
      >
        {!collapsed && (
          <div
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              color: 'var(--ifm-color-content-secondary)',
              background: 'var(--ifm-color-emphasis-100)',
            }}
          >
            NXGEN Admin
          </div>
        )}
      </div>
    </aside>
  );
}
