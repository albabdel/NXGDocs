const PRODUCT = 'gcxone';
const productFilter = `(product == "${PRODUCT}" || product == "shared" || !defined(product))`;

function statusFilterClause(includeDrafts) {
  if (includeDrafts) return 'defined(slug.current)';
  return 'defined(slug.current) && (!defined(status) || status == "published")';
}

function getQueries(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return [
    {
      type: 'doc',
      query: `*[_type == "doc" && ${filter} && ${productFilter}] | order(sidebarPosition asc) {
        title, slug, targetAudience, category, sidebarPosition, sidebarLabel, hideFromSidebar, body, lastUpdated, description, tags, status, reviewedBy, product,
        "categoryId": sidebarCategory->_id,
        "categorySlug": sidebarCategory->slug.current,
        "categoryTitle": sidebarCategory->title,
        "coverImageUrl": coverImage.asset->url
      }`,
    },
  ];
}

const queries = getQueries(false);
console.log('Query for doc type:');
console.log(queries[0].query);
