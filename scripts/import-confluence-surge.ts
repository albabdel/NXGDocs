#!/usr/bin/env node
// scripts/import-confluence-surge.ts
// Import Confluence Surge space content to Sanity

import { 
  fetchSpaceContent, 
  fetchSpaceInfo, 
  type ConfluencePage,
  type ConfluenceEnv 
} from '../functions/lib/confluence-service';
import { createClient } from '@sanity/client';
import { CONFLUENCE_SURGE_CONFIG } from './import-confluence-surge-config';

// ============================================================================
// Environment Validation
// ============================================================================

interface ImportEnv {
  // Confluence credentials
  CONFLUENCE_EMAIL: string;
  CONFLUENCE_API_TOKEN: string;
  CONFLUENCE_SITE_URL: string;
  CONFLUENCE_SPACE_KEY: string;
  // Sanity credentials
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_TOKEN: string;
}

function validateEnvironment(): ImportEnv {
  const required = [
    'CONFLUENCE_EMAIL',
    'CONFLUENCE_API_TOKEN',
    'CONFLUENCE_SITE_URL',
    'CONFLUENCE_SPACE_KEY',
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_TOKEN',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set the following environment variables:');
    console.error('  Confluence:');
    console.error('    CONFLUENCE_EMAIL=<your-atlassian-email>');
    console.error('    CONFLUENCE_API_TOKEN=<your-api-token>');
    console.error('    CONFLUENCE_SITE_URL=https://nxgen-team-f1bs1n7p.atlassian.net');
    console.error('    CONFLUENCE_SPACE_KEY=Surge');
    console.error('  Sanity:');
    console.error('    SANITY_PROJECT_ID=fjjuacab');
    console.error('    SANITY_DATASET=production');
    console.error('    SANITY_TOKEN=<from Keys.md>');
    process.exit(1);
  }

  return {
    CONFLUENCE_EMAIL: process.env.CONFLUENCE_EMAIL!,
    CONFLUENCE_API_TOKEN: process.env.CONFLUENCE_API_TOKEN!,
    CONFLUENCE_SITE_URL: process.env.CONFLUENCE_SITE_URL!,
    CONFLUENCE_SPACE_KEY: process.env.CONFLUENCE_SPACE_KEY!,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID!,
    SANITY_DATASET: process.env.SANITY_DATASET!,
    SANITY_TOKEN: process.env.SANITY_TOKEN!,
  };
}

// ============================================================================
// Sanity Client
// ============================================================================

function createSanityClient(env: ImportEnv) {
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    token: env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });
}

// ============================================================================
// Content Transformation
// ============================================================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .slice(0, 200);
}

function transformConfluenceToPortableText(content: string): any[] {
  // Basic transformation from Confluence storage format to Portable Text
  // This is a simplified version - full implementation would need to parse
  // Confluence's XML-like storage format
  
  const blocks: any[] = [];
  
  // Extract text content (basic implementation)
  // TODO: Implement full Confluence storage format parser
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
  
  if (textContent) {
    blocks.push({
      _type: 'block',
      _key: `block-${Date.now()}`,
      children: [
        {
          _type: 'span',
          _key: `span-${Date.now()}`,
          text: textContent,
          marks: [],
        }
      ],
      markDefs: [],
      style: 'normal',
    });
  }
  
  return blocks;
}

interface SanityDoc {
  _type: 'doc';
  title: string;
  slug: { _type: 'slug'; current: string };
  product: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  body: any[];
  description?: string;
  tags?: string[];
  sidebarCategory?: { _type: 'reference'; _ref: string };
  sidebarPosition?: number;
  targetAudience?: string[];
  workflowConfig?: {
    source: 'confluence';
    confluencePageId?: string;
    importedAt?: string;
  };
}

