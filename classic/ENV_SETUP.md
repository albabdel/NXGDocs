# Environment Variables Setup

## Required Variables

| Variable | Value | Source |
|----------|-------|--------|
| `SANITY_PROJECT_ID` | `fjjuacab` | Fixed |
| `SANITY_API_TOKEN` | `xxx` | Sanity project settings > API > Tokens |
| `SANITY_DATASET` | `production` | Fixed |

## Cloudflare Pages Setup

1. Go to your Pages project
2. Navigate to **Settings** > **Environment variables**
3. Add each variable for both **Production** and **Preview** environments

## Without These Variables

- Build falls back to empty/mock data
- Releases page won't display real content
