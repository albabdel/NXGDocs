# 🔧 Fixing 404 Error - Vercel Settings

The 404 error means Vercel can't find your files. This is usually a **project configuration issue** in the Vercel dashboard.

## ✅ Step-by-Step Fix

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click on your project: `nxgen-docs`

### 2. Check Project Settings
Go to **Settings** → **General** and verify:

#### Root Directory
- **Must be set to:** `classic`
- If it's empty or set to `/`, change it to `classic`

#### Build & Development Settings
- **Framework Preset:** `Docusaurus` (or `Other` if Docusaurus isn't listed)
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`
- **Development Command:** `npm start`

### 3. Save Settings
- Click **Save** at the bottom

### 4. Redeploy
- Go to **Deployments** tab
- Click **"..."** on the latest deployment
- Click **Redeploy**

## 🎯 Quick Visual Guide

```
Vercel Dashboard
├── Your Project (nxgen-docs)
    ├── Settings
    │   ├── General
    │   │   ├── Root Directory: [classic] ← CHANGE THIS!
    │   │   └── Build & Development Settings
    │   │       ├── Build Command: npm run build
    │   │       ├── Output Directory: build
    │   │       └── Install Command: npm install
    │   └── Save
    └── Deployments
        └── ... → Redeploy
```

## 🔍 Alternative: Check via CLI

If you have Vercel CLI, you can check current settings:

```powershell
cd c:\nxgen-docs\classic
vercel inspect
```

## ⚠️ Common Issues

### Issue 1: Root Directory Not Set
**Symptom:** 404 on all pages
**Fix:** Set Root Directory to `classic` in Vercel dashboard

### Issue 2: Wrong Build Output
**Symptom:** 404 on all pages
**Fix:** Ensure Output Directory is `build` (not `build/` or `./build`)

### Issue 3: Build Failing
**Symptom:** Deployment shows "Build Failed"
**Fix:** Check build logs in Vercel dashboard

## 📋 Checklist

Before redeploying, ensure:
- [ ] Root Directory = `classic`
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `build`
- [ ] Framework = Docusaurus (or Other)
- [ ] vercel.json exists in `classic/` directory
- [ ] Settings saved
- [ ] Redeployed after changes

## 🚀 After Fixing Settings

1. **Redeploy** (Settings → Deployments → Redeploy)
2. **Wait 2-3 minutes** for build
3. **Test your URL** - should work now!

## 💡 Still Not Working?

If it still doesn't work after fixing settings:

1. **Check build logs:**
   - Go to Deployments → Click on a deployment
   - Check if build completed successfully
   - Look for any errors

2. **Verify build output:**
   - Build should create `classic/build/index.html`
   - If not, build is failing

3. **Try manual build test:**
   ```powershell
   cd c:\nxgen-docs\classic
   npm run build
   # Check if build/ directory is created
   ```
