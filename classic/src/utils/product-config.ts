// classic/src/utils/product-config.ts
// Product configuration for GCXONE documentation system

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

export type Product = 'gcxone';

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
};

// ---------------------------------------------------------------------------
// Configuration Access
// ---------------------------------------------------------------------------

/**
 * Get the product configuration for the current environment.
 */
export function getProductConfig(): ProductConfig {
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
 * Current product identifier — always gcxone for this build.
 */
export const PRODUCT: Product = 'gcxone';

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Check if a string is a valid product identifier.
 */
export function isValidProduct(value: string | undefined): value is Product {
  return value === 'gcxone';
}

/**
 * Get all available products.
 */
export function getAllProducts(): Product[] {
  return ['gcxone'];
}
