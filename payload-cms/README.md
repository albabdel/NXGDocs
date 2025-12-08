# Payload CMS Setup for NXGEN Documentation

This is a Payload CMS instance set up alongside Strapi for comparison and testing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example` if available) with:
```
PAYLOAD_SECRET=your-secret-key-change-this-in-production
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URL=./payload.db
PORT=3000
```

3. Start the development server:
```bash
npm run dev
```

4. Access the admin panel at: http://localhost:4000/payload-admin

5. Create your first admin user when prompted.

## Collections

- **Users**: Admin users for the CMS
- **Categories**: Documentation categories (matches Strapi structure)
- **Documentation Articles**: Main content with rich text editor
- **Media**: Images and videos for articles

## API Endpoints

Once running, the API will be available at:
- REST API: `http://localhost:4000/api`
- GraphQL API: `http://localhost:4000/api/graphql`

## Sync Script

A sync script (`sync-payload.js`) is available in the parent `scripts/` directory to sync content from Payload to Docusaurus.
