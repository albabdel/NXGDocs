import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenuClick = () => {
    setMobileDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setMobileDrawerOpen(false);
  };

  const handleNavigate = () => {
    setMobileDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <div
      data-admin-layout
      data-sidebar-collapsed={sidebarCollapsed}
      className="admin-layout-container min-h-screen"
      style={{
        backgroundColor: 'var(--ifm-background-color)',
        '--admin-sidebar-width': sidebarCollapsed ? '64px' : '220px',
      } as React.CSSProperties}
    >
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={handleCloseDrawer}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar
          collapsed={false}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Desktop Sidebar - CSS-controlled width via --admin-sidebar-width */}
      <div
        className="admin-sidebar-wrapper fixed inset-y-0 left-0 z-30 hidden lg:block"
        style={{ width: 'var(--admin-sidebar-width)' }}
      >
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Header */}
      <AdminHeader
        title={title}
        onMenuClick={handleMenuClick}
        onCollapseClick={handleToggleCollapse}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content - CSS-controlled margin via .admin-main-content */}
      <main
        className="admin-main-content pt-16 transition-all duration-300 ease-in-out"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
