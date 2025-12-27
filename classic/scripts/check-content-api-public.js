/**
 * CHECK CONTENT API WITHOUT AUTH
 * Content API might be publicly accessible for published content
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;

console.log('\n' + '='.repeat(60));
console.log('  CHECKING CONTENT API (PUBLIC ACCESS)');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_ENDPOINT}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_ENDPOINT);

async function checkPublicAPI() {
  // Try introspection without auth
  const introspectionQuery = gql`
    query {
      __schema {
        queryType {
          fields {
            name
            type {
              name
              kind
            }
          }
        }
      }
    }
  `;

  try {
    console.log('🔍 Running introspection query (no auth)...\n');
    const result = await client.request(introspectionQuery);

    const queries = result.__schema.queryType.fields;

    console.log(`✅ Found ${queries.length} queries\n`);

    // Look for content models
    const articleQueries = queries.filter(q =>
      q.name.toLowerCase().includes('article')
    );

    const pageQueries = queries.filter(q =>
      q.name.toLowerCase().includes('page') &&
      !q.name.startsWith('__')
    );

    const authorQueries = queries.filter(q =>
      q.name.toLowerCase().includes('author')
    );

    if (articleQueries.length > 0) {
      console.log('✅ ARTICLE QUERIES:');
      articleQueries.forEach(q => console.log(`   - ${q.name}`));
      console.log('');
    }

    if (pageQueries.length > 0) {
      console.log('✅ PAGE QUERIES:');
      pageQueries.forEach(q => console.log(`   - ${q.name}`));
      console.log('');
    }

    if (authorQueries.length > 0) {
      console.log('✅ AUTHOR QUERIES:');
      authorQueries.forEach(q => console.log(`   - ${q.name}`));
      console.log('');
    }

    console.log('-'.repeat(60) + '\n');
    console.log('📋 ALL CONTENT QUERIES (first 20):');
    queries
      .filter(q => !q.name.startsWith('__') && !q.name.includes('Connection') && !q.name.includes('Version'))
      .slice(0, 20)
      .forEach(q => console.log(`   - ${q.name}`));

  } catch (error) {
    console.error('❌ Query failed:', error.message);
    if (error.response) {
      console.error('\n📋 Error details:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

checkPublicAPI();
