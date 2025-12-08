# Agent 4: Content Architect - Task List
## Your Mission: Create 345+ Article Structure with Placeholder Content

**Status:** START IMMEDIATELY (Independent work)
**Working Directory:** Start in `c:\nxgen-docs\content-staging\`, then move to `classic\docs\`
**Estimated Time:** 30 hours total

---

## 🎯 Your Deliverables

1. **Complete folder structure (13 sections)**
2. **345+ MDX article files with frontmatter**
3. **Article templates**
4. **Sidebar configuration**
5. **Placeholder content for all articles**

---

## 📋 PHASE 1: Setup & Planning (2 hours)

### Task 1.1: Create Staging Directory (15 min)

```bash
mkdir c:/nxgen-docs/content-staging
mkdir c:/nxgen-docs/content-staging/docs
cd c:/nxgen-docs/content-staging
```

We'll work here first, then move everything to `classic/docs/` when ready.

**Status:** [ ] Complete

---

### Task 1.2: Create Article Generation Script (1.5 hours)

**Create:** `content-staging/generate-articles.js`

```javascript
const fs = require('fs');
const path = require('path');

// Article structure definition
const DOCUMENTATION_STRUCTURE = {
  'getting-started': {
    title: 'Getting Started',
    articles: [
      { title: 'What is NXGEN GCXONE?', slug: 'what-is-nxgen-GCXONE', role: 'all', difficulty: 'beginner' },
      { title: 'What is Evalink Talos?', slug: 'what-is-evalink-talos', role: 'all', difficulty: 'beginner' },
      { title: 'How GCXONE and Talos Interact', slug: 'GCXONE-talos-interaction', role: 'all', difficulty: 'intermediate' },
      { title: 'Key Benefits & Value Propositions', slug: 'key-benefits', role: 'all', difficulty: 'beginner' },
      { title: 'Cloud Architecture Overview', slug: 'cloud-architecture', role: 'admin', difficulty: 'intermediate' },
      { title: 'Required Ports & Endpoints', slug: 'required-ports', role: 'admin', difficulty: 'intermediate' },
      { title: 'IP Whitelisting Requirements', slug: 'ip-whitelisting', role: 'admin', difficulty: 'intermediate' },
      { title: 'Firewall Configuration Guide', slug: 'firewall-configuration', role: 'installer', difficulty: 'intermediate' },
      { title: 'Network Bandwidth Requirements', slug: 'bandwidth-requirements', role: 'installer', difficulty: 'beginner' },
      { title: 'NTP Server Configuration', slug: 'ntp-configuration', role: 'installer', difficulty: 'beginner' },
      { title: 'First Time Login', slug: 'first-time-login', role: 'all', difficulty: 'beginner' },
      { title: 'Password Management', slug: 'password-management', role: 'all', difficulty: 'beginner' },
      { title: 'Quick Start Checklist', slug: 'quick-start-checklist', role: 'all', difficulty: 'beginner' },
    ]
  },
  'platform-fundamentals': {
    title: 'Platform Fundamentals',
    articles: [
      { title: 'Microservices Architecture Explained', slug: 'microservices-architecture', role: 'admin', difficulty: 'advanced' },
      { title: 'Proxy Architecture & Communication Flow', slug: 'proxy-architecture', role: 'admin', difficulty: 'advanced' },
      { title: 'Device Protocol Overview', slug: 'device-protocols', role: 'admin', difficulty: 'intermediate' },
      { title: 'Tenant-Customer-Site-Device Model', slug: 'hierarchy-model', role: 'admin', difficulty: 'intermediate' },
      { title: 'Multi-Tenant Architecture', slug: 'multi-tenant', role: 'admin', difficulty: 'advanced' },
      { title: 'Alarm Flow: Device to GCXONE to Talos', slug: 'alarm-flow', role: 'admin', difficulty: 'intermediate' },
      { title: 'Site Synchronization', slug: 'site-synchronization', role: 'admin', difficulty: 'intermediate' },
      { title: 'Event Processing & Analytics', slug: 'event-processing', role: 'admin', difficulty: 'advanced' },
      { title: 'Token Configuration & Setup', slug: 'token-configuration', role: 'admin', difficulty: 'intermediate' },
      { title: 'System Health & Monitoring Overview', slug: 'system-health-overview', role: 'admin', difficulty: 'intermediate' },
    ]
  },
  'admin-guide': {
    title: 'Admin & Configuration Guide',
    articles: [
      { title: 'GCXONE Dashboard Overview', slug: 'dashboard-overview', role: 'admin', difficulty: 'beginner' },
      { title: 'Active Sites Widget', slug: 'active-sites-widget', role: 'admin', difficulty: 'beginner' },
      { title: 'Alarm Volume Analytics', slug: 'alarm-volume-analytics', role: 'admin', difficulty: 'intermediate' },
      { title: 'Device Health Status', slug: 'device-health-status', role: 'admin', difficulty: 'beginner' },
      { title: 'Creating Customers', slug: 'creating-customers', role: 'admin', difficulty: 'beginner' },
      { title: 'Creating Sites', slug: 'creating-sites', role: 'admin', difficulty: 'beginner' },
      { title: 'Site Groups Management', slug: 'site-groups', role: 'admin', difficulty: 'intermediate' },
      { title: 'Creating Users & Assigning Roles', slug: 'creating-users', role: 'admin', difficulty: 'beginner' },
      { title: 'Role-Based Access Control (RBAC)', slug: 'rbac', role: 'admin', difficulty: 'intermediate' },
      { title: 'User Permissions Matrix', slug: 'permissions-matrix', role: 'admin', difficulty: 'intermediate' },
      { title: 'Understanding Custom Properties', slug: 'custom-properties-overview', role: 'admin', difficulty: 'intermediate' },
      { title: 'Custom Property Hierarchy', slug: 'custom-property-hierarchy', role: 'admin', difficulty: 'advanced' },
      { title: 'Event Clip Recording Configuration', slug: 'event-clip-configuration', role: 'admin', difficulty: 'intermediate' },
      { title: 'Time Zone Management', slug: 'timezone-management', role: 'admin', difficulty: 'beginner' },
    ]
  },
  // ... ADD MORE SECTIONS HERE
};

