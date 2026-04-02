const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN
});

async function check() {
  const total = await client.fetch('count(*)');
  const docs = await client.fetch('count(*[_type == "doc"])');
  const articles = await client.fetch('count(*[_type == "article"])');
  const withProduct = await client.fetch('count(*[defined(product)])');
  
  console.log('Document counts:');
  console.log('  total:', total);
  console.log('  docs:', docs);
  console.log('  articles:', articles);
  console.log('  with product field:', withProduct);
  
  // List some doc titles
  const sample = await client.fetch('*[_type == "doc"][0...3]{_id, title, product}');
  console.log('\nSample docs:');
  sample.forEach(d => console.log('  ', d._id, d.title, '| product:', d.product));
}

check().catch(console.error);
