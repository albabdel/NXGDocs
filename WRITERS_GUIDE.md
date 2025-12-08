# Technical Writer's Guide - NXGEN GCXONE Documentation
**Last Updated:** December 5, 2025  
**Platform:** Docusaurus 3.8.1  
**Location:** `c:\nxgen-docs\classic\`

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies (First Time Only)
```bash
cd c:\nxgen-docs\classic
npm install
```

### 2. Start Development Server
```bash
npm run start
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

You should see the documentation site with all 303 placeholder articles!

---

## 📝 Creating Your First Article

### Step 1: Choose an Article to Edit
All articles are in: `classic/docs/`

**Example:** Edit the quick start guide:
```
classic/docs/getting-started/quick-start.md
```

### Step 2: Open the File
Use any text editor (VS Code recommended):
```bash
code classic/docs/getting-started/quick-start.md
```

### Step 3: Edit the Content
- Keep the frontmatter (the YAML section at the top)
- Replace placeholder content with real information
- Use markdown syntax for formatting

### Step 4: Save and View
- Save the file
- The dev server auto-reloads (watch your browser!)
- Changes appear instantly

---

## 📋 Article Structure

### Frontmatter (Required)
Every article starts with frontmatter:

```yaml
---
id: unique-article-id
title: Article Title
sidebar_label: Short Label
sidebar_position: 1
description: Brief description for search results
tags:
  - role:admin
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
---
```

### Content Sections
Use standard markdown with these common sections:

```markdown
## Overview
Brief introduction to the topic.

## Prerequisites
What users need before starting:
- Item 1
- Item 2

## Step-by-Step Instructions

### Step 1: Title
Detailed instructions here.

### Step 2: Title
More instructions.

## Troubleshooting
Common issues and solutions.

## Related Articles
- [Link to related article](./other-article.md)
```

---

## 📁 Where to Find Articles

### Main Documentation Sections
```
classic/docs/
├── getting-started/          # 13 articles
├── platform-fundamentals/   # 10 articles
├── admin-guide/             # 14 articles
├── devices/                 # 99 articles (16 device types)
├── features/                # 45 articles (15 feature types)
├── alarm-management/        # 20 articles
├── reporting/              # 15 articles
├── operator-guide/          # 18 articles
├── installer-guide/         # 20 articles
├── troubleshooting/         # 20 articles
├── knowledge-base/          # 15 articles
├── release-notes/           # 10 articles
└── support/                 # 10 articles
```

### Device-Specific Articles
Each device has its own folder:
```
classic/docs/devices/
├── HikVision/
├── Dahua/
├── ADPRO/
├── Avigilon/
└── ... (13 more device types)
```

---

## 🎨 Using Article Templates

### Available Templates
Located in: `content-staging/templates/`

1. **Device Template** (`device-template.md`)
   - Use for device configuration guides
   - Includes: Overview, Prerequisites, Admin Config, Installer Config, Troubleshooting

2. **Feature Template** (`feature-template.md`)
   - Use for feature documentation
   - Includes: What is it, Benefits, Configuration, Usage, Best Practices

3. **Troubleshooting Template** (`troubleshooting-template.md`)
   - Use for troubleshooting guides
   - Includes: Problem Description, Quick Fixes, Detailed Steps, Prevention

### How to Use Templates
1. Copy template from `content-staging/templates/`
2. Paste into appropriate `classic/docs/` folder
3. Rename file (e.g., `my-new-article.md`)
4. Update frontmatter with correct metadata
5. Replace all `[Placeholder Text]` with real content
6. Remove sections that don't apply

---

## ✏️ Markdown Syntax Guide

### Headers
```markdown
# H1 - Main Title (use sparingly)
## H2 - Section Header (most common)
### H3 - Subsection
#### H4 - Sub-subsection
```

### Text Formatting
```markdown
**bold text**
*italic text*
`code inline`
~~strikethrough~~
```

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
   1. Nested numbered item
