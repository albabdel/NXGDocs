const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  useCdn: false,
  token: 'skFakzSk1BjAzMmjydzVvsxprLPWED7WM0oox1pr7zrtWN4IEOrB637MBypMHQ12yjgMeIxf4j0LXHDHO2ICfVbs8pPTsOoqbHeq7Vbofg53WAuj8rk2PHRblTUdYci2u2pYHPkSZTrvJwJ0sq2uabHF13vLYAHxD7xMCxyGLsZtANwHAhJi'
});

(async () => {
  const slugs = [
    'alarm-management/alarm-codes',
    'knowledge-base/time-sync-errors',
    'getting-started/troubleshooting/browser-errors',
    'getting-started/user-management',
    'operator-guide/live-video'
  ];
  
  const docs = await client.fetch(`
    *[_type == "doc" && slug.current in $slugs] {
      title, "slug": slug.current, status, product
    }
  `, { slugs });
  
  console.log('Found docs:', JSON.stringify(docs, null, 2));
})();
