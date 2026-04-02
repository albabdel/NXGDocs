const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi'
});

(async () => {
  const doc = await client.fetch(`
    *[_type == "doc" && slug.current == "knowledge-base/time-sync-errors"][0] {
      title, "slug": slug.current, status, product, targetAudience, body
    }
  `);
  console.log('Full doc:', JSON.stringify(doc, null, 2));
})();
