/**
 * QUERY SCHEMA STRUCTURE FROM MANAGEMENT API
 * Try to get the list of models that exist in the project
 */

const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_MANAGEMENT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  QUERYING SCHEMA STRUCTURE');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_MANAGEMENT_ENDPOINT}`);
console.log('\n' + '-'.repeat(60) + '\n');

const client = new GraphQLClient(HYGRAPH_MANAGEMENT_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_TOKEN}`,
  },
});

async function querySchema() {
  // Try to query models
  const modelsQuery = gql`
    query {
      viewer {
        project {
          id
          name
          models {
            apiId
            apiIdPlural
            displayName
            fields {
              apiId
              displayName
              type
            }
          }
        }
      }
    }
  `;

  try {
    console.log('🔍 Querying project models...\n');
    const result = await client.request(modelsQuery);

    const project = result.viewer.project;
    console.log(`✅ Project: ${project.name} (${project.id})\n`);

    const models = project.models;
    console.log(`📦 Found ${models.length} models:\n`);

    models.forEach(model => {
      console.log(`\n📋 ${model.displayName} (${model.apiId})`);
      console.log(`   API ID (Plural): ${model.apiIdPlural}`);
      console.log(`   Fields (${model.fields.length}):`);
      model.fields.slice(0, 5).forEach(field => {
        console.log(`     - ${field.displayName} (${field.apiId}): ${field.type}`);
      });
      if (model.fields.length > 5) {
        console.log(`     ... and ${model.fields.length - 5} more fields`);
      }
    });

    console.log('\n' + '-'.repeat(60) + '\n');

    // Check for Article model
    const articleModel = models.find(m => m.apiId.toLowerCase() === 'article');
    if (articleModel) {
      console.log('✅ ARTICLE MODEL EXISTS!');
      console.log(`   API ID: ${articleModel.apiId}`);
      console.log(`   API ID Plural: ${articleModel.apiIdPlural}`);
      console.log('\n   This means we should use:');
      console.log(`   - createArticle (singular)`);
      console.log(`   - articles (plural query)`);
    } else {
      console.log('❌ No Article model found');
    }

    // Check for Page model
    const pageModel = models.find(m => m.apiId.toLowerCase() === 'page');
    if (pageModel) {
      console.log('\n✅ PAGE MODEL EXISTS!');
      console.log(`   API ID: ${pageModel.apiId}`);
      console.log(`   API ID Plural: ${pageModel.apiIdPlural}`);
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

querySchema();
