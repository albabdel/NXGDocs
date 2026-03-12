const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

async function hidePlaceholders() {
  // Find thin/placeholder content
  const docs = await client.fetch(`*[_type in ["doc", "article", "releaseNote", "referencePage"]]{
    _id,
    _type,
    title,
    status,
    "slug": slug.current,
    "bodyLength": length(pt::text(body)),
    "hasCoverImage": defined(coverImage)
  }`)
  
  const placeholders = docs.filter(doc => {
    // Criteria for placeholder:
    // - No cover image AND body text < 200 chars
    // - OR status is null/undefined
    // - OR title contains "Test" or is very short
    const isThin = !doc.hasCoverImage && (doc.bodyLength || 0) < 200
    const hasTestTitle = doc.title?.toLowerCase().includes('test') || 
                         doc.title?.toLowerCase().includes('cms-configuration') ||
                         doc.title === 'Markdown page example'
    const hasNoStatus = !doc.status
    const isTestSlug = doc.slug?.includes('test') || 
                       doc.slug?.includes('cms-configuration') ||
                       doc.slug === 'markdown-page'
    
    return (isThin || hasTestTitle || hasNoStatus) && isTestSlug
  })
  
  console.log(`Found ${placeholders.length} placeholder documents to hide:\n`)
  placeholders.forEach(p => {
    console.log(`  - ${p._id}: ${p.title || 'Untitled'} (${p.bodyLength || 0} chars)`)
  })
  
  if (placeholders.length === 0) {
    console.log('No placeholders to hide.')
    return
  }
  
  console.log('\nHiding from production...')
  
  const transaction = client.transaction()
  
  placeholders.forEach(doc => {
    transaction.patch(doc._id, {
      set: {
        status: 'draft',
        hiddenFromProduction: true,
        isPlaceholder: true
      }
    })
  })
  
  await transaction.commit()
  console.log(`\n✓ Hidden ${placeholders.length} placeholder documents from production`)
}

hidePlaceholders().catch(console.error)