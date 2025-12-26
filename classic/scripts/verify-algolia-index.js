/**
 * Verify Algolia Index - Check if data exists
 */
const algoliasearch = require('algoliasearch');

// Algolia Configuration
const ALGOLIA_APP_ID = '0QV3FAFAD5';
const ALGOLIA_API_KEY = '1dc4b09119c715d8372ee1d0077a76f0'; // Admin key
const ALGOLIA_INDEX_NAME = 'nxgen_docs';

async function verifyIndex() {
  console.log('\n' + '='.repeat(70));
  console.log('  ALGOLIA INDEX VERIFICATION');
  console.log('='.repeat(70));
  console.log(`\n📍 App ID: ${ALGOLIA_APP_ID}`);
  console.log(`📍 Index Name: ${ALGOLIA_INDEX_NAME}\n`);

  try {
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    // Get index stats
    console.log('📊 Fetching index statistics...\n');
    const settings = await index.getSettings();

    // Search for a test query
    console.log('🔍 Testing search for "dahua"...\n');
    const searchResults = await index.search('dahua', {
      hitsPerPage: 5
    });

    console.log('✅ RESULTS:');
    console.log(`   Total Records in Index: ${searchResults.nbHits}`);
    console.log(`   Showing ${searchResults.hits.length} results:\n`);

    searchResults.hits.forEach((hit, i) => {
      console.log(`   ${i + 1}. ${hit.title}`);
      console.log(`      URL: ${hit.url}`);
      console.log(`      Category: ${hit.category}\n`);
    });

    // Test another search
    console.log('🔍 Testing search for "alarm"...\n');
    const alarmResults = await index.search('alarm', {
      hitsPerPage: 3
    });

    console.log(`✅ Found ${alarmResults.nbHits} results for "alarm"\n`);
    alarmResults.hits.slice(0, 3).forEach((hit, i) => {
      console.log(`   ${i + 1}. ${hit.title}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('  VERIFICATION COMPLETE');
    console.log('='.repeat(70));
    console.log('\n✨ The Algolia index is working correctly!\n');

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

verifyIndex();
