import React from 'react';
import RoleLandingPage, { RoleSection, ArticleGroup, RoleFeature, TimelineItem, SmartTool } from '../../components/RoleLandingPage';
import {
    Bell,
    Video,
    Activity,
    ClipboardList,
    Search,
    Phone,
    MapPin,
    Clock,
    Eye
} from 'lucide-react';

const operatorSections: RoleSection[] = [
    {
        title: 'Daily Operations',
        description: 'Core tools for monitoring and alarm response.',
        cards: [
            {
                title: 'Alarm Processor',
                description: 'Handle incoming alarms, view clips, and dispatch.',
                icon: <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/handling-incoming-alarms',
                badge: 'Primary Tool'
            },
            {
                title: 'Live Monitoring',
                description: 'View live video feeds and site status.',
                icon: <Video className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/live-video-viewing',
            },
            {
                title: 'Event Search',
                description: 'Find past events and history.',
                icon: <Search className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/event-clip-review',
            }
        ]
    },
    {
        title: 'Procedures & Reports',
        description: 'Follow SOPs and generate shift reports.',
        cards: [
            {
                title: 'Response Procedures',
                description: 'Standard operating procedures for different alarm types.',
                icon: <ClipboardList className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/alarm-response-procedures',
            },
            {
                title: 'Shift Handover',
                description: 'Log notes and transfer context to the next shift.',
                icon: <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/shift-handover',
            },
            {
                title: 'Site Navigation',
                description: 'Maps and floor plans for rapid location.',
                icon: <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/site-navigation',
            }
        ]
    },
    {
        title: 'Communication',
        cards: [
            {
                title: 'Contact List',
                description: 'Emergency contacts and keyholders.',
                icon: <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/operator-guide/communication-tools',
            }
        ]
    }
];

const operatorVideos = [
    {
        title: 'Handling Your First Alarm',
        description: 'Step-by-step guide to accepting and processing alarms.',
        link: '/docs/knowledge-base/video-tutorials',
    },
    {
        title: 'Using the Video Player',
        description: 'Controls, digital zoom, and snapshot tools.',
        link: '/docs/knowledge-base/video-tutorials',
    }
];

const operatorArticles: ArticleGroup[] = [
    {
        title: 'Alarm Handling',
        articles: [
            { title: 'Identifying false alarms', link: '/docs/operator-guide/handling-incoming-alarms' },
            { title: 'Escalating severe incidents', link: '/docs/operator-guide/alarm-response-procedures' },
            { title: 'Using audio talk-down', link: '/docs/operator-guide/communication-tools' },
        ]
    },
    {
        title: 'Video Tools',
        articles: [
            { title: 'Exporting video clips', link: '/docs/operator-guide/event-clip-review' },
            { title: 'Taking forensic snapshots', link: '/docs/operator-guide/live-video-viewing' },
            { title: 'Controlling PTZ cameras', link: '/docs/operator-guide/live-video-viewing' },
        ]
    },
    {
        title: 'Shift Management',
        articles: [
            { title: 'Filling out incident reports', link: '/docs/operator-guide/shift-handover' },
            { title: 'Checking site health status', link: '/docs/operator-guide/site-navigation' },
        ]
    }
];

const operatorFeatures: RoleFeature[] = [
    {
        title: 'Instant Video Verification',
        description: 'See what caused the alarm the instant you receive it.',
        benefit: 'Respond 10x faster than traditional monitoring.',
        value: 'Response Time'
    },
    {
        title: 'Unified Communication',
        description: 'Call authorities and keyholders directly from the dashboard.',
        benefit: 'Streamlined workflow reduces errors during high-stress events.',
        value: 'Accuracy'
    }
];

const operatorWhatsNew: TimelineItem[] = [
    {
        title: 'Dark Mode Map',
        description: 'Improved map visibility for night shifts.',
        date: 'Nov 2025',
        status: 'released'
    },
    {
        title: 'Keyboard Shortcuts',
        description: 'Process alarms faster without using the mouse.',
        date: 'Oct 2025',
        status: 'released'
    }
];

const operatorRoadmap: TimelineItem[] = [
    {
        title: 'AI Assisted Dispatch',
        description: 'Smart recommendations for dispatching authorities.',
        date: 'Q1 2026',
        status: 'planned'
    },
    {
        title: 'Multi-Monitor Support',
        description: 'Pop out video windows to separate screens.',
        date: 'Q2 2026',
        status: 'planned'
    }
];

const operatorSmartTools: SmartTool[] = [
    {
        title: 'Smart Dispatch',
        description: 'AI-suggested response plans.',
        metric: '95%',
        footer: 'Accuracy in suggestions',
        link: '/docs/operator-guide/alarm-response-procedures',
        visualType: 'grid',
        accentColor: '#ec4899' // Pink
    },
    {
        title: 'Response Timer',
        description: 'Average reaction time this shift.',
        metric: '14s',
        footer: 'Below 30s SLA target',
        link: '/docs/reporting/user-activity-reports',
        visualType: 'radial',
        accentColor: '#10b981' // Green
    },
    {
        title: 'Incident Volume',
        description: 'Real-time alarm traffic intensity.',
        metric: 'Low',
        footer: 'Current system load',
        link: '/docs/reporting/alarm-statistics',
        visualType: 'activity',
        accentColor: '#3b82f6' // Blue
    },
    {
        title: 'Video Health',
        description: 'Camera connection status.',
        metric: '98%',
        footer: 'Cameras online',
        link: '/docs/operator-guide/live-video-viewing',
        visualType: 'bar',
        accentColor: '#f59e0b' // Amber
    }
];

export default function OperatorLandingPage(): React.JSX.Element {
    return (
        <RoleLandingPage
            title="Operator Workspace"
            description="Your mission control for real-time monitoring and alarm response."
            sections={operatorSections}
            videos={operatorVideos}
            articleGroups={operatorArticles}
            features={operatorFeatures}
            whatsNew={operatorWhatsNew}
            roadmap={operatorRoadmap}
            smartTools={operatorSmartTools}
        />
    );
}
