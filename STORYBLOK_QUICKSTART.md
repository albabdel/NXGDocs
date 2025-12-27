# Storyblok Quick Start Guide - NXG Space

## Your Storyblok Details

- **Space Name**: NXG
- **Space ID**: 289434723537263
- **Dashboard**: https://app.storyblok.com/#/me/spaces/289434723537263
- **API Token**: Configured ✅

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Content Type

1. Go to https://app.storyblok.com/#/me/spaces/289434723537263
2. Click **"Block Library"** → **"+ New block"**
3. Settings:
   - Name: `doc_page`
   - Display name: `Documentation Page`
   - Root component: ✅ Checked

4. Add fields (click "+ Add field" for each):
   - **title** (Text)
   - **description** (Textarea) - optional
   - **body** (Rich Text or Markdown)

5. Click **"Save"**

### Step 2: Create First Story

1. Go to **"Content"** tab
2. Click **"+ Create new"** → **"Story"**
3. Fill in:
   - Name: `Getting Started`
   - Slug: `getting-started`
   - Content type: `doc_page`

4. Add content in the fields
5. **Click "Publish"** ⬅️ Important!

### Step 3: Sync to Your Site

```bash
cd classic
npm run sync:storyblok
```

Expected output:
```
✅ Generated 1 markdown files
```

### Step 4: Test Locally

```bash
npm start
```

Visit: http://localhost:3000/docs/getting-started

---

## 🔄 Auto-Deploy Setup

### Create Netlify Build Hook

1. Go to https://app.netlify.com
2. Select your site: `gcxone`
3. **Site settings** → **Build & deploy** → **Build hooks**
4. Click **"Add build hook"**
   - Name: `Storyblok Content Update`
   - Branch: `main`
5. **Copy the webhook URL**

### Configure Storyblok Webhook

1. Go to https://app.storyblok.com/#/me/spaces/289434723537263/settings
2. Click **"Webhooks"**
3. Click **"Add webhook"** or edit existing
4. Configure:
   - **Story published**: ✅ Checked
   - **Endpoint URL**: **Paste Netlify build hook URL here**
5. Click **"Save"**

### How It Works

```
You publish in Storyblok
    ↓
Storyblok calls Netlify webhook
    ↓
Netlify runs: npm run sync:storyblok && npm run build
    ↓
Content syncs from Storyblok
    ↓
Site rebuilds and deploys (2-3 min)
    ↓
Changes live at gcxone.netlify.app ✅
```

---

## 📝 Daily Workflow

### For Content Editors

1. Go to https://app.storyblok.com/
2. Edit or create stories
3. Click **"Publish"**
4. Wait 2-3 minutes
5. Check https://gcxone.netlify.app

**No coding required!**

---

## 📁 Creating Folder Structure

Want organized docs like:
```
docs/
├── getting-started/
├── features/
│   ├── alarms
│   ├── devices
│   └── users
└── troubleshooting/
```

**In Storyblok:**

1. Click **"+ Create new"** → **"Folder"**
2. Name it (e.g., "features")
3. Inside folder, create stories
4. Run `npm run sync:storyblok`
5. Folder structure is preserved!

---

## ✅ Checklist

- [ ] Created `doc_page` content type
- [ ] Created first story and published
- [ ] Ran `npm run sync:storyblok` successfully
- [ ] Created Netlify build hook
- [ ] Configured Storyblok webhook
- [ ] Tested: published in Storyblok → saw changes on site
- [ ] Trained team on using Storyblok

---

## 🆘 Troubleshooting

### No stories found

**Solution:** Make sure you **published** the story (not just saved as draft)

### Changes not appearing

**Check:**
1. Did you click "Publish" in Storyblok?
2. Did the Netlify build complete? (check https://app.netlify.com)
3. Clear browser cache (Ctrl+Shift+R)

### Webhook not triggering

**Check:**
1. Webhook URL is correct in Storyblok settings
2. Story was published (not just saved)
3. Check Netlify deploy logs for errors

---

## 📞 Support

- Storyblok Docs: https://www.storyblok.com/docs
- Your space: https://app.storyblok.com/#/me/spaces/289434723537263
- Netlify Dashboard: https://app.netlify.com

**Ready to go!** Start creating content in Storyblok and it will automatically sync to your site. 🎉
