const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function getSpaceId() {
  try {
    const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;

    const response = await fetch('https://mapi.storyblok.com/v1/spaces', {
      headers: {
        'Authorization': token
      }
    });

    const data = await response.json();

    if (data.spaces && data.spaces.length > 0) {
      console.log('\n✅ Available Spaces:\n');
      data.spaces.forEach(space => {
        console.log(`   Name: ${space.name}`);
        console.log(`   ID: ${space.id}`);
        console.log(`   Domain: ${space.domain}`);
        console.log(`   Region: ${space.plan_level || 'N/A'}\n`);
      });

      // Return the first space ID
      return data.spaces[0].id;
    } else {
      console.error('No spaces found or error:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching spaces:', error.message);
    return null;
  }
}

getSpaceId().then(spaceId => {
  if (spaceId) {
    console.log(`\n📋 Use this Space ID for CLI commands: ${spaceId}`);
  }
});
