# 🔑 TOKEN PERMISSIONS REQUIRED

**Status:** 🟡 ALMOST THERE - Token needs content permissions

---

## ✅ WHAT'S WORKING

We've successfully verified:

1. **✅ Project Connection** - Connected to "Enterprise Content Starter"
2. **✅ Correct API Endpoint** - Using High Performance API
3. **✅ Content Models Exist** - Article, Author, Page all available
4. **✅ Mutations Available** - createArticle, publishArticle, deleteArticle
5. **✅ Authentication** - Token is valid and connects to project

---

## ❌ CURRENT BLOCKER

**Error:** `Mutation failed due to permission errors`

**Cause:** Your `DEFAULT_TOKEN` doesn't have permission to CREATE content

**Failed Action:** `create` on model `Article` in stage `DRAFT`

---

## 🔧 HOW TO FIX (Takes 2 minutes)

### Step 1: Open Hygraph Dashboard

Go to: https://app.hygraph.com/bf5aa53f-7e4c-43a5-8d33-696cfa2520e3

### Step 2: Navigate to API Access

1. Click **Settings** in the left sidebar
2. Click **API Access**
3. Click **Permanent Auth Tokens** tab

### Step 3: Find Your Token

Look for: **DEFAULT_TOKEN** (created on Dec 25, 2024)

### Step 4: Edit Permissions

1. Click the **three dots** (⋮) next to DEFAULT_TOKEN
2. Select **Edit**
3. Scroll down to **Content permissions** section

### Step 5: Enable These Permissions

Enable the following for the token:

#### Required Permissions:
- ☑️ **Read** - Read published content
- ☑️ **Create** - Create new content ← **CRITICAL!**
- ☑️ **Update** - Update existing content
- ☑️ **Delete** - Delete content (for cleanup/testing)
- ☑️ **Publish** - Publish content to make it live
- ☑️ **Unpublish** - Unpublish content

#### Optional (but recommended):
- ☑️ **Read unpublished content** - See draft content
- ☑️ **Read & write locales** - If you use multiple languages

### Step 6: Save Token

Click **Update Token** at the bottom

---

## 🧪 VERIFY IT WORKS

After updating permissions, run this command:

```bash
cd "c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic"
node scripts/test-create-article.js
```

**Expected Output:**
```
✅ ARTICLE CREATED!
   ID: clxxxxxxxx
   Title: Test Migration Article
   Slug: test-migration-article-123

✅ ARTICLE PUBLISHED!
   Stage: PUBLISHED

✅ TEST ARTICLE DELETED

✅ SUCCESS! Article creation works!
🎯 Ready to migrate all 457 articles!
```

---

## 📋 ALTERNATIVE: Create New Token

If you prefer to create a new token instead:

### Option 1: Create Content Token

1. Settings → API Access → Permanent Auth Tokens
2. Click **Create Token**
3. Name: `CONTENT_MIGRATION_TOKEN`
4. **Content API**:
   - ☑️ Read
   - ☑️ Create
   - ☑️ Update
   - ☑️ Delete
   - ☑️ Publish
   - ☑️ Unpublish
5. **Content Management API**:
   - Leave unchecked (we're using Content API, not Management API)
6. Click **Create & Copy Token**
7. Update your `.env.local` file:

```env
HYGRAPH_TOKEN=<paste_new_token_here>
HYGRAPH_MANAGEMENT_TOKEN=<paste_new_token_here>
```

---

## 🎯 AFTER FIXING PERMISSIONS

Once you've enabled permissions and the test succeeds, I'll:

1. **Create Markdown → Rich Text converter** (Article content field uses Rich Text format)
2. **Update migration script** to use Article model and Rich Text
3. **Test with 3 articles**
4. **Run full migration of all 457 articles**

---

## 📸 VISUAL GUIDE

### Where to Find API Access:
```
Dashboard
  └── Settings (⚙️ left sidebar)
        └── API Access
              └── Permanent Auth Tokens
                    └── DEFAULT_TOKEN → Edit (⋮)
                          └── Content permissions
                                ☑️ Read
                                ☑️ Create  ← Enable this!
                                ☑️ Update
                                ☑️ Delete
                                ☑️ Publish
                                ☑️ Unpublish
```

---

## ❓ TROUBLESHOOTING

### "I don't see DEFAULT_TOKEN"

- Check you're in the correct project (Enterprise Content Starter)
- Look for any token created on Dec 25, 2024
- If no tokens exist, create a new one (see Alternative section above)

### "I enabled permissions but still get 403 error"

- Click **Update Token** to save changes
- Wait 30 seconds for permissions to propagate
- Run the test script again
- If still failing, try creating a fresh token

### "I'm not sure which permissions to enable"

**Minimum required:**
- ☑️ Create
- ☑️ Publish

**Recommended for full migration:**
- ☑️ Read
- ☑️ Create
- ☑️ Update
- ☑️ Delete
- ☑️ Publish
- ☑️ Unpublish

---

## 🚀 SUMMARY

**What we've accomplished:**
- ✅ Found the correct project (Enterprise Content Starter)
- ✅ Fixed API endpoint configuration
- ✅ Verified Article model exists with all required mutations
- ✅ Confirmed authentication works

**What you need to do:**
- 🔑 Enable "Create" permission on your DEFAULT_TOKEN (2 minutes)

**What happens next:**
- 🧪 Test article creation succeeds
- 🔧 Create Rich Text converter for markdown content
- 🚀 Migrate all 457 articles automatically

---

**Last Updated:** 2025-12-25
**Ready to Proceed:** ⏸️ Waiting for token permissions update
