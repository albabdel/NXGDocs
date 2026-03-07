// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { portableTextToMarkdown } = require('@portabletext/markdown');
const { createImageUrlBuilder } = require('@sanity/image-url');

// Audience → cache subdirectory mapping (LOCKED decision from Phase 2)
const AUDIENCE_DIR_MAP = {
  all: 'docs',
  admin: 'docs-admin',
  manager: 'docs-manager',
  operator: 'docs-operator',
  'operator-minimal': 'docs-operator-minimal',
  internal: 'docs-internal',
};

const ALL_CACHE_DIRS = [
  'docs',
  'docs-admin',
  'docs-manager',
  'docs-operator',
  'docs-operator-minimal',
  'docs-internal',
];

// GROQ queries — field projections match Sanity schema exactly
const QUERY_DOCS = `*[_type == "doc" && defined(slug.current)] | order(sidebarPosition asc) {
  title, slug, targetAudience, category, sidebarPosition, body, lastUpdated
}`;

const QUERY_RELEASE_NOTES = `*[_type == "releaseNote" && defined(slug.current)] | order(publishedAt desc) {
  title, slug, sprintId, publishedAt, body
}`;

const QUERY_ARTICLES = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  title, slug, tags, publishedAt, body
}`;

const QUERY_REFERENCE_PAGES = `*[_type == "referencePage" && defined(slug.current)] {
  title, slug, body
}`;

/**
 * Build custom Portable Text serializer components.
 * @param {object} client - The Sanity client instance (for image URL building)
 * @returns {object} components object for portableTextToMarkdown
 */
function buildComponents(client) {
  const builder = createImageUrlBuilder(client);

  return {
    types: {
      // Code block via @sanity/code-input: { code, language }
      code: ({ value }) => {
        const lang = value.language || '';
        const code = value.code || '';
        return `\`\`\`${lang}\n${code}\n\`\`\`\n`;
      },

      // Callout: { type: 'note'|'tip'|'warning'|'danger', body: string (plain text) }
      // IMPORTANT: callout.body is a plain string — do NOT call portableTextToMarkdown on it
      callout: ({ value }) => {
        const type = value.type || 'note';
        const body = value.body || '';
        // Map to Docusaurus admonition syntax
        return `:::${type}\n${body}\n:::\n`;
      },

      // Image block: { asset: { _ref }, alt, caption? }
      image: ({ value }) => {
        try {
          const url = builder.image(value).url();
          const alt = value.alt || '';
          const caption = value.caption ? `\n*${value.caption}*` : '';
          return `![${alt}](${url})${caption}\n`;
        } catch (err) {
          console.warn(`[sanity-content] Could not build image URL for asset ref ${value?.asset?._ref}: ${err.message}`);
          return '';
        }
      },

      // @sanity/table — render as markdown table
      table: ({ value }) => {
        if (!value.rows || value.rows.length === 0) return '';
        const rows = value.rows.map((row) =>
          '| ' + (row.cells || []).join(' | ') + ' |'
        );
        // Insert header separator after first row
        if (rows.length > 0) {
          const colCount = (value.rows[0].cells || []).length;
          const separator = '| ' + Array(colCount).fill('---').join(' | ') + ' |';
          rows.splice(1, 0, separator);
        }
        return rows.join('\n') + '\n';
      },
    },

    marks: {
      // Link annotation: { href, blank }
      link: ({ children, value }) => {
        const href = value?.href || '#';
        return `[${children}](${href})`;
      },

      // Underline — no standard markdown equivalent; wrap in HTML
      underline: ({ children }) => `<u>${children}</u>`,
    },
  };
}

/**
 * Serialize a doc's body Portable Text array to a markdown string.
 * Returns empty string if body is absent or empty.
 * @param {any[]} body
 * @param {object} components
 * @returns {string}
 */
function serializeBody(body, components) {
  if (!body || body.length === 0) return '';
  return portableTextToMarkdown(body, { components });
}

/**
 * Build YAML frontmatter for a doc-type document.
 */
function buildDocFrontmatter(doc) {
  const title = (doc.title || 'Untitled').replace(/"/g, '\\"');
  let fm = `---\ntitle: "${title}"\n`;
  if (doc.sidebarPosition != null) {
    fm += `sidebar_position: ${doc.sidebarPosition}\n`;
  }
  if (doc.category) {
    fm += `sidebar_label: "${String(doc.category).replace(/"/g, '\\"')}"\n`;
  }
  if (doc.lastUpdated) {
    fm += `last_update:\n  date: "${doc.lastUpdated}"\n`;
  }
  fm += '---\n';
  return fm;
}

/**
 * Build YAML frontmatter for a releaseNote-type document.
 */
function buildReleaseNoteFrontmatter(doc) {
  const title = (doc.title || 'Untitled').replace(/"/g, '\\"');
  let fm = `---\ntitle: "${title}"\n`;
  if (doc.publishedAt) {
    fm += `date: "${doc.publishedAt}"\n`;
  }
  fm += 'custom_edit_url: null\n---\n';
  return fm;
}

/**
 * Build YAML frontmatter for an article-type document.
 */
function buildArticleFrontmatter(doc) {
  const title = (doc.title || 'Untitled').replace(/"/g, '\\"');
  let fm = `---\ntitle: "${title}"\n`;
  if (doc.publishedAt) {
    fm += `date: "${doc.publishedAt}"\n`;
  }
  fm += 'custom_edit_url: null\n---\n';
  return fm;
}

/**
 * Build YAML frontmatter for a referencePage-type document.
 */
function buildReferencePageFrontmatter(doc) {
  const title = (doc.title || 'Untitled').replace(/"/g, '\\"');
  return `---\ntitle: "${title}"\n---\n`;
}

module.exports = function (context, options) {
  // Create cache dirs synchronously in the factory — plugin-content-docs validates
  // path existence during its own factory call (parallel with ours via Promise.all),
  // so directories must exist before we return the plugin object.
  const cacheRoot = path.join(context.siteDir, '.sanity-cache');
  for (const dir of ALL_CACHE_DIRS) {
    const dirPath = path.join(cacheRoot, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    // Always ensure at least one file exists so plugin-content-docs never fails
    // on an empty directory — real content is written by fetch-sanity-content.js
    const placeholder = path.join(dirPath, '_placeholder.mdx');
    if (!fs.existsSync(placeholder)) {
      fs.writeFileSync(
        placeholder,
        '---\ntitle: "Sanity Content"\nhide_table_of_contents: true\ndraft: true\n---\n\nContent from Sanity will appear here once documents are published.\n',
        'utf8'
      );
    }
  }

  return {
    name: 'docusaurus-plugin-sanity-content',

    async loadContent() {
      // Content is written by scripts/fetch-sanity-content.js (run as a pre-build step
      // in build-with-memory.js) so that plugin-content-docs finds files at init time.
      // This loadContent is a no-op — its only role is satisfying the plugin lifecycle.
      return null;

      // Return null — files on disk are the deliverable
      return null;
    },
  };
};
