/**
 * Create Initial Categories Script
 * Run this AFTER content types are created
 * Run with: node scripts/create-categories.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

// Initial categories to create
const categories = [
  { name: 'Getting Started', slug: 'getting-started', order: 1, icon: '🚀', description: 'Get started with NXGEN GCXONE' },
  { name: 'Platform Fundamentals', slug: 'platform-fundamentals', order: 2, icon: '📊', description: 'Core platform concepts' },
  { name: 'Admin Guide', slug: 'admin-guide', order: 3, icon: '🎛️', description: 'Administration and configuration' },
  { name: 'Devices', slug: 'devices', order: 4, icon: '🔧', description: 'Device configuration guides' },
  { name: 'Features', slug: 'features', order: 5, icon: '⚡', description: 'Platform features' },
  { name: 'Alarm Management', slug: 'alarm-management', order: 6, icon: '🚨', description: 'Talos alarm management' },
  { name: 'Reporting', slug: 'reporting', order: 7, icon: '📈', description: 'Reports and analytics' },
  { name: 'Operator Guide', slug: 'operator-guide', order: 8, icon: '👥', description: 'Operator documentation' },
  { name: 'Installer Guide', slug: 'installer-guide', order: 9, icon: '🔧', description: 'Installation guides' },
  { name: 'Troubleshooting', slug: 'troubleshooting', order: 10, icon: '🛠️', description: 'Troubleshooting guides' },
  { name: 'Knowledge Base', slug: 'knowledge-base', order: 11, icon: '📚', description: 'Technical reference' },
  { name: 'Release Notes', slug: 'release-notes', order: 12, icon: '🔄', description: 'Version history' },
  { name: 'Support', slug: 'support', order: 13, icon: '📞', description: 'Support resources' }
];

async function createCategories() {
  console.log('🚀 Creating initial categories in Strapi...\n');

  // First, we need to get an API token or use public endpoint
  // For now, categories should be created through admin panel or with proper auth

  console.log('📋 Categories to create:');
  console.log('------------------------\n');

  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.icon} ${cat.name}`);
    console.log(`   Slug: ${cat.slug}`);
    console.log(`   Order: ${cat.order}`);
    console.log('');
  });

  console.log('\n⚠️  Note: This script requires API authentication.');
  console.log('👉 Please create these categories manually in Strapi admin panel:');
  console.log('   1. Go to http://localhost:1337/admin');
  console.log('   2. Click "Content Manager" → "Categories"');
  console.log('   3. Click "Create new entry" for each category above');
  console.log('   4. Fill in: name, slug, description, icon, order');
  console.log('   5. Click "Save"');
  console.log('\n✅ Once done, you can proceed with creating articles!');
}

createCategories();
