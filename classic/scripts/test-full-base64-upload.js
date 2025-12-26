/**
 * TEST FULL BASE64 IMAGE UPLOAD
 * Upload a complete image as base64 data URL
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

async function testFullUpload() {
  console.log('\n' + '='.repeat(60));
  console.log('  TESTING FULL BASE64 IMAGE UPLOAD');
  console.log('='.repeat(60));

  try {
    // Use a smaller test image first
    const testImage = path.join(__dirname, '../static/img/logo.svg');

    if (!fs.existsSync(testImage)) {
      console.log('\n⚠️  logo.svg not found, trying Background.jpg...');
      const altImage = path.join(__dirname, '../static/img/Background.jpg');
      if (fs.existsSync(altImage)) {
        await testUploadImage(altImage, 'image/jpeg');
      }
    } else {
      await testUploadImage(testImage, 'image/svg+xml');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response && error.response.errors) {
      console.error('Errors:', JSON.stringify(error.response.errors, null, 2));
    }
  }
}

async function testUploadImage(imagePath, mimeType) {
  const fileBuffer = fs.readFileSync(imagePath);
  const base64Image = fileBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Image}`;
  const fileName = path.basename(imagePath);

  console.log(`\n📸 Test image: ${fileName}`);
  console.log(`   Size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
  console.log(`   MIME: ${mimeType}`);
  console.log(`   Data URL length: ${dataUrl.length} characters\n`);

  console.log('🚀 Uploading with full base64 data URL...\n');

  const mutation = gql`
    mutation CreateAssetWithFullData($uploadUrl: String!, $fileName: String!) {
      createAsset(data: { uploadUrl: $uploadUrl, fileName: $fileName }) {
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

  const result = await client.request(mutation, {
    uploadUrl: dataUrl,
    fileName: fileName
  });

  const asset = result.createAsset;

  console.log('✅ Asset created:');
  console.log(`   ID: ${asset.id}`);
  console.log(`   File: ${asset.fileName}`);
  console.log(`   URL: ${asset.url}`);
  console.log(`   MIME: ${asset.mimeType || 'N/A'}`);
  console.log(`   Size: ${asset.size ? (asset.size / 1024).toFixed(2) + ' KB' : 'N/A'}`);
  if (asset.width) console.log(`   Dimensions: ${asset.width}x${asset.height}`);

  // Publish the asset
  console.log('\n📤 Publishing asset...\n');

  const publishMutation = gql`
    mutation PublishAsset($id: ID!) {
      publishAsset(where: { id: $id }) {
        id
        url
      }
    }
  `;

  const published = await client.request(publishMutation, { id: asset.id });

  console.log('✅ Asset published!');
  console.log(`   Public URL: ${published.publishAsset.url}\n`);

  console.log('🌐 Testing if image is actually accessible...');
  console.log(`   Try opening: ${asset.url}\n`);

  console.log('='.repeat(60));
  console.log('  ✅ UPLOAD SUCCESSFUL!');
  console.log('='.repeat(60));
  console.log('\nNext: Test if the image actually displays correctly');
  console.log('      by opening the URL in a browser\n');

  return asset;
}

testFullUpload();
