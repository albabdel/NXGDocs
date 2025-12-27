/**
 * TEST HYGRAPH UPLOAD API
 * Find the correct upload endpoint for Hygraph
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

async function testUploadEndpoints() {
  console.log('\n' + '='.repeat(60));
  console.log('  TESTING HYGRAPH UPLOAD API ENDPOINTS');
  console.log('='.repeat(60));

  const testImage = path.join(__dirname, '../static/img/Background.jpg');

  if (!fs.existsSync(testImage)) {
    console.error('❌ Test image not found');
    return;
  }

  console.log(`\n📸 Test image: ${path.basename(testImage)}`);
  console.log(`   Size: ${(fs.statSync(testImage).size / 1024).toFixed(2)} KB\n`);

  // Hygraph upload endpoints follow pattern: https://upload-{region}.hygraph.com/upload
  const uploadEndpoints = [
    'https://upload-eu-west-2.hygraph.com/upload',
    'https://upload.hygraph.com/upload',
    'https://api-eu-west-2.hygraph.com/upload',
    'https://management-eu-west-2.hygraph.com/upload',
  ];

  for (const endpoint of uploadEndpoints) {
    console.log(`\n🔍 Testing: ${endpoint}`);
    console.log('-'.repeat(60));

    try {
      const fileBuffer = fs.readFileSync(testImage);
      const formData = new FormData();

      formData.append('fileUpload', fileBuffer, {
        filename: 'Background.jpg',
        contentType: 'image/jpeg'
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HYGRAPH_TOKEN}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      const responseText = await response.text();

      console.log(`   Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log(`   ✅ SUCCESS!`);
        console.log(`   Response: ${responseText.substring(0, 200)}`);

        try {
          const json = JSON.parse(responseText);
          if (json.url) {
            console.log(`\n   🎉 IMAGE UPLOADED!`);
            console.log(`   URL: ${json.url}`);
            console.log(`   ID: ${json.id || 'N/A'}`);
            return { success: true, url: json.url, endpoint };
          }
        } catch (e) {
          console.log(`   Response (raw): ${responseText}`);
        }
      } else {
        console.log(`   ❌ Failed: ${responseText.substring(0, 150)}`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  Testing complete');
  console.log('='.repeat(60));
}

testUploadEndpoints();
