// Test script to verify Storyblok and SMTP credentials functionality
require('dotenv').config({ path: './classic/.env.local' });

async function testStoryblok() {
  console.log('\n🔍 Testing Storyblok API credentials...\n');

  const token = process.env.STORYBLOK_ACCESS_TOKEN;
  const spaceId = process.env.STORYBLOK_SPACE_ID;
  const region = process.env.STORYBLOK_REGION;

  console.log(`Token: ${token ? token.substring(0, 10) + '...' : 'MISSING'}`);
  console.log(`Space ID: ${spaceId || 'MISSING'}`);
  console.log(`Region: ${region || 'MISSING'}\n`);

  if (!token) {
    console.log('❌ STORYBLOK_ACCESS_TOKEN is missing!\n');
    return false;
  }

  try {
    // Test API request to fetch stories
    const apiUrl = `https://api${region === 'eu' ? '-eu' : ''}.storyblok.com/v2/cdn/stories`;
    const url = `${apiUrl}?token=${token}&version=published`;

    console.log(`📡 Fetching from: ${apiUrl.replace(token, 'TOKEN')}\n`);

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.stories) {
      console.log('✅ Storyblok API credentials WORKING!');
      console.log(`   Found ${data.stories.length} stories`);
      if (data.stories.length > 0) {
        console.log(`   First story: "${data.stories[0].name}" (${data.stories[0].full_slug})`);
      }
      console.log('');
      return true;
    } else {
      console.log('❌ Storyblok API returned error:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.error || data.message || JSON.stringify(data)}`);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log('❌ Storyblok API test failed:');
    console.log(`   ${error.message}\n`);
    return false;
  }
}

async function testSMTP() {
  console.log('🔍 Testing SMTP credentials...\n');

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`SMTP User: ${user ? user.substring(0, 10) + '...' : 'MISSING'}`);
  console.log(`SMTP Pass: ${pass ? '***' + pass.substring(pass.length - 4) : 'MISSING'}\n`);

  if (!user || !pass) {
    console.log('⚠️  SMTP credentials not set in .env.local');
    console.log('   This is expected if you haven\'t added them yet.');
    console.log('   Email feedback widget will not work until these are added.\n');
    return false;
  }

  try {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: 'smtp.zeptomail.eu',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Verify connection
    await transporter.verify();

    console.log('✅ SMTP credentials WORKING!');
    console.log('   Connection to smtp.zeptomail.eu verified\n');
    return true;
  } catch (error) {
    console.log('❌ SMTP test failed:');
    console.log(`   ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  CREDENTIAL FUNCTIONALITY TEST');
  console.log('═══════════════════════════════════════════════');

  const storyblokWorks = await testStoryblok();
  const smtpWorks = await testSMTP();

  console.log('═══════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════\n');

  console.log(`Storyblok API: ${storyblokWorks ? '✅ FUNCTIONAL' : '❌ NOT WORKING'}`);
  console.log(`SMTP Email:    ${smtpWorks ? '✅ FUNCTIONAL' : '⚠️  NOT CONFIGURED'}\n`);

  if (storyblokWorks && !smtpWorks) {
    console.log('💡 TIP: Add SMTP credentials to .env.local to enable email feedback:');
    console.log('   SMTP_USER=your_smtp_username');
    console.log('   SMTP_PASS=your_smtp_password\n');
  }

  process.exit(storyblokWorks ? 0 : 1);
}

main();
