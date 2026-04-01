# Research: Sanity Studio Embedded Editor

**Researched:** 2026-04-01
**Domain:** CMS integration, live content editing
**Confidence:** HIGH (official documentation, direct codebase inspection)

---

## Summary

This research investigates whether Sanity Studio can be embedded inside the Docusaurus site (docs.nxgen.cloud) to enable live content editing without switching to a separate dashboard.

**Primary finding:** Sanity Studio **CAN** be embedded as a React component, but Docusaurus's static-site architecture creates significant technical challenges. The recommended approach is **Option B: Authenticated iframe with dedicated Studio deployment**, which balances implementation effort with functionality.

**Key insight:** The `next-sanity` package provides the best developer experience for embedding Studio (Next.js App Router), but Docusaurus lacks equivalent tooling. Custom integration would require substantial effort with routing, authentication, and styling conflicts.

---

## Option A: Direct React Component Embedding

### What It Is

Sanity Studio is distributed as a React component via the `sanity` npm package. The `<Studio />` component can be mounted in any React application:

```tsx
// From official Sanity docs
import { defineConfig, Studio } from "sanity";

const config = defineConfig({
  projectId: "your_project_id",
  dataset: "your_dataset",
  basePath: "/studio"  // Route where Studio is mounted
});

export default function StudioRoute() {
  return <Studio config={config} />
}
```

### Technical Feasibility for Docusaurus

| Aspect | Status | Details |
|--------|--------|---------|
| React compatibility | ✅ Compatible | Both Docusaurus and Sanity Studio are React-based |
| Routing | ⚠️ Complex | Docusaurus uses file-based routing; Studio needs catch-all route for its sub-paths |
| Authentication | ⚠️ Requires CORS | Must add docs.nxgen.cloud to Sanity CORS origins |
| Styling | ⚠️ Conflicts | Studio requires full viewport; Docusaurus has its own layout |
| SSR/Hydration | ⚠️ Client-only | Studio cannot be server-rendered; needs `'use client'` equivalent |

### Implementation Challenges

**1. Routing Conflict**

Docusaurus doesn't support catch-all routes natively. Next.js has `[[...tool]]` optional catch-all segments for this purpose, but Docusaurus lacks equivalent functionality.

**Workaround:** Create a standalone React page at `/studio/index.html` that's excluded from Docusaurus routing, similar to how static pages work. This requires custom webpack configuration or Cloudflare Pages rewrite rules.

**2. Hydration Issues**

Sanity Studio is a client-side application. Docusaurus uses server-side rendering (SSR) followed by hydration. The Studio component cannot be server-rendered.

**Workaround:** Use dynamic import with `ssr: false`:
```tsx
// In a custom page component
const Studio = React.lazy(() => import('sanity').then(m => ({ default: m.Studio })));

export default function StudioPage() {
  return (
    <React.Suspense fallback={<div>Loading Studio...</div>}>
      <Studio config={studioConfig} />
    </React.Suspense>
  );
}
```

**3. CSS Conflicts**

Studio expects to occupy the full viewport (100vh) with its own styling system (styled-components). Docusaurus wraps content in layout components that would interfere.

**Workaround:** Swizzle a minimal layout that renders nothing for the Studio route, or use an iframe.

**4. Authentication Complexity**

Sanity requires CORS configuration for authenticated requests. The Studio would need to authenticate users with Sanity's token-based system, which is separate from any existing Auth0 integration.

### Verdict: NOT RECOMMENDED

**Why:** The technical effort to make this work exceeds the benefit. Docusaurus's architecture (static generation, file-based routing, SSR) is fundamentally at odds with Studio's requirements (client-side app, catch-all routing, no SSR support).

---

## Option B: Authenticated iframe with Dedicated Studio Deployment

### What It Is

Deploy Sanity Studio as a separate application (current setup) and embed it via iframe on a Docusaurus page. This is the simplest integration approach.

### Implementation

