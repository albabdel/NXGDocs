/**
 * Onboarding Phases Data
 * Complete phase and step definitions with role-based content
 */

import { OnboardingPhase, StepType, UserRole, SystemHealthItem, SystemHealthStatus } from '../types/onboarding';

export const onboardingPhases: OnboardingPhase[] = [
    {
        id: 'account-access',
        title: 'Account & Access',
        description: 'Get started with your account',
        steps: [
            {
                id: 'first-login',
                title: 'Complete First Time Login',
                description: 'Access your GCXONE account and set up authentication',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER, UserRole.MANAGER],
                actionLink: '/docs/getting-started/first-time-login',
                learningContent: {
                    videoId: 'I7dccOLTOsk',
                    title: 'First-Time Login & Setup',
                    description: 'Step-by-step guide to your first login, password setup, and MFA configuration.',
                    tips: ['Use a strong password with at least 12 characters', 'Enable MFA for enhanced security']
                }
            },
            {
                id: 'password-setup',
                title: 'Configure Password Management',
                description: 'Set up secure password policies',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN],
                roleSpecificTitle: {
                    [UserRole.ADMIN]: 'Configure Password Management'
                },
                actionLink: '/docs/getting-started/password-management',
                learningContent: {
                    description: 'Learn how to update your password and set up password recovery options.',
                    tips: ['Store your recovery codes in a secure location']
                }
            },
            {
                id: 'understand-gcxone',
                title: 'Understand What is GCXONE',
                description: 'Learn about the platform capabilities',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER, UserRole.MANAGER],
                actionLink: '/docs/getting-started/what-is-evalink-talos',
                learningContent: {
                    videoId: 'ER-tnAvGXow',
                    title: 'GCXONE Product Overview',
                    description: 'Discover what GCXONE can do for your security operations and why leading companies trust our platform.'
                }
            },
            {
                id: 'quick-start-checklist',
                title: 'Review Quick Start Checklist',
                description: 'Familiarize yourself with setup requirements',
                type: StepType.CONFIRMATION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/quick-start-checklist',
                learningContent: {
                    description: 'Complete checklist of setup tasks to ensure nothing is missed.',
                    tips: ['Print this checklist to track progress offline']
                }
            }
        ]
    },
    {
        id: 'platform-walkthrough',
        title: 'Platform Walkthrough',
        description: 'Learn the interface and navigation',
        steps: [
            {
                id: 'key-benefits',
                title: 'Explore Key Benefits',
                description: 'Understand the value GCXONE brings',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.MANAGER],
                actionLink: '/docs/getting-started/key-benefits',
                learningContent: {
                    description: 'Discover how GCXONE transforms security monitoring operations.',
                    tips: ['Share these benefits with your team to drive adoption']
                }
            },
            {
                id: 'cloud-architecture',
                title: 'Understand Cloud Architecture',
                description: 'Learn about GCXONE\'s infrastructure',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/cloud-architecture',
                learningContent: {
                    description: 'Understanding the cloud architecture helps with planning and troubleshooting.',
                    warnings: ['Ensure your network supports cloud connectivity']
                }
            },
            {
                id: 'gcxone-talos',
                title: 'Learn GCXONE & Talos Interaction',
                description: 'Understand how GCXONE works with Talos',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/gcxone-talos-interaction',
                learningContent: {
                    videoId: 'p--04PIIO-M',
                    title: 'Platform Walkthrough',
                    description: 'A complete tour of the GCXONE interface and how it integrates with Talos.',
                    tips: ['Talos is your edge device that connects to GCXONE cloud']
                }
            },
            {
                id: 'what-is-talos',
                title: 'What is Evalink Talos?',
                description: 'Introduction to the Talos edge device',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/what-is-evalink-talos',
                learningContent: {
                    description: 'Talos is the bridge between your on-site devices and GCXONE cloud.',
                    tips: ['Each site typically requires one Talos unit']
                }
            },
            {
                id: 'know-talos',
                title: 'Getting to Know Evalink Talos',
                description: 'Deep dive into Talos features',
                type: StepType.ACTION,
                roles: [UserRole.INSTALLER, UserRole.ADMIN],
                actionLink: '/docs/getting-started/getting-to-know-evalink-talos',
                learningContent: {
                    description: 'Detailed guide on Talos capabilities and configuration options.',
                    tips: ['Talos handles local video storage and alarm processing']
                }
            },
            {
                id: 'dashboard-overview',
                title: 'Master the Dashboard',
                description: 'Learn to navigate the main dashboard',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.MANAGER],
                roleSpecificTitle: {
                    [UserRole.OPERATOR]: 'Learn the Operator Dashboard',
                    [UserRole.MANAGER]: 'Understand the Analytics Dashboard'
                },
                actionLink: '/docs/getting-started/gcxone-talos-interaction',
                learningContent: {
                    videoId: 'AxHOF8cV88Q',
                    title: 'Dashboard Deep Dive',
                    description: 'Master the dashboard widgets, customization options, and real-time monitoring capabilities.'
                }
            }
        ]
    },
    {
        id: 'network-connectivity',
        title: 'Network & Connectivity',
        description: 'Ensure proper network configuration',
        steps: [
            {
                id: 'required-ports',
                title: 'Configure Required Ports',
                description: 'Open necessary ports for GCXONE',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/required-ports',
                learningContent: {
                    description: 'List of all ports that must be open for GCXONE to function properly.',
                    warnings: ['Work with your network team to configure firewall rules'],
                    tips: ['Document which ports are already open in your network']
                }
            },
            {
                id: 'firewall-config',
                title: 'Set Up Firewall Rules',
                description: 'Configure firewall for GCXONE traffic',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/firewall-configuration',
                learningContent: {
                    description: 'Step-by-step firewall configuration instructions for various firewalls.',
                    warnings: ['Improper firewall configuration will prevent alarms from reaching GCXONE'],
                    tips: ['Test connectivity after making changes']
                }
            },
            {
                id: 'ip-whitelist',
                title: 'Configure IP Whitelisting',
                description: 'Whitelist GCXONE IP addresses',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/ip-whitelisting',
                learningContent: {
                    description: 'Add GCXONE IP ranges to your firewall whitelist.',
                    warnings: ['Keep this list updated as GCXONE infrastructure evolves'],
                    tips: ['Subscribe to GCXONE notifications for IP changes']
                }
            },
            {
                id: 'bandwidth-check',
                title: 'Verify Bandwidth Requirements',
                description: 'Ensure sufficient network bandwidth',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/bandwidth-requirements',
                learningContent: {
                    description: 'Calculate and verify your network has sufficient bandwidth for video streaming.',
                    tips: ['Plan for peak usage with multiple simultaneous video streams'],
                    warnings: ['Insufficient bandwidth affects video quality and alarm delivery']
                }
            },
            {
                id: 'ntp-config',
                title: 'Configure NTP Time Sync',
                description: 'Set up accurate time synchronization',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/ntp-configuration',
                learningContent: {
                    description: 'Proper time synchronization is critical for alarm correlation and video playback.',
                    warnings: ['Incorrect time can cause alarms to be mismatched with video footage'],
                    tips: ['Use pool.ntp.org or your organization\'s NTP servers']
                }
            }
        ]
    },
    {
        id: 'devices-alarms',
        title: 'Devices & Alarms',
        description: 'Connect devices and configure alarms',
        steps: [
            {
                id: 'user-management',
                title: 'Set Up User Management',
                description: 'Create users and assign roles',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN],
                actionLink: '/docs/getting-started/user-management/overview',
                learningContent: {
                    description: 'Create operator accounts and configure role-based access control.',
                    tips: ['Follow principle of least privilege when assigning roles'],
                    warnings: ['Each operator should have their own account for audit purposes']
                }
            },
            {
                id: 'create-roles',
                title: 'Configure User Roles',
                description: 'Set up role-based permissions',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN],
                actionLink: '/docs/getting-started/user-management/creating-roles',
                learningContent: {
                    description: 'Define custom roles with specific permission sets.',
                    tips: ['Create role templates for common job functions']
                }
            },
            {
                id: 'talos-site-setup',
                title: 'Configure Talos Site Management',
                description: 'Set up sites and assign Talos units',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/talos/site-management',
                learningContent: {
                    description: 'Organize your deployment by sites and assign Talos units to each location.',
                    tips: ['Use clear naming conventions for sites (e.g., Building-Floor-Area)']
                }
            },
            {
                id: 'device-integration',
                title: 'Connect Cameras and Devices',
                description: 'Integrate cameras, sensors, and panels',
                type: StepType.ACTION,
                roles: [UserRole.INSTALLER, UserRole.ADMIN],
                roleSpecificTitle: {
                    [UserRole.INSTALLER]: 'Install and Connect Devices',
                    [UserRole.ADMIN]: 'Verify Device Connections'
                },
                actionLink: '/docs/getting-started/devices',
                learningContent: {
                    description: 'Connect cameras, alarm panels, and other devices to Talos and GCXONE.',
                    tips: ['Test each device connection before proceeding'],
                    warnings: ['Ensure all devices have unique identifiers']
                }
            },
            {
                id: 'alarm-forwarding',
                title: 'Set Up Alarm Forwarding',
                description: 'Configure alarm routing and notifications',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/alarm-forwarding',
                learningContent: {
                    description: 'Route alarms to appropriate operators and configure notification preferences.',
                    warnings: ['Test alarm forwarding before going live'],
                    tips: ['Set up escalation rules for high-priority alarms']
                }
            },
            {
                id: 'test-first-alarm',
                title: 'Receive Your First Alarm',
                description: 'Trigger and verify alarm receipt',
                type: StepType.VALIDATION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER],
                roleSpecificTitle: {
                    [UserRole.OPERATOR]: 'Process Your First Alarm',
                    [UserRole.INSTALLER]: 'Verify Alarm Delivery'
                },
                learningContent: {
                    description: 'Trigger a test alarm and verify it appears correctly in GCXONE.',
                    tips: ['Document the alarm flow time from trigger to receipt'],
                    warnings: ['If alarms don\'t appear, check firewall and network configuration']
                }
            }
        ]
    },
    {
        id: 'operational-validation',
        title: 'Operational Validation',
        description: 'Verify system readiness and go live',
        steps: [
            {
                id: 'alarm-processing',
                title: 'Practice Alarm Processing',
                description: 'Learn alarm handling workflows',
                type: StepType.ACTION,
                roles: [UserRole.OPERATOR, UserRole.ADMIN],
                roleSpecificTitle: {
                    [UserRole.OPERATOR]: 'Master Alarm Processing',
                    [UserRole.ADMIN]: 'Review Alarm Workflows'
                },
                learningContent: {
                    description: 'Complete walkthrough of receiving, investigating, and closing alarms.',
                    tips: ['Practice with test alarms before handling real incidents']
                }
            },
            {
                id: 'video-playback',
                title: 'Test Video Playback',
                description: 'Verify video access and quality',
                type: StepType.VALIDATION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER],
                learningContent: {
                    description: 'Ensure cameras are streaming properly and video quality is acceptable.',
                    warnings: ['Poor video quality may indicate bandwidth issues'],
                    tips: ['Test playback at different times of day to check consistency']
                }
            },
            {
                id: 'reporting-setup',
                title: 'Configure Reports',
                description: 'Set up operational reports',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.MANAGER],
                roleSpecificTitle: {
                    [UserRole.MANAGER]: 'Create Management Reports',
                    [UserRole.ADMIN]: 'Configure Report Templates'
                },
                learningContent: {
                    description: 'Set up automated reports for alarm statistics, response times, and system health.',
                    tips: ['Schedule daily and weekly reports to track KPIs']
                }
            },
            {
                id: 'troubleshooting-review',
                title: 'Review Troubleshooting Resources',
                description: 'Familiarize yourself with common issues',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/troubleshooting/browser-errors',
                learningContent: {
                    description: 'Learn how to diagnose and resolve common technical issues.',
                    tips: ['Bookmark troubleshooting pages for quick reference']
                }
            },
            {
                id: 'operator-training',
                title: 'Complete Operator Training',
                description: 'Ensure all operators are trained',
                type: StepType.CONFIRMATION,
                roles: [UserRole.ADMIN, UserRole.MANAGER],
                learningContent: {
                    description: 'Verify all operators have completed training and understand their workflows.',
                    tips: ['Create an onboarding checklist for new operators'],
                    warnings: ['Untrained operators may miss critical alarms or procedures']
                }
            },
            {
                id: 'go-live-checklist',
                title: 'Complete Go-Live Checklist',
                description: 'Final verification before going operational',
                type: StepType.CONFIRMATION,
                roles: [UserRole.ADMIN],
                learningContent: {
                    description: 'Final checklist to ensure all systems are ready for production use.',
                    tips: ['Schedule go-live during low-activity periods'],
                    warnings: ['Have support contact information readily available']
                }
            }
        ]
    }
];

