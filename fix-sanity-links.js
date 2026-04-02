const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

async function fixBrokenLinks(dryRun = true) {
  console.log(dryRun ? 'DRY RUN - No changes will be made\n' : 'LIVE RUN - Changes will be made\n');
  
  // Fix contact doc
  const contactDoc = await client.fetch('*[_type == "doc" && slug.current == "support/contact"][0] { _id, _rev, body }');
  
  if (!contactDoc) {
    console.log('Contact doc not found');
    return;
  }
  
  console.log(`Found contact doc: ${contactDoc._id}`);
  
  // Find and fix broken link
  const body = contactDoc.body;
  let fixed = false;
  
  for (const block of body) {
    if (block.markDefs) {
      for (const mark of block.markDefs) {
        if (mark._type === 'link' && mark.href === '/docs/alarm-management/overflow-thresholds') {
          console.log(`  Fixing: ${mark.href} -> /docs/alarm-management/event-overflow`);
          mark.href = '/docs/alarm-management/event-overflow';
          fixed = true;
        }
      }
    }
  }
  
  if (fixed) {
    if (!dryRun) {
      await client.patch(contactDoc._id).set({ body }).commit();
      console.log('\n✓ Updated contact doc');
    } else {
      console.log('\nWould update contact doc with fixed link');
    }
  } else {
    console.log('No broken links found');
  }
  
  // Also check technical-alarms for /docs/alarm-management link
  const techAlarmsDoc = await client.fetch('*[_type == "doc" && slug.current == "alarm-management/technical-alarms"][0] { _id, _rev, body }');
  
  if (techAlarmsDoc) {
    console.log(`\nFound technical-alarms doc: ${techAlarmsDoc._id}`);
    
    const body = techAlarmsDoc.body;
    let fixed = false;
    
    for (const block of body) {
      if (block.markDefs) {
        for (const mark of block.markDefs) {
          if (mark._type === 'link' && mark.href === '/docs/alarm-management') {
            console.log(`  Fixing: ${mark.href} -> /docs/alarm-management/index`);
            mark.href = '/docs/alarm-management/index';
            fixed = true;
          }
        }
      }
    }
    
    if (fixed) {
      if (!dryRun) {
        await client.patch(techAlarmsDoc._id).set({ body }).commit();
        console.log('\n✓ Updated technical-alarms doc');
      } else {
        console.log('\nWould update technical-alarms doc with fixed link');
      }
    } else {
      console.log('No broken links found in technical-alarms');
    }
  }
  
  if (dryRun) {
    console.log('\nRun with --live to apply changes');
  }
}

const args = process.argv.slice(2);
const liveMode = args.includes('--live');

fixBrokenLinks(!liveMode).catch(console.error);