```tsx
// classic/src/pages/studio.tsx
import React from 'react';
import Layout from '@theme/Layout';

export default function StudioPage() {
  return (
    <Layout title="Content Editor">
      <iframe
        src="https://studio.nxgen.cloud"
        style={{
          width: '100%',
          height: 'calc(100vh - 60px)', // Account for navbar
          border: 'none',
        }}
        allow="clipboard-read; clipboard-write"
      />
    </Layout>
  );
}
```

### Technical Feasibility

| Aspect | Status | Details |
|--------|--------|---------|
| Implementation | ✅ Simple | Single React component with iframe |
| Authentication | ⚠️ Session sharing | Users must authenticate with Studio separately |
| CORS | ✅ Required | Add docs.nxgen.cloud to Studio CORS settings |
| Styling | ✅ Isolated | iframe provides complete isolation |
| Performance | ⚠️ Double load | Both Docusaurus and Studio must load |

### Authentication Flow

The iframe approach requires handling authentication separately:

1. User navigates to docs.nxgen.cloud/studio
2. Docusaurus renders iframe pointing to studio.nxgen.cloud
3. If user not authenticated with Sanity:
   - Studio shows login prompt inside iframe
   - User authenticates with Sanity (OAuth or email/password)
4. Studio loads with user's permissions

**Auth0 Integration Option:** If Sanity is configured to use Auth0 as OAuth provider, the authentication can be shared. However, this requires Sanity project configuration changes.

### Verdict: RECOMMENDED (Phase 1)

**Why:** Simplest implementation with minimal risk. The iframe provides complete isolation, preventing any conflicts with Docusaurus. The main UX drawback is the separate authentication, but this is manageable for admin users who already use Studio.

---

## Option C: Custom Content Editor Using Sanity API

### What It Is

Build a custom React-based content editor that uses Sanity's client API directly instead of embedding the full Studio. This provides more control but requires significant development effort.

### Architecture

```
docs.nxgen.cloud/studio (Custom Editor)
    |
    ├── Document List (custom React component)
    |       └── GROQ: *[_type == "doc"] { title, slug, status }
    |
    ├── Document Editor (custom React component)
    |       ├── PortableText editor
    |       ├── Field components
    |       └── Preview pane
    |
    └── Sanity Client API
            └── PATCH, CREATE, DELETE mutations
```

### Sanity Client for Mutations

```tsx
// Using @sanity/client (already installed)
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN, // Write token required
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for mutations
});

// Create document
await client.create({
  _type: 'doc',
  title: 'New Page',
  slug: { current: 'new-page' },
  status: 'draft',
  body: [], // PortableText array
});

// Update document
await client
  .patch('document-id')
  .set({ title: 'Updated Title' })
  .commit();

// Delete document
await client.delete('document-id');
```

### Required Components

| Component | Effort | Notes |
|-----------|--------|-------|
| Document list view | Medium | GROQ queries, pagination, filtering |
| PortableText editor | High | Use `@sanity/portable-text-editor` or build custom |
| Schema-driven forms | High | Generate form fields from Sanity schema |
| Image upload | Medium | Use Sanity asset API |
| Preview | Medium | Render PortableText to HTML |
| Autosave | Medium | Debounced patches, conflict resolution |

### PortableText Editor Options

**Option 1: `@sanity/portable-text-editor` (Recommended)**

Official Sanity editor component for PortableText:

```tsx
import { PortableTextEditor } from '@sanity/portable-text-editor';

function DocumentEditor({ document }) {
  const [value, setValue] = useState(document.body);
  
  return (
    <PortableTextEditor
      value={value}
      onChange={setValue}
      schemaType={{ type: 'array', of: [{ type: 'block' }] }}
    />
  );
}
```

**Option 2: Third-party editors**

- TipTap with PortableText extension
- Slate.js with custom PortableText serialization

### Effort Estimate

| Scope | Estimated Effort | Risk |
|-------|------------------|------|
| Minimal editor (text only) | 2-3 weeks | Medium |
| Full featured (images, references) | 4-6 weeks | High |
| Studio parity | 8+ weeks | Very High |

### Verdict: NOT RECOMMENDED (for now)

**Why:** The development effort to build a usable content editor exceeds the value. Sanity Studio already provides a full-featured editor. Building a custom editor would require ongoing maintenance and would likely lag behind Studio features.

