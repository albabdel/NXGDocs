# Agent 3: Backend Developer (CMS Specialist) - Task List
## Your Mission: Build Strapi CMS for No-Code Content Management

**Status:** START IMMEDIATELY (Independent work)
**Working Directory:** `c:\nxgen-docs\strapi-cms\` (to be created)
**Estimated Time:** 20 hours total

---

## 🎯 Your Deliverables

1. **Fully configured Strapi CMS**
2. **Content types for documentation**
3. **API endpoints**
4. **Webhook integration**
5. **Writer-friendly admin interface**

---

## 📋 PHASE 1: Strapi Installation (2 hours)

### Task 1.1: Install Strapi (30 min)

```bash
cd c:/nxgen-docs
npx create-strapi-app@latest strapi-cms --quickstart
```

This will:
- Create `strapi-cms` folder
- Install all dependencies
- Start Strapi automatically
- Open admin panel at http://localhost:1337/admin

**Status:** [ ] Complete

---

### Task 1.2: Create Admin Account (15 min)

When prompted, create the admin account:
- **First name:** Admin
- **Last name:** NXGEN
- **Email:** admin@nxgen.cloud
- **Password:** (Use a secure password, save it)

**Save credentials to:** `strapi-cms/.env` (Strapi creates this automatically)

**Status:** [ ] Complete

---

### Task 1.3: Configure Database (1 hour)

**For Development:** Use SQLite (default, already configured)

**For Production:** Configure PostgreSQL

Update `strapi-cms/config/database.js`:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'nxgen_docs'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    debug: false,
  },
});
```

Update `.env`:
```
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=nxgen_docs
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
```

**For now:** Stick with SQLite for development. We'll handle PostgreSQL in production.

**Status:** [ ] Complete

---

## 📋 PHASE 2: Content Type Configuration (4 hours)

### Task 2.1: Create "Documentation Article" Content Type (2 hours)

1. Go to **Content-Type Builder** in left sidebar
2. Click **"Create new collection type"**
3. **Display name:** `Documentation Article`
4. Click **Continue**

**Add these fields:**

#### Text Fields:
- **title**
  - Type: Text
  - Required: Yes
  - Max length: 255

- **slug**
  - Type: UID
  - Attached field: title
  - Required: Yes

- **description**
  - Type: Text (Long text)
  - Max length: 500

- **content**
  - Type: Rich Text
  - Required: Yes

- **version**
  - Type: Text
  - Default: "1.0"

#### Enumeration Fields:
- **role**
  - Type: Enumeration
  - Values: `admin`, `operator`, `installer`, `manager`, `all`
  - Default: `all`

- **device_type**
  - Type: Enumeration
  - Values: `hikvision`, `dahua`, `adpro`, `milestone`, `hanwha`, `axis`, `axxon`, `camect`, `teltonika`, `GCXONE_audio`, `avigilon`, `innovi`, `reconeyez`, `heitel`, `other`, `none`
  - Default: `none`

- **difficulty**
  - Type: Enumeration
  - Values: `beginner`, `intermediate`, `advanced`
  - Default: `beginner`

- **platform**
  - Type: Enumeration
  - Values: `GCXONE`, `talos`, `both`
  - Default: `both`

#### Number Fields:
- **order**
  - Type: Number (integer)
  - Default: 0

#### Date Fields:
- **last_updated**
  - Type: Date (datetime)

#### JSON Fields:
- **tags**
  - Type: JSON

#### Relation Fields:
- **category**
  - Type: Relation
  - Relation type: Many-to-One
  - Target: Category (will create next)

- **author**
  - Type: Relation
  - Relation type: Many-to-One
  - Target: User (from users-permissions plugin)

#### Media Fields:
- **featured_image**
  - Type: Media (Single)
  - Allowed types: Images

- **screenshots**
  - Type: Media (Multiple)
  - Allowed types: Images

**Click Save** when done.

**Status:** [ ] Complete

---

### Task 2.2: Create "Category" Content Type (1 hour)

1. Click **"Create new collection type"**
2. **Display name:** `Category`
3. Click **Continue**

**Add these fields:**

- **name**
  - Type: Text
  - Required: Yes

- **slug**
  - Type: UID
  - Attached field: name
  - Required: Yes

- **description**
  - Type: Text (Long text)

- **icon**
  - Type: Text
  - Default: "📁"

- **order**
  - Type: Number (integer)
  - Default: 0

- **parent**
  - Type: Relation
  - Relation type: Many-to-One (self-reference)
  - Target: Category

**Click Save**.

**Status:** [ ] Complete

---

### Task 2.3: Configure Content Type Permissions (1 hour)

1. Go to **Settings** → **Users & Permissions plugin** → **Roles**
2. Click on **Public** role
3. Under **Documentation-article**, check:
   - [x] find
   - [x] findOne
   - [x] count
