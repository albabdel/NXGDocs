const { buildConfig } = require('payload/config');
const { slateEditor } = require('@payloadcms/richtext-slate');
const { mongooseAdapter } = require('@payloadcms/db-mongodb');
const { webpackBundler } = require('@payloadcms/bundler-webpack');
const path = require('path');

module.exports = buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000',
  admin: {
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'updatedAt'],
        pagination: {
          defaultLimit: 50,
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: false,
        },
      ],
    },
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/payload',
  }),
});
