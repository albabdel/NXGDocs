// Simple Storyblok API test using https module
const https = require('https');

const token = 'lZ1VpFd6y9FjoNcJQFlXLAtt';
const url = `https://api-eu.storyblok.com/v2/cdn/stories?token=${token}&version=published&per_page=1`;

console.log('Testing Storyblok API...');
console.log(`Token: ${token.substring(0, 10)}...`);
console.log(`URL: ${url.replace(token, 'TOKEN')}\n`);

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}\n`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);

      if (json.stories) {
        console.log('✅ SUCCESS! Storyblok API credentials are WORKING!\n');
        console.log(`Stories found: ${json.stories.length}`);
        if (json.stories.length > 0) {
          console.log(`First story: "${json.stories[0].name}"`);
          console.log(`Full slug: ${json.stories[0].full_slug}`);
          console.log(`UUID: ${json.stories[0].uuid}`);
        }
      } else if (json.error) {
        console.log('❌ FAILED! Storyblok returned error:\n');
        console.log(JSON.stringify(json, null, 2));
      } else {
        console.log('⚠️  Unexpected response:\n');
        console.log(JSON.stringify(json, null, 2).substring(0, 500));
      }
    } catch (e) {
      console.log('❌ Failed to parse response:');
      console.log(data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.log('❌ Request failed:');
  console.log(err.message);
});
