/**
 * Safe Storyblok Sync Wrapper
 * This script attempts to sync from Storyblok but won't fail the build if sync fails
 */
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function safeSyncStoryblok() {
  console.log('🔄 Attempting to sync content from Storyblok...\n');

  try {
    const { stdout, stderr } = await execPromise('node scripts/syncStoryblok.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('\n✅ Storyblok sync completed successfully\n');
    process.exit(0);
  } catch (error) {
    console.warn('\n⚠️  Storyblok sync failed, but continuing with build...');
    console.warn('Error:', error.message);
    console.warn('\nThe site will build with existing content.\n');
    console.warn('To fix this issue:');
    console.warn('1. Check your STORYBLOK_ACCESS_TOKEN environment variable');
    console.warn('2. Verify network connectivity to Storyblok API');
    console.warn('3. Check Storyblok dashboard for API status\n');

    // Exit with success code to allow build to continue
    process.exit(0);
  }
}

safeSyncStoryblok();
