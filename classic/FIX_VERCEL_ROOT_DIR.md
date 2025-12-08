# Fix: "classic\classic" Path Error

## The Problem
Vercel is looking for `classic/classic` because:
- Root Directory in Vercel dashboard is set to `classic`
- But you're running `vercel` command from inside the `classic` directory
- So it's looking for `classic/classic` which doesn't exist

## Solution: Remove Root Directory Setting

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/abeds-projects-79f20288/nxg-docs/settings
2. Click **Settings** → **General**
3. Find **Root Directory**
4. **Clear it** (set to empty/blank)
5. Click **Save**
6. Redeploy

### Option 2: Run from Parent Directory

Instead of running from `classic`, run from the root:

```powershell
cd c:\nxgen-docs
vercel --prod --force
```

But you'll need to update the Root Directory back to `classic` in dashboard.

## Recommended Fix

**Clear the Root Directory setting** because:
- You're deploying from `classic` directory
- Vercel will use the current directory automatically
- No need for Root Directory when running from the project root

## After Fixing

Once Root Directory is cleared:

```powershell
cd c:\nxgen-docs\classic
vercel --prod --force
```

This should work!