// System Health Checklist (Educational/Display purposes)
export const systemHealthChecklist: SystemHealthItem[] = [
    {
        id: 'cameras-connected',
        name: 'Cameras Connected',
        status: SystemHealthStatus.OK,
        lastChecked: 'Just now',
        message: 'Cameras provide visual verification of alarms',
        linkedStepId: 'device-integration'
    },
    {
        id: 'alarms-received',
        name: 'Alarms Received',
        status: SystemHealthStatus.OK,
        lastChecked: '5 mins ago',
        message: 'Alarm delivery is core to monitoring operations',
        linkedStepId: 'test-first-alarm'
    },
    {
        id: 'users-assigned',
        name: 'Users Assigned',
        status: SystemHealthStatus.OK,
        lastChecked: '1 hour ago',
        message: 'Operators must be configured to respond to alarms',
        linkedStepId: 'user-management'
    },
    {
        id: 'time-sync',
        name: 'Time Sync OK',
        status: SystemHealthStatus.OK,
        lastChecked: '10 mins ago',
        message: 'Accurate time correlation between alarms and video',
        linkedStepId: 'ntp-config'
    },
    {
        id: 'storage-healthy',
        name: 'Storage Healthy',
        status: SystemHealthStatus.OK,
        lastChecked: '30 mins ago',
        message: 'Sufficient storage for video retention',
        linkedStepId: 'talos-site-setup'
    }
];
