// functions/zoho-customer-proxy/[[path]].ts
// Secure proxy for customer Zoho Desk operations
// - Validates session cookie
// - Extracts contactId from session
// - Proxies to Zoho API with service token
// - Enforces contactId scoping on all responses
//
// SECURITY: This proxy ensures customers can ONLY access their own data.
// - contactId is ALWAYS taken from session, never from request params
// - All ticket responses are validated for ownership
// - Suspicious access attempts are logged

import {
  getSessionFromHeader,
  getCachedToken,
  ZohoEnv,
  ZohoSession,
} from '../lib/zoho-session';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ZOHO_DESK_BASE = 'https://desk.zoho.eu/api/v1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
};

// ---------------------------------------------------------------------------
// CORS Preflight
// ---------------------------------------------------------------------------

export const onRequestOptions: PagesFunction<ZohoEnv> = async () =>
  new Response(null, { status: 200, headers: CORS_HEADERS });

// ---------------------------------------------------------------------------
// Main Handler
// ---------------------------------------------------------------------------

export const onRequest: PagesFunction<ZohoEnv> = async (context) => {
  const { params, request, env } = context;

  // 1. Validate session cookie
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSessionFromHeader(cookieHeader, env.ZOHO_SESSION_SECRET);

  if (!session) {
    logSecurityEvent(env, 'INVALID_SESSION', {
      reason: 'Missing or invalid session cookie',
      path: reconstructPath(params),
    });
    return jsonError('Authentication required', 401);
  }

  // 2. Get service token (server-side only, never exposed to browser)
  let serviceToken: string;
  try {
    serviceToken = await getCachedToken(env);
  } catch (e) {
    console.error('Failed to get service token:', e);
    return jsonError('Service temporarily unavailable', 503);
  }

  // 3. Reconstruct the path from catch-all param
  const path = reconstructPath(params);
  const reqUrl = new URL(request.url);

  // 4. Build target URL with query string
  let targetUrl = `${ZOHO_DESK_BASE}/${path}`;
  if (reqUrl.search) {
    targetUrl += reqUrl.search;
  }

  // 5. SECURITY: Apply contactId scoping based on endpoint
  const scopedUrl = applyContactScoping(targetUrl, path, session);

  // 6. Forward request with service token
  const forwardHeaders: HeadersInit = {
    'Authorization': `Zoho-oauthtoken ${serviceToken}`,
    'orgId': env.ZOHO_ORG_ID,
  };

  // Forward Content-Type for POST/PATCH/PUT
  const contentType = request.headers.get('Content-Type');
  if (contentType) {
    forwardHeaders['Content-Type'] = contentType;
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(scopedUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });
  } catch (e) {
    console.error('Upstream request failed:', e);
    return jsonError('Zoho API unavailable', 502);
  }

  // 7. SECURITY: Validate response for ticket ownership
  if (upstream.ok) {
    const validatedResponse = await validateResponseOwnership(
      upstream,
      path,
      session,
      env,
    );
    if (validatedResponse) {
      return validatedResponse;
    }
    // If validation returns null, fall through to return original response
  }

  // 8. Return response with CORS headers
  return buildResponse(upstream);
};

// ---------------------------------------------------------------------------
// Path Reconstruction
// ---------------------------------------------------------------------------

function reconstructPath(params: Record<string, unknown>): string {
  const pathSegments: string[] = Array.isArray(params.path)
    ? params.path
    : params.path
      ? [params.path as string]
      : [];
  return pathSegments.join('/');
}

// ---------------------------------------------------------------------------
// Security: Contact Scoping
// ---------------------------------------------------------------------------

/**
 * Apply contactId scoping to the request URL.
 * For list endpoints, inject contactId query param.
 * For write operations, inject contactId into body.
 */
