# NXGEN Component Library - Usage Guide

## Overview
This guide provides usage examples for all 10 custom React components created for the NXGEN Documentation project.

All components use Tailwind CSS for styling and Lucide React for icons.

---

## 1. Callout Component

**Path:** `@site/src/components/Callout`

**Purpose:** Display important information with different severity levels.

**Props:**
- `type`: `'info' | 'success' | 'warning' | 'error'` (default: 'info')
- `title`: Optional string for the callout title
- `children`: Content of the callout

**Usage in MDX:**
```mdx
import Callout from '@site/src/components/Callout';

<Callout type="warning" title="Important">
Make sure to configure NTP before proceeding.
</Callout>

<Callout type="info">
This is an informational message.
</Callout>

<Callout type="success" title="Success!">
Configuration completed successfully.
</Callout>

<Callout type="error" title="Error">
Failed to connect to the server.
</Callout>
```

---

## 2. Tabs Component

**Path:** `@site/src/components/Tabs`

**Purpose:** Create tabbed content interfaces.

**Components:**
- `Tabs`: Container component
- `TabItem`: Individual tab content

**Props (Tabs):**
- `defaultValue`: String ID of the initially active tab

**Props (TabItem):**
- `value`: Unique string identifier
- `label`: Tab button label
- `children`: Tab content

**Usage in MDX:**
```mdx
import { Tabs, TabItem } from '@site/src/components/Tabs';

<Tabs defaultValue="windows">
  <TabItem value="windows" label="Windows">
    Instructions for Windows...
  </TabItem>
  <TabItem value="mac" label="macOS">
    Instructions for macOS...
  </TabItem>
  <TabItem value="linux" label="Linux">
    Instructions for Linux...
  </TabItem>
</Tabs>
```

---

## 3. Steps Component

**Path:** `@site/src/components/Steps`

**Purpose:** Display numbered step-by-step instructions.

**Components:**
- `Steps`: Container component
- `Step`: Individual step

**Props (Step):**
- `title`: Optional step title
- `children`: Step content

**Usage in MDX:**
```mdx
import Steps, { Step } from '@site/src/components/Steps';

<Steps>
  <Step title="Install the software">
    Download and run the installer from the official website.
  </Step>
  <Step title="Configure settings">
    Open the configuration panel and set your preferences.
  </Step>
  <Step title="Start the service">
    Click the Start button to begin.
  </Step>
</Steps>
```

---

## 4. DeviceCard Component

**Path:** `@site/src/components/DeviceCard`

**Purpose:** Display hardware device information with features.

**Props:**
- `name`: Device name
- `description`: Device description
- `icon`: Optional React icon component
- `features`: Array of feature strings
- `link`: Link to device documentation

**Usage in MDX:**
```mdx
import DeviceCard from '@site/src/components/DeviceCard';
import { Camera } from 'lucide-react';

<DeviceCard
  name="NX-IP7153"
  description="7-inch touchscreen IP intercom with HD camera"
  icon={<Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
  features={["HD Camera", "7-inch Display", "PoE"]}
  link="/docs/devices/nx-ip7153"
/>
```

---

## 5. FeatureCard Component

**Path:** `@site/src/components/FeatureCard`

**Purpose:** Showcase platform features.

**Props:**
- `title`: Feature title
- `description`: Feature description
- `icon`: React icon component
- `link`: Link to feature documentation
- `badge`: Optional badge text (e.g., "New")

**Usage in MDX:**
```mdx
import FeatureCard from '@site/src/components/FeatureCard';
import { Shield } from 'lucide-react';

<FeatureCard
  title="Advanced Security"
  description="Enterprise-grade encryption and access control"
  icon={<Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
  link="/docs/features/security"
  badge="New"
/>
```

---

## 6. QuickLink Component

**Path:** `@site/src/components/QuickLink`

**Purpose:** Compact navigation links.