**Exception:** If the user experience of iframe authentication is unacceptable, a minimal custom editor for simple text edits could be justified. Start with text-only editing and expand as needed.

---

## Option D: Keep Separate Studio (Current Approach)

### What It Is

Continue using Sanity Studio as a completely separate application with no embedding. Users navigate to a different URL to edit content.

### Technical Feasibility

| Aspect | Status | Details |
|--------|--------|---------|
| Implementation | ✅ Already done | Current setup works |
| Authentication | ✅ Separate | Sanity's built-in auth |
| UX | ⚠️ Context switch | Users must switch tabs/apps |
| Maintenance | ✅ Minimal | No custom code to maintain |

### Verdict: ACCEPTABLE (Baseline)

**Why:** This is the zero-effort option. It works reliably with no technical debt. The UX of switching contexts is the only drawback.

---

## Live Preview Considerations

### Can Docusaurus Show Changes Without Rebuild?

**Short answer: No, not natively.**

Docusaurus is a **static site generator**. Content is fetched from Sanity at build time and baked into static HTML/JS files. Changes in Sanity require a rebuild to appear on the site.

### Sanity's Live Content API

Sanity provides real-time content updates through the **Live Content API**:

```tsx
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2021-03-25', // Required for Live API
  useCdn: false,
});

// Listen for document changes
client.listen('*[_type == "doc"]').subscribe(update => {
  console.log('Document changed:', update);
});
```

**Limitation:** This only works for client-side applications. Docusaurus generates static files at build time, so there's no runtime to receive updates.

### Potential Workarounds

**1. Cloudflare Pages On-Demand Revalidation**

Cloudflare Pages supports on-demand revalidation via API, but Docusaurus doesn't integrate with this natively. Would require:
- Custom webhook handler in Cloudflare Functions
- Trigger partial rebuild on Sanity webhook
- Invalidate specific paths

**Complexity:** High. Not recommended.

**2. Client-Side Content Injection (Hybrid)**

Fetch content client-side and inject into static pages:

```tsx
// In a Docusaurus component
useEffect(() => {
  const fetchLatest = async () => {
    const content = await client.fetch('*[_type == "doc"][0]');
    // Update React state with fresh content
  };
  
  // Initial load
  fetchLatest();
  
  // Subscribe to changes
  const sub = client.listen('*[_type == "doc"]').subscribe(fetchLatest);
  return () => sub.unsubscribe();
}, []);
```

**Drawbacks:**
- SEO suffers (content not in static HTML)
- Initial load shows stale content, then updates
- Requires API token exposure (security risk)
- Client must wait for content to load

**Verdict:** Possible for admin-only pages, but not for public documentation.

**3. Preview Mode (Separate Preview Deployment)**

Deploy a separate preview site using Sanity's draft content:

```
docs.nxgen.cloud          → Production (published content only)
preview.nxgen.cloud       → Preview (includes drafts, live updates)
```

**Implementation:**
- Cloudflare Pages project for preview
- Build with `SANITY_INCLUDE_DRAFTS=true`
- Sanity webhook triggers preview rebuild on every change
- Preview site uses Live Content API for real-time updates

**Effort:** Medium. Provides the best UX for editors.

### Recommendation

For true live preview, use **Option 3: Separate preview deployment**. This is how Next.js + Sanity projects typically handle preview mode. For Docusaurus, implement as follows:

1. Create separate Cloudflare Pages project: `preview-docs`
2. Configure build with `SANITY_INCLUDE_DRAFTS=true`
3. Use Sanity webhook to trigger preview builds
4. Optional: Add client-side Live Content API for instant updates

---

## Authentication Implications

### Current Setup

- **Sanity Studio:** Uses Sanity's built-in authentication (OAuth, email/password)
- **Docusaurus:** No authentication (public site)
- **Auth0:** Planned for v5.0 for admin features

### Integration Options

**Option 1: Keep Authentication Separate (Simple)**

- Sanity Studio: Sanity authentication
- Docusaurus embedded Studio: iframe, separate auth session
- No Auth0 integration needed

**Option 2: Shared Auth0 Authentication (Complex)**

