const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN
})

// Placeholder documents to unpublish
const placeholderIds = [
  '4213dde0-a208-488e-8b4a-6c94d0f4d463', // Test Integration Doc
  '5dd5ec85-0519-4ac5-bafe-2af1a23b20e0', // Test
  '64e8f547-50e4-4988-b552-bf2ae28868da', // Test1234
]

async function unpublishPlaceholders() {
  console.log('Unpublishing placeholder articles...\n')
  
  const transaction = client.transaction()
  
  for (const id of placeholderIds) {
    // Set status to 'draft' and add a flag to hide from production
    transaction.patch(id, {
      set: {
        status: 'draft',
        isPlaceholder: true,
        hiddenFromProduction: true
      }
    })
    console.log(`Marking as draft: ${id}`)
  }
  
  await transaction.commit()
  console.log('\n✓ All placeholder articles unpublished')
  
  // Verify
  const updated = await client.fetch(`*[_id in $ids]{_id, title, status, isPlaceholder}`, {ids: placeholderIds})
  console.log('\nUpdated documents:')
  console.log(JSON.stringify(updated, null, 2))
}

unpublishPlaceholders().catch(console.error)