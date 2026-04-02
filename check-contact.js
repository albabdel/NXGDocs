const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi',
});

async function checkContact() {
  const doc = await client.fetch('*[_type == "doc" && slug.current == "support/contact"][0] { _id, title, body }');
  console.log(JSON.stringify(doc, null, 2));
}

checkContact();