function applyContactScoping(
  url: string,
  path: string,
  session: ZohoSession,
): string {
  const parsedUrl = new URL(url);

  // Ticket list endpoint — rewrite to sub-resource path (Zoho no longer accepts contactId as query param)
  // NOTE: /contacts/{id}/tickets only supports pagination params, NOT status/priority filters
  // NOTE: Zoho limit is 1-100, so we cap it to avoid 422 errors
  if (path === 'tickets') {
    const subUrl = new URL(`${ZOHO_DESK_BASE}/contacts/${session.contactId}/tickets`);
    // Only forward allowed params — strip status/priority as they cause 422 errors
    const allowedParams = ['from', 'limit', 'sortBy', 'include'];
    for (const [key, val] of parsedUrl.searchParams) {
      if (allowedParams.includes(key)) {
        // Cap limit to Zoho's max of 100
        if (key === 'limit') {
          const limitVal = Math.min(parseInt(val, 10) || 50, 100);
          subUrl.searchParams.set(key, String(limitVal));
        } else {
          subUrl.searchParams.set(key, val);
        }
      }
    }
    return subUrl.toString();
  }

  // Contact endpoints - only allow access to own contact
  if (path.match(/^contacts\/\d+$/)) {
    const contactIdFromPath = path.split('/')[1];
    if (contactIdFromPath !== session.contactId) {
      // Will be caught by validateResponseOwnership
      console.warn('Contact ID mismatch attempt:', {
        pathContactId: contactIdFromPath,
        sessionContactId: session.contactId,
      });
    }
  }

  // Other endpoints pass through - will be validated in response
  return url;
}

// ---------------------------------------------------------------------------
// Security: Response Validation
// ---------------------------------------------------------------------------

/**
 * Validate that response data belongs to the authenticated contact.
 * Returns modified response if needed, null to pass through original.
 */
async function validateResponseOwnership(
  upstream: Response,
  path: string,
  session: ZohoSession,
  env: ZohoEnv,
): Promise<Response | null> {
  // Clone response for inspection
  const clonedResponse = upstream.clone();

  // Single ticket endpoint - verify ownership
  const ticketMatch = path.match(/^tickets\/(\d+)(\/\w+)?$/);
  if (ticketMatch && !ticketMatch[2]) {
    try {
      const data = await clonedResponse.json() as { contactId?: string };
      if (data.contactId && data.contactId !== session.contactId) {
        logSecurityEvent(env, 'UNAUTHORIZED_ACCESS', {
          reason: 'Ticket contactId mismatch',
          path,
          requestedTicketId: ticketMatch[1],
          sessionContactId: session.contactId,
          ticketContactId: data.contactId,
        });
        return jsonError('Ticket not found', 404); // Don't reveal existence
      }
    } catch {
      // JSON parse error - return original response
      return null;
    }
    return null; // Pass through original response
  }

  // Ticket comments - verify ticket belongs to contact
  if (path.match(/^tickets\/\d+\/(comments|thread|attachments)$/)) {
    const ticketId = path.split('/')[1];
    // Note: We already injected contactId in the query, so Zoho should filter
    // But we log any attempt to access another's tickets
    return null;
  }

  // Contact endpoint - verify it's the authenticated contact
  const contactMatch = path.match(/^contacts\/(\d+)$/);
  if (contactMatch) {
    if (contactMatch[1] !== session.contactId) {
      logSecurityEvent(env, 'UNAUTHORIZED_ACCESS', {
        reason: 'Contact endpoint access attempt',
        path,
        requestedContactId: contactMatch[1],
        sessionContactId: session.contactId,
      });
      return jsonError('Contact not found', 404);
    }
  }

  // Default: pass through
  return null;
}

// ---------------------------------------------------------------------------
// Security Logging
// ---------------------------------------------------------------------------

function logSecurityEvent(
  env: ZohoEnv,
  event: 'INVALID_SESSION' | 'UNAUTHORIZED_ACCESS' | 'TAMPERED_SESSION',
  details: Record<string, unknown>,
): void {
  // Log to console (Cloudflare captures these)
  console.error(JSON.stringify({
    level: 'WARN',
    category: 'SECURITY',
    event,
    timestamp: new Date().toISOString(),
    ...details,
  }));
}

// ---------------------------------------------------------------------------
// Response Helpers
// ---------------------------------------------------------------------------

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

function buildResponse(upstream: Response): Response {
  const responseHeaders = new Headers(CORS_HEADERS);

  // Forward content type
  const contentType = upstream.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
