# Storyblok CMS Integration Guide

This guide explains how to use Storyblok CMS with your Docusaurus site for content management.

## ✅ What's Already Configured

- ✅ Storyblok SDK installed (`@storyblok/react`, `storyblok-js-client`)
- ✅ API token configured in `.env.local`
- ✅ Storyblok client utility created (`src/lib/storyblok.ts`)
- ✅ Example page created (`src/pages/storyblok-example.tsx`)

## 🎯 Your Storyblok Space

- **Space ID**: 127355949506498
- **Region**: EU (eu-central-1)
- **Dashboard**: https://app.storyblok.com/#/edit/127355949506498?region=eu-central-1
- **Access Token**: Configured in `.env.local`

## 🚀 Quick Start

### 1. Test the Integration

1. Start your development server:
   ```bash
   cd classic
   npm start
   ```

2. Visit http://localhost:3000/storyblok-example

3. If you see an error, create a "home" story in Storyblok (see step 2)

### 2. Create Your First Story in Storyblok

1. Go to [Storyblok Dashboard](https://app.storyblok.com/)
2. Click **"Create new"** → **"Story"**
3. Name it "Home" (slug will be "home")
4. Add some content blocks:
   - Click **"+ Add block"**
   - Add a **Text** block with some content
   - Add an **Image** block (optional)
5. Click **"Publish"**
6. Refresh the example page - your content should now appear!

### 3. Set Up Visual Editor (Optional but Recommended)

The Visual Editor lets non-technical users see live previews as they edit.

#### Configure Preview URL in Storyblok:

1. Go to [Storyblok Settings](https://app.storyblok.com/#!/me/spaces/127355949506498/settings)
2. Click **"Visual Editor"** in left sidebar
3. Set **Preview URL** to:
   - **Local development**: `http://localhost:3000/`
   - **Production**: `https://gcxone.netlify.app/`
4. Click **"Save"**

#### Set up HTTPS for local development (Required for Visual Editor):

**Windows:**
1. Install mkcert: https://www.storyblok.com/faq/setup-dev-server-https-windows
2. Run these commands:
   ```powershell
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   ```

**macOS:**
1. Follow instructions: https://www.storyblok.com/faq/setup-dev-server-https-proxy

## 📝 Using Storyblok Content in Your Pages

### Option A: Runtime Fetching (Instant Updates)

Content is fetched when users visit the page - changes appear instantly without redeployment.

```tsx
import React, { useEffect, useState } from 'react';
import { getStory } from '@site/src/lib/storyblok';

export default function MyPage() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    async function loadContent() {
      const data = await getStory('my-page-slug');
      setStory(data);
    }
    loadContent();
  }, []);

  return (
    <div>
      {story && (
        <h1>{story.content.title}</h1>
        <p>{story.content.description}</p>
      )}
    </div>
  );
}
```

**Pros:**
- ✅ Instant content updates (no redeployment needed)
- ✅ Non-technical users can update content anytime

**Cons:**
- ❌ Slower page load (API call required)
- ❌ Requires client-side JavaScript
- ❌ Content not indexed by search engines (bad for SEO)

### Option B: Build-Time Fetching (Better Performance & SEO)

Content is fetched during build - requires redeployment but better performance.

Create a script `scripts/fetchStoryblokContent.js`:
```javascript
const StoryblokClient = require('storyblok-js-client');
const fs = require('fs');
const path = require('path');

const client = new StoryblokClient({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  region: 'eu',
});

async function fetchContent() {
  const { data } = await client.get('cdn/stories', {
    version: 'published',
  });

  // Generate markdown files
  data.stories.forEach((story) => {
    const markdown = `---
id: ${story.slug}
title: ${story.name}
---

# ${story.content.title || story.name}

${story.content.description || ''}
`;

    fs.writeFileSync(
      path.join(__dirname, '../docs', `${story.slug}.md`),
      markdown
    );
  });
}

fetchContent();
```

Add to `package.json`:
```json
{
  "scripts": {
    "prebuild": "node scripts/fetchStoryblokContent.js"
  }
}
```

**Pros:**
- ✅ Fast page load
- ✅ SEO-friendly (static content)
- ✅ Works without JavaScript

**Cons:**
- ❌ Requires redeployment for content updates
- ❌ But can auto-deploy with webhooks (see below)

## 🔄 Auto-Deploy with Webhooks (Recommended)

Set up automatic deployment when content is published in Storyblok:

1. Go to Netlify Dashboard → Site settings → Build hooks
2. Create a new build hook named "Storyblok Publish"
3. Copy the webhook URL (e.g., `https://api.netlify.com/build_hooks/...`)
4. Go to [Storyblok Settings](https://app.storyblok.com/#!/me/spaces/127355949506498/settings) → Webhooks
5. Click "Add Webhook"
6. Configure:
   - **Endpoint**: Paste Netlify webhook URL
   - **Trigger**: "Story published"
   - **Story**: All stories or specific folder
7. Click "Save"

Now when content is published in Storyblok, Netlify automatically rebuilds and deploys your site (takes ~2-3 minutes).

## 🎨 Creating Content Types in Storyblok

### 1. Define Content Types (Blocks)

1. Go to [Storyblok → Block Library](https://app.storyblok.com/#!/me/spaces/127355949506498/components)
2. Click "New block"
3. Example: Create an "Article" block with fields:
   - **title** (Text)
   - **body** (Rich Text)
   - **author** (Text)
   - **featured_image** (Asset)
   - **publish_date** (Date)

### 2. Create React Components to Render Content

```tsx
// src/components/StoryblokArticle.tsx
import React from 'react';

export default function StoryblokArticle({ blok }) {
  return (
    <article>
      <h1>{blok.title}</h1>
      {blok.featured_image && (
        <img src={blok.featured_image.filename} alt={blok.title} />
      )}
      <div className="author">By {blok.author}</div>
      <div className="date">{new Date(blok.publish_date).toLocaleDateString()}</div>
      <div dangerouslySetInnerHTML={{ __html: blok.body }} />
    </article>
  );
}
```

### 3. Register Components in storyblok.ts

```typescript
import StoryblokArticle from '@site/src/components/StoryblokArticle';

storyblokInit({
  accessToken: STORYBLOK_TOKEN,
  use: [apiPlugin],
  components: {
    article: StoryblokArticle,
    // Add more components here
  },
});
```

## 📚 Next Steps

1. ✅ Test the integration at `/storyblok-example`
2. ✅ Create your content types in Storyblok
3. ✅ Build React components to render your content
4. ✅ Set up webhooks for auto-deployment
5. ✅ Configure Visual Editor for non-technical users
6. ✅ Train your team on using Storyblok

## 🔗 Useful Links

- [Storyblok Dashboard](https://app.storyblok.com/)
- [Storyblok React Guide](https://www.storyblok.com/docs/guide/essentials/introduction)
- [Storyblok API Docs](https://www.storyblok.com/docs/api/content-delivery/v2)
- [Visual Editor Setup](https://www.storyblok.com/docs/guide/getting-started#setup-of-the-visual-editor-preview)

## 🆘 Troubleshooting

### Story not found error
- Make sure you've created a story in Storyblok
- Check the slug matches what you're querying
- Verify the story is published

### Cannot connect to Storyblok API
- Check your access token in `.env.local`
- Make sure the region is correct (`eu` vs `us`)
- Check your internet connection

### Visual Editor not working
- Set up HTTPS for local development (required)
- Configure preview URL in Storyblok settings
- Make sure the preview URL is accessible

---

**Need help?** Check the [Storyblok documentation](https://www.storyblok.com/docs) or contact your development team.
