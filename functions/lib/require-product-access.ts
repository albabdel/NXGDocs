// functions/lib/require-product-access.ts
// Product access guard utility for multi-product content filtering
//
// Purpose: Validate that a user has access to the requested product before
// serving protected content. Used by API functions to enforce product isolation.
//
// Usage:
//   const session = await requireProductAccess(request, env, 'gcxone');
//   // session is validated - user has access to 'gcxone'
//
// Environment variables:
//   PRODUCT - Default product for this deployment (optional)

import { getSessionFromHeader, type ZohoSession } from './zoho-session';
import { getAdminSessionFromHeader, type AdminSession } from './admin-session';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Product = 'gcxone' | 'gcsurge';

export interface ProductAccessEnv {
  ZOHO_SESSION_SECRET: string;
  PRODUCT?: string;
}

export type UserSession = ZohoSession | AdminSession;

// ---------------------------------------------------------------------------
// Product Detection
// ---------------------------------------------------------------------------

/**
 * Extract the product from the request context.
 * Priority: X-Product header > URL path (/api/gcxone/...) > PRODUCT env var > 'gcxone'
 */
export function getProductFromRequest(request: Request, env?: ProductAccessEnv): Product {
  // 1. Check X-Product header
  const productHeader = request.headers.get('X-Product');
  if (productHeader === 'gcxone' || productHeader === 'gcsurge') {
    return productHeader;
  }

  // 2. Check URL path for product segment
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  for (const segment of pathSegments) {
    if (segment === 'gcxone' || segment === 'gcsurge') {
      return segment;
    }
  }

  // 3. Check PRODUCT environment variable
  if (env?.PRODUCT === 'gcxone' || env?.PRODUCT === 'gcsurge') {
    return env.PRODUCT;
  }

  // 4. Default to gcxone
  return 'gcxone';
}

// ---------------------------------------------------------------------------
// Access Guard
// ---------------------------------------------------------------------------

/**
 * Require that the user has access to the specified product.
 *
 * @param request - The incoming request (to extract session from cookies)
 * @param env - Environment with session secret
 * @param requiredProduct - The product to check access for (optional, auto-detected if not provided)
 * @returns The user session if access is granted
 * @throws Response with 401 if not authenticated, 403 if no product access
 */
export async function requireProductAccess(
  request: Request,
  env: ProductAccessEnv,
  requiredProduct?: Product,
): Promise<UserSession> {
  const cookieHeader = request.headers.get('Cookie');
  const secret = env.ZOHO_SESSION_SECRET;

  // Try to get Zoho session first
  const zohoSession = await getSessionFromHeader(cookieHeader, secret);
  if (zohoSession) {
    return validateProductAccess(zohoSession, requiredProduct, request, env);
  }

  // Try to get admin session
  const adminSession = await getAdminSessionFromHeader(cookieHeader, secret);
  if (adminSession) {
    return validateProductAccess(adminSession, requiredProduct, request, env);
  }

  // No valid session found
  throw new Response(JSON.stringify({ error: 'Not authenticated' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Validate that the session has access to the required product.
 */
function validateProductAccess(
  session: UserSession,
  requiredProduct: Product | undefined,
  request: Request,
  env: ProductAccessEnv,
): UserSession {
  // Determine required product
  const product = requiredProduct ?? getProductFromRequest(request, env);

  // Check if session has access to the product
  if (!session.productAccess.includes(product)) {
    throw new Response(
      JSON.stringify({
        error: 'Access denied',
        message: `You do not have access to ${product}`,
        requiredProduct: product,
        userProducts: session.productAccess,
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  return session;
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Check if a session has access to a specific product (non-throwing version).
 */
export function hasProductAccess(
  session: UserSession,
  product: Product,
): boolean {
  return session.productAccess.includes(product);
}

/**
 * Get all products the user has access to.
 */
export function getUserProducts(session: UserSession): Product[] {
  return session.productAccess.filter(
    (p): p is Product => p === 'gcxone' || p === 'gcsurge',
  );
}
