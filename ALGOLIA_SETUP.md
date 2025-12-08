# Algolia DocSearch Setup Guide

## Current Status
✅ Algolia credentials received  
⏳ Waiting for site to go live  
⏳ Crawler configuration pending

## Setup Steps

### 1. Configure Environment Variables

Edit `classic/.env` and replace with your actual credentials:

```bash
ALGOLIA_APP_ID=your_actual_app_id
ALGOLIA_API_KEY=your_actual_search_api_key
ALGOLIA_INDEX_NAME=nxgen_docs
```

### 2. Deploy Your Site

Algolia crawler needs a live URL. Deploy to production:

```bash
cd classic
npm run build
# Deploy to your hosting (Vercel, Netlify, AWS, etc.)
```

### 3. Configure Algolia Crawler

Once your site is live:

1. Go to [Algolia Crawler Dashboard](https://crawler.algolia.com/)
2. Create a new crawler
3. Use the configuration from `algolia-config.json`
4. Set your live URL (e.g., `https://docs.nxgen.cloud`)
5. Run the crawler manually first to test

### 4. Test the Search

After crawler runs:
- Visit your site
- Use the search bar (Cmd/Ctrl + K)
- Search should now use Algolia

## Crawler Schedule

Set up automatic crawling:
- **Recommended**: Weekly (every Monday at 2 AM)
- **Alternative**: After each deployment (via webhook)

## Troubleshooting

### Search Not Working
- Check browser console for API errors
- Verify credentials in `.env`
- Ensure crawler has run at least once
- Check index has documents in Algolia dashboard

### No Results Found
- Verify sitemap.xml is accessible
- Check crawler logs in Algolia dashboard
- Ensure selectors match your HTML structure

### Rate Limits
- Free tier: 10,000 searches/month
- Upgrade if needed at [Algolia Pricing](https://www.algolia.com/pricing/)

## Monitoring

Check Algolia dashboard for:
- Search analytics
- Popular queries
- Failed searches
- Index size and document count
