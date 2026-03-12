const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

async function analyzeContent() {
  const docs = await client.fetch(`*[_type in ["doc","article","releaseNote","referencePage"]]{
    _type,
    _id,
    title,
    status,
    "slug": slug.current,
    "hasCoverImage": coverImage != null,
    "bodyBlockCount": count(body),
    "bodyText": pt::text(body)
  }`)
  
  // Analyze placeholder content
  const analyzed = docs.map(doc => ({
    ...doc,
    bodyTextLength: doc.bodyText ? doc.bodyText.length : 0,
    isPlaceholder: (!doc.hasCoverImage && (!doc.bodyText || doc.bodyText.length < 100)) ? true : false
  }))
  
  console.log(JSON.stringify(analyzed, null, 2))
  
  // Summary
  const placeholders = analyzed.filter(d => d.isPlaceholder)
  console.log('\n\n=== PLACEHOLDER ARTICLES ===')
  console.log(`Total documents: ${analyzed.length}`)
  console.log(`Placeholders found: ${placeholders.length}`)
  console.log('\nPlaceholder IDs:')
  placeholders.forEach(p => {
    console.log(`- ${p._id} (${p._type}): ${p.title || 'No title'}`)
  })
}

analyzeContent().catch(console.error)