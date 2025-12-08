# Strapi Quick Start Guide

## Step 1: Start Strapi (if not running)

```bash
cd c:\nxgen-docs\strapi-cms
npm run develop
```

Wait for: `Server started on http://localhost:1337`

## Step 2: Install Dependencies (if needed)

```bash
npm install
```

## Step 3: Run Automated Setup

```bash
npm run setup
```

This will create:
- ✅ 13 categories
- ✅ 5 sample articles

## Step 4: Configure Permissions (Manual - 2 minutes)

1. Open http://localhost:1337/admin
2. Go to **Settings** → **Users & Permissions** → **Roles**
3. Click **Public**
4. Find **Category** section:
   - ✅ Check `find`
   - ✅ Check `findOne`
5. Find **Documentation-article** section:
   - ✅ Check `find`
   - ✅ Check `findOne`
6. Click **Save** (top right)

## Step 5: Generate API Token (Manual - 1 minute)

1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Fill in:
   - Name: `Docusaurus Sync`
   - Token duration: `Unlimited`
   - Token type: `Full access`
4. Click **Save**
5. **Copy the token** (shows only once!)

Save it to `.env`:
```bash
echo STRAPI_API_TOKEN=your_token_here >> .env
```

## Step 6: Test API

```bash
curl http://localhost:1337/api/categories
curl http://localhost:1337/api/documentation-articles
```

Should return JSON data.

## ✅ Done!

Your Strapi CMS is now fully configured and ready to use.

Access admin panel: http://localhost:1337/admin
