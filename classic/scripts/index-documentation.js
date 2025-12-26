/**
 * ALGOLIA DOCUMENTATION INDEXER
 * =============================
 * Indexes all documentation articles from the docs/ folder into Algolia
 *
 * This script:
 * 1. Reads all markdown files from docs/
 * 2. Extracts title, content, and metadata
 * 3. Uploads to Algolia index
 * 4. Enables fast search across all documentation
 */

const algoliasearch = require('algoliasearch');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Algolia Configuration
const ALGOLIA_APP_ID = '0QV3FAFAD5';
const ALGOLIA_API_KEY = '1dc4b09119c715d8372ee1d0077a76f0';
const ALGOLIA_INDEX_NAME = 'nxgen_docs';

// Initialize Algolia client (v4 syntax)
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// Paths
const DOCS_DIR = path.join(__dirname, '../docs');

/**
 * Extract text content from markdown (remove markdown syntax)
 */
function extractTextContent(markdown) {
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove blockquotes
    .replace(/>\s+/g, '')
    // Remove horizontal rules
    .replace(/---+/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate URL path from file path
 */
function generateUrlPath(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  return '/docs/' + relativePath
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')
    .replace(/\/README$/i, '');
}

/**
 * Extract category from file path
 */
function extractCategory(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length > 1) {
    return parts[0]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  return 'Documentation';
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, build, etc.
      if (!['node_modules', 'build', '.git', '.netlify', 'dist'].includes(file)) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.match(/\.(md|mdx)$/i)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Process a single markdown file into Algolia record(s)
 * Splits large documents into chunks to stay under Algolia's 10KB limit
 */
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(content);

    // Extract first heading as title if not in frontmatter
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = frontmatter.title || (titleMatch ? titleMatch[1] : path.basename(filePath, path.extname(filePath)));

    // Extract text content (remove markdown syntax)
    const textContent = extractTextContent(markdown);

    // Create search-friendly excerpt (first 200 chars)
    const excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');

    // Generate base objectID from file path
    const baseObjectID = generateUrlPath(filePath)
      .replace(/^\/docs\//, '')
      .replace(/\//g, '-');

    const url = generateUrlPath(filePath);
    const category = extractCategory(filePath);

    // Split content into chunks if too large (max 7000 chars to leave room for metadata)
    const MAX_CONTENT_SIZE = 7000;
    const records = [];

    if (textContent.length <= MAX_CONTENT_SIZE) {
      // Single record - content fits
      records.push({
        objectID: baseObjectID,
        title,
        content: textContent,
        excerpt,
        url,
        category,
        keywords: frontmatter.keywords || frontmatter.tags || [],
        lastUpdated: frontmatter.last_updated || new Date().toISOString(),
      });
    } else {
      // Split into chunks
      const chunks = [];
      for (let i = 0; i < textContent.length; i += MAX_CONTENT_SIZE) {
        chunks.push(textContent.substring(i, i + MAX_CONTENT_SIZE));
      }

      chunks.forEach((chunk, index) => {
        records.push({
          objectID: `${baseObjectID}-${index + 1}`,
          title: `${title} (Part ${index + 1}/${chunks.length})`,
          content: chunk,
          excerpt: index === 0 ? excerpt : chunk.substring(0, 200) + '...',
          url,
          category,
          keywords: frontmatter.keywords || frontmatter.tags || [],
          lastUpdated: frontmatter.last_updated || new Date().toISOString(),
          chunkIndex: index + 1,
          totalChunks: chunks.length
        });
      });

      console.log(`   📦 Split into ${chunks.length} chunks (${textContent.length} chars)`);
    }

    return records;

  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Main indexing function
 */
async function indexDocumentation() {
  console.log('\n' + '='.repeat(70));
  console.log('  ALGOLIA DOCUMENTATION INDEXER');
  console.log('='.repeat(70));
  console.log(`\n📍 Algolia App ID: ${ALGOLIA_APP_ID}`);
  console.log(`📍 Index Name: ${ALGOLIA_INDEX_NAME}`);
  console.log(`📍 Documentation Path: ${DOCS_DIR}`);
  console.log('\n' + '-'.repeat(70));

  try {
    // Find all markdown files
    console.log('\n📦 Scanning for documentation files...');
    const markdownFiles = findMarkdownFiles(DOCS_DIR);
    console.log(`✅ Found ${markdownFiles.length} documentation files\n`);

    if (markdownFiles.length === 0) {
      console.log('⚠️  No markdown files found to index\n');
      return;
    }

    // Process all files into Algolia records
    console.log('📝 Processing files...\n');
    const records = [];

    for (let i = 0; i < markdownFiles.length; i++) {
      const filePath = markdownFiles[i];
      const progress = `[${i + 1}/${markdownFiles.length}]`;

      console.log(`${progress} ${path.relative(DOCS_DIR, filePath)}`);

      const fileRecords = processMarkdownFile(filePath);
      if (fileRecords && fileRecords.length > 0) {
        records.push(...fileRecords);
        if (fileRecords.length === 1) {
          console.log(`   ✅ Processed: ${fileRecords[0].title}`);
        } else {
          console.log(`   ✅ Processed: ${fileRecords[0].title.replace(/ \(Part.*/, '')} (${fileRecords.length} parts)`);
        }
      }
    }

    console.log(`\n✅ Successfully processed ${markdownFiles.length} files into ${records.length} searchable records\n`);

    // Upload to Algolia
    console.log('🚀 Uploading to Algolia...\n');

    await index.saveObjects(records, {
      autoGenerateObjectIDIfNotExist: false
    });

    console.log('✅ Upload complete!');

    // Configure index settings for optimal search
    console.log('\n⚙️  Configuring index settings...\n');

    await index.setSettings({
      searchableAttributes: [
        'title',
        'content',
        'keywords',
        'category'
      ],
      attributesToRetrieve: [
        'title',
        'excerpt',
        'url',
        'category',
        'keywords'
      ],
      attributesToHighlight: [
        'title',
        'content'
      ],
      attributesForFaceting: [
        'category',
        'keywords'
      ],
      customRanking: [
        'desc(lastUpdated)'
      ],
      hitsPerPage: 20
    });

    console.log('✅ Index settings configured');

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('  INDEXING COMPLETE');
    console.log('='.repeat(70));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Files: ${markdownFiles.length}`);
    console.log(`   Successfully Indexed: ${records.length}`);
    console.log(`   Index Name: ${ALGOLIA_INDEX_NAME}`);
    console.log(`\n✨ Your documentation is now searchable in Algolia!`);
    console.log('\n' + '='.repeat(70));
    console.log('\n📝 Next Steps:');
    console.log('   1. Test search at: https://www.algolia.com/apps/0QV3FAFAD5/explorer');
    console.log('   2. Integrate Algolia search into Docusaurus');
    console.log('   3. Re-run this script whenever content changes');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ INDEXING FAILED:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run indexing
indexDocumentation();
