export interface ProductConfig {
  id: string;
  name: string;
  groupKey: string;
  tagline?: string;
  domain?: string;
}

export const PRODUCTS: Record<string, ProductConfig> = {
  gcxone: {
    id: 'gcxone',
    name: 'GCXONE',
    groupKey: 'gcxone',
    tagline: 'Complete documentation for NXGEN GCXONE platform',
    domain: 'docs.gcxone.com',
  },
  gcsurge: {
    id: 'gcsurge',
    name: 'GC Surge',
    groupKey: 'gcsurge',
    tagline: 'GC Surge Documentation',
    domain: 'docs.gcsurge.com',
  },
};

export const DEFAULT_PRODUCT: ProductConfig = {
  id: 'default',
  name: 'Default',
  groupKey: 'default',
};

export function getProductConfig(): ProductConfig {
  const productId =
    typeof process !== 'undefined'
      ? process.env.PRODUCT
      : typeof import.meta !== 'undefined'
        ? (import.meta as { env?: { PRODUCT?: string } }).env?.PRODUCT
        : undefined;

  if (productId && PRODUCTS[productId]) {
    return PRODUCTS[productId];
  }

  return PRODUCTS.gcxone;
}

export function getProductById(id: string): ProductConfig | undefined {
  return PRODUCTS[id];
}

export function getAllProducts(): ProductConfig[] {
  return Object.values(PRODUCTS);
}
