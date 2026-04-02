const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'temmzrunmzjiivogsbzz.supabase.co';
const SERVICE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';
const ANON_KEY = 'sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3UX';

function request(pathname, body = null, useService = false) {
  return new Promise((resolve, reject) => {
    const key = useService ? SERVICE_KEY : ANON_KEY;
    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: pathname,
      method: body ? 'POST' : 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'User-Agent': 'node-fetch'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
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

async function runSqlViaRpc(sql) {
  const statements = sql.split(';').filter(s => s.trim());
  const results = [];
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed || trimmed.startsWith('--')) continue;
    
    try {
      const result = await request('/rest/v1/rpc/exec_sql', { query: trimmed }, true);
      results.push({ success: true, statement: trimmed.substring(0, 50) });
    } catch (e) {
      if (e.message.includes('already exists')) {
        results.push({ success: true, statement: trimmed.substring(0, 50), note: 'already exists' });
      } else {
        results.push({ success: false, statement: trimmed.substring(0, 50), error: e.message });
      }
    }
  }
  
  return results;
}

async function createTables() {
  const schemas = [
    '.supabase/schema/user-tables.sql',
    '.supabase/schema/user-bookmarks.sql', 
    '.supabase/schema/user-history.sql'
  ];
  
  console.log('Testing connection with service key...');
  try {
    const result = await request('/rest/v1/', null, true);
    console.log('Connected to Supabase REST API\n');
  } catch (e) {
    console.log('Connection failed:', e.message);
    return;
  }
  
  console.log('Checking for exec_sql function...');
  try {
    await request('/rest/v1/rpc/exec_sql', { query: 'SELECT 1' }, true);
    console.log('exec_sql function exists\n');
  } catch (e) {
    console.log('exec_sql function does not exist');
    console.log('Creating exec_sql function...\n');
    
    const createFunc = `
CREATE OR REPLACE FUNCTION exec_sql(query text) RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;
    
    try {
      await request('/rest/v1/rpc/exec', { query: createFunc }, true);
      console.log('Created exec_sql function\n');
    } catch (e) {
      console.log('Could not create function:', e.message.split('\n')[0]);
      console.log('\nCannot run DDL via REST API. Need direct database connection.');
      return;
    }
  }
  
  for (const schemaFile of schemas) {
    const filePath = path.join(__dirname, '..', schemaFile);
    console.log(`Running: ${schemaFile}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    const results = await runSqlViaRpc(sql);
    
    for (const r of results) {
      if (r.success) {
        console.log(`  ✓ ${r.statement}...`);
      } else {
        console.log(`  ✗ ${r.statement}... - ${r.error.split('\n')[0]}`);
      }
    }
  }
}

createTables().catch(console.error);
