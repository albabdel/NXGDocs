// classic/src/components/Personalization/RecommendedReading.tsx
// Recommended reading component based on user role
//
// Purpose:
//   - Show recommended docs based on user role
//   - Filter content by interest tags
//   - Provide role-specific learning paths
//
// Usage:
//   <RecommendedReading role="operator" maxItems={5} />
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/services/user-profile.ts

import React from 'react';
import Link from '@docusaurus/Link';
import {
  BookOpen,
  FileText,
  Video,
  Wrench,
  Activity,
  Shield,
  Cpu,
  LayoutDashboard,
  Zap,
  ExternalLink,
} from 'lucide-react';
import type { UserRole } from './RoleBasedContent';
import '../../css/components/personalization.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecommendedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  tags: string[];
}

export interface RecommendedReadingProps {
  /** User role to filter recommendations */
  role: UserRole;
  /** Maximum number of items to show */
  maxItems?: number;
  /** Show role badge in header */
  showRoleBadge?: boolean;
  /** Custom title override */
  title?: string;
}

// ---------------------------------------------------------------------------
// Role Interest Mapping
// ---------------------------------------------------------------------------

/**
 * Map roles to their primary interest areas
 * These tags are used to filter recommended content
 */
const roleInterests: Record<UserRole, string[]> = {
  operator: ['alarms', 'monitoring', 'devices', 'troubleshooting', 'operations'],
  manager: ['reporting', 'users', 'compliance', 'administration', 'dashboard'],
  engineer: ['installation', 'integration', 'api', 'configuration', 'setup'],
  admin: ['all'], // Admins see everything
  user: ['getting-started', 'basics', 'overview'],
};

/**
 * Map roles to their icon
 */
const roleIcons: Record<UserRole, React.ReactNode> = {
  operator: <Activity className="w-5 h-5" />,
  manager: <LayoutDashboard className="w-5 h-5" />,
  engineer: <Wrench className="w-5 h-5" />,
  admin: <Shield className="w-5 h-5" />,
  user: <BookOpen className="w-5 h-5" />,
};

// ---------------------------------------------------------------------------
// Static Recommendations (Fallback when no dynamic data)
// ---------------------------------------------------------------------------

