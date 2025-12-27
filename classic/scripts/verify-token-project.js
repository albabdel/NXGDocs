/**
 * VERIFY TOKEN PROJECT
 * Check what project this token belongs to
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  VERIFYING TOKEN & PROJECT');
console.log('='.repeat(60));
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function verifyToken() {
  // Simple viewer query to see what project we're connected to
  const viewerQuery = gql`
    query {
      viewer {
        id
        email
        name
        project {
          id
          name
          endpoint
          environment {
            id
            name
            endpoint
          }
        }
      }
    }
  `;

  try {
    console.log('🔍 Checking viewer/project info...\n');
    const result = await client.request(viewerQuery);

    const viewer = result.viewer;
    console.log('✅ TOKEN IS VALID\n');
    console.log(`👤 User: ${viewer.name} (${viewer.email})`);
    console.log(`   ID: ${viewer.id}\n`);

    const project = viewer.project;
    console.log(`📦 Project: ${project.name}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Endpoint: ${project.endpoint || 'N/A'}\n`);

    if (project.environment) {
      console.log(`🌍 Environment: ${project.environment.name}`);
      console.log(`   ID: ${project.environment.id}`);
      console.log(`   Endpoint: ${project.environment.endpoint || 'N/A'}\n`);
    }

    console.log('-'.repeat(60) + '\n');

    // Decode the JWT to see the audience
    const tokenParts = HYGRAPH_TOKEN.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('🔑 TOKEN DETAILS:');
        console.log(`   Issued At: ${new Date(payload.iat * 1000).toISOString()}`);
        console.log(`   Subject: ${payload.sub}`);
        if (payload.aud && Array.isArray(payload.aud)) {
          console.log(`\n   Audience URLs:`);
          payload.aud.forEach(aud => console.log(`     - ${aud}`));

          // Extract project ID from audience
          const projectIdMatch = payload.aud[0].match(/\/v2\/([^\/]+)\//);
          if (projectIdMatch) {
            const tokenProjectId = projectIdMatch[1];
            console.log(`\n   📋 Project ID from token: ${tokenProjectId}`);
          }
        }
      } catch (e) {
        console.log('   (Could not decode JWT)');
      }
    }

  } catch (error) {
    console.error('❌ Query failed:', error.message);
    if (error.response) {
      console.error('\n📋 Error details:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

verifyToken();
