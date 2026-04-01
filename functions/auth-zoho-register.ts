// functions/auth-zoho-register.ts
// Cloudflare Pages Function — Zoho Desk contact auto-registration
//
// Flow:
//   1. Authenticated user calls POST /auth/zoho-register
//   2. Function validates session from cookie
//   3. Checks email domain against allowlist
//   4. Checks if Zoho contact exists
//   5. Creates contact if needed
//   6. Returns contact ID
//
// SECURITY: Only callable with valid session cookie

import {
  getSessionFromHeader,
  type AuthSession,
} from './lib/auth-session';

import {
  isDomainAllowed,
  checkZohoContactExists,
  createZohoContact,
  ensureZohoPortalAccess,
  getZohoAccessToken,
  type ZohoEnv,
} from './lib/zoho-contact-create';

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

interface Env extends ZohoEnv {
  SESSION_SECRET: string;
  ZOHO_ORG_ID: string;
  ZOHO_ALLOWED_DOMAINS?: string;
}

// ---------------------------------------------------------------------------
// Response Types
// ---------------------------------------------------------------------------

interface SuccessResponse {
  success: true;
  contactId: string;
  existing: boolean;
}

interface DomainNotAllowedResponse {
  success: false;
  reason: 'domain_not_allowed';
}

interface ErrorResponse {
  success: false;
  reason: string;
  error?: string;
}

type RegisterResponse = SuccessResponse | DomainNotAllowedResponse | ErrorResponse;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const CORS = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: CORS });

/**
 * POST /auth/zoho-register
 * 
 * Request body:
 *   { email: string, name: string, userId: string }
 * 
 * Creates a Zoho Desk contact for users with allowed email domains.
 * Requires valid session cookie.
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    
    // Step 1: Validate session
    const cookieHeader = request.headers.get('Cookie');
    const session = await getSessionFromHeader(cookieHeader, env.SESSION_SECRET);
    
    if (!session) {
      return json({
        success: false,
        reason: 'unauthorized',
        error: 'No valid session',
      } as ErrorResponse, 401);
    }
    
    // Step 2: Parse request body
    const body = await request.json() as { email?: string; name?: string; userId?: string };
    const { email, name, userId } = body;
    
    // Validate required fields
    if (!email) {
      return json({
        success: false,
        reason: 'missing_email',
        error: 'Email is required',
      } as ErrorResponse, 400);
    }
    
    if (!name) {
      return json({
        success: false,
        reason: 'missing_name',
        error: 'Name is required',
      } as ErrorResponse, 400);
    }
    
    // Verify the email matches the session user (security check)
    if (session.email.toLowerCase() !== email.toLowerCase()) {
      return json({
        success: false,
        reason: 'email_mismatch',
        error: 'Email does not match session',
      } as ErrorResponse, 403);
    }
    
    // Step 3: Check domain allowlist
    const allowedDomains = env.ZOHO_ALLOWED_DOMAINS ?? '';
    
    if (!isDomainAllowed(email, allowedDomains)) {
      return json({
        success: false,
        reason: 'domain_not_allowed',
      } as DomainNotAllowedResponse, 403);
    }
    
    // Step 4: Get Zoho access token
    const token = await getZohoAccessToken(env);
    
    // Step 5: Check if contact exists
    const existingContactId = await checkZohoContactExists(token, email, env.ZOHO_ORG_ID);
    
    if (existingContactId) {
      // Contact already exists
      return json({
        success: true,
        contactId: existingContactId,
        existing: true,
      } as SuccessResponse);
    }
    
    // Step 6: Create new contact
    try {
      const contactId = await createZohoContact(token, email, name, env.ZOHO_ORG_ID);
      
      // Step 7: Ensure portal access
      await ensureZohoPortalAccess(token, contactId, email, env.ZOHO_ORG_ID);
      
      console.log(`[zoho-register] Created contact: ${email} (${contactId})`);
      
      return json({
        success: true,
        contactId,
        existing: false,
      } as SuccessResponse);
    } catch (createError) {
      // Check if it was a race condition (contact created by another request)
      const retryContactId = await checkZohoContactExists(token, email, env.ZOHO_ORG_ID);
      
      if (retryContactId) {
        console.log(`[zoho-register] Contact found on retry: ${email} (${retryContactId})`);
        return json({
          success: true,
          contactId: retryContactId,
          existing: true,
        } as SuccessResponse);
      }
      
      // Genuine creation failure
      throw createError;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    console.error('[zoho-register] Error:', msg);
    
    return json({
      success: false,
      reason: 'internal_error',
      error: msg,
    } as ErrorResponse, 500);
  }
};

/**
 * OPTIONS /auth/zoho-register - CORS preflight
 */
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
