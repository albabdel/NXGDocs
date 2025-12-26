# Hygraph + Docusaurus Deployment Guide

Complete guide for deploying your Hygraph-integrated Docusaurus site to production.

## Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [GitHub Actions](#github-actions)
- [Hygraph Webhooks](#hygraph-webhooks)
- [Troubleshooting](#troubleshooting)

---

## Overview

Your Docusaurus site is now integrated with Hygraph CMS. The deployment workflow is:

1. **Edit content** in Hygraph Studio
2. **Publish changes** in Hygraph
3. **Trigger build** (manual or via webhook)
4. **Fetch content** from Hygraph API (automated via prebuild hook)
5. **Build & deploy** static site

---

## Environment Setup

### Required Environment Variables

For production deployments, you need to set these environment variables:

```env
HYGRAPH_ENDPOINT=https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master
HYGRAPH_TOKEN=<your-production-token>
```

**Important:**
- Use your **HYGRAPH_PROD_TOKEN** for production (not the dev token)
- Never commit these values to git
- Set them in your hosting platform's environment variables

---

## Vercel Deployment

### 1. Initial Setup

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the classic directory
cd classic
vercel
```

### 2. Configure Environment Variables

**Option A: Via Vercel CLI**
```bash
vercel env add HYGRAPH_ENDPOINT
# Paste: https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master

vercel env add HYGRAPH_TOKEN
# Paste your HYGRAPH_PROD_TOKEN
```

**Option B: Via Vercel Dashboard**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `HYGRAPH_ENDPOINT` = `https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master`
   - `HYGRAPH_TOKEN` = Your HYGRAPH_PROD_TOKEN

### 3. Set Build Configuration

In Vercel Project Settings → Build & Development Settings:

- **Framework Preset:** Docusaurus 2
- **Root Directory:** `classic`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### 4. Deploy

```bash
# Production deployment
vercel --prod
```

The `prebuild` hook will automatically run `npm run fetch-content` before building.

---

## Netlify Deployment

### 1. Create netlify.toml

Create `classic/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"
  base = "classic"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 2. Configure Environment Variables

**Via Netlify Dashboard:**
1. Go to **Site Settings → Build & Deploy → Environment**
2. Click **Edit variables**
3. Add:
   - `HYGRAPH_ENDPOINT` = `https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master`
   - `HYGRAPH_TOKEN` = Your HYGRAPH_PROD_TOKEN

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set HYGRAPH_ENDPOINT "https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master"
netlify env:set HYGRAPH_TOKEN "your-prod-token"
```

### 3. Deploy

**Option A: Git Integration**
1. Connect your repository in Netlify dashboard
2. Netlify will auto-deploy on every git push

**Option B: Manual Deploy**
```bash
cd classic
netlify deploy --prod
```

---

## GitHub Actions

Set up automatic deployments with GitHub Actions.

### 1. Add Repository Secrets

In your GitHub repository:
1. Go to **Settings → Secrets and variables → Actions**
2. Add secrets:
   - `HYGRAPH_ENDPOINT`
   - `HYGRAPH_TOKEN` (use HYGRAPH_PROD_TOKEN)

### 2. Create Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Docusaurus with Hygraph

on:
  push:
    branches: [main]
  workflow_dispatch:
  repository_dispatch:
    types: [hygraph-content-update]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: classic/package-lock.json

      - name: Install dependencies
        run: |
          cd classic
          npm ci

      - name: Fetch Hygraph content
        env:
          HYGRAPH_ENDPOINT: ${{ secrets.HYGRAPH_ENDPOINT }}
          HYGRAPH_TOKEN: ${{ secrets.HYGRAPH_TOKEN }}
        run: |
          cd classic
          npm run fetch-content

      - name: Build Docusaurus
        run: |
          cd classic
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./classic/build
```

---

## Hygraph Webhooks

Set up webhooks to automatically trigger deployments when content changes in Hygraph.

### 1. Get Your Webhook URL

**For Vercel:**
- Deploy Hook URL: `https://api.vercel.com/v1/integrations/deploy/[project-id]/[deploy-hook-id]`
- Create at: Vercel Dashboard → Project Settings → Git → Deploy Hooks

**For Netlify:**
- Build Hook URL: Available at Site Settings → Build & Deploy → Build Hooks
- Create a new hook named "Hygraph Content Update"

**For GitHub Actions:**
- Use repository dispatch endpoint:
  ```
  POST https://api.github.com/repos/[owner]/[repo]/dispatches
  ```
- Create a Personal Access Token with `repo` scope

### 2. Configure Webhook in Hygraph

1. Go to **Hygraph Studio → Your Project**
2. Navigate to **Settings → Webhooks**
3. Click **Create Webhook**
4. Configure:

   **For Vercel/Netlify:**
   - **Name:** Deploy to Production
   - **URL:** Your deploy hook URL
   - **Method:** POST
   - **Trigger:** On content publish
   - **Models:** Select "Page" (or all models)

   **For GitHub Actions:**
   - **Name:** GitHub Deploy
   - **URL:** `https://api.github.com/repos/[owner]/[repo]/dispatches`
   - **Method:** POST
   - **Headers:**
     - `Authorization: Bearer [github-token]`
     - `Accept: application/vnd.github+json`
   - **Body:**
     ```json
     {
       "event_type": "hygraph-content-update"
     }
     ```

5. **Test the webhook** using the test button
6. **Save**

### 3. Verify Webhook

1. Make a change in Hygraph
2. Publish the change
3. Check your deployment platform for a new build

---

## Content Update Workflow

Once webhooks are configured:

1. **Edit** content in Hygraph Studio
2. **Publish** your changes
3. **Webhook** automatically triggers deployment
4. **Build process:**
   - Fetches latest content from Hygraph
   - Converts rich text to markdown
   - Builds static site
   - Deploys to hosting platform
5. **Live** in 2-5 minutes

---

## Troubleshooting

### Build Fails: "HYGRAPH_TOKEN is undefined"

**Solution:** Verify environment variables are set correctly in your hosting platform.

```bash
# For Vercel
vercel env ls

# For Netlify
netlify env:list
```

### No Pages Generated

**Solution:** Check that:
1. Pages are published in Hygraph (not draft)
2. API endpoint is correct
3. Token has proper permissions

**Test locally:**
```bash
cd classic
npm run fetch-content
```

### Webhook Not Triggering

**Solution:**
1. Check webhook logs in Hygraph Studio
2. Verify webhook URL is correct
3. Test webhook manually in Hygraph
4. Check deployment platform logs

### Content Not Updating

**Solution:**
1. Verify webhook triggered successfully
2. Check build logs for errors
3. Clear cache and rebuild
4. Verify `prebuild` hook is running

### Rate Limiting

If you're hitting Hygraph API rate limits:

**Solution:**
1. Use caching in your fetch script
2. Implement incremental builds
3. Upgrade Hygraph plan for higher limits

---

## Best Practices

1. **Use Production Token** for production deployments
2. **Set up webhooks** for automatic deployments
3. **Monitor build logs** for any issues
4. **Test locally** before publishing major changes
5. **Keep tokens secure** - never commit to git
6. **Use preview deployments** for testing (Vercel/Netlify preview branches)

---

## Quick Reference

### Local Development
```bash
cd classic
npm start              # Fetch content & start dev server
npm run fetch-content  # Fetch content only
```

### Production Build
```bash
cd classic
npm run build          # Automatically fetches content via prebuild hook
```

### Environment Variables
```env
HYGRAPH_ENDPOINT=https://api-eu-west-2.hygraph.com/v2/cmcd3s4gx00uq07w3xhw9djjz/master
HYGRAPH_TOKEN=<production-token>
```

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Hygraph logs in Studio
3. Check deployment platform build logs
4. Verify environment variables are set correctly

Happy deploying! 🚀
