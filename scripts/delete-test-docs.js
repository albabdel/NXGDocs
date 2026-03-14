const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
})

async function deleteTestDocs() {
  console.log('Querying for test documents...\n')
  
  const query = `*[_type == "doc" && (title match "Test*" || title == "CMS Configuration Test" || title == "Markdown page example")]{
    _id,
    title
  }`
  
  const docs = await client.fetch(query)
  
  if (docs.length === 0) {
    console.log('No test documents found.')
    return
  }
  
  console.log(`Found ${docs.length} test document(s):\n`)
  docs.forEach(doc => {
    console.log(`  - [${doc._id}] ${doc.title}`)
  })
  
  console.log('\nDeleting documents...\n')
  
  for (const doc of docs) {
    await client.delete(doc._id)
    console.log(`  Deleted: ${doc.title} (${doc._id})`)
  }
  
  console.log(`\nSuccessfully deleted ${docs.length} document(s).`)
}

deleteTestDocs().catch(console.error)