function generateArticle(category, article) {
  const tags = [
    `role:${article.role}`,
    'category:configuration',
    `difficulty:${article.difficulty}`,
    'platform:GCXONE'
  ];

  if (article.device) {
    tags.push(`device:${article.device}`);
  }

  const frontmatter = `---
title: "${article.title}"
description: "Complete guide for ${article.title}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
sidebar_position: ${article.position || 1}
last_updated: ${new Date().toISOString().split('T')[0]}
---

# ${article.title}

## Overview

[Placeholder: Brief overview of ${article.title}]

## Prerequisites

[Placeholder: List any prerequisites]

## Key Concepts

[Placeholder: Explain key concepts]

## Step-by-Step Guide

### Step 1: [First Step]

[Placeholder: Detailed instructions]

### Step 2: [Second Step]

[Placeholder: Detailed instructions]

### Step 3: [Third Step]

[Placeholder: Detailed instructions]

## Common Issues

[Placeholder: List common issues and solutions]

## Best Practices

[Placeholder: List best practices]

## Related Articles

[Placeholder: Link to related articles]

- [Related Article 1](#)
- [Related Article 2](#)
- [Related Article 3](#)

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
`;

  return frontmatter;
}

function createArticleFiles() {
  const docsDir = path.join(__dirname, 'docs');

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  for (const [categorySlug, categoryData] of Object.entries(DOCUMENTATION_STRUCTURE)) {
    const categoryDir = path.join(docsDir, categorySlug);

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Create category _category_.json
    const categoryMeta = {
      label: categoryData.title,
      position: categoryData.position || 1,
      link: {
        type: 'generated-index',
        description: `Complete documentation for ${categoryData.title}`
      }
    };

    fs.writeFileSync(
      path.join(categoryDir, '_category_.json'),
      JSON.stringify(categoryMeta, null, 2)
    );

    // Create articles
    categoryData.articles.forEach((article, index) => {
      article.position = index + 1;
      const content = generateArticle(categorySlug, article);
      const filename = `${article.slug}.md`;

      fs.writeFileSync(
        path.join(categoryDir, filename),
        content
      );

      console.log(`✓ Created: ${categorySlug}/${filename}`);
    });
  }

  console.log('\n✅ All articles generated successfully!');
}

