import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
  apiVersion: '2024-01-01'
});

async function fixNullStatusDocs() {
  console.log('Querying for docs with null status...');
  
  const docs = await client.fetch('*[_type == "doc" && !defined(status)]');
  
  console.log(`Found ${docs.length} docs with null status`);
  
  if (docs.length === 0) {
    console.log('No documents to update.');
    return;
  }
  
  console.log('Updating documents...');
  
  const transaction = client.transaction();
  
  for (const doc of docs) {
    transaction.patch(doc._id, {
      set: { status: 'published' }
    });
  }
  
  const result = await transaction.commit();
  
  console.log(`Successfully updated ${result.results.length} documents`);
  console.log('Document IDs updated:');
  docs.forEach(doc => console.log(`  - ${doc._id}`));
}

fixNullStatusDocs().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
