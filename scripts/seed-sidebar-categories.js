#!/usr/bin/env node
/**
 * Seed sidebar categories to Sanity for NXGEN Technology AG documentation platform.
 * Creates a comprehensive B2B SaaS monitoring station documentation structure.
 * 
 * Usage:
 *   node scripts/seed-sidebar-categories.js
 */
'use strict';

const SIDEBAR_CATEGORIES = {
  rootCategories: [
    {
      title: 'Getting Started',
      slug: 'getting-started',
      icon: '🚀',
      position: 1,
      description: 'Start here to learn the basics of NXGEN GCXONE platform',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Introduction', slug: 'introduction', icon: '👋', position: 1, targetAudience: ['all'] },
        { title: 'Quick Start', slug: 'quick-start', icon: '⚡', position: 2, targetAudience: ['all'] },
        { title: 'First Login', slug: 'first-login', icon: '🔐', position: 3, targetAudience: ['all'] },
        { title: 'Platform Tour', slug: 'platform-tour', icon: '🗺️', position: 4, targetAudience: ['all'] },
        { title: 'Key Concepts', slug: 'key-concepts', icon: '💡', position: 5, targetAudience: ['all'] },
        { title: 'User Roles', slug: 'user-roles', icon: '👥', position: 6, targetAudience: ['all'] },
        { title: 'Browser Requirements', slug: 'browser-requirements', icon: '🌐', position: 7, targetAudience: ['all'] },
      ],
    },
    {
      title: 'Platform Overview',
      slug: 'platform-overview',
      icon: '🏢',
      position: 2,
      description: 'Comprehensive overview of the NXGEN monitoring platform architecture',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Architecture', slug: 'architecture', icon: '🏗️', position: 1, targetAudience: ['admin', 'internal'] },
        { title: 'Core Components', slug: 'core-components', icon: '🧩', position: 2, targetAudience: ['all'] },
        { title: 'GCXONE Platform', slug: 'gcxone', icon: '🖥️', position: 3, targetAudience: ['all'] },
        { title: 'Talos Monitoring', slug: 'talos', icon: '👁️', position: 4, targetAudience: ['operator', 'manager'] },
        { title: 'Security & Compliance', slug: 'security-compliance', icon: '🔒', position: 5, targetAudience: ['admin', 'internal'] },
        { title: 'Data Centers', slug: 'data-centers', icon: '🌐', position: 6, targetAudience: ['internal'] },
        { title: 'Scalability', slug: 'scalability', icon: '📈', position: 7, targetAudience: ['admin', 'manager'] },
      ],
    },
    {
      title: 'Monitoring Stations',
      slug: 'monitoring-stations',
      icon: '📡',
      position: 3,
      description: 'Configure and manage monitoring stations and sites',
      collapsed: false,
      targetAudience: ['operator', 'manager', 'admin'],
      subcategories: [
        { title: 'Station Setup', slug: 'station-setup', icon: '⚙️', position: 1, targetAudience: ['admin'] },
        { title: 'Site Management', slug: 'site-management', icon: '🏛️', position: 2, targetAudience: ['admin', 'manager'] },
        { title: 'Station Groups', slug: 'station-groups', icon: '📁', position: 3, targetAudience: ['admin', 'manager'] },
        { title: 'Station Dashboard', slug: 'station-dashboard', icon: '📊', position: 4, targetAudience: ['operator', 'manager'] },
        { title: 'Customer Management', slug: 'customer-management', icon: '👥', position: 5, targetAudience: ['admin', 'manager'] },
        { title: 'Site Health', slug: 'site-health', icon: '💚', position: 6, targetAudience: ['operator', 'manager'] },
        { title: 'Multi-Site Views', slug: 'multi-site-views', icon: '🗺️', position: 7, targetAudience: ['manager'] },
        { title: 'Station Configuration', slug: 'station-configuration', icon: '🔧', position: 8, targetAudience: ['admin'] },
      ],
    },
    {
      title: 'Devices & Equipment',
      slug: 'devices-equipment',
      icon: '📹',
      position: 4,
      description: 'Configuration guides for all supported devices and equipment',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Device Overview', slug: 'device-overview', icon: '📋', position: 1, targetAudience: ['all'] },
        { title: 'IP Cameras', slug: 'ip-cameras', icon: '📷', position: 2, targetAudience: ['operator', 'admin'] },
        { title: 'NVRs & DVRs', slug: 'nvrs-dvrs', icon: '💾', position: 3, targetAudience: ['operator', 'admin'] },
        { title: 'Video Analytics', slug: 'video-analytics', icon: '🤖', position: 4, targetAudience: ['operator', 'manager'] },
        { title: 'Audio Devices', slug: 'audio-devices', icon: '🎤', position: 5, targetAudience: ['operator', 'admin'] },
        { title: 'Access Control', slug: 'access-control', icon: '🚪', position: 6, targetAudience: ['operator', 'admin'] },
        { title: 'Intrusion Systems', slug: 'intrusion-systems', icon: '🚨', position: 7, targetAudience: ['operator', 'admin'] },
        { title: 'Network Devices', slug: 'network-devices', icon: '🌐', position: 8, targetAudience: ['admin'] },
        { title: 'IoT Sensors', slug: 'iot-sensors', icon: '📡', position: 9, targetAudience: ['operator', 'admin'] },
        { title: 'Device Troubleshooting', slug: 'device-troubleshooting', icon: '🔧', position: 10, targetAudience: ['operator', 'admin'] },
      ],
    },
    {
      title: 'Alerts & Notifications',
      slug: 'alerts-notifications',
      icon: '🔔',
      position: 5,
      description: 'Configure alerts, notifications, and alarm management',
      collapsed: false,
      targetAudience: ['operator', 'manager', 'admin'],
      subcategories: [
        { title: 'Alert Overview', slug: 'alert-overview', icon: '🔔', position: 1, targetAudience: ['all'] },
        { title: 'Alarm Queue', slug: 'alarm-queue', icon: '📋', position: 2, targetAudience: ['operator'] },
        { title: 'Alert Rules', slug: 'alert-rules', icon: '📏', position: 3, targetAudience: ['admin', 'manager'] },
        { title: 'Escalation Policies', slug: 'escalation-policies', icon: '📈', position: 4, targetAudience: ['admin', 'manager'] },
        { title: 'Notification Channels', slug: 'notification-channels', icon: '📢', position: 5, targetAudience: ['admin'] },
        { title: 'Email Notifications', slug: 'email-notifications', icon: '📧', position: 6, targetAudience: ['admin', 'manager'] },
        { title: 'SMS Notifications', slug: 'sms-notifications', icon: '📱', position: 7, targetAudience: ['admin', 'manager'] },
        { title: 'Push Notifications', slug: 'push-notifications', icon: '📲', position: 8, targetAudience: ['all'] },
        { title: 'Alert Prioritization', slug: 'alert-prioritization', icon: '🎯', position: 9, targetAudience: ['manager', 'admin'] },
        { title: 'False Alarm Management', slug: 'false-alarm-management', icon: '⚠️', position: 10, targetAudience: ['operator', 'manager'] },
        { title: 'Alert Analytics', slug: 'alert-analytics', icon: '📊', position: 11, targetAudience: ['manager'] },
        { title: 'SLA Configuration', slug: 'sla-configuration', icon: '⏱️', position: 12, targetAudience: ['admin', 'manager'] },
      ],
    },
    {
      title: 'Integrations',
      slug: 'integrations',
      icon: '🔗',
      position: 6,
      description: 'Third-party integrations and system connections',
      collapsed: false,
      targetAudience: ['admin', 'manager'],
      subcategories: [
        { title: 'Integration Overview', slug: 'integration-overview', icon: '🔗', position: 1, targetAudience: ['all'] },
        { title: 'Video Management Systems', slug: 'vms-integrations', icon: '🎥', position: 2, targetAudience: ['admin'] },
        { title: 'Access Control Systems', slug: 'access-control-integrations', icon: '🚪', position: 3, targetAudience: ['admin'] },
        { title: 'Alarm Systems', slug: 'alarm-system-integrations', icon: '🚨', position: 4, targetAudience: ['admin'] },
        { title: 'PSIM Platforms', slug: 'psim-integrations', icon: '🖥️', position: 5, targetAudience: ['admin'] },
        { title: 'SIEM Integration', slug: 'siem-integrations', icon: '🔍', position: 6, targetAudience: ['admin', 'internal'] },
        { title: 'CRM Systems', slug: 'crm-integrations', icon: '👥', position: 7, targetAudience: ['admin', 'manager'] },
        { title: 'Ticketing Systems', slug: 'ticketing-integrations', icon: '🎫', position: 8, targetAudience: ['admin', 'manager'] },
        { title: 'Webhooks', slug: 'webhooks', icon: '🪝', position: 9, targetAudience: ['admin'] },
        { title: 'Custom Integrations', slug: 'custom-integrations', icon: '🛠️', position: 10, targetAudience: ['admin', 'internal'] },
      ],
    },
    {
      title: 'API Reference',
      slug: 'api-reference',
      icon: '📚',
      position: 7,
      description: 'Developer documentation and API reference',
      collapsed: false,
      targetAudience: ['admin', 'internal'],
      subcategories: [
        { title: 'API Overview', slug: 'api-overview', icon: '📖', position: 1, targetAudience: ['admin', 'internal'] },
        { title: 'Authentication', slug: 'authentication', icon: '🔑', position: 2, targetAudience: ['admin', 'internal'] },
        { title: 'REST API', slug: 'rest-api', icon: '🌐', position: 3, targetAudience: ['admin', 'internal'] },
        { title: 'GraphQL API', slug: 'graphql-api', icon: '◼️', position: 4, targetAudience: ['internal'] },
        { title: 'Webhook Events', slug: 'webhook-events', icon: '📨', position: 5, targetAudience: ['admin', 'internal'] },
        { title: 'SDKs & Libraries', slug: 'sdks-libraries', icon: '📦', position: 6, targetAudience: ['internal'] },
        { title: 'Rate Limits', slug: 'rate-limits', icon: '⏱️', position: 7, targetAudience: ['admin', 'internal'] },
        { title: 'Error Codes', slug: 'error-codes', icon: '❌', position: 8, targetAudience: ['admin', 'internal'] },
        { title: 'API Changelog', slug: 'api-changelog', icon: '📝', position: 9, targetAudience: ['internal'] },
      ],
    },
    {
      title: 'Admin Guide',
      slug: 'admin-guide',
      icon: '🛡️',
      position: 8,
      description: 'System administration and configuration guides',
      collapsed: false,
      targetAudience: ['admin'],
      subcategories: [
        { title: 'Admin Dashboard', slug: 'admin-dashboard', icon: '📊', position: 1, targetAudience: ['admin'] },
        { title: 'User Management', slug: 'user-management', icon: '👥', position: 2, targetAudience: ['admin'] },
        { title: 'Role-Based Access', slug: 'rbac', icon: '🔐', position: 3, targetAudience: ['admin'] },
        { title: 'Permissions Matrix', slug: 'permissions-matrix', icon: '📋', position: 4, targetAudience: ['admin'] },
        { title: 'Organization Settings', slug: 'organization-settings', icon: '🏢', position: 5, targetAudience: ['admin'] },
        { title: 'Branding & Themes', slug: 'branding-themes', icon: '🎨', position: 6, targetAudience: ['admin'] },
        { title: 'System Configuration', slug: 'system-configuration', icon: '⚙️', position: 7, targetAudience: ['admin'] },
        { title: 'Backup & Recovery', slug: 'backup-recovery', icon: '💾', position: 8, targetAudience: ['admin'] },
        { title: 'Audit Logs', slug: 'audit-logs', icon: '📜', position: 9, targetAudience: ['admin'] },
        { title: 'Security Settings', slug: 'security-settings', icon: '🔒', position: 10, targetAudience: ['admin'] },
        { title: 'License Management', slug: 'license-management', icon: '📜', position: 11, targetAudience: ['admin'] },
        { title: 'Maintenance', slug: 'maintenance', icon: '🔧', position: 12, targetAudience: ['admin'] },
      ],
    },
    {
      title: 'Best Practices',
      slug: 'best-practices',
      icon: '✅',
      position: 9,
      description: 'Recommended practices and optimization guides',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Operator Best Practices', slug: 'operator-best-practices', icon: '🖥️', position: 1, targetAudience: ['operator'] },
        { title: 'Manager Best Practices', slug: 'manager-best-practices', icon: '📊', position: 2, targetAudience: ['manager'] },
        { title: 'Admin Best Practices', slug: 'admin-best-practices', icon: '🛡️', position: 3, targetAudience: ['admin'] },
        { title: 'Alarm Handling', slug: 'alarm-handling', icon: '🔔', position: 4, targetAudience: ['operator'] },
        { title: 'Security Guidelines', slug: 'security-guidelines', icon: '🔒', position: 5, targetAudience: ['all'] },
        { title: 'Performance Optimization', slug: 'performance-optimization', icon: '⚡', position: 6, targetAudience: ['admin'] },
        { title: 'Workflow Templates', slug: 'workflow-templates', icon: '📋', position: 7, targetAudience: ['manager', 'admin'] },
        { title: 'Training Resources', slug: 'training-resources', icon: '📚', position: 8, targetAudience: ['all'] },
      ],
    },
    {
      title: 'Troubleshooting',
      slug: 'troubleshooting',
      icon: '🔧',
      position: 10,
      description: 'Common issues and their solutions',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Troubleshooting Overview', slug: 'troubleshooting-overview', icon: '🔍', position: 1, targetAudience: ['all'] },
        { title: 'Login Issues', slug: 'login-issues', icon: '🔐', position: 2, targetAudience: ['all'] },
        { title: 'Video Issues', slug: 'video-issues', icon: '📹', position: 3, targetAudience: ['operator', 'admin'] },
        { title: 'Connection Problems', slug: 'connection-problems', icon: '🔗', position: 4, targetAudience: ['operator', 'admin'] },
        { title: 'Alert Issues', slug: 'alert-issues', icon: '🔔', position: 5, targetAudience: ['operator', 'admin'] },
        { title: 'Performance Issues', slug: 'performance-issues', icon: '🐌', position: 6, targetAudience: ['admin'] },
        { title: 'Device Offline', slug: 'device-offline', icon: '📵', position: 7, targetAudience: ['operator', 'admin'] },
        { title: 'Integration Errors', slug: 'integration-errors', icon: '⚠️', position: 8, targetAudience: ['admin'] },
        { title: 'Error Code Reference', slug: 'error-code-reference', icon: '📋', position: 9, targetAudience: ['admin', 'internal'] },
        { title: 'Support Escalation', slug: 'support-escalation', icon: '📈', position: 10, targetAudience: ['all'] },
      ],
    },
    {
      title: 'Release Notes',
      slug: 'release-notes',
      icon: '📝',
      position: 11,
      description: 'Platform updates and version history',
      collapsed: false,
      targetAudience: ['all'],
      subcategories: [
        { title: 'Latest Release', slug: 'latest-release', icon: '🆕', position: 1, targetAudience: ['all'] },
        { title: 'Version History', slug: 'version-history', icon: '📜', position: 2, targetAudience: ['all'] },
        { title: 'Feature Releases', slug: 'feature-releases', icon: '✨', position: 3, targetAudience: ['all'] },
        { title: 'Security Updates', slug: 'security-updates', icon: '🔒', position: 4, targetAudience: ['admin'] },
        { title: 'Deprecation Notices', slug: 'deprecation-notices', icon: '⚠️', position: 5, targetAudience: ['admin', 'internal'] },
        { title: 'Upgrade Guides', slug: 'upgrade-guides', icon: '⬆️', position: 6, targetAudience: ['admin'] },
      ],
    },
  ],
  audienceConfigurations: [
    { name: 'Default Sidebar', audience: 'all', showHomeLink: true, description: 'General documentation for all users' },
    { name: 'Admin Sidebar', audience: 'admin', showHomeLink: true, description: 'System configuration and user management' },
    { name: 'Manager Sidebar', audience: 'manager', showHomeLink: true, description: 'Dashboards, reports, and team management' },
    { name: 'Operator Sidebar', audience: 'operator', showHomeLink: true, description: 'Daily monitoring and device management' },
    { name: 'Internal Sidebar', audience: 'internal', showHomeLink: true, description: 'Internal docs and SOPs' },
  ],
};

