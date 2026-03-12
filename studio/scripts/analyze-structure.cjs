const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

async function analyzeStructure() {
  // Get all docs with their slugs and categories
  const docs = await client.fetch(`*[_type == "doc" && defined(slug.current)]{
    _id,
    title,
    "slug": slug.current,
    status,
    category,
    sidebarPosition,
    targetAudience,
    "bodyLength": length(pt::text(body))
  } | order(slug)`)
  
  // Group by category/section
  const sections = {}
  docs.forEach(doc => {
    const category = doc.category || 'root'
    if (!sections[category]) {
      sections[category] = []
    }
    sections[category].push(doc)
  })
  
  console.log('=== CURRENT CONTENT STRUCTURE ===\n')
  console.log(`Total documents: ${docs.length}\n`)
  
  Object.keys(sections).sort().forEach(section => {
    console.log(`\n📁 ${section || 'root'}/ (${sections[section].length} docs)`)
    sections[section]
      .sort((a, b) => (a.sidebarPosition || 99) - (b.sidebarPosition || 99))
      .forEach(doc => {
        const status = doc.status || 'no-status'
        const icon = status === 'published' ? '🟢' : status === 'draft' ? '🔘' : '⚪'
        console.log(`   ${icon} ${doc.slug}`)
        console.log(`      └─ ${doc.title}`)
      })
  })
  
  // Check for missing content
  console.log('\n\n=== MISSING CONTENT (under 100 chars) ===')
  const thinContent = docs.filter(d => (d.bodyLength || 0) < 100)
  thinContent.forEach(doc => {
    console.log(`⚠️  ${doc.slug} - ${doc.bodyLength || 0} chars`)
  })
}

analyzeStructure().catch(console.error)