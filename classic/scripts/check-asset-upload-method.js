const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
  headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` }
});

// Check what mutations are available for assets
client.request(gql`
  query {
    __schema {
      mutationType {
        fields {
          name
          args {
            name
            type {
              name
              kind
              ofType { name kind }
            }
          }
        }
      }
    }
  }
`).then(result => {
  const assetMutations = result.__schema.mutationType.fields.filter(f =>
    f.name.toLowerCase().includes('asset')
  );
  console.log('Asset-related mutations:');
  assetMutations.forEach(m => {
    console.log(`\n${m.name}:`);
    m.args.forEach(arg => {
      const type = arg.type.ofType?.name || arg.type.name;
      console.log(`  - ${arg.name}: ${type}`);
    });
  });
});
