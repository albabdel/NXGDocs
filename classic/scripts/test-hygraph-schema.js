/**
 * TEST HYGRAPH SCHEMA
 * Verify that the Page, Chapter, and SEO models are accessible via GraphQL
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN || process.env.HYGRAPH_DEV_TOKEN;

console.log('\n='.repeat(60));
console.log('  HYGRAPH SCHEMA VERIFICATION TEST');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_MANAGEMENT_ENDPOINT}`);
console.log(`Token: ${HYGRAPH_TOKEN ? '✓ Present' : '✗ Missing'}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function testSchema() {
  // Test 1: Introspection query to see what mutations are available
  console.log('TEST 1: Checking available mutations...\n');

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

    console.log(`Found ${mutations.length} available mutations\n`);

    // Check for our required mutations
    const requiredMutations = ['createPage', 'createChapter', 'createSEO'];
    const foundMutations = [];
    const missingMutations = [];

    requiredMutations.forEach(mut => {
      if (mutations.includes(mut)) {
        foundMutations.push(mut);
      } else {
        missingMutations.push(mut);
      }
    });

    console.log('✅ FOUND:');
    foundMutations.forEach(m => console.log(`   - ${m}`));

    if (missingMutations.length > 0) {
      console.log('\n❌ MISSING:');
      missingMutations.forEach(m => console.log(`   - ${m}`));

      console.log('\n🔍 SIMILAR MUTATIONS FOUND:');
      const similarMutations = mutations.filter(m =>
        m.toLowerCase().includes('create') &&
        (m.toLowerCase().includes('page') ||
         m.toLowerCase().includes('chapter') ||
         m.toLowerCase().includes('seo'))
      );

      if (similarMutations.length > 0) {
        similarMutations.forEach(m => console.log(`   - ${m}`));
      } else {
        console.log('   (none found)');
      }

      // Show first 20 create mutations for reference
      console.log('\n📋 ALL CREATE MUTATIONS (first 20):');
      mutations
        .filter(m => m.startsWith('create'))
        .slice(0, 20)
        .forEach(m => console.log(`   - ${m}`));
    }

  } catch (error) {
    console.error('❌ Introspection failed:', error.message);
    return false;
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // Test 2: Try to create a test page
  console.log('TEST 2: Attempting to create a test Page...\n');

  const createPageMutation = gql`
    mutation {
      createPage(data: {
        title: "Test Article from Script"
        slug: "test-article-verification-123"
        content: "This is a test article to verify the schema works."
      }) {
        id
        title
        slug
      }
    }
  `;

  try {
    const result = await client.request(createPageMutation);
    console.log('✅ SUCCESS! Test page created:');
    console.log(`   ID: ${result.createPage.id}`);
    console.log(`   Title: ${result.createPage.title}`);
    console.log(`   Slug: ${result.createPage.slug}`);

    // Clean up - delete the test page
    console.log('\n🧹 Cleaning up test page...');
    const deletePageMutation = gql`
      mutation {
        deletePage(where: { id: "${result.createPage.id}" }) {
          id
        }
      }
    `;

    await client.request(deletePageMutation);
    console.log('✅ Test page deleted');

    return true;

  } catch (error) {
    console.error('❌ FAILED to create test page:');
    console.error(`   ${error.message}`);

    if (error.response) {
      console.error('\n📋 Error details:');
      console.error(JSON.stringify(error.response.errors, null, 2));
    }

    return false;
  }
}

async function run() {
  const success = await testSchema();

  console.log('\n' + '='.repeat(60));

  if (success) {
    console.log('✅ SCHEMA VERIFICATION PASSED');
    console.log('\nYour Hygraph schema is ready for migration!');
    console.log('\nNext step: Run the migration');
    console.log('   npm run migrate:hygraph:test');
  } else {
    console.log('❌ SCHEMA VERIFICATION FAILED');
    console.log('\nThe schema needs to be set up or fixed before migration.');
    console.log('Please check the errors above and:');
    console.log('   1. Verify models exist in Hygraph dashboard');
    console.log('   2. Check that models are published');
    console.log('   3. Verify API endpoint is correct');
    console.log('   4. Ensure token has proper permissions');
  }

  console.log('='.repeat(60) + '\n');
}

run();
