# Payload CMS Setup Guide

## Initial Setup

### 1. Install Dependencies
```bash
cd payload-cms
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `payload-cms` directory:

```env
PAYLOAD_SECRET=your-secret-key-change-this-in-production
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4000
DATABASE_URL=./payload.db
PORT=4000
```

**Important:** Change `PAYLOAD_SECRET` to a secure random string in production!

### 3. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:4000`

### 4. Create Admin User
1. Navigate to `http://localhost:4000/payload-admin`
2. You'll be prompted to create the first admin user
3. Fill in:
   - Email
   - Password
   - Name (optional)

### 5. Generate API Token
1. After logging in, go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Set:
   - **Name:** Docusaurus Sync
   - **Token duration:** Unlimited
   - **Token type:** Full access
4. **Copy the token** (you'll only see it once!)
5. Add it to your root `.env` file:
   ```
   PAYLOAD_URL=http://localhost:4000
   PAYLOAD_API_TOKEN=your_token_here
   ```

## Collections Overview

### Categories
- **Slug:** `categories`
- **Fields:** name, slug, description, icon, order, parent
- **API:** `GET /api/categories`

### Documentation Articles
- **Slug:** `documentation-articles`
- **Fields:** title, slug, description, content (rich text), category, role, device_type, difficulty, platform, order, version, tags, featured_image, screenshots
- **API:** `GET /api/documentation-articles`
- **Rich Text Editor:** Lexical-based with image/video support

### Media
- **Slug:** `media`
- **Purpose:** Store images and videos
- **API:** `GET /api/media`

## Using the Rich Text Editor

The Lexical editor supports:
- **Bold, Italic, Underline** text formatting
- **Headings** (H1-H6)
- **Lists** (ordered and unordered)
- **Links**
- **Images** - Click the image icon or paste images directly
- **Videos** - Upload and embed videos
- **Code blocks**
- **Blockquotes**

### Pasting Images/Videos
1. Copy an image/video from anywhere
2. Paste directly into the editor (Ctrl+V / Cmd+V)
3. The media will be uploaded automatically to the Media collection

## Syncing to Docusaurus

Use the sync script in the parent `scripts/` directory:

```bash
node scripts/sync-payload.js
```

This will:
1. Fetch all categories and articles from Payload
2. Convert rich text content to markdown
3. Generate markdown files in `classic/docs/`
4. Create category structure matching your Docusaurus sidebar

## API Endpoints

### REST API
- **Base URL:** `http://localhost:4000/api`
- **Categories:** `GET /api/categories`
- **Articles:** `GET /api/documentation-articles`
- **Media:** `GET /api/media`

### GraphQL API
- **Endpoint:** `http://localhost:4000/api/graphql`
- **Playground:** Available in admin panel

## Troubleshooting

### Port Already in Use
If port 4000 is taken, change it in `.env`:
```
PORT=4001
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4001
```

### Database Issues
If you need to reset the database:
1. Stop the server
2. Delete `payload.db` and `payload.db-journal`
3. Restart the server

### Type Errors
Generate TypeScript types:
```bash
npm run generate:types
```

### Rich Text Not Rendering
The Lexical editor outputs JSON. The sync script converts it to markdown, but complex formatting might need manual adjustment.

## Comparison with Strapi

| Feature | Strapi | Payload |
|---------|--------|---------|
| Setup | JSON-based | TypeScript code |
| Rich Text | Built-in | Lexical (more powerful) |
| Customization | Limited | Extensive |
| Admin UI | Good | Highly customizable |
| API | REST + GraphQL | REST + GraphQL |
| Port | 1337 | 3000 (configurable) |

## Next Steps

1. Create sample content in Payload
2. Test the rich text editor with images/videos
3. Run the sync script
4. Compare the output with Strapi
5. Choose which CMS works better for your needs
