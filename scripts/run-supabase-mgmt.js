const https = require('https');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'temmzrunmzjiivogsbzz';
const SERVICE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

function request(method, apiPath, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
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
  return request('POST', `/v1/projects/${PROJECT_REF}/database/query`, { query: sql });
}

async function runSchemas() {
  console.log('Testing Management API...');
  
  try {
    const project = await request('GET', `/v1/projects/${PROJECT_REF}`);
    console.log('Project:', project.name || 'connected');
  } catch (e) {
    console.log('Management API error:', e.message.split('\n')[0]);
    console.log('\nService key may not have Management API access.');
    console.log('Need a Supabase Personal Access Token (starts with sbp_).\n');
    return;
  }
  
  for (const schemaFile of schemas) {
    const filePath = path.join(__dirname, '..', schemaFile);
    console.log(`Running: ${schemaFile}`);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      await runSql(sql);
      console.log(`  ✓ Complete\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message.split('\n')[0]}\n`);
    }
  }
}

runSchemas().catch(console.error);
