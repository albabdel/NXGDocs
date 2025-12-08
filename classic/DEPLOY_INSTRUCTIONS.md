# 🚀 Vercel Deployment Instructions

## Quick Deploy (Recommended)

### Option 1: Run the PowerShell Script
```powershell
cd c:\nxgen-docs\classic
powershell -ExecutionPolicy Bypass -File deploy-vercel.ps1
```

### Option 2: Manual Steps

1. **Navigate to the classic directory:**
   ```powershell
   cd c:\nxgen-docs\classic
   ```

2. **Build the project (if not already built):**
   ```powershell
   npm run build
   ```

3. **Install Vercel CLI (if not installed):**
   ```powershell
   npm install -g vercel
   ```

4. **Login to Vercel (first time only):**
   ```powershell
   vercel login
   ```
   - This will open your browser for authentication
   - Follow the prompts to authorize

5. **Deploy to production:**
   ```powershell
   vercel --prod
   ```

6. **Follow the interactive prompts:**
   - **Set up and deploy?** → Type `Y` and press Enter
   - **Which scope?** → Select your account/team
   - **Link to existing project?** → Type `N` (first time)
   - **Project name:** → Type `nxgen-docs` or press Enter for default
   - **In which directory is your code located?** → Type `./` or press Enter
   - **Want to override the settings?** → Type `N` (we have vercel.json configured)

7. **Wait for deployment** - Vercel will:
   - Upload your files
   - Build the project
   - Deploy to their CDN
   - Provide you with a URL

8. **Get your URL** - You'll see something like:
   ```
   ✅ Production: https://nxgen-docs-abc123.vercel.app [copied to clipboard]
   ```

---

## Alternative: Deploy via GitHub (Automatic)

If you prefer automatic deployments on every push:

1. **Push your code to GitHub** (already done: https://github.com/albabdel/NXG-Docs)

2. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com
   - Sign in with GitHub

3. **Import Project:**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose: `albabdel/NXG-Docs`
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Docusaurus (auto-detected)
   - **Root Directory:** `classic`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL!

6. **Automatic Updates:**
   - Every time you push to GitHub, Vercel will automatically rebuild and deploy
   - You'll get preview URLs for pull requests too!

---

## What You Get

✅ **Production URL:** `https://nxgen-docs-xxx.vercel.app`
✅ **Automatic HTTPS:** SSL certificate included
✅ **Global CDN:** Fast worldwide
✅ **Custom Domain:** Can add your own domain later
✅ **Preview Deployments:** Automatic for every push
✅ **Analytics:** Built-in (optional)

---

## Troubleshooting

**"Command not found: vercel"**
```powershell
npm install -g vercel
```

**"Not logged in"**
```powershell
vercel login
```

**Build fails:**
```powershell
npm run clear
npm install
npm run build
```

**Deployment fails:**
- Check build logs in Vercel dashboard
- Ensure `vercel.json` exists in `classic/` directory
- Verify all dependencies are in `package.json`

---

## Next Steps After Deployment

1. **Test the live site** - Visit the URL Vercel provides
2. **Share with team** - Send the URL to internal users
3. **Add custom domain** (optional):
   ```powershell
   vercel domains add docs.yourcompany.com
   ```
4. **Set up environment variables** (if needed):
   - Go to Vercel Dashboard → Project → Settings → Environment Variables

---

## Quick Reference

```powershell
# Deploy to production
vercel --prod

# Deploy preview (for testing)
vercel

# View deployments
vercel ls

# View project info
vercel inspect

# Remove deployment
vercel remove
```
