const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config({ path: '.env.local' });

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
  headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` }
});

client.request(gql`
  query {
    __type(name: "AssetCreateInput") {
      inputFields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`).then(result => {
  console.log('\nAssetCreateInput fields:');
  result.__type.inputFields.forEach(field => {
    const typeName = field.type.ofType?.name || field.type.name;
    console.log(`  - ${field.name}: ${typeName}`);
  });
}).catch(err => console.error('Error:', err.message));
