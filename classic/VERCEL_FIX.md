# Fixing 404 Error on Vercel

## The Problem
You're getting a 404 error because Vercel needs proper routing configuration for Docusaurus (a single-page application).

## Solution

I've updated `vercel.json` with the correct configuration. Now you need to:

### Option 1: Redeploy via Vercel Dashboard (Easiest)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Find your project: `nxgen-docs`
3. Go to **Settings** → **Git**
4. Make sure the updated `vercel.json` is pushed to GitHub
5. Click **Redeploy** on the latest deployment

### Option 2: Redeploy via CLI

```powershell
cd c:\nxgen-docs\classic

# Make sure vercel.json is correct (already updated)
# Push changes to GitHub
git add vercel.json
git commit -m "Fix Vercel routing configuration"
git push

# Redeploy
vercel --prod --force
```

### Option 3: Update in Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Make sure:
   - **Framework Preset:** Docusaurus (or Other)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Root Directory:** `classic` (if deploying from root)

4. Go to **Settings** → **Functions** or check if there's a **Rewrites** section
5. The `vercel.json` file should handle this automatically

## What Changed

The `vercel.json` now has the correct rewrite rule:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for all routes, allowing Docusaurus's client-side routing to work.

## Verify the Fix

After redeploying:
1. Visit your Vercel URL (e.g., `https://nxgen-docs-xxx.vercel.app`)
2. Try navigating to different pages
3. The 404 should be gone!

## If Still Not Working

1. **Check build output:**
   - In Vercel Dashboard → Deployments → Click on a deployment
   - Check the build logs to ensure build completed successfully
   - Verify `build/index.html` exists

2. **Check baseUrl:**
   - In `docusaurus.config.ts`, ensure `baseUrl: '/'`
   - This is already correct in your config

3. **Clear Vercel cache:**
   ```powershell
   vercel --prod --force
   ```

4. **Check Vercel project settings:**
   - Ensure Root Directory is set correctly
   - Ensure Build Command and Output Directory are correct
