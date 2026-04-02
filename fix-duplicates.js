const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

async function handleDuplicates(dryRun = true) {
  console.log(dryRun ? 'DRY RUN\n' : 'LIVE RUN\n');
  
  const docs = await client.fetch(`*[_type == "doc"] { _id, title, slug, status }`);
  
  // Group by slug
  const slugGroups = new Map();
  for (const doc of docs) {
    if (!doc.slug?.current) continue;
    const slug = doc.slug.current;
    if (!slugGroups.has(slug)) {
      slugGroups.set(slug, []);
    }
    slugGroups.get(slug).push(doc);
  }
  
  let duplicateCount = 0;
  let fixedCount = 0;
  
  for (const [slug, group] of slugGroups) {
    if (group.length > 1) {
      duplicateCount++;
      console.log(`\n"${slug}" (${group.length} docs):`);
      
      // Sort by ID to keep the first one (usually the original)
      group.sort((a, b) => a._id.localeCompare(b._id));
      
      // Keep first, unpublish others
      const toUnpublish = group.slice(1);
      
      for (const doc of toUnpublish) {
        if (doc.status === 'published') {
          console.log(`  - Unpublish: ${doc.title} (${doc._id})`);
          if (!dryRun) {
            try {
              await client.patch(doc._id).set({ status: 'draft' }).commit();
              console.log(`    ✓ Unpublished`);
              fixedCount++;
            } catch (err) {
              console.log(`    ✗ Failed: ${err.message}`);
            }
          }
        } else {
          console.log(`  - Already draft: ${doc.title} (${doc._id})`);
        }
      }
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total duplicate slugs: ${duplicateCount}`);
  console.log(`Docs to unpublish: ${fixedCount}`);
  console.log('='.repeat(60));
  
  if (dryRun) {
    console.log('\nRun with --live to apply changes');
  }
}

const args = process.argv.slice(2);
handleDuplicates(!args.includes('--live')).catch(console.error);
