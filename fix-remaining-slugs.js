const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

const MANUAL_FIXES = [
  { slug: 'installer-guide/required-ports--endpoints', fix: 'installer-guide/required-ports-endpoints' },
  { slug: 'Features/auto-stream', fix: 'features/auto-stream' },
];

async function fixSlugs(dryRun = true) {
  console.log(dryRun ? 'DRY RUN\n' : 'LIVE RUN\n');
  
  for (const { slug, fix } of MANUAL_FIXES) {
    const docs = await client.fetch(`*[_type == "doc" && slug.current == $slug] { _id, title, slug }`, { slug });
    
    if (docs.length === 0) {
      console.log(`No doc found with slug: ${slug}`);
      continue;
    }
    
    for (const doc of docs) {
      console.log(`${doc.title}: ${slug} -> ${fix}`);
      if (!dryRun) {
        await client.patch(doc._id).set({ slug: { current: fix } }).commit();
        console.log(`  ✓ Updated`);
      }
    }
  }
  
  // Also check for duplicates with "auto-stream-new"
  const autoStreamDocs = await client.fetch(`*[_type == "doc" && slug.current == "features/auto-stream-new"] { _id, title }`);
  console.log(`\nAuto Stream docs with "features/auto-stream-new": ${autoStreamDocs.length}`);
  if (autoStreamDocs.length > 1) {
    console.log('Duplicates found:');
    for (let i = 1; i < autoStreamDocs.length; i++) {
      console.log(`  - ${autoStreamDocs[i].title} (${autoStreamDocs[i]._id})`);
      if (!dryRun) {
        await client.delete(autoStreamDocs[i]._id);
        console.log(`    ✓ Deleted`);
      }
    }
  }
  
  // Check for genesis-audio duplicates
  const genesisDocs = await client.fetch(`*[_type == "doc" && slug.current == "devices/genesis-audio"] { _id, title }`);
  console.log(`\nGenesis Audio docs with "devices/genesis-audio": ${genesisDocs.length}`);
  if (genesisDocs.length > 1) {
    console.log('Duplicates found:');
    for (let i = 1; i < genesisDocs.length; i++) {
      console.log(`  - ${genesisDocs[i].title} (${genesisDocs[i]._id})`);
      if (!dryRun) {
        await client.delete(genesisDocs[i]._id);
        console.log(`    ✓ Deleted`);
      }
    }
  }
  
  if (dryRun) {
    console.log('\nRun with --live to apply changes');
  }
}

const args = process.argv.slice(2);
fixSlugs(!args.includes('--live')).catch(console.error);
