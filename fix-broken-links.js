#!/usr/bin/env node
/**
 * Fix broken links in Sanity content
 */
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

const BROKEN_LINK_FIXES = {
  'alarm-management/overflow-thresholds': 'alarm-management/event-overflow',
  'alarm-management': 'alarm-management/index',
};

async function fetchDocsWithBody() {
  return client.fetch(`*[_type == "doc" && defined(body)] { 
    _id, _rev, title, body 
  }`);
}

function extractAndFixLinks(body) {
  if (!body) return { fixed: false, changes: [] };
  
  const bodyStr = JSON.stringify(body);
  let fixedStr = bodyStr;
  const changes = [];
  
  for (const [broken, fixed] of Object.entries(BROKEN_LINK_FIXES)) {
    const brokenPattern = `](/docs/${broken})`;
    const fixedPattern = `](/docs/${fixed})`;
    
    if (bodyStr.includes(brokenPattern)) {
      fixedStr = fixedStr.split(brokenPattern).join(fixedPattern);
      changes.push({ from: broken, to: fixed });
    }
  }
  
  if (fixedStr !== bodyStr) {
    return { fixed: true, changes, body: JSON.parse(fixedStr) };
  }
  
  return { fixed: false, changes: [] };
}

async function runFixes(dryRun = true) {
  console.log(dryRun ? 'DRY RUN - No changes will be made\n' : 'LIVE RUN - Changes will be made\n');
  
  const docs = await fetchDocsWithBody();
  console.log(`Found ${docs.length} documents with body content\n`);
  
  const fixes = [];
  
  for (const doc of docs) {
    const result = extractAndFixLinks(doc.body);
    
    if (result.fixed) {
      console.log(`[BROKEN LINK] ${doc.title}:`);
      for (const change of result.changes) {
        console.log(`  /docs/${change.from} -> /docs/${change.to}`);
      }
      fixes.push({ id: doc._id, title: doc.title, changes: result.changes, body: result.body });
      
      if (!dryRun) {
        try {
          await client.patch(doc._id).set({ body: result.body }).commit();
          console.log(`  ✓ Updated`);
        } catch (err) {
          console.error(`  ✗ Failed: ${err.message}`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Total fixes: ${fixes.length}`);
  console.log('='.repeat(60));
  
  if (dryRun && fixes.length > 0) {
    console.log('\nRun with --live to apply changes');
  }
}

const args = process.argv.slice(2);
const liveMode = args.includes('--live');

runFixes(!liveMode).catch(console.error);
