const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

async function runSchemas() {
  const configs = [
    {
      name: 'Session pooler (IPv4)',
      connectionString: 'postgresql://postgres.temmzrunmzjiivogsbzz:phlp2_BriPhiwrlpeyic@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
    },
    {
      name: 'Transaction pooler (IPv4)',
      connectionString: 'postgresql://postgres.temmzrunmzjiivogsbzz:phlp2_BriPhiwrlpeyic@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
    },
    {
      name: 'Direct connection',
      connectionString: 'postgresql://postgres:phlp2_BriPhiwrlpeyic@db.temmzrunmzjiivogsbzz.supabase.co:5432/postgres'
    },
    {
      name: 'Main domain',
      connectionString: 'postgresql://postgres:phlp2_BriPhiwrlpeyic@temmzrunmzjiivogsbzz.supabase.co:5432/postgres'
    }
  ];
  
  for (const config of configs) {
    console.log(`\nTrying: ${config.name}`);
    console.log(`  Host: ${config.connectionString.split('@')[1].split('/')[0]}`);
    
    const client = new Client({ 
      connectionString: config.connectionString,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      await client.connect();
      console.log('  ✓ Connected!');
      
      for (const schemaFile of schemas) {
        const filePath = path.join(__dirname, '..', schemaFile);
        console.log(`\nRunning: ${schemaFile}`);
        
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log('  ✓ Complete');
      }
      
      console.log('\n✓ All schemas executed successfully!');
      await client.end();
      return;
      
    } catch (error) {
      console.log(`  ✗ ${error.message.split('\n')[0]}`);
      try { await client.end(); } catch {}
    }
  }
  
  console.log('\n❌ Could not connect to Supabase');
  console.log('\nThe database password in Keys.md may be outdated.');
  console.log('Please verify the password in Supabase Dashboard → Settings → Database.');
}

runSchemas().catch(console.error);
