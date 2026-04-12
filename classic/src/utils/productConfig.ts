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
};

export const DEFAULT_PRODUCT: ProductConfig = {
  id: 'default',
  name: 'Default',
  groupKey: 'default',
};

export function getProductConfig(): ProductConfig {
  return PRODUCTS.gcxone;
}

export function getProductById(id: string): ProductConfig | undefined {
  return PRODUCTS[id];
}

export function getAllProducts(): ProductConfig[] {
  return Object.values(PRODUCTS);
}
