# Documentation Index Page - Design Document

## Overview

A comprehensive documentation hub page that serves as the central navigation point for all NXGEN GCXONE documentation. The page dynamically loads content from Sanity CMS and provides an intuitive, searchable interface for users to discover documentation.

---

## Architecture

### Page Route
- **URL**: `/docs` or `/documentation`
- **File**: `classic/src/pages/docs-index.tsx`
- **Styles**: `classic/src/pages/docs-index.module.css`

### Data Sources
| Source | File | Purpose |
|--------|------|---------|
| Sanity Landing Pages | `sanity-landing-pages.generated.json` | Landing page metadata |
| Sanity Releases | `sanity-releases.generated.json` | Release notes |
| Sanity Roadmap | `sanity-roadmap.generated.json` | Roadmap items |
| Sidebar Categories | Generated from Sanity | Category structure |

---

## Component Structure

```
DocsIndexPage
├── DocsHero                    # Hero section with search
│   ├── HeroBadge              # "Documentation Center" badge
│   ├── HeroTitle              # Main title with gradient
│   ├── HeroSubtitle           # Tagline
│   ├── HeroSearchBar          # Prominent search input
│   └── HeroQuickLinks         # Quick access to main landing
│
├── QuickLinksSection          # 4 quick access cards
│   └── QuickLink[]            # Getting Started, Integration Hub, Video Tutorials, Support
│
├── CategoriesGrid             # Dynamic category cards
│   ├── CategoryCard[]         # Individual category cards
│   │   ├── CategoryIcon       # Icon from Sanity
│   │   ├── CategoryTitle      # Category name
│   │   ├── CategoryDesc       # Description
│   │   ├── ArticleCount       # Dynamic count
│   │   └── NewBadge           # Highlights new/updated
│   └── CategoryStats          # Total articles count
│
├── LandingPagesSection        # All landing pages organized
│   ├── SectionTitle           # "Landing Pages"
│   └── LandingPageCard[]      # Cards for each landing page
│
├── ResourcesSection           # Additional resources
│   ├── ResourceCard[]         # API Reference, Knowledge Base, Release Notes, Roadmap
│   └── LastUpdated            # Timestamp
│
└── ReturnHomeBanner           # Subtle return to home link
```

---

## Detailed Component Specifications

### 1. DocsHero Component

```tsx
interface DocsHeroProps {
  onOpenSearch: () => void;
  lastUpdated: string;
  totalArticles: number;
}

// Features:
// - Full-width hero with gradient background
// - Animated background particles (reused from NXGENSphereHero)
// - Large centered search bar with keyboard shortcut hint
// - Subtle "Return to Home" link in top-right
// - Badge showing last content update time
```

