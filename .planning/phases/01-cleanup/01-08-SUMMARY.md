---
plan: 01-08
phase: 01-cleanup
status: complete
gap_closure: true
completed: 2026-03-07
commit: 2ee0354
---

# Plan 01-08 Summary — VoCWidget Cloudflare Pages Function (Gap Closure)

## What Was Done

Deleted two legacy function files that remained after Plan 06, created a Cloudflare Pages Function for VoCWidget, and wired VoCModal to the new endpoint. VoC survey submissions were silently returning 404 on Cloudflare Pages — this plan restores full functionality.

## Files Changed

| File | Action |
|------|--------|
| `classic/api/feedback.ts` | Deleted — Vercel Edge Function with removed `@vercel/node` and `nodemailer` dependencies |
| `netlify/functions/storyblok-to-gitlab.mjs` | Deleted — dead Netlify webhook for Storyblok (fully removed from project) |
| `classic/functions/voc-feedback.ts` | Created — Cloudflare Pages Function using ZeptoMail HTTP API via `fetch()` |
| `classic/src/components/VoCWidget/VoCModal.tsx` | Updated — production URL changed from `/api/feedback` to `/functions/voc-feedback` |

## voc-feedback.ts Implementation

- Follows the same pattern as `classic/functions/page-feedback.ts`
- Accepts `FeedbackPayload` (feature / bug / integration types)
- Validates required fields (`title`, `type`)
- Formats HTML email body via `formatEmailBody()` (copied from old Vercel function)
- Handles `attachment` (single base64 image) and `supporting_documents` arrays
- Strips `data:image/...;base64,` prefix from base64 data before sending to ZeptoMail
- Uses existing `ZEPTO_API_KEY` env var — no new env vars required
- Exports `onRequestPost` and `onRequestOptions` (CORS preflight)

## Verification

- **Dead files confirmed absent**: `classic/api/` and `netlify/functions/` directories both gone
- **VoCModal URL updated**: grep confirms `/functions/voc-feedback` in VoCModal.tsx
- **Build result**: `[SUCCESS] Generated static files` — exit 0

## Manual Verification Required

VoCWidget email delivery must be tested on a live Cloudflare Pages deployment with `ZEPTO_API_KEY` configured. The function cannot be tested in a local `npm run build` — it requires the Cloudflare Workers runtime.

## Gap Closed

**SC#6 / INTG-03**: "No Netlify or Vercel function files remain" — now fully satisfied.
- PageFeedback widget → `/functions/page-feedback` ✓ (Plan 06)
- VoCWidget → `/functions/voc-feedback` ✓ (this plan)
- No Vercel or Netlify function files remain in the repository ✓
