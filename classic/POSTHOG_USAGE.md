# PostHog Analytics Integration

PostHog is integrated using the **official Docusaurus plugin** (`posthog-docusaurus`).

## Configuration

### docusaurus.config.ts

```typescript
['posthog-docusaurus', {
  apiKey: 'phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS',
  appUrl: 'https://us.i.posthog.com',
  enableInDevelopment: true,
  autocapture: true,
  capture_pageview: true,
  capture_pageleave: true,
  person_profiles: 'identified_only',
  session_recording: {
    maskAllInputs: true,
    maskInputOptions: {
      password: true,   // Always mask passwords
      email: false,     // Capture emails for user identification
      text: false,      // Capture text inputs
    },
    maskTextSelector: '.sensitive-content, .ph-no-capture',
    recordBlockSelector: '.ph-no-capture',
    recordCanvas: false,
  },
  enable_recording_console_log: true,
}],
```

### Session Recording Features

| Setting | Value | Purpose |
|---------|-------|---------|
| `maskAllInputs` | `true` | Mask all input fields by default |
| `maskInputOptions.password` | `true` | Always mask password fields |
| `maskInputOptions.email` | `false` | Capture emails for analytics |
| `maskInputOptions.text` | `false` | Capture text for search analytics |
| `maskTextSelector` | `.sensitive-content, .ph-no-capture` | CSS selector for elements to mask |
| `recordBlockSelector` | `.ph-no-capture` | Elements to completely exclude |
| `recordCanvas` | `false` | Don't record canvas elements |
| `enable_recording_console_log` | `true` | Capture console logs for debugging |

### Credentials

| Key | Value |
|-----|-------|
| **Project Token** | `phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS` |
| **Project ID** | 365239 |
| **Host** | `https://us.i.posthog.com` |
| **Dashboard** | https://us.posthog.com/project/365239 |
| **Session Replay** | https://us.posthog.com/replay |

---

## Usage

### 1. Track Custom Events

```tsx
import { usePostHog, EVENT_NAMES } from '../hooks/usePostHog';

function MyComponent() {
  const { capture } = usePostHog();

  const handleClick = () => {
    capture(EVENT_NAMES.PDF_DOWNLOADED, {
      document_id: 'doc-123',
    });
  };

  return <button onClick={handleClick}>Download</button>;
}
```

### 2. Identify Users

```tsx
import { usePostHog } from '../hooks/usePostHog';

function LoginPage() {
  const { identify } = usePostHog();

  const handleLogin = (user) => {
    identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### 3. Feature Flags

```tsx
import { useFeatureFlag } from '../hooks/usePostHog';

function MyComponent() {
  const { isEnabled, variant } = useFeatureFlag('new_feature');

  if (!isEnabled) return <div>Old Feature</div>;
  return <div>New Feature ({variant})</div>;
}
```

### 4. Session Recording Controls

```tsx
import { usePostHog } from '../hooks/usePostHog';

function MyComponent() {
  const { posthog } = usePostHog();

  // Check if recording is active
  const isRecording = posthog?.sessionRecordingStarted?.();

  // Get replay URL
  const replayUrl = posthog?.get_session_replay_url?.();

  // Start/stop recording manually
  posthog?.startSessionRecording?.();
  posthog?.stopSessionRecording?.();
}
```

### 5. Exclude Elements from Recording

Add `class="ph-no-capture"` to any HTML element to exclude it from session recording:

```html
<div class="ph-no-capture">
  This content won't be recorded
</div>

<div class="sensitive-content">
  This will be masked in recordings
</div>
```

---

## Verification

### 1. Check Network Requests
1. Open DevTools → Network tab
2. Filter for `posthog` or `us.i.posthog.com`
3. Look for requests to `/e` (events) and `/ses/` (session recording)

### 2. Debug Mode
Add `?__posthog_debug=true` to URL or run in console:
```javascript
window.posthog.debug(true);
```

### 3. Check Session Recording
```javascript
// In browser console
window.posthog.sessionRecordingStarted()  // Returns true/false
window.posthog.get_session_replay_url()   // Returns replay URL
```

### 4. Check Dashboard
- **Events**: https://us.posthog.com/project/365239/events
- **Session Replay**: https://us.posthog.com/replay
- **Feature Flags**: https://us.posthog.com/feature_flags

---

## Troubleshooting

### Events Not Appearing?
1. Check Network tab for requests to `us.i.posthog.com/e`
2. Disable ad blockers (PostHog can be blocked)
3. Enable debug mode: `?__posthog_debug=true`
4. Check console for PostHog errors
5. Verify token starts with `phc_` (not `phx_`)

### Session Recording Not Working?
1. Interact for 10+ seconds (minimum duration)
2. Check `sessionRecordingStarted()` returns `true`
3. Look for `/ses/` network requests
4. Check PostHog Replay dashboard

### Ad Blockers
For production, set up a reverse proxy:
- [Managed reverse proxy](https://posthog.com/docs/advanced/proxy/managed-reverse-proxy)
- [Cloudflare proxy](https://posthog.com/docs/advanced/proxy/cloudflare)

---

## Available Event Names

```typescript
EVENT_NAMES = {
  PAGE_VIEW: 'page_view',
  DOC_VIEW: 'doc_view',
  SEARCH_QUERY: 'search_query',
  SEARCH_RESULT_CLICK: 'search_result_click',
  SIDEBAR_CLICK: 'sidebar_click',
  NAV_CLICK: 'nav_click',
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  PDF_DOWNLOADED: 'pdf_downloaded',
  THEME_CHANGED: 'theme_changed',
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  ERROR_OCCURRED: 'error_occurred',
  TICKET_CREATED: 'ticket_created',
  RELEASE_VIEWED: 'release_viewed',
}
```
