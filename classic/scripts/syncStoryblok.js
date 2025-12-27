const StoryblokClient = require('storyblok-js-client').default || require('storyblok-js-client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Storyblok client
const client = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN || 'lZ1VpFd6y9FjoNcJQFlXLAtt',
  region: process.env.STORYBLOK_REGION || 'eu',
});

// Output directory for docs
const DOCS_DIR = path.join(__dirname, '../docs');

/**
 * Convert Storyblok rich text to markdown
 */
function richTextToMarkdown(content) {
  if (!content || typeof content === 'string') {
    return content || '';
  }

  // If it's a rich text object with content array
  if (content.content && Array.isArray(content.content)) {
    return content.content.map(block => {
      if (block.type === 'paragraph' && block.content) {
        return block.content.map(node => node.text || '').join('') + '\n\n';
      }
      if (block.type === 'heading' && block.content) {
        const level = block.attrs?.level || 2;
        const text = block.content.map(node => node.text || '').join('');
        return '#'.repeat(level) + ' ' + text + '\n\n';
      }
      return '';
    }).join('');
  }

  return '';
}

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Clean docs directory (remove old files)
 */
function cleanDocsDirectory() {
  if (fs.existsSync(DOCS_DIR)) {
    const files = fs.readdirSync(DOCS_DIR);
    files.forEach(file => {
      const filePath = path.join(DOCS_DIR, file);
      if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
        // Only remove markdown files, keep other files
        fs.unlinkSync(filePath);
      }
    });
  }
}

/**
 * Generate markdown file from Storyblok story
 */
function generateMarkdownFile(story) {
  const content = story.content || {};

  // Extract folder structure from full_slug
  const slugParts = story.full_slug.split('/').filter(Boolean);
  const fileName = slugParts.pop() || 'index';
  const folderPath = slugParts.length > 0
    ? path.join(DOCS_DIR, ...slugParts)
    : DOCS_DIR;

  ensureDirectoryExists(folderPath);

  // Build frontmatter
  const frontmatter = {
    id: story.slug,
    title: content.title || story.name,
    slug: story.full_slug,
  };

  // Add optional frontmatter fields
  if (content.description) frontmatter.description = content.description;
  if (content.sidebar_label) frontmatter.sidebar_label = content.sidebar_label;
  if (content.sidebar_position) frontmatter.sidebar_position = content.sidebar_position;

  // Convert content body to markdown
  let body = '';
  if (content.body) {
    body = richTextToMarkdown(content.body);
  } else if (content.content) {
    body = richTextToMarkdown(content.content);
  }

  // Build complete markdown file
  const markdown = `---
${Object.entries(frontmatter)
  .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value.replace(/"/g, '\\"')}"` : value}`)
  .join('\n')}
---

${body}
`;

  const filePath = path.join(folderPath, `${fileName}.md`);
  fs.writeFileSync(filePath, markdown, 'utf-8');

  return {
    path: filePath,
    slug: story.full_slug,
    title: frontmatter.title,
  };
}

/**
 * Fetch all stories from Storyblok
 */
async function fetchAllStories() {
  console.log('🔄 Fetching all stories from Storyblok...\n');

  let page = 1;
  let allStories = [];
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await client.get('cdn/stories', {
        version: 'published', // Use 'draft' to include unpublished content
        per_page: 100,
        page: page,
      });

      const stories = response.data.stories || [];
      allStories = allStories.concat(stories);

      console.log(`  ✓ Fetched page ${page} (${stories.length} stories)`);

      // Check if there are more pages
      hasMore = stories.length === 100;
      page++;

    } catch (error) {
      console.error(`  ✗ Error fetching page ${page}:`, error.message);
      hasMore = false;
    }
  }

  console.log(`\n✅ Total stories fetched: ${allStories.length}\n`);
  return allStories;
}

/**
 * Generate sidebar configuration from stories
 */
function generateSidebarConfig(stories) {
  // Group stories by folder
  const folders = {};

  stories.forEach(story => {
    const parts = story.full_slug.split('/').filter(Boolean);
    if (parts.length === 1) {
      // Root level doc
      if (!folders['root']) folders['root'] = [];
      folders['root'].push(story);
    } else {
      // Nested doc
      const folder = parts[0];
      if (!folders[folder]) folders[folder] = [];
      folders[folder].push(story);
    }
  });

  // Build sidebar items
  const sidebar = [];

  Object.entries(folders).forEach(([folder, items]) => {
    if (folder === 'root') {
      items.forEach(story => {
        sidebar.push({
          type: 'doc',
          id: story.slug,
          label: story.content?.sidebar_label || story.name,
        });
      });
    } else {
      sidebar.push({
        type: 'category',
        label: folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, ' '),
        items: items.map(story => ({
          type: 'doc',
          id: story.full_slug.replace(/\//g, '/'),
          label: story.content?.sidebar_label || story.name,
        })),
      });
    }
  });

  return sidebar;
}

/**
 * Main sync function
 */
async function syncStoryblok() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Storyblok → Docusaurus Sync         ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Step 1: Fetch all stories
    const stories = await fetchAllStories();

    if (stories.length === 0) {
      console.log('⚠️  No stories found in Storyblok');
      console.log('   Please create some content in Storyblok first:\n');
      console.log('   1. Go to https://app.storyblok.com/');
      console.log('   2. Create a new story');
      console.log('   3. Add content and publish');
      console.log('   4. Run this script again\n');
      return;
    }

    // Step 2: Clean old docs
    console.log('🧹 Cleaning old documentation files...');
    cleanDocsDirectory();
    console.log('   ✓ Cleaned\n');

    // Step 3: Generate markdown files
    console.log('📝 Generating markdown files...\n');
    const generatedFiles = [];

    stories.forEach((story, index) => {
      try {
        const result = generateMarkdownFile(story);
        generatedFiles.push(result);
        console.log(`  ${index + 1}. ✓ ${result.slug} → ${path.basename(result.path)}`);
      } catch (error) {
        console.log(`  ${index + 1}. ✗ ${story.full_slug} - Error: ${error.message}`);
      }
    });

    console.log(`\n✅ Generated ${generatedFiles.length} markdown files\n`);

    // Step 4: Generate sidebar (optional)
    // const sidebarConfig = generateSidebarConfig(stories);
    // const sidebarPath = path.join(__dirname, '../sidebars-storyblok.js');
    // fs.writeFileSync(sidebarPath, `module.exports = ${JSON.stringify(sidebarConfig, null, 2)};`);
    // console.log('✅ Generated sidebar configuration\n');

    console.log('╔════════════════════════════════════════╗');
    console.log('║   ✅ Sync Complete!                    ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('📁 Files location:', DOCS_DIR);
    console.log('🚀 Run: npm start');
    console.log('🌐 Visit: http://localhost:3000/docs\n');

  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

// Run sync
syncStoryblok();
