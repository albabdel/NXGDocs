const https = require('https');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SPACE_ID = '289434723537263';
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || '';

if (!MANAGEMENT_TOKEN) {
  console.error('\n❌ Error: STORYBLOK_MANAGEMENT_TOKEN not set!');
  process.exit(1);
}

/**
 * Make API request to Storyblok Management API
 */
function makeRequest(method, path, data = null) {
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

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
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

/**
 * Get all stories in Storyblok
 */
async function getAllStories() {
  try {
    let page = 1;
    let allStories = [];
    let hasMore = true;

    while (hasMore) {
      const response = await makeRequest('GET', `/spaces/${SPACE_ID}/stories?per_page=100&page=${page}`);
      const stories = response.stories || [];
      allStories = allStories.concat(stories.filter(s => !s.is_folder));
      hasMore = stories.length === 100;
      page++;
    }

    return allStories;
  } catch (error) {
    console.error('Error fetching stories:', error.message);
    return [];
  }
}

/**
 * Publish a story
 */
async function publishStory(storyId) {
  try {
    await makeRequest('PUT', `/spaces/${SPACE_ID}/stories/${storyId}/publish`, {
      publish: 1,
      release_id: null,
      lang: 'default',
    });
    return true;
  } catch (error) {
    console.error(`Error publishing story ${storyId}:`, error.message);
    return false;
  }
}

/**
 * Main publish function
 */
async function publishAllStories() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Publish All Stories in Storyblok    ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log('📥 Fetching all stories...\n');
  const stories = await getAllStories();

  if (stories.length === 0) {
    console.log('⚠️  No stories found in Storyblok.\n');
    return;
  }

  console.log(`Found ${stories.length} stories to publish\n`);
  console.log('⚠️  WARNING: This will publish ALL ${stories.length} stories in Storyblok!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('📤 Publishing stories...\n');

  let published = 0;
  let failed = 0;

  for (const story of stories) {
    const success = await publishStory(story.id);
    if (success) {
      console.log(`  ✓ Published: ${story.name} (${story.slug})`);
      published++;
    } else {
      console.log(`  ✗ Failed: ${story.name} (${story.slug})`);
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Publishing Complete!                ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`✅ Published: ${published}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${published + failed}\n`);
  console.log('Now run: npm run sync:storyblok\n');
}

// Run publishing
publishAllStories().catch(error => {
  console.error('\n❌ Publishing failed:', error);
  process.exit(1);
});
