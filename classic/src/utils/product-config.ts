// classic/src/utils/product-config.ts
// Product configuration for multi-product documentation system
//
// Purpose: Centralized product configuration for branding, URLs, and colors.
// Used by docusaurus.config.ts for product-specific site generation.
//
// Environment variables:
//   PRODUCT - Current product identifier ('gcxone' or 'gcsurge')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductConfig {
  id: Product;
  title: string;
  tagline: string;
  url: string;
  primaryColor: string;
  description?: string;
}

export type Product = 'gcxone' | 'gcsurge';

// ---------------------------------------------------------------------------
// Product Configurations
// ---------------------------------------------------------------------------

export const PRODUCT_CONFIGS: Record<Product, ProductConfig> = {
  gcxone: {
    id: 'gcxone',
    title: 'GCXONE',
    tagline: 'Enterprise Customer Experience Platform',
    url: 'https://docs.gcxone.com',
    primaryColor: '#0066CC',
    description: 'Complete documentation for GCXONE enterprise platform',
  },
  gcsurge: {
    id: 'gcsurge',
    title: 'GC Surge',
    tagline: 'Growth Acceleration Suite',
    url: 'https://docs.gcsurge.com',
    primaryColor: '#00AA55',
    description: 'Documentation for GC Surge growth tools',
  },
};

// ---------------------------------------------------------------------------
// Configuration Access
// ---------------------------------------------------------------------------

/**
 * Get the product configuration for the current environment.
 * Uses PRODUCT env var, defaults to 'gcxone'.
 */
export function getProductConfig(): ProductConfig {
  const productId = (typeof process !== 'undefined' && process.env?.PRODUCT) || 'gcxone';
  
  if (productId === 'gcsurge') {
    return PRODUCT_CONFIGS.gcsurge;
  }
  
  return PRODUCT_CONFIGS.gcxone;
}

/**
 * Get a specific product configuration by ID.
 */
export function getProductConfigById(id: Product): ProductConfig {
  return PRODUCT_CONFIGS[id];
}

// ---------------------------------------------------------------------------
// Environment Export
// ---------------------------------------------------------------------------

/**
 * Current product identifier from environment.
 * Defaults to 'gcxone' if not set.
 */
export const PRODUCT: Product = 
  (typeof process !== 'undefined' && process.env?.PRODUCT === 'gcsurge') 
    ? 'gcsurge' 
    : 'gcxone';

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Check if a string is a valid product identifier.
 */
export function isValidProduct(value: string | undefined): value is Product {
  return value === 'gcxone' || value === 'gcsurge';
}

/**
 * Get all available products.
 */
export function getAllProducts(): Product[] {
  return ['gcxone', 'gcsurge'];
}
