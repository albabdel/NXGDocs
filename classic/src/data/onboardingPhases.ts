/**
 * Onboarding Phases Data
 * Complete phase and step definitions with role-based content
 */

import { OnboardingPhase, StepType, UserRole, SystemHealthItem, SystemHealthStatus } from '../types/onboarding';

/**
 * Get onboarding phases with product-specific branding
 * @param productName - The product name to use in descriptions (e.g., 'GCXONE' or 'GC Surge')
 */
export function getOnboardingPhases(productName: string): OnboardingPhase[] {
return [
    {
        id: 'account-access',
        title: 'Account & Access',
        description: 'Get started with your account',
        steps: [
            {
                id: 'first-login',
                title: 'Complete First Time Login',
                description: `Access your ${productName} account and set up authentication`,
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER, UserRole.MANAGER],
                actionLink: '/docs/getting-started/first-time-login--access',
                learningContent: {
                    videoId: 'I7dccOLTOsk',
                    title: 'First-Time Login & Setup',
                    description: 'Step-by-step guide to your first login, password setup, and MFA configuration.',
                    tips: ['Use a strong password with at least 12 characters', 'Enable MFA for enhanced security']
                }
            },
            {
                id: 'understand-platform',
                title: `Understand What is ${productName}`,
                description: 'Learn about the platform capabilities',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.INSTALLER, UserRole.MANAGER],
                actionLink: '/docs/getting-started/what-is-gcxone',
                learningContent: {
                    videoId: 'ER-tnAvGXow',
                    title: `${productName} Product Overview`,
                    description: `Discover what ${productName} can do for your security operations and why leading companies trust our platform.`
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
                id: 'what-is-platform',
                title: `What is ${productName}?`,
                description: `Introduction to the ${productName} platform`,
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/what-is-gcxone',
                learningContent: {
                    description: `${productName} is the cloud platform for security monitoring and alarm management.`,
                    tips: ['Each site typically requires one Talos unit']
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
                description: `Open necessary ports for ${productName}`,
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/pre-deployment-requirements',
                learningContent: {
                    description: `List of all ports that must be open for ${productName} to function properly.`,
                    warnings: ['Work with your network team to configure firewall rules'],
                    tips: ['Document which ports are already open in your network']
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
                actionLink: '/docs/getting-started/user-management-setup',
                learningContent: {
                    description: 'Create operator accounts and configure role-based access control.',
                    tips: ['Follow principle of least privilege when assigning roles'],
                    warnings: ['Each operator should have their own account for audit purposes']
                }
            },
            {
                id: 'talos-site-setup',
                title: 'Configure Talos Site Management',
                description: 'Set up sites and assign Talos units',
                type: StepType.ACTION,
                roles: [UserRole.ADMIN, UserRole.INSTALLER],
                actionLink: '/docs/getting-started/organization--hierarchy-setup',
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
                actionLink: '/docs/devices',
                learningContent: {
                    description: `Connect cameras, alarm panels, and other devices to Talos and ${productName}.`,
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
                actionLink: '/docs/alarm-management',
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
                    description: `Trigger a test alarm and verify it appears correctly in ${productName}.`,
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
}

// Default export for backward compatibility (uses GCXONE as default)
export const onboardingPhases: OnboardingPhase[] = getOnboardingPhases('GCXONE');

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
        linkedStepId: 'required-ports'
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
