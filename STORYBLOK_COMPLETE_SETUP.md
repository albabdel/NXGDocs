# Complete Storyblok Integration - Step by Step Guide

This guide will help you set up your ENTIRE Docusaurus site to be managed through Storyblok CMS.

## ✅ What's Already Done

- ✅ Storyblok SDK installed
- ✅ API token configured
- ✅ Sync script created ([scripts/syncStoryblok.js](classic/scripts/syncStoryblok.js))
- ✅ npm command added: `npm run sync:storyblok`

## 🎯 What You'll Achieve

Non-technical team members will be able to:
- ✅ Create and edit documentation pages
- ✅ Organize content structure
- ✅ Upload and manage images
- ✅ Publish changes that auto-deploy to your site

---

## Step 1: Create Content Structure in Storyblok

### 1.1 Go to Your Storyblok Space

Visit: https://app.storyblok.com/#/me/spaces/127355949506498

### 1.2 Create a Content Type (Block) for Documentation Pages

1. Click **"Block Library"** in the left sidebar
2. Click **"+ New block"**
3. Configure the block:
   - **Name**: `documentation_page`
   - **Display name**: `Documentation Page`
   - **Block type**: Content type block

4. Add these fields (click "+ Add field" for each):

   | Field Name | Field Type | Description |
   |------------|------------|-------------|
   | `title` | Text | Page title |
   | `description` | Text | Page description (optional) |
   | `sidebar_label` | Text | Label in sidebar (optional) |
   | `sidebar_position` | Number | Order in sidebar (optional) |
   | `body` | Rich Text | Main content |

5. Click **"Save"**

### 1.3 Create Your First Documentation Story

1. Click **"Content"** in the left sidebar
2. Click **"+ Create new"** → **"Story"**
3. Configure:
   - **Name**: `Getting Started` (or any name you want)
   - **Slug**: `getting-started` (will be the URL)
   - **Content type**: Select `documentation_page`

4. Fill in the content:
   - **title**: "Getting Started with NXGEN GCXONE"
   - **body**: Write your documentation content

5. Click **"Publish"**

### 1.4 Create More Documentation Pages

Create a folder structure:
```
docs/
├── getting-started
├── installation
├── configuration
├── features/
│   ├── alarm-management
│   ├── device-monitoring
│   └── user-management
└── troubleshooting/
    ├── common-issues
    └── faq
```

To create folders in Storyblok:
1. Click **"+ Create new"** → **"Folder"**
2. Name it (e.g., "features")
3. Inside the folder, create stories

---

## Step 2: Sync Storyblok Content to Your Site

### 2.1 Run the Sync Script

```bash
cd classic
npm run sync:storyblok
```

This will:
- Fetch all published stories from Storyblok
- Convert them to markdown files
- Place them in the `docs/` folder
- Preserve your folder structure

### 2.2 Verify the Files Were Created

Check `classic/docs/` - you should see new `.md` files matching your Storyblok stories.

### 2.3 Start Your Dev Server

```bash
npm start
```

Visit http://localhost:3000/docs - your Storyblok content should now be visible!

---

## Step 3: Set Up Auto-Deployment (No More Manual Syncing!)

### 3.1 Create a Netlify Build Hook

1. Go to Netlify Dashboard: https://app.netlify.com
2. Select your site (`gcxone`)
3. Go to **Site settings** → **Build & deploy** → **Build hooks**
4. Click **"Add build hook"**
5. Configure:
   - **Build hook name**: `Storyblok Content Update`
   - **Branch to build**: `main` (or your default branch)
6. Click **"Save"**
7. **Copy the webhook URL** (looks like: `https://api.netlify.com/build_hooks/...`)

### 3.2 Configure Webhook in Storyblok

1. Go to Storyblok: https://app.storyblok.com/#!/me/spaces/127355949506498/settings
2. Click **"Webhooks"** in left sidebar
3. Click **"Add webhook"**
4. Configure:
   - **Story published**: ✅ (checked)
   - **Story unpublished**: ✅ (checked)
   - **Endpoint URL**: Paste your Netlify webhook URL
5. Click **"Save"**

### 3.3 Update Your Build Command

Make sure your Netlify build runs the sync script:

Edit `classic/netlify.toml`:
```toml
[build]
  command = "npm run sync:storyblok && npm run build"
  publish = "build"
```

Or in Netlify UI:
1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Set **Build command** to: `npm run sync:storyblok && npm run build`

---

## Step 4: Test the Complete Workflow

### 4.1 Make a Change in Storyblok

1. Go to any story in Storyblok
2. Edit the content
3. Click **"Publish"**

### 4.2 Watch the Magic Happen

1. Webhook triggers Netlify build (~2-3 minutes)
2. Sync script pulls latest content
3. Site rebuilds automatically
4. Changes appear on https://gcxone.netlify.app

**No developer needed!** 🎉

---

## Step 5: Train Your Team

### For Non-Technical Users

**To Create a New Page:**
1. Go to https://app.storyblok.com
2. Click "Create new" → "Story"
3. Choose location (folder)
4. Select "Documentation Page" type
5. Fill in title and content
6. Click "Publish"
7. Wait 2-3 minutes for auto-deployment

**To Edit Existing Content:**
1. Find the story in Storyblok
2. Click to open
3. Edit the content
4. Click "Publish"
5. Changes go live in 2-3 minutes

**To Upload Images:**
1. Click the image field in your story
2. Click "Upload" or select from library
3. Images are automatically optimized

---

## Additional Configuration

### Enable Visual Editor (Optional but Awesome!)

The Visual Editor lets users see live previews as they edit.

1. Go to Storyblok Settings → Visual Editor
2. Set **Preview URL**:
   - **Production**: `https://gcxone.netlify.app/docs/`
   - **Local**: `https://localhost:3000/docs/` (requires HTTPS setup)

3. For local HTTPS (Windows):
   ```powershell
   # Install mkcert
   choco install mkcert
   # Create certificates
   mkcert -install
   mkcert localhost
   ```

   Then update your dev server to use HTTPS.

### Customize Rich Text Rendering

Edit `classic/scripts/syncStoryblok.js` to customize how rich text is converted to markdown.

### Add Custom Fields

Add more fields to your `documentation_page` block:
- `author` - Text field
- `last_updated` - Date field
- `tags` - Multi-select field
- `featured_image` - Asset field

---

## Troubleshooting

### "No stories found" Error

**Solution:** Create at least one story in Storyblok and publish it.

### Sync script fails

**Check:**
1. API token is correct in `.env.local`
2. You have published stories (not just drafts)
3. Internet connection is working

### Changes not appearing

**Check:**
1. Did you publish the story (not just save)?
2. Did the Netlify build complete successfully?
3. Clear your browser cache

### Webhook not triggering

**Check:**
1. Webhook URL is correct
2. Story was published (not just saved)
3. Check Netlify deploy log for errors

---

## Summary

**Before:** Developers edit markdown files in git → commit → push → wait for deployment

**After:** Team members edit in Storyblok → click publish → wait 2-3 minutes → live

**Benefits:**
- ✅ No git knowledge required
- ✅ Visual content editor
- ✅ Image management built-in
- ✅ Preview changes before publishing
- ✅ Multi-user collaboration
- ✅ Content versioning/history
- ✅ Scheduled publishing

---

## Next Steps

1. ✅ Create your content structure in Storyblok
2. ✅ Run `npm run sync:storyblok` to test
3. ✅ Set up webhooks for auto-deployment
4. ✅ Train your team
5. ✅ Retire your local markdown files 🎉

**Questions?** Check the [Storyblok Documentation](https://www.storyblok.com/docs) or contact your development team.
