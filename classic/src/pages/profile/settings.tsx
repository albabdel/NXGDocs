// classic/src/pages/profile/settings.tsx
// User settings/preferences page
//
// Purpose:
//   - Allow users to customize their preferences
//   - Theme selection with cross-device sync
//   - Language, notifications, and other preferences

import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProtectedRoute } from '../../components/Auth/UserProtectedRoute';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useThemeSync, ThemeMode } from '../../hooks/useThemeSync';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Bell,
  Globe,
  Sidebar,
  Home,
  Save,
  Check,
  Loader,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from '@docusaurus/Link';

// Import profile styles
import '../../css/components/profile.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

// ---------------------------------------------------------------------------
// Settings Page Content
// ---------------------------------------------------------------------------

function SettingsPageContent() {
  const { user } = useAuth0();
  const { profile, preferences, loading, updatePreferences, refetch } = useUserProfile();
  const { theme, setTheme, synced } = useThemeSync();

  // Local state for form
  const [language, setLanguage] = useState('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    updates: true,
  });
  const [homepageView, setHomepageView] = useState('default');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });

  // Initialize form from preferences
  useEffect(() => {
    if (preferences) {
      setLanguage(preferences.language || 'en');
      setSidebarCollapsed(preferences.sidebar_collapsed ?? false);
      setNotifications(preferences.notification_settings || { email: true, browser: true, updates: true });
      setHomepageView(preferences.homepage_view || 'default');
    }
  }, [preferences]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    showToast(`Theme set to ${newTheme === 'system' ? 'auto' : newTheme}`, 'success');
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save all preferences
  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences({
        theme,
        language,
        sidebar_collapsed: sidebarCollapsed,
        notification_settings: notifications,
        homepage_view: homepageView,
      });
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save settings. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  return (
    <div className="container margin-vert--lg">
      {/* Back link */}
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: 'var(--ifm-color-content-secondary)' }}
      >
        ← Back to Profile
      </Link>

      {/* Header */}
      <div className="profile-header-card" style={{ marginBottom: '1.5rem' }}>
        <div className="profile-header-top-bar" />
        <div className="flex items-center gap-3">
          <div className="profile-quick-link-icon">
            <Settings className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Settings
            </h1>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              Customize your experience
            </p>
          </div>
        </div>
        {synced && (
          <div
            className="flex items-center gap-2 mt-3 text-xs"
            style={{ color: '#22c55e' }}
          >
            <CheckCircle className="w-3 h-3" />
            Preferences synced across devices
          </div>
        )}
      </div>

      {/* Theme Section */}
      <div className="settings-section-card">
        <div className="settings-section-title">
          <Sun className="w-4 h-4" style={{ color: '#E8B058' }} />
          Theme
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Choose your preferred color scheme. Your choice syncs across all your devices.
        </p>
        <div className="theme-selector-grid">
          <button
            onClick={() => handleThemeChange('light')}
            className={`theme-option ${theme === 'light' ? 'theme-option--selected' : ''}`}
          >
            <Sun className="theme-option-icon" />
            <span className="theme-option-label">Light</span>
            {theme === 'light' && <Check className="w-3 h-3" style={{ color: '#E8B058' }} />}
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`theme-option ${theme === 'dark' ? 'theme-option--selected' : ''}`}
          >
            <Moon className="theme-option-icon" />
            <span className="theme-option-label">Dark</span>
            {theme === 'dark' && <Check className="w-3 h-3" style={{ color: '#E8B058' }} />}
          </button>
          <button
            onClick={() => handleThemeChange('system')}
            className={`theme-option ${theme === 'system' ? 'theme-option--selected' : ''}`}
          >
            <Monitor className="theme-option-icon" />
            <span className="theme-option-label">Auto</span>
            {theme === 'system' && <Check className="w-3 h-3" style={{ color: '#E8B058' }} />}
          </button>
        </div>
      </div>

      {/* Language Section */}
      <div className="settings-section-card">
        <div className="settings-section-title">
          <Globe className="w-4 h-4" style={{ color: '#E8B058' }} />
          Language
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Select your preferred language for the documentation.
        </p>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="settings-select"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>

      {/* Notifications Section */}
      <div className="settings-section-card">
        <div className="settings-section-title">
          <Bell className="w-4 h-4" style={{ color: '#E8B058' }} />
          Notifications
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Choose how you want to receive notifications.
        </p>
        
        <div className="toggle-row">
          <span className="toggle-label">Email notifications</span>
          <button
            onClick={() => handleNotificationToggle('email')}
            className={`toggle-switch ${notifications.email ? 'toggle-switch--on' : ''}`}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
        
        <div className="toggle-row">
          <span className="toggle-label">Browser notifications</span>
          <button
            onClick={() => handleNotificationToggle('browser')}
            className={`toggle-switch ${notifications.browser ? 'toggle-switch--on' : ''}`}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
        
        <div className="toggle-row">
          <span className="toggle-label">Product updates</span>
          <button
            onClick={() => handleNotificationToggle('updates')}
            className={`toggle-switch ${notifications.updates ? 'toggle-switch--on' : ''}`}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="settings-section-card">
        <div className="settings-section-title">
          <Sidebar className="w-4 h-4" style={{ color: '#E8B058' }} />
          Sidebar
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Set the default state of the navigation sidebar.
        </p>
        <div className="toggle-row">
          <span className="toggle-label">Collapse sidebar by default</span>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`toggle-switch ${sidebarCollapsed ? 'toggle-switch--on' : ''}`}
          >
            <div className="toggle-switch-thumb" />
          </button>
        </div>
      </div>

      {/* Homepage Section */}
      <div className="settings-section-card">
        <div className="settings-section-title">
          <Home className="w-4 h-4" style={{ color: '#E8B058' }} />
          Homepage
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Choose what you see when you visit the homepage.
        </p>
        <select
          value={homepageView}
          onChange={(e) => setHomepageView(e.target.value)}
          className="settings-select"
        >
          <option value="default">Default landing page</option>
          <option value="docs">Documentation overview</option>
          <option value="search">Search page</option>
          <option value="dashboard">Dashboard (if available)</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="settings-save-btn"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`profile-toast profile-toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 inline mr-2" />
          ) : (
            <XCircle className="w-4 h-4 inline mr-2" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Protected Page Wrapper
// ---------------------------------------------------------------------------

function SettingsPage() {
  return (
    <UserProtectedRoute>
      <SettingsPageContent />
    </UserProtectedRoute>
  );
}

// ---------------------------------------------------------------------------
// Export with BrowserOnly
// ---------------------------------------------------------------------------

export default function SettingsPageWrapper() {
  return (
    <Layout title="Settings | NxGen Docs">
      <BrowserOnly fallback={<div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>}>
        {() => <SettingsPage />}
      </BrowserOnly>
    </Layout>
  );
}
