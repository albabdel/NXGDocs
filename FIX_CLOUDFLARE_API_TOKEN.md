# 🔧 Fix Cloudflare API Token Permissions for Pages Deployment

## Problem
Deployment fails with:
```
✘ [ERROR] Authentication error [code: 10000]
Please ensure it has the correct permissions for this operation.
```

## Root Cause
The `CLOUDFLARE_API_TOKEN` environment variable in Cloudflare Pages doesn't have the required permissions to deploy to Pages.

## Solution: Update API Token Permissions

### Step 1: Check Current Token
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Find the token being used (check Cloudflare Pages environment variables)
3. Note the token name or create a new one

### Step 2: Create/Edit API Token with Correct Permissions

**Option A: Create New Token (Recommended)**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Click **Create Custom Token**
4. Configure:

   **Token Name**: `Cloudflare Pages Deploy`
   
   **Permissions**:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Account Settings** → **Read**
   - **Zone** → **Zone Settings** → **Read** (optional, for custom domains)
   
   **Account Resources**:
   - Include: **All accounts** (or select your specific account)
   
   **Zone Resources**:
   - Include: **All zones** (or specific zones if you have custom domains)

5. Click **Continue to summary**
6. Click **Create Token**
7. **Copy the token immediately** (you won't see it again!)

### Step 3: Update Cloudflare Pages Environment Variable

1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages** → **nxgen**
3. Click **Settings** tab
4. Scroll to **Environment variables** section
5. Find `CLOUDFLARE_API_TOKEN`
6. Click **Edit** or **Add variable**
7. Paste your new token
8. Click **Save**

### Step 4: Retry Deployment

1. Go to **Deployments** tab
2. Click **Retry deployment** on the failed build
3. Or push a new commit to trigger a new build

## Alternative: Use Account-Level API Token

If you're the account owner, you can use an **Account-level API token**:

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template (it includes Pages permissions)
4. Customize permissions:
   - Keep: **Cloudflare Pages:Edit**
   - Keep: **Account Settings:Read**
5. Create and copy the token
6. Update the `CLOUDFLARE_API_TOKEN` in Pages settings

## Verify Token Permissions

After updating, the token should have:
- ✅ **Cloudflare Pages:Edit** - Required for deployment
- ✅ **Account Settings:Read** - Required for account info
- ✅ **Account ID**: `ff9df0a2daf8c9eb1032f67dd551c784` (your account)

## Troubleshooting

### Still Getting Authentication Error?

1. **Verify token is correct**: Make sure you copied the entire token (starts with something like `abc123...`)
2. **Check token hasn't expired**: API tokens don't expire, but check if it was deleted
3. **Verify account access**: Ensure the token has access to account `ff9df0a2daf8c9eb1032f67dd551c784`
4. **Check project name**: Verify the project name in Cloudflare Pages matches `nxgen` (as in `wrangler.toml`)

### Test Token Locally (Optional)

You can test the token works:

```bash
# Set token
export CLOUDFLARE_API_TOKEN="your-token-here"

# Test deployment (dry run)
npx wrangler pages deploy classic/build --dry-run

# Or test authentication
npx wrangler whoami
```

## Quick Reference: Required Permissions

| Permission | Type | Required For |
|------------|------|--------------|
| Cloudflare Pages:Edit | Account | Deploying to Pages |
| Account Settings:Read | Account | Reading account info |
| Zone Settings:Read | Zone | Custom domains (optional) |

---

**Note**: Since you're a Super Administrator, you should have full access. The issue is that the API token itself needs explicit permissions, even if your user account has admin rights.

