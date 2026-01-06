// Roadmap Feature Data Structure
export type RoadmapStatus = 'Planning' | 'In Development' | 'Beta' | 'Launched' | 'Coming Soon';

export type RoadmapFeature = {
    id: string;
    title: string;
    description: string;
    businessValue: string;
    applicableTo?: string; // e.g., "C5, C6" or "All Users"
    projectedRelease: string; // e.g., "Q3 - 2025"
    generalAvailability?: string; // e.g., "08-Sep-2025"
    status: RoadmapStatus;
    category?: string; // e.g., "Platform", "Marketplace", "Analytics"
    year: number;
    quarter?: string; // e.g., "Q1", "Q2", "Q3", "Q4"
    helpLink?: string;
    tags?: string[];
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

