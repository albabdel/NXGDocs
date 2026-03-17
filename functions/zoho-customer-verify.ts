// functions/zoho-customer-verify.ts
// Cloudflare Pages Function — Email verification login for Zoho Desk customers
//
// Flow:
//   1. Customer enters email on docs site
//   2. Backend finds contact in Zoho Desk
//   3. Backend sends verification email with magic link
//   4. Customer clicks link (valid for 15 min)
//   5. Backend creates secure HttpOnly session cookie
//   6. Customer can now view their tickets
//
// Security:
//   - Magic link expires in 15 minutes
//   - One-time use tokens (invalidated after use)
//   - Rate limited per email (max 3 requests per hour)
//   - HttpOnly, Secure, SameSite cookies

import { createSessionCookie, buildSessionCookieHeader, getSessionFromHeader } from './lib/zoho-session';
import { getCachedToken } from './lib/zoho-session';

interface Env {
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_ORG_ID: string;
  ZOHO_SESSION_SECRET: string;
  ZOHO_VERIFY_SECRET: string; // For signing verification tokens
  RESEND_API_KEY?: string; // Optional: for sending emails via Resend
}

interface ZohoContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountId?: string;
  account?: { accountName?: string };
}

// In-memory store for rate limiting and used tokens (per-worker)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const usedTokens = new Set<string>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// Zoho API helpers
// ---------------------------------------------------------------------------

async function findContactByEmail(token: string, email: string, orgId: string): Promise<ZohoContact | null> {
  const url = `https://desk.zoho.eu/api/v1/contacts/search?searchStr=${encodeURIComponent(email)}&searchField=email`;
  const res = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, orgId },
  });
  if (!res.ok) {
    console.error(`Contact search failed: ${res.status}`);
    return null;
  }
  const data = await res.json() as { data?: ZohoContact[] };
  return (data.data ?? []).find(c => c.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

function checkRateLimit(email: string): boolean {
  const key = email.toLowerCase();
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Token generation & verification
// ---------------------------------------------------------------------------

async function generateVerificationToken(email: string, contactId: string, secret: string): Promise<string> {
  const payload = {
    email: email.toLowerCase(),
    contactId,
    nonce: crypto.randomUUID(),
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const token = btoa(String.fromCharCode(...new Uint8Array(data))) + '.' + 
                btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return token;
}

async function verifyToken(token: string, secret: string): Promise<{ email: string; contactId: string } | null> {
  try {
    const [dataB64, sigB64] = token.split('.');
    if (!dataB64 || !sigB64) return null;
    
    // Check if token was already used
    if (usedTokens.has(token)) return null;
    
    const encoder = new TextEncoder();
    const data = Uint8Array.from(atob(dataB64), c => c.charCodeAt(0));
    const providedSig = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    
    // Verify signature
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const valid = await crypto.subtle.verify('HMAC', key, providedSig, data);
    if (!valid) return null;
    
    const payload = JSON.parse(new TextDecoder().decode(data));
    
    // Check expiry
    if (payload.exp < Date.now()) return null;
    
    // Mark as used
    usedTokens.add(token);
    
    // Clean up old tokens periodically
    if (usedTokens.size > 1000) {
      const cutoff = Date.now() - TOKEN_EXPIRY_MS * 2;
      // In a real implementation, we'd iterate and remove expired tokens
    }
    
    return { email: payload.email, contactId: payload.contactId };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Email sending
// ---------------------------------------------------------------------------

async function sendVerificationEmail(
  email: string,
  token: string,
  env: Env
): Promise<boolean> {
  const verifyUrl = `https://gcxone.pages.dev/support?verify=${encodeURIComponent(token)}`;
  
  // Use Resend if API key is configured
  if (env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'support@nxgen.io',
        to: email,
        subject: 'Verify your email - NXGEN Support',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #E8B058;">NXGEN Support</h2>
            <p>Click the button below to access your support tickets:</p>
            <a href="${verifyUrl}" style="display: inline-block; background: #E8B058; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
              View My Tickets
            </a>
            <p style="color: #666; font-size: 12px;">This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      }),
    });
    return res.ok;
  }
  
  // Fallback: Log the verification URL (for development)
  console.log(`[DEV] Verification URL for ${email}: ${verifyUrl}`);
  return true;
}

// ---------------------------------------------------------------------------
// Main handlers
// ---------------------------------------------------------------------------

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

// POST: Request verification email
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as { email?: string };
    const email = (body.email ?? '').toLowerCase().trim();
    
    if (!email) {
      return json({ error: 'Email is required' }, 400);
    }
    
    // Rate limit check
    if (!checkRateLimit(email)) {
      return json({ 
        error: 'Too many verification requests. Please wait an hour and try again.' 
      }, 429);
    }
    
    // Get Zoho service token
    const zToken = await getCachedToken(context.env);
    
    // Find contact
    const contact = await findContactByEmail(zToken, email, context.env.ZOHO_ORG_ID);
    
    if (!contact) {
      // Don't reveal whether contact exists or not (security)
      // Still "send" email to avoid enumeration
      return json({ 
        ok: true, 
        message: 'If an account exists, you will receive a verification email.' 
      });
    }
    
    // Generate verification token
    const token = await generateVerificationToken(email, contact.id, context.env.ZOHO_VERIFY_SECRET);
    
    // Send verification email
    const sent = await sendVerificationEmail(email, token, context.env);
    
    if (!sent) {
      return json({ error: 'Failed to send verification email' }, 500);
    }
    
    return json({ 
      ok: true, 
      message: 'Verification email sent! Check your inbox.' 
    });
    
  } catch (e) {
    console.error('zoho-customer-verify error:', e);
    return json({ error: 'Internal error' }, 500);
  }
};

// GET: Verify token and create session
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return json({ error: 'Missing verification token' }, 400);
    }
    
    // Verify the token
    const payload = await verifyToken(token, context.env.ZOHO_VERIFY_SECRET);
    
    if (!payload) {
      return json({ 
        error: 'Invalid or expired verification link. Please request a new one.' 
      }, 400);
    }
    
    // Get Zoho service token to fetch contact details
    const zToken = await getCachedToken(context.env);
    const contact = await findContactByEmail(zToken, payload.email, context.env.ZOHO_ORG_ID);
    
    if (!contact) {
      return json({ error: 'Contact not found' }, 404);
    }
    
    // Create session cookie
    const displayName = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || payload.email;
    const sessionToken = await createSessionCookie(
      contact.id,
      contact.accountId ?? null,
      displayName,
      context.env.ZOHO_SESSION_SECRET,
    );
    
    // Return success with session cookie
    // The frontend will redirect to /support
    return new Response(JSON.stringify({
      ok: true,
      contactId: contact.id,
      displayName,
      account: contact.account?.accountName ?? null,
    }), {
      headers: {
        'Set-Cookie': buildSessionCookieHeader(sessionToken),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (e) {
    console.error('zoho-customer-verify GET error:', e);
    return json({ error: 'Internal error' }, 500);
  }
};

// OPTIONS: CORS preflight
export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
