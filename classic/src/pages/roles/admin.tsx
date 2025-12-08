import React from 'react';
import RoleLandingPage, { RoleSection, ArticleGroup, RoleFeature, TimelineItem, SmartTool } from '../../components/RoleLandingPage';
import {
    Users,
    Settings,
    Shield,
    Database,
    Activity,
    Globe,
    Lock,
    FileText
} from 'lucide-react';

const adminSections: RoleSection[] = [
    {
        title: 'Configure Your Account',
        description: 'Set up your organization, users, and security policies.',
        cards: [
            {
                title: 'User Management',
                description: 'Invite users, assign roles, and manage permissions.',
                icon: <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/account-management/managing-users-and-roles',
                badge: 'Essential'
            },
            {
                title: 'Global Settings',
                description: 'Configure system-wide preferences and defaults.',
                icon: <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/platform-fundamentals/what-is-gcxone-GCXONE',
            },
            {
                title: 'Security Policies',
                description: 'Manage password requirements and 2FA settings.',
                icon: <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/knowledge-base/security-best-practices',
            }
        ]
    },
    {
        title: 'Build Your Operations',
        description: 'Define sites, groups, and operational workflows.',
        cards: [
            {
                title: 'Site Management',
                description: 'Organize your physical locations and sites.',
                icon: <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/platform-fundamentals/site-synchronization',
            },
            {
                title: 'Workflow Engine',
                description: 'Design automated response procedures for alarms.',
                icon: <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/platform-fundamentals/alarm-flow-device-to-GCXONE-to-talos',
                badge: 'Advanced'
            },
            {
                title: 'Data Retention',
                description: 'Configure log storage and video retention policies.',
                icon: <Database className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/installer-guide/storage-requirements',
            }
        ]
    },
    {
        title: 'Enhance Your System',
        cards: [
            {
                title: 'Audit Logs',
                description: 'Review system access and change logs.',
                icon: <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting-analytics/user-activity-reports',
            },
            {
                title: 'API Access',
                description: 'Generate tokens for third-party integrations.',
                icon: <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/knowledge-base/api-documentation',
                badge: 'Developer'
            }
        ]
    }
];

const adminVideos = [
    {
        title: 'Admin Dashboard Walkthrough',
        description: 'A 5-minute tour of the main administrative functions.',
        link: '/docs/knowledge-base/video-tutorials',
    },
    {
        title: 'User Roles Explained',
        description: 'Understanding the permission system in depth.',
        link: '/docs/knowledge-base/video-tutorials',
    }
];

const adminArticles: ArticleGroup[] = [
    {
        title: 'Account Security',
        articles: [
            { title: 'Enforcing 2FA for all users', link: '/docs/knowledge-base/security-best-practices' },
            { title: 'Setting password complexity rules', link: '/docs/knowledge-base/security-best-practices' },
            { title: 'IP whitelisting for admin access', link: '/docs/knowledge-base/security-best-practices' },
        ]
    },
    {
        title: ' Billing & Licenses',
        articles: [
            { title: 'Understanding license tiers', link: '/docs/account-management/managing-users-and-roles' },
            { title: 'Viewing usage history', link: '/docs/reporting-analytics/user-activity-reports' },
            { title: 'Managing subscription renewals', link: '/docs/account-management/managing-users-and-roles' },
        ]
    },
    {
        title: 'Integrations',
        articles: [
            { title: 'Connecting to AD/LDAP', link: '/docs/knowledge-base/api-documentation' },
            { title: 'Setting up SSO', link: '/docs/knowledge-base/security-best-practices' },
            { title: 'Webhooks configuration', link: '/docs/knowledge-base/api-documentation' },
        ]
    }
];

const adminFeatures: RoleFeature[] = [
    {
        title: 'Granular Access Control',
        description: 'Define precise permissions for every user and resource in your organization.',
        benefit: 'Eliminate security risks by ensuring users only access what they need.',
        value: 'Compliance & Security'
    },
    {
        title: 'Centralized Site Management',
        description: 'Manage thousands of sites from a single pane of glass.',
        benefit: 'Reduce administrative overhead by 60% with bulk operations.',
        value: 'Operational Efficiency'
    }
];

const adminWhatsNew: TimelineItem[] = [
    {
        title: 'New Audit Log Filters',
        description: 'Filter logs by specific user actions and date ranges.',
        date: 'Oct 2025',
        status: 'released'
    },
    {
        title: 'Bulk User Invite',
        description: 'Invite up to 50 users at once via CSV upload.',
        date: 'Sep 2025',
        status: 'released'
    }
];

const adminRoadmap: TimelineItem[] = [
    {
        title: 'Custom Roles Builder',
        description: 'Create completely custom permission sets beyond the default roles.',
        date: 'Q1 2026',
        status: 'planned'
    },
    {
        title: 'AI-Powered Anomaly Detection',
        description: 'Alerts for unusual user login patterns.',
        date: 'Q2 2026',
        status: 'planned'
    }
];

const adminSmartTools: SmartTool[] = [
    {
        title: 'Nova99x Filter',
        description: 'AI-powered false alarm reduction engine.',
        metric: '99%',
        footer: 'Reduction in false alarms',
        link: '/docs/knowledge-base/video-tutorials', // Placeholder as per logic
        visualType: 'radial',
        accentColor: '#8b5cf6' // Violet
    },
    {
        title: 'System Health',
        description: 'Real-time uptime and service status.',
        metric: '100%',
        footer: 'System uptime last 30 days',
        link: '/docs/reporting/dashboard-widgets',
        visualType: 'bar',
        accentColor: '#10b981' // Green
    },
    {
        title: 'Audit Compliance',
        description: 'Automated user activity tracking score.',
        metric: '94/100',
        footer: 'Security compliance score',
        link: '/docs/reporting/user-activity-reports',
        visualType: 'activity',
        accentColor: '#f59e0b' // Amber
    },
    {
        title: 'License Usage',
        description: 'Real-time seat and device utilization.',
        metric: '450/500',
        footer: 'Active licenses used',
        link: '/docs/account-management/managing-users-and-roles',
        visualType: 'grid',
        accentColor: '#3b82f6' // Blue
    }
];

export default function AdminLandingPage(): React.JSX.Element {
    return (
        <RoleLandingPage
            title="Admin Workspace"
            description="Manage your organization, users, and system configuration from a central command center."
            sections={adminSections}
            videos={adminVideos}
            articleGroups={adminArticles}
            features={adminFeatures}
            whatsNew={adminWhatsNew}
            roadmap={adminRoadmap}
            smartTools={adminSmartTools}
        />
    );
}
