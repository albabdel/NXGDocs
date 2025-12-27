const https = require('https');

const appId = '0QV3FAFAD5';
const apiKey = 'f479e424871288c2e571a23557f7a62b';
const indexName = 'nxgen_docs';

// Test 1: Check index statistics
console.log('🔍 Testing Algolia Search Configuration...\n');
console.log('Configuration:');
console.log('- App ID:', appId);
console.log('- Index:', indexName);
console.log('- API Key:', apiKey.substring(0, 10) + '...\n');

// Function to make Algolia API request
function makeRequest(path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${appId}-dsn.algolia.net`,
      port: 443,
      path: path,
      method: data ? 'POST' : 'GET',
      headers: {
        'X-Algolia-API-Key': apiKey,
        'X-Algolia-Application-Id': appId,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAlgolia() {
  try {
    // Test 1: Get index settings
    console.log('📊 Step 1: Checking index settings...');
    try {
      const settings = await makeRequest(`/1/indexes/${indexName}/settings`);
      console.log('✅ Index exists');
      console.log('Settings:', JSON.stringify(settings, null, 2));
    } catch (error) {
      console.log('❌ Error getting settings:', error.message);
    }

    console.log('\n---\n');

    // Test 2: Search with empty query to get all records
    console.log('🔎 Step 2: Testing search (empty query to retrieve records)...');
    try {
      const searchResults = await makeRequest(`/1/indexes/${indexName}/query`, {
        query: '',
        hitsPerPage: 5,
      });

      console.log('✅ Search API is working');
      console.log('Total hits:', searchResults.nbHits);
      console.log('Pages:', searchResults.nbPages);

      if (searchResults.hits && searchResults.hits.length > 0) {
        console.log('\n📄 Sample records:');
        searchResults.hits.slice(0, 3).forEach((hit, idx) => {
          console.log(`\n${idx + 1}. ${hit.hierarchy?.lvl0 || hit.title || 'Untitled'}`);
          console.log('   URL:', hit.url || 'No URL');
          console.log('   Object ID:', hit.objectID);
        });
      } else {
        console.log('\n⚠️  WARNING: Index has 0 records!');
        console.log('The crawler may not have run yet, or there may be an issue with indexing.');
      }
    } catch (error) {
      console.log('❌ Search error:', error.message);
    }

    console.log('\n---\n');

    // Test 3: Try a specific search query
    console.log('🔍 Step 3: Testing search with query "getting started"...');
    try {
      const queryResults = await makeRequest(`/1/indexes/${indexName}/query`, {
        query: 'getting started',
        hitsPerPage: 3,
      });

      console.log('Hits found:', queryResults.nbHits);

      if (queryResults.hits && queryResults.hits.length > 0) {
        console.log('\n📄 Results:');
        queryResults.hits.forEach((hit, idx) => {
          console.log(`\n${idx + 1}. ${hit.hierarchy?.lvl0 || hit.title || 'Untitled'}`);
          console.log('   URL:', hit.url || 'No URL');
        });
      } else {
        console.log('⚠️  No results found for "getting started"');
      }
    } catch (error) {
      console.log('❌ Query error:', error.message);
    }

    console.log('\n---\n');

    // Test 4: Browse index to see what's actually in there
    console.log('📋 Step 4: Browsing index records...');
    try {
      const browseResults = await makeRequest(`/1/indexes/${indexName}/browse`, {
        hitsPerPage: 5,
      });

      if (browseResults.hits && browseResults.hits.length > 0) {
        console.log(`✅ Found ${browseResults.hits.length} records in browse`);
        console.log('\nRecord structure example:');
        console.log(JSON.stringify(browseResults.hits[0], null, 2));
      } else {
        console.log('⚠️  No records found when browsing');
      }
    } catch (error) {
      console.log('❌ Browse error:', error.message);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
  }
}

testAlgolia();
