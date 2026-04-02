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
  const query = `*[_type == "doc" && ${filter} && ${productFilter}] | order(sidebarPosition asc) {
    title, slug, targetAudience, category, sidebarPosition, sidebarLabel, hideFromSidebar, body, lastUpdated, description, tags, status, reviewedBy, product,
    "categoryId": sidebarCategory->_id,
    "categorySlug": sidebarCategory->slug.current,
    "categoryTitle": sidebarCategory->title,
    "coverImageUrl": coverImage.asset->url
  }`;
  
  const docs = await client.fetch(query);
  
  // Check slug structure
  const timeSyncDoc = docs.find(d => d.slug && d.slug.current && d.slug.current.includes('time-sync'));
  if (timeSyncDoc) {
    console.log('Found time-sync doc:');
    console.log('  slug type:', typeof timeSyncDoc.slug);
    console.log('  slug value:', JSON.stringify(timeSyncDoc.slug, null, 2));
    console.log('  slug.current:', timeSyncDoc.slug.current);
    console.log('  title:', timeSyncDoc.title);
    console.log('  targetAudience:', timeSyncDoc.targetAudience);
    console.log('  body length:', timeSyncDoc.body ? timeSyncDoc.body.length : 'no body');
  } else {
    console.log('time-sync doc not found');
  }
})();
