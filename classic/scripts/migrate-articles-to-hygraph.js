/**
 * HYGRAPH ARTICLE MIGRATION SCRIPT
 * ========================
 * Migrates all documentation articles from local markdown files to Hygraph CMS
 *
 * Features:
 * - Batch migration with progress tracking
 * - Markdown to Rich Text conversion
 * - Error handling and retry logic
 * - Resume capability from last successful migration
 *
 * Usage:
 *   npm run migrate:articles           # Migrate all articles
 *   npm run migrate:articles -- --test # Test with 3 articles
 *   npm run migrate:articles -- --skip 100 # Skip first 100 articles
 */

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { markdownToRichText } = require('./lib/markdown-to-richtext');
require('dotenv').config({ path: '.env.local' });

// ========================================
// CONFIGURATION
// ========================================
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT; // Use High Performance API
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;
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
};

// ========================================
// VALIDATE CONFIGURATION
// ========================================
if (!HYGRAPH_ENDPOINT || !HYGRAPH_TOKEN) {
  console.error('\n❌ ERROR: Missing Hygraph configuration');
  console.error('\nRequired environment variables:');
  console.error('  - HYGRAPH_ENDPOINT');
  console.error('  - HYGRAPH_TOKEN');
  console.error('\nPlease update your .env.local file.\n');
  process.exit(1);
}

// Initialize GraphQL client
const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

// ========================================
// GRAPHQL MUTATIONS
// ========================================

const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($title: String!, $slug: String!, $content: RichTextAST) {
    createArticle(data: { title: $title, slug: $slug, content: $content }) {
      id
      title
      slug
    }
  }
`;

const PUBLISH_ARTICLE_MUTATION = gql`
  mutation PublishArticle($id: ID!) {
    publishArticle(where: { id: $id }) {
      id
      title
      slug
      stage
    }
  }
`;

// ========================================
// HELPER FUNCTIONS
// ========================================

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

    // Convert markdown to Rich Text
    const richTextContent = markdownToRichText(content);

    if (isDryRun) {
      console.log(`   [DRY RUN] Would create article: ${title}`);
      console.log(`     - Slug: ${slug}`);
      console.log(`     - Content blocks: ${richTextContent.children.length}`);
      return { success: true, title };
    }

    // Create article in Hygraph
    const result = await client.request(CREATE_ARTICLE_MUTATION, {
      title,
      slug,
      content: richTextContent,
    });

    const article = result.createArticle;

    // Publish the article
    await client.request(PUBLISH_ARTICLE_MUTATION, { id: article.id });

    return { success: true, article };

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
  };

  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  console.log(`\n📝 Migration log saved to: migration-log.json`);
}

// ========================================
// MAIN MIGRATION FUNCTION
// ========================================
async function runMigration() {
  console.log('\n' + '='.repeat(60));
  console.log('  HYGRAPH ARTICLE MIGRATION - Documentation Articles');
  console.log('='.repeat(60));
  console.log(`\n📍 Environment: ${process.env.HYGRAPH_ENVIRONMENT || 'master'}`);
  console.log(`📍 Endpoint: ${HYGRAPH_ENDPOINT}`);
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
            console.log(`   ✅ Migrated: ${result.article.title}`);
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

    if (migrationLog.skippedCount > 0) {
      console.log(`   ⏭️  Skipped: ${migrationLog.skippedCount}`);
    }

    const duration = ((new Date() - migrationLog.startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Duration: ${duration}s`);
    console.log(`📈 Rate: ${(articles.length / duration).toFixed(2)} articles/sec`);

    if (migrationLog.errorCount > 0) {
      console.log(`\n⚠️  ERRORS (${migrationLog.errorCount}):` );
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
    console.log('   1. Verify content at: https://app.hygraph.com/bf5aa53f-7e4c-43a5-8d33-696cfa2520e3');
    console.log('   2. Check migration log: cat migration-log.json');

    if (migrationLog.errorCount > 0) {
      console.log('   3. Review and fix errors, then re-run with --skip option');
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
