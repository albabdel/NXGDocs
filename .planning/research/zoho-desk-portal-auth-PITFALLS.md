# Domain Pitfalls: Zoho Desk Portal Authentication

**Domain:** Zoho Desk Customer Portal Authentication
**Researched:** 2026-03-16
**Confidence:** MEDIUM

---

## Critical Pitfalls

### Pitfall 1: Using Agent OAuth for Portal User Authentication

**What goes wrong:** Developers generate agent OAuth tokens and use them in a customer-facing portal, assuming it's the "standard Zoho auth method."

**Why it happens:** 
- Zoho's OAuth documentation is prominent for all Zoho products
- Agent OAuth appears simpler than setting up JWT SSO
- Misunderstanding that OAuth is for agents only

**Consequences:**
- Portal users can access ALL tickets in the organization
- Users can potentially modify admin settings (if scopes are too broad)
- Security audit failure
- Data breach liability

**Prevention:**
- NEVER use agent OAuth tokens in customer-facing applications
- Use JWT SSO or native portal login for end-users
- If custom portal needed, build a backend proxy that uses Portal API with session auth

**Detection:**
- Check if `Authorization: Zoho-oauthtoken` header is used in portal frontend
- Audit token scopes - if `Desk.settings.*` or `Desk.basic.*` present, it's agent auth
- Review API calls - if using `/api/v1/` instead of `/portal/api/`, likely agent auth

---

### Pitfall 2: Portal User Can See All Organization Tickets

**What goes wrong:** After implementing JWT SSO, portal users can see tickets belonging to other customers.

**Why it happens:**
- JWT maps to Contact, but Contact is not properly associated with Account
- `isAccountTicketsViewable` is accidentally set to true for all users
- Using agent API instead of portal API

**Consequences:**
- Data privacy violation
- Customer sees competitor's tickets
- GDPR/CCPA compliance failure

**Prevention:**
- Always verify Contact is associated with correct Account
- Explicitly set `isAccountTicketsViewable: false` for B2C portals
- Test with multiple customer accounts to verify isolation

**Detection:**
```typescript
// Test: Create ticket as User A, verify User B cannot see it
async function testTicketIsolation() {
  const userA = await loginPortalUser('userA@example.com');
  const userB = await loginPortalUser('userB@example.com');
  
  const ticket = await createTicket(userA, 'User A Ticket');
  const userBTickets = await getTickets(userB);
  
  if (userBTickets.some(t => t.id === ticket.id)) {
    throw new Error('TICKET ISOLATION FAILED - User B can see User A tickets');
  }
}
```

---

### Pitfall 3: JWT SSO Creates Duplicate Contacts

**What goes wrong:** Every JWT SSO login creates a new Contact in Zoho Desk instead of reusing existing contact.

**Why it happens:**
- Not checking for existing contact by email before creating
- Case sensitivity in email matching
- Different email formats (user+tag@domain.com vs user@domain.com)

**Consequences:**
- Customer ticket history split across multiple contacts
- Reporting shows incorrect contact counts
- Agents see duplicate contacts in search
- Customer confusion ("Why is my old ticket gone?")

**Prevention:**
```typescript
// Always lookup before creating
async function findOrCreateContact(email: string, profile: UserProfile) {
  // Case-insensitive email lookup
  const existing = await zohoDesk.getContactByEmail(email.toLowerCase());
  
  if (existing) {
    // Update profile if needed
    return existing;
  }
  
  // Only create if truly new
  return await zohoDesk.createContact({
    email: email.toLowerCase(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    accountId: profile.accountId  // Important: associate with account
  });
}
```

**Detection:**
- Monitor contact count growth vs. actual new user registrations
- Query for duplicate emails: `SELECT COUNT(*) FROM contacts GROUP BY LOWER(email) HAVING COUNT > 1`
- Customer complaints about missing ticket history

---

### Pitfall 4: OAuth Refresh Token Expires Unexpectedly

**What goes wrong:** Agent OAuth tokens stop working after a period, and refresh token returns error.

**Why it happens:**
- Zoho refresh tokens can be revoked if user changes password
- Organization admin revoked OAuth client access
- Refresh token was used incorrectly (Zoho returns new refresh token each refresh)
- "access_type=offline" not specified in initial auth request

**Consequences:**
- Integration stops working
- Users must re-authorize
- Silent failures if not monitored

**Prevention:**
- Always specify `access_type=offline` in authorization URL
- Store BOTH new access_token AND new refresh_token after each refresh
- Implement error monitoring for refresh failures
- Fall back to re-authorization flow when refresh fails