// Run the script
createArticleFiles();
```

**Status:** [ ] Complete

---

### Task 1.3: Define Complete Documentation Structure (30 min)

Update the `DOCUMENTATION_STRUCTURE` object in the script above with ALL 345+ articles.

Use the Implementation Plan documents as reference. Structure should include:

1. Getting Started (13 articles) ✓ (example above)
2. Platform Fundamentals (10 articles)
3. Admin Guide (14+ articles)
4. Devices (90+ articles - 16 devices × 5-6 articles each)
5. Features (45+ articles - 15 features × 3 articles each)
6. Alarm Management (20 articles)
7. Reporting (15 articles)
8. Operator Guide (18 articles)
9. Installer Guide (20 articles)
10. Troubleshooting (50+ articles)
11. Knowledge Base (15 articles)
12. Release Notes (10 articles)
13. Support (10 articles)

**Status:** [ ] Complete

---

## 📋 PHASE 2: Article Template Creation (3 hours)

### Task 2.1: Device Configuration Template (1 hour)

**Create:** `content-staging/templates/device-template.md`

```markdown
---
title: "[Device Name] - Configuration Guide"
description: "Complete guide for configuring [Device Name] in NXGEN GCXONE"
tags:
  - role:admin
  - category:configuration
  - device:[device_slug]
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-12-04
---

# [Device Name] Configuration Guide

## Overview

[Brief description of the device and its capabilities]

### Key Features
- Feature 1
- Feature 2
- Feature 3

### Supported Models
- Model 1
- Model 2
- Model 3

## Prerequisites

Before configuring [Device Name], ensure you have:

