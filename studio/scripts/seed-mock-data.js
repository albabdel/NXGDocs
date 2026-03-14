/**
 * Seed Mock Data for NXGEN Docs Sanity Studio
 * Run with: node studio/scripts/seed-mock-data.js
 * 
 * This script creates example documents to demonstrate the editor experience.
 */

import Sanity from '@sanity/client'
import 'dotenv/config'

const client = Sanity({
  projectId: 'fjjuacab',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN || 'sk4judOL9dJ90sD7jePFexn0HuOMVPcpYhfTWEpjzxvVJynL3WO6nLrlfB1kRrrwfzs7oP302LPZyQfNdPKVZOn7Fi448Z42JB15hzeEVLHJ1gJUYTolwAxvmFoGBZvXyYOBB9yYTejOvK9z2oqUEoS9ai7LlAYlmf4ZnYAmYyQBtDYPwi3C',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const sidebarCategories = [
  {
    _type: 'sidebarCategory',
    title: 'Getting Started',
    slug: { _type: 'slug', current: 'getting-started' },
    description: 'Everything you need to get up and running with NXGEN',
    icon: 'RocketLaunch',
    position: 1,
    collapsed: false,
    collapsible: true,
    targetAudience: ['all'],
  },
  {
    _type: 'sidebarCategory',
    title: 'Platform Fundamentals',
    slug: { _type: 'slug', current: 'platform-fundamentals' },
    description: 'Core concepts and architecture of the NXGEN platform',
    icon: 'CpuChip',
    position: 2,
    collapsed: false,
    collapsible: true,
    targetAudience: ['all'],
  },
  {
    _type: 'sidebarCategory',
    title: 'Devices',
    slug: { _type: 'slug', current: 'devices' },
    description: 'Device management, configuration, and troubleshooting',
    icon: 'Tv',
    position: 3,
    collapsed: true,
    collapsible: true,
    targetAudience: ['all'],
  },
  {
    _type: 'sidebarCategory',
    title: 'Alarm Management',
    slug: { _type: 'slug', current: 'alarm-management' },
    description: 'Configure and manage alarms, notifications, and responses',
    icon: 'Bell',
    position: 4,
    collapsed: true,
    collapsible: true,
    targetAudience: ['admin', 'manager', 'operator'],
  },
  {
    _type: 'sidebarCategory',
    title: 'API Reference',
    slug: { _type: 'slug', current: 'api-reference' },
    description: 'REST API and integration documentation',
    icon: 'CodeBracket',
    position: 5,
    collapsed: true,
    collapsible: true,
    targetAudience: ['admin', 'internal'],
  },
]

const exampleDocs = [
  {
    _type: 'doc',
    _id: 'doc-quick-start-guide',
    title: 'Quick Start Guide',
    slug: { _type: 'slug', current: 'quick-start-guide' },
    description: 'Get up and running with NXGEN in under 10 minutes. This guide walks you through the essential first steps.',
    status: 'published',
    targetAudience: ['all'],
    sidebarPosition: 1,
    body: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'span1', text: 'Welcome to NXGEN! This quick start guide will help you get familiar with the platform in just a few minutes.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'callout',
        _key: 'callout1',
        type: 'tip',
        title: 'Pro Tip',
        body: [
          {
            _type: 'block',
            _key: 'calloutblock1',
            children: [{ _type: 'span', _key: 'calloutspan1', text: 'Bookmark this page for quick reference as you explore the platform.', marks: [] }],
            markDefs: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'block2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span2', text: 'Prerequisites', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block3',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span3', text: 'Valid NXGEN account credentials', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block4',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span4', text: 'Modern web browser (Chrome, Firefox, Edge, Safari)', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block5',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'span5', text: 'Network access to your NXGEN deployment', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block6',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span6', text: 'Step 1: Log In', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block7',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span7', text: 'Navigate to your NXGEN instance URL and enter your credentials. If you don\'t have an account, contact your administrator.', marks: [] },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block8',
        style: 'h2',
        children: [{ _type: 'span', _key: 'span8', text: 'Step 2: Explore the Dashboard', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'block9',
        style: 'normal',
        children: [{ _type: 'span', _key: 'span9', text: 'The main dashboard provides an overview of your system status, recent activity, and quick access to key features.', marks: [] }],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'doc',
    _id: 'doc-platform-architecture',
    title: 'Platform Architecture Overview',
    slug: { _type: 'slug', current: 'platform-architecture-overview' },
    description: 'Understanding the core components and architecture of the NXGEN platform.',
    status: 'published',
    targetAudience: ['all'],
    sidebarPosition: 2,
    body: [
      {
        _type: 'block',
        _key: 'archblock1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'archspan1', text: 'NXGEN is built on a modern, scalable architecture designed for reliability and performance.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'archblock2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'archspan2', text: 'Core Components', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'archblock3',
        style: 'normal',
        children: [{ _type: 'span', _key: 'archspan3', text: 'The platform consists of several key components that work together:', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'mermaidDiagram',
        _key: 'mermaid1',
        type: 'flowchart',
        code: `flowchart TD
    A[User Interface] --> B[API Gateway]
    B --> C[Core Services]
    B --> D[Device Manager]
    B --> E[Alarm Engine]
    C --> F[(Database)]
    D --> G[Connected Devices]
    E --> H[Notification Service]`,
        caption: 'NXGEN Platform Architecture',
      },
    ],
  },
]

const exampleArticles = [
  {
    _type: 'article',
    _id: 'article-alarm-best-practices',
    title: 'Best Practices for Alarm Configuration',
    slug: { _type: 'slug', current: 'best-practices-alarm-configuration' },
    description: 'Learn the recommended approaches for setting up effective alarm systems in NXGEN.',
    author: 'NXGEN Team',
    status: 'published',
    featured: true,
    tags: ['alarms', 'configuration', 'best-practices'],
    body: [
      {
        _type: 'block',
        _key: 'articleblock1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'articlespan1', text: 'Effective alarm configuration is crucial for maintaining operational awareness. This article covers proven strategies and best practices.', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'articleblock2',
        style: 'h2',
        children: [{ _type: 'span', _key: 'articlespan2', text: 'Understanding Alarm Priority Levels', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'articleblock3',
        style: 'normal',
        children: [{ _type: 'span', _key: 'articlespan3', text: 'NXGEN supports multiple priority levels to help you categorize and respond to events appropriately:', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'articleblock4',
        style: 'normal',
        listItem: 'bullet',
        children: [
          { _type: 'span', _key: 'articlespan4a', text: 'Critical', marks: ['strong'] },
          { _type: 'span', _key: 'articlespan4b', text: ' - Requires immediate attention', marks: [] },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'articleblock5',
        style: 'normal',
        listItem: 'bullet',
        children: [
          { _type: 'span', _key: 'articlespan5a', text: 'Warning', marks: ['strong'] },
          { _type: 'span', _key: 'articlespan5b', text: ' - Should be addressed within the shift', marks: [] },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'articleblock6',
        style: 'normal',
        listItem: 'bullet',
        children: [
          { _type: 'span', _key: 'articlespan6a', text: 'Info', marks: ['strong'] },
          { _type: 'span', _key: 'articlespan6b', text: ' - Informational only', marks: [] },
        ],
        markDefs: [],
      },
      {
        _type: 'callout',
        _key: 'articlecallout1',
        type: 'warning',
        title: 'Avoid Alarm Fatigue',
        body: [
          {
            _type: 'block',
            _key: 'articlecalloutblock1',
            children: [{ _type: 'span', _key: 'articlecalloutspan1', text: 'Too many low-priority alarms can lead to alarm fatigue. Only create alarms for conditions that require action.', marks: [] }],
            markDefs: [],
          },
        ],
      },
    ],
  },
]

const exampleReleaseNotes = [
  {
    _type: 'releaseNote',
    _id: 'release-v3-12-0',
    title: 'Version 3.12.0 - Enhanced Dashboard Features',
    slug: { _type: 'slug', current: 'v3-12-0-enhanced-dashboard' },
    version: '3.12.0',
    sprintId: '2026-01-a',
    status: 'published',
    publishedAt: '2026-01-15',
    changeType: ['feature', 'improvement'],
    affectedAreas: ['studio', 'reporting'],
    body: [
      {
        _type: 'block',
        _key: 'releaseblock1',
        style: 'h2',
        children: [{ _type: 'span', _key: 'releasespan1', text: 'New Features', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'releaseblock2',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'releasespan2', text: 'New customizable dashboard widgets', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'releaseblock3',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'releasespan3', text: 'Real-time data refresh options', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'releaseblock4',
        style: 'h2',
        children: [{ _type: 'span', _key: 'releasespan4', text: 'Improvements', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'releaseblock5',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'releasespan5', text: 'Faster page load times (up to 40% improvement)', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'releaseblock6',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', _key: 'releasespan6', text: 'Improved accessibility for screen readers', marks: [] }],
        markDefs: [],
      },
    ],
  },
]

const exampleLandingPage = {
  _type: 'landingPage',
  _id: 'landing-quick-start',
  title: 'Quick Start',
  slug: { _type: 'slug', current: 'quick-start' },
  description: 'Get started with NXGEN quickly with our comprehensive quick start guides and tutorials.',
  status: 'published',
  layoutType: 'quick-start',
  showBackground: true,
  hero: {
    headline: 'Get Started with NXGEN',
    subheadline: 'Everything you need to set up, configure, and master the NXGEN platform',
    badge: {
      icon: 'Zap',
      text: '10 min setup',
    },
    ctaButtons: [
      { _key: 'cta1', label: 'Start Tutorial', href: '/docs/quick-start-guide', variant: 'primary' },
      { _key: 'cta2', label: 'Watch Demo', href: '/video-tutorials', variant: 'secondary' },
    ],
  },
  sections: [
    {
      _type: 'landingSectionFeatures',
      _key: 'features1',
      title: 'Quick Start Paths',
      columns: 3,
      features: [
        { _key: 'feat1', icon: 'User', title: 'For Operators', description: 'Learn the basics of monitoring and responding to events', color: '#10B981' },
        { _key: 'feat2', icon: 'Settings', title: 'For Admins', description: 'Configure users, devices, and system settings', color: '#6366F1' },
        { _key: 'feat3', icon: 'BarChart', title: 'For Managers', description: 'Set up reports, dashboards, and analytics', color: '#F59E0B' },
      ],
    },
  ],
}

async function createIfNotExists(doc) {
  try {
    const existing = await client.getDocument(doc._id)
    if (existing) {
      console.log(`  ✓ ${doc._id} already exists, updating...`)
      const { _id, _type, ...updateData } = doc
      return await client.patch(doc._id).set(updateData).commit()
    }
  } catch {
    // Document doesn't exist, create it
  }
  return await client.create(doc)
}

async function seed() {
  console.log('🌱 Seeding mock data to Sanity...\n')
  console.log('📡 Project: fjjuacab')
  console.log('📡 Dataset: production\n')
  
  try {
    // Seed sidebar categories
    console.log('📁 Creating sidebar categories...')
    for (const category of sidebarCategories) {
      const doc = { ...category, _id: `category-${category.slug.current}` }
      await createIfNotExists(doc)
      console.log(`  ✓ ${category.title}`)
    }
    
    // Update docs with sidebar category references
    const docs = exampleDocs.map(doc => ({
      ...doc,
      sidebarCategory: { _type: 'reference', _ref: 'category-getting-started' }
    }))
    
    // Seed documents
    console.log('\n📄 Creating example documents...')
    for (const doc of docs) {
      await createIfNotExists(doc)
      console.log(`  ✓ ${doc.title}`)
    }
    
    // Seed articles
    console.log('\n📰 Creating example articles...')
    for (const article of exampleArticles) {
      await createIfNotExists(article)
      console.log(`  ✓ ${article.title}`)
    }
    
    // Seed release notes
    console.log('\n📋 Creating example release notes...')
    for (const note of exampleReleaseNotes) {
      await createIfNotExists(note)
      console.log(`  ✓ ${note.title}`)
    }
    
    // Seed landing page
    console.log('\n🚀 Creating example landing page...')
    await createIfNotExists(exampleLandingPage)
    console.log(`  ✓ ${exampleLandingPage.title}`)
    
    console.log('\n✅ Seed complete!')
    console.log('\n🌐 Visit your studio at: https://nxgen-docs.sanity.studio/')
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message)
    if (error.response) {
      console.error('Details:', JSON.stringify(error.response.body, null, 2))
    }
    process.exit(1)
  }
}

seed()
