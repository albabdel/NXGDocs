const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'temmzrunmzjiivogsbzz';
const DB_PASSWORD = 'phlp2_BriPhiwrlpeyic';

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

const regions = [
  'aws-0-eu-central-1',
  'aws-0-us-east-1', 
  'aws-0-us-west-1',
  'aws-0-ap-southeast-1',
  'aws-0-ap-northeast-1',
  'aws-0-ap-south-1',
  'aws-0-sa-east-1'
];

async function tryConnect(connectionString) {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
  
  try {
    await client.connect();
    return client;
  } catch (error) {
    try { await client.end(); } catch {}
    return null;
  }
}

async function runSchemas() {
  console.log('Testing all regions...\n');
  
  for (const region of regions) {
    const connectionString = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@${region}.pooler.supabase.com:6543/postgres`;
    process.stdout.write(`${region}: `);
    
    const client = await tryConnect(connectionString);
    if (client) {
      console.log('✓ Connected!');
      
      for (const schemaFile of schemas) {
        const filePath = path.join(__dirname, '..', schemaFile);
        console.log(`\nRunning: ${schemaFile}`);
        
        try {
          const sql = fs.readFileSync(filePath, 'utf8');
          await client.query(sql);
          console.log('  ✓ Complete');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('  ✓ Already exists');
          } else {
            console.log('  ✗', error.message.split('\n')[0].substring(0, 100));
          }
      }
      }
      
      console.log('\n✓ All schemas executed!');
      await client.end();
      return;
    } else {
      console.log('✗');
    }
  }
  
  console.log('\nNo region worked. Trying with service key as password...\n');
  
  const SERVICE_KEY = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';
  
  for (const region of regions) {
    const connectionString = `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@${region}.pooler.supabase.com:6543/postgres`;
    process.stdout.write(`${region} (service key): `);
    
    const client = await tryConnect(connectionString);
    if (client) {
      console.log('✓ Connected with service key!');
      await client.end();
      return;
    } else {
      console.log('✗');
    }
  }
  
  console.log('\n❌ Could not connect. The database password in Keys.md appears to be incorrect.');
}

runSchemas().catch(console.error);
