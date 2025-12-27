/**
 * TEST ARTICLE CREATION
 * Test if we can create a single article in Hygraph
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

// Use High Performance API, not Management API
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  TEST ARTICLE CREATION');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_ENDPOINT}`);
console.log(`Token: ${HYGRAPH_TOKEN ? '✓ Present' : '✗ Missing'}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function testCreateArticle() {
  // First, check what fields are required for Article
  console.log('STEP 1: Checking Article schema...\n');

  const schemaQuery = gql`
    query {
      __type(name: "Article") {
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  try {
    const schemaResult = await client.request(schemaQuery);
    const fields = schemaResult.__type.fields;

    console.log('✅ Article fields:');
    fields.forEach(field => {
      const typeName = field.type.ofType?.name || field.type.name;
      console.log(`   - ${field.name}: ${typeName}`);
    });

    console.log('\n' + '-'.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Schema query failed:', error.message);
  }

  // Now try to create a test article
  console.log('STEP 2: Creating test article...\n');

  // Try without content first to see if it's required
  const createArticleMutation = gql`
    mutation {
      createArticle(data: {
        title: "Test Migration Article"
        slug: "test-migration-article-123"
      }) {
        id
        title
        slug
      }
    }
  `;

  try {
    const result = await client.request(createArticleMutation);
    const article = result.createArticle;

    console.log('✅ ARTICLE CREATED!');
    console.log(`   ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);
    console.log(`   Slug: ${article.slug}\n`);

    console.log('-'.repeat(60) + '\n');

    // Publish the article
    console.log('STEP 3: Publishing article...\n');

    const publishMutation = gql`
      mutation {
        publishArticle(where: { id: "${article.id}" }) {
          id
          stage
        }
      }
    `;

    const publishResult = await client.request(publishMutation);
    console.log('✅ ARTICLE PUBLISHED!');
    console.log(`   Stage: ${publishResult.publishArticle.stage}\n`);

    console.log('-'.repeat(60) + '\n');

    // Clean up - delete the test article
    console.log('STEP 4: Cleaning up test article...\n');

    const deleteMutation = gql`
      mutation {
        deleteArticle(where: { id: "${article.id}" }) {
          id
        }
      }
    `;

    await client.request(deleteMutation);
    console.log('✅ TEST ARTICLE DELETED\n');

    console.log('='.repeat(60));
    console.log('✅ SUCCESS! Article creation works!');
    console.log('='.repeat(60));
    console.log('\n🎯 Ready to migrate all 457 articles!\n');

  } catch (error) {
    console.error('❌ Article creation failed:', error.message);
    if (error.response) {
      console.error('\n📋 Error details:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    }
  }

  console.log('\n');
}

testCreateArticle();
