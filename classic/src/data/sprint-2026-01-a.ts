// Sprint 2026.01-A Item Data
export type SprintItemType = 'Story' | 'Task' | 'Bug';

export type SprintItem = {
    id: string;
    title: string;
    type: SprintItemType;
    epic: string;
    tags: string[];
    status: 'To do' | 'In Progress' | 'Done';
    assignees: string[]; // Initials or names
    description?: string;
};

export const sprint202601AItems: SprintItem[] = [
    // Feature Parity: Critical Genesis Gaps
    {
        id: 'H2-I112',
        title: 'Subscribe to Analytics from Marketplace',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Marketplace', 'core-migration-release'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I20',
        title: 'Activate Analytics from Marketplace',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Marketplace'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I50',
        title: 'Add Remaining Device Types to Add Device Panel',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Configuration', 'core-migration-release'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I113',
        title: 'Talos Reverse Sync',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['SK', 'core-migration-release'],
        status: 'To do',
        assignees: ['+1']
    },
    {
        id: 'H2-I65',
        title: 'Reference Image Management Workflow',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['healthcheck'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I121',
        title: 'Detection is not showing properly in VAS quad view',
        type: 'Bug',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I115',
        title: 'docs.nxgen.cloud Documentation Update',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['core-migration-release', 'Documentation'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I128',
        title: 'Add/Edit Sensor - UI Layout',
        type: 'Story',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I133',
        title: 'Configuration - Genesis Audio audit tab returns an empty page',
        type: 'Bug',
        epic: 'Feature Parity: Critical Genesis Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    // Enhanced Tower Management Post GCX Launch Feedback
    {
        id: 'H2-I15',
        title: 'Move Tower',
        type: 'Story',
        epic: 'Enhanced Tower Management Post GCX Launch Feedback',
        tags: ['SC', 'Add Tag'],
        status: 'To do',
        assignees: ['01']
    },
    {
        id: 'H2-I39',
        title: 'Tower Statuses',
        type: 'Story',
        epic: 'Enhanced Tower Management Post GCX Launch Feedback',
        tags: ['SC', 'Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I40',
        title: 'Additional Properties Burger Menu',
        type: 'Story',
        epic: 'Enhanced Tower Management Post GCX Launch Feedback',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    // Healthcheck Dashboard & Reports
    {
        id: 'H2-I165',
        title: 'Site Summary Table in Healthcheck Customer Report',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I166',
        title: 'Copy selected customers/sites and email templates from other schedulers',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I167',
        title: 'Response on lowlight issues for dual lense cameras (thermal + optical)',
        type: 'Bug',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    {
        id: 'H2-I168',
        title: 'Ability to bulk run healthcheck from the overview (including filters)',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    {
        id: 'H2-I169',
        title: 'Use more space to show bigger images in the report',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    {
        id: 'H2-I170',
        title: 'Highlight Detection',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    {
        id: 'H2-I171',
        title: 'Split black screen into no license and no video',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    {
        id: 'H2-I172',
        title: 'Improve healthcheck AI performance as stated in tags',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['YA']
    },
    // DC09 / CMS Support via Marketplace
    {
        id: 'H2-I173',
        title: 'Story 1.1 – View CMS Options',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I174',
        title: 'Story 1.2 – Configure Evalink Talos',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I175',
        title: 'Story 1.3 – Configure DC09 CMS',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I176',
        title: 'Story 2.1 – Assign DC09 Account ID',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I177',
        title: 'Story 2.2 – Enable Encryption',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I178',
        title: 'Story 3.1 – Prevent Invalid Configuration',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I179',
        title: 'Story 4.1 – View DC09 Alarm Logs',
        type: 'Story',
        epic: 'DC09 / CMS Support via Marketplace',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    // User Management Gaps
    {
        id: 'H2-I182',
        title: 'Time-Based Token Invitations',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I183',
        title: 'Time-Based Token Invitations 2',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I184',
        title: 'Time-Based Token Invitations 3',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I185',
        title: 'Time-Based Token Invitations 4',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I186',
        title: 'Time-Based Token Invitations 5',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I187',
        title: 'Time-Based Token Invitations 6',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I188',
        title: 'Installer / Invitee Experience',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I189',
        title: 'Installer / Invitee Experience 2',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I190',
        title: 'Trial Customer Access',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I191',
        title: 'Trial Customer Access 2',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I192',
        title: 'Security, Audit, and Control',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I193',
        title: 'Security, Audit, and Control 2',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I194',
        title: 'Security, Audit, and Control 3',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I195',
        title: 'Create and Manage Custom Roles',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I196',
        title: 'Assign Roles to User Groups',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I197',
        title: 'Define Entity Groups',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I198',
        title: 'User-Level Privilege Exclusions',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I199',
        title: 'View Effective User Permissions',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I200',
        title: 'Time-Based Privilege Scheduling',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I201',
        title: 'Reassign Master Admin Role',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I202',
        title: 'Per-Device Privilege Overrides',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I203',
        title: 'Conditional Permissions for Alarm States',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I204',
        title: 'Permission Audit Trail',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I205',
        title: 'Enforce Single Master Admin',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I206',
        title: 'Clear Device and Camera Access View',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I207',
        title: 'Explain Permission Denials',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I208',
        title: 'Automatic Group Membership Sync',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I209',
        title: 'Support: View and Modify Tenant Roles',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I210',
        title: 'Permission Simulation Mode',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I211',
        title: 'Audit Support Role Activities',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I212',
        title: 'Master Admin Uniqueness',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I213',
        title: 'Master Admin Deactivation Alerts',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I214',
        title: 'Prevent Master Admin Deletion Without Reassignment',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I215',
        title: 'Cross-Customer Entity Groups',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I216',
        title: 'Editable Role Templates for Onboarding',
        type: 'Story',
        epic: 'User Management Gaps',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    // Autostream
    {
        id: 'H2-I217',
        title: 'Expose Auto Streaming Configuration in GCX Admin',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I218',
        title: 'Use Existing Genesis Alarm Types to Trigger Streaming',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I219',
        title: 'Auto Start Streams on Alarm Using Existing Camera and Sensor Data',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I220',
        title: 'Apply Existing Zone Configuration to Control Streaming',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I221',
        title: 'Display and Use Zones Defined at Site Level',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I222',
        title: 'Enforce Existing Role Permissions for Auto Streaming',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I223',
        title: 'Hide or Disable Streaming UI When Permission Is Missing',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    },
    {
        id: 'H2-I224',
        title: 'Audit Auto Streaming Activity Using Existing Logs',
        type: 'Story',
        epic: 'Autostream',
        tags: ['Add Tag'],
        status: 'To do',
        assignees: []
    }
];

// Calculate statistics
export const sprint202601AStats = {
    total: sprint202601AItems.length,
    stories: sprint202601AItems.filter(item => item.type === 'Story').length,
    tasks: sprint202601AItems.filter(item => item.type === 'Task').length,
    bugs: sprint202601AItems.filter(item => item.type === 'Bug').length,
    byStatus: {
        todo: sprint202601AItems.filter(item => item.status === 'To do').length,
        inProgress: sprint202601AItems.filter(item => item.status === 'In Progress').length,
        done: sprint202601AItems.filter(item => item.status === 'Done').length
    },
    byEpic: sprint202601AItems.reduce((acc, item) => {
        acc[item.epic] = (acc[item.epic] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
};

// Sprint metadata
export const sprint202601AMetadata = {
    id: 'sprint-2026-01-a',
    title: 'Sprint 2026.01-A',
    date: 'January 1, 2026',
    status: 'current' as const,
    description: 'Enable DC09 onboarding and close the last high impact Genesis gaps so customers can migrate, operate, and monitor without blockers.'
};

