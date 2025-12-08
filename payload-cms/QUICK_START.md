# Payload CMS Quick Start

## First Time Setup (5 minutes)

### 1. Install Dependencies
```bash
cd payload-cms
npm install
```

### 2. Create .env File
Create `payload-cms/.env`:
```env
PAYLOAD_SECRET=change-this-to-a-random-string
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4000
DATABASE_URL=./payload.db
PORT=3000
```

### 3. Start Server
```bash
npm run dev
```

### 4. Create Admin User
1. Open http://localhost:4000/payload-admin
2. Create your first admin account
3. Login

### 5. Generate API Token
1. Go to Settings → API Tokens
2. Create new token (Full access)
3. Copy token to root `.env`:
   ```
   PAYLOAD_URL=http://localhost:3000
   PAYLOAD_API_TOKEN=your_token_here
   ```

## Create Your First Content

### Create a Category
1. Go to **Categories** in sidebar
2. Click **Create New**
3. Fill in:
   - Name: "Getting Started"
   - Slug: "getting-started"
   - Order: 1
4. Save

### Create an Article
1. Go to **Documentation Articles**
2. Click **Create New**
3. Fill in:
   - Title: "Welcome to NXGEN"
   - Slug: "welcome"
   - Category: Select "Getting Started"
   - Content: Use the rich text editor
     - Try pasting an image (Ctrl+V)
     - Try pasting a video
     - Format text with bold, headings, etc.
4. Save

## Sync to Docusaurus

```bash
node scripts/sync-payload.js
```

This creates markdown files in `classic/docs/` from your Payload content.

## That's It!

You're ready to use Payload CMS. Compare it with Strapi and see which you prefer!
