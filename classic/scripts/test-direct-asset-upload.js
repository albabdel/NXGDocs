/**
 * TEST DIRECT ASSET UPLOAD TO HYGRAPH
 * Try creating asset with base64 or direct file reference
 */

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: { Authorization: `Bearer ${HYGRAPH_TOKEN}` }
});

async function testAssetCreation() {
  console.log('\n' + '='.repeat(60));
  console.log('  TESTING ASSET CREATION METHODS');
  console.log('='.repeat(60));

  try {
    const testImage = path.join(__dirname, '../static/img/Background.jpg');
    const fileBuffer = fs.readFileSync(testImage);
    const base64Image = fileBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log(`\n📸 Test image: ${path.basename(testImage)}`);
    console.log(`   Size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   Base64 length: ${base64Image.length} characters\n`);

    // Test 1: Try with data URL
    console.log('TEST 1: Using data URL');
    console.log('-'.repeat(60));
    try {
      const mutation1 = gql`
        mutation CreateAssetWithDataUrl($uploadUrl: String!) {
          createAsset(data: { uploadUrl: $uploadUrl }) {
            id
            fileName
            url
          }
        }
      `;

      const result1 = await client.request(mutation1, {
        uploadUrl: dataUrl.substring(0, 100) + '...' // Just a sample for testing
      });

      console.log('✅ SUCCESS with data URL');
      console.log('   Result:', result1);
    } catch (error) {
      console.log('❌ Failed with data URL');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 2: Try with just fileName (no uploadUrl)
    console.log('\nTEST 2: Using only fileName');
    console.log('-'.repeat(60));
    try {
      const mutation2 = gql`
        mutation CreateAssetWithFileName($fileName: String!) {
          createAsset(data: { fileName: $fileName }) {
            id
            fileName
            url
          }
        }
      `;

      const result2 = await client.request(mutation2, {
        fileName: 'Background.jpg'
      });

      console.log('✅ SUCCESS with fileName only');
      console.log('   Result:', result2);
    } catch (error) {
      console.log('❌ Failed with fileName only');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 3: Query existing assets to understand structure
    console.log('\nTEST 3: Examining existing assets');
    console.log('-'.repeat(60));
    try {
      const query = gql`
        query {
          assets(first: 1) {
            id
            fileName
            url
            mimeType
            size
            width
            height
          }
        }
      `;

      const result3 = await client.request(query);
      console.log('✅ Found existing asset:');
      if (result3.assets && result3.assets.length > 0) {
        const asset = result3.assets[0];
        console.log(`   ID: ${asset.id}`);
        console.log(`   File: ${asset.fileName}`);
        console.log(`   URL: ${asset.url}`);
        console.log(`   MIME: ${asset.mimeType}`);
        console.log(`   Size: ${(asset.size / 1024).toFixed(2)} KB`);
        if (asset.width) console.log(`   Dimensions: ${asset.width}x${asset.height}`);

        // Check if URL pattern reveals upload method
        console.log(`\n   📋 URL Pattern Analysis:`);
        const urlParts = new URL(asset.url);
        console.log(`   Domain: ${urlParts.hostname}`);
        console.log(`   Path: ${urlParts.pathname}`);
      } else {
        console.log('   No assets found yet');
      }
    } catch (error) {
      console.log('❌ Failed to query assets');
      console.log(`   Error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('  INVESTIGATION COMPLETE');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
  }
}

testAssetCreation();
