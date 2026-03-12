const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

// Expected categories based on slug structure
const CATEGORY_MAP = {
  'getting-started': 'Getting Started',
  'devices': 'Devices',
  'features': 'Features',
  'alarm-management': 'Alarm Management',
  'operator-guide': 'Operator Guide',
  'installer-guide': 'Installer Guide',
  'platform-fundamentals': 'Platform Fundamentals',
  'reporting': 'Reporting',
  'knowledge-base': 'Knowledge Base',
  'support': 'Support',
}

async function fixStructure() {
  console.log('=== FIXING CONTENT STRUCTURE ===\n')
  
  // Get all docs
  const docs = await client.fetch(`*[_type == "doc" && defined(slug.current)]{
    _id,
    title,
    "slug": slug.current,
    category,
    status,
    sidebarPosition
  }`)
  
  const transaction = client.transaction()
  let updateCount = 0
  
  for (const doc of docs) {
    const slugPath = doc.slug || ''
    const parts = slugPath.split('/')
    const categorySlug = parts[0]
    
    // Determine category from slug
    const expectedCategory = CATEGORY_MAP[categorySlug] || categorySlug
    const needsCategoryUpdate = doc.category !== expectedCategory && expectedCategory
    
    // Check if sidebarPosition is missing
    const needsPositionUpdate = doc.sidebarPosition === undefined || doc.sidebarPosition === null
    
    if (needsCategoryUpdate || needsPositionUpdate) {
      const updates = {}
      
      if (needsCategoryUpdate) {
        updates.category = expectedCategory
        console.log(`✏️  ${doc.slug}`)
        console.log(`   Category: "${doc.category || 'none'}" → "${expectedCategory}"`)
      }
      
      // Set default position based on slug
      if (needsPositionUpdate) {
        const position = parseInt(parts[parts.length - 1]?.match(/\d+/)?.[0] || '99')
        updates.sidebarPosition = position
        console.log(`   Position: set to ${position}`)
      }
      
      transaction.patch(doc._id, {set: updates})
      updateCount++
    }
  }
  
  if (updateCount > 0) {
    console.log(`\nUpdating ${updateCount} documents...`)
    await transaction.commit()
    console.log('✓ Updates applied')
  } else {
    console.log('All documents already have correct structure')
  }
  
  // Summary
  console.log('\n=== SUMMARY ===')
  const updated = await client.fetch(`*[_type == "doc"]{
    category,
    "slug": slug.current
  }`)
  
  const byCategory = {}
  updated.forEach(d => {
    const cat = d.category || 'uncategorized'
    byCategory[cat] = (byCategory[cat] || 0) + 1
  })
  
  console.log('\nDocuments by category:')
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`)
  })
}

fixStructure().catch(console.error)