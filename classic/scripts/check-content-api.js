/**
 * CHECK CONTENT API FOR ARTICLE MODEL
 * Try to query the Content API to see if Article model exists there
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

// Use CONTENT API, not Management API
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  CHECKING CONTENT API FOR MODELS');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_ENDPOINT}`);
console.log(`Token: ${HYGRAPH_TOKEN ? '✓ Present' : '✗ Missing'}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function checkContentAPI() {
  // Try introspection on Content API
  const introspectionQuery = gql`
    query {
      __schema {
        queryType {
          fields {
            name
          }
        }
        mutationType {
          fields {
            name
          }
        }
      }
    }
  `;

  try {
    console.log('🔍 Running introspection query on Content API...\n');
    const result = await client.request(introspectionQuery);

    const queries = result.__schema.queryType.fields.map(f => f.name);
    const mutations = result.__schema.mutationType?.fields?.map(f => f.name) || [];

    console.log(`✅ Found ${queries.length} queries\n`);

    // Look for Article-related queries
    const articleQueries = queries.filter(q =>
      q.toLowerCase().includes('article')
    );

    if (articleQueries.length > 0) {
      console.log('✅ ARTICLE QUERIES FOUND:');
      articleQueries.forEach(q => console.log(`   - ${q}`));
    } else {
      console.log('❌ NO ARTICLE QUERIES FOUND');
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Look for Page-related queries
    const pageQueries = queries.filter(q =>
      q.toLowerCase().includes('page')
    );

    if (pageQueries.length > 0) {
      console.log('✅ PAGE QUERIES FOUND:');
      pageQueries.forEach(q => console.log(`   - ${q}`));
    } else {
      console.log('❌ NO PAGE QUERIES FOUND');
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Show mutations
    if (mutations.length > 0) {
      console.log(`✅ Found ${mutations.length} mutations\n`);

      const articleMutations = mutations.filter(m =>
        m.toLowerCase().includes('article')
      );

      if (articleMutations.length > 0) {
        console.log('✅ ARTICLE MUTATIONS FOUND:');
        articleMutations.forEach(m => console.log(`   - ${m}`));
      }
    } else {
      console.log('⚠️  No mutations available (Content API is read-only)');
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Show all available content types
    console.log('📋 ALL AVAILABLE CONTENT TYPES (queries):');
    const contentQueries = queries.filter(q =>
      !q.startsWith('__') &&
      !q.startsWith('node') &&
      !q.startsWith('viewer')
    );

    contentQueries.slice(0, 30).forEach(q => console.log(`   - ${q}`));

  } catch (error) {
    console.error('❌ Query failed:', error.message);
    if (error.response) {
      console.error('\n📋 Error details:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

checkContentAPI();
