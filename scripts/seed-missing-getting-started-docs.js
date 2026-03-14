#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const today = new Date().toISOString().slice(0, 10);

function createBlock(key, style, text, listItem = null, level = null) {
  const block = {
    _type: 'block',
    _key: key,
    style: style,
    children: [
      {
        _type: 'span',
        _key: `${key}-span`,
        text: text,
        marks: []
      }
    ],
    markDefs: []
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return block;
}

function createTextBlocks(prefix, paragraphs) {
  return paragraphs.map((p, i) => createBlock(`${prefix}-${i}`, 'normal', p));
}

const docs = [
  {
    _id: 'doc-getting-started-index',
    _type: 'doc',
    title: 'Getting Started Overview',
    slug: { _type: 'slug', current: 'getting-started/index' },
    description: 'Your comprehensive guide to getting started with GCXONE - from first login to full operational readiness.',
    targetAudience: ['operator', 'admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('gsi-h1', 'h2', 'Welcome to GCXONE'),
      createBlock('gsi-p1', 'normal', 'GCXONE is the next-generation monitoring platform designed for critical infrastructure management. This guide will help you get up and running quickly, from your first login to full operational readiness.'),
      createBlock('gsi-h2', 'h2', 'What You Will Learn'),
      createBlock('gsi-li1', 'normal', 'How to access and configure your account securely', 'bullet', 1),
      createBlock('gsi-li2', 'normal', 'Network and port requirements for platform connectivity', 'bullet', 1),
      createBlock('gsi-li3', 'normal', 'Best practices for password management and security', 'bullet', 1),
      createBlock('gsi-li4', 'normal', 'Setting up your organization hierarchy', 'bullet', 1),
      createBlock('gsi-li5', 'normal', 'Managing users and permissions', 'bullet', 1),
      createBlock('gsi-li6', 'normal', 'Accessing video tutorials for guided learning', 'bullet', 1),
      createBlock('gsi-h3', 'h2', 'Prerequisites'),
      createBlock('gsi-p2', 'normal', 'Before you begin, ensure you have received your account credentials from your system administrator. You will need a valid email address and temporary password to complete the first-time login process.'),
      createBlock('gsi-h4', 'h2', 'Getting Help'),
      createBlock('gsi-p3', 'normal', 'If you encounter any issues during setup, contact your system administrator or reach out to our support team through the help desk portal. Video tutorials are also available to guide you through key processes.'),
    ]
  },
  {
    _id: 'doc-first-time-login',
    _type: 'doc',
    title: 'First-Time Login Guide',
    slug: { _type: 'slug', current: 'getting-started/first-time-login' },
    description: 'Step-by-step instructions for accessing GCXONE for the first time, including account activation and initial security setup.',
    targetAudience: ['operator', 'admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('ftl-h1', 'h2', 'Accessing the Platform'),
      createBlock('ftl-p1', 'normal', 'To access GCXONE for the first time, you will need the platform URL provided by your administrator, your registered email address, and the temporary password sent to your email.'),
      createBlock('ftl-h2', 'h2', 'Step 1: Navigate to the Login Page'),
      createBlock('ftl-p2', 'normal', 'Open your web browser and navigate to the GCXONE platform URL. The login page will display the GCXONE branding with fields for email and password.'),
      createBlock('ftl-h3', 'h2', 'Step 2: Enter Your Credentials'),
      createBlock('ftl-p3', 'normal', 'Enter your registered email address in the email field. Enter the temporary password provided in your welcome email. Click the "Sign In" button to proceed.'),
      createBlock('ftl-h4', 'h2', 'Step 3: Change Your Password'),
      createBlock('ftl-p4', 'normal', 'On first login, you will be prompted to change your temporary password. Create a strong password following the security requirements displayed on screen. Confirm your new password and submit.'),
      createBlock('ftl-h5', 'h2', 'Step 4: Configure Two-Factor Authentication'),
      createBlock('ftl-p5', 'normal', 'For enhanced security, enable two-factor authentication (2FA). You can use an authenticator app or receive codes via SMS. Follow the on-screen instructions to complete setup.'),
      createBlock('ftl-h6', 'h2', 'Step 5: Review Your Profile'),
      createBlock('ftl-p6', 'normal', 'After completing security setup, review your user profile. Verify your contact information and notification preferences are correct. You are now ready to explore the platform.'),
      createBlock('ftl-h7', 'h2', 'Troubleshooting'),
      createBlock('ftl-li1', 'normal', 'If you did not receive the welcome email, check your spam folder', 'bullet', 1),
      createBlock('ftl-li2', 'normal', 'If your temporary password has expired, contact your administrator for a new one', 'bullet', 1),
      createBlock('ftl-li3', 'normal', 'If you are locked out after failed attempts, wait 15 minutes or contact support', 'bullet', 1),
    ]
  },
  {
    _id: 'doc-required-ports',
    _type: 'doc',
    title: 'Required Ports & Network Configuration',
    slug: { _type: 'slug', current: 'getting-started/required-ports' },
    description: 'Technical reference for network ports and connectivity requirements for GCXONE platform access and device communication.',
    targetAudience: ['admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('rp-h1', 'h2', 'Network Requirements Overview'),
      createBlock('rp-p1', 'normal', 'GCXONE requires specific network configurations to function properly. This document outlines the ports and protocols needed for platform access, device communication, and third-party integrations.'),
      createBlock('rp-h2', 'h2', 'Web Platform Access'),
      createBlock('rp-li1', 'normal', 'HTTPS (443) - Required for secure web access to the platform', 'bullet', 1),
      createBlock('rp-li2', 'normal', 'HTTP (80) - Redirects to HTTPS, optional but recommended', 'bullet', 1),
      createBlock('rp-li3', 'normal', 'WebSocket (443) - Used for real-time updates and notifications', 'bullet', 1),
      createBlock('rp-h3', 'h2', 'Device Communication'),
      createBlock('rp-li4', 'normal', 'SNMP (161/UDP) - For SNMP-enabled monitoring devices', 'bullet', 1),
      createBlock('rp-li5', 'normal', 'SNMP Trap (162/UDP) - For receiving SNMP trap alerts', 'bullet', 1),
      createBlock('rp-li6', 'normal', 'Modbus TCP (502) - For Modbus-enabled equipment', 'bullet', 1),
      createBlock('rp-li7', 'normal', 'MQTT (1883/8883) - For IoT device connectivity', 'bullet', 1),
      createBlock('rp-h4', 'h2', 'API and Integration'),
      createBlock('rp-li8', 'normal', 'REST API (443) - HTTPS endpoint for API calls', 'bullet', 1),
      createBlock('rp-li9', 'normal', 'Webhooks (443) - Outbound webhook notifications', 'bullet', 1),
      createBlock('rp-h5', 'h2', 'Firewall Configuration'),
      createBlock('rp-p2', 'normal', 'Configure your firewall to allow outbound connections to the GCXONE platform on ports 443 and 80. For on-premises deployments, ensure the necessary inbound ports are open for device communication.'),
      createBlock('rp-h6', 'h2', 'Network Bandwidth'),
      createBlock('rp-p3', 'normal', 'Minimum recommended bandwidth is 10 Mbps for standard operations. Video streaming and large data exports may require additional bandwidth allocation.'),
    ]
  },
  {
    _id: 'doc-password-management',
    _type: 'doc',
    title: 'Password Management & Security',
    slug: { _type: 'slug', current: 'getting-started/password-management' },
    description: 'Best practices for password security, account protection, and managing credentials in GCXONE.',
    targetAudience: ['operator', 'admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('pm-h1', 'h2', 'Password Requirements'),
      createBlock('pm-p1', 'normal', 'GCXONE enforces strong password policies to protect your account. All passwords must meet the following minimum requirements:'),
      createBlock('pm-li1', 'normal', 'Minimum 12 characters in length', 'bullet', 1),
      createBlock('pm-li2', 'normal', 'At least one uppercase letter (A-Z)', 'bullet', 1),
      createBlock('pm-li3', 'normal', 'At least one lowercase letter (a-z)', 'bullet', 1),
      createBlock('pm-li4', 'normal', 'At least one number (0-9)', 'bullet', 1),
      createBlock('pm-li5', 'normal', 'At least one special character (!@#$%^&*)', 'bullet', 1),
      createBlock('pm-h2', 'h2', 'Changing Your Password'),
      createBlock('pm-p2', 'normal', 'To change your password, navigate to your user profile and select "Change Password." Enter your current password, then enter and confirm your new password. Password changes take effect immediately.'),
      createBlock('pm-h3', 'h2', 'Password Expiration'),
      createBlock('pm-p3', 'normal', 'Depending on your organization settings, passwords may expire after 90 days. You will receive a notification 14 days before expiration. Update your password before it expires to avoid account lockout.'),
      createBlock('pm-h4', 'h2', 'Two-Factor Authentication'),
      createBlock('pm-p4', 'normal', 'Enable two-factor authentication (2FA) for an additional layer of security. GCXONE supports authenticator apps (Google Authenticator, Microsoft Authenticator) and SMS verification.'),
      createBlock('pm-h5', 'h2', 'Password Recovery'),
      createBlock('pm-p5', 'normal', 'If you forget your password, use the "Forgot Password" link on the login page. Enter your registered email address to receive a password reset link. The link expires after 24 hours.'),
      createBlock('pm-h6', 'h2', 'Security Best Practices'),
      createBlock('pm-li6', 'normal', 'Never share your password with others', 'bullet', 1),
      createBlock('pm-li7', 'normal', 'Use a unique password for GCXONE', 'bullet', 1),
      createBlock('pm-li8', 'normal', 'Consider using a password manager', 'bullet', 1),
      createBlock('pm-li9', 'normal', 'Report suspicious activity immediately', 'bullet', 1),
    ]
  },
  {
    _id: 'doc-organization-setup',
    _type: 'doc',
    title: 'Organization & Hierarchy Setup',
    slug: { _type: 'slug', current: 'getting-started/organization-setup' },
    description: 'Guide to configuring your organizational structure, including regions, clusters, zones, and sites in GCXONE.',
    targetAudience: ['admin', 'installer'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('os-h1', 'h2', 'Understanding the Hierarchy'),
      createBlock('os-p1', 'normal', 'GCXONE uses a hierarchical structure to organize your monitoring infrastructure. The hierarchy consists of Organization, Regions, Clusters, Zones, and Sites. This structure enables efficient management and reporting.'),
      createBlock('os-h2', 'h2', 'Organization Level'),
      createBlock('os-p2', 'normal', 'The organization is the top level of your hierarchy. It represents your company or business unit. There is typically one organization per GCXONE deployment. Configure organization settings in the Admin panel.'),
      createBlock('os-h3', 'h2', 'Regions'),
      createBlock('os-p3', 'normal', 'Regions represent geographic or operational divisions within your organization. Examples include North America, Europe, or East Coast. Create regions to group your monitoring infrastructure by location.'),
      createBlock('os-h4', 'h2', 'Clusters'),
      createBlock('os-p4', 'normal', 'Clusters group sites within a region. A cluster might represent a city, district, or operational unit. Clusters help organize sites for reporting and management purposes.'),
      createBlock('os-h5', 'h2', 'Zones'),
      createBlock('os-p5', 'normal', 'Zones further subdivide clusters into logical groupings. Use zones to categorize sites by type, customer, or operational criteria. Zones provide additional granularity for filtering and reporting.'),
      createBlock('os-h6', 'h2', 'Sites'),
      createBlock('os-p6', 'normal', 'Sites are the monitoring locations where devices are installed. Each site contains the equipment being monitored. Sites can have associated addresses, contact information, and operational notes.'),
      createBlock('os-h7', 'h2', 'Creating the Hierarchy'),
      createBlock('os-li1', 'normal', 'Navigate to Admin > Organization Management', 'number', 1),
      createBlock('os-li2', 'normal', 'Create regions as needed for your operations', 'number', 2),
      createBlock('os-li3', 'normal', 'Add clusters within each region', 'number', 3),
      createBlock('os-li4', 'normal', 'Define zones within clusters', 'number', 4),
      createBlock('os-li5', 'normal', 'Add sites to the appropriate zone', 'number', 5),
    ]
  },
  {
    _id: 'doc-user-management',
    _type: 'doc',
    title: 'User Management Guide',
    slug: { _type: 'slug', current: 'getting-started/user-management' },
    description: 'Comprehensive guide to creating users, assigning roles, and managing permissions in GCXONE.',
    targetAudience: ['admin'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('um-h1', 'h2', 'User Management Overview'),
      createBlock('um-p1', 'normal', 'GCXONE provides robust user management capabilities to control access and permissions. Administrators can create users, define roles, and assign permissions at various levels of the hierarchy.'),
      createBlock('um-h2', 'h2', 'User Roles'),
      createBlock('um-p2', 'normal', 'GCXONE includes predefined roles with appropriate permission sets:'),
      createBlock('um-li1', 'normal', 'Administrator - Full access to all features and settings', 'bullet', 1),
      createBlock('um-li2', 'normal', 'Operator - Access to monitoring, alarms, and dashboards', 'bullet', 1),
      createBlock('um-li3', 'normal', 'Installer - Access to device configuration and site setup', 'bullet', 1),
      createBlock('um-li4', 'normal', 'Integrator - Access to API and integration features', 'bullet', 1),
      createBlock('um-li5', 'normal', 'Viewer - Read-only access to dashboards and reports', 'bullet', 1),
      createBlock('um-h3', 'h2', 'Creating Users'),
      createBlock('um-li6', 'normal', 'Navigate to Admin > User Management', 'number', 1),
      createBlock('um-li7', 'normal', 'Click "Add User" to create a new user', 'number', 2),
      createBlock('um-li8', 'normal', 'Enter the users name and email address', 'number', 3),
      createBlock('um-li9', 'normal', 'Select the appropriate role for the user', 'number', 4),
      createBlock('um-li10', 'normal', 'Assign the user to specific regions or sites', 'number', 5),
      createBlock('um-li11', 'normal', 'Click "Send Invitation" to email the user', 'number', 6),
      createBlock('um-h4', 'h2', 'Permission Scopes'),
      createBlock('um-p3', 'normal', 'Permissions can be scoped to different levels of the hierarchy. Users may have full access at one region but limited access at another. This enables flexible access control for distributed teams.'),
      createBlock('um-h5', 'h2', 'Managing Existing Users'),
      createBlock('um-p4', 'normal', 'Edit user profiles, change roles, or modify permissions from the User Management screen. You can also disable users temporarily or remove them permanently from the system.'),
      createBlock('um-h6', 'h2', 'Audit Trail'),
      createBlock('um-p5', 'normal', 'All user management actions are logged in the audit trail. Review changes to user roles, permissions, and access levels from the Admin > Audit Log section.'),
    ]
  },
  {
    _id: 'doc-video-tutorials',
    _type: 'doc',
    title: 'Video Tutorials Collection',
    slug: { _type: 'slug', current: 'getting-started/video-tutorials' },
    description: 'Curated collection of video tutorials covering platform basics, advanced features, and best practices.',
    targetAudience: ['operator', 'admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('vt-h1', 'h2', 'Video Tutorial Library'),
      createBlock('vt-p1', 'normal', 'GCXONE provides comprehensive video tutorials to help you learn the platform. These videos cover everything from basic navigation to advanced configuration and troubleshooting.'),
      createBlock('vt-h2', 'h2', 'Getting Started Videos'),
      createBlock('vt-li1', 'normal', 'Platform Overview - Introduction to GCXONE capabilities', 'bullet', 1),
      createBlock('vt-li2', 'normal', 'First-Time Login - Complete walkthrough of initial setup', 'bullet', 1),
      createBlock('vt-li3', 'normal', 'Navigation Basics - Tour of the main interface', 'bullet', 1),
      createBlock('vt-li4', 'normal', 'Dashboard Overview - Understanding your home screen', 'bullet', 1),
      createBlock('vt-h3', 'h2', 'Configuration Videos'),
      createBlock('vt-li5', 'normal', 'Organization Setup - Creating your hierarchy', 'bullet', 1),
      createBlock('vt-li6', 'normal', 'User Management - Adding and managing users', 'bullet', 1),
      createBlock('vt-li7', 'normal', 'Device Configuration - Setting up monitoring devices', 'bullet', 1),
      createBlock('vt-li8', 'normal', 'Alarm Configuration - Setting alert rules', 'bullet', 1),
      createBlock('vt-h4', 'h2', 'Advanced Topics'),
      createBlock('vt-li9', 'normal', 'API Integration - Connecting external systems', 'bullet', 1),
      createBlock('vt-li10', 'normal', 'Custom Dashboards - Building monitoring views', 'bullet', 1),
      createBlock('vt-li11', 'normal', 'Report Generation - Creating custom reports', 'bullet', 1),
      createBlock('vt-li12', 'normal', 'Troubleshooting - Common issues and solutions', 'bullet', 1),
      createBlock('vt-h5', 'h2', 'Accessing Videos'),
      createBlock('vt-p2', 'normal', 'Videos are accessible from the Help menu in the platform or on the Getting Started landing page. Most videos include closed captions and can be viewed at different playback speeds.'),
      createBlock('vt-h6', 'h2', 'Recommended Learning Path'),
      createBlock('vt-p3', 'normal', 'For new users, we recommend starting with the Platform Overview, then progressing through First-Time Login, Navigation Basics, and Dashboard Overview before exploring configuration topics.'),
    ]
  }
];

async function seedMissingDocs() {
  console.log('Seeding missing Getting Started documentation pages to Sanity...\n');
  
  let created = 0;
  let updated = 0;
  
  for (const doc of docs) {
    try {
      const existing = await client.fetch(`*[_id == $id][0]`, { id: doc._id });
      
      if (existing) {
        console.log(`Updating: ${doc.title} (${doc.slug.current})`);
        await client.createOrReplace(doc);
        updated++;
      } else {
        console.log(`Creating: ${doc.title} (${doc.slug.current})`);
        await client.createIfNotExists(doc);
        created++;
      }
    } catch (err) {
      console.error(`Error processing ${doc._id}:`, err.message);
    }
  }
  
  console.log('\nSeeding complete!');
  console.log(`  Created: ${created} documents`);
  console.log(`  Updated: ${updated} documents`);
  console.log('\nDocuments created:');
  docs.forEach(d => console.log(`  - ${d.slug.current}: ${d.title}`));
}

seedMissingDocs().catch(console.error);