const staticRecommendations: Record<UserRole, RecommendedItem[]> = {
  operator: [
    {
      id: 'op-1',
      title: 'Alarm Management Guide',
      description: 'Learn how to process, acknowledge, and resolve alarms efficiently.',
      url: '/alarm-management',
      icon: 'activity',
      tags: ['alarms', 'monitoring', 'operations'],
    },
    {
      id: 'op-2',
      title: 'Device Monitoring Dashboard',
      description: 'Monitor device health, connectivity, and status in real-time.',
      url: '/device-monitoring',
      icon: 'cpu',
      tags: ['devices', 'monitoring'],
    },
    {
      id: 'op-3',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions for operators.',
      url: '/docs/troubleshooting',
      icon: 'wrench',
      tags: ['troubleshooting', 'operations'],
    },
    {
      id: 'op-4',
      title: 'Tower Management',
      description: 'Configure and manage mobile towers for alarm transmission.',
      url: '/towers',
      icon: 'activity',
      tags: ['devices', 'operations'],
    },
    {
      id: 'op-5',
      title: 'Quick Start for Operators',
      description: 'Get up and running with GCXONE operations in minutes.',
      url: '/quick-start/guide',
      icon: 'zap',
      tags: ['getting-started', 'operations'],
    },
  ],
  manager: [
    {
      id: 'mgr-1',
      title: 'Reporting Dashboard',
      description: 'Generate and customize reports for your organization.',
      url: '/reporting',
      icon: 'layout-dashboard',
      tags: ['reporting', 'dashboard'],
    },
    {
      id: 'mgr-2',
      title: 'User Management Guide',
      description: 'Add users, assign roles, and manage permissions.',
      url: '/user-management',
      icon: 'shield',
      tags: ['users', 'administration'],
    },
    {
      id: 'mgr-3',
      title: 'Compliance Overview',
      description: 'Understand compliance requirements and audit trails.',
      url: '/docs/compliance',
      icon: 'file-text',
      tags: ['compliance', 'administration'],
    },
    {
      id: 'mgr-4',
      title: 'System Health Dashboard',
      description: 'Monitor overall system performance and metrics.',
      url: '/admin/status',
      icon: 'activity',
      tags: ['dashboard', 'monitoring'],
    },
    {
      id: 'mgr-5',
      title: 'Release Notes',
      description: 'Stay up to date with the latest features and changes.',
      url: '/releases',
      icon: 'zap',
      tags: ['administration', 'reporting'],
    },
  ],
  engineer: [
    {
      id: 'eng-1',
      title: 'Installation Guide',
      description: 'Step-by-step instructions for deploying GCXONE.',
      url: '/quick-start/platform-overview',
      icon: 'wrench',
      tags: ['installation', 'setup'],
    },
    {
      id: 'eng-2',
      title: 'API Documentation',
      description: 'Integrate with GCXONE using our REST API.',
      url: '/api',
      icon: 'cpu',
      tags: ['api', 'integration'],
    },
    {
      id: 'eng-3',
      title: 'Device Integration',
      description: 'Connect and configure devices with GCXONE.',
      url: '/quick-start/device-integration',
      icon: 'cpu',
      tags: ['integration', 'configuration'],
    },
    {
      id: 'eng-4',
      title: 'Configuration Reference',
      description: 'Complete reference for all configuration options.',
      url: '/docs/configuration',
      icon: 'wrench',
      tags: ['configuration', 'setup'],
    },
    {
      id: 'eng-5',
      title: 'Network Setup Guide',
      description: 'Configure networking for optimal performance.',
      url: '/docs/network-setup',
      icon: 'activity',
      tags: ['configuration', 'installation'],
    },
  ],
  admin: [
    {
      id: 'admin-1',
      title: 'Admin Dashboard',
      description: 'Access all administrative features and settings.',
      url: '/admin',
      icon: 'shield',
      tags: ['administration', 'dashboard'],
    },
    {
      id: 'admin-2',
      title: 'User Management',
      description: 'Manage users, roles, and permissions across the platform.',
      url: '/user-management',
      icon: 'shield',
      tags: ['users', 'administration'],
    },
    {
      id: 'admin-3',
      title: 'System Configuration',
      description: 'Configure system-wide settings and integrations.',
      url: '/docs/configuration',
      icon: 'wrench',
      tags: ['configuration', 'administration'],
    },
    {
      id: 'admin-4',
      title: 'Security Settings',
      description: 'Configure security policies and access controls.',
      url: '/docs/security',
      icon: 'shield',
      tags: ['compliance', 'administration'],
    },
    {
      id: 'admin-5',
      title: 'Release Notes',
      description: 'View all release notes and changelog.',
      url: '/releases',
      icon: 'zap',
      tags: ['administration'],
    },
  ],
  user: [
    {
      id: 'user-1',
      title: 'Getting Started Guide',
      description: 'Your first steps with GCXONE documentation.',
      url: '/quick-start/guide',
      icon: 'zap',
      tags: ['getting-started', 'basics'],
    },
    {
      id: 'user-2',
      title: 'Platform Overview',
      description: 'Learn about core concepts and architecture.',
      url: '/quick-start/platform-overview',
      icon: 'book-open',
      tags: ['overview', 'basics'],
    },
    {
      id: 'user-3',
      title: 'Documentation Index',
      description: 'Browse all available documentation.',
      url: '/docs',
      icon: 'file-text',
      tags: ['overview'],
    },
    {
      id: 'user-4',
      title: 'FAQ',
      description: 'Frequently asked questions and answers.',
      url: '/docs/knowledge-base/faq',
      icon: 'book-open',
      tags: ['basics', 'overview'],
    },
    {
      id: 'user-5',
      title: 'Support',
      description: 'Get help when you need it.',
      url: '/support',
      icon: 'book-open',
      tags: ['basics'],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Get icon component by name
 */
function getIconComponent(iconName?: string): React.ReactNode {
  switch (iconName) {
    case 'activity':
      return <Activity className="w-5 h-5" />;
    case 'cpu':
      return <Cpu className="w-5 h-5" />;
    case 'wrench':
      return <Wrench className="w-5 h-5" />;
    case 'shield':
      return <Shield className="w-5 h-5" />;
    case 'layout-dashboard':
      return <LayoutDashboard className="w-5 h-5" />;
    case 'zap':
      return <Zap className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'file-text':
    default:
      return <FileText className="w-5 h-5" />;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RecommendedReading - Show role-specific recommended documentation
 *
 * Displays a grid of recommended reading items based on the user's role.
 * Falls back to static recommendations when no dynamic data is available.
 *
 * @example
 * <RecommendedReading role="operator" maxItems={5} />
 */
export function RecommendedReading({
  role,
  maxItems = 5,
  showRoleBadge = true,
  title,
}: RecommendedReadingProps): React.JSX.Element {
  // Get recommendations for this role
  const recommendations = staticRecommendations[role] || staticRecommendations.user;
  const displayItems = recommendations.slice(0, maxItems);
  const interests = roleInterests[role] || roleInterests.user;

  // Determine title
  const sectionTitle = title || `Recommended for ${role.charAt(0).toUpperCase() + role.slice(1)}s`;

  return (
    <section className="recommended-reading">
      {/* Header */}
      <div className="recommended-reading-header">
        <div>
          <div className="recommended-reading-title">
            <BookOpen className="recommended-reading-title-icon" />
            <span>{sectionTitle}</span>
          </div>
          {showRoleBadge && (
            <div className="recommended-reading-role-tag">
              {roleIcons[role]}
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          )}
          <p className="recommended-reading-subtitle">
            Based on your role: {interests.filter((i) => i !== 'all').slice(0, 3).join(', ')}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {displayItems.length === 0 ? (
        <div className="recommended-reading-empty">
          <BookOpen className="recommended-reading-empty-icon" />
          <p className="recommended-reading-empty-text">
            No recommendations available for your role yet.
          </p>
        </div>
      ) : (
        <div className="recommended-reading-grid">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              to={item.url}
              className="recommended-reading-card"
            >
              <div className="recommended-reading-card-icon">
                {getIconComponent(item.icon)}
              </div>
              <h4 className="recommended-reading-card-title">{item.title}</h4>
              <p className="recommended-reading-card-desc">{item.description}</p>
              {item.tags.length > 0 && (
                <span className="recommended-reading-card-tag">
                  {item.tags[0]}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default RecommendedReading;
