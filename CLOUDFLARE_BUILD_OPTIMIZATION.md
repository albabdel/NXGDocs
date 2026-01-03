# Cloudflare Pages Build Optimization

## Issue
The build was timing out on Cloudflare Pages (20-minute timeout limit).

## Optimizations Applied

### 1. Build Script Optimization
- Changed from `npm install` to `npm ci --prefer-offline --no-audit --silent`
  - `npm ci` is faster and deterministic
  - `--prefer-offline` uses cached packages
  - `--no-audit` skips security audits (saves time)
  - `--silent` reduces log output

### 2. Memory Optimization
- Added `NODE_OPTIONS='--max-old-space-size=4096'` to increase Node.js memory limit
- Prevents out-of-memory errors during large builds
- Uses cross-platform Node.js wrapper script (`scripts/build-with-memory.js`) for Windows/Linux compatibility

### 3. Cloudflare Pages Configuration
- Created `wrangler.toml` for Cloudflare configuration (Pages-compatible format)
- Created `.cfpages.yaml` for Pages-specific settings
- Build output directory: `classic/build`
- **Important**: `wrangler.toml` only contains Pages-compatible settings (no `[build]` section)

### 4. HTTP Headers
- Added `classic/static/_headers` for proper caching and security headers

## Cloudflare Pages Settings

In the Cloudflare Pages dashboard, configure:
- **Build command**: `npm run build`
- **Build output directory**: `classic/build`
- **Root directory**: `.` (root of repository)
- **Node version**: 18 or higher

## Environment Variables

If using Hygraph (optional):
- `HYGRAPH_ENDPOINT` - Hygraph API endpoint
- `HYGRAPH_TOKEN` - Hygraph API token

If not set, the build will skip Hygraph content fetching automatically.

## Build Process

1. Root dependencies installed (if using bun, faster than npm)
2. Navigate to `classic` directory
3. Install dependencies with `npm ci` (skipped if `node_modules` exists)
4. Run prebuild (fetch content if configured)
5. Build Docusaurus site

## Troubleshooting

### Build Timeout
If build still times out:
1. Check Cloudflare Pages build logs for specific bottlenecks
2. Consider reducing the number of documentation pages
3. Review and optimize large images/assets
4. Consider using Cloudflare Workers for longer build times
5. Split build into multiple stages if possible

### "Must specify a project name" Error
If you see the error `✘ [ERROR] Must specify a project name.` or `Configuration file for Pages projects does not support "build"` during deployment:

**Root Cause:** Cloudflare Pages is trying to execute a custom deploy command (like `npx wrangler pages deploy`) which is not needed and causes conflicts.

**Solution:** Cloudflare Pages deploys automatically after a successful build. Do NOT set a custom deploy command in the Cloudflare Pages dashboard.

1. Go to your Cloudflare Pages project settings
2. Navigate to "Builds & deployments" section
3. **Remove any custom deploy command** (leave it completely empty/blank)
4. Ensure only these settings are configured:
   - **Build command**: `npm run build`
   - **Build output directory**: `classic/build`
   - **Root directory**: `.` (root of repository)
   - **Node version**: 18 or higher
   - **Deploy command**: (leave empty/blank - this is critical!)

The `wrangler.toml` file has been configured with `pages_build_output_dir = "classic/build"` in Pages-compatible format. Cloudflare Pages will use this automatically. You do NOT need to manually run `wrangler pages deploy` or any other deploy command.

