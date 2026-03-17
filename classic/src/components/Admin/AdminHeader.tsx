import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  onCollapseClick?: () => void;
  sidebarCollapsed?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader({
  title = 'Admin Dashboard',
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed = false,
}: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: '64px',
        background: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--ifm-color-content)' }} />
        </button>

        <button
          onClick={onCollapseClick}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            cursor: 'pointer',
          }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
          ) : (
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
          )}
        </button>

        <h1
          className="text-lg font-semibold"
          style={{ color: 'var(--ifm-color-content)' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            cursor: 'pointer',
          }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
              style={{
                background: '#E8B058',
                color: '#1a1a1a',
              }}
            >
              {user?.name ? getInitials(user.name) : <User className="w-4 h-4" />}
            </div>
            <span
              className="hidden sm:block text-sm font-medium"
              style={{ color: 'var(--ifm-color-content)' }}
            >
              {user?.name || 'Admin'}
            </span>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-lg"
              style={{
                background: isDark ? 'rgba(17, 17, 17, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
                <p className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {user?.email || 'admin@nxgen.com'}
                </p>
                <div className="mt-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      background: 'rgba(232, 176, 88, 0.15)',
                      color: '#E8B058',
                      border: '1px solid rgba(232, 176, 88, 0.3)',
                    }}
                  >
                    {user?.role?.toUpperCase() || 'ADMIN'}
                  </span>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    color: '#ef4444',
                    background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
