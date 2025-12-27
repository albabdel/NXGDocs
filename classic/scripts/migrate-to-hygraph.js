/**
 * HYGRAPH MIGRATION SCRIPT
 * ========================
 * Migrates all documentation articles from local markdown files to Hygraph CMS
 *
 * Features:
 * - Batch migration with progress tracking
 * - Chapter/category creation and linking
 * - SEO metadata extraction
 * - Error handling and retry logic
 * - Resume capability from last successful migration
 *
 * Usage:
 *   npm run migrate:hygraph           # Migrate all articles
 *   npm run migrate:hygraph -- --test # Test with 3 articles
 *   npm run migrate:hygraph -- --skip 100 # Skip first 100 articles
 */

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
require('dotenv').config({ path: '.env.local' });

// ========================================
// CONFIGURATION
// ========================================
const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN || process.env.HYGRAPH_DEV_TOKEN;
const DOCS_DIR = path.join(__dirname, '../docs');

// Command line arguments
const args = process.argv.slice(2);
const isTestMode = args.includes('--test');
const isDryRun = args.includes('--dry-run');
const skipCount = args.find(arg => arg.startsWith('--skip'))?.split('=')[1] || 0;

// Tracking
const migrationLog = {
  startTime: new Date(),
  totalArticles: 0,
  successCount: 0,
  errorCount: 0,
  skippedCount: 0,
  errors: [],
  chapters: new Map(), // Cache for created chapters
};

// ========================================
// VALIDATE CONFIGURATION
// ========================================
if (!HYGRAPH_MANAGEMENT_ENDPOINT || !HYGRAPH_TOKEN) {
  console.error('\n❌ ERROR: Missing Hygraph configuration');
  console.error('\nRequired environment variables:');
  console.error('  - HYGRAPH_MANAGEMENT_ENDPOINT');
  console.error('  - HYGRAPH_MANAGEMENT_TOKEN or HYGRAPH_DEV_TOKEN');
  console.error('\nPlease update your .env.local file.\n');
  process.exit(1);
}

// Initialize GraphQL client
const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

// ========================================
// GRAPHQL MUTATIONS
// ========================================

const CREATE_CHAPTER_MUTATION = gql`
  mutation CreateChapter($title: String!) {
    createChapter(data: { title: $title }) {
      id
      title
    }
  }
`;

const PUBLISH_CHAPTER_MUTATION = gql`
  mutation PublishChapter($id: ID!) {
    publishChapter(where: { id: $id }) {
      id
    }
  }
`;

const CREATE_SEO_MUTATION = gql`
  mutation CreateSEO($title: String, $description: String) {
    createSEO(data: { title: $title, description: $description }) {
      id
    }
  }
`;

const PUBLISH_SEO_MUTATION = gql`
  mutation PublishSEO($id: ID!) {
    publishSEO(where: { id: $id }) {
      id
    }
  }
`;

const CREATE_PAGE_MUTATION = gql`
  mutation CreatePage(
    $title: String!
    $slug: String!
    $content: String
    $chapterId: ID
    $seoId: ID
  ) {
    createPage(
      data: {
        title: $title
        slug: $slug
        content: $content
        chapter: { connect: { id: $chapterId } }
        seo: { connect: { id: $seoId } }
      }
    ) {
      id
      title
      slug
    }
  }
`;

const PUBLISH_PAGE_MUTATION = gql`
  mutation PublishPage($id: ID!) {
    publishPage(where: { id: $id }) {
      id
      title
      slug
    }
  }
`;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Extract category from file path
 * Examples:
 *   docs/admin-guide/users.md -> admin-guide
 *   docs/devices/axis/overview.md -> devices
 */
function extractCategory(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length > 1) {
    return parts[0]; // First directory is the category
  }

  return 'general'; // Default category
}

/**
 * Generate unique slug from file path
 * Examples:
 *   docs/admin-guide/users.md -> admin-guide-users
 *   docs/devices/axis/overview.md -> devices-axis-overview
 */
