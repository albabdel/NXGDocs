// classic/src/utils/content-visibility.ts
// Content visibility utilities for multi-product content filtering
//
// Purpose: Determine if content should be visible based on:
//   1. Visibility tier (public, authenticated, restricted)
//   2. User's product access entitlements
//
// Usage:
//   const canView = canViewContent(content, userProductAccess);
//   // Returns true if user can view the content

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Visibility tier determines access requirements for content.
 * - 'public': Anyone can view (no authentication required)
 * - 'authenticated': User must be logged in (any product access)
 * - 'restricted': User must have access to the content's product
 */
export type VisibilityTier = 'public' | 'authenticated' | 'restricted';

/**
 * Metadata for content visibility decisions.
 */
export interface ContentMetadata {
  /** Product this content belongs to (e.g., 'gcxone') */
  product: string;
  /** Visibility tier for access control */
  visibility: VisibilityTier;
}

/**
 * User session context for visibility checks.
 */
export interface UserContext {
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Products the user has access to */
  productAccess: string[];
}

// ---------------------------------------------------------------------------
// Visibility Check
// ---------------------------------------------------------------------------

/**
 * Determine if content can be viewed by the user.
 *
 * @param content - Content metadata with product and visibility tier
 * @param user - User context with authentication status and product access
 * @returns true if user can view the content, false otherwise
 *
 * @example
 *   // Public content - always visible
 *   canViewContent({ product: 'gcxone', visibility: 'public' }, { isAuthenticated: false, productAccess: [] });
 *   // => true
 *
 * @example
 *   // Authenticated content - requires login
 *   canViewContent({ product: 'gcxone', visibility: 'authenticated' }, { isAuthenticated: true, productAccess: [] });
 *   // => true
 *
 * @example
 *   // Restricted content - requires product access
 *   canViewContent({ product: 'gcxone', visibility: 'restricted' }, { isAuthenticated: true, productAccess: ['gcxone'] });
 *   // => true
 */
export function canViewContent(
  content: ContentMetadata,
  user: UserContext,
): boolean {
  // Public content is always visible
  if (content.visibility === 'public') {
    return true;
  }

  // Authenticated and restricted require login
  if (!user.isAuthenticated) {
    return false;
  }

  // Authenticated tier - any logged-in user can view
  if (content.visibility === 'authenticated') {
    return true;
  }

  // Restricted tier - requires specific product access
  if (content.visibility === 'restricted') {
    return user.productAccess.includes(content.product);
  }

  // Unknown visibility tier - deny by default
  return false;
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Check if content is publicly visible (no authentication required).
 */
export function isPublicContent(content: ContentMetadata): boolean {
  return content.visibility === 'public';
}

/**
 * Check if content requires authentication.
 */
export function requiresAuthentication(content: ContentMetadata): boolean {
  return content.visibility !== 'public';
}

/**
 * Check if content is restricted to specific product access.
 */
export function isRestrictedContent(content: ContentMetadata): boolean {
  return content.visibility === 'restricted';
}

/**
 * Filter an array of content items to only those the user can view.
 */
export function filterVisibleContent<T extends ContentMetadata>(
  content: T[],
  user: UserContext,
): T[] {
  return content.filter((item) => canViewContent(item, user));
}

/**
 * Get the visibility tier for a given string, with fallback.
 * Useful for parsing visibility from Sanity documents.
 */
export function parseVisibilityTier(
  value: string | undefined | null,
  fallback: VisibilityTier = 'public',
): VisibilityTier {
  if (value === 'public' || value === 'authenticated' || value === 'restricted') {
    return value;
  }
  return fallback;
}
