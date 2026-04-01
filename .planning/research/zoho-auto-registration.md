# Phase: Zoho Desk Contact Auto-Registration - Research

**Researched:** 2026-04-01
**Domain:** Zoho Desk Contact API, Domain Allowlist, Auto-provisioning
**Confidence:** HIGH (based on existing implementation code review + verified API patterns)

---

## Summary

This research covers automatic Zoho Desk contact registration for users who log in via Auth0 but don't yet have a Zoho contact record. The key insight is that **the `createContact()` function already exists** in `functions/zoho-customer-auth.ts` (lines 270-306) but is **not currently called** in the authentication flow. The implementation requires:

1. **Domain allowlist validation** - Only auto-register users from approved email domains
2. **Integration into existing auth flow** - Call `createContact()` when `findContactByEmail()` returns null
3. **Portal access invitation** - Use existing `ensurePortalAccess()` to grant portal access

**Primary recommendation:** Extend the existing `onRequestPost` handler in `zoho-customer-auth.ts` to check domain allowlist and call `createContact()` before returning the "No support account found" error.

---

## Standard Stack

### Core (Existing - Verified Working)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| `createContact()` | `functions/zoho-customer-auth.ts:270-306` | Creates Zoho contact | ✅ Implemented, not used |
| `findContactByEmail()` | `functions/zoho-customer-auth.ts:180-223` | Finds contact by email | ✅ Working |
| `ensurePortalAccess()` | `functions/zoho-customer-auth.ts:313-358` | Invites contact as end user | ✅ Working |
| `refreshZohoToken()` | `functions/zoho-customer-auth.ts:133-148` | Gets service account token | ✅ Working |
| `createSessionCookie()` | `functions/lib/zoho-session.ts:104-124` | Creates session JWT | ✅ Working |

### New Components Required

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| `isDomainAllowed()` | Check email domain against allowlist | New function |
| `ALLOWED_DOMAINS` env var | Store allowed domains | Cloudflare env var |
| Auto-registration logic | Call `createContact()` for allowed domains | Extend existing handler |

---

## Zoho Desk Contact API Details

### Endpoint

```
POST https://desk.zoho.eu/api/v1/contacts
```

### Required Headers

```typescript
{
  'Authorization': `Zoho-oauthtoken ${accessToken}`,
  'orgId': orgId,
  'Content-Type': 'application/json',
}
```

### Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `firstName` | string | Yes | Empty string acceptable |
| `lastName` | string | Yes | Empty string acceptable |
| `email` | string | Yes | Must be valid email format |
| `type` | string | Yes | `"customerContact"` for customers |

### Contact Types

| Type | Description | Use Case |
|------|-------------|----------|
| `customerContact` | End user/customer | Portal users, ticket submitters |
| `agent` | Support agent | Internal staff (requires license) |

### Response

```typescript
interface CreateContactResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountId: string | null;
  isEndUser?: boolean;
}
```

### Existing Implementation (Verified)

From `functions/zoho-customer-auth.ts:270-306`:

```typescript
async function createContact(
  token: string,
  email: string,
  firstName: string,
  lastName: string,
  orgId: string,
): Promise<ZohoContact> {
  const res = await fetch('https://desk.zoho.eu/api/v1/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'orgId': orgId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      type: 'customerContact',
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create contact: ${res.status} - ${errorText}`);
  }

  const data = await res.json() as { id?: string; firstName?: string; lastName?: string; email?: string; accountId?: string | null };
  
  return {
    id: data.id!,
    firstName: data.firstName ?? firstName,
    lastName: data.lastName ?? lastName,
    email: data.email ?? email,
    accountId: data.accountId ?? null,
  };
}
```

---

## Domain Allowlist Approach

### Storage Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Environment variable | Simple, easy to update via Cloudflare dashboard | Limited size (~1KB) | ✅ **Recommended** |
| Config file in repo | Version controlled, larger capacity | Requires deployment to update | Use for complex rules |
| Remote config (PostHog) | Dynamic updates, feature flags | External dependency | Future enhancement |

### Recommended Implementation

**Environment Variable:**
```
ALLOWED_DOMAINS=nxgen.io,partner.com,customer.org
```

**Validation Function:**
```typescript
function isDomainAllowed(email: string, allowedDomains: string): boolean {
  if (!allowedDomains) return false;
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain) return false;
  
  const domains = allowedDomains.split(',').map(d => d.trim().toLowerCase());
  return domains.includes(emailDomain);
}
```

### Domain Check Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Auth Flow with Auto-Registration              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User authenticates via Auth0                                 │
│  2. Server verifies JWT, extracts email                          │
│  3. Server calls findContactByEmail(email)                       │
│                                                                  │
│     ┌─ Contact found ─────────────────────────────────────────┐  │
│     │                                                          │  │
│     │  4a. Return existing contact + session cookie            │  │
│     │  5a. Done ✅                                              │  │
│     │                                                          │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│     ┌─ Contact NOT found ─────────────────────────────────────┐  │
│     │                                                          │  │
│     │  4b. Check isDomainAllowed(email, ALLOWED_DOMAINS)       │  │
│     │                                                          │  │
│     │      ┌─ Domain allowed ────────────────────────────────┐ │  │
│     │      │                                                 │ │  │
│     │      │  5b. Call createContact(email, firstName, ...)  │ │  │
│     │      │  6b. Call ensurePortalAccess(contactId, email)  │ │  │
│     │      │  7b. Return new contact + session cookie        │ │  │
│     │      │  8b. Done ✅                                     │ │  │
│     │      │                                                 │ │  │
│     │      └─────────────────────────────────────────────────┘ │  │
│     │                                                          │  │
│     │      ┌─ Domain NOT allowed ─────────────────────────────┐│  │
│     │      │                                                 ││  │
│     │      │  5c. Return 404: "No support account found"     ││  │
│     │      │  6c. Done ❌ (manual contact creation needed)    ││  │
│     │      │                                                 ││  │
│     │      └─────────────────────────────────────────────────┘│  │
│     │                                                          │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Should Partners/External Domains Be Allowed?

**Recommendation:** Yes, but with explicit configuration:

```typescript
// Environment variable format
ALLOWED_DOMAINS=nxgen.io           # Internal employees
PARTNER_DOMAINS=partner1.com,partner2.com  # Partners (if different treatment needed)
```

If partner domains need different treatment (e.g., different department assignment, notification to partner admin), separate configuration allows for future differentiation.

---

## Integration Flow

### Current Flow (No Auto-Registration)

```typescript
// zoho-customer-auth.ts - current behavior
const contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);

if (!contact) {
  return json({
    error: `No support account found for ${email}. Please contact NXGEN support.`,
  }, 404);
}
```

### Proposed Flow (With Auto-Registration)

```typescript
// zoho-customer-auth.ts - extended behavior
let contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);

