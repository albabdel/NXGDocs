const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'temmzrunmzjiivogsbzz.supabase.co';
const SERVICE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'X-Client-Info': 'supabase-js/2.0.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: data });
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

async function runSql(sql) {
  return request('POST', '/rest/v1/rpc/exec', { query: sql });
}

async function runSchemas() {
  console.log('Testing connection...');
  try {
    const tables = await request('GET', '/rest/v1/user_profiles?select=*&limit=1');
    console.log('Connection OK - user_profiles exists\n');
    return;
  } catch (e) {
    console.log('Tables need to be created\n');
  }
  
  for (const schemaFile of schemas) {
    const filePath = path.join(__dirname, '..', schemaFile);
    console.log(`Running: ${schemaFile}`);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      await runSql(sql);
      console.log(`  ✓ Complete\n`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ✓ Already exists\n`);
      } else {
        console.error(`  ✗ Error: ${error.message}\n`);
      }
    }
  }
  
  console.log('Verifying tables...');
  for (const table of ['user_profiles', 'user_preferences', 'user_bookmarks', 'user_history']) {
    try {
      await request('GET', `/rest/v1/${table}?select=*&limit=1`);
      console.log(`  ✓ ${table}`);
    } catch (e) {
      console.log(`  ✗ ${table} - ${e.message.split('\n')[0]}`);
    }
  }
}

runSchemas().catch(console.error);