```typescript
// Correct token refresh handling
async function refreshToken(refreshToken: string) {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });
  
  const tokens = await response.json();
  
  // CRITICAL: Store new refresh_token too!
  await storeTokens(userId, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,  // This is NEW
    expires_at: Date.now() + (tokens.expires_in * 1000)
  });
  
  return tokens.access_token;
}
```

---

### Pitfall 5: Wrong Regional Endpoint for Zoho Desk

**What goes wrong:** Using `desk.zoho.com` when organization is on `desk.zoho.eu`.

**Why it happens:**
- Developer assumes US endpoint works for all
- Organization was created on EU data center
- Regional compliance requires EU data residency

**Consequences:**
- 404 errors or authentication failures
- Data residency compliance violation
- Performance issues (requests routed across continents)

**Prevention:**
- Determine organization's data center during setup
- Use correct regional endpoint:

| Data Center | Desk API Endpoint | Accounts Endpoint |
|-------------|-------------------|-------------------|
| US | `desk.zoho.com` | `accounts.zoho.com` |
| EU | `desk.zoho.eu` | `accounts.zoho.eu` |
| IN | `desk.zoho.in` | `accounts.zoho.in` |
| AU | `desk.zoho.com.au` | `accounts.zoho.com.au` |
| JP | `desk.zoho.jp` | `accounts.zoho.jp` |
| CN | `desk.zoho.com.cn` | `accounts.zoho.com.cn` |

**Detection:**
- Check org ID from Zoho Desk admin panel
- Verify portal URL matches region
- Test API call and check response headers for correct region

---

## Moderate Pitfalls

### Pitfall 6: Missing `orgId` Query Parameter

**What goes wrong:** API calls return 404 or unexpected organization data.

**Why it happens:** Zoho Desk API requires `orgId` query parameter for multi-org accounts.

**Prevention:** Always include `orgId` in every API request:
```typescript
const response = await fetch(`https://desk.zoho.com/api/v1/tickets?orgId=${ORG_ID}`, {
  headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
});
```

---

### Pitfall 7: Portal User Can't Submit Ticket After JWT Login

**What goes wrong:** JWT SSO succeeds but ticket creation returns 403.

**Why it happens:** 
- Contact exists but `isEndUser` is false
- Contact not invited to the help center
- Help center not configured for the department

**Prevention:**
- After JWT mapping, call `/contacts/{contactId}/inviteAsEndUser`
- Verify contact `isEndUser: true` before returning success
- Check help center settings in Zoho Desk admin

---

### Pitfall 8: Session Cookie Not Persisting Across Subdomains

**What goes wrong:** User logged in at `portal.company.com` but not at `help.company.com`.

**Why it happens:** Session cookie set with incorrect domain scope.

**Prevention:**
- Set cookie domain to `.company.com` (with leading dot) for cross-subdomain
- Or use same domain for all portal pages
- Verify SameSite attribute allows cross-subdomain navigation

---

## Minor Pitfalls

### Pitfall 9: Profile Photo Not Loading for Portal Users

**What goes wrong:** Portal user photos show broken image.

**Why it happens:** Photo URLs in Contact responses require authentication to fetch.

**Prevention:** Use signed URLs or fetch photo server-side and proxy.

---

### Pitfall 10: Community User Type Mismatch

**What goes wrong:** Portal user can't post in community forums.

**Why it happens:** CommunityUser type must be `END_USER` for portal users.

**Prevention:** Verify CommunityUser record is created with correct type after portal registration.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Initial OAuth setup | Wrong regional endpoint | Verify organization data center first |
| JWT SSO implementation | Duplicate contacts | Implement email lookup before create |
| Portal user invitation | isEndUser not set | Call inviteAsEndUser API |
| Ticket scope testing | Account visibility too broad | Test with multiple accounts explicitly |
| Token refresh | Old refresh token reused | Store new refresh token after each refresh |

---

## Troubleshooting Checklist

When authentication fails:

- [ ] Is the correct regional endpoint being used?
- [ ] Is the `orgId` parameter included?
- [ ] Is the access token still valid (not expired)?
- [ ] Is the refresh token being stored after refresh?
- [ ] For portal users: Is `isEndUser: true`?
- [ ] For portal users: Is Contact associated with Account?
- [ ] For JWT SSO: Is JWT signature valid?
- [ ] For JWT SSO: Does email claim match Contact email?
- [ ] For agent auth: Are required scopes granted?

---

## Sources

- OAS specifications showing scope requirements - HIGH confidence
- Zoho OAuth documentation - HIGH confidence
- Common authentication error patterns from similar integrations - MEDIUM confidence

---

*Pitfalls research for: Zoho Desk Portal Authentication*
*Researched: 2026-03-16*