**Props:**
- `title`: Link title
- `description`: Link description
- `icon`: React icon component
- `href`: Link URL

**Usage in MDX:**
```mdx
import QuickLink from '@site/src/components/QuickLink';
import { BookOpen } from 'lucide-react';

<QuickLink
  title="Getting Started"
  description="Learn the basics in 5 minutes"
  icon={<BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
  href="/docs/getting-started"
/>
```

---

## 7. CodeBlock Component

**Path:** `@site/src/components/CodeBlock`

**Purpose:** Enhanced code display with copy functionality.

**Props:**
- `code`: Code string to display
- `language`: Code language (e.g., 'javascript', 'python')
- `title`: Optional title for the code block
- `showLineNumbers`: Boolean to show line numbers

**Usage in MDX:**
```mdx
import CodeBlock from '@site/src/components/CodeBlock';

<CodeBlock
  code={`const greeting = "Hello, World!";
console.log(greeting);`}
  language="javascript"
  title="example.js"
  showLineNumbers={true}
/>
```

---

## 8. ImageGallery Component

**Path:** `@site/src/components/ImageGallery`

**Purpose:** Image slider/gallery with navigation.

**Props:**
- `images`: Array of image URLs
- `captions`: Optional array of captions (one per image)

**Usage in MDX:**
```mdx
import ImageGallery from '@site/src/components/ImageGallery';

<ImageGallery
  images={[
    '/img/screenshot1.png',
    '/img/screenshot2.png',
    '/img/screenshot3.png'
  ]}
  captions={[
    'Dashboard overview',
    'Settings panel',
    'User management'
  ]}
/>
```

---

## 9. VideoEmbed Component

**Path:** `@site/src/components/VideoEmbed`

**Purpose:** Embed videos (YouTube or direct URLs).

**Props:**
- `url`: Video URL (YouTube or direct)
- `title`: Optional video title
- `aspectRatio`: `'16/9' | '4/3' | '1/1'` (default: '16/9')
- `autoplay`: Boolean for autoplay
- `controls`: Boolean to show controls

**Usage in MDX:**
```mdx
import VideoEmbed from '@site/src/components/VideoEmbed';

<VideoEmbed
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Product Demo"
  aspectRatio="16/9"
  controls={true}
/>
```

---

## 10. Badge Component

**Path:** `@site/src/components/Badge`

**Purpose:** Status badges and tags.

**Props:**
- `children`: Badge text
- `variant`: `'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'`
- `size`: `'sm' | 'md' | 'lg'`

**Usage in MDX:**
```mdx
import Badge from '@site/src/components/Badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Beta</Badge>
<Badge variant="primary" size="lg">New Feature</Badge>
```

---

## Component Grid Layouts

### Feature Cards Grid
```mdx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <FeatureCard ... />
  <FeatureCard ... />
  <FeatureCard ... />
</div>
```

### Device Cards Grid
```mdx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <DeviceCard ... />
  <DeviceCard ... />
</div>
```

### Quick Links List
```mdx
<div className="space-y-4 my-6">
  <QuickLink ... />
  <QuickLink ... />
  <QuickLink ... />
</div>
```

---

## Best Practices

1. **Icons:** Always import specific icons from `lucide-react` for better tree-shaking
2. **Colors:** Use Tailwind's primary colors (`text-primary-600 dark:text-primary-400`)
3. **Dark Mode:** All components support dark mode automatically
4. **Accessibility:** All components include proper ARIA labels and keyboard navigation
5. **Responsive:** All components are mobile-responsive by default

---

## Available Tailwind Colors

```javascript
// Primary (Blue)
primary-50 through primary-900

// Secondary (Purple)
secondary-50 through secondary-900

// Usage
className="bg-primary-100 text-primary-700 dark:bg-primary-900/30"
```

---

## Next Steps

These components are ready to be used in MDX files throughout the documentation.
For Agent 1 integration tasks, see the component export configuration in the next section.
