const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi'
});

(async () => {
  const docs = await client.fetch(`
    *[_type == "doc" && slug.current match "time-sync*"] {
      title, "slug": slug.current, status, product, targetAudience
    }
  `);
  console.log('time-sync docs:', JSON.stringify(docs, null, 2));
  
  const docs2 = await client.fetch(`
    *[_type == "doc" && title match "*time*sync*"] {
      title, "slug": slug.current, status, product, targetAudience
    }
  `);
  console.log('title match docs:', JSON.stringify(docs2, null, 2));
})();