4. Under **Category**, check:
   - [x] find
   - [x] findOne
   - [x] count
5. Click **Save**

**Create Technical Writer Role:**
1. Click **Add new role**
2. **Name:** Technical Writer
3. **Description:** Can create and edit documentation articles
4. Under **Documentation-article**, check:
   - [x] find
   - [x] findOne
   - [x] create
   - [x] update
   - [x] delete
   - [x] count
5. Under **Upload**, check:
   - [x] upload
   - [x] find
   - [x] findOne
6. Click **Save**

**Status:** [ ] Complete

---

## 📋 PHASE 3: Admin Panel Customization (3 hours)

### Task 3.1: Configure Branding (30 min)

Update `strapi-cms/src/admin/app.js`:

```javascript
export default {
  config: {
    locales: ['en', 'de', 'fr'],
    theme: {
      colors: {
        primary100: '#bfdbfe',
        primary200: '#93c5fd',
        primary500: '#3b82f6',
        primary600: '#2563eb',
        primary700: '#1d4ed8',
      },
    },
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'NXGEN Documentation CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Admin Panel',
      },
    },
  },
  bootstrap() {},
};
```

**Status:** [ ] Complete

---

### Task 3.2: Install Helpful Plugins (1 hour)

```bash
cd strapi-cms

# SEO plugin
npm install @strapi/plugin-seo

# GraphQL (optional, but nice to have)
npm install @strapi/plugin-graphql

# Documentation plugin
npm install @strapi/plugin-documentation
```

After installing, rebuild:
```bash
npm run build
npm run develop
```

**Status:** [ ] Complete

---

### Task 3.3: Configure Rich Text Editor (1 hour)

The default editor should work, but you can customize it.

**Test:**
1. Go to **Content Manager** → **Documentation articles**
2. Click **Create new entry**
3. Test the rich text editor
4. Verify you can:
   - Add headings
   - Add bold/italic text
   - Add lists
   - Add code blocks
   - Add links
   - Upload images

**Status:** [ ] Complete

---

### Task 3.4: Create Sample Categories (30 min)

Create these categories in Strapi:

1. **Getting Started** (slug: `getting-started`, order: 1)
2. **Platform Fundamentals** (slug: `platform-fundamentals`, order: 2)
3. **Admin Guide** (slug: `admin-guide`, order: 3)
4. **Devices** (slug: `devices`, order: 4)
5. **Features** (slug: `features`, order: 5)
6. **Alarm Management** (slug: `alarm-management`, order: 6)
7. **Reporting** (slug: `reporting`, order: 7)
8. **Operator Guide** (slug: `operator-guide`, order: 8)
9. **Installer Guide** (slug: `installer-guide`, order: 9)
10. **Troubleshooting** (slug: `troubleshooting`, order: 10)
11. **Knowledge Base** (slug: `knowledge-base`, order: 11)
12. **Release Notes** (slug: `release-notes`, order: 12)
13. **Support** (slug: `support`, order: 13)

**Status:** [ ] Complete

---

## 📋 PHASE 4: API Configuration (3 hours)

### Task 4.1: Configure API Settings (1 hour)

Update `strapi-cms/config/api.js`:

```javascript
module.exports = {
  rest: {
    defaultLimit: 100,
    maxLimit: 250,
    withCount: true,
  },
};
```

Update `strapi-cms/config/middleware.js` to configure CORS:

