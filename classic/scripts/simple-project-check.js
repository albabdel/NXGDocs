/**
 * SIMPLE PROJECT CHECK
 * Just get the basic project info and decode token
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  PROJECT & TOKEN VERIFICATION');
console.log('='.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function check() {
  // Minimal query
  const minimalQuery = gql`
    query {
      viewer {
        id
        project {
          id
          name
        }
      }
    }
  `;

  try {
    const result = await client.request(minimalQuery);
    const project = result.viewer.project;

    console.log('✅ CONNECTED TO PROJECT:');
    console.log(`   Name: ${project.name}`);
    console.log(`   ID: ${project.id}\n`);

    // Decode JWT
    console.log('🔑 TOKEN ANALYSIS:');
    const tokenParts = HYGRAPH_TOKEN.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

      if (payload.aud && Array.isArray(payload.aud)) {
        console.log(`   Audience:`);
        payload.aud.forEach(aud => {
          console.log(`     ${aud}`);

          // Extract project ID from URL
          const match = aud.match(/\/v2\/([a-z0-9]+)\//);
          if (match) {
            const tokenProjectId = match[1];
            console.log(`       → Project ID in token: ${tokenProjectId}`);

            // Compare
            if (tokenProjectId === project.id) {
              console.log(`       → ✅ MATCHES connected project!`);
            } else {
              console.log(`       → ⚠️  MISMATCH! Connected to: ${project.id}`);
            }
          }
        });
      }
    }

    console.log('\n' + '-'.repeat(60) + '\n');
    console.log('📋 EXPECTED PROJECT (from your message):');
    console.log(`   Project ID: bf5aa53f-7e4c-43a5-8d33-696cfa2520e3`);
    console.log(`   Content ID: cmef61d6z09ky89wb06f08q82`);
    console.log(`\n💡 NOTE: The "Project ID" is the management ID,`);
    console.log(`   while "Content ID" is used in API endpoints.`);

  } catch (error) {
    console.error('\n❌ Query failed:', error.message);

    // Still try to decode the token
    console.log('\n🔑 TOKEN ANALYSIS (despite query failure):');
    const tokenParts = HYGRAPH_TOKEN.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

        if (payload.aud && Array.isArray(payload.aud)) {
          console.log(`   Audience:`);
          payload.aud.forEach(aud => {
            console.log(`     ${aud}`);
            const match = aud.match(/\/v2\/([a-z0-9]+)\//);
            if (match) {
              console.log(`       → Content ID: ${match[1]}`);
            }
          });
        }
      } catch (e) {
        console.log('   (Could not decode token)');
      }
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

check();
