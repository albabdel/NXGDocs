/**
 * Test the search-only API key from docusaurus.config.ts
 */
const algoliasearch = require('algoliasearch');

// These are the EXACT credentials from docusaurus.config.ts
const ALGOLIA_APP_ID = '0QV3FAFAD5';
const ALGOLIA_SEARCH_KEY = 'e152916a3f5684772ff4bc5ca42bde7e'; // Search-only key
const ALGOLIA_INDEX_NAME = 'nxgen_docs';

async function testSearchKey() {
  console.log('\n' + '='.repeat(70));
  console.log('  TESTING SEARCH-ONLY API KEY');
  console.log('='.repeat(70));
  console.log(`\n📍 App ID: ${ALGOLIA_APP_ID}`);
  console.log(`📍 Search Key: ${ALGOLIA_SEARCH_KEY}`);
  console.log(`📍 Index Name: ${ALGOLIA_INDEX_NAME}\n`);

  try {
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    console.log('🔍 Testing search for "dahua" with search-only key...\n');
    const results = await index.search('dahua', {
      hitsPerPage: 3
    });

    console.log(`✅ SUCCESS! Found ${results.nbHits} results:\n`);
    results.hits.forEach((hit, i) => {
      console.log(`   ${i + 1}. ${hit.title} (${hit.url})`);
    });

    console.log('\n✨ The search-only API key is WORKING correctly!');
    console.log('\n🔍 This means the issue is in the Docusaurus integration,');
    console.log('   NOT with the Algolia credentials.\n');

  } catch (error) {
    console.error('\n❌ SEARCH KEY TEST FAILED!');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 This means the search-only API key is INVALID.');
    console.error('   You need to generate a new search-only API key in Algolia dashboard.\n');
  }
}

testSearchKey();
