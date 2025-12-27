/**
 * BULK IMAGE UPLOAD TO HYGRAPH
 * =============================
 * Uploads all local images to Hygraph Assets using public URLs
 *
 * This script:
 * 1. Finds all 1,073 images in the project
 * 2. Maps them to their public Netlify URLs
 * 3. Creates Hygraph assets using uploadUrl parameter
 * 4. Publishes the assets
 * 5. Creates a mapping file for article updates
 */

const { GraphQLClient, gql } = require('graphql-request');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;
const NETLIFY_URL = process.env.NETLIFY_URL || 'YOUR_NETLIFY_SITE_URL'; // Will be set after deployment
const PROJECT_ROOT = path.join(__dirname, '..');

// Hygraph Client
const client = new GraphQLClient(HYGRAPH_ENDPOINT, {
  headers: { Authorization: `Bearer ${HYGRAPH_TOKEN}` }
});

// Tracking
const uploadLog = {
  startTime: new Date(),
  totalImages: 0,
  successCount: 0,
  errorCount: 0,
  skippedCount: 0,
  errors: [],
  mapping: {}, // localPath -> hygraphAsset
};

// GraphQL Mutations
const CREATE_ASSET_MUTATION = gql`
  mutation CreateAsset($uploadUrl: String!, $fileName: String!) {
    createAsset(data: { uploadUrl: $uploadUrl, fileName: $fileName }) {
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

/**
 * Find all image files recursively
 */
function findAllImages(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, build, etc.
      if (!['node_modules', 'build', '.git', '.netlify', 'dist'].includes(file)) {
        findAllImages(filePath, fileList, baseDir);
      }
    } else if (file.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
      const relativePath = path.relative(baseDir, filePath);
      fileList.push({
        absolutePath: filePath,
        relativePath: relativePath.replace(/\\/g, '/'),
        fileName: file
      });
    }
  });

  return fileList;
}

/**
 * Convert local path to public Netlify URL
 */
function getPublicUrl(relativePath) {
  // Remove 'static/' prefix if present
  const publicPath = relativePath.replace(/^static[\\/]/, '');

  // For static folder images: /img/Background.jpg
  // For docs images: /docs/devices/adpro/images/image.png
  return `${NETLIFY_URL}/${publicPath}`;
}

/**
 * Upload a single image to Hygraph
 */
async function uploadImageToHygraph(imageInfo) {
  try {
    const publicUrl = getPublicUrl(imageInfo.relativePath);

    console.log(`   Public URL: ${publicUrl.substring(0, 80)}...`);

    // Create asset in Hygraph
    const result = await client.request(CREATE_ASSET_MUTATION, {
      uploadUrl: publicUrl,
      fileName: imageInfo.fileName
    });

    const asset = result.createAsset;

    // Wait for Hygraph to download the image from the public URL
    // This prevents "non complete asset" errors
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Publish the asset
    await client.request(PUBLISH_ASSET_MUTATION, { id: asset.id });

    return {
      success: true,
      asset,
      localPath: imageInfo.relativePath,
      publicUrl
    };

  } catch (error) {
    throw new Error(`Failed to upload ${imageInfo.fileName}: ${error.message}`);
  }
}

/**
 * Save mapping to file
 */
function saveMapping() {
  const mappingPath = path.join(PROJECT_ROOT, 'image-mapping.json');
  const mappingData = {
    ...uploadLog,
    endTime: new Date(),
    duration: `${((new Date() - uploadLog.startTime) / 1000).toFixed(2)}s`,
  };

  fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
  console.log(`\n📝 Mapping saved to: image-mapping.json`);
}

/**
 * Main upload function
 */
async function runBulkUpload() {
  console.log('\n' + '='.repeat(70));
  console.log('  BULK IMAGE UPLOAD TO HYGRAPH');
  console.log('='.repeat(70));
  console.log(`\n📍 Hygraph Endpoint: ${HYGRAPH_ENDPOINT}`);
  console.log(`📍 Netlify URL: ${NETLIFY_URL}`);
  console.log(`📍 Project Root: ${PROJECT_ROOT}`);
  console.log('\n' + '-'.repeat(70));

  try {
    // Validate configuration
    if (!NETLIFY_URL || NETLIFY_URL === 'YOUR_NETLIFY_SITE_URL') {
      console.error('\n❌ ERROR: NETLIFY_URL not configured!');
      console.error('\nPlease set NETLIFY_URL in .env.local to your deployed site URL');
      console.error('Example: NETLIFY_URL=https://your-site.netlify.app');
      console.error('\nOR run this script with the URL as an argument:');
      console.error('node scripts/bulk-upload-images.js https://your-site.netlify.app');
      process.exit(1);
    }

    // Find all images
    console.log('\n📦 Scanning for images...');
    const images = findAllImages(PROJECT_ROOT);
    uploadLog.totalImages = images.length;

    console.log(`✅ Found ${images.length} images\n`);

    if (images.length === 0) {
      console.log('⚠️  No images found to upload\n');
      return;
    }

    // Confirm before uploading
    console.log(`🚀 Ready to upload ${images.length} images to Hygraph`);
    console.log(`   This will take approximately ${Math.ceil(images.length * 2 / 60)} minutes`);
    console.log('\n⏸️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    // Give user time to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🚀 Starting upload...\n');

    // Upload each image
    for (let i = 0; i < images.length; i++) {
      const imageInfo = images[i];
      const progress = `[${i + 1}/${images.length}]`;

      console.log(`\n${progress} ${imageInfo.relativePath}`);

      try {
        const result = await uploadImageToHygraph(imageInfo);

        if (result.success) {
          uploadLog.successCount++;
          uploadLog.mapping[result.localPath] = {
            hygraphId: result.asset.id,
            hygraphUrl: result.asset.url,
            fileName: result.asset.fileName,
            size: result.asset.size,
            mimeType: result.asset.mimeType,
            publicUrl: result.publicUrl
          };
          console.log(`   ✅ Uploaded: ${result.asset.url}`);
        }

      } catch (error) {
        uploadLog.errorCount++;
        uploadLog.errors.push({
          file: imageInfo.relativePath,
          error: error.message,
        });
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Save mapping every 50 images (in case of interruption)
      if ((i + 1) % 50 === 0) {
        saveMapping();
        console.log(`\n💾 Progress saved (${i + 1}/${images.length})`);
      }

      // Rate limiting: 2 second delay between uploads
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Final save
    saveMapping();

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('  UPLOAD COMPLETE');
    console.log('='.repeat(70));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Images: ${uploadLog.totalImages}`);
    console.log(`   ✅ Successful: ${uploadLog.successCount}`);
    console.log(`   ❌ Failed: ${uploadLog.errorCount}`);
    console.log(`   ⏭️  Skipped: ${uploadLog.skippedCount}`);

    const duration = ((new Date() - uploadLog.startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Duration: ${duration}s (${(duration / 60).toFixed(2)} minutes)`);

    if (uploadLog.errorCount > 0) {
      console.log(`\n⚠️  ERRORS (${uploadLog.errorCount}):`,);
      uploadLog.errors.forEach(err => {
        console.log(`   - ${err.file}: ${err.error}`);
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n✨ Next Steps:');
    console.log('   1. Check image-mapping.json for all image mappings');
    console.log('   2. Run update script to replace image paths in articles');
    console.log('   3. Verify images display correctly in Hygraph');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ UPLOAD FAILED:', error.message);
    console.error('\nError details:', error);
    saveMapping();
    process.exit(1);
  }
}

// Get Netlify URL from command line argument if provided
if (process.argv[2]) {
  process.env.NETLIFY_URL = process.argv[2];
}

// Run upload
runBulkUpload();
