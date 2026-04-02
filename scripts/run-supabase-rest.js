const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'temmzrunmzjiivogsbzz.supabase.co';
const SUPABASE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

function runSql(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      },
      family: 4
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSchemas() {
  for (const schemaFile of schemas) {
    const filePath = path.join(__dirname, '..', schemaFile);
    console.log(`Running: ${schemaFile}`);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      await runSql(sql);
      console.log(`  ✓ Complete\n`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }
  }
}

runSchemas();
