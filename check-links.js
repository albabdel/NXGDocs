const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

async function checkDoc(slug) {
  const doc = await client.fetch(`*[_type == "doc" && slug.current == $slug][0] { _id, title, body }`, { slug });
  const bodyStr = JSON.stringify(doc.body, null, 2);
  // Find all links
  const linkRegex = /"href":\s*"([^"]+)"/g;
  let match;
  console.log(`\n=== ${doc.title} (${slug}) ===`);
  console.log(`ID: ${doc._id}`);
  console.log('\nLinks found:');
  while ((match = linkRegex.exec(bodyStr)) !== null) {
    console.log(`  - ${match[1]}`);
  }
}

async function main() {
  await checkDoc('alarm-management/technical-alarms');
  await checkDoc('support/contact');
}

main();
