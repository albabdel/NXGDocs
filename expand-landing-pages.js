const PROJECT_ID = 'fjjuacab';
const DATASET = 'production';
const API_TOKEN = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const SANITY_API_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}`;
const SANITY_MUTATE_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${DATASET}`;

async function sanityQuery(query) {
  const response = await fetch(SANITY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

async function sanityMutate(mutations) {
  const response = await fetch(SANITY_MUTATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  return response.json();
}

const additionalSections = {
  'breakthroughs': [
    {
      _key: 'breakthroughs-features',
      _type: 'landingSectionFeatures',
      title: 'Innovation Highlights',
      description: 'Explore the latest breakthroughs and innovations in our platform',
      columns: 3,
      features: [
        { title: 'AI-Powered Analytics', description: 'Advanced machine learning algorithms for predictive monitoring and anomaly detection', icon: 'Brain', color: '#8B5CF6' },
        { title: 'Real-time Processing', description: 'Lightning-fast data processing with sub-second latency for critical alerts', icon: 'Zap', color: '#F59E0B' },
        { title: 'Edge Computing', description: 'Distributed computing capabilities for local processing and reduced cloud dependency', icon: 'Server', color: '#10B981' },
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
  'integration-hub': [
    {
      _key: 'integration-features',
      _type: 'landingSectionFeatures',
      title: 'Integration Capabilities',
      description: 'Connect with a wide range of devices, protocols, and third-party systems',
      columns: 4,
      features: [
        { title: 'Device Protocols', description: 'Support for SNMP, Modbus, OPC-UA, MQTT, and custom protocols', icon: 'Cpu', color: '#3B82F6' },
        { title: 'API Integrations', description: 'RESTful APIs and webhooks for seamless third-party connections', icon: 'Code', color: '#10B981' },
        { title: 'Data Connectors', description: 'Pre-built connectors for popular monitoring and IoT platforms', icon: 'Plug', color: '#8B5CF6' },
        { title: 'Custom Drivers', description: 'Build custom drivers for proprietary equipment and legacy systems', icon: 'Wrench', color: '#F59E0B' },
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
  'quick-start': [
    {
      _key: 'quickstart-features',
      _type: 'landingSectionFeatures',
      title: 'Getting Started Paths',
      description: 'Choose your path to get up and running quickly',
      columns: 3,
      features: [
        { title: 'Platform Overview', description: 'Learn the basics of the platform and its capabilities', icon: 'Compass', color: '#3B82F6' },
        { title: 'Device Integration', description: 'Connect your first devices and start monitoring', icon: 'Cpu', color: '#10B981' },
        { title: 'Quick Start Guide', description: 'Step-by-step guide for new users', icon: 'BookOpen', color: '#8B5CF6' },
      ],
    },
    {
      _key: 'quickstart-content',
      _type: 'landingSectionContentGrid',
      title: 'Essential Resources',
      description: 'Everything you need to get started',
      columns: 2,
      items: [
        { title: 'First-Time Login', description: 'Access the platform and configure your account', icon: 'LogIn', link: '/docs/getting-started/first-time-login--access' },
        { title: 'Organization Setup', description: 'Configure your hierarchy and structure', icon: 'Building2', link: '/docs/getting-started/organization--hierarchy-setup' },
        { title: 'User Management', description: 'Invite team members and assign roles', icon: 'Users', link: '/docs/getting-started/user-management-setup' },
        { title: 'Checklist', description: 'Complete onboarding checklist', icon: 'CheckSquare', link: '/docs/getting-started/quick-start-checklist' },
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
  'platform-overview': [
    {
      _key: 'platform-features',
      _type: 'landingSectionFeatures',
      title: 'Core Capabilities',
      description: 'Discover the powerful features of our monitoring platform',
      columns: 3,
      features: [
        { title: 'Real-time Monitoring', description: 'Live data visualization with customizable dashboards', icon: 'Activity', color: '#3B82F6' },
        { title: 'Alert Management', description: 'Intelligent alerting with escalation and routing', icon: 'Bell', color: '#F59E0B' },
        { title: 'Historical Analysis', description: 'Trend analysis and historical data reporting', icon: 'TrendingUp', color: '#10B981' },
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
  'releases': [
    {
      _key: 'releases-features',
      _type: 'landingSectionFeatures',
      title: 'Recent Highlights',
      description: 'Key features from our latest releases',
      columns: 3,
      features: [
        { title: 'Enhanced Dashboard', description: 'New dashboard widgets and customization options', icon: 'LayoutDashboard', color: '#8B5CF6' },
        { title: 'Mobile App Update', description: 'Improved mobile experience with offline support', icon: 'Smartphone', color: '#3B82F6' },
        { title: 'API v2', description: 'New API version with expanded capabilities', icon: 'Code', color: '#10B981' },
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
  'roles-admin': [
    {
      _key: 'admin-features',
      _type: 'landingSectionFeatures',
      title: 'Admin Capabilities',
      description: 'Powerful tools for platform administration',
      columns: 4,
      features: [
        { title: 'User Management', description: 'Create users, assign roles, and manage permissions', icon: 'Users', color: '#3B82F6' },
        { title: 'Organization Setup', description: 'Configure hierarchy, regions, and site structure', icon: 'Building2', color: '#10B981' },
        { title: 'System Config', description: 'Global settings, integrations, and security policies', icon: 'Settings', color: '#8B5CF6' },
        { title: 'Audit Logs', description: 'Complete activity tracking and compliance reporting', icon: 'FileText', color: '#F59E0B' },
      ],
    },
    {
      _key: 'admin-content',
      _type: 'landingSectionContentGrid',
      title: 'Admin Guides',
      description: 'Essential documentation for administrators',
      columns: 2,
      items: [
        { title: 'User Management', description: 'Create and manage user accounts and permissions', icon: 'User', link: '/docs/admin/users' },
        { title: 'Role Configuration', description: 'Define roles with granular permissions', icon: 'Shield', link: '/docs/admin/roles' },
        { title: 'Organization Structure', description: 'Set up your monitoring hierarchy', icon: 'Building', link: '/docs/admin/organization' },
        { title: 'Security Settings', description: 'Configure authentication and security policies', icon: 'Lock', link: '/docs/admin/security' },
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
  'roles-installer': [
    {
      _key: 'installer-features',
      _type: 'landingSectionFeatures',
      title: 'Installer Tools',
      description: 'Everything you need for successful installations',
      columns: 3,
      features: [
        { title: 'Site Setup', description: 'Quick site creation and configuration wizards', icon: 'MapPin', color: '#3B82F6' },
        { title: 'Device Provisioning', description: 'Bulk device onboarding and template management', icon: 'Cpu', color: '#10B981' },
        { title: 'Validation Tools', description: 'Automated testing and verification workflows', icon: 'CheckSquare', color: '#8B5CF6' },
      ],
    },
    {
      _key: 'installer-content',
      _type: 'landingSectionContentGrid',
      title: 'Installation Guides',
      description: 'Step-by-step guides for installers',
      columns: 2,
      items: [
        { title: 'Site Setup Guide', description: 'Complete guide to creating and configuring sites', icon: 'Building', link: '/docs/installer/site-setup' },
        { title: 'Device Onboarding', description: 'Add devices using templates or manual configuration', icon: 'Plus', link: '/docs/installer/device-onboarding' },
        { title: 'Commissioning Checklist', description: 'Verify installations meet requirements', icon: 'ClipboardCheck', link: '/docs/installer/commissioning' },
        { title: 'Troubleshooting', description: 'Common issues and solutions for installers', icon: 'Wrench', link: '/docs/installer/troubleshooting' },
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
  'roles-manager': [
    {
      _key: 'manager-features',
      _type: 'landingSectionFeatures',
      title: 'Manager Dashboard',
      description: 'Tools for managing operations and teams',
      columns: 4,
      features: [
        { title: 'Performance Metrics', description: 'Track KPIs and operational performance', icon: 'TrendingUp', color: '#3B82F6' },
        { title: 'Team Oversight', description: 'Monitor team activities and workload distribution', icon: 'Users', color: '#10B981' },
        { title: 'Report Builder', description: 'Create custom reports for stakeholders', icon: 'FileBarChart', color: '#8B5CF6' },
        { title: 'Alert Management', description: 'Configure escalation rules and response protocols', icon: 'Bell', color: '#F59E0B' },
      ],
    },
    {
      _key: 'manager-content',
      _type: 'landingSectionContentGrid',
      title: 'Manager Resources',
      description: 'Documentation for operational managers',
      columns: 2,
      items: [
        { title: 'Dashboard Guide', description: 'Configure manager dashboards and views', icon: 'LayoutDashboard', link: '/docs/manager/dashboards' },
        { title: 'Reporting', description: 'Create and schedule operational reports', icon: 'FileText', link: '/docs/manager/reporting' },
        { title: 'Team Management', description: 'Manage team assignments and schedules', icon: 'Users', link: '/docs/manager/team' },
        { title: 'Best Practices', description: 'Operational excellence guidelines', icon: 'Lightbulb', link: '/docs/manager/best-practices' },
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
  'roles-operator': [
    {
      _key: 'operator-features',
      _type: 'landingSectionFeatures',
      title: 'Operator Tools',
      description: 'Essential tools for daily monitoring operations',
      columns: 4,
      features: [
        { title: 'Live Monitoring', description: 'Real-time dashboards with live data streams', icon: 'Activity', color: '#3B82F6' },
        { title: 'Alert Handling', description: 'Acknowledge, investigate, and resolve alerts', icon: 'BellRing', color: '#F59E0B' },
        { title: 'Device Status', description: 'View device health and connectivity status', icon: 'Cpu', color: '#10B981' },
        { title: 'Event Log', description: 'Complete history of events and actions taken', icon: 'History', color: '#8B5CF6' },
      ],
    },
    {
      _key: 'operator-content',
      _type: 'landingSectionContentGrid',
      title: 'Operator Guides',
      description: 'Learn how to use the platform effectively',
      columns: 2,
      items: [
        { title: 'Monitoring Basics', description: 'Introduction to real-time monitoring', icon: 'Eye', link: '/docs/operator/monitoring' },
        { title: 'Alert Response', description: 'How to handle and resolve alerts', icon: 'AlertTriangle', link: '/docs/operator/alerts' },
        { title: 'Dashboard Navigation', description: 'Find and use the information you need', icon: 'Compass', link: '/docs/operator/dashboards' },
        { title: 'Shift Handover', description: 'Best practices for shift transitions', icon: 'Repeat', link: '/docs/operator/handover' },
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
  'towers': [
    {
      _key: 'towers-features',
      _type: 'landingSectionFeatures',
      title: 'Tower Monitoring',
      description: 'Comprehensive monitoring for telecommunications towers',
      columns: 4,
      features: [
        { title: 'Site Monitoring', description: 'Environmental sensors, power systems, and equipment status', icon: 'RadioTower', color: '#3B82F6' },
        { title: 'Power Management', description: 'Generator, UPS, and solar panel monitoring', icon: 'Battery', color: '#10B981' },
        { title: 'Security Systems', description: 'Access control, cameras, and intrusion detection', icon: 'Shield', color: '#8B5CF6' },
        { title: 'Network Equipment', description: 'RAN, backhaul, and transmission monitoring', icon: 'Network', color: '#F59E0B' },
      ],
    },
    {
      _key: 'towers-content',
      _type: 'landingSectionContentGrid',
      title: 'Tower Resources',
      description: 'Documentation and guides for tower monitoring',
      columns: 2,
      items: [
        { title: 'Tower Site Setup', description: 'Configure a new tower site for monitoring', icon: 'Building', link: '/docs/towers/site-setup' },
        { title: 'Sensor Integration', description: 'Connect environmental and power sensors', icon: 'Thermometer', link: '/docs/towers/sensors' },
        { title: 'Alert Configuration', description: 'Set up tower-specific alert rules', icon: 'Bell', link: '/docs/towers/alerts' },
        { title: 'Reports & Analytics', description: 'Tower performance reports and trends', icon: 'Chart', link: '/docs/towers/reports' },
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
  'internal-releases': [
    {
      _key: 'internal-features',
      _type: 'landingSectionFeatures',
      title: 'Release Categories',
      description: 'Track our internal development progress and upcoming features',
      columns: 3,
      features: [
        { title: 'Feature Releases', description: 'Major new capabilities and enhancements', icon: 'Sparkles', color: '#8B5CF6' },
        { title: 'Bug Fixes', description: 'Resolved issues and stability improvements', icon: 'Bug', color: '#10B981' },
        { title: 'Performance Updates', description: 'Speed and efficiency optimizations', icon: 'Gauge', color: '#3B82F6' },
      ],
    },
    {
      _key: 'internal-cta',
      _type: 'landingSectionCTA',
      title: 'View Latest Releases',
      description: 'Stay up to date with the newest features and improvements.',
      buttons: [
        { label: 'Current Sprint', href: '/internal-releases/current', variant: 'primary' },
        { label: 'Release History', href: '/internal-releases/archive', variant: 'secondary' },
      ],
    },
  ],
  'sprint-2025-12-b': [
    {
      _key: 'sprint-features',
      _type: 'landingSectionFeatures',
      title: 'Sprint Highlights',
      description: 'Key deliverables from this sprint',
      columns: 3,
      features: [
        { title: 'Dashboard Improvements', description: 'Enhanced widget library and performance optimizations', icon: 'LayoutDashboard', color: '#8B5CF6' },
        { title: 'API Enhancements', description: 'New endpoints and improved response times', icon: 'Code', color: '#3B82F6' },
        { title: 'Bug Fixes', description: 'Resolved issues and stability improvements', icon: 'Check', color: '#10B981' },
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
  'sprint-2026-01-a': [
    {
      _key: 'sprint-features',
      _type: 'landingSectionFeatures',
      title: 'Sprint Highlights',
      description: 'Key deliverables from this sprint',
      columns: 3,
      features: [
        { title: 'New Integrations', description: 'Additional protocol support and connectors', icon: 'Plug', color: '#8B5CF6' },
        { title: 'Mobile Updates', description: 'Improved mobile experience and offline support', icon: 'Smartphone', color: '#3B82F6' },
        { title: 'Performance', description: 'Speed optimizations and reduced latency', icon: 'Gauge', color: '#10B981' },
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
  'guide': [
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
        { title: 'Advanced Dashboards', description: 'Create custom dashboards for your specific needs', icon: 'LayoutDashboard', color: '#3B82F6' },
        { title: 'Alert Rules', description: 'Configure sophisticated alert conditions and routing', icon: 'Bell', color: '#F59E0B' },
        { title: 'Reports', description: 'Generate operational reports and analytics', icon: 'FileBarChart', color: '#10B981' },
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
};

function getSlugKey(slug) {
  if (!slug) return null;
  const slugStr = slug.current || slug;
  const parts = slugStr.split('/');
  return parts[parts.length - 1] || parts[0];
}

async function main() {
  console.log('=== Landing Page Expansion Script ===\n');
  
  const query = `*[_type == "landingPage"]{
    _id,
    title,
    slug,
    sections,
    "sectionCount": count(sections)
  }`;
  
  console.log('Querying Sanity for landing pages...\n');
  const result = await sanityQuery(query);
  
  if (!result.result) {
    console.error('Error querying Sanity:', result);
    return;
  }
  
  const pages = result.result;
  const pagesNeedingExpansion = pages.filter(p => p.sectionCount <= 2);
  
  console.log(`Found ${pages.length} total landing pages`);
  console.log(`Pages with 1-2 sections: ${pagesNeedingExpansion.length}\n`);
  
  if (pagesNeedingExpansion.length === 0) {
    console.log('No pages need expansion.');
    return;
  }
  
  console.log('Pages needing expansion:');
  pagesNeedingExpansion.forEach(p => {
    console.log(`  - ${p.title} (${p.slug?.current || 'no slug'}): ${p.sectionCount} sections`);
  });
  
  console.log('\n---\n');
  
  let successCount = 0;
  let failCount = 0;
  const expandedPages = [];
  
  for (const page of pagesNeedingExpansion) {
    const slugKey = getSlugKey(page.slug);
    const newSections = additionalSections[slugKey];
    
    if (!newSections) {
      console.log(`Skipping ${page.title} - no predefined sections for slug: ${slugKey}`);
      continue;
    }
    
    console.log(`\nExpanding: ${page.title} (${page._id})`);
    console.log(`  Current sections: ${page.sectionCount}`);
    console.log(`  Adding ${newSections.length} new sections`);
    
    const existingSections = page.sections || [];
    const mergedSections = [...existingSections, ...newSections];
    
    const mutation = {
      patch: {
        id: page._id,
        set: {
          sections: mergedSections,
        },
      },
    };
    
    const mutationResult = await sanityMutate([mutation]);
    
    if (mutationResult.results || mutationResult.transactionId) {
      console.log(`  ✓ Successfully expanded to ${mergedSections.length} sections`);
      successCount++;
      expandedPages.push({
        title: page.title,
        slug: page.slug?.current,
        fromSections: page.sectionCount,
        toSections: mergedSections.length,
      });
    } else {
      console.log(`  ✗ Failed: ${JSON.stringify(mutationResult)}`);
      failCount++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Successfully expanded: ${successCount} pages`);
  console.log(`Failed: ${failCount} pages`);
  
  if (expandedPages.length > 0) {
    console.log('\nExpanded Pages:');
    expandedPages.forEach(p => {
      console.log(`  ✓ ${p.title} (${p.slug}): ${p.fromSections} → ${p.toSections} sections`);
    });
  }
}

main().catch(console.error);
