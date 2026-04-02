const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function migrate() {
  console.log('Fetching documents without product...');
  
  // Get all docs without product field
  const docs = await client.fetch('*[!defined(product)]{_id, _type, _rev}');
  console.log(`Found ${docs.length} documents to migrate`);
  
  if (docs.length === 0) {
    console.log('No documents need migration');
    return;
  }
  
  // Batch update in groups of 100
  const batchSize = 100;
  let updated = 0;
  
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const transaction = client.transaction();
    
    batch.forEach(doc => {
      transaction.patch(doc._id, {
        set: { product: 'gcxone' }
      });
    });
    
    await transaction.commit();
    updated += batch.length;
    console.log(`Updated ${updated}/${docs.length} documents...`);
  }
  
  console.log(`Migration complete! Updated ${updated} documents.`);
}

migrate().catch(console.error);