async function run() {
  const projectId = 'fjjuacab';
  const apiToken = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';
  const dataset = 'production';

  const { createClient } = require('@sanity/client');

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  console.log('[seed-sidebar] Connecting to Sanity...');
  console.log(`[seed-sidebar] Project: ${projectId}, Dataset: ${dataset}`);

  const categoryIdMap = new Map();
  const subcategoryIdMap = new Map();

  // Step 1: Create root categories
  console.log('\n[seed-sidebar] Creating root sidebar categories...');
  
  for (const rootCat of SIDEBAR_CATEGORIES.rootCategories) {
    const existing = await client.fetch(
      `*[_type == "sidebarCategory" && slug.current == $slug][0]._id`,
      { slug: rootCat.slug }
    );

    const docData = {
      title: rootCat.title,
      icon: rootCat.icon,
      position: rootCat.position,
      description: rootCat.description,
      collapsed: rootCat.collapsed,
      collapsible: true,
      targetAudience: rootCat.targetAudience,
      link: { type: 'generated-index' },
    };

    if (existing) {
      console.log(`[seed-sidebar] Updating existing: ${rootCat.icon} ${rootCat.title}`);
      const updated = await client.patch(existing).set(docData).commit();
      categoryIdMap.set(rootCat.slug, updated._id);
    } else {
      const doc = await client.create({
        _type: 'sidebarCategory',
        slug: { _type: 'slug', current: rootCat.slug },
        ...docData,
      });
      categoryIdMap.set(rootCat.slug, doc._id);
      console.log(`[seed-sidebar] Created: ${rootCat.icon} ${rootCat.title} (position ${rootCat.position})`);
    }
  }

  // Step 2: Create subcategories
  console.log('\n[seed-sidebar] Creating subcategories...');
  
  for (const rootCat of SIDEBAR_CATEGORIES.rootCategories) {
    if (!rootCat.subcategories || rootCat.subcategories.length === 0) continue;
    
    const parentId = categoryIdMap.get(rootCat.slug);
    if (!parentId) continue;

    for (const subCat of rootCat.subcategories) {
      const subSlug = `${rootCat.slug}/${subCat.slug}`;
      
      const existing = await client.fetch(
        `*[_type == "sidebarCategory" && slug.current == $slug][0]._id`,
        { slug: subSlug }
      );

      const docData = {
        title: subCat.title,
        icon: subCat.icon,
        position: subCat.position,
        parent: { _type: 'reference', _ref: parentId },
        collapsible: true,
        collapsed: false,
        targetAudience: subCat.targetAudience,
        link: { type: 'generated-index' },
      };

      if (existing) {
        console.log(`[seed-sidebar] Updating: ${subCat.icon} ${subCat.title}`);
        const updated = await client.patch(existing).set(docData).commit();
        subcategoryIdMap.set(subSlug, updated._id);
      } else {
        const doc = await client.create({
          _type: 'sidebarCategory',
          slug: { _type: 'slug', current: subSlug },
          ...docData,
        });
        subcategoryIdMap.set(subSlug, doc._id);
        console.log(`[seed-sidebar] Created: ${subCat.icon} ${subCat.title} → ${rootCat.title}`);
      }
    }
  }

  // Step 3: Create sidebar configurations for each audience
  console.log('\n[seed-sidebar] Creating sidebar configurations...');

  for (const config of SIDEBAR_CATEGORIES.audienceConfigurations) {
    const existing = await client.fetch(
      `*[_type == "sidebarConfig" && audience == $audience && isActive == true][0]._id`,
      { audience: config.audience }
    );

    // Build category references based on audience
    const categoryRefs = SIDEBAR_CATEGORIES.rootCategories
      .filter(rootCat => {
        return rootCat.targetAudience.includes(config.audience) || 
               rootCat.targetAudience.includes('all');
      })
      .map((cat, idx) => ({
        _key: `cat-${idx}`,
        _type: 'sidebarCategoryRef',
        category: { _type: 'reference', _ref: categoryIdMap.get(cat.slug) },
        position: cat.position,
      }));

    if (existing) {
      console.log(`[seed-sidebar] Updating sidebar config for "${config.audience}"...`);
      await client.patch(existing)
        .set({
          name: config.name,
          showHomeLink: config.showHomeLink,
          categories: categoryRefs,
        })
        .commit();
    } else {
      await client.create({
        _type: 'sidebarConfig',
        name: config.name,
        audience: config.audience,
        showHomeLink: config.showHomeLink,
        homeLinkLabel: 'Home',
        categories: categoryRefs,
        isActive: true,
      });
      console.log(`[seed-sidebar] Created sidebar config: ${config.name}`);
    }
  }

  // Summary
  console.log('\n[seed-sidebar] ✅ Done!');
  console.log(`[seed-sidebar] Created/updated ${categoryIdMap.size} root categories`);
  console.log(`[seed-sidebar] Created/updated ${subcategoryIdMap.size} subcategories`);
  console.log(`[seed-sidebar] Created ${SIDEBAR_CATEGORIES.audienceConfigurations.length} sidebar configurations`);
  
  // Print category summary
  console.log('\n[seed-sidebar] Category Structure:');
  for (const rootCat of SIDEBAR_CATEGORIES.rootCategories) {
    console.log(`  ${rootCat.icon} ${rootCat.title} (pos ${rootCat.position})`);
    for (const subCat of rootCat.subcategories || []) {
      console.log(`    └─ ${subCat.icon} ${subCat.title}`);
    }
  }
}

module.exports = { run, SIDEBAR_CATEGORIES };

if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
