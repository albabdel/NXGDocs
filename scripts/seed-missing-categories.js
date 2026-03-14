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
    children: [{ _type: 'span', _key: `${key}-span`, text: text, marks: [] }],
    markDefs: []
  };
  if (listItem) { block.listItem = listItem; block.level = level || 1; }
  return block;
}

const CATEGORIES_DATA = [
  {
    title: 'Alarm Management',
    slug: 'alarm-management',
    icon: '🔔',
    position: 12,
    description: 'Comprehensive guide to managing alarms, codes, priorities, and alarm workflows in GCXONE',
    targetAudience: ['operator', 'manager', 'admin'],
    docs: [
      { title: 'Alarm Codes', slug: 'alarm-management/alarm-codes', position: 1, description: 'Reference guide for all alarm codes and their meanings in the GCXONE monitoring platform.' },
      { title: 'Arm/Disarm/Isolate', slug: 'alarm-management/arm-disarm-isolate', position: 2, description: 'Learn how to arm, disarm, and isolate sites or devices in GCXONE for proper alarm management.' },
      { title: 'Event Overflow', slug: 'alarm-management/event-overflow', position: 3, description: 'Understand and manage event overflow situations when alarm volumes exceed normal capacity.' },
      { title: 'Priority Whitelist/Blacklist', slug: 'alarm-management/priority-whitelist-blacklist', position: 4, description: 'Configure priority rules using whitelists and blacklists to control alarm routing and visibility.' },
      { title: 'Redundant Alarms', slug: 'alarm-management/redundant-alarms', position: 5, description: 'Learn how to identify, manage, and prevent redundant alarm situations in GCXONE.' },
      { title: 'Technical Alarms', slug: 'alarm-management/technical-alarms', position: 6, description: 'Reference guide for technical alarms indicating system health and infrastructure issues.' },
    ]
  },
  {
    title: 'Operator Guide',
    slug: 'operator-guide',
    icon: '🖥️',
    position: 13,
    description: 'Essential guide for operators using GCXONE for daily monitoring and alarm handling',
    targetAudience: ['operator', 'manager'],
    docs: [
      { title: 'Event Clips', slug: 'operator-guide/event-clips', position: 1, description: 'Learn how to view, manage, and export event clips for alarm verification and evidence.' },
      { title: 'Handling Alarms', slug: 'operator-guide/handling-alarms', position: 2, description: 'Step-by-step guide for processing alarms efficiently and effectively in GCXONE.' },
      { title: 'Live Video', slug: 'operator-guide/live-video', position: 3, description: 'Guide to viewing and controlling live video streams from connected cameras.' },
      { title: 'Multi-Site Monitoring', slug: 'operator-guide/multi-site-monitoring', position: 4, description: 'Learn how to efficiently monitor multiple sites simultaneously using GCXONE.' },
      { title: 'Notes & Annotations', slug: 'operator-guide/notes-annotations', position: 5, description: 'Learn how to create and manage notes and annotations for effective shift handoffs.' },
      { title: 'Operator Dashboard', slug: 'operator-guide/operator-dashboard', position: 6, description: 'Overview of the operator dashboard and its key features for daily monitoring.' },
      { title: 'Performance Metrics', slug: 'operator-guide/performance-metrics', position: 7, description: 'Understanding performance metrics and KPIs for monitoring operations.' },
      { title: 'PTZ Control', slug: 'operator-guide/ptz-control', position: 8, description: 'Guide to controlling Pan-Tilt-Zoom cameras for detailed site inspection.' },
      { title: 'Shortcuts & Tips', slug: 'operator-guide/shortcuts-tips', position: 9, description: 'Keyboard shortcuts and productivity tips for efficient GCXONE operation.' },
      { title: 'Site Navigation', slug: 'operator-guide/site-navigation', position: 10, description: 'Learn how to navigate between sites efficiently in the GCXONE interface.' },
      { title: 'Training Guide', slug: 'operator-guide/training-guide', position: 11, description: 'Comprehensive training guide for new operators learning GCXONE.' },
      { title: 'Video Playback', slug: 'operator-guide/video-playback', position: 12, description: 'Guide to playing back recorded video for investigation and evidence review.' },
    ]
  },
  {
    title: 'Knowledge Base',
    slug: 'knowledge-base',
    icon: '📚',
    position: 14,
    description: 'Reference documentation, FAQs, glossary, and compliance information',
    targetAudience: ['all'],
    docs: [
      { title: 'Compliance', slug: 'knowledge-base/compliance', position: 1, description: 'Compliance standards and regulatory requirements for monitoring operations.' },
      { title: 'Data Privacy', slug: 'knowledge-base/data-privacy', position: 2, description: 'Data privacy policies and GDPR compliance information for GCXONE.' },
      { title: 'FAQ', slug: 'knowledge-base/faq', position: 3, description: 'Frequently asked questions about GCXONE features and functionality.' },
      { title: 'Glossary', slug: 'knowledge-base/glossary', position: 4, description: 'Glossary of terms and definitions used throughout the GCXONE platform.' },
      { title: 'Integration Guides', slug: 'knowledge-base/integration-guides', position: 5, description: 'Integration guides for third-party systems and devices.' },
      { title: 'Migration Guides', slug: 'knowledge-base/migration-guides', position: 6, description: 'Guides for migrating from legacy systems to GCXONE.' },
      { title: 'Network Requirements', slug: 'knowledge-base/network-requirements', position: 7, description: 'Network requirements and firewall configuration for GCXONE deployment.' },
      { title: 'Quick Reference', slug: 'knowledge-base/quick-reference', position: 8, description: 'Quick reference cards and cheat sheets for common GCXONE tasks.' },
    ]
  }
];

