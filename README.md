# GCXONE Documentation

> **10 Breakthroughs. One Platform. Twice the Output. Zero Extra Hires.**

A comprehensive documentation site for GCXONE, built with [Docusaurus 3.8.1](https://docusaurus.io/), featuring a modern, responsive interface with advanced search capabilities and multi-language support.

## 🚀 Current Build Status

- **Build System**: Docusaurus 3.8.1
- **Framework**: React 18.3.1 with TypeScript
- **Node Version**: >=18.0
- **Production Build**: Available in `classic/build/`
- **Dev Server**: Running at `http://localhost:3000` (when started)

## 📁 Project Structure

```
nxgen-docs/
├── classic/                        # Main documentation project
│   ├── docs/                      # Documentation content
│   │   ├── 01-platform-overview/
│   │   ├── 02-account-management/
│   │   ├── 03-network-requirements/
│   │   ├── 04-device-integration/
│   │   ├── 05-operational-features/
│   │   ├── 06-advanced-configuration/
│   │   ├── 07-support-maintenance/
│   │   ├── api/
│   │   ├── devices/               # Device-specific documentation
│   │   ├── features/              # Feature guides
│   │   ├── getting-started/
│   │   ├── release-notes/
│   │   └── roles/
│   ├── src/                       # Custom React components
│   │   ├── components/
│   │   ├── css/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── theme/
│   │   └── utils/
│   ├── static/                    # Static assets
│   ├── build/                     # Production build output
│   ├── i18n/                      # Internationalization files
│   ├── scripts/                   # Build scripts
│   ├── docusaurus.config.ts       # Docusaurus configuration
│   ├── sidebars.ts                # Sidebar configuration
│   └── package.json
└── README.md                      # This file
```

## ✨ Features

### Core Capabilities
- **📚 Comprehensive Documentation**: Structured content across 7 main sections covering platform overview, account management, network requirements, device integration, operational features, advanced configuration, and support & maintenance
- **🔍 Advanced Search**: Powered by `@easyops-cn/docusaurus-search-local` with keyboard shortcuts and search term highlighting
- **🌐 Multi-language Support**: Available in English and German (Deutsch)
- **🎨 Dark Mode**: Automatic theme switching with user preference persistence
- **📱 Responsive Design**: Mobile-first approach with optimized layouts
- **🔗 Deep Linking**: Direct linking to specific sections and headings
- **📊 Table of Contents**: Auto-generated navigation for long documentation pages

### Technical Features
- **TypeScript Support**: Full TypeScript integration for type safety
- **Custom Components**: Reusable React components for enhanced documentation
- **Syntax Highlighting**: Prism integration with support for bash, diff, json, typescript, and javascript
- **Sitemap Generation**: Automatic sitemap.xml generation for SEO
- **Hot Reload**: Instant preview of changes during development
- **Search Index**: Pre-generated search index (`search-index.json`) for fast client-side search

## 🛠️ Installation

### Prerequisites
- Node.js >= 18.0
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd nxgen-docs/classic

# Install dependencies
npm install
# or
yarn install
```

## 💻 Development

### Start Development Server

```bash
npm run start
# or
yarn start
```

The development server will start at `http://0.0.0.0:3000` (accessible from any network interface).

### Available Scripts

| Script        | Command               | Description                              |
| ------------- | --------------------- | ---------------------------------------- |
| `start`       | `npm run start`       | Start development server with hot reload |
| `build`       | `npm run build`       | Build production-ready static site       |
| `serve`       | `npm run serve`       | Serve the production build locally       |
| `clear`       | `npm run clear`       | Clear Docusaurus cache                   |
| `typecheck`   | `npm run typecheck`   | Run TypeScript type checking             |
| `build-index` | `npm run build-index` | Generate search index                    |
| `swizzle`     | `npm run swizzle`     | Customize Docusaurus theme components    |
| `deploy`      | `npm run deploy`      | Deploy to GitHub Pages                   |

### Development Workflow

1. **Start the dev server**: `npm run start`
2. **Edit content**: Make changes to markdown files in `docs/` or React components in `src/`
3. **Preview changes**: Changes are reflected instantly in the browser
4. **Type check**: Run `npm run typecheck` to ensure no TypeScript errors
5. **Build**: Run `npm run build` to create production build
6. **Test build**: Run `npm run serve` to preview the production build locally

## 🏗️ Building for Production

```bash
# Build the static site
npm run build

# The output will be in the build/ directory
# Preview the production build
npm run serve
```

The production build includes:
- Optimized and minified JavaScript/CSS bundles
- Pre-rendered HTML pages for all routes
- Search index for offline search
- Sitemap for SEO
- Asset optimizations (images, fonts, etc.)

## 📦 Dependencies

### Core Dependencies
- **@docusaurus/core**: 3.8.1
- **@docusaurus/preset-classic**: 3.8.1
- **react**: 18.3.1
- **react-dom**: 18.3.1
- **typescript**: ~5.6.2

### UI & Styling
- **@mui/material**: 7.3.5
- **@emotion/react**: 11.14.0
- **@emotion/styled**: 11.14.1
- **lucide-react**: 0.554.0
- **clsx**: 2.0.0

### Search & Utilities
- **@easyops-cn/docusaurus-search-local**: 0.51.1
- **fuse.js**: 7.1.0
- **gray-matter**: 4.0.3

### Syntax Highlighting
- **prism-react-renderer**: 2.3.0

## 🌍 Internationalization

The site supports multiple locales:
- **English (en-US)**: Default locale
- **German (de-DE)**: Secondary locale

To add or modify translations:
1. Edit files in `i18n/<locale>/` directory
2. Run `npm run write-translations` to extract translatable strings
3. Rebuild the site to see changes

## 🎨 Customization

### Theme Configuration
Edit `docusaurus.config.ts` to modify:
- Site metadata (title, tagline, favicon)
- Theme colors and branding
- Navbar and footer
- Plugins and integrations

### Custom CSS
Global styles are defined in `src/css/custom.css`

### Custom Components
Add reusable components in `src/components/` and import them in your markdown files.

### Sidebar Structure
Modify `sidebars.ts` to customize the documentation sidebar navigation.

## 🚢 Deployment

### GitHub Pages

```bash
# Using SSH
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy

# Using HTTPS
GIT_USER=<Your GitHub username> npm run deploy
```

### Docker

A Docker setup is available:

```bash
# Build the Docker image
docker-compose build

# Run the container
docker-compose up
```

See `Dockerfile` and `docker-compose.yml` for configuration details.

### Static Hosting
The `build/` directory can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Any other static hosting provider

## 📝 Documentation Guidelines

### Adding New Documentation

1. Create a new `.md` or `.mdx` file in the appropriate `docs/` subdirectory
2. Add frontmatter with metadata:
```markdown
---
id: unique-id
title: Page Title
sidebar_label: Sidebar Label
sidebar_position: 1
---

Your content here...
```

3. Update `sidebars.ts` if needed to control sidebar navigation
4. The page will automatically appear in the navigation

### Markdown Features

Docusaurus supports extended markdown features:
- **Admonitions**: `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`
- **Code blocks**: With syntax highlighting and line numbers
- **Tabs**: Group related content
- **MDX**: Import and use React components in markdown

## 🔧 Troubleshooting

### Clear Cache
If you encounter build issues, clear the cache:
```bash
npm run clear
```

### Port Already in Use
If port 3000 is occupied, specify a different port:
```bash
npm run start -- --port 3001
```

### TypeScript Errors
Run type checking to identify issues:
```bash
npm run typecheck
```

### Build Failures
Check the build logs in:
- `build_log.txt`
- `build_log_2.txt`
- `build_log_3.txt`
- `error.log`

## 📊 Project Statistics

- **Documentation Pages**: 100+ articles
- **Main Sections**: 7 core categories
- **Device Guides**: 16 device-specific docs
- **Feature Guides**: 24 feature articles
- **Supported Languages**: 2 (English, German)
- **Search Index Size**: ~944 KB

## 🔗 Useful Links

- [Docusaurus Documentation](https://docusaurus.io/)
- [Markdown Guide](https://www.markdownguide.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

Copyright © 2025 GCXONE. All rights reserved.

---

**Last Updated**: November 28, 2025  
**Build Version**: 0.0.0  
**Docusaurus Version**: 3.8.1
#   N X G - D o c s  
 