# 🔄 Vercel Redeploy Commands

## Quick Redeploy

```powershell
cd c:\nxgen-docs\classic
vercel --prod --force
```

## Command Breakdown

- `vercel` - Vercel CLI command
- `--prod` - Deploy to production (not preview)
- `--force` - Force redeploy even if nothing changed

## Alternative Commands

### Redeploy without force (only if changes detected)
```powershell
cd c:\nxgen-docs\classic
vercel --prod
```

### Preview deployment (for testing)
```powershell
cd c:\nxgen-docs\classic
vercel
```

### Redeploy with specific project
```powershell
cd c:\nxgen-docs\classic
vercel --prod --force --yes
```

## Full Command Reference

```powershell
# Navigate to project
cd c:\nxgen-docs\classic

# Production redeploy (force)
vercel --prod --force

# Or use the script
powershell -ExecutionPolicy Bypass -File redeploy.ps1
```

## What Happens

1. Vercel CLI connects to your account
2. Uploads current code
3. Runs build command (`npm run build`)
4. Deploys to production
5. Gives you the new URL

## Troubleshooting

**"Not logged in"**
```powershell
vercel login
```

**"Command not found"**
```powershell
npm install -g vercel
```

**Want to see what will be deployed**
```powershell
vercel --prod --dry-run
```
