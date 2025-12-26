# HYGRAPH SCHEMA SETUP REQUIRED ⚠️

**CRITICAL:** The content models need to be created in Hygraph before migration can proceed.

**Status:** 🔴 BLOCKED - Schema not set up in Hygraph dashboard

---

## 🔍 ISSUE DISCOVERED

During test migration, the script received these errors:
```
Cannot query field "createPage" on type "Mutation"
Cannot query field "createChapter" on type "Mutation"
Cannot query field "createSEO" on type "Mutation"
```

**Root Cause:** The Page, Chapter, and SEO models haven't been created in your Hygraph project yet.

---

## ✅ REQUIRED SCHEMA SETUP

You need to create these content models in Hygraph before migration can work:

### 1. Chapter Model
```
Model Name: Chapter
API ID: Chapter (singular: chapter)

Fields:
- title (String, Single Line Text)
  - Display Name: Title
  - API ID: title
  - Required: No

- pages (Reference, Allow multiple values)
  - Display Name: Pages
  - API ID: pages
  - Reference Model: Page
  - Two-way reference: Yes
  - Reverse field: chapter
```

### 2. SEO Model
```
Model Name: SEO
API ID: SEO (singular: seo)

Fields:
- title (String, Single Line Text)
  - Display Name: Title
  - API ID: title
  - Required: No

- description (String, Single Line Text)
  - Display Name: Description
  - API ID: description
  - Required: No
```

### 3. Page Model
```
Model Name: Page
API ID: Page (singular: page)

Fields:
- title (String, Single Line Text)
  - Display Name: Title
  - API ID: title
  - Required: Yes

- slug (String, Single Line Text)
  - Display Name: Slug
  - API ID: slug
  - Required: Yes
  - Unique: Yes
  - Validation: Lowercase, hyphens only

- content (String, Multi Line Text OR Rich Text Editor)
  - Display Name: Content
  - API ID: content
  - Required: No

- chapter (Reference, Allow single value)
  - Display Name: Chapter
  - API ID: chapter
  - Reference Model: Chapter
  - Two-way reference: Yes (reverse field: pages)
  - Required: No

- seo (Reference, Allow single value)
  - Display Name: SEO
  - API ID: seo
  - Reference Model: SEO
  - Two-way reference: No
  - Required: No
```

---

## 📋 STEP-BY-STEP SETUP GUIDE

### Step 1: Access Schema Editor

1. Go to: https://studio-eu-west-2.hygraph.com/8be74d68-843a-42e1-8a4c-3730facf7c5c
2. Click on **Schema** in the left sidebar
3. You should see the schema editor

### Step 2: Create Chapter Model

1. Click **Add** → **Model** in the top right
2. Set Display Name: `Chapter`
3. Set API ID (Plural): `chapters`
4. Set API ID (Singular): `chapter`
5. Click **Add Model**

6. Now add fields to Chapter:
   - Click **Add Field** → **Single Line Text**
     - Display Name: `Title`
     - API ID: `title`
     - Click **Add**

7. **Save the Chapter model** (don't add pages reference yet, we'll do that after creating Page)

### Step 3: Create SEO Model

1. Click **Add** → **Model**
2. Set Display Name: `SEO`
3. Set API ID (Plural): `seOs` (let Hygraph auto-generate)
4. Set API ID (Singular): `sEO`
5. Click **Add Model**

6. Add fields to SEO:
   - Click **Add Field** → **Single Line Text**
     - Display Name: `Title`
     - API ID: `title`
     - Click **Add**

   - Click **Add Field** → **Single Line Text**
     - Display Name: `Description`
     - API ID: `description`
     - Click **Add**

7. **Save the SEO model**

### Step 4: Create Page Model

1. Click **Add** → **Model**
2. Set Display Name: `Page`
3. Set API ID (Plural): `pages`
4. Set API ID (Singular): `page`
5. Click **Add Model**

6. Add fields to Page:
   - Click **Add Field** → **Single Line Text**
     - Display Name: `Title`
     - API ID: `title`
     - Required: **YES** (toggle on)
     - Click **Add**

   - Click **Add Field** → **Single Line Text**
     - Display Name: `Slug`
     - API ID: `slug`
     - Required: **YES**
     - Unique: **YES**
     - Validations: Add pattern `^[a-z0-9-]+$` (lowercase letters, numbers, hyphens)
     - Click **Add**

   - Click **Add Field** → **Multi Line Text**
     - Display Name: `Content`
     - API ID: `content`
     - Click **Add**
     - NOTE: You can use Rich Text Editor instead if you prefer

   - Click **Add Field** → **Reference**
     - Display Name: `Chapter`
     - API ID: `chapter`
     - Reference Model: Select **Chapter**
     - Allow multiple values: **NO**
     - Two-way reference: **YES**
     - Reverse field name: `pages`
     - Click **Add**

   - Click **Add Field** → **Reference**
     - Display Name: `SEO`
     - API ID: `seo`
     - Reference Model: Select **SEO**
     - Allow multiple values: **NO**
     - Two-way reference: **NO**
     - Click **Add**

7. **Save the Page model**

### Step 5: Publish Schema Changes

**IMPORTANT:** After creating all models and fields:

1. Look for a **Publish** button in the top right
2. Click **Publish** to make the schema live
3. Confirm the publication

---

## 🧪 VERIFY SCHEMA IS READY

After setting up the schema, verify it in the GraphQL Playground:

1. Go to: https://studio-eu-west-2.hygraph.com/8be74d68-843a-42e1-8a4c-3730facf7c5c/d524470c3df0442ea7a820a2ae9f6fd5/playground
2. Try this test query:

```graphql
mutation TestCreatePage {
  createPage(data: {
    title: "Test Article"
    slug: "test-article-123"
    content: "This is a test"
  }) {
    id
    title
    slug
  }
}
```

3. If it works, you'll see a response with the created page
4. If it fails, review the schema setup steps above

---

## ▶️ AFTER SCHEMA IS SET UP

Once the schema is ready, return to the migration:

```bash
# Test with 3 articles
npm run migrate:hygraph:test

# If successful, run full migration
npm run migrate:hygraph
```

---

## 🎥 VIDEO TUTORIAL (Alternative)

If you prefer a visual guide, search YouTube for:
- "Hygraph create content model tutorial"
- "Hygraph schema setup guide"

Or check the official docs:
- https://hygraph.com/docs/guides/schema/create-a-model

---

## 📞 NEED HELP?

**Option 1 - Do It Yourself:**
Follow the step-by-step guide above carefully. It should take about 10-15 minutes.

**Option 2 - Ask for Agent Help:**
If you get stuck, ask the next agent to help you through the schema setup steps by checking the Hygraph documentation.

**Option 3 - Use Hygraph Support:**
Contact Hygraph support if you have issues with the schema editor itself.

---

## 🔄 CURRENT STATUS

| Task | Status |
|------|--------|
| ✅ Migration script created | Complete |
| ✅ .env.local configured | Complete |
| ✅ Authentication working | Complete |
| 🔴 Hygraph schema setup | **REQUIRED - User must do this** |
| ⏸️ Test migration | Waiting for schema |
| ⏸️ Full migration | Waiting for schema |

**NEXT STEP:** Create the content models in Hygraph following the guide above.

---

**Last Updated:** 2025-12-25
**Blocking Issue:** Content models not created in Hygraph
**Estimated Setup Time:** 10-15 minutes (manual setup in Hygraph dashboard)
