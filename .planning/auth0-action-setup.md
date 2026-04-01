# Auth0 Post-Login Action Setup Guide

This guide walks you through configuring the Auth0 Post-Login Action that adds custom claims to JWT tokens for Supabase RLS and role-based access control.

## What This Action Does

The `add-custom-claims.js` action adds the following claims to both ID tokens and access tokens:

| Claim | Purpose | Example Value |
|-------|---------|---------------|
| `role` | Supabase RLS requirement | `"authenticated"` |
| `email` | User identification | `user@example.com` |
| `name` | Display name | `John Doe` |
| `https://docs.nxgen.cloud/role` | App-specific role | `admin`, `operator`, `manager`, `user` |
| `https://docs.nxgen.cloud/orgId` | Organization ID | `org_123` |
| `https://docs.nxgen.cloud/preferences` | User preferences | `{ theme: "dark" }` |

## Step-by-Step Setup

### Step 1: Create the Action in Auth0 Dashboard

1. Go to **https://manage.auth0.com/**
2. Navigate to **Actions** → **Library** in the left sidebar
3. Click **Create Action** button
4. Fill in the form:
   - **Name:** `Add Custom Claims for Docs`
   - **Trigger:** Select **Post User Login**
   - **Runtime:** Node.js 18 (or latest available)
5. Click **Create**

### Step 2: Add the Action Code

1. In the code editor, delete any template code
2. Copy the entire contents of `.auth0/actions/add-custom-claims.js`
3. Paste into the Auth0 code editor
4. Click **Save Draft**

### Step 3: Deploy the Action

1. Click **Deploy** in the top-right corner
2. Wait for the deployment to complete (should take a few seconds)
3. You should see a green "Deployed" status

### Step 4: Add Action to Login Flow

1. Go to **Flows** → **Login** in the left sidebar
2. You'll see a visual flow diagram
3. Click **Add Action** in the left panel
4. Select **Custom** tab
5. Find "Add Custom Claims for Docs" and drag it between **Start** and **Complete**
6. Click **Apply** in the top-right

### Step 5: Configure Application Settings

1. Go to **Applications** → **Applications**
2. Find your `docs-portal` application (or create one if needed)
3. Click on it to open settings
4. Under **Application URIs**, add:
   - **Allowed Callback URLs:** `https://docs.nxgen.cloud/auth/callback`
   - **Allowed Logout URLs:** `https://docs.nxgen.cloud`
   - **Allowed Web Origins:** `https://docs.nxgen.cloud`
5. Click **Save Changes**

## Testing the Action

### Method 1: Auth0 Dashboard Test

1. Go to **Actions** → **Library** → "Add Custom Claims for Docs"
2. Click the **Test** tab
3. Click **Run Test**
4. Verify the output shows:
   ```
   Added custom claims for user: [test email]
   Role: user
   ```
5. Check that no errors appear

### Method 2: Real Login Test

1. Login to docs.nxgen.cloud
2. Open browser developer console (F12)
3. Go to Application → Local Storage
4. Find `auth0_id_token` or similar
5. Copy the token value
6. Go to https://jwt.io
7. Paste the token in the decoder
8. Verify the payload contains:
   ```json
   {
     "role": "authenticated",
     "email": "your@email.com",
     "https://docs.nxgen.cloud/role": "user"
   }
   ```

### Method 3: Browser Console Check

After logging in, run this in the browser console:

```javascript
// Get the ID token from local storage
const tokenKey = Object.keys(localStorage).find(k => k.includes('id_token'));
if (tokenKey) {
  const token = localStorage.getItem(tokenKey);
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('JWT Claims:', JSON.stringify(payload, null, 2));
  
  // Check for required claims
  console.log('Has role claim:', 'role' in payload);
  console.log('Has namespace role:', 'https://docs.nxgen.cloud/role' in payload);
  console.log('Has email:', 'email' in payload);
}
```

## Setting User Roles

User roles are read from `app_metadata.role` in Auth0. To set a user's role:

### Via Auth0 Dashboard

1. Go to **User Management** → **Users**
2. Click on a user
3. Scroll to **Metadata** section
4. In `app_metadata`, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Click **Save**

### Via Management API

```bash
curl -X PATCH "https://nxgen.eu.auth0.com/api/v2/users/USER_ID" \
  -H "Authorization: Bearer YOUR_MANAGEMENT_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata": {"role": "admin"}}'
```

### Available Roles

| Role | Access Level |
|------|--------------|
| `admin` | Full access to all content and admin features |
| `operator` | Operational features, limited admin |
| `manager` | Team management, reporting |
| `user` | Standard authenticated user (default) |

## Troubleshooting

### Claims Not Appearing in Token

**Check:**
1. Is the action deployed? (Actions → Library → Check status)
2. Is the action in the Login flow? (Flows → Login → Look for action)
3. Did you log out and log back in? (Old sessions won't have new claims)
4. Check Real-time Logs: Monitoring → Logs for errors

### Action Not Running

**Check:**
1. Go to Flows → Login
2. Verify the action appears in the flow diagram
3. Make sure it's between Start and Complete
4. Click Apply if you just added it

### "Insufficient scope" Error

This error means the Management API token doesn't have the right permissions. Generate a new token with `update:users` scope.

### Token Too Large

If you add too many custom claims, the token may exceed size limits. Keep claims minimal and only include essential data.

## Environment Variables Reference

For Cloudflare Pages deployment, ensure these are set:

| Variable | Where to Set | Value |
|----------|--------------|-------|
| `AUTH0_DOMAIN` | wrangler.toml [vars] | `nxgen.eu.auth0.com` |
| `AUTH0_CLIENT_ID` | Cloudflare Dashboard | From Auth0 Application |
| `AUTH0_CLIENT_SECRET` | Cloudflare Dashboard (secret) | From Auth0 Application |
| `SESSION_SECRET` | Cloudflare Dashboard (secret) | 32+ char random string |

## Related Files

- `.auth0/actions/add-custom-claims.js` - The action code
- `functions/lib/auth-session.ts` - Server-side session validation
- `classic/src/hooks/useAuthSession.ts` - Client-side auth hook

## Next Steps

After configuring this action:

1. Verify JWT claims appear in token
2. Test login flow end-to-end
3. Configure Supabase RLS policies (Phase 31)
4. Set up role-based content visibility (Phase 35)

---

*Last updated: 2026-04-01*
*Phase: 30-auth-foundation*
