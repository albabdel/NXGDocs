# NXGEN GCXONE Documentation Platform - Complete Technical Build Guide
## Enhanced Docusaurus + Headless CMS + Algolia DocSearch

**Version:** 2.0 (Enhanced Architecture)  
**Date:** December 2025  
**Goal:** Build a documentation platform matching or exceeding Evalink's quality

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Algolia DocSearch Integration](#algolia-docsearch-integration)
4. [Headless CMS Integration](#headless-cms-integration)
5. [Advanced Tagging System](#advanced-tagging-system)
6. [Design System & UI Components](#design-system--ui-components)
7. [Complete Build Instructions](#complete-build-instructions)
8. [Writer-Friendly CMS Configuration](#writer-friendly-cms-configuration)
9. [Deployment & CI/CD](#deployment--cicd)
10. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

### Current State Analysis
**Evalink's Documentation Structure:**
- Clean, modern design with excellent UX
- Role-based organization (Admin, Manager, Operator, Operator Minimal)
- Powerful Algolia DocSearch integration
- Dark mode support
- Right-hand table of contents
- Smooth navigation with breadcrumbs
- Article feedback forms
- Newsletter integration
- Fast, responsive interface

### Your Enhanced Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Docusaurus v3 (React + MDX)                      │   │
│  │    - Custom theme & components                       │   │
│  │    - Dark mode                                       │   │
│  │    - Responsive design                               │   │
│  │    - Advanced navigation                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                   SEARCH LAYER                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Algolia DocSearch                                 │   │
│  │    - Intelligent indexing                            │   │
│  │    - Faceted search with filters                     │   │
│  │    - Tag-based filtering                             │   │
│  │    - Contextual results                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                  CONTENT MANAGEMENT LAYER                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Strapi CMS (Headless)                            │   │
│  │    - Visual content editor                           │   │
│  │    - No-code article creation                        │   │
│  │    - Media library                                   │   │
│  │    - Workflow management                             │   │
│  │    - Webhooks for auto-rebuild                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Database (PostgreSQL/MongoDB)                     │   │
│  │    - Article content                                 │   │
│  │    - Metadata & tags                                 │   │
│  │    - User preferences                                │   │
│  │    - Analytics data                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                 DEPLOYMENT LAYER                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Vercel/Netlify (Static Site)                     │   │
│  │    Railway/Heroku (Strapi Backend)                  │   │
│  │    Algolia Cloud (Search)                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
**Docusaurus v3** - Meta's documentation framework
- **Why:** Production-ready, excellent DX, built-in features
- **Benefits:** SEO optimized, fast, React-based, MDX support
- **Version:** 3.6.0+

### Headless CMS
**Strapi v4** - Open-source Node.js CMS
- **Why:** Best balance of power, flexibility, and ease-of-use
- **Benefits:** 
  - Fully customizable admin panel
  - No-code content editing
  - Built-in media library
  - Webhook support
  - Role-based permissions
  - REST & GraphQL APIs
- **Alternative:** Sanity.io (if you need real-time collaboration)

### Search Engine
**Algolia DocSearch** - Purpose-built for documentation
- **Why:** Industry standard, fast, intelligent
- **Benefits:**
  - Sub-20ms search results
  - Faceted filtering
  - Typo tolerance
  - Contextual ranking
  - Free for open-source/documentation

### Styling & UI
**Tailwind CSS** + **shadcn/ui** + **Framer Motion**
- **Why:** Utility-first, component library, animations
- **Benefits:** Consistent design, easy customization, modern UI

### Additional Tools
- **MDX v3:** Enhanced Markdown with React components
- **TypeScript:** Type safety
- **React v18:** Latest features (Suspense, Server Components)
- **PostgreSQL:** Structured data for CMS
- **Redis:** Caching layer (optional)

---

## Algolia DocSearch Integration

### Step 1: Apply for Algolia DocSearch (Free)

```bash
# Apply at: https://docsearch.algolia.com/apply/
# Requirements:
# - Public documentation
# - You own the site
# - Updated content
```

**Application Details:**
- Website URL: https://docs.nxgen.cloud (or your domain)
- Email: dev@nxgen.info
- Documentation scope: Technical product documentation
- Repository: [Your GitHub URL]

### Step 2: Install Algolia in Docusaurus

```bash
npm install --save @docusaurus/theme-search-algolia
# or
yarn add @docusaurus/theme-search-algolia
```

### Step 3: Configure in docusaurus.config.js

```javascript
module.exports = {
  // ... other config
  
  themeConfig: {
    // ... other theme config
    
    algolia: {
      // Application ID from Algolia dashboard
      appId: 'YOUR_APP_ID',
      
      // Public API key (search-only)
      apiKey: 'YOUR_SEARCH_API_KEY',
      
      // Index name
      indexName: 'nxgen_documentation',
      
      // Optional: See doc section below
      contextualSearch: true,
      
      // Optional: Algolia search parameters
      searchParameters: {
        facetFilters: ['language:en', 'version:latest'],
      },
      
      //... Optional: paths to exclude
      externalUrlRegex: 'external\\.com|domain\\.com',
      
      // Optional: Replace parts of the item URLs from Algolia
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },
      
      // Optional: Search page path for Algolia
      searchPagePath: 'search',
    },
  },
};
```

### Step 4: Enhanced Configuration with Facets

```javascript
// docusaurus.config.js - Advanced Algolia config

module.exports = {
  themeConfig: {
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'nxgen_documentation',
      
      // CRITICAL: Enable contextual search
      contextualSearch: true,
      
      // Advanced search parameters with faceted filtering
      searchParameters: {
        facetFilters: [
          'language:en',
          ['role:admin', 'role:operator', 'role:installer'] // OR filter
        ],
        facets: [
          'role',
          'category',
          'device_type',
          'feature_type',
          'difficulty_level'
        ],
        hitsPerPage: 10,
        analytics: true,
        clickAnalytics: true,
        enableReRanking: true, // AI-powered ranking
      },
      
      // Customize the search modal
      insights: true, // Enable search insights
      
      // Replace search result pathnames if needed
      replaceSearchResultPathname: {
        from: '/docs/', 
        to: '/',
      },
    },
  },
};
```

### Step 5: Custom Search Configuration (Advanced)

Create `src/theme/SearchBar/index.js`:

```javascript
import React from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';
import { useColorMode } from '@docusaurus/theme-common';

export default function SearchBar() {
  const { colorMode } = useColorMode();
  
  return (
    <DocSearch
      appId="YOUR_APP_ID"
      indexName="nxgen_documentation"
      apiKey="YOUR_SEARCH_API_KEY"
      
      // Transform items before display
      transformItems={(items) => {
        return items.map((item) => {
          // Add custom badge based on role
          if (item.hierarchy.lvl0 === 'Admin Guide') {
            item.badge = 'ADMIN';
          }
          return item;
        });
      }}
      
      // Filter results based on user context
      searchParameters={{
        facetFilters: [
          'language:en',
          // Dynamically set based on user role if authenticated
          getCurrentUserRole() ? `role:${getCurrentUserRole()}` : '',
        ].filter(Boolean),
      }}
      
      // Custom hit component for better display
      hitComponent={({ hit, children }) => {
        return (
          <a href={hit.url} className="custom-hit">
            {hit.badge && <span className="badge">{hit.badge}</span>}
            {children}
          </a>
        );
      }}
    />
  );
}

function getCurrentUserRole() {
  // Implement your role detection logic
  // Could come from URL params, cookies, or auth context
  return null;
}
```

### Step 6: Configure Algolia Crawler (docsearch-config.json)

```json
{
  "index_name": "nxgen_documentation",
  "start_urls": [
    {
      "url": "https://docs.nxgen.cloud/",
      "selectors_key": "default",
      "tags": ["homepage"]
    },
    {
      "url": "https://docs.nxgen.cloud/admin/",
      "selectors_key": "admin",
      "tags": ["admin", "role:admin"]
    },
    {
      "url": "https://docs.nxgen.cloud/operator/",
      "selectors_key": "operator",
      "tags": ["operator", "role:operator"]
    },
    {
      "url": "https://docs.nxgen.cloud/installer/",
      "selectors_key": "installer",
      "tags": ["installer", "role:installer"]
    }
  ],
  "sitemap_urls": [
    "https://docs.nxgen.cloud/sitemap.xml"
  ],
  "selectors": {
    "default": {
      "lvl0": {
        "selector": ".theme-doc-sidebar-menu .menu__link--active",
        "default_value": "Documentation"
      },
      "lvl1": "article h1",
      "lvl2": "article h2",
      "lvl3": "article h3",
      "lvl4": "article h4",
      "lvl5": "article h5",
      "text": "article p, article li"
    },
    "admin": {
      "lvl0": {
        "selector": "",
        "default_value": "Admin Guide"
      },
      "lvl1": "article h1",
      "lvl2": "article h2",
      "lvl3": "article h3",
      "text": "article p, article li"
    }
  },
  "selectors_exclude": [
    ".hash-link",
    ".edit-page-link",
    ".nav-link-text"
  ],
  "custom_settings": {
    "attributesForFaceting": [
      "language",
      "version",
      "tags",
      "role",
      "category",
      "device_type"
    ],
    "attributesToRetrieve": [
      "hierarchy",
      "content",
      "anchor",
      "url",
      "tags"
    ],
    "searchableAttributes": [
      "unordered(hierarchy.lvl0)",
      "unordered(hierarchy.lvl1)",
      "unordered(hierarchy.lvl2)",
      "unordered(hierarchy.lvl3)",
      "unordered(hierarchy.lvl4)",
      "unordered(hierarchy.lvl5)",
      "content"
    ],
    "distinct": true,
    "attributeForDistinct": "url",
    "customRanking": [
      "desc(weight.pageRank)",
      "desc(weight.level)",
      "asc(weight.position)"
    ],
    "ranking": [
      "words",
      "filters",
      "typo",
      "attribute",
      "proximity",
      "exact",
      "custom"
    ],
    "highlightPreTag": "<span class=\"algolia-docsearch-suggestion--highlight\">",
    "highlightPostTag": "</span>",
    "minWordSizefor1Typo": 3,
    "minWordSizefor2Typos": 7
  }
}
```

---

## Advanced Tagging System

### Tag Structure for Optimal Search

```javascript
// src/utils/tags.js

export const TAG_CATEGORIES = {
  // User Role Tags
  ROLE: {
    admin: {
      label: 'Admin',
      description: 'Administrator documentation',
      color: '#ff6b6b'
    },
    operator: {
      label: 'Operator',
      description: 'Operator documentation',
      color: '#4ecdc4'
    },
    installer: {
      label: 'Installer',
      description: 'Installation documentation',
      color: '#45b7d1'
    },
    manager: {
      label: 'Manager',
      description: 'Management documentation',
      color: '#f9ca24'
    }
  },
  
  // Content Category Tags
  CATEGORY: {
    getting_started: {
      label: 'Getting Started',
      icon: '🚀',
      color: '#00d2d3'
    },
    configuration: {
      label: 'Configuration',
      icon: '⚙️',
      color: '#0abde3'
    },
    troubleshooting: {
      label: 'Troubleshooting',
      icon: '🔧',
      color: '#ee5a6f'
    },
    features: {
      label: 'Features',
      icon: '✨',
      color: '#c56cf0'
    },
    api: {
      label: 'API',
      icon: '🔌',
      color: '#48dbfb'
    }
  },
  
  // Device Type Tags
  DEVICE_TYPE: {
    hikvision: { label: 'Hikvision', icon: '📷' },
    dahua: { label: 'Dahua', icon: '📷' },
    adpro: { label: 'ADPRO', icon: '🚨' },
    milestone: { label: 'Milestone', icon: '🎬' },
    hanwha: { label: 'Hanwha', icon: '📷' },
    // ... more devices
  },
  
  // Feature Type Tags
  FEATURE_TYPE: {
    ai_analytics: { label: 'AI Analytics', icon: '🧠' },
    video: { label: 'Video', icon: '🎥' },
    alarms: { label: 'Alarms', icon: '🚨' },
    reporting: { label: 'Reporting', icon: '📊' },
    integration: { label: 'Integration', icon: '🔗' }
  },
  
  // Difficulty Level
  DIFFICULTY: {
    beginner: { label: 'Beginner', color: '#2ecc71' },
    intermediate: { label: 'Intermediate', color: '#f39c12' },
    advanced: { label: 'Advanced', color: '#e74c3c' }
  },
  
  // Platform
  PLATFORM: {
    GCXONE: { label: 'GCXONE', icon: '🔵' },
    talos: { label: 'Talos', icon: '🟣' },
    both: { label: 'Both Platforms', icon: '⚡' }
  }
};

// Helper to generate Algolia-compatible tags
export function generateTags(metadata) {
  const tags = [];
  
  if (metadata.role) {
    tags.push(`role:${metadata.role}`);
  }
  
  if (metadata.category) {
    tags.push(`category:${metadata.category}`);
  }
  
  if (metadata.device_type) {
    tags.push(`device:${metadata.device_type}`);
  }
  
  if (metadata.feature_type) {
    tags.push(`feature:${metadata.feature_type}`);
  }
  
  if (metadata.difficulty) {
    tags.push(`difficulty:${metadata.difficulty}`);
  }
  
  if (metadata.platform) {
    tags.push(`platform:${metadata.platform}`);
  }
  
  return tags;
}
```

### Using Tags in MDX Files

```mdx
---
title: "Adding Hikvision NVR - Admin Configuration"
description: "Step-by-step guide for administrators to add Hikvision devices"
tags:
  - role:admin
  - category:configuration
  - device:hikvision
  - difficulty:intermediate
  - platform:GCXONE
keywords: [Hikvision, NVR, configuration, admin, GCXONE]
---

# Adding Hikvision NVR

Your content here...
```

### Custom Tags Component

Create `src/components/Tags/index.js`:

```javascript
import React from 'react';
import { TAG_CATEGORIES } from '@site/src/utils/tags';
import styles from './styles.module.css';

export default function TagsList({ tags }) {
  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag) => {
        const [category, value] = tag.split(':');
        const tagData = TAG_CATEGORIES[category.toUpperCase()]?.[value];
        
        if (!tagData) return null;
        
        return (
          <span 
            key={tag}
            className={styles.tag}
            style={{ 
              backgroundColor: tagData.color,
              borderColor: tagData.color 
            }}
          >
            {tagData.icon && <span className={styles.icon}>{tagData.icon}</span>}
            {tagData.label}
          </span>
        );
      })}
    </div>
  );
}
```

---

## Headless CMS Integration (Strapi)

### Why Strapi?

1. **Writer-Friendly:** Visual editor, WYSIWYG, drag-and-drop
2. **No-Code Editing:** Writers don't need to touch markdown or code
3. **Flexible:** Fully customizable content types
4. **Open-Source:** Free to use, active community
5. **Webhook Support:** Auto-rebuild docs when content changes
6. **Media Management:** Built-in media library
7. **Role-Based Access:** Control who can edit what

### Architecture: Docusaurus + Strapi

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Writer     │ ──────> │    Strapi    │ ──────> │  Docusaurus  │
│  (CMS UI)    │         │   (API)      │         │   (Build)    │
└──────────────┘         └──────────────┘         └──────────────┘
                                │
                                │ Webhook
                                ↓
                         ┌──────────────┐
                         │   Vercel     │
                         │  (Deploy)    │
                         └──────────────┘
```

### Step 1: Install Strapi

```bash
# Create Strapi project
npx create-strapi-app@latest strapi-cms --quickstart

cd strapi-cms
npm install
npm run develop
```

### Step 2: Configure Content Types in Strapi

**Create Content Type: "Documentation Article"**

```javascript
// config/api/documentation/models/documentation.settings.json
{
  "kind": "collectionType",
  "collectionName": "documentation_articles",
  "info": {
    "name": "Documentation Article",
    "description": "Individual documentation articles"
  },
  "options": {
    "draftAndPublish": true,
    "timestamps": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "description": {
      "type": "text",
      "maxLength": 500
    },
    "content": {
      "type": "richtext",
      "required": true
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "tags": {
      "type": "json",
      "default": []
    },
    "role": {
      "type": "enumeration",
      "enum": ["admin", "operator", "installer", "manager", "all"],
      "default": "all"
    },
    "device_type": {
      "type": "enumeration",
      "enum": ["hikvision", "dahua", "adpro", "milestone", "hanwha", "axis", "other", "none"]
    },
    "difficulty": {
      "type": "enumeration",
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "platform": {
      "type": "enumeration",
      "enum": ["GCXONE", "talos", "both"]
    },
    "order": {
      "type": "integer",
      "default": 0
    },
    "featured_image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "screenshots": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"]
    },
    "related_articles": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::documentation.documentation"
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    },
    "last_updated": {
      "type": "datetime"
    },
    "version": {
      "type": "string"
    }
  }
}
```

**Create Content Type: "Category"**

```javascript
// Similar structure for organizing articles into categories
{
  "kind": "collectionType",
  "collectionName": "categories",
  "info": {
    "name": "Category"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name"
    },
    "description": {
      "type": "text"
    },
    "icon": {
      "type": "string"
    },
    "parent": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "order": {
      "type": "integer"
    }
  }
}
```

### Step 3: Create Strapi-to-Docusaurus Sync Script

```javascript
// scripts/sync-from-strapi.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const DOCS_DIR = path.join(__dirname, '../docs');

async function fetchArticles() {
  const response = await axios.get(`${STRAPI_URL}/api/documentation-articles`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`
    },
    params: {
      'filters[publishedAt][$notNull]': true,
      populate: '*',
      sort: ['category.order:asc', 'order:asc']
    }
  });
  
  return response.data.data;
}

async function syncArticles() {
  console.log('Fetching articles from Strapi...');
  const articles = await fetchArticles();
  
  console.log(`Found ${articles.length} articles`);
  
  // Group by category
  const articlesByCategory = {};
  
  articles.forEach(article => {
    const { attributes } = article;
    const categorySlug = attributes.category?.data?.attributes?.slug || 'uncategorized';
    
    if (!articlesByCategory[categorySlug]) {
      articlesByCategory[categorySlug] = [];
    }
    
    articlesByCategory[categorySlug].push(attributes);
  });
  
  // Create markdown files
  for (const [categorySlug, categoryArticles] of Object.entries(articlesByCategory)) {
    const categoryDir = path.join(DOCS_DIR, categorySlug);
    
    // Create category directory
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    // Create articles
    for (const article of categoryArticles) {
      const filename = `${article.slug}.mdx`;
      const filepath = path.join(categoryDir, filename);
      
      // Generate frontmatter
      const frontmatter = {
        title: article.title,
        description: article.description,
        tags: article.tags || [],
        role: article.role,
        device_type: article.device_type,
        difficulty: article.difficulty,
        platform: article.platform,
        last_updated: article.last_updated,
        version: article.version
      };
      
      // Add SEO if exists
      if (article.seo) {
        frontmatter.keywords = article.seo.keywords;
        frontmatter.metaTitle = article.seo.metaTitle;
        frontmatter.metaDescription = article.seo.metaDescription;
      }
      
      // Convert content to MDX
      let content = article.content;
      
      // Process images
      if (article.screenshots?.data) {
        article.screenshots.data.forEach((screenshot, index) => {
          const imageUrl = `${STRAPI_URL}${screenshot.attributes.url}`;
          content = content.replace(
            `[screenshot-${index}]`,
            `![${screenshot.attributes.alternativeText || 'Screenshot'}](${imageUrl})`
          );
        });
      }
      
      // Generate markdown file
      const fileContent = `---
${yaml.dump(frontmatter)}---

${content}
`;
      
      // Write file
      fs.writeFileSync(filepath, fileContent, 'utf8');
      console.log(`✓ Created: ${filepath}`);
    }
  }
  
  console.log('Sync complete!');
}

// Run sync
syncArticles().catch(error => {
  console.error('Sync failed:', error);
  process.exit(1);
});
```

### Step 4: Configure Webhook in Strapi

```javascript
// config/webhooks.js

module.exports = {
  webhooks: {
    'rebuild-docs': {
      enabled: true,
      events: [
        'entry.create',
        'entry.update',
        'entry.delete',
        'entry.publish',
        'entry.unpublish'
      ],
      url: process.env.VERCEL_DEPLOY_HOOK || 'https://api.vercel.com/v1/integrations/deploy/...',
      headers: {}
    }
  }
};
```

### Step 5: Install Rich Text Editor in Strapi

```bash
# Install CKEditor 5 plugin for better editing experience
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic

# Or use Strapi's built-in blocks editor (recommended)
npm install @strapi/plugin-blocks-ui
```

**Configure custom editor toolbar:**

```javascript
// config/plugins.js

module.exports = {
  'blocks-ui': {
    enabled: true,
    config: {
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'code',
        'codeBlock',
        'blockQuote',
        '|',
        'imageUpload',
        'mediaEmbed',
        '|',
        'undo',
        'redo'
      ],
      image: {
        // Enable responsive images
        styles: ['alignLeft', 'alignCenter', 'alignRight'],
        resizeOptions: [
          {
            name: 'imageResize:original',
            label: 'Original',
            value: null
          },
          {
            name: 'imageResize:50',
            label: '50%',
            value: '50'
          },
          {
            name: 'imageResize:75',
            label: '75%',
            value: '75'
          }
        ],
        toolbar: [
          'imageStyle:alignLeft',
          'imageStyle:alignCenter',
          'imageStyle:alignRight',
          '|',
          'imageResize',
          '|',
          'linkImage'
        ]
      }
    }
  }
};
```

---

## Design System & UI Components

### Install Design Dependencies

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Install shadcn/ui (requires Tailwind)
npx shadcn-ui@latest init

# Install Framer Motion for animations
npm install framer-motion

# Install icons
npm install lucide-react
```

### Configure Tailwind for Docusaurus

```javascript
// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // NXGEN Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Add your brand colors
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

### Custom React Components

**1. Callout Component (Like Evalink's info boxes)**

```javascript
// src/components/Callout/index.js

import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const STYLES = {
  info: 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200',
  success: 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-200',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200',
  error: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-200',
};

export default function Callout({ type = 'info', title, children }) {
  const Icon = ICONS[type];
  
  return (
    <div className={clsx(
      'border-l-4 p-4 my-4 rounded-r-lg',
      STYLES[type]
    )}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="prose prose-sm dark:prose-invert">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Usage in MDX:**

```mdx
<Callout type="warning" title="Important">
Make sure to configure NTP synchronization before proceeding.
</Callout>
```

**2. Tabs Component**

```javascript
// src/components/Tabs/index.js

import React, { useState } from 'react';
import clsx from 'clsx';

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  const tabs = React.Children.toArray(children);
  
  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => setActiveTab(tab.props.value)}
            className={clsx(
              'px-4 py-2 font-medium text-sm transition-colors',
              'border-b-2 -mb-px',
              activeTab === tab.props.value
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.props.value === activeTab)}
      </div>
    </div>
  );
}

export function TabItem({ value, label, children }) {
  return <div>{children}</div>;
}
```

**Usage:**

```mdx
<Tabs defaultValue="admin">
  <TabItem value="admin" label="Admin Configuration">
    Admin-specific content here...
  </TabItem>
  <TabItem value="installer" label="Installer Configuration">
    Installer-specific content here...
  </TabItem>
</Tabs>
```

**3. Step-by-Step Component**

```javascript
// src/components/Steps/index.js

import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export default function Steps({ children }) {
  const steps = React.Children.toArray(children);
  
  return (
    <div className="my-8">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 mb-6 last:mb-0">
          <div className="flex flex-col items-center">
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center',
              'bg-primary-500 text-white font-semibold text-sm'
            )}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Step({ title, children }) {
  return (
    <div>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className="prose prose-sm dark:prose-invert">
        {children}
      </div>
    </div>
  );
}
```

**4. Device Card Component**

```javascript
// src/components/DeviceCard/index.js

import React from 'react';
import Link from '@docusaurus/Link';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

export default function DeviceCard({ 
  name, 
  description, 
  icon, 
  features = [], 
  link 
}) {
  return (
    <Link 
      to={link}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          {icon || <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

---

## Complete Build Instructions

### Project Structure

```
nxgen-documentation/
├── docs/                          # MDX documentation files
│   ├── getting-started/
│   ├── admin-guide/
│   ├── operator-guide/
│   ├── installer-guide/
│   ├── devices/
│   ├── features/
│   └── troubleshooting/
├── blog/                          # Blog posts (optional)
├── src/
│   ├── components/               # React components
│   │   ├── Callout/
│   │   ├── Tabs/
│   │   ├── Steps/
│   │   ├── DeviceCard/
│   │   └── Tags/
│   ├── css/
│   │   └── custom.css           # Custom styles
│   ├── pages/                    # Custom pages
│   │   └── index.js             # Homepage
│   └── utils/
│       └── tags.js              # Tag utilities
├── static/                       # Static assets
│   ├── img/
│   └── fonts/
├── strapi-cms/                   # Strapi CMS (separate)
│   ├── api/
│   ├── config/
│   └── public/
├── scripts/
│   └── sync-from-strapi.js      # Sync script
├── docusaurus.config.js
├── sidebars.js
├── tailwind.config.js
├── package.json
└── README.md
```

### Step-by-Step Build Process

#### 1. Initialize Docusaurus Project

```bash
# Create new Docusaurus site
npx create-docusaurus@latest nxgen-documentation classic --typescript

cd nxgen-documentation

# Install additional dependencies
npm install --save \
  @docusaurus/theme-search-algolia \
  clsx \
  lucide-react \
  axios \
  js-yaml

# Install dev dependencies
npm install --save-dev \
  tailwindcss \
  postcss \
  autoprefixer \
  @tailwindcss/typography \
  @tailwindcss/forms
```

#### 2. Configure docusaurus.config.js

```javascript
// docusaurus.config.js

const config = {
  title: 'NXGEN GCXONE Documentation',
  tagline: 'Complete documentation for NXGEN GCXONE platform',
  favicon: 'img/favicon.ico',
  
  url: 'https://docs.nxgen.cloud',
  baseUrl: '/',
  
  organizationName: 'nxgen',
  projectName: 'nxgen-documentation',
  
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      de: {
        label: 'Deutsch',
        direction: 'ltr',
        htmlLang: 'de-DE',
      },
      fr: {
        label: 'Français',
        direction: 'ltr',
        htmlLang: 'fr-FR',
      },
    },
  },
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/nxgen/docs/tree/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/nxgen/docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      },
    ],
  ],
  
  themeConfig: {
    image: 'img/nxgen-social-card.jpg',
    
    navbar: {
      title: 'NXGEN GCXONE',
      logo: {
        alt: 'NXGEN Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gettingStarted',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'dropdown',
          label: 'By Role',
          position: 'left',
          items: [
            {
              label: 'Admin Guide',
              to: '/docs/admin-guide',
            },
            {
              label: 'Operator Guide',
              to: '/docs/operator-guide',
            },
            {
              label: 'Installer Guide',
              to: '/docs/installer-guide',
            },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'devices',
          position: 'left',
          label: 'Devices',
        },
        {
          type: 'docSidebar',
          sidebarId: 'features',
          position: 'left',
          label: 'Features',
        },
        {
          to: '/docs/troubleshooting',
          label: 'Troubleshooting',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/nxgen/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Admin Guide',
              to: '/docs/admin-guide',
            },
            {
              label: 'API Reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Support Portal',
              href: 'https://support.nxgen.cloud',
            },
            {
              label: 'Feature Requests',
              href: 'https://feedback.nxgen.cloud',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Release Notes',
              to: '/releases',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/nxgen',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NXGEN Technology AG.`,
    },
    
    // Dark mode
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    
    // Table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    
    // Algolia DocSearch
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'nxgen_documentation',
      contextualSearch: true,
      searchParameters: {
        facetFilters: ['language:en'],
        facets: [
          'role',
          'category',
          'device_type',
          'feature_type',
          'difficulty'
        ],
      },
      insights: true,
    },
    
    // Announcement bar
    announcementBar: {
      id: 'new_release',
      content:
        '📢 New release: GCXONE 4.5 is now available! <a target="_blank" rel="noopener noreferrer" href="/releases">Learn more</a>',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      isCloseable: true,
    },
  },
  
  plugins: [
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'G-XXXXXXXXXX',
        anonymizeIP: true,
      },
    ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-XXXXXXXXXX',
        anonymizeIP: true,
      },
    ],
  ],
  
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "de", "fr"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

module.exports = config;
```

#### 3. Create Custom CSS

```css
/* src/css/custom.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ifm-color-primary: #3b82f6;
  --ifm-color-primary-dark: #2563eb;
  --ifm-color-primary-darker: #1d4ed8;
  --ifm-color-primary-darkest: #1e40af;
  --ifm-color-primary-light: #60a5fa;
  --ifm-color-primary-lighter: #93c5fd;
  --ifm-color-primary-lightest: #bfdbfe;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --ifm-color-primary: #60a5fa;
  --ifm-color-primary-dark: #3b82f6;
  --ifm-color-primary-darker: #2563eb;
  --ifm-color-primary-darkest: #1d4ed8;
  --ifm-color-primary-light: #93c5fd;
  --ifm-color-primary-lighter: #bfdbfe;
  --ifm-color-primary-lightest: #dbeafe;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--ifm-scrollbar-track-background-color);
}

::-webkit-scrollbar-thumb {
  background: var(--ifm-scrollbar-thumb-background-color);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--ifm-scrollbar-thumb-hover-background-color);
}

/* Enhanced code blocks */
.prism-code {
  @apply text-sm;
}

/* Table of contents enhancements */
.table-of-contents {
  @apply sticky top-20;
}

.table-of-contents__link {
  @apply text-sm transition-colors;
}

.table-of-contents__link--active {
  @apply text-primary-600 dark:text-primary-400 font-semibold;
}

/* Sidebar enhancements */
.theme-doc-sidebar-menu {
  @apply text-sm;
}

.menu__link {
  @apply transition-all rounded-md;
}

.menu__link:hover {
  @apply bg-gray-100 dark:bg-gray-800;
}

.menu__link--active {
  @apply bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold;
}

/* Breadcrumbs */
.breadcrumbs__link {
  @apply text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400;
}

/* Search box customization */
.DocSearch-Button {
  @apply rounded-lg;
}

/* Cards and components */
.card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6;
}

.card:hover {
  @apply border-primary-500 dark:border-primary-500 shadow-lg;
}

/* Responsive tables */
.markdown table {
  @apply text-sm;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}

/* Better link styling */
.markdown a {
  @apply text-primary-600 dark:text-primary-400 hover:underline;
}

/* Image optimization */
.markdown img {
  @apply rounded-lg shadow-md;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
```

#### 4. Build and Deploy

```bash
# Development
npm run start

# Production build
npm run build

# Serve production build locally
npm run serve

# Clear cache if needed
npm run clear
```

---

## Writer-Friendly CMS Configuration

### Strapi Admin Panel Customization

```javascript
// config/admin.js

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  
  // Custom branding
  branding: {
    logo: '/uploads/nxgen_logo.png',
    favicon: '/uploads/favicon.png',
  },
  
  // Customize admin panel
  theme: {
    colors: {
      primary100: '#bfdbfe',
      primary200: '#93c5fd',
      primary500: '#3b82f6',
      primary600: '#2563eb',
      primary700: '#1d4ed8',
    },
  },
});
```

### Custom Field Types for Writers

```javascript
// Add in Strapi admin panel

