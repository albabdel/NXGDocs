const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const schemas = [
  '.supabase/schema/user-tables.sql',
  '.supabase/schema/user-bookmarks.sql', 
  '.supabase/schema/user-history.sql'
];

const connectionString = 'postgresql://postgres:phlp2_BriPhiwrlpeyic@temmzrunmzjiivogsbzz.supabase.co:5432/postgres';

async function runSchemas() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected successfully!\n');
    
    for (const schemaFile of schemas) {
      const filePath = path.join(__dirname, schemaFile);
      console.log(`Running: ${schemaFile}`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      await client.query(sql);
      console.log(`  ✓ Complete\n`);
    }
    
    console.log('All schemas executed successfully!');
    
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'user_%'
      ORDER BY table_name
    `);
    console.log('\nCreated tables:', result.rows.map(r => r.table_name).join(', '));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSchemas();
