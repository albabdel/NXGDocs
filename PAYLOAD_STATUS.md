# Payload CMS Status

## Current Configuration

- **Port:** 4000
- **Admin Route:** `/payload-admin`
- **API Route:** `/api`
- **Config File:** `payload.config.ts`

## Access URLs

- **Admin Panel:** http://localhost:4000/payload-admin
- **API:** http://localhost:4000/api
- **Health Check:** http://localhost:4000/api/health

## To Start the Server

```bash
cd payload-cms
npm run dev
```

## If Server Won't Start

1. Check terminal for error messages
2. Verify dependencies: `npm install`
3. Check Node version: `node --version` (needs >= 18)
4. Try manual start: `npx tsx src/index.ts`

## Configuration Check

The `payload.config.ts` should have:
```typescript
routes: {
  admin: '/payload-admin',
}
```

This sets the admin route to `/payload-admin` instead of the default `/admin`.

## Next Steps

1. Start the server: `npm run dev`
2. Wait for "Payload CMS running" message
3. Open http://localhost:4000/payload-admin
4. Create your first admin user




