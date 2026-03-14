const PROJECT_ID = 'fjjuacab';
const DATASET = 'production';
const API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const SANITY_API_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${DATASET}`;

async function sanityMutate(mutations) {
  const response = await fetch(SANITY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  return response.json();
}

const pageSections = {
  'landingPage.docs-breakthroughs': {
    title: 'Breakthroughs',
    sections: [
      {
        _key: 'breakthroughs-features',
        _type: 'landingSectionFeatures',
        title: 'Innovation Highlights',
        description: 'Explore the latest breakthroughs and innovations in our platform',
        columns: 3,
        features: [
          {
            title: 'AI-Powered Analytics',
            description: 'Advanced machine learning algorithms for predictive monitoring and anomaly detection',
            icon: 'Brain',
            color: '#8B5CF6',
          },
          {
            title: 'Real-time Processing',
            description: 'Lightning-fast data processing with sub-second latency for critical alerts',
            icon: 'Zap',
            color: '#F59E0B',
          },
          {
            title: 'Edge Computing',
            description: 'Distributed computing capabilities for local processing and reduced cloud dependency',
            icon: 'Server',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'breakthroughs-stats',
        _type: 'landingSectionStats',
        title: 'Impact Metrics',
        stats: [
          { label: 'Faster Detection', value: '10x' },
          { label: 'Reduced Downtime', value: '45%' },
          { label: 'Active Deployments', value: '500+' },
        ],
      },
      {
        _key: 'breakthroughs-cta',
        _type: 'landingSectionCTA',
        title: 'Discover Our Innovations',
        description: 'Learn how our latest breakthroughs can transform your monitoring operations.',
        buttons: [
          { label: 'View Documentation', href: '/docs', variant: 'primary' },
          { label: 'Contact Sales', href: '/contact', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.integration-hub': {
    title: 'Integration Hub',
    sections: [
      {
        _key: 'integration-features',
        _type: 'landingSectionFeatures',
        title: 'Integration Capabilities',
        description: 'Connect with a wide range of devices, protocols, and third-party systems',
        columns: 4,
        features: [
          {
            title: 'Device Protocols',
            description: 'Support for SNMP, Modbus, OPC-UA, MQTT, and custom protocols',
            icon: 'Cpu',
            color: '#3B82F6',
          },
          {
            title: 'API Integrations',
            description: 'RESTful APIs and webhooks for seamless third-party connections',
            icon: 'Code',
            color: '#10B981',
          },
          {
            title: 'Data Connectors',
            description: 'Pre-built connectors for popular monitoring and IoT platforms',
            icon: 'Plug',
            color: '#8B5CF6',
          },
          {
            title: 'Custom Drivers',
            description: 'Build custom drivers for proprietary equipment and legacy systems',
            icon: 'Wrench',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'integration-content',
        _type: 'landingSectionContentGrid',
        title: 'Integration Guides',
        description: 'Step-by-step guides for common integration scenarios',
        columns: 2,
        items: [
          {
            title: 'SNMP Integration',
            description: 'Configure SNMP polling for network devices and sensors',
            icon: 'Network',
            link: '/docs/integrations/snmp',
          },
          {
            title: 'Modbus Setup',
            description: 'Connect Modbus-enabled equipment and controllers',
            icon: 'Settings',
            link: '/docs/integrations/modbus',
          },
          {
            title: 'API Documentation',
            description: 'Complete API reference with examples and SDKs',
            icon: 'Book',
            link: '/docs/api',
          },
          {
            title: 'Webhook Configuration',
            description: 'Set up real-time event notifications via webhooks',
            icon: 'Bell',
            link: '/docs/integrations/webhooks',
          },
        ],
      },
      {
        _key: 'integration-cta',
        _type: 'landingSectionCTA',
        title: 'Start Integrating',
        description: 'Connect your devices and systems to unlock powerful monitoring capabilities.',
        buttons: [
          { label: 'Browse Integrations', href: '/integrations', variant: 'primary' },
          { label: 'API Reference', href: '/docs/api', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.internal-releases': {
    title: 'Internal Releases',
    sections: [
      {
        _key: 'releases-features',
        _type: 'landingSectionFeatures',
        title: 'Release Categories',
        description: 'Track our internal development progress and upcoming features',
        columns: 3,
        features: [
          {
            title: 'Feature Releases',
            description: 'Major new capabilities and enhancements',
            icon: 'Sparkles',
            color: '#8B5CF6',
          },
          {
            title: 'Bug Fixes',
            description: 'Resolved issues and stability improvements',
            icon: 'Bug',
            color: '#10B981',
          },
          {
            title: 'Performance Updates',
            description: 'Speed and efficiency optimizations',
            icon: 'Gauge',
            color: '#3B82F6',
          },
        ],
      },
      {
        _key: 'releases-cta',
        _type: 'landingSectionCTA',
        title: 'View Latest Releases',
        description: 'Stay up to date with the newest features and improvements.',
        buttons: [
          { label: 'Current Sprint', href: '/internal-releases/current', variant: 'primary' },
          { label: 'Release History', href: '/internal-releases/archive', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.quick-start-device-integration': {
    title: 'Device Integration Guide',
    sections: [
      {
        _key: 'device-features',
        _type: 'landingSectionFeatures',
        title: 'Integration Steps',
        description: 'Follow these steps to connect your devices',
        columns: 4,
        features: [
          {
            title: '1. Select Protocol',
            description: 'Choose the appropriate communication protocol for your device',
            icon: 'Settings',
            color: '#3B82F6',
          },
          {
            title: '2. Configure Device',
            description: 'Set up device parameters and connection settings',
            icon: 'Cpu',
            color: '#10B981',
          },
          {
            title: '3. Map Points',
            description: 'Define data points and monitoring parameters',
            icon: 'Map',
            color: '#8B5CF6',
          },
          {
            title: '4. Verify Data',
            description: 'Test connectivity and validate data flow',
            icon: 'CheckCircle',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'device-content',
        _type: 'landingSectionContentGrid',
        title: 'Integration Resources',
        description: 'Helpful resources for device integration',
        columns: 2,
        items: [
          {
            title: 'Protocol Reference',
            description: 'Complete guide to supported protocols',
            icon: 'Book',
            link: '/docs/integrations/protocols',
          },
          {
            title: 'Device Templates',
            description: 'Pre-configured templates for common devices',
            icon: 'Copy',
            link: '/docs/integrations/templates',
          },
          {
            title: 'Troubleshooting',
            description: 'Common issues and solutions',
            icon: 'HelpCircle',
            link: '/docs/integrations/troubleshooting',
          },
          {
            title: 'Best Practices',
            description: 'Tips for optimal device configuration',
            icon: 'Lightbulb',
            link: '/docs/integrations/best-practices',
          },
        ],
      },
      {
        _key: 'device-cta',
        _type: 'landingSectionCTA',
        title: 'Ready to Connect?',
        description: 'Start integrating your devices with our comprehensive guides.',
        buttons: [
          { label: 'View All Protocols', href: '/integrations', variant: 'primary' },
          { label: 'API Reference', href: '/docs/api', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.quick-start-platform-overview': {
    title: 'Platform Overview',
    sections: [
      {
        _key: 'platform-features',
        _type: 'landingSectionFeatures',
        title: 'Core Capabilities',
        description: 'Discover the powerful features of our monitoring platform',
        columns: 3,
        features: [
          {
            title: 'Real-time Monitoring',
            description: 'Live data visualization with customizable dashboards',
            icon: 'Activity',
            color: '#3B82F6',
          },
          {
            title: 'Alert Management',
            description: 'Intelligent alerting with escalation and routing',
            icon: 'Bell',
            color: '#F59E0B',
          },
          {
            title: 'Historical Analysis',
            description: 'Trend analysis and historical data reporting',
            icon: 'TrendingUp',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'platform-steps',
        _type: 'landingSectionSteps',
        title: 'Getting Started',
        description: 'Your journey to operational excellence',
        phases: [
          {
            phaseNumber: 1,
            title: 'Foundation',
            description: 'Set up your basic platform configuration',
            steps: [
              { stepNumber: 1, title: 'Create Account', description: 'Sign up and verify your account' },
              { stepNumber: 2, title: 'Initial Setup', description: 'Configure basic platform settings' },
              { stepNumber: 3, title: 'Team Setup', description: 'Invite team members and assign roles' },
            ],
          },
          {
            phaseNumber: 2,
            title: 'Configuration',
            description: 'Build your monitoring infrastructure',
            steps: [
              { stepNumber: 4, title: 'Create Hierarchy', description: 'Set up regions, clusters, and sites' },
              { stepNumber: 5, title: 'Add Devices', description: 'Connect your monitoring equipment' },
              { stepNumber: 6, title: 'Configure Alerts', description: 'Set up alarm rules and notifications' },
            ],
          },
        ],
      },
      {
        _key: 'platform-cta',
        _type: 'landingSectionCTA',
        title: 'Explore the Platform',
        description: 'Discover how our platform can transform your operations.',
        buttons: [
          { label: 'Full Documentation', href: '/docs', variant: 'primary' },
          { label: 'Watch Demo', href: '/demo', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.releases': {
    title: 'Release Notes',
    sections: [
      {
        _key: 'releases-features',
        _type: 'landingSectionFeatures',
        title: 'Recent Highlights',
        description: 'Key features from our latest releases',
        columns: 3,
        features: [
          {
            title: 'Enhanced Dashboard',
            description: 'New dashboard widgets and customization options',
            icon: 'LayoutDashboard',
            color: '#8B5CF6',
          },
          {
            title: 'Mobile App Update',
            description: 'Improved mobile experience with offline support',
            icon: 'Smartphone',
            color: '#3B82F6',
          },
          {
            title: 'API v2',
            description: 'New API version with expanded capabilities',
            icon: 'Code',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'releases-tabs',
        _type: 'landingSectionTabs',
        title: 'Release Archives',
        description: 'Browse releases by category',
        tabs: [
          {
            id: 'major',
            label: 'Major Releases',
            icon: 'Sparkles',
            content: {
              title: 'Major Releases',
              description: 'Significant feature updates and enhancements',
              items: [
                { title: 'v3.0 Platform Launch', description: 'Complete platform redesign', icon: 'Rocket', status: 'Latest' },
                { title: 'v2.5 Analytics Suite', description: 'Advanced analytics capabilities', icon: 'Chart', status: 'Stable' },
              ],
            },
          },
          {
            id: 'minor',
            label: 'Minor Updates',
            icon: 'RefreshCw',
            content: {
              title: 'Minor Updates',
              description: 'Incremental improvements and features',
              items: [
                { title: 'v3.1 Performance Boost', description: 'Speed and reliability improvements', icon: 'Zap', status: 'Current' },
                { title: 'v3.0.5 Bug Fixes', description: 'Resolved issues and stability', icon: 'Check', status: 'Patch' },
              ],
            },
          },
        ],
      },
      {
        _key: 'releases-cta',
        _type: 'landingSectionCTA',
        title: 'Stay Updated',
        description: 'Subscribe to release notifications and stay informed.',
        buttons: [
          { label: 'View All Releases', href: '/releases/archive', variant: 'primary' },
          { label: 'Subscribe', href: '/subscribe', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.roadmap': {
    title: 'Product Roadmap',
    sections: [
      {
        _key: 'roadmap-features',
        _type: 'landingSectionFeatures',
        title: 'Upcoming Features',
        description: 'See what we are building next',
        columns: 4,
        features: [
          {
            title: 'AI Assistant',
            description: 'Intelligent recommendations and automated workflows',
            icon: 'Bot',
            color: '#8B5CF6',
          },
          {
            title: 'Advanced Analytics',
            description: 'Deeper insights with predictive analytics',
            icon: 'TrendingUp',
            color: '#3B82F6',
          },
          {
            title: 'Mobile Redesign',
            description: 'Native mobile apps with enhanced features',
            icon: 'Smartphone',
            color: '#10B981',
          },
          {
            title: 'Integration Hub 2.0',
            description: 'Expanded protocol support and easier setup',
            icon: 'Plug',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'roadmap-steps',
        _type: 'landingSectionSteps',
        title: 'Development Timeline',
        description: 'Our planned release schedule',
        phases: [
          {
            phaseNumber: 1,
            title: 'Q1 2026',
            description: 'Foundation improvements',
            steps: [
              { stepNumber: 1, title: 'Performance Engine', description: 'Core platform optimization' },
              { stepNumber: 2, title: 'API Expansion', description: 'New API endpoints and features' },
            ],
          },
          {
            phaseNumber: 2,
            title: 'Q2 2026',
            description: 'User experience enhancements',
            steps: [
              { stepNumber: 3, title: 'Dashboard 2.0', description: 'Redesigned dashboard builder' },
              { stepNumber: 4, title: 'Mobile Update', description: 'Native mobile applications' },
            ],
          },
          {
            phaseNumber: 3,
            title: 'Q3 2026',
            description: 'Intelligence features',
            steps: [
              { stepNumber: 5, title: 'AI Integration', description: 'Machine learning capabilities' },
              { stepNumber: 6, title: 'Automation', description: 'Workflow automation engine' },
            ],
          },
        ],
      },
      {
        _key: 'roadmap-cta',
        _type: 'landingSectionCTA',
        title: 'Shape Our Future',
        description: 'Share your feedback and help us prioritize upcoming features.',
        buttons: [
          { label: 'Submit Feature Request', href: '/feedback', variant: 'primary' },
          { label: 'View Full Roadmap', href: '/roadmap/full', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.roles-admin': {
    title: 'Admin Workspace',
    sections: [
      {
        _key: 'admin-features',
        _type: 'landingSectionFeatures',
        title: 'Admin Capabilities',
        description: 'Powerful tools for platform administration',
        columns: 4,
        features: [
          {
            title: 'User Management',
            description: 'Create users, assign roles, and manage permissions',
            icon: 'Users',
            color: '#3B82F6',
          },
          {
            title: 'Organization Setup',
            description: 'Configure hierarchy, regions, and site structure',
            icon: 'Building2',
            color: '#10B981',
          },
          {
            title: 'System Config',
            description: 'Global settings, integrations, and security policies',
            icon: 'Settings',
            color: '#8B5CF6',
          },
          {
            title: 'Audit Logs',
            description: 'Complete activity tracking and compliance reporting',
            icon: 'FileText',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'admin-content',
        _type: 'landingSectionContentGrid',
        title: 'Admin Guides',
        description: 'Essential documentation for administrators',
        columns: 2,
        items: [
          {
            title: 'User Management',
            description: 'Create and manage user accounts and permissions',
            icon: 'User',
            link: '/docs/admin/users',
          },
          {
            title: 'Role Configuration',
            description: 'Define roles with granular permissions',
            icon: 'Shield',
            link: '/docs/admin/roles',
          },
          {
            title: 'Organization Structure',
            description: 'Set up your monitoring hierarchy',
            icon: 'Building',
            link: '/docs/admin/organization',
          },
          {
            title: 'Security Settings',
            description: 'Configure authentication and security policies',
            icon: 'Lock',
            link: '/docs/admin/security',
          },
        ],
      },
      {
        _key: 'admin-cta',
        _type: 'landingSectionCTA',
        title: 'Admin Documentation',
        description: 'Access comprehensive guides for all admin functions.',
        buttons: [
          { label: 'View Admin Docs', href: '/docs/admin', variant: 'primary' },
          { label: 'System Status', href: '/status', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.roles-installer': {
    title: 'Installer Toolkit',
    sections: [
      {
        _key: 'installer-features',
        _type: 'landingSectionFeatures',
        title: 'Installer Tools',
        description: 'Everything you need for successful installations',
        columns: 3,
        features: [
          {
            title: 'Site Setup',
            description: 'Quick site creation and configuration wizards',
            icon: 'MapPin',
            color: '#3B82F6',
          },
          {
            title: 'Device Provisioning',
            description: 'Bulk device onboarding and template management',
            icon: 'Cpu',
            color: '#10B981',
          },
          {
            title: 'Validation Tools',
            description: 'Automated testing and verification workflows',
            icon: 'CheckSquare',
            color: '#8B5CF6',
          },
        ],
      },
      {
        _key: 'installer-content',
        _type: 'landingSectionContentGrid',
        title: 'Installation Guides',
        description: 'Step-by-step guides for installers',
        columns: 2,
        items: [
          {
            title: 'Site Setup Guide',
            description: 'Complete guide to creating and configuring sites',
            icon: 'Building',
            link: '/docs/installer/site-setup',
          },
          {
            title: 'Device Onboarding',
            description: 'Add devices using templates or manual configuration',
            icon: 'Plus',
            link: '/docs/installer/device-onboarding',
          },
          {
            title: 'Commissioning Checklist',
            description: 'Verify installations meet requirements',
            icon: 'ClipboardCheck',
            link: '/docs/installer/commissioning',
          },
          {
            title: 'Troubleshooting',
            description: 'Common issues and solutions for installers',
            icon: 'Wrench',
            link: '/docs/installer/troubleshooting',
          },
        ],
      },
      {
        _key: 'installer-cta',
        _type: 'landingSectionCTA',
        title: 'Start Installing',
        description: 'Access all the tools and guides you need for successful installations.',
        buttons: [
          { label: 'View Installer Docs', href: '/docs/installer', variant: 'primary' },
          { label: 'Device Templates', href: '/templates', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.roles-manager': {
    title: 'Manager Overview',
    sections: [
      {
        _key: 'manager-features',
        _type: 'landingSectionFeatures',
        title: 'Manager Dashboard',
        description: 'Tools for managing operations and teams',
        columns: 4,
        features: [
          {
            title: 'Performance Metrics',
            description: 'Track KPIs and operational performance',
            icon: 'TrendingUp',
            color: '#3B82F6',
          },
          {
            title: 'Team Oversight',
            description: 'Monitor team activities and workload distribution',
            icon: 'Users',
            color: '#10B981',
          },
          {
            title: 'Report Builder',
            description: 'Create custom reports for stakeholders',
            icon: 'FileBarChart',
            color: '#8B5CF6',
          },
          {
            title: 'Alert Management',
            description: 'Configure escalation rules and response protocols',
            icon: 'Bell',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'manager-content',
        _type: 'landingSectionContentGrid',
        title: 'Manager Resources',
        description: 'Documentation for operational managers',
        columns: 2,
        items: [
          {
            title: 'Dashboard Guide',
            description: 'Configure manager dashboards and views',
            icon: 'LayoutDashboard',
            link: '/docs/manager/dashboards',
          },
          {
            title: 'Reporting',
            description: 'Create and schedule operational reports',
            icon: 'FileText',
            link: '/docs/manager/reporting',
          },
          {
            title: 'Team Management',
            description: 'Manage team assignments and schedules',
            icon: 'Users',
            link: '/docs/manager/team',
          },
          {
            title: 'Best Practices',
            description: 'Operational excellence guidelines',
            icon: 'Lightbulb',
            link: '/docs/manager/best-practices',
          },
        ],
      },
      {
        _key: 'manager-cta',
        _type: 'landingSectionCTA',
        title: 'Manager Documentation',
        description: 'Access comprehensive guides for operational management.',
        buttons: [
          { label: 'View Manager Docs', href: '/docs/manager', variant: 'primary' },
          { label: 'Reports Library', href: '/reports', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.roles-operator': {
    title: 'Operator Workspace',
    sections: [
      {
        _key: 'operator-features',
        _type: 'landingSectionFeatures',
        title: 'Operator Tools',
        description: 'Essential tools for daily monitoring operations',
        columns: 4,
        features: [
          {
            title: 'Live Monitoring',
            description: 'Real-time dashboards with live data streams',
            icon: 'Activity',
            color: '#3B82F6',
          },
          {
            title: 'Alert Handling',
            description: 'Acknowledge, investigate, and resolve alerts',
            icon: 'BellRing',
            color: '#F59E0B',
          },
          {
            title: 'Device Status',
            description: 'View device health and connectivity status',
            icon: 'Cpu',
            color: '#10B981',
          },
          {
            title: 'Event Log',
            description: 'Complete history of events and actions taken',
            icon: 'History',
            color: '#8B5CF6',
          },
        ],
      },
      {
        _key: 'operator-content',
        _type: 'landingSectionContentGrid',
        title: 'Operator Guides',
        description: 'Learn how to use the platform effectively',
        columns: 2,
        items: [
          {
            title: 'Monitoring Basics',
            description: 'Introduction to real-time monitoring',
            icon: 'Eye',
            link: '/docs/operator/monitoring',
          },
          {
            title: 'Alert Response',
            description: 'How to handle and resolve alerts',
            icon: 'AlertTriangle',
            link: '/docs/operator/alerts',
          },
          {
            title: 'Dashboard Navigation',
            description: 'Find and use the information you need',
            icon: 'Compass',
            link: '/docs/operator/dashboards',
          },
          {
            title: 'Shift Handover',
            description: 'Best practices for shift transitions',
            icon: 'Repeat',
            link: '/docs/operator/handover',
          },
        ],
      },
      {
        _key: 'operator-cta',
        _type: 'landingSectionCTA',
        title: 'Operator Training',
        description: 'Access training materials and quick reference guides.',
        buttons: [
          { label: 'View Operator Docs', href: '/docs/operator', variant: 'primary' },
          { label: 'Quick Reference', href: '/docs/operator/quick-ref', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.towers': {
    title: 'Towers',
    sections: [
      {
        _key: 'towers-features',
        _type: 'landingSectionFeatures',
        title: 'Tower Monitoring',
        description: 'Comprehensive monitoring for telecommunications towers',
        columns: 4,
        features: [
          {
            title: 'Site Monitoring',
            description: 'Environmental sensors, power systems, and equipment status',
            icon: 'RadioTower',
            color: '#3B82F6',
          },
          {
            title: 'Power Management',
            description: 'Generator, UPS, and solar panel monitoring',
            icon: 'Battery',
            color: '#10B981',
          },
          {
            title: 'Security Systems',
            description: 'Access control, cameras, and intrusion detection',
            icon: 'Shield',
            color: '#8B5CF6',
          },
          {
            title: 'Network Equipment',
            description: 'RAN, backhaul, and transmission monitoring',
            icon: 'Network',
            color: '#F59E0B',
          },
        ],
      },
      {
        _key: 'towers-content',
        _type: 'landingSectionContentGrid',
        title: 'Tower Resources',
        description: 'Documentation and guides for tower monitoring',
        columns: 2,
        items: [
          {
            title: 'Tower Site Setup',
            description: 'Configure a new tower site for monitoring',
            icon: 'Building',
            link: '/docs/towers/site-setup',
          },
          {
            title: 'Sensor Integration',
            description: 'Connect environmental and power sensors',
            icon: 'Thermometer',
            link: '/docs/towers/sensors',
          },
          {
            title: 'Alert Configuration',
            description: 'Set up tower-specific alert rules',
            icon: 'Bell',
            link: '/docs/towers/alerts',
          },
          {
            title: 'Reports & Analytics',
            description: 'Tower performance reports and trends',
            icon: 'Chart',
            link: '/docs/towers/reports',
          },
        ],
      },
      {
        _key: 'towers-cta',
        _type: 'landingSectionCTA',
        title: 'Start Monitoring Towers',
        description: 'Set up comprehensive monitoring for your tower infrastructure.',
        buttons: [
          { label: 'View Tower Docs', href: '/docs/towers', variant: 'primary' },
          { label: 'Integration Hub', href: '/integrations', variant: 'secondary' },
        ],
      },
    ],
  },
  'landing-quick-start': {
    title: 'Quick Start',
    sections: [
      {
        _key: 'quickstart-features',
        _type: 'landingSectionFeatures',
        title: 'Getting Started Paths',
        description: 'Choose your path to get up and running quickly',
        columns: 3,
        features: [
          {
            title: 'Platform Overview',
            description: 'Learn the basics of the platform and its capabilities',
            icon: 'Compass',
            color: '#3B82F6',
            link: '/quick-start/platform-overview',
          },
          {
            title: 'Device Integration',
            description: 'Connect your first devices and start monitoring',
            icon: 'Cpu',
            color: '#10B981',
            link: '/quick-start/device-integration',
          },
          {
            title: 'Quick Start Guide',
            description: 'Step-by-step guide for new users',
            icon: 'BookOpen',
            color: '#8B5CF6',
            link: '/quick-start/guide',
          },
        ],
      },
      {
        _key: 'quickstart-content',
        _type: 'landingSectionContentGrid',
        title: 'Essential Resources',
        description: 'Everything you need to get started',
        columns: 2,
        items: [
          {
            title: 'First-Time Login',
            description: 'Access the platform and configure your account',
            icon: 'LogIn',
            link: '/docs/getting-started/first-time-login--access',
          },
          {
            title: 'Organization Setup',
            description: 'Configure your hierarchy and structure',
            icon: 'Building2',
            link: '/docs/getting-started/organization--hierarchy-setup',
          },
          {
            title: 'User Management',
            description: 'Invite team members and assign roles',
            icon: 'Users',
            link: '/docs/getting-started/user-management-setup',
          },
          {
            title: 'Checklist',
            description: 'Complete onboarding checklist',
            icon: 'CheckSquare',
            link: '/docs/getting-started/quick-start-checklist',
          },
        ],
      },
      {
        _key: 'quickstart-cta',
        _type: 'landingSectionCTA',
        title: 'Begin Your Journey',
        description: 'Start using the platform with our comprehensive quick start resources.',
        buttons: [
          { label: 'Start Here', href: '/quick-start/guide', variant: 'primary' },
          { label: 'Watch Videos', href: '/getting-started', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.quick-start-guide': {
    title: 'Quick Start Guide',
    sections: [
      {
        _key: 'guide-steps',
        _type: 'landingSectionSteps',
        title: 'Your Onboarding Journey',
        description: 'Follow these steps to get fully operational',
        phases: [
          {
            phaseNumber: 1,
            title: 'Account Setup',
            description: 'Get access and configure your account',
            steps: [
              { stepNumber: 1, title: 'First Login', description: 'Access the platform with your credentials' },
              { stepNumber: 2, title: 'Profile Setup', description: 'Configure your user profile and preferences' },
              { stepNumber: 3, title: 'Security', description: 'Set up two-factor authentication' },
            ],
          },
          {
            phaseNumber: 2,
            title: 'Organization',
            description: 'Build your monitoring structure',
            steps: [
              { stepNumber: 4, title: 'Create Hierarchy', description: 'Set up regions, clusters, and sites' },
              { stepNumber: 5, title: 'Add Users', description: 'Invite team members and assign roles' },
              { stepNumber: 6, title: 'Configure Permissions', description: 'Set up access controls' },
            ],
          },
          {
            phaseNumber: 3,
            title: 'Integration',
            description: 'Connect your infrastructure',
            steps: [
              { stepNumber: 7, title: 'Add Devices', description: 'Connect sensors and equipment' },
              { stepNumber: 8, title: 'Configure Alerts', description: 'Set up alarm rules' },
              { stepNumber: 9, title: 'Create Dashboards', description: 'Build monitoring views' },
            ],
          },
        ],
      },
      {
        _key: 'guide-features',
        _type: 'landingSectionFeatures',
        title: 'Next Steps',
        description: 'After completing basic setup, explore these features',
        columns: 3,
        features: [
          {
            title: 'Advanced Dashboards',
            description: 'Create custom dashboards for your specific needs',
            icon: 'LayoutDashboard',
            color: '#3B82F6',
          },
          {
            title: 'Alert Rules',
            description: 'Configure sophisticated alert conditions and routing',
            icon: 'Bell',
            color: '#F59E0B',
          },
          {
            title: 'Reports',
            description: 'Generate operational reports and analytics',
            icon: 'FileBarChart',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'guide-cta',
        _type: 'landingSectionCTA',
        title: 'Ready to Go Live?',
        description: 'Complete your setup and start monitoring your infrastructure.',
        buttons: [
          { label: 'View Full Documentation', href: '/docs', variant: 'primary' },
          { label: 'Contact Support', href: '/support', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.internal-releases-sprint-2025-12-b': {
    title: 'Sprint 2025.12-A - Internal Releases',
    sections: [
      {
        _key: 'sprint-features',
        _type: 'landingSectionFeatures',
        title: 'Sprint Highlights',
        description: 'Key deliverables from this sprint',
        columns: 3,
        features: [
          {
            title: 'Dashboard Improvements',
            description: 'Enhanced widget library and performance optimizations',
            icon: 'LayoutDashboard',
            color: '#8B5CF6',
          },
          {
            title: 'API Enhancements',
            description: 'New endpoints and improved response times',
            icon: 'Code',
            color: '#3B82F6',
          },
          {
            title: 'Bug Fixes',
            description: 'Resolved issues and stability improvements',
            icon: 'Check',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'sprint-cta',
        _type: 'landingSectionCTA',
        title: 'View All Internal Releases',
        description: 'Browse the complete release history and upcoming sprints.',
        buttons: [
          { label: 'Release Archive', href: '/internal-releases', variant: 'primary' },
          { label: 'Roadmap', href: '/roadmap', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.internal-releases-sprint-2026-01-a': {
    title: 'Sprint 2026.01-A - Internal Releases',
    sections: [
      {
        _key: 'sprint-features',
        _type: 'landingSectionFeatures',
        title: 'Sprint Highlights',
        description: 'Key deliverables from this sprint',
        columns: 3,
        features: [
          {
            title: 'New Integrations',
            description: 'Additional protocol support and connectors',
            icon: 'Plug',
            color: '#8B5CF6',
          },
          {
            title: 'Mobile Updates',
            description: 'Improved mobile experience and offline support',
            icon: 'Smartphone',
            color: '#3B82F6',
          },
          {
            title: 'Performance',
            description: 'Speed optimizations and reduced latency',
            icon: 'Gauge',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'sprint-cta',
        _type: 'landingSectionCTA',
        title: 'View All Internal Releases',
        description: 'Browse the complete release history and upcoming sprints.',
        buttons: [
          { label: 'Release Archive', href: '/internal-releases', variant: 'primary' },
          { label: 'Roadmap', href: '/roadmap', variant: 'secondary' },
        ],
      },
    ],
  },
  'landingPage.releases-sprint-2025-12-b': {
    title: 'Sprint 2025.12-B Release Notes',
    sections: [
      {
        _key: 'release-features',
        _type: 'landingSectionFeatures',
        title: 'Release Highlights',
        description: 'Key features and improvements in this release',
        columns: 3,
        features: [
          {
            title: 'New Features',
            description: 'New capabilities and functionality added',
            icon: 'Sparkles',
            color: '#8B5CF6',
          },
          {
            title: 'Improvements',
            description: 'Enhancements to existing features',
            icon: 'TrendingUp',
            color: '#3B82F6',
          },
          {
            title: 'Bug Fixes',
            description: 'Issues resolved in this release',
            icon: 'Check',
            color: '#10B981',
          },
        ],
      },
      {
        _key: 'release-cta',
        _type: 'landingSectionCTA',
        title: 'Explore All Releases',
        description: 'View the complete release notes archive and upcoming features.',
        buttons: [
          { label: 'Release Notes', href: '/releases', variant: 'primary' },
          { label: 'Product Roadmap', href: '/roadmap', variant: 'secondary' },
        ],
      },
    ],
  },
};

async function expandPage(pageId, config) {
  console.log(`\nExpanding: ${config.title} (${pageId})`);
  
  const newSections = config.sections;
  
  const mutation = {
    patch: {
      id: pageId,
      set: {
        sections: newSections,
      },
    },
  };
  
  const result = await sanityMutate([mutation]);
  
  if (result.results) {
    console.log(`  ✓ Successfully expanded with ${newSections.length} new sections`);
    return true;
  } else {
    console.log(`  ✗ Failed: ${JSON.stringify(result)}`);
    return false;
  }
}

async function main() {
  console.log('=== Landing Page Expansion Script ===\n');
  console.log(`Processing ${Object.keys(pageSections).length} pages...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [pageId, config] of Object.entries(pageSections)) {
    const success = await expandPage(pageId, config);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Successfully expanded: ${successCount} pages`);
  console.log(`Failed: ${failCount} pages`);
}

main().catch(console.error);
