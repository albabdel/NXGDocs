const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'temmzrunmzjiivogsbzz.supabase.co';
const SERVICE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';

function request(method, pathname, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: pathname,
      method: method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'node-fetch/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`${method} ${pathname}: ${res.statusCode}`);
        console.log(data.substring(0, 300));
        console.log('---');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing various Supabase endpoints...\n');
  
  // Try SQL endpoint
  try {
    await request('POST', '/rest/v1/sql', { query: 'SELECT 1' });
  } catch (e) {}
  
  // Try query endpoint
  try {
    await request('POST', '/rest/v1/query', { query: 'SELECT 1' });
  } catch (e) {}
  
  // Try pg endpoint
  try {
    await request('POST', '/pg/query', { query: 'SELECT 1' });
  } catch (e) {}
  
  // Try _sql endpoint
  try {
    await request('POST', '/_sql', { query: 'SELECT 1' });
  } catch (e) {}
  
  // Check existing tables
  console.log('\nChecking existing tables...');
  try {
    await request('GET', '/rest/v1/user_profiles?select=*&limit=1');
  } catch (e) {
    console.log('user_profiles: does not exist');
  }
  
  try {
    await request('GET', '/rest/v1/user_bookmarks?select=*&limit=1');
  } catch (e) {
    console.log('user_bookmarks: does not exist');
  }
  
  try {
    await request('GET', '/rest/v1/user_history?select=*&limit=1');
  } catch (e) {
    console.log('user_history: does not exist');
  }
  
  console.log('\n\n❌ No SQL endpoint available.');
  console.log('The Supabase REST API (PostgREST) only supports CRUD on existing tables.');
  console.log('\nTo create tables, you need either:');
  console.log('1. A Supabase Personal Access Token (sbp_...) to use Management API');
  console.log('2. The correct database password from Dashboard → Settings → Database');
  console.log('3. Access to Supabase Dashboard SQL Editor');
}

testEndpoints().catch(console.error);
