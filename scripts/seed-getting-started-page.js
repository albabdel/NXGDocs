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

const gettingStartedPage = {
  _id: 'landing-page-getting-started',
  _type: 'landingPage',
  title: 'Getting Started',
  slug: { _type: 'slug', current: 'getting-started' },
  description: 'Your complete guide to getting started with GCXONE - from first login to full operational readiness',
  layoutType: 'quick-start',
  showBackground: true,
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Getting Started' }
  ],
  hero: {
    badge: { icon: 'Rocket', text: 'Welcome' },
    headline: 'Welcome to GCXONE',
    subheadline: 'Your complete guide to getting started with the next-generation monitoring platform',
    ctaButtons: [
      { label: 'Watch Overview', href: '#overview-video', variant: 'primary' },
      { label: 'Browse Docs', href: '/docs', variant: 'secondary' }
    ]
  },
  sections: [
    {
      _type: 'landingSectionVideo',
      _key: 'hero-video',
      title: 'Platform Overview',
      description: 'Get started with a comprehensive overview of GCXONE capabilities',
      videoSource: 'embed',
      videoUrl: 'https://www.youtube.com/watch?v=I7dccOLTOsk',
      videoTitle: 'GCXONE Platform Overview',
      videoDescription: 'Introduction to GCXONE monitoring platform and core features'
    },
    {
      _type: 'landingSectionFeatures',
      _key: 'quick-start-steps',
      title: 'Quick Start Steps',
      description: 'Follow these steps to get up and running quickly',
      columns: 4,
      features: [
        {
          icon: 'PlayCircle',
          title: 'Watch Overview Video',
          description: 'Get a complete overview of the platform and its capabilities',
          color: '#3B82F6',
          value: '10 min',
          link: 'https://www.youtube.com/watch?v=ER-tnAvGXow'
        },
        {
          icon: 'User',
          title: 'Configure Your Account',
          description: 'Set up your first-time login and security settings',
          color: '#10B981',
          value: 'Step 2',
          link: '/docs/getting-started/first-time-login--access'
        },
        {
          icon: 'Building2',
          title: 'Set Up Organization',
          description: 'Create your hierarchy with regions, clusters, and sites',
          color: '#8B5CF6',
          value: 'Step 3',
          link: '/docs/getting-started/organization--hierarchy-setup'
        },
        {
          icon: 'Cpu',
          title: 'Add Your First Device',
          description: 'Connect devices and start monitoring your infrastructure',
          color: '#F59E0B',
          value: 'Step 4',
          link: '/integration-hub'
        }
      ]
    },
    {
      _type: 'landingSectionSteps',
      _key: 'onboarding-phases',
      title: 'Onboarding Phases',
      description: 'Complete these phases to achieve full operational readiness',
      phases: [
        {
          phaseNumber: 1,
          title: 'Initial Setup',
          description: 'Get started with your first-time configuration',
          steps: [
            { stepNumber: 1, title: 'First-time login', description: 'Access the platform and complete initial authentication' },
            { stepNumber: 2, title: 'Security settings', description: 'Configure password policies and two-factor authentication' },
            { stepNumber: 3, title: 'Profile configuration', description: 'Set up your user profile and preferences' }
          ]
        },
        {
          phaseNumber: 2,
          title: 'Organization Structure',
          description: 'Build your monitoring hierarchy',
          steps: [
            { stepNumber: 4, title: 'Create hierarchy', description: 'Define your organizational structure with regions and clusters' },
            { stepNumber: 5, title: 'Define zones', description: 'Set up geographic or operational zones for your sites' },
            { stepNumber: 6, title: 'Set up sites', description: 'Add monitoring stations to your hierarchy' }
          ]
        },
        {
          phaseNumber: 3,
          title: 'User Management',
          description: 'Configure access control and team members',
          steps: [
            { stepNumber: 7, title: 'Create roles', description: 'Define roles with appropriate permissions for your team' },
            { stepNumber: 8, title: 'Invite users', description: 'Send invitations to team members' },
            { stepNumber: 9, title: 'Assign permissions', description: 'Grant access to stations and features based on roles' }
          ]
        },
        {
          phaseNumber: 4,
          title: 'Device Integration',
          description: 'Connect your monitoring equipment',
          steps: [
            { stepNumber: 10, title: 'Add devices', description: 'Register sensors, cameras, and controllers' },
            { stepNumber: 11, title: 'Configure settings', description: 'Set up communication protocols and polling intervals' },
            { stepNumber: 12, title: 'Test connectivity', description: 'Verify data is flowing correctly from all devices' }
          ]
        },
        {
          phaseNumber: 5,
          title: 'Operations Ready',
          description: 'Start monitoring and responding to events',
          steps: [
            { stepNumber: 13, title: 'Alarm processing', description: 'Configure alert rules and notification channels' },
            { stepNumber: 14, title: 'Dashboard setup', description: 'Create custom dashboards for your monitoring needs' },
            { stepNumber: 15, title: 'Monitoring workflows', description: 'Establish operational procedures for incident response' }
          ]
        }
      ]
    },
    {
      _type: 'landingSectionTabs',
      _key: 'video-resources',
      title: 'Video Resources',
      description: 'Watch these tutorials to learn about different aspects of GCXONE',
      tabs: [
        {
          id: 'login-setup',
          label: 'First-Time Login',
          icon: 'LogIn',
          content: {
            title: 'First-Time Login Setup',
            description: 'Learn how to access and configure your account',
            items: [
              { icon: 'Play', title: 'First-Time Login Setup', description: 'Complete walkthrough of initial login process', status: 'YouTube', value: 'I7dccOLTOsk' }
            ]
          }
        },
        {
          id: 'product-overview',
          label: 'Product Overview',
          icon: 'LayoutDashboard',
          content: {
            title: 'GCXONE Product Overview',
            description: 'Comprehensive overview of platform features',
            items: [
              { icon: 'Play', title: 'GCXONE Product Overview', description: 'Full platform capabilities demonstration', status: 'YouTube', value: 'ER-tnAvGXow' }
            ]
          }
        },
        {
          id: 'platform-walkthrough',
          label: 'Platform Walkthrough',
          icon: 'Compass',
          content: {
            title: 'Platform Walkthrough',
            description: 'Detailed navigation and feature exploration',
            items: [
              { icon: 'Play', title: 'Platform Walkthrough', description: 'Guided tour of all major platform sections', status: 'YouTube', value: 'p--04PIIO-M' }
            ]
          }
        },
        {
          id: 'dashboard-deep-dive',
          label: 'Dashboard Deep Dive',
          icon: 'BarChart3',
          content: {
            title: 'Dashboard Deep Dive',
            description: 'Master dashboard creation and customization',
            items: [
              { icon: 'Play', title: 'Dashboard Deep Dive', description: 'Advanced dashboard configuration techniques', status: 'YouTube', value: 'AxHOF8cV88Q' }
            ]
          }
        },
        {
          id: 'tower-management',
          label: 'Tower Management',
          icon: 'RadioTower',
          content: {
            title: 'Tower Management',
            description: 'Managing tower sites and equipment',
            items: [
              { icon: 'Play', title: 'Tower Management', description: 'Complete guide to tower monitoring', status: 'YouTube', value: 'H2WhN1p3x9E' }
            ]
          }
        }
      ]
    },
    {
      _type: 'landingSectionContentGrid',
      _key: 'featured-articles',
      title: 'Featured Articles',
      description: 'Essential documentation to guide your onboarding journey',
      columns: 2,
      items: [
        {
          icon: 'FileText',
          title: 'What is GCXONE',
          description: 'Introduction to the platform, its architecture, and core capabilities',
          link: '/docs/getting-started/what-is-gcxone',
          listItems: ['Platform overview', 'Core features', 'Architecture basics']
        },
        {
          icon: 'ClipboardList',
          title: 'Pre-deployment Requirements',
          description: 'Technical requirements and preparation checklist before deployment',
          link: '/docs/getting-started/pre-deployment-requirements',
          listItems: ['Network requirements', 'Hardware specs', 'Security considerations']
        },
        {
          icon: 'LogIn',
          title: 'First-time Login & Access',
          description: 'Step-by-step guide for your initial platform access and setup',
          link: '/docs/getting-started/first-time-login--access',
          listItems: ['Account activation', 'Password setup', 'Security settings']
        },
        {
          icon: 'Building2',
          title: 'Organization & Hierarchy Setup',
          description: 'Configure your organizational structure and monitoring hierarchy',
          link: '/docs/getting-started/organization--hierarchy-setup',
          listItems: ['Create organization', 'Define regions', 'Set up clusters']
        },
        {
          icon: 'Users',
          title: 'User Management Setup',
          description: 'Create roles, invite users, and configure permissions',
          link: '/docs/getting-started/user-management-setup',
          listItems: ['Role creation', 'User invitations', 'Permission assignment']
        },
        {
          icon: 'CheckSquare',
          title: 'Quick Start Checklist',
          description: 'Complete checklist to ensure successful onboarding',
          link: '/docs/getting-started/quick-start-checklist',
          listItems: ['Setup tasks', 'Configuration steps', 'Verification items']
        }
      ]
    },
    {
      _type: 'landingSectionCTA',
      _key: 'getting-started-cta',
      title: 'Ready to Get Started?',
      description: 'Begin your GCXONE journey today with our comprehensive onboarding resources.',
      buttons: [
        { label: 'Start Onboarding', href: '/docs/getting-started/first-time-login--access', variant: 'primary' },
        { label: 'Browse All Docs', href: '/docs', variant: 'secondary' }
      ]
    }
  ],
  status: 'published',
  publishedAt: today,
  lastUpdated: today
};

async function seedGettingStartedPage() {
  console.log('Seeding Getting Started landing page to Sanity...\n');
  
  try {
    const existing = await client.fetch(`*[_id == "landing-page-getting-started"][0]`);
    
    if (existing) {
      console.log('Updating existing Getting Started page...');
      await client.createOrReplace(gettingStartedPage);
      console.log('Updated: Getting Started (/getting-started)');
    } else {
      console.log('Creating new Getting Started page...');
      await client.createIfNotExists(gettingStartedPage);
      console.log('Created: Getting Started (/getting-started)');
    }
    
    console.log('\nSeeding complete!');
    console.log('\nPage sections:');
    console.log('  - Hero with overview video (I7dccOLTOsk)');
    console.log('  - 4 Quick Start Steps');
    console.log('  - 5 Onboarding Phases (15 total steps)');
    console.log('  - 5 Video Resources tabs');
    console.log('  - 6 Featured Articles');
    console.log('  - Call-to-Action section');
    
  } catch (err) {
    console.error('Error seeding Getting Started page:', err.message);
    process.exit(1);
  }
}

seedGettingStartedPage().catch(console.error);
