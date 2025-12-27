/**
 * UPLOAD IMAGES TO HYGRAPH ASSETS
 * ================================
 * Uploads all images from static/img to Hygraph Assets
 * Creates a mapping file for later article updates
 */

const { GraphQLClient, gql } = require('graphql-request');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Configuration
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;
const STATIC_DIR = path.join(__dirname, '../static');

// Tracking
const uploadLog = {
  startTime: new Date(),
  totalImages: 0,
  successCount: 0,
  errorCount: 0,
  errors: [],
  mapping: {}, // originalPath -> hygraphAssetUrl
};

// ========================================
// HYGRAPH ASSET UPLOAD MUTATION
// ========================================

const UPLOAD_ASSET_MUTATION = gql`
  mutation UploadAsset($upload: Upload!) {
    createAsset(data: { upload: $upload }) {
      id
      fileName
      url
      mimeType
      size
    }
  }
`;

const PUBLISH_ASSET_MUTATION = gql`
  mutation PublishAsset($id: ID!) {
    publishAsset(where: { id: $id }) {
      id
      url
    }
  }
`;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Find all image files recursively
 */
function findAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAllImages(filePath, fileList);
    } else if (file.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Upload a single image to Hygraph
 */
async function uploadImage(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const fileStream = fs.createReadStream(imagePath);

    // Create form data
    const formData = new FormData();

    // Add the file
    formData.append('file', fileStream, fileName);

    // Add GraphQL operation
    const operations = JSON.stringify({
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
    });

    formData.append('operations', operations);

    // Add map for file
    const map = JSON.stringify({
      '0': ['variables.upload']
    });

    formData.append('map', map);

    // Upload to Hygraph
    const uploadEndpoint = HYGRAPH_ENDPOINT.replace('/v2/', '/upload/');

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }

    const asset = result.data.createAsset;

    // Publish the asset
    const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      },
    });

    await client.request(PUBLISH_ASSET_MUTATION, { id: asset.id });

    return {
      success: true,
      asset,
      originalPath: imagePath
    };

  } catch (error) {
    throw error;
  }
}

/**
 * Save upload mapping to file
 */
function saveMapping() {
  const mappingPath = path.join(__dirname, '../image-mapping.json');
  const mappingData = {
    ...uploadLog,
    endTime: new Date(),
    duration: `${((new Date() - uploadLog.startTime) / 1000).toFixed(2)}s`,
  };

  fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
  console.log(`\n📝 Mapping saved to: image-mapping.json`);
}

// ========================================
// MAIN UPLOAD FUNCTION
// ========================================
async function runUpload() {
  console.log('\n' + '='.repeat(60));
  console.log('  HYGRAPH IMAGE UPLOAD - Static Assets');
  console.log('='.repeat(60));
  console.log(`\n📍 Hygraph Endpoint: ${HYGRAPH_ENDPOINT}`);
  console.log(`📍 Static Directory: ${STATIC_DIR}`);
  console.log('\n' + '-'.repeat(60));

  try {
    // Find all images
    console.log('\n📦 Scanning for images...');
    const images = findAllImages(STATIC_DIR);
    uploadLog.totalImages = images.length;

    console.log(`✅ Found ${images.length} images\n`);

    if (images.length === 0) {
      console.log('⚠️  No images found to upload\n');
      return;
    }

    // Upload each image
    console.log('🚀 Starting upload...\n');

    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i];
      const relativePath = path.relative(STATIC_DIR, imagePath);
      const progress = `[${i + 1}/${images.length}]`;

      console.log(`${progress} ${relativePath}`);

      try {
        const result = await uploadImage(imagePath);

        if (result.success) {
          uploadLog.successCount++;
          uploadLog.mapping[relativePath] = {
            hygraphId: result.asset.id,
            hygraphUrl: result.asset.url,
            fileName: result.asset.fileName,
            size: result.asset.size,
            mimeType: result.asset.mimeType
          };
          console.log(`   ✅ Uploaded: ${result.asset.url}`);
        }

      } catch (error) {
        uploadLog.errorCount++;
        uploadLog.errors.push({
          file: relativePath,
          error: error.message,
        });
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Delay to avoid rate limiting
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Save mapping
    saveMapping();

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('  UPLOAD COMPLETE');
    console.log('='.repeat(60));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Images: ${uploadLog.totalImages}`);
    console.log(`   ✅ Successful: ${uploadLog.successCount}`);
    console.log(`   ❌ Failed: ${uploadLog.errorCount}`);

    const duration = ((new Date() - uploadLog.startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Duration: ${duration}s`);

    if (uploadLog.errorCount > 0) {
      console.log(`\n⚠️  ERRORS (${uploadLog.errorCount}):`);
      uploadLog.errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Next Steps:');
    console.log('   1. Check image-mapping.json for URLs');
    console.log('   2. Update articles with Hygraph image references');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ UPLOAD FAILED:', error.message);
    console.error('\nError details:', error);
    saveMapping();
    process.exit(1);
  }
}

// ========================================
// RUN UPLOAD
// ========================================
runUpload();
