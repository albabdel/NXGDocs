// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const { portableTextToMarkdown } = require('@portabletext/markdown');
const imageUrlBuilder = require('@sanity/image-url');

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
  const builder = imageUrlBuilder(client);

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
  return {
    name: 'docusaurus-plugin-sanity-content',

    async loadContent() {
      // 1. Validate required env vars
      const projectId = process.env.SANITY_PROJECT_ID;
      const apiToken = process.env.SANITY_API_TOKEN;

      if (!projectId) {
        throw new Error(
          '[sanity-content] Missing required env var: SANITY_PROJECT_ID\n' +
            'Set SANITY_PROJECT_ID to your Sanity project ID before running the build.'
        );
      }
      if (!apiToken) {
        throw new Error(
          '[sanity-content] Missing required env var: SANITY_API_TOKEN\n' +
            'Set SANITY_API_TOKEN to a Sanity read token before running the build.'
        );
      }

      const dataset = process.env.SANITY_DATASET || 'production';
      const cacheRoot = path.join(context.siteDir, '.sanity-cache');

      // 2. Create all 6 cache subdirectories up front
      for (const dir of ALL_CACHE_DIRS) {
        fs.mkdirSync(path.join(cacheRoot, dir), { recursive: true });
      }
      console.log(`[sanity-content] Cache directories created at ${cacheRoot}`);

      // 3. Create Sanity client
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-02-06',
        useCdn: false,
        token: apiToken,
      });

      const components = buildComponents(client);

      // 4. Fetch docs
      console.log('[sanity-content] Fetching doc documents...');
      let docs;
      try {
        docs = await client.fetch(QUERY_DOCS);
      } catch (err) {
        throw new Error(`[sanity-content] Failed to fetch docs: ${err.message}`);
      }
      console.log(`[sanity-content] Fetched ${docs.length} doc(s)`);

      for (const doc of docs) {
        try {
          const slug = doc.slug.current;
          const frontmatter = buildDocFrontmatter(doc);
          const bodyMd = serializeBody(doc.body, components);
          const content = frontmatter + (bodyMd ? '\n' + bodyMd : '');

          // Apply audience → directory mapping; default to ['all']
          const audiences =
            Array.isArray(doc.targetAudience) && doc.targetAudience.length > 0
              ? doc.targetAudience
              : ['all'];

          for (const audience of audiences) {
            const subDir = AUDIENCE_DIR_MAP[audience] || 'docs';
            const filePath = path.join(cacheRoot, subDir, `${slug}.mdx`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[sanity-content] Wrote doc → ${subDir}/${slug}.mdx (audience: ${audience})`);
          }
        } catch (err) {
          console.warn(`[sanity-content] Warning: Failed to process doc "${doc?.slug?.current}": ${err.message}`);
        }
      }

      // 5. Fetch release notes
      console.log('[sanity-content] Fetching releaseNote documents...');
      let releaseNotes;
      try {
        releaseNotes = await client.fetch(QUERY_RELEASE_NOTES);
      } catch (err) {
        throw new Error(`[sanity-content] Failed to fetch releaseNotes: ${err.message}`);
      }
      console.log(`[sanity-content] Fetched ${releaseNotes.length} releaseNote(s)`);

      for (const doc of releaseNotes) {
        try {
          const slug = doc.slug.current;
          const frontmatter = buildReleaseNoteFrontmatter(doc);
          const bodyMd = serializeBody(doc.body, components);
          const content = frontmatter + (bodyMd ? '\n' + bodyMd : '');
          const filePath = path.join(cacheRoot, 'docs', `${slug}.mdx`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[sanity-content] Wrote releaseNote → docs/${slug}.mdx`);
        } catch (err) {
          console.warn(`[sanity-content] Warning: Failed to process releaseNote "${doc?.slug?.current}": ${err.message}`);
        }
      }

      // 6. Fetch articles
      console.log('[sanity-content] Fetching article documents...');
      let articles;
      try {
        articles = await client.fetch(QUERY_ARTICLES);
      } catch (err) {
        throw new Error(`[sanity-content] Failed to fetch articles: ${err.message}`);
      }
      console.log(`[sanity-content] Fetched ${articles.length} article(s)`);

      for (const doc of articles) {
        try {
          const slug = doc.slug.current;
          const frontmatter = buildArticleFrontmatter(doc);
          const bodyMd = serializeBody(doc.body, components);
          const content = frontmatter + (bodyMd ? '\n' + bodyMd : '');
          const filePath = path.join(cacheRoot, 'docs', `${slug}.mdx`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[sanity-content] Wrote article → docs/${slug}.mdx`);
        } catch (err) {
          console.warn(`[sanity-content] Warning: Failed to process article "${doc?.slug?.current}": ${err.message}`);
        }
      }

      // 7. Fetch reference pages
      console.log('[sanity-content] Fetching referencePage documents...');
      let referencePages;
      try {
        referencePages = await client.fetch(QUERY_REFERENCE_PAGES);
      } catch (err) {
        throw new Error(`[sanity-content] Failed to fetch referencePages: ${err.message}`);
      }
      console.log(`[sanity-content] Fetched ${referencePages.length} referencePage(s)`);

      for (const doc of referencePages) {
        try {
          const slug = doc.slug.current;
          const frontmatter = buildReferencePageFrontmatter(doc);
          const bodyMd = serializeBody(doc.body, components);
          const content = frontmatter + (bodyMd ? '\n' + bodyMd : '');
          const filePath = path.join(cacheRoot, 'docs', `${slug}.mdx`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[sanity-content] Wrote referencePage → docs/${slug}.mdx`);
        } catch (err) {
          console.warn(`[sanity-content] Warning: Failed to process referencePage "${doc?.slug?.current}": ${err.message}`);
        }
      }

      console.log('[sanity-content] Done — all content written to .sanity-cache/');

      // Return null — files on disk are the deliverable
      return null;
    },
  };
};