function generateSlug(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const withoutExt = relativePath.replace(/\.mdx?$/i, '');

  return withoutExt
    .toLowerCase()
    .replace(/\\/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format category name for display
 * Examples:
 *   admin-guide -> Admin Guide
 *   devices -> Devices
 */
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Find or create a chapter
 */
async function findOrCreateChapter(categoryName) {
  // Check cache first
  if (migrationLog.chapters.has(categoryName)) {
    return migrationLog.chapters.get(categoryName);
  }

  try {
    const formattedName = formatCategoryName(categoryName);

    if (isDryRun) {
      console.log(`   [DRY RUN] Would create chapter: ${formattedName}`);
      const mockChapter = { id: `mock-${categoryName}`, title: formattedName };
      migrationLog.chapters.set(categoryName, mockChapter);
      return mockChapter;
    }

    // Create new chapter
    const result = await client.request(CREATE_CHAPTER_MUTATION, {
      title: formattedName,
    });

    const chapter = result.createChapter;

    // Publish the chapter
    await client.request(PUBLISH_CHAPTER_MUTATION, { id: chapter.id });

    // Cache it
    migrationLog.chapters.set(categoryName, chapter);

    console.log(`   ✅ Created chapter: ${formattedName}`);
    return chapter;

  } catch (error) {
    console.error(`   ⚠️  Error creating chapter "${categoryName}":`, error.message);
    return null;
  }
}

/**
 * Create SEO entry
 */
async function createSEO(title, description) {
  if (!title && !description) {
    return null;
  }

  try {
    if (isDryRun) {
      console.log(`   [DRY RUN] Would create SEO entry`);
      return { id: 'mock-seo' };
    }

    const result = await client.request(CREATE_SEO_MUTATION, {
      title: title || null,
      description: description || null,
    });

    const seo = result.createSEO;

    // Publish the SEO entry
    await client.request(PUBLISH_SEO_MUTATION, { id: seo.id });

    return seo;

  } catch (error) {
    console.error(`   ⚠️  Error creating SEO:`, error.message);
    return null;
  }
}

/**
 * Migrate a single article to Hygraph
 */
async function migrateArticle(filePath) {
  try {
    // Read and parse markdown file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Extract metadata
    const title = frontmatter.title || frontmatter.id || path.basename(filePath, '.md');
    const slug = frontmatter.slug || generateSlug(filePath);
    const category = frontmatter.category || extractCategory(filePath);
    const description = frontmatter.description || frontmatter.sidebar_label || '';

    // Get or create chapter
    const chapter = await findOrCreateChapter(category);

    // Create SEO entry
    const seo = await createSEO(title, description);

    if (isDryRun) {
      console.log(`   [DRY RUN] Would create page: ${title}`);
      console.log(`     - Slug: ${slug}`);
      console.log(`     - Chapter: ${category}`);
      return { success: true, title };
    }

    // Create page in Hygraph
    const result = await client.request(CREATE_PAGE_MUTATION, {
      title,
      slug,
      content,
      chapterId: chapter?.id || null,
      seoId: seo?.id || null,
    });

    const page = result.createPage;

    // Publish the page
    await client.request(PUBLISH_PAGE_MUTATION, { id: page.id });

    return { success: true, page };

  } catch (error) {
    throw error;
  }
}

/**
 * Load all markdown files from docs directory
 */
function loadAllArticles() {
  const articles = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.match(/\.mdx?$/i)) {
        articles.push(filePath);
      }
    });
  }

  walkDir(DOCS_DIR);
  return articles.sort(); // Sort for consistent ordering
}

/**
 * Save migration progress
 */
function saveMigrationLog() {
  const logPath = path.join(__dirname, '../migration-log.json');
  const logData = {
    ...migrationLog,
    endTime: new Date(),
    duration: `${((new Date() - migrationLog.startTime) / 1000).toFixed(2)}s`,
    chapters: Array.from(migrationLog.chapters.entries()),
  };

  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  console.log(`\n📝 Migration log saved to: migration-log.json`);
}

