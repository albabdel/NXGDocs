/**
 * TEST SINGLE IMAGE UPLOAD
 * Test uploading one image to verify the process works
 */

const { GraphQLClient, gql } = require('graphql-request');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

console.log('\n' + '='.repeat(60));
console.log('  TEST SINGLE IMAGE UPLOAD');
console.log('='.repeat(60));
console.log(`\nEndpoint: ${HYGRAPH_ENDPOINT}`);
console.log(`Token: ${HYGRAPH_TOKEN ? '✓ Present' : '✗ Missing'}\n`);

async function testUpload() {
  try {
    // Find first image in static folder
    const testImage = path.join(__dirname, '../static/img/Background.jpg');

    if (!fs.existsSync(testImage)) {
      console.error('❌ Test image not found:', testImage);
      return;
    }

    console.log('📸 Test image:', testImage);
    console.log('   Size:', (fs.statSync(testImage).size / 1024).toFixed(2), 'KB\n');

    // Method 1: Try using GraphQL client directly
    console.log('METHOD 1: Using GraphQL Client\n');

    const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      },
    });

    // Check if we can query assets first
    const assetsQuery = gql`
      query {
        assets(first: 1) {
          id
          fileName
          url
        }
      }
    `;

    const existingAssets = await client.request(assetsQuery);
    console.log('✅ Can query assets:', existingAssets.assets.length, 'found\n');

    // Method 2: Try multipart upload
    console.log('METHOD 2: Testing Multipart Upload\n');

    const fileName = path.basename(testImage);
    const fileStream = fs.createReadStream(testImage);
    const fileBuffer = fs.readFileSync(testImage);

    // Create form data
    const formData = new FormData();

    // Hygraph expects this format
    const operations = {
      query: `
        mutation CreateAsset($upload: Upload!) {
          createAsset(data: { upload: $upload }) {
            id
            fileName
            url
            mimeType
            size
          }
        }
      `,
      variables: {
        upload: null
      }
    };

    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify({ '0': ['variables.upload'] }));
    formData.append('0', fileBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    console.log('📤 Uploading to Hygraph...\n');

    const response = await fetch(HYGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', responseText.substring(0, 500), '...\n');

    if (response.ok) {
      const result = JSON.parse(responseText);

      if (result.errors) {
        console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      } else if (result.data && result.data.createAsset) {
        const asset = result.data.createAsset;
        console.log('✅ SUCCESS! Image uploaded:');
        console.log(`   ID: ${asset.id}`);
        console.log(`   URL: ${asset.url}`);
        console.log(`   File: ${asset.fileName}`);
        console.log(`   Size: ${(asset.size / 1024).toFixed(2)} KB`);

        // Publish it
        console.log('\n📤 Publishing asset...\n');
        const publishMutation = gql`
          mutation {
            publishAsset(where: { id: "${asset.id}" }) {
              id
              url
            }
          }
        `;

        const published = await client.request(publishMutation);
        console.log('✅ Asset published!');
        console.log(`   URL: ${published.publishAsset.url}\n`);

        console.log('='.repeat(60));
        console.log('✅ TEST PASSED - Image upload works!');
        console.log('='.repeat(60));
      } else {
        console.error('❌ Unexpected response:', result);
      }
    } else {
      console.error('❌ Upload failed with status:', response.status);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response errors:', JSON.stringify(error.response.errors, null, 2));
    }
  }
}

testUpload();
