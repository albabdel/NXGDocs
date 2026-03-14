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

const docs = [
  {
    _id: 'doc-getting-started-required-ports',
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
      createBlock('rp-h7', 'h2', 'DNS Requirements'),
      createBlock('rp-p4', 'normal', 'Ensure your DNS servers can resolve the GCXONE platform hostname. If using internal DNS, add the appropriate A records or CNAME entries for your deployment.'),
      createBlock('rp-h8', 'h2', 'Proxy Configuration'),
      createBlock('rp-p5', 'normal', 'If your organization uses a proxy server, configure the proxy settings in your browser or system preferences. WebSocket connections may require special proxy configuration to function correctly.'),
    ]
  },
  {
    _id: 'doc-browser-troubleshooting',
    _type: 'doc',
    title: 'Browser Troubleshooting',
    slug: { _type: 'slug', current: 'getting-started/troubleshooting/browser-errors' },
    description: 'Common browser-related issues and solutions when accessing the GCXONE platform.',
    targetAudience: ['operator', 'admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('bt-h1', 'h2', 'Browser Compatibility'),
      createBlock('bt-p1', 'normal', 'GCXONE supports modern web browsers for optimal performance. We recommend using the latest versions of Chrome, Firefox, Edge, or Safari for the best experience.'),
      createBlock('bt-h2', 'h2', 'Supported Browsers'),
      createBlock('bt-li1', 'normal', 'Google Chrome 90+ (recommended)', 'bullet', 1),
      createBlock('bt-li2', 'normal', 'Mozilla Firefox 88+', 'bullet', 1),
      createBlock('bt-li3', 'normal', 'Microsoft Edge 90+', 'bullet', 1),
      createBlock('bt-li4', 'normal', 'Safari 14+', 'bullet', 1),
      createBlock('bt-h3', 'h2', 'Common Issues and Solutions'),
      createBlock('bt-h4', 'h3', 'Page Not Loading'),
      createBlock('bt-li5', 'normal', 'Clear your browser cache and cookies', 'bullet', 1),
      createBlock('bt-li6', 'normal', 'Disable browser extensions temporarily', 'bullet', 1),
      createBlock('bt-li7', 'normal', 'Try an incognito or private browsing window', 'bullet', 1),
      createBlock('bt-li8', 'normal', 'Check your network connection', 'bullet', 1),
      createBlock('bt-h5', 'h3', 'Login Issues'),
      createBlock('bt-li9', 'normal', 'Ensure JavaScript is enabled', 'bullet', 1),
      createBlock('bt-li10', 'normal', 'Check if cookies are being blocked', 'bullet', 1),
      createBlock('bt-li11', 'normal', 'Verify your credentials are correct', 'bullet', 1),
      createBlock('bt-li12', 'normal', 'Try resetting your password', 'bullet', 1),
      createBlock('bt-h6', 'h3', 'Video Playback Problems'),
      createBlock('bt-li13', 'normal', 'Check your internet speed (minimum 5 Mbps recommended)', 'bullet', 1),
      createBlock('bt-li14', 'normal', 'Disable hardware acceleration in browser settings', 'bullet', 1),
      createBlock('bt-li15', 'normal', 'Update your graphics drivers', 'bullet', 1),
      createBlock('bt-li16', 'normal', 'Try a different browser', 'bullet', 1),
      createBlock('bt-h7', 'h2', 'Console Errors'),
      createBlock('bt-p2', 'normal', 'If you encounter JavaScript errors, open the browser developer console (F12) to view detailed error messages. These can help identify the root cause of issues.'),
      createBlock('bt-h8', 'h3', 'Common Console Errors'),
      createBlock('bt-li17', 'normal', 'CORS errors - Contact your administrator about proxy settings', 'bullet', 1),
      createBlock('bt-li18', 'normal', 'WebSocket connection failed - Check firewall settings for port 443', 'bullet', 1),
      createBlock('bt-li19', 'normal', 'Mixed content warnings - Ensure HTTPS is used throughout', 'bullet', 1),
      createBlock('bt-h9', 'h2', 'Performance Optimization'),
      createBlock('bt-li20', 'normal', 'Close unused browser tabs to free memory', 'bullet', 1),
      createBlock('bt-li21', 'normal', 'Disable unnecessary browser extensions', 'bullet', 1),
      createBlock('bt-li22', 'normal', 'Ensure your browser is updated to the latest version', 'bullet', 1),
      createBlock('bt-li23', 'normal', 'Consider increasing browser cache size', 'bullet', 1),
    ]
  },
  {
    _id: 'doc-alarm-management-index',
    _type: 'doc',
    title: 'Alarm Management Overview',
    slug: { _type: 'slug', current: 'alarm-management/index' },
    description: 'Introduction to the GCXONE alarm management system, including alarm types, priorities, and workflows.',
    targetAudience: ['operator', 'admin', 'installer'],
    status: 'published',
    lastUpdated: today,
    category: 'alarm-management',
    body: [
      createBlock('am-h1', 'h2', 'Understanding Alarms in GCXONE'),
      createBlock('am-p1', 'normal', 'The GCXONE alarm management system provides real-time monitoring and alerting for your critical infrastructure. Alarms are generated when monitored values exceed defined thresholds or when device status changes occur.'),
      createBlock('am-h2', 'h2', 'Alarm Types'),
      createBlock('am-li1', 'normal', 'Critical - Immediate attention required, potential system failure', 'bullet', 1),
      createBlock('am-li2', 'normal', 'Major - Significant issue requiring prompt attention', 'bullet', 1),
      createBlock('am-li3', 'normal', 'Minor - Non-critical issue, scheduled maintenance may apply', 'bullet', 1),
      createBlock('am-li4', 'normal', 'Warning - Early indication of potential issues', 'bullet', 1),
      createBlock('am-li5', 'normal', 'Informational - Status updates and notifications', 'bullet', 1),
      createBlock('am-h3', 'h2', 'Alarm Lifecycle'),
      createBlock('am-p2', 'normal', 'Each alarm follows a defined lifecycle from generation to resolution. Understanding this lifecycle helps you manage alarms effectively.'),
      createBlock('am-li6', 'normal', 'Active - Alarm is currently active and requires attention', 'bullet', 1),
      createBlock('am-li7', 'normal', 'Acknowledged - Operator has acknowledged the alarm', 'bullet', 1),
      createBlock('am-li8', 'normal', 'In Progress - Work is being done to resolve the alarm', 'bullet', 1),
      createBlock('am-li9', 'normal', 'Resolved - The condition causing the alarm has been corrected', 'bullet', 1),
      createBlock('am-li10', 'normal', 'Cleared - Alarm has been removed from the active list', 'bullet', 1),
      createBlock('am-h4', 'h2', 'Alarm Dashboard'),
      createBlock('am-p3', 'normal', 'The alarm dashboard provides a centralized view of all active alarms. Use filters to focus on specific priorities, regions, or alarm types. The dashboard updates in real-time as alarm states change.'),
      createBlock('am-h5', 'h2', 'Notification Methods'),
      createBlock('am-li11', 'normal', 'In-app notifications - Real-time alerts within the platform', 'bullet', 1),
      createBlock('am-li12', 'normal', 'Email notifications - Configurable based on priority and user preferences', 'bullet', 1),
      createBlock('am-li13', 'normal', 'SMS notifications - Critical alarms can trigger text messages', 'bullet', 1),
      createBlock('am-li14', 'normal', 'Voice calls - For highest priority alarms requiring immediate response', 'bullet', 1),
      createBlock('am-li15', 'normal', 'Webhooks - Integration with external systems and services', 'bullet', 1),
      createBlock('am-h6', 'h2', 'Alarm Actions'),
      createBlock('am-p4', 'normal', 'When responding to alarms, operators can take various actions including acknowledgment, adding notes, assigning to team members, escalating, and initiating remote procedures.'),
      createBlock('am-h7', 'h2', 'Reporting and Analytics'),
      createBlock('am-p5', 'normal', 'GCXONE provides comprehensive alarm reporting including historical trends, response time metrics, and MTTR (Mean Time To Resolution) analysis. Use these reports to identify patterns and improve operational efficiency.'),
    ]
  },
  {
    _id: 'doc-alarm-test-mode',
    _type: 'doc',
    title: 'Test Mode Guide',
    slug: { _type: 'slug', current: 'alarm-management/test-mode' },
    description: 'How to use test mode for alarm simulation, training, and system verification without affecting production alerts.',
    targetAudience: ['admin', 'installer'],
    status: 'published',
    lastUpdated: today,
    category: 'alarm-management',
    body: [
      createBlock('tm-h1', 'h2', 'What is Test Mode?'),
      createBlock('tm-p1', 'normal', 'Test mode allows administrators and installers to simulate alarms and verify system configurations without triggering real notifications. This is essential for training, system testing, and commissioning new equipment.'),
      createBlock('tm-h2', 'h2', 'Enabling Test Mode'),
      createBlock('tm-li1', 'normal', 'Navigate to Admin > System Settings > Test Mode', 'number', 1),
      createBlock('tm-li2', 'normal', 'Toggle the Test Mode switch to enabled', 'number', 2),
      createBlock('tm-li3', 'normal', 'Select the scope (all sites, specific regions, or individual sites)', 'number', 3),
      createBlock('tm-li4', 'normal', 'Set an optional automatic expiration time', 'number', 4),
      createBlock('tm-li5', 'normal', 'Click Apply to activate test mode', 'number', 5),
      createBlock('tm-h3', 'h2', 'Test Mode Behavior'),
      createBlock('tm-p2', 'normal', 'When test mode is active, alarms generated within the selected scope behave differently:'),
      createBlock('tm-li6', 'normal', 'Alarms are marked with a test indicator', 'bullet', 1),
      createBlock('tm-li7', 'normal', 'External notifications (email, SMS, voice) are suppressed', 'bullet', 1),
      createBlock('tm-li8', 'normal', 'Webhook integrations may be optionally enabled for testing', 'bullet', 1),
      createBlock('tm-li9', 'normal', 'In-app notifications still display for operators', 'bullet', 1),
      createBlock('tm-li10', 'normal', 'Test alarms appear in reports with a test flag', 'bullet', 1),
      createBlock('tm-h4', 'h2', 'Simulating Alarms'),
      createBlock('tm-p3', 'normal', 'Use the alarm simulator to generate test alarms for training and verification:'),
      createBlock('tm-li11', 'normal', 'Go to Alarms > Simulator', 'number', 1),
      createBlock('tm-li12', 'normal', 'Select the alarm type and priority', 'number', 2),
      createBlock('tm-li13', 'normal', 'Choose the target site and device', 'number', 3),
      createBlock('tm-li14', 'normal', 'Set any custom parameters or thresholds', 'number', 4),
      createBlock('tm-li15', 'normal', 'Click Generate Test Alarm', 'number', 5),
      createBlock('tm-h5', 'h2', 'Verification Checklist'),
      createBlock('tm-p4', 'normal', 'Use test mode to verify the following configurations:'),
      createBlock('tm-li16', 'normal', 'Alarm routing and escalation rules', 'bullet', 1),
      createBlock('tm-li17', 'normal', 'Notification templates and recipients', 'bullet', 1),
      createBlock('tm-li18', 'normal', 'Dashboard widgets and alarm displays', 'bullet', 1),
      createBlock('tm-li19', 'normal', 'Integration endpoints and webhooks', 'bullet', 1),
      createBlock('tm-li20', 'normal', 'Operator response workflows', 'bullet', 1),
      createBlock('tm-h6', 'h2', 'Best Practices'),
      createBlock('tm-li21', 'normal', 'Always enable test mode when commissioning new equipment', 'bullet', 1),
      createBlock('tm-li22', 'normal', 'Use test mode for operator training sessions', 'bullet', 1),
      createBlock('tm-li23', 'normal', 'Document all test activities for audit purposes', 'bullet', 1),
      createBlock('tm-li24', 'normal', 'Set an expiration time to prevent leaving test mode enabled', 'bullet', 1),
      createBlock('tm-li25', 'normal', 'Verify test mode status before critical operations', 'bullet', 1),
      createBlock('tm-h7', 'h2', 'Exiting Test Mode'),
      createBlock('tm-p5', 'normal', 'To exit test mode, return to Admin > System Settings > Test Mode and disable the toggle. All test alarms are automatically cleared and the system returns to normal operation mode.'),
    ]
  },
  {
    _id: 'doc-user-management-overview',
    _type: 'doc',
    title: 'User Management Overview',
    slug: { _type: 'slug', current: 'getting-started/user-management/overview' },
    description: 'Comprehensive overview of user management features including roles, permissions, and access control in GCXONE.',
    targetAudience: ['admin'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('um-h1', 'h2', 'User Management System'),
      createBlock('um-p1', 'normal', 'GCXONE provides a robust user management system that allows administrators to control access to the platform, assign roles, and manage permissions at various organizational levels.'),
      createBlock('um-h2', 'h2', 'Key Components'),
      createBlock('um-li1', 'normal', 'Users - Individual accounts with login credentials', 'bullet', 1),
      createBlock('um-li2', 'normal', 'Roles - Predefined permission sets for common job functions', 'bullet', 1),
      createBlock('um-li3', 'normal', 'Permissions - Granular access controls for specific features', 'bullet', 1),
      createBlock('um-li4', 'normal', 'Groups - Collections of users for easier management', 'bullet', 1),
      createBlock('um-li5', 'normal', 'Scopes - Geographic or organizational boundaries for access', 'bullet', 1),
      createBlock('um-h3', 'h2', 'Predefined Roles'),
      createBlock('um-li6', 'normal', 'Administrator - Full platform access and configuration rights', 'bullet', 1),
      createBlock('um-li7', 'normal', 'Operator - Monitoring, alarm handling, and basic reporting', 'bullet', 1),
      createBlock('um-li8', 'normal', 'Installer - Device setup, configuration, and commissioning', 'bullet', 1),
      createBlock('um-li9', 'normal', 'Integrator - API access and system integration features', 'bullet', 1),
      createBlock('um-li10', 'normal', 'Viewer - Read-only access to dashboards and reports', 'bullet', 1),
      createBlock('um-h4', 'h2', 'Access Scopes'),
      createBlock('um-p2', 'normal', 'User access can be limited to specific parts of the organizational hierarchy:'),
      createBlock('um-li11', 'normal', 'Global - Access to all regions and sites', 'bullet', 1),
      createBlock('um-li12', 'normal', 'Region - Access to specific geographic regions', 'bullet', 1),
      createBlock('um-li13', 'normal', 'Cluster - Access to specific operational clusters', 'bullet', 1),
      createBlock('um-li14', 'normal', 'Zone - Access to specific zones within clusters', 'bullet', 1),
      createBlock('um-li15', 'normal', 'Site - Access to individual sites only', 'bullet', 1),
      createBlock('um-h5', 'h2', 'User Lifecycle'),
      createBlock('um-li16', 'normal', 'Invitation - Send welcome email with setup instructions', 'number', 1),
      createBlock('um-li17', 'normal', 'Activation - User completes first-time setup', 'number', 2),
      createBlock('um-li18', 'normal', 'Active - User has full access per their role and scope', 'number', 3),
      createBlock('um-li19', 'normal', 'Suspended - Temporary access restriction', 'number', 4),
      createBlock('um-li20', 'normal', 'Deactivated - Account disabled, data retained', 'number', 5),
      createBlock('um-h6', 'h2', 'Security Features'),
      createBlock('um-li21', 'normal', 'Password policies and expiration', 'bullet', 1),
      createBlock('um-li22', 'normal', 'Two-factor authentication (2FA)', 'bullet', 1),
      createBlock('um-li23', 'normal', 'Session management and timeout', 'bullet', 1),
      createBlock('um-li24', 'normal', 'Failed login lockout', 'bullet', 1),
      createBlock('um-li25', 'normal', 'Audit logging of all user actions', 'bullet', 1),
      createBlock('um-h7', 'h2', 'Getting Started'),
      createBlock('um-p3', 'normal', 'To manage users, navigate to Admin > User Management. From here you can create new users, modify existing accounts, and review access permissions across your organization.'),
    ]
  },
  {
    _id: 'doc-device-setup-overview',
    _type: 'doc',
    title: 'Device Setup Overview',
    slug: { _type: 'slug', current: 'getting-started/devices' },
    description: 'Introduction to adding and configuring monitoring devices in GCXONE, including supported protocols and best practices.',
    targetAudience: ['admin', 'installer', 'integrator'],
    status: 'published',
    lastUpdated: today,
    category: 'getting-started',
    body: [
      createBlock('ds-h1', 'h2', 'Device Management in GCXONE'),
      createBlock('ds-p1', 'normal', 'GCXONE supports a wide range of monitoring devices including IP cameras, environmental sensors, power systems, and access control equipment. This guide provides an overview of the device setup process.'),
      createBlock('ds-h2', 'h2', 'Supported Device Categories'),
      createBlock('ds-li1', 'normal', 'Video Surveillance - IP cameras, NVRs, video analytics', 'bullet', 1),
      createBlock('ds-li2', 'normal', 'Environmental Monitoring - Temperature, humidity, leak detection', 'bullet', 1),
      createBlock('ds-li3', 'normal', 'Power Systems - UPS, generators, power meters', 'bullet', 1),
      createBlock('ds-li4', 'normal', 'Access Control - Door controllers, readers, intercoms', 'bullet', 1),
      createBlock('ds-li5', 'normal', 'Network Equipment - Routers, switches, firewalls', 'bullet', 1),
      createBlock('ds-li6', 'normal', 'IoT Devices - Sensors, actuators, smart devices', 'bullet', 1),
      createBlock('ds-h3', 'h2', 'Supported Protocols'),
      createBlock('ds-li7', 'normal', 'ONVIF - Standard protocol for IP cameras and video devices', 'bullet', 1),
      createBlock('ds-li8', 'normal', 'SNMP - Network device monitoring and management', 'bullet', 1),
      createBlock('ds-li9', 'normal', 'Modbus - Industrial equipment and power systems', 'bullet', 1),
      createBlock('ds-li10', 'normal', 'MQTT - IoT messaging and telemetry', 'bullet', 1),
      createBlock('ds-li11', 'normal', 'REST API - HTTP-based device integration', 'bullet', 1),
      createBlock('ds-li12', 'normal', 'BACnet - Building automation systems', 'bullet', 1),
      createBlock('ds-h4', 'h2', 'Adding a Device'),
      createBlock('ds-li13', 'normal', 'Navigate to Devices > Add Device', 'number', 1),
      createBlock('ds-li14', 'normal', 'Select the device manufacturer and model', 'number', 2),
      createBlock('ds-li15', 'normal', 'Enter the device network address and credentials', 'number', 3),
      createBlock('ds-li16', 'normal', 'Assign the device to a site', 'number', 4),
      createBlock('ds-li17', 'normal', 'Configure monitoring parameters', 'number', 5),
      createBlock('ds-li18', 'normal', 'Test the connection and save', 'number', 6),
      createBlock('ds-h5', 'h2', 'Device Configuration'),
      createBlock('ds-p2', 'normal', 'After adding a device, configure the monitoring parameters:'),
      createBlock('ds-li19', 'normal', 'Set polling intervals for data collection', 'bullet', 1),
      createBlock('ds-li20', 'normal', 'Define alarm thresholds and rules', 'bullet', 1),
      createBlock('ds-li21', 'normal', 'Configure notification settings', 'bullet', 1),
      createBlock('ds-li22', 'normal', 'Set up data retention policies', 'bullet', 1),
      createBlock('ds-li23', 'normal', 'Enable integrations and webhooks', 'bullet', 1),
      createBlock('ds-h6', 'h2', 'Best Practices'),
      createBlock('ds-li24', 'normal', 'Use dedicated accounts for GCXONE integration', 'bullet', 1),
      createBlock('ds-li25', 'normal', 'Document all device credentials securely', 'bullet', 1),
      createBlock('ds-li26', 'normal', 'Test device connectivity in test mode first', 'bullet', 1),
      createBlock('ds-li27', 'normal', 'Verify firmware is up to date before integration', 'bullet', 1),
      createBlock('ds-li28', 'normal', 'Configure appropriate polling intervals to avoid overload', 'bullet', 1),
      createBlock('ds-h7', 'h2', 'Troubleshooting'),
      createBlock('ds-p3', 'normal', 'If a device fails to connect, check network connectivity, verify credentials, ensure required ports are open, and consult the device-specific integration guide for manufacturer-specific requirements.'),
    ]
  }
];

async function seedRemainingDocs() {
  console.log('Seeding remaining documentation pages to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
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
      errors++;
    }
  }
  
  console.log('\n--- Summary ---');
  console.log(`Created: ${created} documents`);
  console.log(`Updated: ${updated} documents`);
  console.log(`Errors: ${errors}`);
  console.log('\nDocuments processed:');
  docs.forEach(d => console.log(`  - ${d.slug.current}: ${d.title}`));
  console.log('\nSeeding complete!');
}

seedRemainingDocs().catch(console.error);
