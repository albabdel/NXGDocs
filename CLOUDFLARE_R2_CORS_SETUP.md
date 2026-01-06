# Cloudflare R2 CORS Configuration Guide

## Problem
Videos are not loading on your Cloudflare site because the R2 bucket doesn't have a CORS (Cross-Origin Resource Sharing) policy configured. Browsers block cross-origin requests to R2 without proper CORS headers.

## Solution

You need to configure a CORS policy in your Cloudflare R2 bucket settings. Here's how:

### Step 1: Access R2 CORS Settings

1. Log in to your Cloudflare dashboard
2. Navigate to **R2** → **Object Storage**
3. Click on your bucket named **"sprint"**
4. Go to the **Settings** tab
5. Scroll down to the **CORS Policy** section

### Step 2: Configure CORS Policy

Click **"Add CORS Policy"** or **"Configure CORS Policy"** and add the following JSON configuration:

```json
[
  {
    "AllowedOrigins": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type",
      "Date",
      "Last-Modified"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Step 3: Production Configuration (Recommended)

For production, replace `"*"` in `AllowedOrigins` with your specific domain(s):

```json
[
  {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      "https://docs.yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type",
      "Date",
      "Last-Modified"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**Replace `yourdomain.com` with your actual domain(s).**

### Step 4: Save and Test

1. Click **Save** or **Update** to apply the CORS policy
2. Wait a few minutes for the changes to propagate
3. Refresh your website and test video playback

## What This Does

- **AllowedOrigins**: Specifies which domains can access your R2 bucket
  - `"*"` allows all domains (use only for development)
  - Specific domains are recommended for production

- **AllowedMethods**: HTTP methods allowed (GET and HEAD for video streaming)

- **AllowedHeaders**: Headers the browser can send with requests

- **ExposeHeaders**: Headers the browser can read from responses

- **MaxAgeSeconds**: How long browsers cache the CORS policy (1 hour = 3600 seconds)

## Additional Notes

1. **Public Development URL**: The URL `https://pub-a6c619a3e7a54e46ad6394ac2d72a48d.r2.dev` is rate-limited and not recommended for production. Consider setting up a custom domain for your R2 bucket.

2. **Custom Domain Setup**: For production, you should:
   - Set up a custom domain for your R2 bucket
   - Update the CORS policy to include your custom domain
   - Update video URLs in your code to use the custom domain

3. **Code Changes**: The code has been updated to include `crossOrigin="anonymous"` on all video elements, which is required for proper CORS handling.

## Troubleshooting

If videos still don't load after configuring CORS:

1. **Clear browser cache** - CORS policies are cached
2. **Check browser console** - Look for CORS error messages
3. **Verify the CORS policy** - Make sure it's saved correctly in Cloudflare
4. **Wait for propagation** - Changes can take a few minutes to take effect
5. **Test with curl** - Use `curl -I -H "Origin: https://yourdomain.com" https://pub-a6c619a3e7a54e46ad6394ac2d72a48d.r2.dev/sprint/test.mp4` to check CORS headers

## Current Video URLs

Your videos are currently using:
- Base URL: `https://pub-a6c619a3e7a54e46ad6394ac2d72a48d.r2.dev/sprint/`
- Example: `https://pub-a6c619a3e7a54e46ad6394ac2d72a48d.r2.dev/sprint/Salvo%20Operator%20Controls.mp4`

After setting up a custom domain, you'll need to update these URLs in:
- `classic/src/pages/internal-releases/sprint-2025-12-b.tsx`
- `classic/src/pages/internal-releases/sprint-2026-01-a.tsx`
- Any other files that reference R2 video URLs

