const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

// Categories to create
const categories = [
  { name: 'Getting Started', slug: 'getting-started', description: 'Get started with NXGEN GCXONE platform', icon: '🚀', order: 1 },
  { name: 'Platform Fundamentals', slug: 'platform-fundamentals', description: 'Core platform concepts and architecture', icon: '📊', order: 2 },
  { name: 'Admin & Configuration Guide', slug: 'admin-guide', description: 'Administration and configuration guides', icon: '🎛️', order: 3 },
  { name: 'Devices', slug: 'devices', description: 'Device configuration guides for all supported devices', icon: '🔧', order: 4 },
  { name: 'Features', slug: 'features', description: 'Platform features and capabilities', icon: '⚡', order: 5 },
  { name: 'Alarm Management (Talos)', slug: 'alarm-management', description: 'Talos alarm management and monitoring', icon: '🚨', order: 6 },
  { name: 'Reporting & Analytics', slug: 'reporting', description: 'Reports, analytics, and data visualization', icon: '📈', order: 7 },
  { name: 'Operator Guide', slug: 'operator-guide', description: 'Documentation for system operators', icon: '👥', order: 8 },
  { name: 'Installer Guide', slug: 'installer-guide', description: 'Installation and setup guides', icon: '🔧', order: 9 },
  { name: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and solutions', icon: '🛠️', order: 10 },
  { name: 'Knowledge Base', slug: 'knowledge-base', description: 'Technical reference and knowledge articles', icon: '📚', order: 11 },
  { name: 'Release Notes', slug: 'release-notes', description: 'Version history and release notes', icon: '🔄', order: 12 },
  { name: 'Support & Resources', slug: 'support', description: 'Support resources and contact information', icon: '📞', order: 13 }
];

// Sample articles
const articles = [
  {
    title: 'What is NXGEN GCXONE?',
    slug: 'what-is-nxgen-gcxone',
    description: 'Introduction to the NXGEN GCXONE platform and its capabilities',
    content: `# What is NXGEN GCXONE?

## Overview
NXGEN GCXONE is a cloud-based video management and security platform designed for modern security operations.

## Key Features
- Multi-tenant architecture
- Cloud-based deployment
- Support for 16+ device types
- Real-time alarm management
- Advanced AI analytics

## Benefits
- Reduce infrastructure costs
- Scale easily
- Access from anywhere
- Automated updates

## How It Works
GCXONE connects to your security devices through secure proxies, processes events in the cloud, and provides operators with a unified interface for monitoring and response.`,
    categorySlug: 'getting-started',
    role: 'all',
    device_type: 'none',
    difficulty: 'beginner',
    platform: 'gcxone',
    order: 1,
    version: '1.0',
    tags: ['introduction', 'overview', 'getting-started']
  },
  {
    title: 'Creating Customers',
    slug: 'creating-customers',
    description: 'Step-by-step guide to creating customers in GCXONE',
    content: `# Creating Customers in GCXONE

## Overview
Customers represent organizations in the NXGEN GCXONE platform. Each customer can have multiple sites and users.

## Prerequisites
- Admin account access
- Necessary permissions

## Steps

### Step 1: Navigate to Customers
1. Log in to GCXONE admin panel
2. Click **Customers** in the main navigation
3. Click **Create New Customer** button

### Step 2: Enter Customer Details
Fill in the required information:
- **Customer Name**: Organization name
- **Customer Code**: Unique identifier (e.g., ACME001)
- **Contact Email**: Primary contact email
- **Phone Number**: Primary contact phone

### Step 3: Configure Settings
- Select timezone
- Set default language
- Configure branding (optional)

### Step 4: Save
Click **Save** to create the customer.`,
    categorySlug: 'admin-guide',
    role: 'admin',
    device_type: 'none',
    difficulty: 'beginner',
    platform: 'gcxone',
    order: 1,
    version: '1.0',
    tags: ['admin', 'customers', 'configuration']
  },
  {
    title: 'Hikvision - Admin Configuration',
    slug: 'hikvision-admin-configuration',
    description: 'How to configure Hikvision devices in GCXONE as an administrator',
    content: `# Hikvision Device Configuration (Admin)

## Overview
This guide shows administrators how to add and configure Hikvision devices in NXGEN GCXONE.

## Supported Models
- Hikvision NVR (Network Video Recorders)
- Hikvision IP Cameras
- Hikvision DVR (Digital Video Recorders)

## Prerequisites
- Device IP address and credentials
- Network connectivity to device
- Admin access to GCXONE

## Configuration Steps

### Step 1: Add Device
1. Navigate to **Devices** → **Add Device**
2. Select **Hikvision** from device type dropdown
3. Click **Continue**

### Step 2: Enter Connection Details
| Field | Value | Example |
|-------|-------|---------|
| Device Name | Friendly name | "Building A - NVR 1" |
| IP Address | Device IP | 192.168.1.100 |
| Port | RTSP/HTTP port | 8000 |
| Username | Admin username | admin |
| Password | Admin password | ••••••• |

### Step 3: Test Connection
1. Click **Test Connection**
2. Wait for confirmation
3. If successful, click **Save**`,
    categorySlug: 'devices',
    role: 'admin',
    device_type: 'hikvision',
    difficulty: 'intermediate',
    platform: 'gcxone',
    order: 1,
    version: '1.0',
    tags: ['hikvision', 'device-configuration', 'admin']
  },
  {
    title: 'AI Analytics Overview',
    slug: 'ai-analytics-overview',
    description: 'Introduction to AI analytics features in NXGEN GCXONE',
    content: `# AI Analytics Overview

## What is AI Analytics?
AI Analytics uses machine learning to automatically detect and classify objects, people, and events in your video streams.

## Key Features
- Person detection
- Vehicle detection
- Face recognition
- License plate recognition
- Loitering detection
- Line crossing
- Intrusion detection

## Benefits
- Reduce false alarms
- Automated event categorization
- Improved search capabilities
- Proactive threat detection

## Supported Devices
AI Analytics works with most modern IP cameras and NVRs that support metadata streaming.

## Getting Started
1. Enable AI Analytics for your site
2. Configure detection zones
3. Set sensitivity thresholds
4. Test and fine-tune`,
    categorySlug: 'features',
    role: 'all',
    device_type: 'none',
    difficulty: 'intermediate',
    platform: 'gcxone',
    order: 1,
    version: '1.0',
    tags: ['ai', 'analytics', 'features']
  },
  {
    title: 'Connection Issues',
    slug: 'connection-issues',
    description: 'Troubleshooting common connection problems',
    content: `# Troubleshooting Connection Issues

## Common Symptoms
- Unable to connect to devices
- Intermittent connectivity
- Slow response times
- Connection timeouts

## Quick Fixes

### 1. Check Network Connectivity
\`\`\`bash
ping <device_ip_address>
\`\`\`
Should receive responses. If not, network issue.

### 2. Verify Credentials
- Ensure username and password are correct
- Check for caps lock
- Try logging in directly to device

### 3. Check Firewall
- Verify required ports are open
- Check firewall logs
- Temporarily disable to test

### 4. Restart Services
- Restart device
- Restart GCXONE proxy
- Clear browser cache

## When to Escalate
- Issues persist after 30 minutes
- Multiple devices affected
- Recent network changes
- Suspected security breach`,
    categorySlug: 'troubleshooting',
    role: 'all',
    device_type: 'none',
    difficulty: 'beginner',
    platform: 'both',
    order: 1,
    version: '1.0',
    tags: ['troubleshooting', 'connection', 'network']
  }
];

async function createCategories() {
  console.log('Creating categories...');
  const createdCategories = {};
  
  for (const category of categories) {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/categories`, {
        data: category
      });
      createdCategories[category.slug] = response.data.data.id;
      console.log(`✓ Created category: ${category.name}`);
    } catch (error) {
      console.error(`✗ Failed to create category ${category.name}:`, error.response?.data || error.message);
    }
  }
  
  return createdCategories;
}

async function createArticles(categoryMap) {
  console.log('\nCreating articles...');
  
  for (const article of articles) {
    try {
      const categoryId = categoryMap[article.categorySlug];
      if (!categoryId) {
        console.error(`✗ Category not found for ${article.title}`);
        continue;
      }
      
      const response = await axios.post(`${STRAPI_URL}/api/documentation-articles`, {
        data: {
          ...article,
          category: categoryId,
          publishedAt: new Date().toISOString()
        }
      });
      console.log(`✓ Created article: ${article.title}`);
    } catch (error) {
      console.error(`✗ Failed to create article ${article.title}:`, error.response?.data || error.message);
    }
  }
}

async function configurePermissions() {
  console.log('\n⚠️  Manual step required: Configure API permissions');
  console.log('1. Go to http://localhost:1337/admin');
  console.log('2. Settings → Users & Permissions → Roles → Public');
  console.log('3. Enable find, findOne for Category and Documentation-article');
  console.log('4. Click Save');
}

async function main() {
  console.log('🚀 Starting Strapi setup...\n');
  
  try {
    // Test connection
    await axios.get(`${STRAPI_URL}/api/categories`);
    console.log('✓ Connected to Strapi\n');
    
    // Create categories
    const categoryMap = await createCategories();
    
    // Create articles
    await createArticles(categoryMap);
    
    console.log('\n✅ Setup complete!');
    console.log('\n📋 Next steps:');
    configurePermissions();
    console.log('\n5. Generate API token: Settings → API Tokens → Create new');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to Strapi. Make sure it\'s running:');
      console.error('   cd strapi-cms && npm run develop');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

main();
