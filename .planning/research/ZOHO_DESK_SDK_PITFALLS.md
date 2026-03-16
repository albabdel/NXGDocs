# Domain Pitfalls: Zoho Desk SDK Integration

**Domain:** Customer Support Help Desk SDK
**Researched:** March 16, 2026

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Assuming a Web JS SDK Exists

**What goes wrong:** Developers search for "Zoho Desk JavaScript SDK" and find React Native packages or Embedded App SDK, assuming they work in browser web apps.

**Why it happens:** 
- Zoho publishes multiple SDKs with similar names
- `embeddedApp-js-sdk` appears to be a browser SDK
- React Native packages show up in npm searches

**Consequences:** 
- Wasted time trying to install React Native packages in web projects
- Attempting to use Embedded App SDK outside Zoho context (won't work)
- Incorrect architecture decisions based on assumed SDK capabilities

**Prevention:** 
- Understand that **no official web JS SDK exists**
- Plan for direct REST API integration from the start
- Use Embedded App SDK only if building widgets to run inside Zoho

**Detection:** 
- Build errors about missing native modules
- "ZohoEmbeddedAppSDK is not defined" when used outside Zoho context

---

### Pitfall 2: Confusing Agent OAuth with Portal User Auth

**What goes wrong:** Using OAuth 2.0 authorization code flow for end-user customers, or expecting JWT to work for agent authentication.

**Why it happens:**
- Two completely different auth flows exist
- Documentation is scattered across different products
- React Native SDK uses JWT but OAuth docs are for agents

**Consequences:**
- Customers redirected to Zoho login pages (wrong UX)
- Agents unable to use JWT-based flows
- Session management completely broken

**Prevention:**

| User Type | Auth Method | Flow |
|-----------|-------------|------|
| Agents | OAuth 2.0 | Authorization Code → Access Token |
| Portal Users (Customers) | JWT | Backend generates JWT → Frontend sends to API |

**Detection:**
- Wrong login UI appearing
- Token validation failures
- 401 errors with correct credentials

---

### Pitfall 3: Not Implementing Token Refresh

**What goes wrong:** Access tokens expire (typically 1 hour) and the application stops working without warning.

**Why it happens:**
- No SDK to handle refresh automatically
- Developers assume tokens are long-lived
- Initial implementation works, breaks after an hour

**Consequences:**
- Silent failures in production
- Users forced to re-authenticate frequently
- Data loss in mid-operation

**Prevention:**
```javascript
// Implement token refresh logic
const refreshAccessToken = async (refreshToken) => {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken
    })
  });
  return response.json();
};

// Check expiry before each API call
const makeApiCall = async () => {
  if (tokenExpiresAt < Date.now() + 60000) { // 1 min buffer
    const newTokens = await refreshAccessToken(refreshToken);
    updateStoredTokens(newTokens);
  }
  return fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
};
```

**Detection:**
- API calls fail exactly 1 hour after login
- Intermittent 401 errors

---

### Pitfall 4: Missing orgId Parameter

**What goes wrong:** API calls fail with "Organization not found" or similar errors.

**Why it happens:**
- Most Zoho Desk API endpoints require `orgId` query parameter
- OpenAPI spec shows it as required but easy to miss
- Different from other Zoho APIs that infer org from token

**Consequences:**
- 400/404 errors on every API call
- Confusion about why authentication works but calls fail

**Prevention:**
```javascript
// Always include orgId in API calls
const response = await fetch(
  `https://desk.zoho.com/api/v1/tickets?orgId=${orgId}`,
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
```

**Detection:**
- Error messages mentioning organization
- API calls work with one org but not another

---

### Pitfall 5: Wrong Data Center URL

**What goes wrong:** Using US URL for EU/IN/JP accounts or vice versa.

**Why it happens:**
- Multiple data centers exist
- Default tutorials show US URL
- User account location not obvious

**Consequences:**
- Authentication fails
- "Invalid client" errors even with correct credentials

**Prevention:**

| Account Region | API Base URL | Accounts URL |
|----------------|--------------|--------------|
| US | desk.zoho.com | accounts.zoho.com |
| EU | desk.zoho.eu | accounts.zoho.eu |
| IN | desk.zoho.in | accounts.zoho.in |
| CN | desk.zoho.com.cn | accounts.zoho.com.cn |
| AU | desk.zoho.com.au | accounts.zoho.com.au |

**Detection:**
- OAuth fails with valid client ID/secret
- API calls return 404

---

## Moderate Pitfalls

### Pitfall 6: Ignoring Rate Limits

**What goes wrong:** API calls fail with 429 Too Many Requests after bulk operations.

**Prevention:**
- Implement exponential backoff
- Batch operations with delays
- Monitor `X-RateLimit-Remaining` header

---

### Pitfall 7: Storing Tokens in LocalStorage

**What goes wrong:** XSS vulnerabilities expose access/refresh tokens.

**Prevention:**
- Use HttpOnly cookies for token storage
- Implement CSRF protection
- Consider in-memory storage with silent refresh

---

### Pitfall 8: Not Handling Partial Responses

**What goes wrong:** Bulk operations return partial success/failure but app treats as complete success.

**Prevention:**
- Check for `errors` array in mass action responses
- Handle `INVALID_DATA` error codes per item
- Show partial failure UI

---

## Minor Pitfalls

### Pitfall 9: Using Wrong Scope Names

**Prevention:** Use exact scope names from OpenAPI spec:
- `Desk.tickets.READ` (not `desk.tickets.read`)
- `Desk.contacts.CREATE` (not `ZohoDesk.contacts.create`)

---

### Pitfall 10: Not URL-Encoding Query Parameters

**Prevention:** Always URL-encode values in query strings, especially `include` parameter with comma-separated values.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| OAuth Setup | Wrong data center URL | Detect user region first |
| Token Management | No refresh implementation | Build refresh logic before any API calls |
| Ticket Operations | Missing orgId | Create wrapper that always adds orgId |
| Portal Auth | Using OAuth for customers | Understand JWT vs OAuth distinction |
| React Integration | No hooks available | Build custom hooks wrapping fetch |

---

## Sources

- OpenAPI spec error codes: `github.com/zoho/zohodesk-oas/v1.0/Common.json`
- Zoho CRM SDK docs (similar patterns): `www.zoho.com/crm/developer/docs/sdk`
- React Native SDK source: `github.com/zoho/react-native-zohodesk-portal-sdk`
