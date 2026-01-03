# 🔧 Fix Cloudflare Pages Deployment Error

## Problem
Build succeeds but deployment fails with:
```
✘ [ERROR] A request to the Cloudflare API failed.
  Authentication error [code: 10000]
```

## Root Cause
Cloudflare Pages is trying to execute a custom deploy command (`npx wrangler pages deploy`) which requires API token permissions. **This is not needed** - Cloudflare Pages deploys automatically after a successful build.

## Solution: Remove Custom Deploy Command

### Step 1: Go to Cloudflare Pages Dashboard
1. Visit: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages**
3. Click on your project: **nxgen-docs**

### Step 2: Open Project Settings
1. Click **Settings** tab
2. Scroll down to **Builds & deployments** section

### Step 3: Remove Deploy Command
1. Find the **Deploy command** field
2. **Delete/clear the entire command** - leave it completely empty/blank
3. The field should be empty (not even spaces)

### Step 4: Verify Build Settings
Ensure these settings are correct:
- ✅ **Build command**: `npm run build`
- ✅ **Build output directory**: `classic/build`
- ✅ **Root directory**: `.` (dot - root of repository)
- ✅ **Node version**: 18 or higher
- ✅ **Deploy command**: (EMPTY - this is critical!)

### Step 5: Save and Redeploy
1. Click **Save** at the bottom
2. Go to **Deployments** tab
3. Click **Retry deployment** on the failed build, or push a new commit to trigger a new build

## Why This Works

Cloudflare Pages has two deployment modes:
1. **Automatic** (recommended): After build succeeds, Pages automatically deploys the `build_output_dir`
2. **Custom command**: Uses Wrangler CLI which requires API token permissions

Since your build is succeeding, you should use **automatic deployment**. The `wrangler.toml` file already has `pages_build_output_dir = "classic/build"` configured, so Pages knows where to find your build output.

## Alternative: Fix API Token Permissions (Not Recommended)

If you must use a custom deploy command, you need to:
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Create/edit your API token
3. Add these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Account Settings** → **Read**

However, **automatic deployment is simpler and recommended**.

## Verification

After removing the deploy command, your next build should:
1. ✅ Build successfully (already working)
2. ✅ Deploy automatically to Cloudflare Pages
3. ✅ Be accessible at your Pages URL

---

**Note**: The build is already working perfectly. This is just a configuration issue in the Cloudflare dashboard.

