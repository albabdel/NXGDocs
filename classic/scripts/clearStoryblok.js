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
 * Delete a story
 */
async function deleteStory(storyId) {
  try {
    await makeRequest('DELETE', `/spaces/${SPACE_ID}/stories/${storyId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting story ${storyId}:`, error.message);
    return false;
  }
}

/**
 * Main cleanup function
 */
async function clearStoryblok() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Clear All Stories from Storyblok    ║');
  console.log('╚════════════════════════════════════════╝\n');

  console.log('📥 Fetching all stories...\n');
  const stories = await getAllStories();

  if (stories.length === 0) {
    console.log('✅ No stories found. Storyblok is already clean.\n');
    return;
  }

  console.log(`Found ${stories.length} stories to delete\n`);
  console.log('⚠️  WARNING: This will delete ALL stories from Storyblok!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('🗑️  Deleting stories...\n');

  let deleted = 0;
  let failed = 0;

  for (const story of stories) {
    const success = await deleteStory(story.id);
    if (success) {
      console.log(`  ✓ Deleted: ${story.name} (${story.slug})`);
      deleted++;
    } else {
      console.log(`  ✗ Failed: ${story.name} (${story.slug})`);
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Cleanup Complete!                   ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`✅ Deleted: ${deleted}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${deleted + failed}\n`);
}

// Run cleanup
clearStoryblok().catch(error => {
  console.error('\n❌ Cleanup failed:', error);
  process.exit(1);
});
