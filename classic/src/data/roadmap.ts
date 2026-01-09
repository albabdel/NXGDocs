// Roadmap Feature Data Structure
export type RoadmapStatus = 'Planning' | 'In Development' | 'Beta' | 'Launched' | 'Coming Soon' | 'To do' | 'In Progress' | 'In Staging' | 'Done';

export type RoadmapItemType = 'Story' | 'Task' | 'Bug';

export type RoadmapItem = {
    id: string;
    title: string;
    type: RoadmapItemType;
    status: RoadmapStatus;
    assignees?: string[];
    tags?: string[];
    description?: string;
};

export type RoadmapEpic = {
    id: string;
    name: string;
    description?: string;
    items: RoadmapItem[];
};

export type RoadmapFeature = {
    id: string;
    title: string;
    description: string;
    businessValue: string;
    applicableTo?: string;
    projectedRelease: string;
    generalAvailability?: string;
    status: RoadmapStatus;
    category?: string;
    year: number;
    quarter?: string;
    helpLink?: string;
    tags?: string[];
};

// Product Backlog Items organized by Epic
export const roadmapBacklog: RoadmapEpic[] = [
    {
        id: 'videoguard-nova99x',
        name: 'Videoguard NOVA99x',
        items: [
            {
                id: 'H2-I162',
                title: 'Benchmark vs Calipsa and V6',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'spykebox-release',
        name: 'Spykebox Release',
        items: [
            {
                id: 'H2-I142',
                title: 'Mark Feedback: Spykebox in production VCA regions show outside of the actual event.',
                type: 'Story',
                status: 'In Staging',
                assignees: ['NS'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I143',
                title: 'Mark Feedback: Checking VCA in the Spykebox System Monitor shows machines to be detected as truck. This device was standing still and was detected many times. Causing unreliable VCA.',
                type: 'Story',
                status: 'To do',
                assignees: ['NS'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I144',
                title: 'Mark Feedback: Debugging Spykebox (System Monitor) events only show images when All VCA is selected. None when individual rules are chosen in the drop-down menu.',
                type: 'Story',
                status: 'To do',
                assignees: ['NS'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I145',
                title: 'Mark Feedback: In app some cameras were not getting auto filled into grid. When clicked, the stream was white. After that moment every stream showed as fully white.',
                type: 'Story',
                status: 'To do',
                assignees: ['PP'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I146',
                title: 'Mark Feedback: Updating the App from Playstore when it\'s already installed causes an error',
                type: 'Story',
                status: 'To do',
                assignees: ['PP'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I147',
                title: 'License for Spykebox 16 and 13',
                type: 'Story',
                status: 'To do',
                assignees: ['RK'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I158',
                title: '5197 - Re: Spykebox 10 at customer \'Gede\' does not register VCA',
                type: 'Story',
                status: 'To do',
                assignees: ['SK'],
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'user-management-gaps',
        name: 'User Management Gaps',
        items: [
            {
                id: 'H2-I68',
                title: 'Assign a user to multiple customer groups',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I137',
                title: 'foolproof role management',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I141',
                title: '"Is able to edit its own role" permission',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'arming-multiple-devices',
        name: 'Arming multiple devices simultaneously',
        items: [
            {
                id: 'H2-I82',
                title: 'Add arm status in device list view',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'vivotek-integration',
        name: 'Vivotek Integration',
        items: [
            {
                id: 'H2-I83',
                title: 'Vivotek: Vortex Cloud POC',
                type: 'Story',
                status: 'In Progress',
                assignees: ['RM', '03'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I85',
                title: 'Authentication Exploration : POC :Vortex',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I86',
                title: 'Vortex: Streaming Exploration : POC',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '02'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I87',
                title: 'Event Webhook Exploration: POC:',
                type: 'Story',
                status: 'In Progress',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I93',
                title: 'Ptz, Preset and Timeline Exploration:POC: Vortex',
                type: 'Story',
                status: 'Done',
                assignees: ['RM', '03'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I94',
                title: 'Getsnapshot exploration for Healthcheck :POC',
                type: 'Story',
                status: 'Done',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I84',
                title: 'Vivotek NVR and IP Camera POC',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '02'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I88',
                title: 'Authentication and Discovery: POC',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I89',
                title: 'NVR:Streaming functionality exploration: POC',
                type: 'Story',
                status: 'Done',
                assignees: ['RM', '03'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I90',
                title: 'NVR: PTZ, Preset and Timeline Exploration : POC',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I91',
                title: 'Event - Webhook POC',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I92',
                title: 'GetSnapshot - POC.',
                type: 'Story',
                status: 'In Staging',
                assignees: ['RM', '01'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I97',
                title: 'NVR-IP : Health and Trigger Health (Discovery)',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I98',
                title: 'NVR-IP : Live streaming and Playback',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I99',
                title: 'NVR-IP: Time line',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I100',
                title: 'NVR-IP: PTZ,PRESET',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I102',
                title: 'Arm/Disarm',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I103',
                title: 'Trigger IO',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I104',
                title: 'Vortex : Health and Trigger health (Discovery)',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I105',
                title: 'Vortex: Live streaming and playback',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I106',
                title: 'Vortex: Time line',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I107',
                title: 'Vortex: PTZ and PRESET',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I108',
                title: 'Vortex: Arm/Disarm',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I109',
                title: 'Vortex: Trigger IO',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'success-reports',
        name: 'Success Reports',
        items: [
            {
                id: 'H2-I43',
                title: 'IGNORE THIS - Success Report Info',
                type: 'Story',
                status: 'To do',
                tags: ['secontec-success-reports', 'Add Tag']
            },
            {
                id: 'H2-I110',
                title: 'Success Report Data Extraction',
                type: 'Story',
                status: 'To do',
                assignees: ['MA', '01'],
                tags: ['secontec-success-reports', 'Add Tag']
            }
        ]
    },
    {
        id: 'product-backlog-uncommitted',
        name: 'Product Backlog (Uncommitted)',
        items: [
            {
                id: 'H2-I22',
                title: 'New function "Sort by"',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I25',
                title: 'Change healthCheck generated file name',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I26',
                title: 'UI: Add customizable health-check schedule',
                type: 'Story',
                status: 'To do',
                assignees: ['3'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I41',
                title: 'Feature: Save User Preference for AI Assistant Icon Location',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I69',
                title: 'Add Sort by Functionality to Configuration Page Tables',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Configuration', 'Add Tag']
            },
            {
                id: 'H2-I70',
                title: 'Device Armed Status Column',
                type: 'Story',
                status: 'To do',
                tags: ['Configuration', 'C24 NL', 'Device', 'Add Tag']
            },
            {
                id: 'H2-I72',
                title: 'Making dashboard widgets interactive',
                type: 'Story',
                status: 'To do',
                tags: ['Dashboard', 'Add Tag']
            },
            {
                id: 'H2-I73',
                title: 'Tooltips and Status Explanations for Mobile Tower Icons',
                type: 'Story',
                status: 'To do',
                tags: ['TowerGuard', 'Add Tag']
            },
            {
                id: 'H2-I74',
                title: 'Grid-Based Dashboard Customization (Drag & Drop)',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Dashboard', 'Add Tag']
            },
            {
                id: 'H2-I75',
                title: 'Victron Aggregate (Generator) Charging Signal',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'TowerGuard', 'Add Tag']
            },
            {
                id: 'H2-I76',
                title: 'Export Victron State Logs',
                type: 'Story',
                status: 'To do',
                tags: ['TowerGuard', 'Add Tag']
            },
            {
                id: 'H2-I77',
                title: 'Configurable "Time Saved" Calculation',
                type: 'Story',
                status: 'To do',
                tags: ['Nova99x', 'Add Tag']
            },
            {
                id: 'H2-I78',
                title: 'Isolate timeline fix',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I79',
                title: 'User Synchronization (Evalink to GCXONE)',
                type: 'Story',
                status: 'To do',
                tags: ['C24 NL', 'Add Tag']
            },
            {
                id: 'H2-I96',
                title: 'Add Isolate Status to Configuration Sensor List View',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I138',
                title: 'ZenMode enhancements',
                type: 'Story',
                status: 'To do',
                tags: ['Zen Mode', 'Add Tag']
            },
            {
                id: 'H2-I140',
                title: 'Audit trails for roles/permissions/users',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I150',
                title: 'display the Customer Name in video viewer while handling alarms',
                type: 'Story',
                status: 'To do',
                tags: ['Abacon', 'Video Viewer', 'Add Tag']
            },
            {
                id: 'H2-I151',
                title: 'Dashboard saved layout',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Dashboard', 'Add Tag']
            },
            {
                id: 'H2-I152',
                title: 'Alarm In-Flow card on the dashboard',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Dashboard', 'Add Tag']
            },
            {
                id: 'H2-I153',
                title: 'Nova99 dashboard enhancements',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Nova99x', 'Add Tag']
            },
            {
                id: 'H2-I154',
                title: 'back and forward navigation controls in configuration app',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Configuration', 'Add Tag']
            },
            {
                id: 'H2-I155',
                title: 'Time frame configuration (Dashboard)',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Dashboard', 'Add Tag']
            },
            {
                id: 'H2-I156',
                title: 'health check alarm codes',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'Health Check', 'healthcheck', 'Add Tag']
            },
            {
                id: 'H2-I157',
                title: 'Tower states enhancements',
                type: 'Story',
                status: 'To do',
                tags: ['Garda', 'TowerGuard', 'Add Tag']
            },
            {
                id: 'H2-I159',
                title: 'Operator Response Time Gauges',
                type: 'Story',
                status: 'To do',
                tags: ['Abacon', 'Dashboard', 'Add Tag']
            }
        ]
    },
    {
        id: 'healthcheck-dashboard-reports',
        name: 'Healthcheck Dashboard & Reports',
        items: [
            {
                id: 'H2-I27',
                title: 'Ability to Generate Report per Site',
                type: 'Story',
                status: 'Done',
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I28',
                title: 'Update Secontec\'s Logo',
                type: 'Story',
                status: 'Done',
                assignees: ['MA', '02'],
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I31',
                title: 'Ability to Run Once from the Single Camera View',
                type: 'Story',
                status: 'Done',
                assignees: ['01'],
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I32',
                title: 'Ability to Search by Site Independent from Customer',
                type: 'Story',
                status: 'Done',
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I33',
                title: 'Sort Healthcheck Results by Name and Number Effectively',
                type: 'Story',
                status: 'Done',
                assignees: ['01'],
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I34',
                title: 'Missing Sites and Customers in Dropdown',
                type: 'Story',
                status: 'Done',
                tags: ['secontec-hck-reports-1', 'Add Tag']
            },
            {
                id: 'H2-I35',
                title: 'Update Healthcheck Responses in German',
                type: 'Story',
                status: 'Done',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I36',
                title: 'Ability to Flip Between Ref and Snapshot In Single Camera View',
                type: 'Story',
                status: 'Done',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I38',
                title: 'Separate Blackscreen into No Video and No License',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I30',
                title: 'Ability to Update Reference Image from Healthcheck Dashboard',
                type: 'Story',
                status: 'To do',
                assignees: ['02'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I163',
                title: 'Exclude Tagged Cameras from Filter in Healthcheck Dashboard',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I164',
                title: '"Open in Talos" Button in Site Overview',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I48',
                title: 'Bulk Healthcheck Execution from Overview',
                type: 'Story',
                status: 'To do',
                assignees: ['+1'],
                tags: ['secontec-hck-reports-2', 'Secontec', 'Add Tag']
            }
        ]
    },
    {
        id: 'enhanced-tower-management',
        name: 'Enhanced Tower Management Post GCX Launch Feedback',
        items: [
            {
                id: 'H2-I101',
                title: 'Tower Management and Configuration',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I134',
                title: 'Device Dashboard - Teltonika - Inconsistent and missing info',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I135',
                title: 'Tower components statuses are not showing real data',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'automation-internal-ops',
        name: 'Automation: Internal Operations Automation & Efficiency',
        items: [
            {
                id: 'H2-I12',
                title: 'Create a Tenant as a NXGEN User',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I13',
                title: 'Observable GNN Logs',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I19',
                title: 'Create a NXSecurity demo tenant',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'feature-parity-genesis',
        name: 'Feature Parity: Critical Genesis Gaps',
        items: [
            {
                id: 'H2-I8',
                title: 'Create and Use Tags (Folders) from Video Viewer',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I11',
                title: 'Camera Masking Access',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I124',
                title: 'CustomView - 1 month filter doesn\'t work',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I125',
                title: 'VAS - Scroller bug',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I127',
                title: 'Salvo - zen mode UI needs fixing',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I129',
                title: 'Configuration - Failure of discovery not updating the status',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I130',
                title: 'Salvo - no quick access live and playback, and PTZ controls are enabled',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I132',
                title: 'Configuration - Fix formatting of contact number in customer overview',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I136',
                title: 'UX - The scroll bar in dark mode is not quite visible',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I139',
                title: 'thumbs up or thumbs down filter VAS',
                type: 'Story',
                status: 'To do',
                tags: ['VAS', 'Add Tag']
            },
            {
                id: 'H2-I160',
                title: 'View Sensor Unique Identifier (UID)',
                type: 'Story',
                status: 'To do',
                tags: ['C24 NL', 'Add Tag']
            },
            {
                id: 'H2-I66',
                title: '"From Template" Feature when adding a site',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I7',
                title: 'Move Device from one Site to another',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I122',
                title: 'CustomView - False Alarms (People/Vehicle/Other) is showing fake data',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I123',
                title: 'CustomView - check all charts. Some are returning no data',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            }
        ]
    },
    {
        id: 'dc09-cms-marketplace',
        name: 'DC09 / CMS Support via Marketplace',
        items: [
            {
                id: 'H2-I42',
                title: 'Zen Mode Behaviour with timeframe instead of workflows',
                type: 'Story',
                status: 'To do',
                tags: ['devision-migration-release', 'Add Tag']
            }
        ]
    },
    {
        id: 'none-epic',
        name: 'None',
        items: [
            {
                id: 'H2-I1',
                title: 'Ground Truth Setup',
                type: 'Story',
                status: 'To do',
                assignees: ['03'],
                tags: ['Add Tag']
            },
            {
                id: 'H2-I3',
                title: 'Bulk Import for CustomerGroups & Towers',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I4',
                title: 'Tower filter for VAS',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I23',
                title: 'Tower Device Components Params',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I116',
                title: 'Associate Sensor',
                type: 'Story',
                status: 'To do',
                tags: ['core-migration-release', 'Configuration', 'Add Tag']
            },
            {
                id: 'H2-I117',
                title: 'Upload Reference Image from Sensor Configuration',
                type: 'Story',
                status: 'To do',
                tags: ['core-migration-release', 'Add Tag']
            },
            {
                id: 'H2-I119',
                title: 'Autostream',
                type: 'Story',
                status: 'To do',
                tags: ['devision-migration-release', 'Add Tag']
            },
            {
                id: 'H2-I120',
                title: 'Move Device',
                type: 'Story',
                status: 'To do',
                tags: ['core-migration-release', 'Add Tag']
            },
            {
                id: 'H2-I180',
                title: 'PTZ/Thermal filter in configuration',
                type: 'Story',
                status: 'To do',
                tags: ['Add Tag']
            },
            {
                id: 'H2-I181',
                title: 'Roles And Permissions Audits',
                type: 'Story',
                status: 'To do',
                assignees: ['SC'],
                tags: ['Add Tag']
            }
        ]
    }
];

// Calculate backlog statistics
export const roadmapBacklogStats = {
    total: roadmapBacklog.reduce((sum, epic) => sum + epic.items.length, 0),
    byEpic: roadmapBacklog.reduce((acc, epic) => {
        acc[epic.name] = epic.items.length;
        return acc;
    }, {} as Record<string, number>),
    byStatus: roadmapBacklog.reduce((acc, epic) => {
        epic.items.forEach(item => {
            acc[item.status] = (acc[item.status] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>),
    byType: roadmapBacklog.reduce((acc, epic) => {
        epic.items.forEach(item => {
            acc[item.type] = (acc[item.type] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>)
};

export const roadmapFeatures: RoadmapFeature[] = [
    {
        id: 'dc09-cms-marketplace',
        title: 'DC09 / CMS Support via Marketplace',
        description: 'Complete DC09 and CMS support through the Marketplace enabling customers to onboard and route alarms correctly. Includes viewing CMS options, configuring Evalink Talos and DC09 CMS, assigning account IDs, enabling encryption, and viewing alarm logs.',
        businessValue: 'Enables seamless integration with DC09 CMS systems, reducing manual configuration overhead and improving alarm routing reliability for enterprise customers.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        generalAvailability: '15-Jan-2026',
        status: 'In Development',
        category: 'Marketplace',
        year: 2026,
        quarter: 'Q1',
        tags: ['Marketplace', 'CMS', 'Integration']
    },
    {
        id: 'analytics-marketplace',
        title: 'Analytics Subscription and Activation via Marketplace',
        description: 'Subscribe to and activate Analytics from the Marketplace, completing key Genesis parity functionality. Users can discover, subscribe, and activate analytics features directly from the marketplace.',
        businessValue: 'Streamlines analytics adoption through self-service marketplace, reducing time-to-value and support overhead while enabling customers to scale analytics as needed.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        generalAvailability: '22-Jan-2026',
        status: 'In Development',
        category: 'Marketplace',
        year: 2026,
        quarter: 'Q1',
        tags: ['Marketplace', 'Analytics', 'Genesis Parity']
    },
    {
        id: 'device-type-expansion',
        title: 'Add Remaining Device Types to Add Device Panel',
        description: 'Expand device configuration options by adding all remaining device types to the Add Device Panel, enabling broader hardware compatibility and reducing configuration complexity.',
        businessValue: 'Increases platform compatibility with diverse hardware ecosystems, reducing customer onboarding time and expanding market reach.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Configuration',
        year: 2026,
        quarter: 'Q1',
        tags: ['Configuration', 'Device Management', 'Genesis Parity']
    },
    {
        id: 'talos-reverse-sync',
        title: 'Talos Reverse Sync',
        description: 'Implement bidirectional data synchronization between GCXONE and Talos systems, enabling seamless data flow in both directions for improved operational workflows.',
        businessValue: 'Eliminates data silos between systems, ensuring data consistency and reducing manual data entry, improving operational efficiency by up to 40%.',
        applicableTo: 'Talos Customers',
        projectedRelease: 'Q1 - 2026',
        generalAvailability: '05-Feb-2026',
        status: 'In Development',
        category: 'Integration',
        year: 2026,
        quarter: 'Q1',
        tags: ['Talos', 'Sync', 'Genesis Parity']
    },
    {
        id: 'tower-management-enhancements',
        title: 'Enhanced Tower Management Features',
        description: 'Comprehensive tower management improvements including move tower functionality, tower status management, and additional properties in burger menu. Addresses critical feedback from GCX launch.',
        businessValue: 'Improves operational flexibility and reduces manual workarounds, enabling faster tower deployments and better status visibility for mobile security operations.',
        applicableTo: 'Tower Customers',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Operations',
        year: 2026,
        quarter: 'Q1',
        tags: ['Towers', 'Operations', 'GCX Feedback']
    },
    {
        id: 'healthcheck-bulk-execution',
        title: 'Bulk Healthcheck Execution from Overview',
        description: 'Ability to bulk run healthcheck operations from the overview page with filtering support, significantly improving operational efficiency for large-scale deployments.',
        businessValue: 'Reduces time to perform healthchecks by up to 80% for large deployments, enabling proactive monitoring at scale and reducing operational overhead.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Healthcheck',
        year: 2026,
        quarter: 'Q1',
        tags: ['Healthcheck', 'Operations', 'Bulk Actions']
    },
    {
        id: 'healthcheck-report-improvements',
        title: 'Healthcheck Report Enhancements',
        description: 'Comprehensive improvements to healthcheck reporting including site summary tables, larger image displays, detection highlighting, and improved AI performance for lowlight scenarios.',
        businessValue: 'Enhances report clarity and actionability, reducing time spent analyzing reports by 50% and improving decision-making speed for operations teams.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Healthcheck',
        year: 2026,
        quarter: 'Q1',
        tags: ['Healthcheck', 'Reporting', 'AI']
    },
    {
        id: 'vas-quad-view-fix',
        title: 'VAS Quad View Detection Display Fix',
        description: 'Fix detection display issues in VAS quad view to ensure proper visibility and accuracy of detection data across all camera views.',
        businessValue: 'Improves operator situational awareness and reduces missed detections, directly impacting security effectiveness and operator confidence.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Video',
        year: 2026,
        quarter: 'Q1',
        tags: ['Video', 'VAS', 'Bug Fix']
    },
    {
        id: 'reference-image-management',
        title: 'Reference Image Management Workflow',
        description: 'Improved workflow for managing reference images in healthcheck operations, streamlining the process of setting up and maintaining reference images.',
        businessValue: 'Reduces setup time for healthcheck operations by 60%, enabling faster onboarding of new sites and improving maintenance efficiency.',
        applicableTo: 'Healthcheck Users',
        projectedRelease: 'Q1 - 2026',
        status: 'Planning',
        category: 'Healthcheck',
        year: 2026,
        quarter: 'Q1',
        tags: ['Healthcheck', 'Workflow']
    },
    {
        id: 'sensor-config-ui',
        title: 'Add/Edit Sensor - UI Layout Improvements',
        description: 'Enhanced UI layout for adding and editing sensors, improving the configuration workflow and reducing errors during sensor setup.',
        businessValue: 'Reduces sensor configuration errors by 40% and decreases setup time by 30%, improving overall installation efficiency.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q2 - 2026',
        status: 'Planning',
        category: 'Configuration',
        year: 2026,
        quarter: 'Q2',
        tags: ['Configuration', 'UI/UX']
    },
    {
        id: 'genesis-audio-audit-fix',
        title: 'Genesis Audio Audit Tab Fix',
        description: 'Resolve empty page issue in Configuration Genesis Audio audit tab, restoring full functionality for audio device auditing.',
        businessValue: 'Restores critical auditing functionality for audio devices, enabling proper device management and compliance reporting.',
        applicableTo: 'Genesis Migrations',
        projectedRelease: 'Q1 - 2026',
        status: 'In Development',
        category: 'Configuration',
        year: 2026,
        quarter: 'Q1',
        tags: ['Configuration', 'Bug Fix', 'Genesis Parity']
    },
    {
        id: 'advanced-analytics-dashboard',
        title: 'Advanced Analytics Dashboard',
        description: 'Comprehensive analytics dashboard with real-time metrics, custom reports, and advanced data visualization capabilities for deeper insights into system performance.',
        businessValue: 'Enables data-driven decision making, providing actionable insights that can improve operational efficiency by up to 25% and identify optimization opportunities.',
        applicableTo: 'Enterprise Customers',
        projectedRelease: 'Q2 - 2026',
        status: 'Planning',
        category: 'Analytics',
        year: 2026,
        quarter: 'Q2',
        tags: ['Analytics', 'Dashboard', 'Reporting']
    },
    {
        id: 'api-rate-limiting',
        title: 'Advanced API Rate Limiting and Throttling',
        description: 'Implement sophisticated rate limiting and throttling mechanisms for API endpoints to ensure system stability and fair resource allocation.',
        businessValue: 'Ensures system stability under high load, prevents API abuse, and provides better resource management, improving overall platform reliability.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q2 - 2026',
        status: 'Planning',
        category: 'Infrastructure',
        year: 2026,
        quarter: 'Q2',
        tags: ['API', 'Infrastructure', 'Security']
    },
    {
        id: 'mobile-app-enhancements',
        title: 'Enhanced Mobile App Performance',
        description: 'Significant performance improvements and new notification features for the mobile application, enhancing the mobile user experience.',
        businessValue: 'Improves mobile user satisfaction and productivity, enabling effective remote monitoring and response capabilities.',
        applicableTo: 'Mobile Users',
        projectedRelease: 'Q2 - 2026',
        status: 'Planning',
        category: 'Mobile',
        year: 2026,
        quarter: 'Q2',
        tags: ['Mobile', 'Performance', 'Notifications']
    },
    {
        id: 'multi-language-support',
        title: 'Multi-language Support Expansion',
        description: 'Add support for additional languages in the user interface, expanding platform accessibility to global markets.',
        businessValue: 'Expands market reach to non-English speaking regions, increasing potential customer base by 30% in target markets.',
        applicableTo: 'All Customers',
        projectedRelease: 'Q3 - 2026',
        status: 'Planning',
        category: 'Internationalization',
        year: 2026,
        quarter: 'Q3',
        tags: ['i18n', 'Accessibility']
    }
];

// Calculate statistics
export const roadmapStats = {
    total: roadmapFeatures.length,
    byStatus: {
        Planning: roadmapFeatures.filter(f => f.status === 'Planning').length,
        'In Development': roadmapFeatures.filter(f => f.status === 'In Development').length,
        Beta: roadmapFeatures.filter(f => f.status === 'Beta').length,
        Launched: roadmapFeatures.filter(f => f.status === 'Launched').length,
        'Coming Soon': roadmapFeatures.filter(f => f.status === 'Coming Soon').length
    },
    byYear: roadmapFeatures.reduce((acc, feature) => {
        acc[feature.year] = (acc[feature.year] || 0) + 1;
        return acc;
    }, {} as Record<number, number>),
    byQuarter: roadmapFeatures.reduce((acc, feature) => {
        if (feature.quarter) {
            acc[feature.quarter] = (acc[feature.quarter] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>),
    byCategory: roadmapFeatures.reduce((acc, feature) => {
        const cat = feature.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>)
};
