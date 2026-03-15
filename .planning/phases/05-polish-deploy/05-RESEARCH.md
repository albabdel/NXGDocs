# Phase 5: Polish & Deploy - Research Document

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 5 of 5  
**Created:** March 15, 2026  
**Status:** RESEARCH COMPLETE

---

## Table of Contents

1. [Bundle Analysis Tools](#1-bundle-analysis-tools)
2. [Code Splitting Strategies](#2-code-splitting-strategies)
3. [Performance Optimization](#3-performance-optimization)
4. [Bundle Size Benchmarks](#4-bundle-size-benchmarks)
5. [Production Build Verification](#5-production-build-verification)
6. [Documentation Best Practices](#6-documentation-best-practices)

---

## 1. Bundle Analysis Tools

### 1.1 Webpack Bundle Analyzer

The most popular tool for visualizing webpack bundle composition. Works natively with Docusaurus since it uses webpack under the hood.

**Installation:**

```bash
npm install --save-dev webpack-bundle-analyzer
```

**Docusaurus Configuration:**

```typescript
// docusaurus.config.ts
import type { Config } from '@docusaurus/types';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const config: Config = {
  plugins: [],
  webpack: {
    plugins: [
      process.env.ANALYZE === 'true' && new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../bundle-report.html',
        openAnalyzer: true,
        generateStatsFile: true,
        statsFilename: '../bundle-stats.json',
        defaultSizes: 'gzip',
      }),
    ].filter(Boolean),
  },
};

export default config;
```

**Running Analysis:**

```bash
ANALYZE=true npm run build
```

**Key Metrics to Monitor:**

| Metric | Description | Target |
|--------|-------------|--------|
| Parsed Size | Uncompressed bundle size | < 500KB |
| Gzipped Size | Compressed transfer size | < 150KB |
| Download Time | Estimated on 3G | < 2s |
| Modules | Number of unique modules | Minimize |

**Interpreting Results:**

1. **Large chunks**: Identify chunks > 100KB gzipped
2. **Duplicate dependencies**: Same package in multiple chunks
3. **Unexpected imports**: Heavy libraries imported unexpectedly
4. **Tree-shaking failures**: Unused exports still in bundle

### 1.2 Source-map-explorer

Alternative analyzer that uses source maps for accurate module attribution.

**Installation:**

```bash
npm install --save-dev source-map-explorer
```

**Usage:**

```bash
npm run build
npx source-map-explorer 'build/static/js/*.js'
npx source-map-explorer 'build/static/js/*.js' --html bundle-explorer.html
```

**Docusaurus Configuration for Source Maps:**

```typescript
const config: Config = {
  webpack: {
    devtool: 'source-map',
  },
};
```

**Advantages over Bundle Analyzer:**

1. More accurate attribution for minified code
2. Better handling of transpiled code
3. Can analyze any bundle with source maps
4. No webpack-specific dependency

### 1.3 Bundlephobia for Dependency Analysis

Online service for analyzing npm package sizes before adding dependencies.

**CLI Usage:**

```bash
npm install --save-dev bundlephobia
npx bundlephobia @google/generative-ai
npx bundlephobia fuse.js flexsearch recharts
```

**Programmatic Usage:**

```typescript
import { getPackageStats } from 'bundlephobia';

async function analyzePackage(name: string, version?: string) {
  const stats = await getPackageStats(`${name}${version ? '@' + version : ''}`);
  console.log(`Package: ${stats.name}@${stats.version}`);
  console.log(`Gzip: ${stats.gzip} bytes`);
  return stats;
}
```

**Integration Script:**

```javascript
// scripts/analyze-deps.js
const { execSync } = require('child_process');
const pkg = require('../package.json');

const deps = Object.keys(pkg.dependencies);
const results = [];

for (const dep of deps) {
  try {
    const output = execSync('npx bundlephobia ' + dep + ' --json', { encoding: 'utf8' });
    const data = JSON.parse(output);
    results.push({ name: dep, size: data.gzip, version: pkg.dependencies[dep] });
  } catch (e) {
    console.error('Failed to analyze ' + dep);
  }
}

results.sort((a, b) => b.size - a.size);
console.table(results);
```

### 1.4 Docusaurus Built-in Analysis

Docusaurus provides built-in bundle analysis through webpack stats.

**Enabling Build Stats:**

```bash
npm run build -- --stats
```

**Custom Script for Stats Analysis:**

```typescript
// scripts/analyze-build.ts
import fs from 'fs';

interface WebpackStats {
  assets: Array<{ name: string; size: number }>;
  chunks: Array<{ id: string; names: string[]; size: number }>;
}

function analyzeBuildStats(statsPath: string) {
  const stats: WebpackStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  
  const jsAssets = stats.assets
    .filter(a => a.name.endsWith('.js'))
    .map(a => ({ name: a.name, sizeKB: Math.round(a.size / 1024) }))
    .sort((a, b) => b.sizeKB - a.sizeKB);
  
  console.log('\n=== JavaScript Assets ===');
  console.table(jsAssets);
  
  const totalJS = jsAssets.reduce((sum, a) => sum + a.sizeKB, 0);
  console.log('\nTotal JS Size: ' + totalJS + 'KB');
  
  return { jsAssets, totalJS };
}

analyzeBuildStats('./build/webpack-stats.json');
```

---

## 2. Code Splitting Strategies

### 2.1 React.lazy and Suspense

React.lazy enables dynamic imports for components, reducing initial bundle size.

**Basic Pattern:**

```typescript
// src/components/SearchModal/lazy.ts
import React from 'react';

const SearchModal = React.lazy(() => import('./SearchModal'));
const AIAnswerPanel = React.lazy(() => import('./AIAnswerPanel'));
const SearchAnalyticsDashboard = React.lazy(() => import('./SearchAnalytics'));

export { SearchModal, AIAnswerPanel, SearchAnalyticsDashboard };
```

**Usage with Suspense:**

```typescript
// src/theme/NavbarItem/SearchNavItem.tsx
import React, { Suspense, useState } from 'react';

const SearchModal = React.lazy(() => import('@theme/SearchModal'));

function SearchNavItem() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Search</button>
      {isOpen && (
        <Suspense fallback={<SearchModalFallback />}>
          <SearchModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

function SearchModalFallback() {
  return (
    <div className="search-modal-loading">
      <div className="spinner" />
      <span>Loading search...</span>
    </div>
  );
}
```

**Preloading Strategies:**

```typescript
// src/utils/preload.ts
let searchModalPromise: Promise<any> | null = null;

export function preloadSearchModal() {
  if (!searchModalPromise) {
    searchModalPromise = import('@theme/SearchModal');
  }
  return searchModalPromise;
}

// Preload after 2 seconds idle
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => preloadSearchModal(), 2000);
});

// Preload on search button hover
searchButton.addEventListener('mouseenter', () => {
  preloadSearchModal();
}, { once: true });
```

**Error Boundary for Lazy Components:**

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class LazyErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="lazy-error">
          <p>Failed to load component</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 2.2 Dynamic Imports

Dynamic imports allow conditional loading of modules based on runtime conditions.

**Condition-based Loading:**

```typescript
// src/utils/feature-loader.ts
export async function loadSearchEngine(type: 'fuse' | 'flexsearch' | 'ai') {
  switch (type) {
    case 'fuse':
      return import('fuse.js').then(m => m.default);
    case 'flexsearch':
      return import('flexsearch').then(m => m.default);
    case 'ai':
      return import('@google/generative-ai').then(m => m.GoogleGenerativeAI);
    default:
      throw new Error('Unknown search engine: ' + type);
  }
}
```

**Feature Detection:**

```typescript
// src/utils/capability-loader.ts
export async function loadSearchCapabilities() {
  const capabilities: string[] = [];
  
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    capabilities.push('ai');
  }
  
  if (process.env.SUPABASE_URL) {
    const { createClient } = await import('@supabase/supabase-js');
    capabilities.push('analytics');
  }
  
  return capabilities;
}
```

### 2.3 Chunk Configuration in Docusaurus

Docusaurus allows custom webpack configuration for chunk splitting.

**Basic Chunk Configuration:**

```typescript
// docusaurus.config.ts
const config: Config = {
  webpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 40,
          },
          search: {
            test: /[\\/]node_modules[\\/](fuse\.js|flexsearch)[\\/]/,
            name: 'search-vendor',
            chunks: 'async',
            priority: 30,
          },
          ai: {
            test: /[\\/]node_modules[\\/]@google[\\/]generative-ai[\\/]/,
            name: 'ai-vendor',
            chunks: 'async',
            priority: 30,
          },
          analytics: {
            test: /[\\/]node_modules[\\/](@supabase|recharts)[\\/]/,
            name: 'analytics-vendor',
            chunks: 'async',
            priority: 30,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
          },
        },
      },
    },
  },
};
```

### 2.4 Vendor Chunk Optimization

**Externalizing Heavy Dependencies:**

```typescript
const config: Config = {
  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
      async: true,
    },
  ],
  webpack: {
    externals: {
      'chart.js': 'Chart',
    },
  },
};
```

**Tree-shaking Optimization:**

```typescript
// Bad: Imports entire library
import _ from 'lodash';

// Good: Import specific functions
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// Or use lodash-es for better tree-shaking
import { debounce, throttle } from 'lodash-es';
```

**Side-effect-free Packages:**

```json
// package.json
{
  "sideEffects": false
}
```

---

## 3. Performance Optimization

### 3.1 Lazy Loading Patterns for React

**Intersection Observer Pattern:**

```typescript
// src/hooks/useLazyLoad.ts
import { useState, useEffect, useRef, RefObject } from 'react';

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: LazyLoadOptions = {}): [RefObject<HTMLElement>, boolean] {
  const { rootMargin = '200px', threshold = 0, triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);
  
  return [ref, isVisible];
}
```

**Request Idle Callback Pattern:**

```typescript
// src/utils/idle-load.ts
export function idleLoad<T>(importer: () => Promise<T>, options: { timeout?: number } = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const { timeout = 2000 } = options;
    
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(
        () => importer().then(resolve).catch(reject),
        { timeout }
      );
    } else {
      setTimeout(() => importer().then(resolve).catch(reject), 1);
    }
  });
}
```

### 3.2 Search Index Caching Strategies

**LocalStorage Caching:**

```typescript
// src/utils/search-cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

class SearchCache {
  private maxAge: number;
  private version: string;
  private prefix: string;
  
  constructor(options: { maxAge?: number; version?: string; prefix?: string } = {}) {
    this.maxAge = options.maxAge || 24 * 60 * 60 * 1000;
    this.version = options.version || '1.0.0';
    this.prefix = options.prefix || 'nxgen-search';
  }
  
  private getKey(key: string): string {
    return this.prefix + ':' + key;
  }
  
  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: this.version,
    };
    
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (e) {
      console.warn('Cache storage failed:', e);
      this.prune();
    }
  }
  
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.getKey(key));
      if (!raw) return null;
      
      const entry: CacheEntry<T> = JSON.parse(raw);
      
      if (entry.version !== this.version) {
        this.delete(key);
        return null;
      }
      
      if (Date.now() - entry.timestamp > this.maxAge) {
        this.delete(key);
        return null;
      }
      
      return entry.data;
    } catch (e) {
      return null;
    }
  }
  
  delete(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }
  
  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  }
  
  prune(): void {
    const now = Date.now();
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => {
        try {
          const entry = JSON.parse(localStorage.getItem(k) || '{}');
          if (now - entry.timestamp > this.maxAge) {
            localStorage.removeItem(k);
          }
        } catch (e) {
          localStorage.removeItem(k);
        }
      });
  }
}

export const searchCache = new SearchCache();
```

**Stale-While-Revalidate Pattern:**

```typescript
// src/utils/swr-cache.ts
interface SWRCacheOptions {
  maxAge: number;
  staleAge: number;
  fetcher: () => Promise<any>;
}

class SWRCache {
  private options: SWRCacheOptions;
  private refreshPromise: Promise<any> | null = null;
  
  constructor(options: SWRCacheOptions) {
    this.options = options;
  }
  
  async get<T>(key: string): Promise<T> {
    const cached = searchCache.get<T>(key);
    
    if (cached) {
      if (this.isStale(key)) {
        this.revalidate(key);
      }
      return cached;
    }
    
    return this.revalidate(key);
  }
  
  private isStale(key: string): boolean {
    return true;
  }
  
  private async revalidate<T>(key: string): Promise<T> {
    if (this.refreshPromise) return this.refreshPromise;
    
    this.refreshPromise = this.options.fetcher()
      .then(data => {
        searchCache.set(key, data);
        this.refreshPromise = null;
        return data;
      })
      .catch(err => {
        this.refreshPromise = null;
        throw err;
      });
    
    return this.refreshPromise;
  }
}
```

### 3.3 LocalStorage vs IndexedDB for Caching

**LocalStorage Characteristics:**

| Aspect | LocalStorage |
|--------|-------------|
| Capacity | ~5MB |
| API | Synchronous |
| Data Type | Strings only |
| Performance | Blocks main thread |
| Browser Support | All browsers |
| Use Case | Small, simple data |

**IndexedDB Characteristics:**

| Aspect | IndexedDB |
|--------|-----------|
| Capacity | ~50MB+ (varies) |
| API | Asynchronous |
| Data Type | Any structured data |
| Performance | Non-blocking |
| Browser Support | Modern browsers |
| Use Case | Large, complex data |

**IndexedDB Implementation:**

```typescript
// src/utils/indexeddb-cache.ts
class IndexedDBCache {
  private db: IDBDatabase | null = null;
  private dbName: string;
  private storeName: string;
  
  constructor(options: { dbName?: string; storeName?: string } = {}) {
    this.dbName = options.dbName || 'nxgen-search-cache';
    this.storeName = options.storeName || 'search-data';
  }
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }
  
  async set<T>(key: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, data, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ? request.result.data : null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const idbCache = new IndexedDBCache();
```

**Decision Matrix:**

| Use Case | Recommended Storage |
|----------|---------------------|
| Search index (< 1MB) | LocalStorage |
| Search index (> 1MB) | IndexedDB |
| User preferences | LocalStorage |
| Embeddings cache | IndexedDB |
| Session state | LocalStorage |
| Offline documents | IndexedDB |

### 3.4 Service Worker Considerations

**Docusaurus PWA Plugin:**

```typescript
// docusaurus.config.ts
const config: Config = {
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          { tagName: 'link', attributes: { rel: 'icon', href: '/img/favicon.ico' } },
          { tagName: 'link', attributes: { rel: 'manifest', href: '/manifest.json' } },
          { tagName: 'meta', attributes: { name: 'theme-color', content: '#2563eb' } },
        ],
      },
    ],
  ],
};
```

**Cache Strategies:**

| Strategy | Use Case |
|----------|----------|
| Cache-first | Static assets (JS, CSS, fonts) |
| Network-first | API calls, dynamic content |
| Stale-while-revalidate | Search index, frequently updated |

---

## 4. Bundle Size Benchmarks

### 4.1 Typical Docusaurus Bundle Sizes

**Baseline Docusaurus (no plugins):**

| Bundle | Size (Minified) | Size (Gzipped) |
|--------|-----------------|----------------|
| main.js | ~180KB | ~60KB |
| runtime.js | ~5KB | ~2KB |
| vendors.js | ~250KB | ~85KB |
| styles.css | ~20KB | ~5KB |
| **Total JS** | **~435KB** | **~147KB** |

**Docusaurus with Common Plugins:**

| Plugin | Added Size (Gzipped) |
|--------|---------------------|
| @docusaurus/plugin-content-docs | +5KB |
| @docusaurus/plugin-content-blog | +3KB |
| @docusaurus/plugin-content-pages | +1KB |
| @docusaurus/plugin-search-algolia | +8KB |
| @docusaurus/theme-classic | +15KB |
| @docusaurus/theme-mermaid | +25KB |

### 4.2 Search Library Sizes

| Library | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
| fuse.js v7.0 | 72KB | 22KB | Full-featured fuzzy search |
| fuse.js (basic) | 45KB | 14KB | Minimal configuration |
| flexsearch v0.7 | 85KB | 25KB | High-performance full-text |
| minisearch v6.0 | 28KB | 10KB | Lightweight alternative |
| lunr v2.3 | 52KB | 18KB | Classic search library |
| @orama/orama v2.0 | 45KB | 15KB | Modern full-text |
| algoliasearch v4.0 | 120KB | 35KB | Full client |

**Recommendation for Docusaurus:**

```typescript
// For simple search: minisearch (10KB gzipped)
import MiniSearch from 'minisearch';

// For advanced fuzzy: fuse.js (22KB gzipped)
import Fuse from 'fuse.js';

// For large indexes: flexsearch (25KB gzipped)
import FlexSearch from 'flexsearch';
```

### 4.3 AI Library Overhead (Google Generative AI)

| Package | Minified | Gzipped | Dependencies |
|---------|----------|---------|--------------|
| @google/generative-ai v0.2 | 95KB | 28KB | None |
| @google/generative-ai (chat only) | 40KB | 12KB | Tree-shaken |

**Optimization Tips:**

```typescript
// Dynamic import for AI features
const loadAI = async () => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  return new GoogleGenerativeAI(apiKey);
};
```

**Token Usage Overhead:**

| Operation | Average Tokens | Latency |
|-----------|---------------|---------|
| Embedding generation (per 1K chars) | ~300 | ~50ms |
| Chat completion (simple) | ~150 | ~500ms |
| Chat completion (with context) | ~500 | ~1s |
| Streaming response (100 chars) | ~100 | ~200ms |

### 4.4 Analytics Library Overhead (Supabase, Recharts)

**Supabase Client:**

| Package | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
| @supabase/supabase-js v2.0 | 180KB | 55KB | Full client |
| @supabase/supabase-js (auth only) | 80KB | 25KB | Tree-shaken |
| @supabase/supabase-js (db only) | 60KB | 18KB | Tree-shaken |

**Recharts Library:**

| Package | Minified | Gzipped | Notes |
|---------|----------|---------|-------|
| recharts v2.10 | 380KB | 110KB | Full library |
| recharts (LineChart only) | 120KB | 35KB | Tree-shaken |
| recharts (PieChart only) | 90KB | 28KB | Tree-shaken |

**Optimization:**

```typescript
// Lazy load entire analytics dashboard
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
```

**Alternative Lightweight Libraries:**

| Library | Size (Gzipped) | Use Case |
|---------|---------------|----------|
| chart.js | 45KB | General charts |
| victory | 85KB | React-native compatible |
| nivo | 70KB | D3-based |
| react-chartjs-2 | 50KB | Chart.js wrapper |
| uPlot | 15KB | High-performance |

---

## 5. Production Build Verification

### 5.1 Critical Rendering Path

The critical rendering path determines how quickly content becomes visible to users.

**Key Metrics:**

| Metric | Definition | Target |
|--------|------------|--------|
| FCP (First Contentful Paint) | First text/image rendered | < 1.5s |
| LCP (Largest Contentful Paint) | Largest content element | < 2.5s |
| FID (First Input Delay) | Time to interactive | < 100ms |
| CLS (Cumulative Layout Shift) | Visual stability | < 0.1 |
| TTI (Time to Interactive) | Full interactivity | < 3.8s |

**Docusaurus Critical Path:**

```
1. HTML download (~50KB gzipped)
2. CSS download (~20KB gzipped) - Blocks rendering
3. Critical JS download (~100KB gzipped)
4. React hydration (~500ms)
5. Full interactivity
```

**Optimization Techniques:**

```typescript
// Inline critical CSS
const config: Config = {
  webpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  },
};
```

**Preload Critical Assets:**

```typescript
// docusaurus.config.ts
const config: Config = {
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/assets/js/main.js',
        as: 'script',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/assets/css/styles.css',
        as: 'style',
      },
    },
  ],
};
```

### 5.2 Asset Optimization

**Image Optimization:**

```typescript
// Use responsive images
const config: Config = {
  presets: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
  ],
};
```

**Image Format Recommendations:**

| Format | Use Case | Savings vs JPEG |
|--------|----------|-----------------|
| WebP | Photos, complex images | 25-35% |
| AVIF | Modern browsers only | 50% |
| PNG | Transparency needed | N/A |
| SVG | Icons, logos | Vector scaling |

**Font Optimization:**

```typescript
// docusaurus.config.ts
const config: Config = {
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
      type: 'text/css',
    },
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],
};
```

**CSS Optimization:**

```typescript
// Purge unused CSS
const config: Config = {
  webpack: {
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync('./src/**/*.{js,jsx,ts,tsx}'),
        safelist: {
          standard: [/docusaurus/, /theme-/],
        },
      }),
    ],
  },
};
```

### 5.3 Cache Busting

**Docusaurus Built-in Cache Busting:**

Docusaurus automatically adds content hashes to filenames:

```
main.abc123.js
styles.def456.css
```

**Manual Cache Busting for Custom Assets:**

```typescript
// Using version query parameter
const assetUrl = '/custom-asset.js?v=' + process.env.BUILD_VERSION;

// Or in docusaurus.config.ts
const config: Config = {
  customFields: {
    buildVersion: Date.now().toString(),
  },
};
```

**Service Worker Cache Management:**

```typescript
// sw.js
const CACHE_VERSION = 'v1.2.3';
const CACHE_NAME = 'nxgen-docs-' + CACHE_VERSION;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});
```

**HTTP Cache Headers:**

```
# Static assets (immutable)
Cache-Control: public, max-age=31536000, immutable

# HTML pages
Cache-Control: public, max-age=0, must-revalidate

# Search index
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

### 5.4 CDN Considerations

**CDN Configuration for Docusaurus:**

```yaml
# Netlify.toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**Cloudflare Page Rules:**

| Pattern | Cache Level | Edge Cache TTL |
|---------|-------------|----------------|
| *static* | Cache Everything | 1 year |
| *assets* | Cache Everything | 1 year |
| /*.js | Cache Everything | 1 year |
| /*.css | Cache Everything | 1 year |
| / | Standard | 1 hour |

**CDN Performance Checklist:**

1. Enable Gzip/Brotli compression
2. Set appropriate cache headers
3. Use HTTP/2 or HTTP/3
4. Enable edge caching for static assets
5. Configure proper CORS headers for fonts

---

## 6. Documentation Best Practices

### 6.1 Feature Documentation Structure

**Standard Feature Documentation Template:**

```markdown
# Feature Name

## Overview

Brief description of what the feature does and why it exists.

## Quick Start

```bash
# Installation steps
npm install feature-package
```

## Usage

### Basic Usage

```typescript
import { Feature } from 'feature-package';

const feature = new Feature({ option: 'value' });
```

### Advanced Usage

```typescript
// Advanced configuration example
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option | string | '' | Description |

## API Reference

### Methods

#### methodName(param: Type): ReturnType

Description of the method.

## Examples

### Example 1: Basic Use Case

### Example 2: Advanced Use Case

## Troubleshooting

Common issues and solutions.

## See Also

Related features and documentation.
```

### 6.2 Environment Variable Documentation

**Template for Environment Variables:**

```markdown
# Environment Variables

## Required Variables

### GEMINI_API_KEY

- **Required**: Yes
- **Type**: String
- **Description**: API key for Google Generative AI
- **Example**: `GEMINI_API_KEY=your-api-key-here`
- **How to obtain**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### SUPABASE_URL

- **Required**: Yes (for analytics)
- **Type**: String (URL)
- **Description**: Supabase project URL
- **Example**: `SUPABASE_URL=https://xyzabc.supabase.co`

## Optional Variables

### ANALYZE

- **Required**: No
- **Type**: Boolean
- **Default**: false
- **Description**: Enable bundle analysis during build
- **Usage**: `ANALYZE=true npm run build`

## Configuration File

Create a `.env` file in the project root:

```bash
# .env.example
GEMINI_API_KEY=your-api-key-here
SUPABASE_URL=https://xyzabc.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
ANALYZE=false
```

## Security Notes

- Never commit `.env` files to version control
- Use `.env.example` as a template
- Rotate keys periodically
- Use environment-specific keys
```

**Type-safe Environment Variables:**

```typescript
// src/env.ts
const requiredEnvVars = ['GEMINI_API_KEY', 'SUPABASE_URL'] as const;

type EnvVar = typeof requiredEnvVars[number];

function getEnvVar(name: EnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error('Missing required environment variable: ' + name);
  }
  return value;
}

export const env = {
  geminiApiKey: getEnvVar('GEMINI_API_KEY'),
  supabaseUrl: getEnvVar('SUPABASE_URL'),
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  isAnalyze: process.env.ANALYZE === 'true',
} as const;
```

### 6.3 Usage Examples

**Search Feature Examples:**

```typescript
// Example: Basic search
import { search } from '@site/src/utils/search';

const results = await search('installation guide');
console.log(results);

// Example: Search with filters
const filteredResults = await search('api', {
  type: 'page',
  version: '2.0',
  limit: 10,
});

// Example: AI-powered search
const aiResults = await search('how to configure authentication', {
  ai: true,
  context: 'Previous search context',
});
```

**Analytics Dashboard Examples:**

```typescript
// Example: Track search event
import { trackSearch } from '@site/src/utils/analytics';

await trackSearch({
  query: 'user query',
  results: 10,
  clicked: 'doc-id',
  timestamp: Date.now(),
});

// Example: Get analytics data
import { getAnalytics } from '@site/src/utils/analytics';

const data = await getAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  metrics: ['searches', 'clicks', 'ai_queries'],
});
```

**Caching Examples:**

```typescript
// Example: Basic caching
import { searchCache } from '@site/src/utils/search-cache';

// Cache search results
searchCache.set('search-results', results);

// Retrieve cached results
const cached = searchCache.get<SearchResult[]>('search-results');

// Example: Stale-while-revalidate
import { SWRCache } from '@site/src/utils/swr-cache';

const searchCache = new SWRCache({
  maxAge: 3600000,
  staleAge: 300000,
  fetcher: () => fetchSearchIndex(),
});

const results = await searchCache.get('search-index');
```

---

## Summary

Phase 5 covers comprehensive optimization and deployment preparation:

1. **Bundle Analysis Tools**: Webpack Bundle Analyzer, source-map-explorer, Bundlephobia, Docusaurus built-in analysis
2. **Code Splitting Strategies**: React.lazy, dynamic imports, chunk configuration, vendor optimization
3. **Performance Optimization**: Lazy loading patterns, search index caching, LocalStorage vs IndexedDB, service workers
4. **Bundle Size Benchmarks**: Docusaurus baseline, search libraries (10-25KB), AI libraries (28KB), analytics libraries (55-110KB)
5. **Production Build Verification**: Critical rendering path, asset optimization, cache busting, CDN configuration
6. **Documentation Best Practices**: Feature structure, environment variables, usage examples

**Key Targets:**

| Metric | Target |
|--------|--------|
| Search bundle (gzipped) | < 50KB |
| Time to interactive | < 3s |
| Search response time | < 100ms |
| AI answer generation | < 3s |
| Lighthouse score | > 90 |
