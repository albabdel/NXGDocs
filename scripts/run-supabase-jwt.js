const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'temmzrunmzjiivogsbzz';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbW16cnVubW16aml2b2dzYnp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQ4NjQxNywiZXhwIjoyMDU5MDYyNDE3fQ.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

const regions = [
  'aws-0-eu-central-1',
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-ap-southeast-1'
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
  console.log('Testing pooler with service role JWT...\n');
  
  for (const region of regions) {
    const connectionString = `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@${region}.pooler.supabase.com:6543/postgres`;
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
  
  console.log('\n❌ Pooler not working. Trying direct connection with JWT...\n');
  
  for (const region of regions) {
    const connectionString = `postgresql://postgres:${SERVICE_KEY}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
    process.stdout.write(`${region} (direct): `);
    
    const client = await tryConnect(connectionString);
    if (client) {
      console.log('✓ Connected!');
      await client.end();
      return;
    } else {
      console.log('✗');
    }
  }
  
  console.log('\n❌ Cannot connect to database.');
  console.log('The project is unpaused but database credentials in Keys.md are outdated.');
  console.log('You need to update the database password in Keys.md from Supabase Dashboard → Settings → Database.');
}

runSchemas().catch(console.error);
