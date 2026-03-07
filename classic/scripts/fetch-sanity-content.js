#!/usr/bin/env node
/**
 * Pre-build Sanity content fetch.
 * Writes .mdx files to .sanity-cache/ BEFORE docusaurus build starts,
 * so plugin-content-docs finds populated directories on loadContent.
 *
 * Called from build-with-memory.js. Can also be run standalone:
 *   node scripts/fetch-sanity-content.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..');
const CACHE_ROOT = path.join(SITE_DIR, '.sanity-cache');

const AUDIENCE_DIR_MAP = {
  all: 'docs',
  admin: 'docs-admin',
  manager: 'docs-manager',
  operator: 'docs-operator',
  'operator-minimal': 'docs-operator-minimal',
  internal: 'docs-internal',
};

const ALL_CACHE_DIRS = Object.values(AUDIENCE_DIR_MAP);

async function run() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const apiToken = process.env.SANITY_API_TOKEN;

  if (!projectId) {
    throw new Error('[sanity-content] Missing SANITY_PROJECT_ID env var');
  }
  if (!apiToken) {
    throw new Error('[sanity-content] Missing SANITY_API_TOKEN env var');
  }

  const dataset = process.env.SANITY_DATASET || 'production';

  // Create cache dirs
  for (const dir of ALL_CACHE_DIRS) {
    fs.mkdirSync(path.join(CACHE_ROOT, dir), { recursive: true });
  }

  const { createClient } = require('@sanity/client');
  const { portableTextToMarkdown } = require('@portabletext/markdown');
  const { createImageUrlBuilder } = require('@sanity/image-url');

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  });

  const builder = createImageUrlBuilder(client);

  function sanityImageUrl(imageRef) {
    try {
      return builder.image(imageRef).url();
    } catch {
      return '';
    }
  }

  const components = {
    types: {
      code: ({ value }) =>
        `\`\`\`${value.language || 'text'}\n${value.code || ''}\n\`\`\`\n`,
      callout: ({ value }) =>
        `:::${value.type || 'note'}\n\n${String(value.body || '')}\n\n:::\n`,
      image: ({ value }) => {
        const url = value.asset ? sanityImageUrl(value.asset) : '';
        const alt = value.alt || '';
        const caption = value.caption || '';
        return url ? `![${alt}](${url}${caption ? ` "${caption}"` : ''})\n` : '';
      },
    },
    marks: {
      underline: ({ children }) => `<u>${children}</u>`,
      link: ({ value, children }) => {
        const href = value?.href || '';
        const target = value?.blank ? ' target="_blank"' : '';
        return target
          ? `<a href="${href}"${target}>${children}</a>`
          : `[${children}](${href})`;
      },
    },
  };

  function serializeBody(body) {
    if (!body || !Array.isArray(body)) return '';
    try {
      return portableTextToMarkdown(body, { components });
    } catch (err) {
      console.warn(`[sanity-content] Serialize warning: ${err.message}`);
      return '';
    }
  }

  function escapeYaml(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function buildDocFrontmatter(doc) {
    const lines = ['---', `title: "${escapeYaml(doc.title)}"`];
    if (doc.sidebarPosition != null) lines.push(`sidebar_position: ${doc.sidebarPosition}`);
    if (doc.category) lines.push(`sidebar_label: "${escapeYaml(doc.category)}"`);
    if (doc.lastUpdated) lines.push(`last_update:\n  date: ${doc.lastUpdated}`);
    lines.push('---');
    return lines.join('\n');
  }

  function buildGenericFrontmatter(doc) {
    const lines = ['---', `title: "${escapeYaml(doc.title)}"`];
    if (doc.publishedAt) lines.push(`date: ${doc.publishedAt}`);
    lines.push('---');
    return lines.join('\n');
  }

  const queries = [
    {
      type: 'doc',
      query: `*[_type == "doc" && defined(slug.current)] | order(sidebarPosition asc) {
        title, slug, targetAudience, category, sidebarPosition, body, lastUpdated
      }`,
    },
    {
      type: 'releaseNote',
      query: `*[_type == "releaseNote" && defined(slug.current)] | order(publishedAt desc) {
        title, slug, sprintId, publishedAt, body
      }`,
    },
    {
      type: 'article',
      query: `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
        title, slug, tags, publishedAt, body
      }`,
    },
    {
      type: 'referencePage',
      query: `*[_type == "referencePage" && defined(slug.current)] { title, slug, body }`,
    },
  ];

  for (const { type, query } of queries) {
    console.log(`[sanity-content] Fetching ${type} documents...`);
    let docs;
    try {
      docs = await client.fetch(query);
    } catch (err) {
      throw new Error(`[sanity-content] GROQ query failed for type "${type}": ${err.message}`);
    }
    console.log(`[sanity-content] → ${docs.length} ${type} document(s)`);

    for (const doc of docs) {
      try {
        const slug = doc.slug?.current;
        if (!slug) continue;

        const bodyMd = serializeBody(doc.body);

        if (type === 'doc') {
          const frontmatter = buildDocFrontmatter(doc);
          const content = frontmatter + (bodyMd ? '\n\n' + bodyMd : '');
          const audiences = Array.isArray(doc.targetAudience) && doc.targetAudience.length
            ? doc.targetAudience
            : ['all'];
          for (const audience of audiences) {
            const subDir = AUDIENCE_DIR_MAP[audience];
            if (!subDir) continue;
            const filePath = path.join(CACHE_ROOT, subDir, `${slug}.mdx`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[sanity-content] Wrote doc → ${subDir}/${slug}.mdx`);
          }
        } else {
          const frontmatter = buildGenericFrontmatter(doc);
          const content = frontmatter + (bodyMd ? '\n\n' + bodyMd : '');
          const filePath = path.join(CACHE_ROOT, 'docs', `${slug}.mdx`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`[sanity-content] Wrote ${type} → docs/${slug}.mdx`);
        }
      } catch (err) {
        console.warn(`[sanity-content] Warning: Failed to process ${type} "${doc?.slug?.current}": ${err.message}`);
      }
    }
  }

  // Ensure plugin-content-docs never fails on empty cache dirs
  for (const dir of ALL_CACHE_DIRS) {
    const dirPath = path.join(CACHE_ROOT, dir);
    if (fs.readdirSync(dirPath).length === 0) {
      fs.writeFileSync(
        path.join(dirPath, '_placeholder.mdx'),
        '---\ntitle: "Sanity Content"\nhide_table_of_contents: true\ndraft: true\n---\n\nContent from Sanity will appear here once documents are published.\n'
      );
    }
  }

  console.log('[sanity-content] Done — content written to .sanity-cache/');
}

module.exports = { run };

// Allow standalone execution
if (require.main === module) {
  run().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
