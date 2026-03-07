# How to Fix Chunk Loading Errors

## Complete Restart Process

### Step 1: Stop the Dev Server
1. Go to the terminal where `npm run start` is running
2. Press `Ctrl+C` to stop it
3. Wait until it fully stops (you should see the command prompt again)

### Step 2: Clean All Caches
Run this PowerShell command from the `classic` directory:

```powershell
.\clean-restart.ps1
```

Or manually:
```powershell
Remove-Item -Recurse -Force .docusaurus -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### Step 3: Clear Browser Cache
**IMPORTANT:** Clear your browser cache for localhost:
- **Chrome/Edge**: Press `Ctrl+Shift+Delete`, select "Cached images and files", click "Clear data"
- **Firefox**: Press `Ctrl+Shift+Delete`, select "Cache", click "Clear Now"
- Or do a hard refresh: `Ctrl+Shift+R` or `Ctrl+F5`

### Step 4: Restart Dev Server
```bash
npm run start
```

### Step 5: If Still Not Working
Try using a different port:
```bash
npm run start -- --port 3001
```
Then access `http://localhost:3001`

## Alternative: Full Clean Install
If the above doesn't work:

```powershell
# Remove all caches
Remove-Item -Recurse -Force .docusaurus -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Reinstall dependencies (optional, but can help)
npm install

# Start fresh
npm run start
```

## What Causes This?
Chunk loading errors happen when:
- New files are added while the dev server is running
- Browser caches old chunk references
- Webpack needs to regenerate chunks

A clean restart with cleared caches fixes this.






