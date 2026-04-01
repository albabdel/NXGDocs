/**
 * Product Configuration
 * 
 * Central configuration for multi-product documentation system.
 * Each product has its own branding, title, URL, and theme colors.
 * 
 * Usage:
 * - Build pipeline sets PRODUCT env var (from Phase 37 multi-build)
 * - Docusaurus config reads via getCurrentConfig()
 * - Components access via useProduct() hook (Root.tsx context)
 */

export interface ProductConfig {
  id: string;
  title: string;
  tagline: string;
  url: string;
  baseUrl: string;
  favicon: string;
  logo: {
    src: string;
    alt: string;
    href?: string;
  };
  theme: {
    primaryColor: string;
    primaryColorDark: string;
  };
  socialCard: string;
  metadata: {
    keywords: string[];
    description: string;
  };
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  gcxone: {
    id: 'gcxone',
    title: 'GCXONE Documentation',
    tagline: 'Complete documentation for NXGEN GCXONE platform',
    url: 'https://docs.gcxone.com',
    baseUrl: '/',
    favicon: 'img/favicon.png',
    logo: {
      src: 'img/XoLogo.png',
      alt: 'GCXONE Logo',
      href: '/',
    },
    theme: {
      primaryColor: '#C89446',
      primaryColorDark: '#D4A574',
    },
    socialCard: 'img/nxgen-social-card.jpg',
    metadata: {
      keywords: ['NXGEN', 'GCXONE', 'Talos', 'Evalink', 'documentation', 'security', 'alarm management', 'video management'],
      description: 'Complete documentation for NXGEN GCXONE platform - Proactive Monitoring Operating System',
    },
  },
  gcsurge: {
    id: 'gcsurge',
    title: 'GC Surge Documentation',
    tagline: 'Documentation for NXGEN GC Surge platform',
    url: 'https://docs.gcsurge.com',
    baseUrl: '/',
    favicon: 'img/favicon-gcsurge.png',
    logo: {
      src: 'img/gcsurge-logo.png',
      alt: 'GC Surge Logo',
      href: '/',
    },
    theme: {
      primaryColor: '#3B82F6',
      primaryColorDark: '#60A5FA',
    },
    socialCard: 'img/gcsurge-social-card.jpg',
    metadata: {
      keywords: ['NXGEN', 'GC Surge', 'documentation', 'security', 'monitoring'],
      description: 'Documentation for NXGEN GC Surge platform',
    },
  },
};

export function getProductConfig(productId: string): ProductConfig {
  const config = PRODUCT_CONFIGS[productId];
  if (!config) {
    throw new Error(`Unknown product: ${productId}. Available products: ${Object.keys(PRODUCT_CONFIGS).join(', ')}`);
  }
  return config;
}

export function getCurrentProduct(): string {
  return process.env.PRODUCT || 'gcxone';
}

export function getCurrentConfig(): ProductConfig {
  return getProductConfig(getCurrentProduct());
}

export const VALID_PRODUCTS = Object.keys(PRODUCT_CONFIGS);
