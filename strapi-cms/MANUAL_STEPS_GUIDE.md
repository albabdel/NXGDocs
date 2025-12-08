# 📋 Strapi Manual Steps - Visual Guide

After running `setup-strapi.bat`, complete these 2 steps:

---

## Step 1: Configure API Permissions (2 minutes)

### Navigate to Permissions
1. Open http://localhost:1337/admin
2. Click **Settings** (⚙️ icon in bottom left)
3. Under "USERS & PERMISSIONS PLUGIN", click **Roles**
4. Click **Public** (the role with 0 users)

### Enable Permissions
You'll see a list of content types. Find these two:

#### For "Category":
```
Category
├── [ ] count
├── [✓] find          ← CHECK THIS
├── [✓] findOne       ← CHECK THIS
├── [ ] create
├── [ ] update
└── [ ] delete
```

#### For "Documentation-article":
```
Documentation-article
├── [ ] count
├── [✓] find          ← CHECK THIS
├── [✓] findOne       ← CHECK THIS
├── [ ] create
├── [ ] update
└── [ ] delete
```

### Save
- Click **Save** button (top right corner)
- You should see a success message

### Test It Works
```bash
curl http://localhost:1337/api/categories
```
Should return JSON (not 403 error)

---

## Step 2: Generate API Token (1 minute)

### Navigate to API Tokens
1. Still in **Settings** (⚙️ icon)
2. Under "GLOBAL SETTINGS", click **API Tokens**
3. Click **Create new API Token** button (top right)

### Fill in Details
```
┌─────────────────────────────────────┐
│ Name *                              │
│ Docusaurus Sync                     │
├─────────────────────────────────────┤
│ Description (optional)              │
│ Token for syncing content to docs   │
├─────────────────────────────────────┤
│ Token duration *                    │
│ ○ 7 days                            │
│ ○ 30 days                           │
│ ○ 90 days                           │
│ ● Unlimited          ← SELECT THIS  │
├─────────────────────────────────────┤
│ Token type *                        │
│ ○ Read-only                         │
│ ● Full access        ← SELECT THIS  │
└─────────────────────────────────────┘
```

### Save and Copy Token
1. Click **Save** button
2. **IMPORTANT:** A modal will appear with your token
3. **Copy the entire token** (it's very long)
4. **Save it immediately** - you can't see it again!

### Save Token to File
```bash
cd c:\nxgen-docs\strapi-cms
echo STRAPI_API_TOKEN=your_copied_token_here > API_TOKEN.txt
```

Or add to `.env`:
```bash
echo STRAPI_API_TOKEN=your_copied_token_here >> .env
```

---

## ✅ Verification Checklist

After completing both steps:

- [ ] Can access http://localhost:1337/api/categories (returns JSON)
- [ ] Can access http://localhost:1337/api/documentation-articles (returns JSON)
- [ ] API token is saved in API_TOKEN.txt or .env
- [ ] No 403 Forbidden errors

---

## 🎉 You're Done!

Your Strapi CMS is now fully configured and ready to use.

### What You Can Do Now:

1. **Create Content**
   - Go to http://localhost:1337/admin
   - Click "Content Manager" → "Documentation Articles"
   - Click "Create new entry"

2. **View Your Content**
   - Browse categories and articles in the admin panel
   - Edit existing sample articles
   - Upload images

3. **Use the API**
   ```bash
   # Get all categories
   curl http://localhost:1337/api/categories
   
   # Get all articles
   curl http://localhost:1337/api/documentation-articles
   
   # Filter by role
   curl "http://localhost:1337/api/documentation-articles?filters[role][$eq]=admin"
   
   # Filter by device
   curl "http://localhost:1337/api/documentation-articles?filters[device_type][$eq]=hikvision"
   ```

---

## 🆘 Troubleshooting

### "403 Forbidden" when accessing API
→ Go back to Step 1, make sure you clicked Save

### "Cannot connect" error
→ Make sure Strapi is running: `npm run develop`

### Lost API token
→ Generate a new one (Step 2), delete the old one

### Strapi won't start
```bash
npx kill-port 1337
npm run develop
```

---

**Need help?** Check `strapi.log` for error messages
