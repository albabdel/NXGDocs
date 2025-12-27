const https = require('https');
require('dotenv').config({ path: '.env.local' });

const SPACE_ID = '289434723537263';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || '';

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mapi.storyblok.com',
      port: 443,
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function verifyStories() {
  console.log('Checking Storyblok stories...\n');

  const response = await makeRequest('GET', `/spaces/${SPACE_ID}/stories?per_page=10&page=1`);
  const stories = response.stories || [];

  console.log(`Total stories in first page: ${stories.length}`);
  console.log(`\nFirst 5 stories:`);
  stories.slice(0, 5).forEach(story => {
    console.log(`  - ${story.name} (slug: ${story.slug}, id: ${story.id}, published: ${story.published})`);
  });
}

verifyStories().catch(console.error);
