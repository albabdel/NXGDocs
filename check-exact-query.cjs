const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi'
});

const PRODUCT = 'gcxone';
const productFilter = `(product == "${PRODUCT}" || product == "shared" || !defined(product))`;
const filter = `defined(slug.current) && (!defined(status) || status == "published")`;

(async () => {
  // Exact query from fetch-sanity-content.js
  const query = `*[_type == "doc" && ${filter} && ${productFilter}] | order(sidebarPosition asc) {
    title, slug, targetAudience, category, sidebarPosition, sidebarLabel, hideFromSidebar, body, lastUpdated, description, tags, status, reviewedBy, product,
    "categoryId": sidebarCategory->_id,
    "categorySlug": sidebarCategory->slug.current,
    "categoryTitle": sidebarCategory->title,
    "coverImageUrl": coverImage.asset->url
  }`;
  
  const docs = await client.fetch(query);
  console.log('Total docs:', docs.length);
  
  const timeSyncDocs = docs.filter(d => d.slug && d.slug.current && d.slug.current.includes('time-sync'));
  console.log('time-sync docs found:', timeSyncDocs.length);
  timeSyncDocs.forEach(d => {
    console.log('  -', d.slug.current, '|', d.title, '|', d.status, '|', d.product);
  });
})();
