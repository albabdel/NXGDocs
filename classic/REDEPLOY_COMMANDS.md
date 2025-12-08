# 🔄 Vercel Redeploy Commands

## Quick Redeploy (Production)

```powershell
cd c:\nxgen-docs\classic
vercel --prod --force
```

## Command Breakdown

- `vercel` - Vercel CLI command
- `--prod` - Deploy to production environment
- `--force` - Force redeploy even if nothing changed

## All Redeploy Options

### 1. Production Redeploy (Force)
```powershell
cd c:\nxgen-docs\classic
vercel --prod --force
```
**Use when:** You want to redeploy production immediately

### 2. Production Redeploy (Only if changes)
```powershell
cd c:\nxgen-docs\classic
vercel --prod
```
**Use when:** You've made changes and want to deploy

### 3. Preview Deployment
```powershell
cd c:\nxgen-docs\classic
vercel
```
**Use when:** You want to test before production

### 4. Redeploy with Auto-Yes
```powershell
cd c:\nxgen-docs\classic
vercel --prod --force --yes
```
**Use when:** You want to skip all prompts

## Alternative: Via GitHub Push

If Vercel is connected to GitHub, just push:

```powershell
cd c:\nxgen-docs
git add .
git commit -m "Trigger redeploy"
git push origin main
```

Vercel will automatically detect the push and redeploy.

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `vercel --prod --force` | Force redeploy to production |
| `vercel --prod` | Deploy to production (if changes) |
| `vercel` | Create preview deployment |
| `vercel ls` | List all deployments |
| `vercel inspect` | Show project details |

## Troubleshooting

**"Not logged in"**
```powershell
vercel login
```

**"Command not found"**
```powershell
npm install -g vercel
```

**Check deployment status**
```powershell
vercel ls
```