// 1. Table of Contents Generator (auto-generate from headings)
// 2. Related Articles Picker (visual selection)
// 3. Tag Picker with previews
// 4. Image Upload with Alt Text
// 5. Code Block with Syntax Highlighting
// 6. Video Embed Field
// 7. Callout/Alert Component Builder
```

### Example Writer Workflow

1. **Login to Strapi** (http://localhost:1337/admin)
2. **Navigate to "Documentation Articles"**
3. **Click "Create new entry"**
4. **Fill in the form:**
   - Title: Auto-generates slug
   - Description: For SEO
   - Category: Dropdown selection
   - Role: Dropdown (Admin/Operator/Installer)
   - Device Type: Dropdown (if applicable)
   - Difficulty: Dropdown
   - Tags: Multi-select with autocomplete
   - Content: Rich text editor with formatting
   - Screenshots: Drag-and-drop upload
   - Related Articles: Visual picker
5. **Preview** (if preview plugin installed)
6. **Save as Draft** or **Publish**
7. **Webhook triggers automatic rebuild**
8. **Changes live in 2-3 minutes**

---

## Deployment & CI/CD

### Vercel Deployment (Frontend)

```yaml
# vercel.json

{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "docusaurus",
  "installCommand": "npm install",
  "env": {
    "STRAPI_URL": "@strapi-url",
    "STRAPI_TOKEN": "@strapi-token"
  }
}
```

### Railway Deployment (Strapi Backend)

```yaml
# railway.json

