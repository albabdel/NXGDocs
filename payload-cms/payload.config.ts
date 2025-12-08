import { buildConfig } from 'payload/config';
import { slateEditor } from '@payloadcms/richtext-slate';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import Category from './src/collections/Category';
import DocumentationArticle from './src/collections/DocumentationArticle';
import Media from './src/collections/Media';
import Users from './src/collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    pagination: {
      defaultLimit: 20, // Show 20 items per page instead of loading all
    },
  },
  routes: {
    admin: '/payload-admin',
  },
  collections: [
    Users,
    Category,
    DocumentationArticle,
    Media,
  ],
  editor: slateEditor({
    admin: {
      // Enhanced editor with better UX
      elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'link', 'relationship', 'upload'],
      leaves: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-this',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    dbURL: process.env.DATABASE_URL || path.resolve(dirname, 'payload.db'),
  }),
  sharp,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:4000',
});




