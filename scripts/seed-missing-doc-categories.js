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

function createPlaceholderDoc(slug, title, category, description, audience = ['all']) {
  return {
    _id: `doc-${slug.replace(/\//g, '-')}`,
    _type: 'doc',
    title: title,
    slug: { _type: 'slug', current: slug },
    description: description,
    targetAudience: audience,
    status: 'draft',
    lastUpdated: today,
    category: category,
    body: [
      createBlock(`${slug}-h1`, 'h2', title),
      createBlock(`${slug}-p1`, 'normal', `This is a placeholder document for ${title}. Content will be added soon.`),
      createBlock(`${slug}-p2`, 'normal', 'This document is currently in draft status and requires content development.'),
    ]
  };
}

const DOCS_TO_SEED = [
  {
    slug: 'alarm-management/alarm-codes',
    title: 'Alarm Codes',
    category: 'alarm-management',
    description: 'Reference guide for alarm codes and their meanings in the GCXONE platform.',
    audience: ['operator', 'admin']
  },
  {
    slug: 'alarm-management/arm-disarm-isolate',
    title: 'Arm Disarm Isolate',
    category: 'alarm-management',
    description: 'Guide to arming, disarming, and isolating zones in the GCXONE platform.',
    audience: ['operator', 'admin']
  },
  {
    slug: 'alarm-management/event-overflow',
    title: 'Event Overflow',
    category: 'alarm-management',
    description: 'Understanding and managing event overflow situations in monitoring operations.',
    audience: ['operator', 'manager']
  },
  {
    slug: 'alarm-management/priority-whitelist-blacklist',
    title: 'Priority Whitelist Blacklist',
    category: 'alarm-management',
    description: 'Configuration guide for priority lists, whitelists, and blacklists.',
    audience: ['admin', 'manager']
  },
  {
    slug: 'alarm-management/redundant-alarms',
    title: 'Redundant Alarms',
    category: 'alarm-management',
    description: 'How the platform handles redundant and duplicate alarm events.',
    audience: ['operator', 'admin']
  },
  {
    slug: 'alarm-management/technical-alarms',
    title: 'Technical Alarms',
    category: 'alarm-management',
    description: 'Guide to technical alarms and system health notifications.',
    audience: ['operator', 'admin']
  },
  {
    slug: 'alarm-management/test-mode',
    title: 'Test Mode',
    category: 'alarm-management',
    description: 'Using test mode for training and system verification without affecting production.',
    audience: ['admin', 'operator']
  },

  {
    slug: 'operator-guide/event-clips',
    title: 'Event Clips',
    category: 'operator-guide',
    description: 'How to view and manage event clips in the GCXONE platform.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/handling-alarms',
    title: 'Handling Alarms',
    category: 'operator-guide',
    description: 'Step-by-step guide for operators on handling alarm events.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/live-video',
    title: 'Live Video',
    category: 'operator-guide',
    description: 'Using live video monitoring features in GCXONE.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/multi-site-monitoring',
    title: 'Multi Site Monitoring',
    category: 'operator-guide',
    description: 'Monitoring multiple sites simultaneously from a unified dashboard.',
    audience: ['operator', 'manager']
  },
  {
    slug: 'operator-guide/notes-annotations',
    title: 'Notes Annotations',
    category: 'operator-guide',
    description: 'Adding notes and annotations to events and sites.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/operator-dashboard',
    title: 'Operator Dashboard',
    category: 'operator-guide',
    description: 'Overview of the operator dashboard and its features.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/performance-metrics',
    title: 'Performance Metrics',
    category: 'operator-guide',
    description: 'Understanding operator performance metrics and KPIs.',
    audience: ['operator', 'manager']
  },
  {
    slug: 'operator-guide/ptz-control',
    title: 'PTZ Control',
    category: 'operator-guide',
    description: 'Controlling PTZ cameras from the GCXONE interface.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/shortcuts-tips',
    title: 'Shortcuts Tips',
    category: 'operator-guide',
    description: 'Keyboard shortcuts and productivity tips for operators.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/site-navigation',
    title: 'Site Navigation',
    category: 'operator-guide',
    description: 'Navigating between sites and using the site tree.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/training-guide',
    title: 'Training Guide',
    category: 'operator-guide',
    description: 'Comprehensive training guide for new operators.',
    audience: ['operator']
  },
  {
    slug: 'operator-guide/video-playback',
    title: 'Video Playback',
    category: 'operator-guide',
    description: 'Using video playback features to review recorded footage.',
    audience: ['operator']
  },

  {
    slug: 'installer-guide/device-installation',
    title: 'Device Installation',
    category: 'installer-guide',
    description: 'Physical installation guide for supported devices.',
    audience: ['installer', 'admin']
  },
  {
    slug: 'installer-guide/device-registration',
    title: 'Device Registration',
    category: 'installer-guide',
    description: 'Registering and provisioning devices in the GCXONE platform.',
    audience: ['installer', 'admin']
  },
  {
    slug: 'installer-guide/environmental',
    title: 'Environmental',
    category: 'installer-guide',
    description: 'Environmental considerations for device placement.',
    audience: ['installer']
  },
  {
    slug: 'installer-guide/installation-overview',
    title: 'Installation Overview',
    category: 'installer-guide',
    description: 'Overview of the installation process and requirements.',
    audience: ['installer']
  },
  {
    slug: 'installer-guide/maintenance-schedule',
    title: 'Maintenance Schedule',
    category: 'installer-guide',
    description: 'Recommended maintenance schedules for installed equipment.',
    audience: ['installer', 'admin']
  },
  {
    slug: 'installer-guide/network-configuration',
    title: 'Network Configuration',
    category: 'installer-guide',
    description: 'Network configuration requirements and best practices.',
    audience: ['installer', 'admin']
  },
  {
    slug: 'installer-guide/network-setup',
    title: 'Network Setup',
    category: 'installer-guide',
    description: 'Step-by-step network setup guide for GCXONE deployments.',
    audience: ['installer']
  },
  {
    slug: 'installer-guide/post-installation',
    title: 'Post Installation',
    category: 'installer-guide',
    description: 'Post-installation verification and handover procedures.',
    audience: ['installer']
  },
  {
    slug: 'installer-guide/troubleshooting',
    title: 'Troubleshooting',
    category: 'installer-guide',
    description: 'Common installation issues and their solutions.',
    audience: ['installer', 'admin']
  },

  {
    slug: 'knowledge-base/compliance',
    title: 'Compliance',
    category: 'knowledge-base',
    description: 'Compliance standards and certifications for the GCXONE platform.',
    audience: ['admin', 'manager']
  },
  {
    slug: 'knowledge-base/data-privacy',
    title: 'Data Privacy',
    category: 'knowledge-base',
    description: 'Data privacy policies and GDPR compliance information.',
    audience: ['admin', 'manager']
  },
  {
    slug: 'knowledge-base/faq',
    title: 'FAQ',
    category: 'knowledge-base',
    description: 'Frequently asked questions about GCXONE.',
    audience: ['all']
  },
  {
    slug: 'knowledge-base/glossary',
    title: 'Glossary',
    category: 'knowledge-base',
    description: 'Glossary of terms used in the GCXONE platform.',
    audience: ['all']
  },
  {
    slug: 'knowledge-base/integration-guides',
    title: 'Integration Guides',
    category: 'knowledge-base',
    description: 'Third-party integration guides and compatibility information.',
    audience: ['admin']
  },
  {
    slug: 'knowledge-base/migration-guides',
    title: 'Migration Guides',
    category: 'knowledge-base',
    description: 'Guides for migrating from legacy systems to GCXONE.',
    audience: ['admin']
  },
  {
    slug: 'knowledge-base/network-requirements',
    title: 'Network Requirements',
    category: 'knowledge-base',
    description: 'Network and infrastructure requirements for GCXONE.',
    audience: ['admin', 'installer']
  },
  {
    slug: 'knowledge-base/quick-reference',
    title: 'Quick Reference',
    category: 'knowledge-base',
    description: 'Quick reference cards and cheat sheets for common tasks.',
    audience: ['all']
  },

  {
    slug: 'reporting/reporting-overview',
    title: 'Reporting Overview',
    category: 'reporting',
    description: 'Overview of the reporting capabilities in GCXONE.',
    audience: ['manager', 'admin']
  },
  {
    slug: 'reporting/report-sharing',
    title: 'Report Sharing',
    category: 'reporting',
    description: 'How to share reports with stakeholders.',
    audience: ['manager']
  },
  {
    slug: 'reporting/report-troubleshooting',
    title: 'Report Troubleshooting',
    category: 'reporting',
    description: 'Troubleshooting common reporting issues.',
    audience: ['manager', 'admin']
  },
  {
    slug: 'reporting/scheduled-reports',
    title: 'Scheduled Reports',
    category: 'reporting',
    description: 'Setting up and managing scheduled reports.',
    audience: ['manager', 'admin']
  },
  {
    slug: 'reporting/standard-reports',
    title: 'Standard Reports',
    category: 'reporting',
    description: 'Overview of standard reports available in GCXONE.',
    audience: ['manager', 'admin']
  },

  {
    slug: 'support/contact',
    title: 'Contact Support',
    category: 'support',
    description: 'How to contact NXGEN support for assistance.',
    audience: ['all']
  },
];

async function seedMissingDocs() {
  console.log('Seeding missing documentation to Sanity...\n');
  console.log(`Project: fjjuacab`);
  console.log(`Dataset: production`);
  console.log(`Total docs to seed: ${DOCS_TO_SEED.length}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const docData of DOCS_TO_SEED) {
    const doc = createPlaceholderDoc(
      docData.slug,
      docData.title,
      docData.category,
      docData.description,
      docData.audience
    );

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
      console.error(`Error with ${doc.slug.current}: ${err.message}`);
      skipped++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedMissingDocs().catch(console.error);