```

### Links
```markdown
[Link text](./other-article.md)
[External link](https://example.com)
```

### Images
```markdown
![Alt text](./images/screenshot.png)
![Alt text](/img/logo.svg)
```

**Image locations:**
- Device images: `classic/docs/devices/[DeviceName]/images/`
- General images: `classic/static/img/`

### Code Blocks
````markdown
```bash
npm run start
```

```json
{
  "key": "value"
}
```
````

### Admonitions (Info Boxes)
```markdown
:::note
This is a note.
:::

:::tip
This is a tip.
:::

:::warning
This is a warning.
:::

:::danger
This is a danger warning.
:::
```

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

---

## 🏷️ Frontmatter Tags

### Required Tags
Always include these in your frontmatter:

```yaml
tags:
  - role:admin          # or: operator, installer, manager, all
  - category:configuration  # or: features, troubleshooting, etc.
  - difficulty:beginner     # or: intermediate, advanced
  - platform:GCXONE        # or: talos, both
```

### Optional Tags
Add these when relevant:

```yaml
tags:
  - device:hikvision    # Device-specific articles
  - feature:ai-analytics # Feature-specific articles
  - version:2.5.0       # Version-specific content
```

### Tag Examples
```yaml
# Admin configuration article
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:hikvision

# Feature overview article
tags:
  - role:all
  - category:features
  - difficulty:beginner
  - platform:both
  - feature:ai-analytics
```

---

## 🖼️ Adding Images

### Where to Place Images

**Device-specific images:**
```
classic/docs/devices/HikVision/images/
├── hikvision-1.png
├── hikvision-2.png
└── ...
```

**General images:**
```
classic/static/img/
├── logo.svg
├── screenshot-1.png
└── ...
```

### Image Best Practices
- Use descriptive filenames: `hikvision-admin-config.png`
- Optimize images before adding (compress PNGs, use appropriate format)
- Recommended formats: PNG (screenshots), SVG (icons/logos)
- Max recommended size: 1MB per image
- Use alt text for accessibility

### Referencing Images in Articles
```markdown
![Hikvision Admin Configuration](./images/hikvision-admin-config.png)
```

For images in `static/img/`:
```markdown
![Platform Logo](/img/logo.svg)
```

---

## 🔄 Workflow: Creating a New Article

### 1. Choose Location
Decide which section the article belongs to:
- Getting Started → `classic/docs/getting-started/`
- Device Guide → `classic/docs/devices/[DeviceName]/`
- Feature Guide → `classic/docs/features/`
- etc.

### 2. Copy Template
```bash
# Copy appropriate template
cp content-staging/templates/device-template.md \
   classic/docs/devices/HikVision/new-article.md
```

### 3. Update Frontmatter
```yaml
---
id: hikvision-new-feature
title: New Hikvision Feature
sidebar_label: New Feature
sidebar_position: 5
description: Guide to using the new Hikvision feature
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:hikvision
---
```

### 4. Write Content
- Replace all placeholders
- Use clear, step-by-step instructions
- Include screenshots where helpful
- Add troubleshooting section if relevant

### 5. Update Sidebar (If Needed)
If creating a new section, edit `classic/sidebars.ts`:

```typescript
{
  type: 'category',
  label: 'New Section',
  items: [
    'devices/HikVision/new-article',
    // ... other articles
  ],
},
```

### 6. Test Locally
```bash
npm run start
# Navigate to your new article
# Verify formatting, links, images
```

### 7. Build for Production (When Ready)
```bash
npm run build
# Check for any build errors
```

---

## 🧪 Testing Your Changes

### Development Server
```bash
npm run start
```
- Opens at http://localhost:3000
- Auto-reloads on file changes
- Fast iteration cycle

### Production Build
```bash
npm run build
```
- Creates optimized production files in `build/`
- Tests for broken links
- Generates search index
- Takes 30-60 seconds

### Preview Production Build
```bash
npm run serve
```
- Serves the production build locally
- Tests how it will look in production
- Useful before deploying

---

## 📚 Common Tasks

### Adding a New Device Section
1. Create folder: `classic/docs/devices/NewDevice/`
2. Create `index.md` (overview article)
3. Add device-specific articles
4. Update `classic/sidebars.ts` to include new device

### Adding a New Feature Article
1. Copy feature template
2. Place in appropriate `classic/docs/features/` subfolder
3. Update frontmatter
4. Write content
5. Sidebar updates automatically (if in correct folder)

### Updating Navigation
Edit `classic/sidebars.ts`:
- Reorder articles (change `sidebar_position` in frontmatter)
- Add new sections
- Group related articles

### Adding Screenshots
1. Take screenshot
2. Save to appropriate `images/` folder
3. Reference in article: `![Description](./images/screenshot.png)`
4. Commit to git

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
- Remove frontmatter (required!)
- Use HTML instead of markdown (when possible)
- Create broken internal links
- Use absolute paths for images (use relative paths)
- Forget to update sidebar_position (articles won't sort correctly)

### ✅ Do This Instead
- Always include complete frontmatter
- Use markdown syntax
- Test all links before committing
- Use relative paths: `./images/` or `/img/`
- Set sidebar_position for proper ordering

---

## 🔍 Finding Articles

### By Section
Browse folders in `classic/docs/`:
- `getting-started/` - 13 articles
- `admin-guide/` - 14 articles
- `devices/` - 99 articles
- etc.

### By Device
All device articles in: `classic/docs/devices/[DeviceName]/`

### By Search
Use the search bar in the documentation site (top right)

### By Tags
Articles are tagged by:
- Role (admin, operator, installer)
- Category (configuration, features, troubleshooting)
- Difficulty (beginner, intermediate, advanced)
- Platform (GCXONE, talos, both)

---

## 🛠️ Useful Commands

### Development
```bash
npm run start          # Start dev server
npm run build          # Build for production
npm run serve          # Preview production build
npm run clear          # Clear cache (if issues)
npm run typecheck      # Check TypeScript errors
```

### Content
```bash
# Count articles
find classic/docs -name "*.md" | wc -l

# Find articles with TODO
grep -r "TODO" classic/docs/

# List all device folders
ls classic/docs/devices/
```

---

## 📖 Additional Resources

### Documentation
- **Project README:** `README.md`
- **Deployment Guide:** `PRODUCTION_QA_AND_DEPLOYMENT.md`
- **Architecture:** `Implementation plan/NXGEN_Documentation_Architecture.md`
- **Templates:** `content-staging/templates/README.md`

### Docusaurus Documentation
- Official docs: https://docusaurus.io/
- Markdown guide: https://docusaurus.io/docs/markdown-features
- MDX guide: https://docusaurus.io/docs/markdown-features/react

### Markdown Resources
- Markdown guide: https://www.markdownguide.org/
- GitHub Flavored Markdown: https://github.github.com/gfm/

---

## ❓ Getting Help

### Common Issues

**Dev server won't start:**
```bash
npm run clear
npm install
npm run start
```

**Build fails:**
- Check for syntax errors in markdown
- Verify frontmatter is valid YAML
- Check for broken links
- Run `npm run typecheck`

**Changes not appearing:**
- Hard refresh browser (Ctrl+Shift+R)
- Check file is saved
- Verify correct file location
- Check dev server is running

**Images not showing:**
- Verify image path is correct
- Check image file exists
- Use relative paths: `./images/` not `images/`
- For static images, use `/img/` path

### Need More Help?
- Check `PRODUCTION_QA_AND_DEPLOYMENT.md` for deployment issues
- Review article templates for format examples
- Check Docusaurus documentation for advanced features

---

## ✅ Quality Checklist

Before considering an article complete:

- [ ] Frontmatter is complete and correct
- [ ] All placeholder text replaced
- [ ] Headers use proper hierarchy (##, ###)
- [ ] Links are working (test them!)
- [ ] Images are added and displaying
- [ ] Code blocks have syntax highlighting
- [ ] Lists are properly formatted
- [ ] Tables (if any) are readable
- [ ] Article appears in correct sidebar section
- [ ] Tags are appropriate and complete
- [ ] No broken internal links
- [ ] Screenshots are clear and relevant
- [ ] Content is accurate and up-to-date

---

## 🎯 Best Practices

### Writing Style
- Use clear, concise language
- Write for your audience (admin vs operator vs installer)
- Include step-by-step instructions
- Add screenshots for complex steps
- Include troubleshooting sections
- Link to related articles

### Content Organization
- Start with overview/introduction
- List prerequisites
- Provide step-by-step instructions
- Include examples where helpful
- Add troubleshooting section
- Link to related content

### Technical Accuracy
- Verify all steps work as described
- Test on actual platform
- Update when features change
- Note version-specific information
- Include warnings for destructive actions

---

## 🚀 Ready to Start?

1. **Set up environment:** `npm install` (if not done)
2. **Start dev server:** `npm run start`
3. **Pick an article:** Start with `classic/docs/getting-started/quick-start.md`
4. **Edit and save:** See changes instantly
5. **Build when ready:** `npm run build`

**Happy writing!** 📝

---

**Last Updated:** December 5, 2025  
**Questions?** Check the project README or deployment guide.
