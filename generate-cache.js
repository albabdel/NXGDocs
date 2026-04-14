#!/usr/bin/env node
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: true, // CDN OK for read
  token: 'skrDjnhpDRzNNkD5IgIwEY1c9wiC3JEpfLRqz34aV2U4JQ1JTpHayqmau4LrZzmkig2ekdkfSoHzpJkAOkWVfjjBdmgE3FtPZPl2OchAHjU4pAL3Xe7jxcoAVnKUitg8zmiFgBeYqIoOMS7Ndv0pbwagOubDqRFXLh6LxCbdFqTcJ0yQkVpE',
});

async function generateCache() {
  console.log('Generating Sanity cache...');

  // Create cache dir
  const cacheDir = '.sanity-cache/gcxone-docs';
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Fetch root sidebar categories + children
  const sidebarQuery = `
    *[_type == "sidebarCategory" && !defined(parent)] | order(position asc) {
      _id, title, position, slug,
      "children": *[_type == "sidebarCategory" && parent._ref == ^._id] | order(position asc) {
        _id, title, position, slug
      },
      "docs": *[_type == "doc" && sidebarCategory._ref == ^._id && status == "published"] | order(sidebarPosition asc) {
        _id, title, slug {current}, sidebarPosition
      }
    }
  `;
  const sidebar = await client.fetch(sidebarQuery);
  fs.writeFileSync(path.join(cacheDir, 'sidebar.json'), JSON.stringify(sidebar, null, 2));
  console.log(`Cached ${sidebar.length} sidebar categories`);

  // Fetch all published docs with sidebar ref
  const docsQuery = `*[_type == "doc" && status == "published" && defined(sidebarCategory)] | order(sidebarPosition asc) {
    _id, title, slug {current}, "category": sidebarCategory-> {title, _id}, sidebarPosition, status
  }`;
  const docs = await client.fetch(docsQuery);
  fs.writeFileSync(path.join(cacheDir, 'docs.json'), JSON.stringify(docs, null, 2));
  console.log(`Cached ${docs.length} published docs`);

  // Audit sidebar categories items
  const categoriesQuery = `*[_type == "sidebarCategory"] | order(position asc) {
    _id, title, position, "itemCount": count(items), "hasItems": defined(items) && count(items) > 0
  }`;
  const categories = await client.fetch(categoriesQuery);
  const emptyItems = categories.filter(c => !c.hasItems);
  console.log(`Categories with null/empty items: ${emptyItems.length}/${categories.length}`);
  if (emptyItems.length > 0) {
    console.log('Examples:', emptyItems.slice(0, 5).map(c => `${c.title} (pos ${c.position || 'N/A'})`));
  }

  // Count null status docs
  const statusQuery = `*[_type in ["doc", "article", "landingPage"] && status == null] { _id, _type, title }`;
  const nullStatus = await client.fetch(statusQuery);
  console.log(`Docs with null status: ${nullStatus.length}`);

  console.log('Cache generated successfully!');
}

generateCache().catch(console.error);
