import React from 'react';
import RoleLandingPage, { RoleSection, ArticleGroup, RoleFeature, TimelineItem, SmartTool } from '../../components/RoleLandingPage';
import {
    BarChart,
    PieChart,
    TrendingUp,
    Users,
    FileCheck,
    Award,
    Calendar,
    Mail
} from 'lucide-react';

const managerSections: RoleSection[] = [
    {
        title: 'Performance & Analytics',
        description: 'Insights into team performance and system health.',
        cards: [
            {
                title: 'Operational Dashboard',
                description: 'High-level view of alarms and response times.',
                icon: <BarChart className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting/dashboard-widgets',
                badge: 'Overview'
            },
            {
                title: 'Response Metrics',
                description: 'Analyze operator reaction and processing times.',
                icon: <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting/user-activity-reports',
            },
            {
                title: 'Alarm Statistics',
                description: 'Identify nuisance alarms and top calling sites.',
                icon: <PieChart className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting/alarm-statistics',
            }
        ]
    },
    {
        title: 'Team Management',
        description: 'Oversee your team and schedule.',
        cards: [
            {
                title: 'Productivity Reports',
                description: 'Individual operator performance reviews.',
                icon: <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting/user-activity-reports',
            },
            {
                title: 'Shift Schedules',
                description: 'Manage rosters and coverage.',
                icon: <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/shift-handover',
            }
        ]
    },
    {
        title: 'Compliance & SLA',
        cards: [
            {
                title: 'Audit Trails',
                description: 'Full history of actions for compliance checks.',
                icon: <FileCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/compliance/gdpr-overview',
            },
            {
                title: 'SLA Reporting',
                description: 'Track adherence to service level agreements.',
                icon: <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/support/support-sla',
            },
            {
                title: 'Scheduled Reports',
                description: 'Automated email reports for stakeholders.',
                icon: <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/reporting/scheduled-reports',
            }
        ]
    }
];

const managerVideos = [
    {
        title: 'Understanding Analytics',
        description: 'How to interpret key performance indicators.',
        link: '/docs/knowledge-base/video-tutorials',
    },
    {
        title: 'Generating Custom Reports',
        description: 'Building reports tailored to your specific needs.',
        link: '/docs/knowledge-base/video-tutorials',
    }
];

const managerArticles: ArticleGroup[] = [
    {
        title: 'Analytics Guides',
        articles: [
            { title: 'Understanding dashboard widgets', link: '/docs/reporting/dashboard-widgets' },
            { title: 'Exporting data to CSV/PDF', link: '/docs/reporting/scheduled-reports' },
            { title: 'Setting up automated emails', link: '/docs/reporting/scheduled-reports' },
        ]
    },
    {
        title: 'Compliance',
        articles: [
            { title: 'GDPR compliance features', link: '/docs/compliance/gdpr-overview' },
            { title: 'Data retention policies', link: '/docs/installer-guide/storage-requirements' },
        ]
    }
];

const managerFeatures: RoleFeature[] = [
    {
        title: 'Automated Reporting',
        description: 'Receive weekly performance reports directly in your inbox.',
        benefit: 'Save 4 hours per week on manual data gathering.',
        value: 'Productivity'
    },
    {
        title: 'SLA Tracking',
        description: 'Real-time alerts when service levels are at risk.',
        benefit: 'Avoid penalties and maintain customer trust.',
        value: 'Risk Management'
    }
];

const managerWhatsNew: TimelineItem[] = [
    {
        title: 'Executive Dashboard',
        description: 'New high-level view for stakeholders.',
        date: 'Dec 2025',
        status: 'released'
    }
];

const managerRoadmap: TimelineItem[] = [
    {
        title: 'Predictive Analytics',
        description: 'Forecast future alarm volumes based on history.',
        date: 'Q2 2026',
        status: 'planned'
    }
];

const managerSmartTools: SmartTool[] = [
    {
        title: 'Compliance Score',
        description: 'Overall regulatory adherence.',
        metric: '98/100',
        footer: 'Ready for audit',
        link: '/docs/compliance/gdpr-overview',
        visualType: 'bar',
        accentColor: '#3b82f6' // Blue
    },
    {
        title: 'Team Efficiency',
        description: 'Avg alarms processed per hour.',
        metric: '42',
        footer: '+12% vs last month',
        link: '/docs/reporting/user-activity-reports',
        visualType: 'radial',
        accentColor: '#ec4899' // Pink
    },
    {
        title: 'Cost Savings',
        description: 'Estimated savings from false alarm reduction.',
        metric: '$12.5k',
        footer: 'This quarter',
        link: '/docs/reporting/alarm-statistics',
        visualType: 'activity',
        accentColor: '#10b981' // Green
    },
    {
        title: 'Risk Index',
        description: 'Current operational risk level.',
        metric: 'Low',
        footer: 'Stable trend',
        link: '/docs/reporting/dashboard-widgets',
        visualType: 'grid',
        accentColor: '#f59e0b' // Amber
    }
];

export default function ManagerLandingPage(): React.JSX.Element {
    return (
        <RoleLandingPage
            title="Manager Overview"
            description="Strategic insights, compliance tools, and team management for operations leaders."
            sections={managerSections}
            videos={managerVideos}
            articleGroups={managerArticles}
            features={managerFeatures}
            whatsNew={managerWhatsNew}
            roadmap={managerRoadmap}
            smartTools={managerSmartTools}
        />
    );
}
