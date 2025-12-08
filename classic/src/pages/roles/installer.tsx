import React from 'react';
import RoleLandingPage, { RoleSection, ArticleGroup, RoleFeature, TimelineItem, SmartTool } from '../../components/RoleLandingPage';
import {
    Wifi,
    Server,
    CheckCircle,
    Smartphone,
    Radio,
    Download,
    Cpu,
    Wrench,
    ClipboardList
} from 'lucide-react';

const installerSections: RoleSection[] = [
    {
        title: 'Site Commissioning',
        description: 'Prepare and configure new sites.',
        cards: [
            {
                title: 'Network Setup',
                description: 'Port forwarding and firewall requirements.',
                icon: <Wifi className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/installer-guide/network-configuration',
                badge: 'Critical'
            },
            {
                title: 'Site Survey',
                description: 'Pre-installation checklist and bandwidth calculation.',
                icon: <ClipboardList className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/installer-guide/site-survey',
            },
            {
                title: 'Hardware Specs',
                description: 'Server and appliance requirements.',
                icon: <Server className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/knowledge-base/system-requirements',
            }
        ]
    },
    {
        title: 'Device Integration',
        description: 'Connect and configure cameras and sensors.',
        cards: [
            {
                title: 'Add New Device',
                description: 'Step-by-step guide to adding cameras.',
                icon: <Cpu className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/device-integration/standard-device-onboarding-process',
            },
            {
                title: 'Camera Calibration',
                description: 'Setting up analytics and motion detection.',
                icon: <Wrench className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/device-integration/camera-calibration',
            },
            {
                title: 'Sensor IO',
                description: 'Wiring and configuring digital inputs/outputs.',
                icon: <Radio className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/device-integration/sensor-io-setup',
            }
        ]
    },
    {
        title: 'Tools & Testing',
        cards: [
            {
                title: 'Mobile App',
                description: 'Commission sites from your smartphone.',
                icon: <Smartphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/troubleshooting/mobile-app-issues',
            },
            {
                title: 'System Test',
                description: 'Verify connectivity and alarm transmission.',
                icon: <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/installer-guide/testing-commissioning',
            },
            {
                title: 'Firmware Updates',
                description: 'Download latest device drivers and firmware.',
                icon: <Download className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
                link: '/docs/release-notes/latest',
            }
        ]
    }
];

const installerVideos = [
    {
        title: 'Site Commissioning Walkthrough',
        description: 'From unboxing to go-live in 10 minutes.',
        link: '/docs/knowledge-base/video-tutorials',
    },
    {
        title: 'Troubleshooting Connectivity',
        description: 'Diagnosing common network issues on site.',
        link: '/docs/knowledge-base/video-tutorials',
    }
];

const installerArticles: ArticleGroup[] = [
    {
        title: 'Connectivity',
        articles: [
            { title: 'Configuring VLANs for cameras', link: '/docs/installer-guide/network-configuration' },
            { title: 'Troubleshooting offline devices', link: '/docs/troubleshooting/mobile-app-issues' },
            { title: 'Setting up 4G backup', link: '/docs/installer-guide/network-configuration' },
        ]
    },
    {
        title: 'Analytics Setup',
        articles: [
            { title: 'Calibrating person detection', link: '/docs/device-integration/camera-calibration' },
            { title: 'Setting up loitering zones', link: '/docs/device-integration/camera-calibration' },
            { title: 'Masking privacy areas', link: '/docs/device-integration/camera-calibration' },
        ]
    }
];

const installerFeatures: RoleFeature[] = [
    {
        title: 'Auto-Discovery',
        description: 'Automatically find and add cameras on the local network.',
        benefit: 'Reduces setup time by 90% per site.',
        value: 'Speed'
    },
    {
        title: 'Remote Diagnostics',
        description: 'Reboot and troubleshoot devices without a truck roll.',
        benefit: 'Save money on site visits and maintenance.',
        value: 'Cost Savings'
    }
];

const installerWhatsNew: TimelineItem[] = [
    {
        title: 'Mobile Commissioning App 2.0',
        description: 'New interface with QR code scanning.',
        date: 'Nov 2025',
        status: 'released'
    },
    {
        title: 'Firmware 5.1 Support',
        description: 'Support for latest Axis and Hanwha cameras.',
        date: 'Oct 2025',
        status: 'released'
    }
];

const installerRoadmap: TimelineItem[] = [
    {
        title: 'Offline Mode',
        description: 'Commission sites without active internet connection.',
        date: 'Q1 2026',
        status: 'planned'
    }
];

const installerSmartTools: SmartTool[] = [
    {
        title: 'Auto-Focus',
        description: 'One-click camera lens optimization.',
        metric: '100%',
        footer: 'Sharpness score',
        link: '/docs/device-integration/camera-calibration',
        visualType: 'grid',
        accentColor: '#3b82f6' // Blue
    },
    {
        title: 'Signal Strength',
        description: 'Wireless device connectivity quality.',
        metric: '-45dB',
        footer: 'Excellent connection',
        link: '/docs/installer-guide/network-configuration',
        visualType: 'bar',
        accentColor: '#10b981' // Green
    },
    {
        title: 'Device Pulse',
        description: 'Heartbeat monitoring for new devices.',
        metric: 'Stable',
        footer: 'No packet loss detected',
        link: '/docs/troubleshooting/mobile-app-issues',
        visualType: 'activity',
        accentColor: '#ef4444' // Red (heartbeat)
    },
    {
        title: 'Setup Progress',
        description: 'Commissioning steps completed.',
        metric: '8/10',
        footer: 'Steps remaining',
        link: '/docs/installer-guide/testing-commissioning',
        visualType: 'radial',
        accentColor: '#eab308' // Yellow
    }
];

export default function InstallerLandingPage(): React.JSX.Element {
    return (
        <RoleLandingPage
            title="Installer Toolkit"
            description="Technical resources for site commissioning, device integration, and field troubleshooting."
            sections={installerSections}
            videos={installerVideos}
            articleGroups={installerArticles}
            features={installerFeatures}
            whatsNew={installerWhatsNew}
            roadmap={installerRoadmap}
            smartTools={installerSmartTools}
        />
    );
}
