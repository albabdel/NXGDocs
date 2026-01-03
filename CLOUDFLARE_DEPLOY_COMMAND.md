# Cloudflare Pages Deploy Command Configuration

## Current Deploy Command
```
npx wrangler pages deploy classic/build
```

## Recommended Deploy Command (with explicit project)
```
npx wrangler pages deploy classic/build --project-name=nxgen
```

## Alternative: Use wrangler.toml (Current Setup)
Your `wrangler.toml` already has:
```toml
name = "nxgen"
pages_build_output_dir = "classic/build"
```

So the deploy command should work, but you need to ensure:
1. ✅ API token has correct permissions (see FIX_CLOUDFLARE_API_TOKEN.md)
2. ✅ Project name in Cloudflare Pages dashboard matches "nxgen"
3. ✅ API token has access to the correct account

## Updated Deploy Command (if needed)
If you want to be explicit, use:
```
npx wrangler pages deploy classic/build --project-name=nxgen --account-id=ff9df0a2daf8c9eb1032f67dd551c784
```

But the simpler command should work once API token permissions are fixed.

