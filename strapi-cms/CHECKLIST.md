# ✅ Strapi Setup Checklist

## Pre-Setup
- [ ] Node.js installed (v20+)
- [ ] Port 1337 is available

## Automated Setup
- [ ] Run `setup-strapi.bat`
- [ ] Wait for "Automated setup complete!" message
- [ ] Strapi is running at http://localhost:1337

## Manual Configuration

### Step 1: API Permissions
- [ ] Open http://localhost:1337/admin
- [ ] Navigate to Settings → Users & Permissions → Roles
- [ ] Click "Public" role
- [ ] Find "Category" section
  - [ ] Check ✅ `find`
  - [ ] Check ✅ `findOne`
- [ ] Find "Documentation-article" section
  - [ ] Check ✅ `find`
  - [ ] Check ✅ `findOne`
- [ ] Click "Save" button

### Step 2: API Token
- [ ] Navigate to Settings → API Tokens
- [ ] Click "Create new API Token"
- [ ] Enter name: "Docusaurus Sync"
- [ ] Select "Unlimited" duration
- [ ] Select "Full access" type
- [ ] Click "Save"
- [ ] Copy the token (shows only once!)
- [ ] Save token to `API_TOKEN.txt` or `.env`

## Verification
- [ ] Test categories API: `curl http://localhost:1337/api/categories`
- [ ] Test articles API: `curl http://localhost:1337/api/documentation-articles`
- [ ] Both return JSON (not 403 error)
- [ ] Can see 13 categories in admin panel
- [ ] Can see 5 articles in admin panel

## Post-Setup
- [ ] Review sample articles
- [ ] Try creating a new article
- [ ] Test image upload
- [ ] Bookmark admin panel: http://localhost:1337/admin

---

## ✅ Setup Complete!

When all boxes are checked, your Strapi CMS is fully configured and ready to use.

**Time to complete:** ~5 minutes