{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy Documentation

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Sync from Strapi
        env:
          STRAPI_URL: ${{ secrets.STRAPI_URL }}
          STRAPI_TOKEN: ${{ secrets.STRAPI_TOKEN }}
        run: node scripts/sync-from-strapi.js
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### 1. Image Optimization

```javascript
// docusaurus.config.js - Add plugin

module.exports = {
  plugins: [
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

### 2. Code Splitting

```javascript
// Already handled by Docusaurus, but you can customize:

module.exports = {
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
};
```

### 3. CDN Configuration

```javascript
// Use Cloudflare or similar CDN
// Configure in Vercel/Netlify dashboard

// Or add custom CDN plugin
module.exports = {
  staticDirectories: ['static'],
  customFields: {
    cdn: {
      url: 'https://cdn.nxgen.cloud',
    },
  },
};
```

---

## Summary: Complete Feature Comparison

| Feature | Evalink Docs | Your Enhanced Docs |
|---------|--------------|-------------------|
| **Search** | Algolia DocSearch | ✅ Algolia DocSearch + Enhanced |
| **Tagging** | Basic tags | ✅ Advanced faceted tags |
| **CMS** | Unknown (probably custom) | ✅ Strapi (no-code editing) |
| **Design** | Excellent | ✅ Matched + Custom components |
| **Role-Based** | Yes | ✅ Yes + Better organization |
| **Dark Mode** | Yes | ✅ Yes |
| **TOC** | Right sidebar | ✅ Right sidebar |
| **Breadcrumbs** | Yes | ✅ Yes |
| **Multilingual** | Limited | ✅ Full (EN/DE/FR) |
| **Custom Components** | Limited | ✅ Extensive library |
| **Writer Workflow** | Unknown | ✅ Fully no-code |
| **Auto-Deploy** | Unknown | ✅ Webhook-triggered |
| **Performance** | Fast | ✅ Optimized |

---

## Next Steps

1. **Week 1:** Set up Docusaurus + Algolia
2. **Week 2:** Install Strapi + Configure content types
3. **Week 3:** Build custom components
4. **Week 4:** Import initial content
5. **Week 5:** Test writer workflow
6. **Week 6:** Deploy to production

**Total Timeline:** 6 weeks to production-ready documentation platform

---

**This guide provides everything needed to build a documentation platform that matches or exceeds Evalink's quality while being fully manageable by non-technical writers.**
