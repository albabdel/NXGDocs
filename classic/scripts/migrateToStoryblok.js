const fs = require('fs');
const path = require('path');
const https = require('https');
const matter = require('gray-matter');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SPACE_ID = '289434723537263';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || '';
const PREVIEW_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || 'lZ1VpFd6y9FjoNcJQFlXLAtt';

const DOCS_DIR = path.join(__dirname, '../docs');

// Check for management token
if (!MANAGEMENT_TOKEN) {
  console.error('\n❌ Error: STORYBLOK_MANAGEMENT_TOKEN not set!');
  console.error('\nYou need a Management API token to create content in Storyblok.');
  console.error('\nSteps to get your token:');
  console.error('1. Go to https://app.storyblok.com/#/me/spaces/289434723537263/settings');
  console.error('2. Click "Access Tokens"');
  console.error('3. Generate a "Personal Access Token" with Write permissions');
  console.error('4. Add to .env.local: STORYBLOK_MANAGEMENT_TOKEN=your-token-here\n');
  process.exit(1);
}

/**
 * Make API request to Storyblok Management API
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mapi.storyblok.com',
      port: 443,
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Get all folders in Storyblok
 */
async function getAllFolders() {
  try {
    const response = await makeRequest('GET', `/spaces/${SPACE_ID}/stories?per_page=100&page=1`);
    const folders = response.stories.filter(story => story.is_folder);
    return folders;
  } catch (error) {
    console.error('Error fetching folders:', error.message);
    return [];
  }
}

/**
 * Create a folder in Storyblok
 */
async function createFolder(name, parentId = null) {
  try {
    const story = {
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      is_folder: true,
      parent_id: parentId,
    };

    const response = await makeRequest('POST', `/spaces/${SPACE_ID}/stories`, { story });
    return response.story;
  } catch (error) {
    console.error(`Error creating folder ${name}:`, error.message);
    return null;
  }
}

/**
 * Create a story in Storyblok
 */
async function createStory(storyData) {
  try {
    const response = await makeRequest('POST', `/spaces/${SPACE_ID}/stories`, { story: storyData });
    return response.story;
  } catch (error) {
    console.error(`Error creating story ${storyData.name}:`, error.message);
    throw error;
  }
}

/**
 * Publish a story in Storyblok
 */
async function publishStory(storyId) {
  try {
    await makeRequest('PUT', `/spaces/${SPACE_ID}/stories/${storyId}/publish`, {
      publish: 1,
      release_id: null,
      lang: 'default',
    });
    return true;
  } catch (error) {
    console.error(`Error publishing story ${storyId}:`, error.message);
    return false;
  }
}

/**
 * Convert markdown to Storyblok rich text format
 */
function markdownToRichText(markdown) {
  // Simple conversion - you can enhance this
  const paragraphs = markdown.split('\n\n').filter(Boolean);

  return {
    type: 'doc',
    content: paragraphs.map(para => ({
      type: 'paragraph',
      content: [{
        type: 'text',
        text: para.trim(),
      }],
    })),
  };
}

/**
 * Read and parse markdown file
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  return {
    frontmatter,
    body,
  };
}

/**
 * Get all markdown files recursively
 */
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Create the doc_page component in Storyblok
 */
async function createDocPageComponent() {
  try {
    const component = {
      name: 'doc_page',
      display_name: 'Documentation Page',
      is_root: true,
      is_nestable: false,
      schema: {
        title: {
          type: 'text',
          pos: 0,
        },
        description: {
          type: 'textarea',
          pos: 1,
        },
        body: {
          type: 'richtext',
          pos: 2,
        },
      },
    };

    await makeRequest('POST', `/spaces/${SPACE_ID}/components`, { component });
    console.log('  ✓ Created doc_page component');
    return true;
  } catch (error) {
    if (error.message.includes('has already been taken')) {
      console.log('  ℹ️  doc_page component already exists');
      return true;
    }
    console.error('  ✗ Failed to create component:', error.message);
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateToStoryblok() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Migrate Docs → Storyblok            ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Step 0: Create the doc_page component if it doesn't exist
  console.log('📦 Setting up content type...');
  await createDocPageComponent();
  console.log();

  console.log(`📁 Scanning directory: ${DOCS_DIR}\n`);

  // Get all markdown files
  const markdownFiles = getAllMarkdownFiles(DOCS_DIR);
  console.log(`Found ${markdownFiles.length} markdown files\n`);

  // Group files by folder
  const filesByFolder = {};
  markdownFiles.forEach(file => {
    const relativePath = path.relative(DOCS_DIR, file);
    const parts = relativePath.split(path.sep);
    const folder = parts.length > 1 ? parts[0] : 'root';

    if (!filesByFolder[folder]) {
      filesByFolder[folder] = [];
    }

    filesByFolder[folder].push({
      fullPath: file,
      relativePath,
      fileName: path.basename(file, '.md'),
      folder,
    });
  });

  console.log('📊 Content structure:');
  Object.entries(filesByFolder).forEach(([folder, files]) => {
    console.log(`  📂 ${folder}: ${files.length} files`);
  });

  console.log('\n⚠️  WARNING: This will create', markdownFiles.length, 'stories in Storyblok!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('🚀 Starting migration...\n');

  let created = 0;
  let failed = 0;

  // NOTE: This is a basic version. You'll need to enhance it to:
  // 1. Create folders first
  // 2. Handle parent-child relationships
  // 3. Upload images
  // 4. Handle frontmatter metadata
  // 5. Add rate limiting to avoid API limits

  for (const filePath of markdownFiles) { // Migrate ALL files
    const relativePath = path.relative(DOCS_DIR, filePath);
    try {
      const { frontmatter, body } = parseMarkdownFile(filePath);
      const fileName = path.basename(filePath, '.md');

      // Create unique slug from full path (e.g., devices/axis/overview -> devices-axis-overview)
      const uniqueSlug = relativePath
        .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes
        .replace(/\.md$/, '') // Remove .md extension
        .replace(/[^\w\/\-]/g, '-') // Replace special chars and spaces with hyphens
        .replace(/\/{1,}/g, '-') // Replace slashes with hyphens
        .replace(/-{2,}/g, '-') // Replace multiple hyphens with single
        .toLowerCase(); // Lowercase for consistency

      const storyData = {
        name: frontmatter.title || fileName,
        slug: uniqueSlug,
        content: {
          _uid: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          component: 'doc_page',
          title: frontmatter.title || fileName,
          description: frontmatter.description || '',
          body: markdownToRichText(body),
        },
        default_root: 'doc_page',
      };

      const story = await createStory(storyData);

      // Publish the story immediately
      await publishStory(story.id);

      console.log(`  ✓ Created & Published: ${relativePath}`);
      created++;

      // Rate limiting - increase to 1 second to stay well below 6 req/sec
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.log(`  ✗ Failed: ${relativePath} - ${error.message}`);
      failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Migration Complete!                 ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`✅ Created: ${created}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${created + failed}\n`);
}

// Run migration
migrateToStoryblok().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