**Visual Design:**
- Dark theme with gold accents (#E8B058)
- Background: Subtle gradient with particle animation
- Search bar: Glass morphism effect with gold border glow
- Height: ~60vh minimum

### 2. QuickLinksSection Component

```tsx
interface QuickLinkData {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  variant?: 'primary' | 'secondary';
}

// Quick Links:
const quickLinks: QuickLinkData[] = [
  {
    title: 'Getting Started',
    description: 'New user? Start here with step-by-step guides',
    icon: <Rocket />,
    href: '/getting-started',
    badge: 'New Users',
    variant: 'primary'
  },
  {
    title: 'Integration Hub',
    description: 'Browse supported devices and configure integrations',
    icon: <Plug />,
    href: '/integration-hub'
  },
  {
    title: 'Video Tutorials',
    description: 'Watch walkthroughs and how-to videos',
    icon: <PlayCircle />,
    href: '/video-tutorials'
  },
  {
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: <HelpCircle />,
    href: '/contact'
  }
];
```

**Visual Design:**
- 2x2 grid on desktop, 1 column on mobile
- Cards with hover lift effect
- Primary link has gold accent background
- Icon in colored circle

### 3. CategoriesGrid Component

```tsx
interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
  href: string;
  isNew?: boolean;
  updatedRecently?: boolean;
  lastUpdated?: string;
}

// Dynamic categories loaded from Sanity sidebarCategory documents
// Categories grouped by parent/child relationship
// Article counts calculated from referenced docs
```

**Visual Design:**
- Responsive grid: 4 columns (xl), 3 columns (lg), 2 columns (md), 1 column (sm)
- Card with gold top border accent
- Icon in colored background
- Article count badge
- "New" or "Updated" pill for recent content
- Hover state: lift + border glow

### 4. LandingPagesSection Component

```tsx
interface LandingPageCardProps {
  title: string;
  description: string;
  slug: string;
  icon?: string;
  hero?: {
    badge?: { icon: string; text: string };
    headline: string;
  };
  lastUpdated: string;
  status: 'published' | 'draft';
}

// Landing pages loaded from sanity-landing-pages.generated.json
// Grouped by layoutType: standard, quick-start, tower-guide
// Filtered to only show published pages
```

**Visual Design:**
- Horizontal scrollable cards or grid
- Larger cards with preview snippet
- Status indicator (published/draft)
- Last updated timestamp

### 5. ResourcesSection Component

```tsx
interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  count?: number | string;
  badge?: string;
}

const resources: ResourceCardProps[] = [
  {
    title: 'API Reference',
    description: 'Complete REST and GraphQL API documentation',
    icon: <Code />,
    href: '/docs/api',
    badge: 'Technical'
  },
  {
    title: 'Knowledge Base',
    description: 'FAQs, troubleshooting, and best practices',
    icon: <BookOpen />,
    href: '/docs/knowledge-base'
  },
  {
    title: 'Release Notes',
    description: 'Latest platform updates and changes',
    icon: <FileText />,
    href: '/releases',
    count: releasesData.length
  },
  {
    title: 'Product Roadmap',
    description: 'Upcoming features and improvements',
    icon: <Map />,
    href: '/roadmap',
    count: roadmapItems.length
  }
];
```

**Visual Design:**
- 4-column grid
- Similar styling to category cards
- Dynamic count badges

### 6. ReturnHomeBanner Component

```tsx
interface ReturnHomeBannerProps {
  // Minimal props - just styling and link
}

// Subtle banner or floating card
// "Return to Home" with home icon
// Positioned at bottom or as a subtle nav item
```

**Visual Design:**
- Subtle, non-intrusive
- Fixed position or in footer area
- Home icon + text
- Hover: slight glow effect

---

## Dynamic Features

### 1. Article Count Calculation
```typescript
// Calculate from Sanity data
const getArticleCount = (categorySlug: string): number => {
  return docsData.filter(doc => 
    doc.sidebarCategory?.slug?.current === categorySlug &&
    doc.status === 'published'
  ).length;
};
```

### 2. New/Updated Content Detection
```typescript
// Check if content was updated in last 7 days
const isRecentlyUpdated = (lastUpdated: string): boolean => {
  const updated = new Date(lastUpdated);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return updated >= weekAgo;
};
```

### 3. Last Updated Timestamp
```typescript
// Display "Last updated: X hours/days ago"
const formatLastUpdated = (date: string): string => {
  const updated = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - updated.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
};
```

### 4. Search Integration
```typescript
// Trigger global search modal
const handleSearchOpen = () => {
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    code: 'KeyK',
    ctrlKey: true,
    bubbles: true
  });
  document.dispatchEvent(event);
};
```

---

## CSS Module Classes

```css
/* docs-index.module.css */

/* Hero */
.hero { ... }
.heroBadge { ... }
.heroTitle { ... }
.heroSubtitle { ... }
.heroSearchBar { ... }
.heroSearchInput { ... }
.heroSearchShortcut { ... }

/* Quick Links */
.quickLinksSection { ... }
.quickLinksGrid { ... }
.quickLinkCard { ... }
.quickLinkCardPrimary { ... }

/* Categories */
.categoriesSection { ... }
.categoriesGrid { ... }
.categoryCard { ... }
.categoryIcon { ... }
.categoryTitle { ... }
.categoryDesc { ... }
.categoryCount { ... }
.categoryNewBadge { ... }

/* Landing Pages */
.landingPagesSection { ... }
.landingPagesGrid { ... }
.landingPageCard { ... }

/* Resources */
.resourcesSection { ... }
.resourcesGrid { ... }
.resourceCard { ... }

/* Return Home */
.returnHomeBanner { ... }
.returnHomeLink { ... }

/* Stats */
.statsBar { ... }
.statItem { ... }
.statValue { ... }
.statLabel { ... }
```

---

## Responsive Breakpoints

| Breakpoint | Grid Columns | Hero Height | Card Width |
|------------|-------------|-------------|------------|
| < 640px | 1 | auto | 100% |
| 640px - 768px | 2 | 50vh | 50% |
| 768px - 1024px | 3 | 55vh | 33% |
| 1024px - 1280px | 4 | 60vh | 25% |
| > 1280px | 4 | 60vh | 25% |

---

## Animation Specs

Using Framer Motion for smooth animations:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

const hoverVariants = {
  hover: { 
    y: -4, 
    transition: { type: 'spring', stiffness: 300 } 
  }
};
```

---

## Accessibility Requirements

1. **Keyboard Navigation**: All interactive elements focusable
2. **ARIA Labels**: Proper labels for search, cards
3. **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
4. **Reduced Motion**: Respect `prefers-reduced-motion`
5. **Screen Reader**: Semantic HTML structure

---

## Implementation Files

```
classic/src/pages/
├── docs-index.tsx           # Main page component
└── docs-index.module.css    # Styles

classic/src/components/DocsIndex/
├── DocsHero.tsx             # Hero section
├── QuickLinksSection.tsx    # Quick links
├── CategoriesGrid.tsx       # Category cards
├── LandingPagesSection.tsx  # Landing pages
├── ResourcesSection.tsx     # Resources
├── ReturnHomeBanner.tsx     # Return link
└── index.ts                 # Exports
```

---

## Data Flow

```
Sanity CMS
    ↓
JSON Generated Files (build time)
    ↓
DocsIndexPage
    ├── sanity-landing-pages.generated.json
    ├── sanity-releases.generated.json
    ├── sanity-roadmap.generated.json
    └── sidebar-categories (from sidebars)
    ↓
Component Props
    ↓
Rendered UI
```

---

## Performance Considerations

1. **Static Generation**: All data loaded at build time
2. **Image Optimization**: Use Cloudinary for icons
3. **Code Splitting**: Lazy load heavy components
4. **CSS**: Use CSS modules for scoped styles
5. **Animations**: GPU-accelerated transforms

---

## SEO & Meta

```tsx
<Layout
  title="Documentation Center | NXGEN GCXONE"
  description="Complete technical documentation for NXGEN GCXONE platform. Guides, API reference, integrations, and troubleshooting resources."
>
```

---

## Future Enhancements

1. **Algolia Search**: Full-text search integration
2. **Recent Activity Feed**: Show recently viewed docs
3. **Personalization**: Role-based content recommendations
4. **Breadcrumbs**: Full navigation path
5. **Related Articles**: AI-powered suggestions

---

## Implementation Status

### Completed Components

| Component | File | Status |
|-----------|------|--------|
| DocsHero | `components/DocsIndex/DocsHero.tsx` | ✅ Done |
| QuickLinksSection | `components/DocsIndex/QuickLinksSection.tsx` | ✅ Done |
| CategoriesGrid | `components/DocsIndex/CategoriesGrid.tsx` | ✅ Done |
| LandingPagesSection | `components/DocsIndex/LandingPagesSection.tsx` | ✅ Done |
| ResourcesSection | `components/DocsIndex/ResourcesSection.tsx` | ✅ Done |
| ReturnHomeBanner | `components/DocsIndex/ReturnHomeBanner.tsx` | ✅ Done |
| Main Page | `pages/docs-index.tsx` | ✅ Done |
| Styles | `pages/docs-index.module.css` | ✅ Done |

### Route Configuration

The page is accessible at:
- `/docs-index` (direct file-based routing)

To add `/docs` route, add to `docusaurus.config.js`:
```js
plugins: [
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects: [
        { from: '/docs', to: '/docs-index' },
      ],
    },
  ],
]
```

### Integration Notes

1. **Data Sources**: The page loads data from generated JSON files
2. **Search**: Uses existing global search modal (Ctrl+K trigger)
3. **Theme**: Fully supports dark/light mode via `useColorMode`
4. **Animations**: Uses Framer Motion with reduced motion support
5. **Responsive**: Mobile-first design with breakpoints at 640px, 768px, 1024px
