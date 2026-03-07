const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createClient } = require('@sanity/client');

// Convert Markdown to HTML then to PortableText blocks
const { marked } = require('marked');
const { htmlToBlocks } = require('@sanity/block-tools');
const { JSDOM } = require('jsdom');
const { Schema } = require('@sanity/schema');

// We have to mock the schema type because @sanity/block-tools requires it
const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'body',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema.get('body').fields.find((f) => f.name === 'body').type;

const SITE_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(SITE_DIR, 'docs');
const PAGES_DIR = path.join(SITE_DIR, 'src', 'pages');

const projectId = process.env.SANITY_PROJECT_ID || 'fjjuacab';
const dataset = process.env.SANITY_DATASET || 'production';
const apiToken = process.env.SANITY_API_TOKEN;

if (!apiToken) {
  console.error('[!] Warning: process.env.SANITY_API_TOKEN is missing. Running in dry-run mode.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-06',
  useCdn: false,
  token: apiToken,
});

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.DS_Store' || file === 'images' || file.startsWith('_')) continue;
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = walkDir(path.join(dir, file), fileList);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

function getSanityType(filePath, relativePath) {
  if (relativePath.startsWith('knowledge-base/glossary')) return 'referencePage';
  if (relativePath.startsWith('releases/')) return 'releaseNote';
  if (relativePath.startsWith('articles/')) return 'article';
  return 'doc'; 
}

function getSanitySlug(filePath, rootDir) {
  let relative = path.relative(rootDir, filePath).replace(/\\/g, '/');
  relative = relative.replace(/\.mdx?$/, '');
  if (relative.endsWith('/index')) relative = relative.replace(/\/index$/, '');
  return relative;
}

function convertMarkdownToBlocks(markdownStr) {
  // strip some common JSX wrappers if they break HTML parsing
  let processed = markdownStr.replace(/<lucide-react-x\b[^>]*\/?>/g, ''); 
  // etc for other react components

  const html = marked.parse(processed);
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (htmlContent) => new JSDOM(htmlContent).window.document,
  });
  return blocks;
}

async function processFiles() {
  const allDocs = walkDir(DOCS_DIR);
  const allPages = walkDir(PAGES_DIR);
  
  const allFiles = [...allDocs, ...allPages];
  
  console.log(`Found ${allFiles.length} files to migrate.`);
  let successCount = 0;
  
  for (const file of allFiles) {
    let root = file.includes('src' + path.sep + 'pages') ? PAGES_DIR : DOCS_DIR;
    const slug = getSanitySlug(file, root);
    const type = getSanityType(file, slug);
    const contentStr = fs.readFileSync(file, 'utf8');
    
    let parsed;
    try {
      parsed = matter(contentStr);
    } catch (e) {
      console.warn(`[WARN] Frontmatter parse failed for ${file}`);
      continue;
    }
    
    const title = parsed.data.title || slug.split('/').pop().replace(/-/g, ' ');
    const sidebarPos = parsed.data.sidebar_position || null;
    const category = parsed.data.sidebar_label || null;
    let targetAudience = ['all'];
    
    if (slug.includes('internal')) {
      targetAudience = ['internal'];
    }
    
    // convert the markdown content back to PT
    const blocks = convertMarkdownToBlocks(parsed.content);
    
    const docData = {
      _type: type,
      title: title,
      slug: {
        _type: 'slug',
        current: slug
      },
      body: blocks,
    };
    
    if (type === 'doc') {
      if (sidebarPos != null) docData.sidebarPosition = sidebarPos;
      if (category != null) docData.category = category;
      docData.targetAudience = targetAudience;
    }
    
    if (apiToken) {
      try {
        await client.create(docData);
        console.log(`[SUCCESS] Migrated -> ${slug} (${type})`);
        // if we succeeded, we can potentially delete the file 
        // fs.unlinkSync(file);
        successCount++;
      } catch (err) {
        console.error(`[ERROR] Failed to migrate ${slug}:`, err.message);
      }
    } else {
      console.log(`[DRY-RUN] Will create ${type} doc for: ${slug}`);
      successCount++;
    }
  }
  
  console.log(`\nOperation finished. Processed ${successCount} files.`);
}

processFiles().catch(e => console.error(e));
