/**
 * CHECK FOR ARTICLE MODEL
 * Since the template claims to have Article model, let's search for it
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN || process.env.HYGRAPH_DEV_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  SEARCHING FOR ARTICLE MODEL');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_MANAGEMENT_ENDPOINT}`);
console.log(`Token: ${HYGRAPH_TOKEN ? '✓ Present' : '✗ Missing'}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function checkForArticle() {
  // Get all mutations
  const introspectionQuery = gql`
    query {
      __schema {
        mutationType {
          fields {
            name
          }
        }
      }
    }
  `;

  try {
    const result = await client.request(introspectionQuery);
    const mutations = result.__schema.mutationType.fields.map(f => f.name);

    console.log(`Found ${mutations.length} total mutations\n`);

    // Search for Article-related mutations
    const articleMutations = mutations.filter(m =>
      m.toLowerCase().includes('article')
    );

    if (articleMutations.length > 0) {
      console.log('✅ ARTICLE MUTATIONS FOUND:');
      articleMutations.forEach(m => console.log(`   - ${m}`));
    } else {
      console.log('❌ NO ARTICLE MUTATIONS FOUND');
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Search for any content-related mutations
    const contentMutations = mutations.filter(m =>
      m.startsWith('create') &&
      !m.includes('Permission') &&
      !m.includes('Token') &&
      !m.includes('Role') &&
      !m.includes('Agent') &&
      !m.includes('Webhook') &&
      !m.includes('Integration') &&
      !m.includes('Extension') &&
      !m.includes('Environment') &&
      !m.includes('View')
    );

    console.log('🔍 POTENTIAL CONTENT MUTATIONS:');
    if (contentMutations.length > 0) {
      contentMutations.slice(0, 20).forEach(m => console.log(`   - ${m}`));
    } else {
      console.log('   (none found)');
    }

  } catch (error) {
    console.error('❌ Query failed:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

checkForArticle();
