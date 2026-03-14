#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const projectId = 'fjjuacab';
const dataset = 'production';
const apiToken = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-06',
  token: apiToken,
  useCdn: false,
});

const today = new Date().toISOString().slice(0, 10);

async function getFeaturedCategoryIds() {
  console.log('Fetching sidebar categories...');
  
  const categories = await client.fetch(`
    *[_type == "sidebarCategory" && !defined(parent)] | order(position asc) {
      _id,
      title,
      slug,
      icon,
      position
    }
  `);
  
  console.log(`Found ${categories.length} main categories`);
  
  const featuredSlugs = [
    'getting-started',
    'devices',
    'features',
    'admin-guide',
  ];
  
  const featuredCategories = featuredSlugs
    .map(slug => categories.find(c => c.slug?.current === slug))
    .filter(Boolean)
    .map(cat => ({
      _key: `featured-cat-${cat._id.slice(0, 8)}`,
      _type: 'reference',
      _ref: cat._id,
    }));
  
  if (featuredCategories.length < featuredSlugs.length) {
    const foundSlugs = featuredCategories.map(fc => {
      const cat = categories.find(c => c._id === fc._ref);
      return cat?.slug?.current;
    }).filter(Boolean);
    console.log(`Warning: Only found ${featuredCategories.length} of ${featuredSlugs.length} featured categories`);
    console.log(`Found: ${foundSlugs.join(', ')}`);
    
    if (featuredCategories.length === 0) {
      console.log('Using first 4 available categories instead...');
      return categories.slice(0, 4).map(cat => ({
        _key: `featured-cat-${cat._id.slice(0, 8)}`,
        _type: 'reference',
        _ref: cat._id,
      }));
    }
  }
  
  return featuredCategories;
}

async function seedDocsIndexConfig() {
  console.log('Seeding Docs Index Configuration to Sanity...\n');
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}\n`);
  
  const featuredCategories = await getFeaturedCategoryIds();
  
  const docsIndexConfig = {
    _id: 'docs-index-config',
    _type: 'docsIndexConfig',
    hero: {
      title: 'Documentation Center',
      subtitle: 'Your gateway to NXGEN GCXONE',
      badge: {
        icon: 'BookOpen',
        text: 'Documentation',
      },
    },
    quickLinks: [
      {
        _key: 'quick-link-getting-started',
        _type: 'docsQuickLink',
        icon: 'Rocket',
        title: 'Getting Started',
        description: 'Start your journey with NXGEN GCXONE platform guides and tutorials',
        href: '/getting-started',
        color: '#10B981',
      },
      {
        _key: 'quick-link-integration-hub',
        _type: 'docsQuickLink',
        icon: 'Plug',
        title: 'Integration Hub',
        description: 'Connect and configure your devices with our comprehensive integration guides',
        href: '/integration-hub',
        color: '#3B82F6',
      },
      {
        _key: 'quick-link-video-tutorials',
        _type: 'docsQuickLink',
        icon: 'Video',
        title: 'Video Tutorials',
        description: 'Watch step-by-step video guides to master the platform',
        href: '/video-tutorials',
        color: '#8B5CF6',
      },
      {
        _key: 'quick-link-contact-support',
        _type: 'docsQuickLink',
        icon: 'MessageCircle',
        title: 'Contact Support',
        description: 'Get help from our support team when you need it',
        href: '/contact',
        color: '#F59E0B',
      },
    ],
    featuredCategories,
    quickAccessBanner: {
      text: 'Return to Home',
      href: '/',
      icon: 'Home',
      position: 'top-right',
      variant: 'subtle',
    },
    status: 'published',
    publishedAt: today,
    lastUpdated: today,
  };
  
  try {
    const existing = await client.fetch(`*[_id == "docs-index-config"][0]`);
    
    if (existing) {
      console.log('Updating existing Docs Index Configuration...');
      await client.createOrReplace(docsIndexConfig);
      console.log('Updated: Docs Index Configuration');
    } else {
      console.log('Creating new Docs Index Configuration...');
      await client.createIfNotExists(docsIndexConfig);
      console.log('Created: Docs Index Configuration');
    }
    
    console.log('\nSeeding complete!');
    console.log('\nConfiguration includes:');
    console.log('  - Hero: "Documentation Center" with subtitle');
    console.log('  - 4 Quick Links:');
    console.log('    - Getting Started -> /getting-started');
    console.log('    - Integration Hub -> /integration-hub');
    console.log('    - Video Tutorials -> /video-tutorials');
    console.log('    - Contact Support -> /contact');
    console.log(`  - ${featuredCategories.length} Featured Categories`);
    console.log('  - Quick Access Banner: "Return to Home" -> / (top-right)');
    
  } catch (err) {
    console.error('Error seeding Docs Index Configuration:', err.message);
    process.exit(1);
  }
}

seedDocsIndexConfig().catch(console.error);
