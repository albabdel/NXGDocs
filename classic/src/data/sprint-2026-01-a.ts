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
    {
        id: 'H2-I48',
        title: 'Bulk Healthcheck Execution from Overview',
        type: 'Story',
        epic: 'Healthcheck Dashboard & Reports',
        tags: ['secontec-hck-reports-3', 'Add Tag'],
        status: 'To do',
        assignees: ['+1']
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