- [ ] Network access to the device
- [ ] Admin credentials
- [ ] Required ports opened (see [Network Requirements](#network-requirements))
- [ ] GCXONE admin account

## Admin Configuration (GCXONE Side)

### Step 1: Navigate to Device Management

1. Login to GCXONE
2. Go to **Devices** → **Add Device**
3. Select **[Device Type]**

### Step 2: Enter Device Details

| Field | Description | Example |
|-------|-------------|---------|
| Device Name | Unique identifier | "Building A - NVR 1" |
| IP Address | Device IP | 192.168.1.100 |
| Port | Device port | 8000 |
| Username | Admin username | admin |
| Password | Admin password | ••••••••• |

### Step 3: Configure Custom Properties

[Device-specific custom properties configuration]

### Step 4: Test Connection

Click **Test Connection** to verify the configuration.

## Installer Configuration (Device Side)

### Network Configuration

[How to configure network settings on the device itself]

### Event Configuration

[How to configure events to be sent to GCXONE]

### Time Synchronization

Configure NTP server: `timel.nxgen.cloud`

## Operator View

### What Operators See

[Screenshots and descriptions of what operators see for this device]

### Available Actions

- Live video streaming
- PTZ control (if supported)
- Playback
- Event viewing

## Troubleshooting

### Common Issue 1

**Problem:** [Description]
**Solution:** [Steps to resolve]

### Common Issue 2

**Problem:** [Description]
**Solution:** [Steps to resolve]

## Related Articles

- [[Device Name] - Installer Guide](#)
- [[Device Name] - Operator View](#)
- [[Device Name] - Supported Features](#)
- [[Device Name] - Troubleshooting](#)

## Need Help?

Contact [support@nxgen.cloud](mailto:support@nxgen.cloud) or open a ticket.
```

**Status:** [ ] Complete

---

### Task 2.2: Feature Guide Template (1 hour)

**Create:** `content-staging/templates/feature-template.md`

```markdown
---
title: "[Feature Name]"
description: "Complete guide for [Feature Name] in NXGEN GCXONE"
tags:
  - role:all
  - category:features
  - feature:[feature_slug]
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-12-04
---

# [Feature Name]

## What is [Feature Name]?

[Brief, non-technical explanation of the feature]

## Benefits

- Benefit 1
- Benefit 2
- Benefit 3

## How It Works

[Technical explanation with diagrams if needed]

## Supported Devices

| Device | Support Level | Notes |
|--------|---------------|-------|
| Hikvision | Full | All features supported |
| Dahua | Full | All features supported |
| ADPRO | Partial | See limitations below |

## Configuration

### Prerequisites

- [ ] Prerequisite 1
- [ ] Prerequisite 2
- [ ] Prerequisite 3

### Step-by-Step Configuration

#### Step 1: Enable the Feature

[Instructions]

#### Step 2: Configure Settings

[Instructions]

#### Step 3: Test the Feature

[Instructions]

## Usage

### For Administrators

[How admins interact with this feature]

### For Operators

[How operators interact with this feature]

## Best Practices

1. **Best Practice 1:** [Description]
2. **Best Practice 2:** [Description]
3. **Best Practice 3:** [Description]

## Limitations

- Limitation 1
- Limitation 2
- Limitation 3

## Troubleshooting

See [Feature Name Troubleshooting](#) for common issues.

## Related Articles

- [Related Feature 1](#)
- [Related Feature 2](#)
- [Configuration Guide](#)

## FAQ

**Q: Common question 1?**
A: Answer 1

**Q: Common question 2?**
A: Answer 2
```

**Status:** [ ] Complete

---

### Task 2.3: Troubleshooting Template (1 hour)

**Create:** `content-staging/templates/troubleshooting-template.md`

```markdown
---
title: "Troubleshooting: [Issue Name]"
description: "How to resolve [Issue Name]"
tags:
  - role:all
  - category:troubleshooting
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 1
last_updated: 2025-12-04
---

# Troubleshooting: [Issue Name]

## Problem Description

[Clear description of the issue]

### Symptoms

- Symptom 1
- Symptom 2
- Symptom 3

### Affected Components

- Component 1
- Component 2

## Quick Fixes

Try these quick solutions first:

1. **[Quick Fix 1]:** [Steps]
2. **[Quick Fix 2]:** [Steps]
3. **[Quick Fix 3]:** [Steps]

## Detailed Troubleshooting

### Step 1: Verify [Something]

[Detailed instructions]

**Check:**
```bash
# Command to check
```

**Expected output:**
```
Expected result
```

### Step 2: [Next Step]

[Detailed instructions]

### Step 3: [Final Step]

[Detailed instructions]

## Root Causes

### Cause 1: [Description]

**How to identify:**
[Signs]

**How to fix:**
[Solution]

### Cause 2: [Description]

**How to identify:**
[Signs]

**How to fix:**
[Solution]

## Prevention

To prevent this issue in the future:

1. Prevention step 1
2. Prevention step 2
3. Prevention step 3

## When to Escalate

Escalate to support if:

- [ ] Quick fixes didn't work
- [ ] Issue persists after 30 minutes
- [ ] Multiple sites affected
- [ ] Critical functionality impacted

## Related Issues

- [Related Issue 1](#)
- [Related Issue 2](#)

## Need Help?

If this guide didn't resolve your issue:

1. Check [Knowledge Base](/docs/knowledge-base)
2. Contact [support@nxgen.cloud](mailto:support@nxgen.cloud)
3. Call support: +1-XXX-XXX-XXXX
```

**Status:** [ ] Complete

---

## 📋 PHASE 3: Generate All Articles (15 hours)

### Task 3.1: Complete the Documentation Structure (5 hours)

Update `generate-articles.js` with the complete structure for all 345+ articles.

**Use this checklist:**

- [ ] Getting Started (13 articles)
- [ ] Platform Fundamentals (10 articles)
- [ ] Admin Guide (14 articles)
- [ ] Devices section:
  - [ ] General Onboarding (5 articles)
  - [ ] ADPRO (6 articles)
  - [ ] Hikvision (6 articles)
  - [ ] Dahua (7 articles)
  - [ ] Hanwha (6 articles)
  - [ ] Milestone (6 articles)
  - [ ] Axxon (5 articles)
  - [ ] Camect (5 articles)
  - [ ] Axis (5 articles)
  - [ ] Heitel (6 articles)
  - [ ] Reconeyez (5 articles)
  - [ ] Teltonika (6 articles)
  - [ ] GCXONE Audio (6 articles)
  - [ ] Avigilon (5 articles)
  - [ ] InnoVi (5 articles)
  - [ ] Additional (3 articles)
- [ ] Features (45 articles - 15 features × 3 each)
- [ ] Alarm Management (20 articles)
- [ ] Reporting (15 articles)
- [ ] Operator Guide (18 articles)
- [ ] Installer Guide (20 articles)
- [ ] Troubleshooting (50 articles)
- [ ] Knowledge Base (15 articles)
- [ ] Release Notes (10 articles)
- [ ] Support (10 articles)

**Status:** [ ] Complete

---

### Task 3.2: Run the Generation Script (1 hour)

```bash
cd c:/nxgen-docs/content-staging
node generate-articles.js
```

This should create all 345+ article files.

**Verify:**
- All folders created
- All article files present
- Frontmatter is valid
- No duplicate slugs

**Status:** [ ] Complete

---

### Task 3.3: Add Device-Specific Details (6 hours)

For each device, enhance the placeholder content with specific details:

**For Hikvision:**
- List specific models
- Add NVR configuration steps
- Include HikProConnect setup
- Add common error codes

**For Dahua:**
- DoLynk configuration
- Local mode prerequisites
- Smart events setup

**For each device:** Spend 20-30 minutes adding device-specific details based on the Implementation Plan documents.

**Status:** [ ] Complete

---

### Task 3.4: Add Feature-Specific Details (3 hours)

Enhance feature articles with:
- Specific configuration examples
- Screenshots placeholders
- Use case examples
- Supported device matrix

**Status:** [ ] Complete

---

## 📋 PHASE 4: Sidebar Configuration (3 hours)

### Task 4.1: Create Sidebar Configuration (2 hours)

**Create:** `content-staging/sidebars.ts`

```typescript
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'index',
      label: 'Documentation Home',
    },
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
        description: 'Get started with NXGEN GCXONE platform',
      },
      items: [
        'getting-started/what-is-nxgen-GCXONE',
        'getting-started/what-is-evalink-talos',
        'getting-started/GCXONE-talos-interaction',
        'getting-started/key-benefits',
        'getting-started/cloud-architecture',
        'getting-started/required-ports',
        'getting-started/ip-whitelisting',
        'getting-started/firewall-configuration',
        'getting-started/bandwidth-requirements',
        'getting-started/ntp-configuration',
        'getting-started/first-time-login',
        'getting-started/password-management',
        'getting-started/quick-start-checklist',
      ],
    },
    {
      type: 'category',
      label: 'Platform Fundamentals',
      link: {
        type: 'generated-index',
        description: 'Deep dive into GCXONE platform architecture',
      },
      items: [
        // ... add all platform fundamental articles
      ],
    },
    {
      type: 'category',
      label: 'Admin & Configuration',
      link: {
        type: 'generated-index',
        description: 'Administration and configuration guides',
      },
      items: [
        // ... add all admin guide articles
      ],
    },
    {
      type: 'category',
      label: 'Devices',
      link: {
        type: 'generated-index',
        description: 'Device configuration guides for all supported devices',
      },
      items: [
        {
          type: 'category',
          label: 'General Onboarding',
          items: [
            // ... general device articles
          ],
        },
        {
          type: 'category',
          label: 'Hikvision',
          items: [
            'devices/hikvision/overview',
            'devices/hikvision/admin-configuration',
            'devices/hikvision/installer-configuration',
            'devices/hikvision/operator-view',
            'devices/hikvision/supported-features',
            'devices/hikvision/troubleshooting',
          ],
        },
        // ... repeat for all devices
      ],
    },
    {
      type: 'category',
      label: 'Features',
      link: {
        type: 'generated-index',
        description: 'Feature guides and configuration',
      },
      items: [
        {
          type: 'category',
          label: 'AI Analytics',
          items: [
            'features/ai-analytics/overview',
            'features/ai-analytics/configuration',
            'features/ai-analytics/troubleshooting',
          ],
        },
        // ... repeat for all features
      ],
    },
    {
      type: 'category',
      label: 'Alarm Management (Talos)',
      items: [
        // ... alarm management articles
      ],
    },
    {
      type: 'category',
      label: 'Reporting & Analytics',
      items: [
        // ... reporting articles
      ],
    },
    {
      type: 'category',
      label: 'Operator Guide',
      items: [
        // ... operator articles
      ],
    },
    {
      type: 'category',
      label: 'Installer Guide',
      items: [
        // ... installer articles
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        // ... troubleshooting articles
      ],
    },
    {
      type: 'category',
      label: 'Knowledge Base',
      items: [
        // ... knowledge base articles
      ],
    },
    {
      type: 'category',
      label: 'Release Notes',
      items: [
        // ... release notes
      ],
    },
    {
      type: 'category',
      label: 'Support & Resources',
      items: [
        // ... support articles
      ],
    },
  ],
};

export default sidebars;
```

**Status:** [ ] Complete

---

### Task 4.2: Test Sidebar Navigation (1 hour)

Once articles are moved to `classic/docs/`:

1. Start dev server: `npm run start`
2. Navigate through all sections
3. Verify all links work
4. Check for broken links
5. Verify order is correct

**Status:** [ ] Complete

---

## 📋 PHASE 5: Image Placeholders (2 hours)

### Task 5.1: Create Placeholder Images (1.5 hours)

Create simple placeholder images for:
- Device screenshots (90+ images)
- Dashboard screenshots (20 images)
- Feature screenshots (45 images)
- Diagrams (15 images)

**Tools:** Use https://placehold.co/ or create simple PNG files

**Naming convention:**
```
[category]-[device/feature]-[number].png
```

Examples:
- `device-hikvision-dashboard.png`
- `feature-ai-analytics-config.png`
- `troubleshooting-login-error.png`

**Save to:** `content-staging/static/img/`

**Status:** [ ] Complete

---

### Task 5.2: Reference Images in Articles (30 min)

Update articles to reference the placeholder images:

```markdown
![Hikvision Dashboard](../../../static/img/device-hikvision-dashboard.png)
```

**Status:** [ ] Complete

---

## 📋 PHASE 6: Quality Assurance (3 hours)

### Task 6.1: Validate All Frontmatter (1 hour)

Create a validation script: `content-staging/validate-frontmatter.js`

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function validateFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(content);

  const required = ['title', 'description', 'tags'];
  const missing = required.filter(field => !data[field]);

  if (missing.length > 0) {
    console.error(`❌ ${filePath}: Missing ${missing.join(', ')}`);
    return false;
  }

  return true;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let allValid = true;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      if (!validateFrontmatter(filePath)) {
        allValid = false;
      }
    }
  });

  return allValid;
}

const allValid = walkDir(path.join(__dirname, 'docs'));
console.log(allValid ? '\n✅ All frontmatter valid!' : '\n❌ Some files have invalid frontmatter');
```

Run: `node validate-frontmatter.js`

**Status:** [ ] Complete

---

### Task 6.2: Check for Duplicate Slugs (30 min)

Create script to find duplicate slugs.

**Status:** [ ] Complete

---

### Task 6.3: Verify Cross-References (1.5 hours)

Manually check that:
- Related articles links are present
- Links point to correct paths
- No broken links

**Status:** [ ] Complete

---

## 📋 PHASE 7: Migration to Production (2 hours)

### Task 7.1: Move Content to Classic (1 hour)

```bash
# Backup existing docs
cp -r c:/nxgen-docs/classic/docs c:/nxgen-docs/classic/docs-backup

# Move new content
rm -rf c:/nxgen-docs/classic/docs
cp -r c:/nxgen-docs/content-staging/docs c:/nxgen-docs/classic/docs

# Move sidebar config
cp c:/nxgen-docs/content-staging/sidebars.ts c:/nxgen-docs/classic/sidebars.ts

# Move images
cp -r c:/nxgen-docs/content-staging/static/img/* c:/nxgen-docs/classic/static/img/
```

**Status:** [ ] Complete

---

### Task 7.2: Test in Docusaurus (1 hour)

```bash
cd c:/nxgen-docs/classic
npm run start
```

Test:
- [ ] All pages load
- [ ] Sidebar navigation works
- [ ] Images display
- [ ] Search works
- [ ] No console errors

**Status:** [ ] Complete

---

## ✅ Deliverables Checklist

- [ ] 345+ article files created
- [ ] All articles have valid frontmatter
- [ ] Article templates created (Device, Feature, Troubleshooting)
- [ ] Sidebar configuration complete
- [ ] Placeholder images created
- [ ] No duplicate slugs
- [ ] Cross-references added
- [ ] Quality validation passed
- [ ] Content migrated to classic/docs/
- [ ] Test build successful

---

## 📝 Handoff to Agent 1

Provide:
1. **Article count:** Total number of articles created
2. **Structure overview:** Folder organization
3. **Sidebar configuration:** File path and structure
4. **Known issues:** Any problems encountered
5. **Placeholder list:** What needs real content
6. **Image requirements:** List of images needed

---

## 📊 Article Statistics

Track your progress:

| Section | Target | Created | %Complete |
|---------|--------|---------|-----------|
| Getting Started | 13 | ___ | ___% |
| Platform Fundamentals | 10 | ___ | ___% |
| Admin Guide | 14 | ___ | ___% |
| Devices | 90 | ___ | ___% |
| Features | 45 | ___ | ___% |
| Alarm Management | 20 | ___ | ___% |
| Reporting | 15 | ___ | ___% |
| Operator Guide | 18 | ___ | ___% |
| Installer Guide | 20 | ___ | ___% |
| Troubleshooting | 50 | ___ | ___% |
| Knowledge Base | 15 | ___ | ___% |
| Release Notes | 10 | ___ | ___% |
| Support | 10 | ___ | ___% |
| **TOTAL** | **345+** | **___** | **___%** |

---

## 🚨 Blockers

If blocked:
1. Document the issue
2. Tag Agent 1
3. Continue with non-blocked sections
4. Report progress

---

## 💡 Tips

- Use the generation script - don't create files manually!
- Keep frontmatter consistent
- Use descriptive slugs
- Add cross-references generously
- Think about SEO in descriptions
- Test frequently in Docusaurus

---

**Go build the content structure! 📝**
