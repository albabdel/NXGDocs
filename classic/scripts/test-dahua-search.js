const https = require('https');

const appId = '0QV3FAFAD5';
const apiKey = 'f479e424871288c2e571a23557f7a62b';
const indexName = 'nxgen_docs';

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

async function testDahuaSearch() {
  console.log('🔍 Testing search for "dahua"\n');

  try {
    const searchResults = await makeRequest(`/1/indexes/${indexName}/query`, {
      query: 'dahua',
      hitsPerPage: 10,
    });

    console.log('Total hits:', searchResults.nbHits);
    console.log('Processing time:', searchResults.processingTimeMS, 'ms\n');

    if (searchResults.hits && searchResults.hits.length > 0) {
      console.log('✅ Found results for "dahua":\n');
      searchResults.hits.forEach((hit, idx) => {
        console.log(`${idx + 1}. ${hit.hierarchy?.lvl0 || hit.title || 'Untitled'}`);
        if (hit.hierarchy) {
          if (hit.hierarchy.lvl1) console.log('   └─', hit.hierarchy.lvl1);
          if (hit.hierarchy.lvl2) console.log('      └─', hit.hierarchy.lvl2);
        }
        console.log('   URL:', hit.url || 'No URL');
        console.log('   Content:', (hit.content || '').substring(0, 100) + '...');
        console.log();
      });
    } else {
      console.log('❌ No results found for "dahua"');
      console.log('\nThis means either:');
      console.log('1. The word "dahua" does not appear in any indexed documents');
      console.log('2. The crawler has not indexed content containing "dahua"');
      console.log('3. The index needs to be re-crawled');
    }

    // Also try searching for just "d" to see partial matches
    console.log('\n---\n');
    console.log('🔍 Testing search for "d" (partial match)\n');

    const partialResults = await makeRequest(`/1/indexes/${indexName}/query`, {
      query: 'd',
      hitsPerPage: 5,
    });

    console.log('Total hits for "d":', partialResults.nbHits);
    if (partialResults.hits && partialResults.hits.length > 0) {
      console.log('\nFirst 5 results:');
      partialResults.hits.forEach((hit, idx) => {
        console.log(`${idx + 1}. ${hit.hierarchy?.lvl0 || hit.title || 'Untitled'} - ${hit.url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDahuaSearch();