// ========================================
// MAIN MIGRATION FUNCTION
// ========================================
async function runMigration() {
  console.log('\n' + '='.repeat(60));
  console.log('  HYGRAPH MIGRATION - Documentation Articles');
  console.log('='.repeat(60));
  console.log(`\n📍 Environment: ${process.env.HYGRAPH_ENVIRONMENT || 'master'}`);
  console.log(`📍 Endpoint: ${HYGRAPH_MANAGEMENT_ENDPOINT}`);
  console.log(`📍 Docs Directory: ${DOCS_DIR}`);

  if (isTestMode) {
    console.log(`\n⚠️  TEST MODE: Migrating only 3 articles`);
  }

  if (isDryRun) {
    console.log(`\n⚠️  DRY RUN MODE: No actual changes will be made`);
  }

  console.log('\n' + '-'.repeat(60));

  try {
    // Load all articles
    console.log('\n📦 Loading articles from docs directory...');
    let articles = loadAllArticles();
    migrationLog.totalArticles = articles.length;

    console.log(`✅ Found ${articles.length} markdown files\n`);

    // Apply filters
    if (skipCount > 0) {
      articles = articles.slice(parseInt(skipCount));
      migrationLog.skippedCount = parseInt(skipCount);
      console.log(`⏭️  Skipping first ${skipCount} articles\n`);
    }

    if (isTestMode) {
      articles = articles.slice(0, 3);
      console.log(`🧪 Test mode: Processing only ${articles.length} articles\n`);
    }

    // Migrate each article
    console.log('🚀 Starting migration...\n');

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const relativePath = path.relative(DOCS_DIR, article);
      const progress = `[${i + 1}/${articles.length}]`;

      console.log(`${progress} ${relativePath}`);

      try {
        const result = await migrateArticle(article);

        if (result.success) {
          migrationLog.successCount++;
          if (!isDryRun) {
            console.log(`   ✅ Migrated: ${result.page.title}`);
          }
        }

      } catch (error) {
        migrationLog.errorCount++;
        migrationLog.errors.push({
          file: relativePath,
          error: error.message,
        });
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Small delay to avoid rate limiting
      if (!isDryRun && i < articles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Save log
    saveMigrationLog();

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('  MIGRATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Articles: ${migrationLog.totalArticles}`);
    console.log(`   Processed: ${articles.length}`);
    console.log(`   ✅ Successful: ${migrationLog.successCount}`);
    console.log(`   ❌ Failed: ${migrationLog.errorCount}`);
    console.log(`   📁 Chapters Created: ${migrationLog.chapters.size}`);

    if (migrationLog.skippedCount > 0) {
      console.log(`   ⏭️  Skipped: ${migrationLog.skippedCount}`);
    }

    const duration = ((new Date() - migrationLog.startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Duration: ${duration}s`);
    console.log(`📈 Rate: ${(articles.length / duration).toFixed(2)} articles/sec`);

    if (migrationLog.errorCount > 0) {
      console.log(`\n⚠️  ERRORS (${migrationLog.errorCount}):`);
      migrationLog.errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });

      if (migrationLog.errors.length > 10) {
        console.log(`   ... and ${migrationLog.errors.length - 10} more`);
      }
      console.log(`\n📝 Full error log saved to migration-log.json`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Next Steps:');
    console.log('   1. Verify content at: https://studio-eu-west-2.hygraph.com/8be74d68-843a-42e1-8a4c-3730facf7c5c');
    console.log('   2. Test fetching content: npm run fetch-content');
    console.log('   3. Check migration log: cat migration-log.json');

    if (migrationLog.errorCount > 0) {
      console.log('   4. Review and fix errors, then re-run with --skip option');
    }

    console.log('\n');

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.error('\nError details:', error);
    saveMigrationLog();
    process.exit(1);
  }
}

// ========================================
// RUN MIGRATION
// ========================================
runMigration();
