// functions/lib/zoho-contact-create.ts
// Zoho Desk contact creation utilities for auto-registration
//
// Purpose:
//   - Check if Zoho contact exists by email
//   - Create Zoho contact for new users
//   - Validate email domain against allowlist
//
// Used by: auth-zoho-register.ts endpoint

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ZohoContact {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  mobile?: string;
  type: 'customerContact' | 'agent';
  accountId?: string;
  isEndUser?: boolean;
  id?: string;
  createdTime?: string;
}

export interface ZohoContactResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  type: string;
  createdTime: string;
  isEndUser?: boolean;
  accountId?: string | null;
}

export interface ZohoEnv {
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_ORG_ID: string;
  ZOHO_API_DOMAIN?: string; // e.g., https://desk.zoho.eu
  ZOHO_ALLOWED_DOMAINS?: string;
}

// ---------------------------------------------------------------------------
// Token Management
// ---------------------------------------------------------------------------

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp (ms)
}

// Global token cache (per-worker)
let tokenCache: TokenCache | null = null;
const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutes (tokens last 60 min)

/**
 * Get a cached Zoho access token or refresh if expired.
 */
export async function getZohoAccessToken(env: ZohoEnv): Promise<string> {
  const now = Date.now();
  
  // Check if cache is valid
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }
  
  // Refresh the token
  const res = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: env.ZOHO_REFRESH_TOKEN,
      client_id: env.ZOHO_CLIENT_ID,
      client_secret: env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Zoho token refresh failed: ${res.status} ${errorText}`);
  }
  
  const data = await res.json() as { access_token?: string; expires_in?: number; error?: string };
  
  if (!data.access_token) {
    throw new Error(`Zoho refresh error: ${data.error ?? 'Unknown error'}`);
  }
  
  // Update cache
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + TOKEN_CACHE_TTL_MS,
  };
  
  return data.access_token;
}

/**
 * Force refresh the cached token.
 */
export async function forceRefreshZohoToken(env: ZohoEnv): Promise<string> {
  tokenCache = null;
  return getZohoAccessToken(env);
}

// ---------------------------------------------------------------------------
// Domain Validation
// ---------------------------------------------------------------------------

/**
 * Check if email domain is in the allowed list for auto-registration.
 * @param email - User email address
 * @param allowedDomains - Comma-separated list of allowed domains (e.g., "nxgen.io,partner.com")
 * @returns true if domain is allowed
 */
export function isDomainAllowed(email: string, allowedDomains: string): boolean {
  if (!allowedDomains) return false;
  
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!emailDomain) return false;
  
  const domains = allowedDomains.split(',').map(d => d.trim().toLowerCase());
  return domains.includes(emailDomain);
}

// ---------------------------------------------------------------------------
// Contact Operations
// ---------------------------------------------------------------------------

/**
 * Check if a Zoho contact exists for the given email.
 * @returns Contact ID if found, null otherwise
 */
export async function checkZohoContactExists(
  token: string,
  email: string,
  orgId: string,
): Promise<string | null> {
  const headers = {
    Authorization: `Zoho-oauthtoken ${token}`,
    orgId,
  };
  
  const lowerEmail = email.toLowerCase();
  
  // Try search endpoint first (faster if Desk.search.READ scope available)
  try {
    const searchUrl = `https://desk.zoho.eu/api/v1/search?searchStr=${encodeURIComponent(email)}&module=contacts&limit=10`;
    const searchRes = await fetch(searchUrl, { headers });
    
    if (searchRes.ok) {
      const text = await searchRes.text();
      if (text) {
        const data = JSON.parse(text) as { data?: ZohoContactResponse[] };
        const contacts = data.data ?? [];
        const match = contacts.find(c => c.email?.toLowerCase() === lowerEmail);
        if (match?.id) return match.id;
      }
    }
  } catch {
    // Fall through to pagination
  }
  
  // Fallback: paginate contacts list
  const limit = 100;
  for (let from = 0; from < 5000; from += limit) {
    const res = await fetch(
      `https://desk.zoho.eu/api/v1/contacts?limit=${limit}&from=${from}`,
      { headers },
    );
    if (!res.ok) return null;
    
    const text = await res.text();
    if (!text) return null;
    
    const data = JSON.parse(text) as { data?: ZohoContactResponse[] };
    const contacts = data.data ?? [];
    const match = contacts.find(c => c.email?.toLowerCase() === lowerEmail);
    if (match?.id) return match.id;
    
    if (contacts.length < limit) break;
  }
  
  return null;
}

/**
 * Create a new Zoho contact.
 * @returns New contact ID
 */
export async function createZohoContact(
  token: string,
  email: string,
  name: string,
  orgId: string,
): Promise<string> {
  // Parse name into firstName/lastName
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const res = await fetch('https://desk.zoho.eu/api/v1/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      orgId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      type: 'customerContact', // End user type
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create contact: ${res.status} - ${errorText}`);
  }
  
  const data = await res.json() as { id?: string };
  
  if (!data.id) {
    throw new Error('No contact ID in response');
  }
  
  return data.id;
}

/**
 * Ensure the contact has portal access (isEndUser flag).
 * Invites them as end user if not already.
 */
export async function ensureZohoPortalAccess(
  token: string,
  contactId: string,
  email: string,
  orgId: string,
): Promise<void> {
  try {
    // First check if already an end user
    const contactRes = await fetch(`https://desk.zoho.eu/api/v1/contacts/${contactId}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        orgId,
      },
    });
    
    if (!contactRes.ok) {
      console.warn(`ensurePortalAccess: Failed to fetch contact ${contactId}: ${contactRes.status}`);
      return;
    }
    
    const contact = await contactRes.json() as ZohoContactResponse;
    
    if (contact.isEndUser) {
      // Already has portal access
      return;
    }
    
    // Invite as end user
    const inviteRes = await fetch(
      `https://desk.zoho.eu/api/v1/contacts/${contactId}/inviteAsEndUser`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          orgId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      },
    );
    
    if (!inviteRes.ok) {
      const errorText = await inviteRes.text();
      console.warn(`ensurePortalAccess: Failed to invite ${email}: ${inviteRes.status} - ${errorText}`);
    } else {
      console.log(`ensurePortalAccess: Invited ${email} as end user for contact ${contactId}`);
    }
  } catch (e) {
    console.error(`ensurePortalAccess: Unexpected error for ${email}:`, e instanceof Error ? e.message : e);
  }
}

/**
 * Full contact creation flow:
 * 1. Check if contact exists
 * 2. If not, create contact
 * 3. Ensure portal access
 * 
 * @returns { contactId, created } where created is true if new contact was created
 */
export async function findOrCreateZohoContact(
  env: ZohoEnv,
  email: string,
  name: string,
): Promise<{ contactId: string; created: boolean }> {
  // Get access token
  const token = await getZohoAccessToken(env);
  
  // Check if contact exists
  const existingId = await checkZohoContactExists(token, email, env.ZOHO_ORG_ID);
  
  if (existingId) {
    return { contactId: existingId, created: false };
  }
  
  // Create new contact
  const contactId = await createZohoContact(token, email, name, env.ZOHO_ORG_ID);
  
  // Ensure portal access
  await ensureZohoPortalAccess(token, contactId, email, env.ZOHO_ORG_ID);
  
  return { contactId, created: true };
}