```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:3001', 'https://docs.nxgen.cloud'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

**Status:** [ ] Complete

---

### Task 4.2: Create API Token (30 min)

1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. **Name:** Docusaurus Sync
4. **Description:** Token for syncing content to Docusaurus
5. **Token duration:** Unlimited
6. **Token type:** Full access
7. Click **Save**
8. **COPY THE TOKEN** (you'll only see it once!)
9. Save it to `strapi-cms/.env`:
   ```
   SYNC_API_TOKEN=your_token_here
   ```

**Send this token to Agent 1 for the sync script.**

**Status:** [ ] Complete

---

### Task 4.3: Test API Endpoints (1 hour)

Test these endpoints in Postman or browser:

**Get all articles:**
```
GET http://localhost:1337/api/documentation-articles?populate=*
```

**Get single article:**
```
GET http://localhost:1337/api/documentation-articles/1?populate=*
```

**Get all categories:**
```
GET http://localhost:1337/api/categories?sort=order:asc
```

**Test response format:**
- Should return JSON
- Should include relationships (category, author)
- Should include media URLs

**Status:** [ ] Complete

---

## 📋 PHASE 5: Sample Content Creation (4 hours)

### Task 5.1: Create 20 Sample Articles (3 hours)

Create sample articles for testing. For each article:

**Example Article 1: "Getting Started with NXGEN GCXONE"**
- Title: Getting Started with NXGEN GCXONE
- Slug: getting-started-with-nxgen
- Category: Getting Started
- Role: all
- Platform: both
- Difficulty: beginner
- Tags: `["getting-started", "introduction", "overview"]`
- Content: (Write a few paragraphs with proper formatting)

**Create articles for:**
1-5: Getting Started section (5 articles)
6-10: Device guides (Hikvision, Dahua, ADPRO, Milestone, Hanwha)
11-15: Feature guides (AI Analytics, Event Clips, Site Pulse, Auto-Streaming, PTZ)
16-20: Troubleshooting (common issues)

**For each article:**
- Use proper headings (H2, H3)
- Add bullet points
- Add code blocks where relevant
- Upload at least 1 screenshot placeholder
- Set proper metadata

**Status:** [ ] Complete

---

### Task 5.2: Upload Sample Images (1 hour)

Create or find placeholder images:
- 20 screenshots (1 per article)
- 5 featured images
- Save them in organized folders

Upload to Strapi Media Library:
- Use descriptive filenames
- Add alt text
- Organize in folders

**Status:** [ ] Complete

---

## 📋 PHASE 6: Webhook Configuration (2 hours)

### Task 6.1: Configure Webhooks (1 hour)

1. Go to **Settings** → **Webhooks**
2. Click **Create new webhook**

**Webhook 1: Content Publish**
- **Name:** Rebuild Documentation on Publish
- **URL:** (We'll get this from Vercel later - leave empty for now)
- **Events:**
  - [x] entry.publish (Documentation-article)
  - [x] entry.update (Documentation-article)
  - [x] entry.delete (Documentation-article)
- **Headers:** (Add later if needed)

Click **Save**.

**Note:** We'll configure the actual webhook URL when we deploy to Vercel.

**Status:** [ ] Complete

---

### Task 6.2: Test Webhook (1 hour)

For now, test with a webhook testing service:

1. Go to https://webhook.site/
2. Copy the unique URL
3. Update your webhook in Strapi with this URL
4. Publish an article
5. Check webhook.site to see if the payload arrived

**Expected payload:**
```json
{
  "event": "entry.publish",
  "created_at": "...",
  "model": "documentation-article",
  "entry": {
    "id": 1,
    "title": "...",
    ...
  }
}
```

**Status:** [ ] Complete

---

## 📋 PHASE 7: Writer's Guide (2 hours)

### Task 7.1: Create Writer's Guide Document (2 hours)

Create: `strapi-cms/WRITERS_GUIDE.md`

Include:
1. How to login to CMS
2. How to create a new article
3. How to use the rich text editor
4. How to upload images
5. How to set metadata (tags, category, role, etc.)
6. How to preview (if available)
7. How to publish vs draft
8. Common troubleshooting
9. Style guidelines
10. Best practices

Make it beginner-friendly with screenshots!

**Status:** [ ] Complete

---

## ✅ Deliverables Checklist

- [ ] Strapi CMS running on http://localhost:1337
- [ ] Admin account created
- [ ] Content types configured (Documentation Article, Category)
- [ ] API endpoints tested and working
- [ ] 20 sample articles created
- [ ] Sample images uploaded
- [ ] API token generated and shared with Agent 1
- [ ] Webhooks configured (URL pending)
- [ ] Writer's guide created
- [ ] Technical Writer role configured

---

## 📝 Handoff to Agent 1

Provide:
1. **Strapi API base URL:** http://localhost:1337
2. **API Token:** (from Task 4.2)
3. **Content types documentation:**
   - Documentation Article schema
   - Category schema
4. **Sample API response** (JSON example)
5. **Media URL format:** How to access uploaded images
6. **Any issues or limitations**

---

## 📊 API Endpoint Reference

**For Agent 1's sync script:**

```
GET /api/documentation-articles?populate=*&sort=category.order:asc,order:asc
GET /api/documentation-articles/:id?populate=*
GET /api/categories?sort=order:asc
GET /api/upload/files (media library)
```

**Query Parameters:**
- `populate=*` - Include all relations
- `sort=field:asc|desc` - Sort results
- `filters[field][$eq]=value` - Filter results
- `pagination[page]=1&pagination[pageSize]=25` - Paginate

**Media URLs:**
- Format: `http://localhost:1337/uploads/filename_hash.ext`
- Example: `http://localhost:1337/uploads/screenshot_1_a8b9c0d1e2.png`

---

## 🚨 Blockers

If you encounter issues:
1. Check Strapi logs: `strapi-cms/.tmp/data.db` (SQLite)
2. Restart Strapi: `npm run develop`
3. Clear Strapi cache: Delete `strapi-cms/.cache` and rebuild
4. Check Node version: `node --version` (should be 18+)
5. Tag Agent 1 if blocked

---

## 💡 Tips

- Use descriptive slugs (auto-generated from titles)
- Test API responses with Postman
- Keep content types simple initially
- Document any custom configurations
- Take screenshots for Writer's Guide

---

**Go build an amazing CMS! 🚀**