function transformPageToSanityDoc(page: ConfluencePage, content: string): SanityDoc {
  const slug = generateSlug(page.title);
  const status = page.status === 'current' ? 'published' : 'draft';
  
  return {
    _type: 'doc',
    title: page.title,
    slug: {
      _type: 'slug',
      current: slug,
    },
    product: CONFLUENCE_SURGE_CONFIG.sanity.productId,
    status,
    body: transformConfluenceToPortableText(content),
    targetAudience: ['all'],
    sidebarPosition: 99,
    workflowConfig: {
      source: 'confluence',
      confluencePageId: page.id,
      importedAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// Page Content Fetching
// ============================================================================

async function fetchPageContent(
  pageId: string, 
  env: ConfluenceEnv
): Promise<string> {
  const baseUrl = env.CONFLUENCE_SITE_URL.replace(/\/$/, '');
  // Use Node.js Buffer for Base64 encoding (btoa is browser-only)
  const credentials = Buffer.from(
    `${env.CONFLUENCE_EMAIL}:${env.CONFLUENCE_API_TOKEN}`
  ).toString('base64');
  
  const response = await fetch(
    `${baseUrl}/wiki/rest/api/content/${pageId}?expand=body.storage`,
    {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${pageId}: ${response.status}`);
  }
  
  const data = await response.json() as { body?: { storage?: { value?: string } } };
  return data.body?.storage?.value || '';
}

// ============================================================================
// Main Import Logic
// ============================================================================

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
  pageMapping: Map<string, string>;
}

async function importSurgeContent(env: ImportEnv): Promise<ImportResult> {
  const sanityClient = createSanityClient(env);
  const confluenceEnv: ConfluenceEnv = {
    CONFLUENCE_EMAIL: env.CONFLUENCE_EMAIL,
    CONFLUENCE_API_TOKEN: env.CONFLUENCE_API_TOKEN,
    CONFLUENCE_SITE_URL: env.CONFLUENCE_SITE_URL,
    CONFLUENCE_SPACE_KEY: env.CONFLUENCE_SPACE_KEY,
  };
  
  const result: ImportResult = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: [],
    pageMapping: new Map(),
  };
  
  console.log('🚀 Starting Confluence Surge import...\n');
  
  // Fetch space info
  console.log('📡 Fetching space info...');
  try {
    const spaceInfo = await fetchSpaceInfo(confluenceEnv);
    console.log(`   Space: ${spaceInfo.name} (${spaceInfo.key})`);
  } catch (error) {
    console.error('   ❌ Failed to fetch space info:', error);
    throw error;
  }
  
  // Fetch all pages
  console.log('\n📄 Fetching pages from Surge space...');
  let pages: ConfluencePage[] = [];
  try {
    const contentResponse = await fetchSpaceContent(confluenceEnv, { limit: 500 });
    pages = contentResponse.results.filter(p => p.status === 'current');
    result.total = pages.length;
    console.log(`   Found ${result.total} published pages`);
  } catch (error) {
    console.error('   ❌ Failed to fetch pages:', error);
    throw error;
  }
  
  // Process each page
  console.log('\n⚙️  Processing pages...');
  
  for (const page of pages) {
    try {
      console.log(`\n   Processing: ${page.title} (ID: ${page.id})`);
      
      // Fetch page content
      const content = await fetchPageContent(page.id, confluenceEnv);
      
      // Transform to Sanity document
      const doc = transformPageToSanityDoc(page, content);
      
      // Create document in Sanity
      const created = await sanityClient.create(doc);
      
      // Track mapping
      result.pageMapping.set(page.id, created._id);
      CONFLUENCE_SURGE_CONFIG.pageMapping.set(page.id, created._id);
      
      result.imported++;
      console.log(`   ✅ Created: ${created._id} (slug: ${doc.slug.current})`);
      
    } catch (error) {
      result.skipped++;
      const errorMsg = `Failed to import "${page.title}" (ID: ${page.id}): ${error}`;
      result.errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
    }
  }
  
  return result;
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('  Confluence Surge → Sanity Import');
  console.log('='.repeat(60));
  console.log();
  
  // Validate environment
  const env = validateEnvironment();
  console.log('✅ Environment variables validated');
  console.log(`   Confluence: ${env.CONFLUENCE_SITE_URL}/wiki/spaces/${env.CONFLUENCE_SPACE_KEY}`);
  console.log(`   Sanity: ${env.SANITY_PROJECT_ID}/${env.SANITY_DATASET}`);
  console.log();
  
  try {
    const result = await importSurgeContent(env);
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('  Import Summary');
    console.log('='.repeat(60));
    console.log(`   Total pages found:    ${result.total}`);
    console.log(`   Successfully imported: ${result.imported}`);
    console.log(`   Skipped (errors):     ${result.skipped}`);
    
    if (result.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      result.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n✨ Import complete!');
    console.log('\n📚 Verify imported documents:');
    console.log('   1. Open Sanity Studio');
    console.log('   2. Navigate to Documentation Pages');
    console.log('   3. Filter by product = gcsurge');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
main();
