const { request, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const endpoint = process.env.HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_TOKEN;

if (!endpoint || !token) {
  console.error('❌ Error: HYGRAPH_ENDPOINT and HYGRAPH_TOKEN must be set in .env.local');
  console.error('   Please update .env.local with your Hygraph credentials.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
};

/**
 * Convert Hygraph Rich Text JSON to Markdown
 */
function richTextToMarkdown(richTextNode) {
  if (!richTextNode || !richTextNode.children) {
    return '';
  }

  function processNode(node) {
    // Handle text nodes with formatting
    if (node.text !== undefined) {
      let text = node.text;

      // Apply text formatting
      if (node.bold) text = `**${text}**`;
      if (node.italic) text = `*${text}*`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.code) text = `\`${text}\``;

      return text;
    }

    // Handle block elements
    const children = node.children ? node.children.map(processNode).join('') : '';

    switch (node.type) {
      case 'paragraph':
        return `${children}\n\n`;

      case 'heading-one':
        return `# ${children}\n\n`;
      case 'heading-two':
        return `## ${children}\n\n`;
      case 'heading-three':
        return `### ${children}\n\n`;
      case 'heading-four':
        return `#### ${children}\n\n`;
      case 'heading-five':
        return `##### ${children}\n\n`;
      case 'heading-six':
        return `###### ${children}\n\n`;

      case 'bulleted-list':
        return `${children}\n`;
      case 'numbered-list':
        return `${children}\n`;
      case 'list-item':
        const prefix = node.children[0]?.type === 'list-item-child' ? '- ' : '1. ';
        return `${prefix}${children}`;
      case 'list-item-child':
        return children;

      case 'link':
        const url = node.href || node.url || '#';
        return `[${children}](${url})`;

      case 'code-block':
        const language = node.language || '';
        return `\`\`\`${language}\n${children}\n\`\`\`\n\n`;

      case 'block-quote':
        return `> ${children}\n\n`;

      case 'image':
        const altText = node.title || node.alt || 'image';
        const imageUrl = node.src || node.url || '';
        return `![${altText}](${imageUrl})\n\n`;

      case 'table':
        return `${children}\n`;
      case 'table_head':
        return `${children}\n`;
      case 'table_body':
        return children;
      case 'table_row':
        return `| ${children}\n`;
      case 'table_cell':
      case 'table_header_cell':
        return `${children} |`;

      default:
        return children;
    }
  }

  return richTextNode.children.map(processNode).join('').trim();
}

// Query to fetch all articles from Hygraph
const query = gql`
  query GetArticles {
    articles(first: 100) {
      id
      title
      slug
      content {
        raw
      }
      updatedAt
    }
  }
`;

async function fetchAndGeneratePages() {
  try {
    console.log('🔄 Fetching content from Hygraph...');

    // Skip generation - content is managed in local markdown files
    // This script is only used when Hygraph is the source of truth
    console.log('ℹ️  Skipping Hygraph content generation - using local markdown files');
    console.log('ℹ️  To enable Hygraph sync, set HYGRAPH_AS_SOURCE=true in .env.local');

    // Only generate if explicitly enabled
    if (process.env.HYGRAPH_AS_SOURCE !== 'true') {
      return;
    }

    const data = await request(endpoint, query, {}, headers);

    // Create docs directory if it doesn't exist
    const docsDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    if (!data.articles || data.articles.length === 0) {
      console.log('⚠️  No articles found in Hygraph');
      return;
    }

    // Generate markdown files for each article
    data.articles.forEach((article) => {
      const filePath = path.join(docsDir, `${article.slug}.md`);

      // Convert Hygraph rich text to markdown
      const contentMarkdown = article.content?.raw
        ? richTextToMarkdown(article.content.raw)
        : '';

      // Create markdown frontmatter
      const markdownContent = `---
id: ${article.slug}
title: ${article.title}
last_updated: ${new Date(article.updatedAt).toLocaleDateString()}
---

# ${article.title}

${contentMarkdown}
`;

      fs.writeFileSync(filePath, markdownContent);
      console.log(`✅ Generated: ${article.slug}.md`);
    });

    console.log(`✨ Successfully created ${data.articles.length} articles from Hygraph!`);
  } catch (error) {
    console.error('❌ Error fetching content:', error.message);
    if (error.response) {
      console.error('Response details:', JSON.stringify(error.response.errors, null, 2));
    }
    // Don't exit with error - this is a prebuild hook and the site can still build
    console.log('ℹ️  Continuing with local content...');
  }
}

fetchAndGeneratePages();