Configure Sanity to use Auth0 as OAuth provider:

1. In Auth0: Create Sanity application
2. In Sanity: Configure OAuth provider for Auth0
3. Users authenticate once via Auth0
4. Both Docusaurus and Studio use same session

**Requirements:**
- Sanity project settings: Add Auth0 as OAuth provider
- Auth0: Create application with Sanity callback URLs
- Custom login flow: Auth0 → Sanity token exchange

**Sanity OAuth Configuration:**

```javascript
// Sanity project config (via API or dashboard)
{
  "oauthProvider": {
    "type": "custom",
    "name": "Auth0",
    "authorizeUrl": "https://your-tenant.auth0.com/authorize",
    "tokenUrl": "https://your-tenant.auth0.com/oauth/token",
    "clientId": "your-auth0-client-id",
    "clientSecret": "your-auth0-client-secret",
    "scopes": ["openid", "profile", "email"]
  }
}
```

### Recommendation

**Phase 1:** Keep authentication separate. Admins already use Sanity authentication.

**Phase 2 (if needed):** Integrate Auth0 with Sanity OAuth for single sign-on.

---

## Comparison Summary

| Option | Effort | UX | Auth Complexity | Maintenance |
|--------|--------|-----|-----------------|-------------|
| A: Direct embedding | Very High | Seamless | High | High |
| B: iframe | Low | Good (separate auth) | Low | Low |
| C: Custom editor | Very High | Customizable | Medium | Very High |
| D: Separate Studio | None | Poor (context switch) | None | None |

---

## Recommendation

### Phase 1: Authenticated iframe (Option B)

**Implementation:**

1. Create `classic/src/pages/studio.tsx` with iframe embedding Studio
2. Add `studio.nxgen.cloud` to Sanity CORS origins
3. Update navbar with "Edit Content" link (visible to admins only)
4. Accept separate authentication as acceptable trade-off

**Code Example:**

```tsx
// classic/src/pages/studio.tsx
import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function StudioPage() {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout title="Content Editor" description="Edit documentation content">
      <div style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
        <iframe
          src={siteConfig.customFields?.studioUrl || 'https://studio.nxgen.cloud'}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Sanity Studio"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </Layout>
  );
}
```

### Phase 2: Preview Deployment (Optional)

If live preview is desired:

1. Create `preview.nxgen.cloud` Cloudflare Pages project
2. Configure build with `SANITY_INCLUDE_DRAFTS=true`
3. Set up Sanity webhook for rebuild triggers
4. Add "View Preview" link in Studio

### Phase 3: Auth0 Integration (Future)

If single sign-on is desired:

1. Configure Sanity OAuth provider for Auth0
2. Create Auth0 application for Sanity
3. Implement shared session flow

---

## Sources

### Primary (HIGH confidence)
- [Sanity Embedding Documentation](https://www.sanity.io/docs/embedding-sanity-studio) - Official embedding guide
- [Next.js + Sanity Studio Integration](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs) - Official Next.js embedding
- [Sanity Live Content API](https://www.sanity.io/docs/content-lake/live-content-api) - Real-time updates
- [next-sanity GitHub](https://github.com/sanity-io/next-sanity) - Official toolkit

### Secondary (MEDIUM confidence)
- [Docusaurus Swizzling](https://docusaurus.io/docs/swizzling) - Component customization
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment) - Static site architecture

### Tertiary (Codebase inspection)
- `classic/docusaurus.config.ts` - Project configuration
- `classic/src/theme/Root.tsx` - Provider structure
- `studio/sanity.config.ts` - Current Studio setup
- `.planning/research/STACK.md` - Existing stack research

---

## Metadata

**Confidence breakdown:**
- Embedding options: HIGH - Official documentation
- Docusaurus compatibility: MEDIUM - Inferred from architecture
- Authentication: HIGH - Official docs + codebase inspection
- Live preview: MEDIUM - Sanity docs, Docusaurus limitations

**Research date:** 2026-04-01
**Valid until:** 2026-07-01 (quarterly review recommended)

---

*Research for: Sanity Studio embedded editor feasibility*