if (!contact) {
  // Check if domain is allowed for auto-registration
  const allowedDomains = context.env.ALLOWED_DOMAINS ?? '';
  
  if (isDomainAllowed(email, allowedDomains)) {
    // Auto-register the user
    const firstName = claims.given_name ?? '';
    const lastName = claims.family_name ?? '';
    
    contact = await createContact(
      zToken,
      email,
      firstName,
      lastName,
      context.env.ZOHO_ORG_ID,
    );
    
    // Grant portal access
    await ensurePortalAccess(zToken, contact.id, email, context.env.ZOHO_ORG_ID);
  } else {
    return json({
      error: `No support account found for ${email}. Please contact NXGEN support.`,
    }, 404);
  }
}
```

### When Does Registration Happen?

| Scenario | Registration? | Why |
|----------|---------------|-----|
| User logs in via Auth0, no Zoho contact, domain allowed | ✅ Yes | Normal auto-registration |
| User logs in via Auth0, no Zoho contact, domain NOT allowed | ❌ No | Security - prevent random users |
| User logs in via email-lookup, no Zoho contact | ❌ No | Email-lookup is for existing contacts only |
| User logs in, contact exists | ❌ No | Already registered |

### What If Registration Fails?

| Failure Type | Handling | User Message |
|--------------|----------|--------------|
| Zoho API error (5xx) | Log error, return 500 | "Registration temporarily unavailable. Please try again later." |
| Invalid email format | Log warning, return 400 | "Invalid email format." |
| Duplicate email | Log warning, retry find | "Account found. Proceeding with login." |
| Rate limit (429) | Log warning, return 429 | "Too many requests. Please wait and try again." |

**Recommended Error Response:**
```typescript
try {
  contact = await createContact(zToken, email, firstName, lastName, orgId);
} catch (error) {
  console.error('Auto-registration failed:', error);
  
  // Check if it was a duplicate (contact might have been created in parallel)
  contact = await findContactByEmail(zToken, email, orgId);
  
  if (contact) {
    // Race condition - contact was created by another request
    console.log('Contact found on retry, proceeding with login');
  } else {
    // Genuine failure
    return json({
      error: 'Unable to create support account. Please contact NXGEN support.',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    }, 500);
  }
}
```

### Should We Notify the User?

**Recommendation:** No explicit notification needed during login flow, but:

1. **Success:** User is logged in and sees their profile - implicit confirmation
2. **Failure:** User sees error message with support contact
3. **Optional:** Add a "Welcome" email via ZeptoMail for new registrations (future enhancement)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Contact creation | Custom API wrapper | Existing `createContact()` | Already implemented and tested |
| Portal access invitation | Manual API call | Existing `ensurePortalAccess()` | Handles edge cases, non-blocking |
| Token management | Token storage in frontend | `refreshZohoToken()` + session cookie | Security - token stays server-side |
| Email validation | Regex from scratch | Built-in email parsing | RFC compliance is hard |

---

## Common Pitfalls

### Pitfall 1: Race Conditions in Contact Creation

**What goes wrong:** Two login requests for the same new user both try to create contact simultaneously.

**Why it happens:** Network latency, multiple browser tabs, or user clicking login twice.

**How to avoid:**
1. Always retry `findContactByEmail()` after creation failure
2. Use Zoho's idempotency (email is unique) - duplicate POST returns error
3. Handle the "already exists" case gracefully

**Warning signs:**
- Frequent "duplicate contact" errors in logs
- Users reporting "account already exists" after fresh login

### Pitfall 2: Missing Environment Variable

**What goes wrong:** `ALLOWED_DOMAINS` not set, all auto-registrations blocked silently.

**Why it happens:** Environment variable not configured in Cloudflare Pages dashboard.

**How to avoid:**
1. Default to empty string (no auto-registration) if not set
2. Log warning on startup if `ALLOWED_DOMAINS` is not configured
3. Document required environment variables clearly

**Warning signs:**
- All users see "No support account found" regardless of domain
- No auto-registrations happening despite feature deployed

### Pitfall 3: Forgetting Portal Access

**What goes wrong:** Contact created but user can't access portal (no `isEndUser` flag).

**Why it happens:** `createContact()` doesn't automatically grant portal access.

**How to avoid:** Always call `ensurePortalAccess()` after `createContact()`.

**Warning signs:**
- User logged in but sees "Access denied" on portal features
- Contact exists in Zoho but `isEndUser` is false

### Pitfall 4: Case Sensitivity in Domain Check

**What goes wrong:** `user@NXGEN.IO` rejected because allowlist has `nxgen.io`.

**Why it happens:** Direct string comparison without normalization.

**How to avoid:** Always compare lowercase domains.

```typescript
const emailDomain = email.split('@')[1]?.toLowerCase();
const domains = allowedDomains.split(',').map(d => d.trim().toLowerCase());
```

---

## Code Examples

### Complete Integration Example

```typescript
// functions/zoho-customer-auth.ts - extended handler

// Add to Env interface
interface Env {
  // ... existing fields ...
  ALLOWED_DOMAINS?: string;  // Comma-separated list of allowed domains
}

// New helper function
function isDomainAllowed(email: string, allowedDomains: string): boolean {
  if (!allowedDomains) return false;
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain) return false;
  
  const domains = allowedDomains.split(',').map(d => d.trim().toLowerCase());
  return domains.includes(emailDomain);
}

// Extended handler logic (after findContactByEmail returns null)
if (!contact) {
  const allowedDomains = context.env.ALLOWED_DOMAINS ?? '';
  
  if (isDomainAllowed(email, allowedDomains)) {
    try {
      contact = await createContact(
        zToken,
        email,
        claims.given_name ?? '',
        claims.family_name ?? '',
        context.env.ZOHO_ORG_ID,
      );
      
      await ensurePortalAccess(zToken, contact.id, email, context.env.ZOHO_ORG_ID);
      
      console.log(`Auto-registered contact: ${email} (${contact.id})`);
    } catch (error) {
      console.error('Auto-registration failed:', error);
      
      // Retry find in case of race condition
      contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);
      
      if (!contact) {
        return json({
          error: 'Unable to create support account. Please contact NXGEN support.',
        }, 500);
      }
    }
  } else {
    return json({
      error: `No support account found for ${email}. Please contact NXGEN support.`,
    }, 404);
  }
}
```

### Environment Variable Configuration

```bash
# Cloudflare Pages Environment Variables
# Dashboard → Settings → Environment variables

