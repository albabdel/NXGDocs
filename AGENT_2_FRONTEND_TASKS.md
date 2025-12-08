# Agent 2: Frontend Developer - Task List
## Your Mission: Build Beautiful, Responsive UI Components

**Status:** Ready to Start (Waiting for Agent 1 green light)
**Working Directory:** `c:\nxgen-docs\classic\src\`
**Estimated Time:** 25 hours total

---

## ✅ Prerequisites Installed
- [x] Tailwind CSS
- [x] Framer Motion
- [x] Lucide React (icons)
- [x] Clsx (conditional classes)

---

## 🎯 Your Deliverables

1. **Complete Component Library** (10 custom components)
2. **Tailwind Configuration**
3. **Custom Theme**
4. **Responsive Homepage**
5. **Dark Mode Implementation**

---

## 📋 PHASE 1: Setup & Configuration (3 hours)

### Task 1.1: Initialize Tailwind CSS (1 hour)

**Create:** `c:\nxgen-docs\classic\tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
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
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.700'),
                textDecoration: 'underline',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.25rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
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
            code: {
              backgroundColor: theme('colors.gray.800'),
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

**Status:** [ ] Complete

---

### Task 1.2: Update Custom CSS (1 hour)

**Update:** `c:\nxgen-docs\classic\src\css\custom.css`

Add at the top:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep existing Docusaurus custom variables below */
```

Add custom enhancements at the bottom:
```css
/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-md;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}

/* Enhanced sidebar */
.theme-doc-sidebar-menu {
  @apply text-sm;
}

.menu__link {
  @apply rounded-md transition-all;
}

.menu__link:hover {
  @apply bg-gray-100 dark:bg-gray-800;
}

.menu__link--active {
  @apply bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold;
}

/* Table of contents */
.table-of-contents {
  @apply sticky top-20;
}

.table-of-contents__link {
  @apply text-sm transition-colors;
}

.table-of-contents__link--active {
  @apply text-primary-600 dark:text-primary-400 font-semibold;
}

/* Breadcrumbs */
.breadcrumbs__link {
  @apply text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400;
}

/* Better code blocks */
.prism-code {
  @apply text-sm rounded-lg shadow-lg;
}

/* Responsive tables */
.markdown table {
  @apply text-sm block overflow-x-auto whitespace-nowrap;
}

/* Image optimization */
.markdown img {
  @apply rounded-lg shadow-md;
}

/* Links */
.markdown a {
  @apply text-primary-600 dark:text-primary-400 hover:underline;
}
```

**Status:** [ ] Complete

---

### Task 1.3: Initialize Tailwind (30 min)

**Run:**
```bash
cd c:/nxgen-docs/classic
npx tailwindcss init -p
```

This creates `postcss.config.js` automatically.

**Test:** Start dev server and verify Tailwind classes work:
```bash
npm run start
```

Add a test div with Tailwind classes somewhere to verify: `<div className="bg-primary-500 text-white p-4">Test</div>`

**Status:** [ ] Complete

---

## 📋 PHASE 2: Component Library (12 hours)

Create all components in: `c:\nxgen-docs\classic\src\components\`

### Task 2.1: Callout Component (1 hour)

**Create:** `src/components/Callout/index.tsx`

```typescript
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

