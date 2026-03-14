const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
})

async function deletePlaceholderContent() {
  console.log('Querying for placeholder content...\n')
  
  const allDeletions = []
  
  const draftDocs = await client.fetch(
    `*[_type == "doc" && status == "draft"]{ _id, title, status }`
  )
  console.log(`Found ${draftDocs.length} draft documents`)
  draftDocs.forEach(doc => {
    allDeletions.push({ id: doc._id, title: doc.title, reason: 'draft status' })
  })
  
  const placeholderReleaseNotes = await client.fetch(
    `*[_type == "releaseNote" && isPlaceholder == true]{ _id, title, isPlaceholder }`
  )
  console.log(`Found ${placeholderReleaseNotes.length} placeholder release notes`)
  placeholderReleaseNotes.forEach(doc => {
    allDeletions.push({ id: doc._id, title: doc.title || 'Untitled', reason: 'isPlaceholder: true' })
  })
  
  const readmeDocs = await client.fetch(
    `*[_type == "doc" && slug.current == "readme"]{ _id, title, slug }`
  )
  console.log(`Found ${readmeDocs.length} readme documents`)
  readmeDocs.forEach(doc => {
    allDeletions.push({ id: doc._id, title: doc.title, reason: 'readme doc' })
  })
  
  const comprehensiveGuideDocs = await client.fetch(
    `*[_type == "doc" && body match "*Comprehensive guide for*"]{ _id, title }`
  )
  console.log(`Found ${comprehensiveGuideDocs.length} docs with "Comprehensive guide for" placeholder text`)
  comprehensiveGuideDocs.forEach(doc => {
    if (!allDeletions.find(d => d.id === doc._id)) {
      allDeletions.push({ id: doc._id, title: doc.title, reason: 'contains "Comprehensive guide for"' })
    }
  })
  
  const devicePlaceholderDocs = await client.fetch(
    `*[_type == "doc" && body match "*This device integrates seamlessly*"]{ _id, title }`
  )
  console.log(`Found ${devicePlaceholderDocs.length} docs with "This device integrates seamlessly" placeholder text`)
  devicePlaceholderDocs.forEach(doc => {
    if (!allDeletions.find(d => d.id === doc._id)) {
      allDeletions.push({ id: doc._id, title: doc.title, reason: 'contains "This device integrates seamlessly"' })
    }
  })
  
  if (allDeletions.length === 0) {
    console.log('\nNo placeholder content found to delete.')
    return
  }
  
  console.log(`\nTotal documents to delete: ${allDeletions.length}\n`)
  console.log('Documents to be deleted:')
  console.log('-'.repeat(80))
  
  const grouped = {}
  allDeletions.forEach(doc => {
    if (!grouped[doc.reason]) grouped[doc.reason] = []
    grouped[doc.reason].push(doc)
  })
  
  Object.entries(grouped).forEach(([reason, docs]) => {
    console.log(`\n${reason} (${docs.length} docs):`)
    docs.forEach(doc => {
      console.log(`  - [${doc.id}] ${doc.title}`)
    })
  })
  
  console.log('\n' + '-'.repeat(80))
  console.log('\nDeleting documents...\n')
  
  const deleted = []
  const failed = []
  
  for (const doc of allDeletions) {
    try {
      await client.delete(doc.id)
      console.log(`  Deleted: ${doc.title} (${doc.id})`)
      deleted.push(doc)
    } catch (error) {
      console.log(`  FAILED: ${doc.title} (${doc.id}) - ${error.message}`)
      failed.push({ ...doc, error: error.message })
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`Total documents found: ${allDeletions.length}`)
  console.log(`Successfully deleted: ${deleted.length}`)
  if (failed.length > 0) {
    console.log(`Failed to delete: ${failed.length}`)
    failed.forEach(f => console.log(`  - ${f.title}: ${f.error}`))
  }
}

deletePlaceholderContent().catch(console.error)