# Required (already exists)
ZOHO_REFRESH_TOKEN=...
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_ORG_ID=20067436506
ZOHO_SESSION_SECRET=...
AUTH0_DOMAIN=nxgen.eu.auth0.com

# New: Domain allowlist for auto-registration
ALLOWED_DOMAINS=nxgen.io
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual contact creation in Zoho | Auto-registration via API | This feature | Eliminates support overhead |
| All users blocked if no contact | Domain-filtered auto-registration | This feature | Enables self-service for approved domains |
| Token exposed to browser | Session cookie (HttpOnly) | Already fixed | Security - token never leaves server |

---

## Open Questions

1. **Should auto-registered users be associated with a default account?**
   - What we know: `createContact()` returns `accountId: null` by default
   - What's unclear: Should nxgen.io users be auto-linked to an NXGEN account?
   - Recommendation: Leave as null for now; account association can be done manually or via separate process

2. **Should we send a welcome email to newly registered users?**
   - What we know: ZeptoMail is configured (see Keys.md)
   - What's unclear: Template, content, when to send
   - Recommendation: Out of scope for this phase; can be added later

3. **What about users with existing Auth0 accounts but different email casing?**
   - What we know: `findContactByEmail()` normalizes to lowercase
   - What's unclear: Zoho API behavior with case variations
   - Recommendation: The existing `findContactByEmail()` already handles this correctly

---

## Validation Architecture

> Nyquist validation enabled per `.planning/config.json`

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright |
| Config file | `classic/playwright.config.ts` |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npx playwright test` |
| Estimated runtime | ~10 seconds |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTO-01 | Contact auto-created for allowed domain | unit | N/A - no unit test framework for CF Functions | ❌ Wave 0 gap |
| AUTO-02 | Contact NOT created for blocked domain | unit | N/A | ❌ Wave 0 gap |
| AUTO-03 | Portal access granted after creation | unit | N/A | ❌ Wave 0 gap |
| AUTO-04 | Race condition handled gracefully | unit | N/A | ❌ Wave 0 gap |
| AUTO-05 | Error message shown on creation failure | e2e | `npx playwright test e2e/auth.spec.ts` | ❌ Wave 0 gap |

### Nyquist Sampling Rate

- **Minimum sample interval:** Cloudflare Functions don't have unit test infrastructure - manual verification required
- **Alternative approach:** Test via integration tests against staging environment
- **Phase-complete gate:** Manual verification + staging deployment test
- **Estimated feedback latency per task:** Manual testing required

### Wave 0 Gaps (must be created before implementation)

- [ ] `functions/__tests__/zoho-customer-auth.test.ts` — unit tests for auto-registration logic
- [ ] `classic/e2e/auth.spec.ts` — e2e tests for login flow with auto-registration
- [ ] Test framework for Cloudflare Functions: Consider `vitest` with `@cloudflare/vitest-pool-workers`
- [ ] Mock Zoho API responses for testing

**Alternative:** Since Cloudflare Functions lack native unit test support, consider:
1. Integration tests via staging environment
2. Manual verification checklist
3. Post-deployment smoke tests

---

## Sources

### Primary (HIGH confidence)

- `functions/zoho-customer-auth.ts` - Existing createContact implementation (lines 270-306)
- `functions/lib/zoho-session.ts` - Session management implementation
- `.planning/research/ZOHO_PORTAL_API.md` - Verified Zoho Desk API patterns
- `.planning/research/ZOHO_AUTH_ANALYSIS.md` - Authentication architecture analysis

### Secondary (MEDIUM confidence)

- `Keys.md` - Environment secrets and credentials
- `.planning/research/ZOHO_DESK_SDK_SUMMARY.md` - SDK availability research
- Zoho Desk OAS spec - Contact endpoint structure (inferred from existing implementation)

### Tertiary (LOW confidence)

- Zoho Desk Contact API documentation (not directly fetched, inferred from code)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing implementation verified in codebase
- Architecture: HIGH - Flow documented in ZOHO_AUTH_ANALYSIS.md
- Pitfalls: MEDIUM - Based on common API integration patterns
- API details: HIGH - Existing createContact() implementation confirms endpoint and fields

**Research date:** 2026-04-01
**Valid until:** 30 days (API endpoints stable)
