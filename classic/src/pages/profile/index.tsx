// classic/src/pages/profile/index.tsx
// User profile page
//
// Purpose:
//   - Display user profile information
//   - Show account stats (member since, role, etc.)
//   - Provide quick links to settings, bookmarks, history

import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProtectedRoute } from '../../components/Auth/UserProtectedRoute';
import { useUserProfile } from '../../hooks/useUserProfile';
import {
  User,
  Settings,
  Bookmark,
  Clock,
  Calendar,
  Shield,
  Mail,
  Loader,
} from 'lucide-react';
import Link from '@docusaurus/Link';

// Import profile styles
import '../../css/components/profile.css';

// ---------------------------------------------------------------------------
// Profile Page Content
// ---------------------------------------------------------------------------

function ProfilePageContent() {
  const { user } = useAuth0();
  const { profile, preferences, loading, error } = useUserProfile();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container margin-vert--xl">
        <div className="profile-header-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName = profile?.display_name || user?.name || user?.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently joined';

  return (
    <div className="container margin-vert--lg">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-top-bar" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="profile-avatar-container">
            {profile?.avatar_url || user?.picture ? (
              <img
                src={profile?.avatar_url || user?.picture}
                alt={displayName}
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar-initials">{initials}</div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1">
            <h1 className="profile-name">{displayName}</h1>
            <p className="profile-email">{profile?.email || user?.email}</p>
            {profile?.role && (
              <span className="profile-role-badge">
                <Shield className="w-3 h-3" style={{ marginRight: '0.25rem' }} />
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <div className="profile-stat-value">
              <Calendar className="w-4 h-4 inline mr-1" style={{ color: '#E8B058' }} />
              {memberSince !== 'Recently joined' ? 'Member' : 'New'}
            </div>
            <div className="profile-stat-label">{memberSince}</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">
              {preferences?.theme === 'system' ? 'Auto' : preferences?.theme || 'Auto'}
            </div>
            <div className="profile-stat-label">Theme Preference</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">
              {preferences?.language || 'English'}
            </div>
            <div className="profile-stat-label">Language</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="profile-quick-links">
        <Link to="/profile/settings" className="profile-quick-link">
          <div className="profile-quick-link-icon">
            <Settings className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <div className="profile-quick-link-text">Settings</div>
            <div className="profile-quick-link-desc">Manage your preferences</div>
          </div>
        </Link>

        <Link to="/profile/bookmarks" className="profile-quick-link">
          <div className="profile-quick-link-icon">
            <Bookmark className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <div className="profile-quick-link-text">Bookmarks</div>
            <div className="profile-quick-link-desc">Saved pages and articles</div>
          </div>
        </Link>

        <Link to="/profile/history" className="profile-quick-link">
          <div className="profile-quick-link-icon">
            <Clock className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <div className="profile-quick-link-text">Reading History</div>
            <div className="profile-quick-link-desc">Recently viewed pages</div>
          </div>
        </Link>

        <a href="mailto:support@nxgen.eu" className="profile-quick-link">
          <div className="profile-quick-link-icon">
            <Mail className="w-5 h-5" style={{ color: '#E8B058' }} />
          </div>
          <div>
            <div className="profile-quick-link-text">Support</div>
            <div className="profile-quick-link-desc">Get help with your account</div>
          </div>
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Protected Page Wrapper
// ---------------------------------------------------------------------------

function ProfilePage() {
  return (
    <UserProtectedRoute>
      <ProfilePageContent />
    </UserProtectedRoute>
  );
}

// ---------------------------------------------------------------------------
// Export with BrowserOnly
// ---------------------------------------------------------------------------

export default function ProfilePageWrapper() {
  return (
    <Layout title="Profile | NxGen Docs">
      <BrowserOnly fallback={<div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>}>
        {() => <ProfilePage />}
      </BrowserOnly>
    </Layout>
  );
}