function generateBody(doc) {
  const prefix = doc.slug.split('/').pop().substring(0, 8);
  return [
    createBlock(`${prefix}-h1`, 'h2', doc.title),
    createBlock(`${prefix}-p1`, 'normal', doc.description),
    createBlock(`${prefix}-h2`, 'h2', 'Overview'),
    createBlock(`${prefix}-p2`, 'normal', `This document provides comprehensive guidance on ${doc.title.toLowerCase()} within the GCXONE monitoring platform.`),
    createBlock(`${prefix}-h3`, 'h2', 'Key Topics'),
    createBlock(`${prefix}-li1`, 'normal', 'Understanding the core concepts and functionality', 'bullet', 1),
    createBlock(`${prefix}-li2`, 'normal', 'Configuration and setup procedures', 'bullet', 1),
    createBlock(`${prefix}-li3`, 'normal', 'Best practices and recommendations', 'bullet', 1),
    createBlock(`${prefix}-li4`, 'normal', 'Troubleshooting common issues', 'bullet', 1),
  ];
}

async function run() {
  console.log('Seeding sidebar categories and documents to Sanity...\n');
  console.log('Project: fjjuacab, Dataset: production\n');

  const categoryIdMap = new Map();

  // Create root categories
  console.log('Creating root sidebar categories...');
  for (const cat of CATEGORIES_DATA) {
    const existing = await client.fetch(`*[_type == "sidebarCategory" && slug.current == $slug][0]._id`, { slug: cat.slug });
    
    const docData = {
      title: cat.title,
      icon: cat.icon,
      position: cat.position,
      description: cat.description,
      collapsed: false,
      collapsible: true,
      targetAudience: cat.targetAudience,
      link: { type: 'generated-index' },
    };

    if (existing) {
      console.log(`  Updating: ${cat.icon} ${cat.title}`);
      const updated = await client.patch(existing).set(docData).commit();
      categoryIdMap.set(cat.slug, updated._id);
    } else {
      const doc = await client.create({
        _type: 'sidebarCategory',
        slug: { _type: 'slug', current: cat.slug },
        ...docData
      });
      categoryIdMap.set(cat.slug, doc._id);
      console.log(`  Created: ${cat.icon} ${cat.title} (position ${cat.position})`);
    }
  }

  // Create documents for each category
  console.log('\nCreating documents...');
  for (const cat of CATEGORIES_DATA) {
    const categoryId = categoryIdMap.get(cat.slug);
    
    for (const docInfo of cat.docs) {
      const existingDoc = await client.fetch(`*[_type == "doc" && slug.current == $slug][0]._id`, { slug: docInfo.slug });
      
      const docData = {
        title: docInfo.title,
        description: docInfo.description,
        targetAudience: cat.targetAudience,
        status: 'published',
        lastUpdated: today,
        sidebarPosition: docInfo.position,
        body: generateBody(docInfo),
      };

      if (existingDoc) {
        console.log(`  Updating: ${docInfo.title} (${docInfo.slug})`);
        await client.patch(existingDoc).set(docData).commit();
      } else {
        console.log(`  Creating: ${docInfo.title} (${docInfo.slug})`);
        await client.create({
          _type: 'doc',
          slug: { _type: 'slug', current: docInfo.slug },
          ...docData
        });
      }
    }
  }

  console.log('\nDone!');
  console.log(`Created ${CATEGORIES_DATA.length} categories`);
  console.log(`Created ${CATEGORIES_DATA.reduce((sum, c) => sum + c.docs.length, 0)} documents`);
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