export default function Callout({ type = 'info', title, children }: {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}) {
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
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Create:** `src/components/Callout/styles.module.css` (empty for now)

**Test in MDX:**
```mdx
<Callout type="warning" title="Important">
Make sure to configure NTP before proceeding.
</Callout>
```

**Status:** [ ] Complete

---

### Task 2.2: Tabs Component (1.5 hours)

**Create:** `src/components/Tabs/index.tsx`

```typescript
import React, { useState } from 'react';
import clsx from 'clsx';

export function Tabs({ defaultValue, children }: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const tabs = React.Children.toArray(children);

  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab: any) => (
          <button
            key={tab.props.value}
            onClick={() => setActiveTab(tab.props.value)}
            className={clsx(
              'px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap',
              'border-b-2 -mb-px',
              activeTab === tab.props.value
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300'
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab: any) => tab.props.value === activeTab)}
      </div>
    </div>
  );
}

export function TabItem({ value, label, children }: {
  value: string;
  label: string;
  children: React.ReactNode;
}) {
  return <div className="prose dark:prose-invert max-w-none">{children}</div>;
}
```

**Status:** [ ] Complete

---

### Task 2.3: Steps Component (1.5 hours)

**Create:** `src/components/Steps/index.tsx`

```typescript
import React from 'react';
import clsx from 'clsx';

export default function Steps({ children }: { children: React.ReactNode }) {
  const steps = React.Children.toArray(children);

  return (
    <div className="my-8">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 mb-6 last:mb-0">
          <div className="flex flex-col items-center">
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center',
              'bg-primary-500 text-white font-semibold text-sm flex-shrink-0'
            )}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2 flex-1" />
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

export function Step({ title, children }: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {title && <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h4>}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
```

**Status:** [ ] Complete

---

### Task 2.4: DeviceCard Component (1.5 hours)

**Create:** `src/components/DeviceCard/index.tsx`

```typescript
import React from 'react';
import Link from '@docusaurus/Link';
import { Camera, CheckCircle } from 'lucide-react';

export default function DeviceCard({
  name,
  description,
  icon,
  features = [],
  link
}: {
  name: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  link: string;
}) {
  return (
    <Link
      to={link}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg no-underline group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
          {icon || <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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

**Status:** [ ] Complete

---

### Task 2.5: FeatureCard Component (1 hour)

**Create:** `src/components/FeatureCard/index.tsx`

```typescript
import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({
  title,
  description,
  icon,
  link,
  badge,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  badge?: string;
}) {
  return (
    <Link
      to={link}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg no-underline group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0">
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
        Learn more
        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
```

**Status:** [ ] Complete

---

### Task 2.6: QuickLink Component (45 min)

**Create:** `src/components/QuickLink/index.tsx`

```typescript
import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight } from 'lucide-react';

export default function QuickLink({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-md no-underline group bg-white dark:bg-gray-800"
    >
      <div className="w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg flex-shrink-0 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
    </Link>
  );
}
```

**Status:** [ ] Complete

---

### Task 2.7-2.10: Additional Components (4 hours total)

Create these additional components following the same pattern:

- **CodeBlock** (enhanced code display)
- **ImageGallery** (image slider/gallery)
- **VideoEmbed** (embedded video player)
- **Badge** (status/tag badges)

**Status:** [ ] Complete

---

## 📋 PHASE 3: Homepage Design (6 hours)

### Task 3.1: Create Homepage (4 hours)

**Update:** `src/pages/index.tsx`

Create a beautiful homepage with:
1. Hero section with search bar
2. Quick start guide section
3. Role-based navigation (Admin, Operator, Installer)
4. Popular devices grid
5. Featured features grid
6. Footer with links

**Use:** Tailwind, Framer Motion for animations, Lucide icons

**Status:** [ ] Complete

---

### Task 3.2: Create 404 Page (1 hour)

**Update:** `src/pages/404.tsx`

Create a helpful 404 error page with:
- Friendly message
- Search bar
- Links to popular pages
- Link to homepage

**Status:** [ ] Complete

---

### Task 3.3: Mobile Testing (1 hour)

Test all components and homepage on:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1024px+ width)

Fix any responsive issues.

**Status:** [ ] Complete

---

## 📋 PHASE 4: Accessibility & Polish (4 hours)

### Task 4.1: Keyboard Navigation (1 hour)

Ensure all interactive elements can be accessed via keyboard:
- Tab navigation works
- Focus indicators visible
- Skip to content link

**Status:** [ ] Complete

---

### Task 4.2: ARIA Labels (1 hour)

Add proper ARIA labels to:
- Navigation elements
- Buttons
- Links
- Images

**Status:** [ ] Complete

---

### Task 4.3: Color Contrast (1 hour)

Verify WCAG AA compliance:
- Text on backgrounds
- Link colors
- Button states

Use contrast checker tool.

**Status:** [ ] Complete

---

### Task 4.4: Final Polish (1 hour)

- Smooth scroll behavior
- Loading states
- Hover effects
- Animations timing
- Cross-browser testing

**Status:** [ ] Complete

---

## ✅ Deliverables Checklist

- [ ] Tailwind CSS configured and working
- [ ] 10+ React components created and tested
- [ ] Homepage designed and responsive
- [ ] 404 page created
- [ ] Dark mode working perfectly
- [ ] Mobile-optimized
- [ ] Keyboard accessible
- [ ] WCAG AA compliant
- [ ] All components documented
- [ ] Component usage examples created

---

## 📝 Handoff to Agent 1

When complete, provide:
1. List of all components created with file paths
2. Usage examples for each component
3. Screenshots of homepage (light & dark mode)
4. Mobile screenshots
5. List of any issues or limitations
6. Recommendations for improvements

---

## 🚨 Blockers

If you encounter blockers:
1. Document the issue clearly
2. Tag Agent 1 in your update
3. Continue with non-blocked tasks
4. Wait for resolution

---

## 💡 Tips

- Test in both light and dark mode constantly
- Use the lucide-react icon library extensively
- Keep components simple and reusable
- Follow the existing Docusaurus patterns
- Mobile-first approach for styling

---

**Good luck! Build something beautiful! 🎨**
