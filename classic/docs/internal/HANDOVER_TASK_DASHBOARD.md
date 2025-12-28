# NXGEN Documentation Site - Pre-Handover Task Dashboard

**Target Handover Date:** Tomorrow
**Total Estimated Time:** 11 hours (parallelized across 3 agents)
**Last Updated:** 2025-12-28

---

## 🎯 Mission Critical Overview

Fix all CRITICAL and HIGH priority issues before business team handover tomorrow.

**Status Legend:**
- 🔴 NOT STARTED
- 🟡 IN PROGRESS
- ✅ COMPLETE
- ⚠️ BLOCKED

---

## 👥 AGENT ASSIGNMENTS

### Claude Code Agent (Primary Architect)
**Specialty:** Git operations, security fixes, architectural changes
**Estimated Time:** 4 hours

### Cursor Agent (Code Quality Specialist)
**Specialty:** TypeScript fixes, component refactoring, code editing
**Estimated Time:** 4 hours

### Amazon Q Agent (DevOps & Testing)
**Specialty:** Dependency management, deployment, verification
**Estimated Time:** 3 hours

---

## 📋 TASK BREAKDOWN BY AGENT

---

## 🤖 CLAUDE CODE AGENT TASKS

### TASK CC-1: Security Credential Rotation & Removal 🔴 CRITICAL
**Priority:** P1 - MUST DO FIRST
**Estimated Time:** 2 hours
**Status:** 🔴 NOT STARTED

**Objective:**
Remove all hardcoded credentials from codebase and rotate exposed tokens.

**Detailed Instructions:**

1. **Identify all exposed credentials:**
   ```bash
   # List of exposed credentials to rotate:
   - Storyblok Access Token: lZ1VpFd6y9FjoNcJQFlXLAtt
   - Storyblok Management Token: SnZKlMe1dDulcvVEAt6EQAtt-127355674276436-YjsPjJbmPT5X5gxV9GD1
   - SMTP Password: HtPkPzaSjssz
   - SMTP User: emailappsmtp.1bb47c6b0a9025c9
   - Hygraph JWT tokens (3 tokens in .env.local)
   ```

2. **Remove hardcoded tokens from source:**

   **File: `classic/src/lib/storyblok.ts`**
   ```typescript
   // BEFORE (Line 10):
   const STORYBLOK_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN || 'lZ1VpFd6y9FjoNcJQFlXLAtt';

   // AFTER:
   const STORYBLOK_TOKEN = process.env.STORYBLOK_ACCESS_TOKEN;
   if (!STORYBLOK_TOKEN) {
     throw new Error('STORYBLOK_ACCESS_TOKEN environment variable is required');
   }
   ```

   **File: `classic/src/pages/storyblok-preview.tsx`**
   ```typescript
   // BEFORE (Line 47):
   window.storyblok.init({
     accessToken: 'lZ1VpFd6y9FjoNcJQFlXLAtt',
   });

   // AFTER:
   window.storyblok.init({
     accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
   });
   ```

   **File: `classic/netlify.toml`**
   ```toml
   # BEFORE (Lines 7-9):
   STORYBLOK_ACCESS_TOKEN = "lZ1VpFd6y9FjoNcJQFlXLAtt"

   # AFTER:
   # IMPORTANT: Set STORYBLOK_ACCESS_TOKEN in Netlify Dashboard
   # Do not commit tokens to version control
   ```

   **File: `classic/api/feedback.ts`**
   ```typescript
   // BEFORE (Lines 7-11):
   const mailConfig = {
     user: 'emailappsmtp.1bb47c6b0a9025c9',
     pass: 'HtPkPzaSjssz',
   };

   // AFTER:
   const mailConfig = {
     user: process.env.SMTP_USER,
     pass: process.env.SMTP_PASS,
   };
   if (!mailConfig.user || !mailConfig.pass) {
     throw new Error('SMTP_USER and SMTP_PASS environment variables required');
   }
   ```

3. **Update .env.example with all required variables:**
   ```bash
   # Add to classic/.env.example:
   STORYBLOK_ACCESS_TOKEN=your_public_token_here
   STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here
   STORYBLOK_REGION=eu
   STORYBLOK_SPACE_ID=289434723537263
   STORYBLOK_IS_PREVIEW=true
   SMTP_USER=your_smtp_user_here
   SMTP_PASS=your_smtp_password_here
   ```

4. **Create NEW credentials (do not use old exposed ones):**
   - Go to Storyblok Dashboard → Settings → Access Tokens
   - Generate NEW Public Access Token (replace lZ1VpFd6y9FjoNcJQFlXLAtt)
   - Generate NEW Management Token (replace SnZKlMe1dDulcvVEAt6EQAtt...)
   - Update SMTP credentials (contact email provider)
   - Update local .env.local with NEW tokens

5. **Verify build still works locally:**
   ```bash
   cd classic
   npm run build
   # Should succeed with new env vars
   ```

**Deliverables:**
- [ ] All hardcoded credentials removed from source files
- [ ] New credentials generated and documented
- [ ] .env.example updated with all required variables
- [ ] Local build verified working with new credentials
- [ ] List of new credentials provided (securely, not in git)

**Report Back Format:**
```
TASK CC-1 STATUS: ✅ COMPLETE

Files Modified:
1. classic/src/lib/storyblok.ts - Removed hardcoded token, added validation
2. classic/src/pages/storyblok-preview.tsx - Now uses env var
3. classic/netlify.toml - Removed exposed token
4. classic/api/feedback.ts - Now uses env vars for SMTP
5. classic/.env.example - Added all required variables

New Credentials Generated:
- Storyblok Access Token: [NEW_TOKEN_VALUE] (length: 24 chars)
- Storyblok Management Token: [NEW_TOKEN_VALUE] (length: 64 chars)
- SMTP credentials: Updated (contact: user@example.com)

Verification:
✅ npm run build - SUCCESS (2m 15s)
✅ No hardcoded credentials detected in source
✅ All env vars documented in .env.example

Issues/Blockers: None
```

---

### TASK CC-2: Purge .env.local from Git History 🔴 CRITICAL
**Priority:** P1 - CRITICAL
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Remove .env.local file from entire git history to eliminate exposed credentials.

**Detailed Instructions:**

1. **Verify .env.local is in git history:**
   ```bash
   cd c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs
   git log --all --full-history -- classic/.env.local
   # If output shows commits, file was committed
   ```

2. **Backup current repository:**
   ```bash
   # Create backup before destructive operation
   cd ..
   cp -r nxgen-docs nxgen-docs-backup-$(date +%Y%m%d)
   cd nxgen-docs
   ```

3. **Install git-filter-repo (if not installed):**
   ```bash
   # Check if installed
   git filter-repo --version

   # If not installed:
   # Windows: pip install git-filter-repo
   # Or download from: https://github.com/newren/git-filter-repo
   ```

4. **Remove .env.local from entire history:**
   ```bash
   # Using git-filter-repo (recommended):
   git filter-repo --invert-paths --path classic/.env.local --force

   # OR using BFG Repo-Cleaner (alternative):
   # Download BFG from: https://rtyley.github.io/bfg-repo-cleaner/
   # java -jar bfg.jar --delete-files .env.local
   # git reflog expire --expire=now --all
   # git gc --prune=now --aggressive
   ```

5. **Verify removal:**
   ```bash
   # Check that .env.local is gone from history
   git log --all --full-history -- classic/.env.local
   # Should return: "fatal: ambiguous argument" or no results

   # Verify file still exists locally (not in git)
   ls classic/.env.local
   # Should still exist (not tracked)

   # Verify it's in .gitignore
   grep ".env.local" classic/.gitignore
   # Should show .env.local in gitignore
   ```

6. **Force push to remote (COORDINATE WITH TEAM FIRST):**
   ```bash
   # WARNING: This rewrites history - notify team before doing this
   # All team members will need to re-clone the repository

   git push origin --force --all
   git push origin --force --tags
   ```

**Deliverables:**
- [ ] .env.local completely removed from git history
- [ ] Repository backup created
- [ ] Verification commands run successfully
- [ ] Team notified before force push (if applicable)
- [ ] Remote repository updated with cleaned history

**Report Back Format:**
```
TASK CC-2 STATUS: ✅ COMPLETE

Actions Taken:
1. Backup created: nxgen-docs-backup-20251228
2. git-filter-repo installed (version: X.X.X)
3. Removed classic/.env.local from entire git history
4. Force pushed to origin (all team members notified)

Verification:
✅ git log shows no history for .env.local
✅ File still exists locally (not tracked)
✅ File is in .gitignore
✅ Repository size reduced by: X MB

Before History Size: XXX commits
After History Size: XXX commits (rewrites applied)

Issues/Blockers: None
```

---

### TASK CC-3: Clean Up Test Content & Organize Commits 🔴 HIGH
**Priority:** P2
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Remove test files, organize status documents, and commit all changes in logical groups.

**Detailed Instructions:**

1. **Remove test articles:**
   ```bash
   cd classic/docs

   # Remove test files:
   rm -f api-test-*.md
   rm -f cms-test-article.md
   rm -f cms-configuration-test.md
   rm -f publish.md  # Minimal content, appears to be test

   # Verify removal:
   git status
   ```

2. **Organize status documents:**
   ```bash
   # Create internal docs folder
   mkdir -p classic/docs/internal

   # Move status documents to internal folder
   mv ARTICLES_CREATION_SUMMARY.md classic/docs/internal/
   mv ARTICLE_ENHANCEMENT_SUMMARY.md classic/docs/internal/
   mv FEEDBACK_WIDGET_PRD.md classic/docs/internal/
   mv STORYBLOK_BUILD_FIX_SUMMARY.md classic/docs/internal/
   mv UNMAPPED_BUTTONS_AND_CARDS.md classic/docs/internal/

   # Update .gitignore to exclude internal docs from builds
   echo "docs/internal/" >> classic/.gitignore
   ```

3. **Handle PDF files (do NOT commit large binaries):**
   ```bash
   # Move PDFs to separate location outside repo
   mkdir -p ../nxgen-docs-assets
   mv "Missing articles/" ../nxgen-docs-assets/pdf-sources/

   # Or delete if no longer needed:
   # rm -rf "Missing articles/"
   ```

4. **Review uncommitted changes:**
   ```bash
   git status
   git diff classic/src/pages/index.tsx
   git diff classic/docs/alarm-management/
   # Review each changed file
   ```

5. **Commit changes in logical groups:**
   ```bash
   # Commit 1: Remove test content
   git add -A
   git reset classic/docs/device-integration/  # Don't include in this commit
   git commit -m "chore: Remove test articles and organize internal documentation

   - Removed api-test-*.md, cms-test-article.md test files
   - Moved status documents to docs/internal/
   - Excluded internal docs from builds

   🤖 Generated with Claude Code"

   # Commit 2: Add device integration docs
   git add classic/docs/device-integration/
   git add classic/static/img/device-integration/
   git commit -m "docs: Add comprehensive device integration guides

   - IP Camera integration guide with examples
   - Alarm panel integration guide
   - IoT sensor integration guide
   - Added device-specific images and diagrams

   🤖 Generated with Claude Code"

   # Commit 3: Update landing page
   git add classic/src/pages/index.tsx
   git commit -m "fix: Update landing page with correct documentation links

   - Fixed Video Tutorials link
   - Fixed Release Notes link
   - Updated Popular Devices card links
   - Improved device monitoring card links

   🤖 Generated with Claude Code"

   # Commit 4: Update alarm management docs
   git add classic/docs/alarm-management/
   git add classic/docs/reporting/
   git commit -m "docs: Update alarm management and reporting documentation

   - Enhanced alarm configuration documentation
   - Updated device activity reporting
   - Improved troubleshooting guides

   🤖 Generated with Claude Code"

   # Commit 5: Remove Payload CMS
   git add -A  # Include all deleted payload-cms files
   git commit -m "refactor: Remove unused Payload CMS integration

   - Deleted payload-cms/ directory (13 files)
   - Removed Payload CMS dependencies
   - Simplified CMS strategy to Storyblok only

   🤖 Generated with Claude Code"

   # Commit 6: Update styles and UI components
   git add classic/src/css/custom.css
   git add classic/src/components/
   git commit -m "style: Update custom styles and remove unused components

   - Removed FloatingDarkModeToggle (functionality moved to theme)
   - Removed FloatingLanguageToggle (functionality moved to theme)
   - Updated custom CSS for brand consistency

   🤖 Generated with Claude Code"
   ```

6. **Push all commits:**
   ```bash
   git push origin main
   ```

**Deliverables:**
- [ ] All test articles removed
- [ ] Status documents organized into docs/internal/
- [ ] PDF files moved outside repository
- [ ] 6 logical commits created with clear messages
- [ ] All commits pushed to remote

**Report Back Format:**
```
TASK CC-3 STATUS: ✅ COMPLETE

Files Removed:
- classic/docs/api-test-1766839639439.md
- classic/docs/cms-test-article.md
- classic/docs/cms-configuration-test.md
- classic/docs/publish.md

Files Organized:
- Moved 5 status documents to docs/internal/
- Moved PDFs to ../nxgen-docs-assets/

Commits Created:
1. chore: Remove test articles and organize internal documentation (abc1234)
2. docs: Add comprehensive device integration guides (def5678)
3. fix: Update landing page with correct documentation links (ghi9012)
4. docs: Update alarm management and reporting documentation (jkl3456)
5. refactor: Remove unused Payload CMS integration (mno7890)
6. style: Update custom styles and remove unused components (pqr1234)

Git Status:
✅ All commits pushed to origin/main
✅ Working tree clean
✅ No uncommitted changes

Issues/Blockers: None
```

---

## 🎨 CURSOR AGENT TASKS

### TASK CU-1: Fix TypeScript Configuration & JSX Errors 🔴 HIGH
**Priority:** P2
**Estimated Time:** 1.5 hours
**Status:** 🔴 NOT STARTED

**Objective:**
Fix tsconfig.json to resolve 14 JSX namespace errors and improve type safety.

**Detailed Instructions:**

1. **Update tsconfig.json:**
   ```json
   {
     "extends": "@docusaurus/tsconfig",
     "compilerOptions": {
       "baseUrl": ".",
       "types": ["react", "react-dom", "@docusaurus/types", "node"],
       "jsx": "react-jsx",
       "jsxImportSource": "react",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "strict": false,
       "skipLibCheck": true
     },
     "include": [
       "src/**/*",
       ".docusaurus/**/*"
     ],
     "exclude": [
       "node_modules",
       "build",
       ".docusaurus/dist"
     ]
   }
   ```

2. **Run typecheck to see remaining errors:**
   ```bash
   cd classic
   npm run typecheck 2>&1 | tee typecheck-errors.log
   # This will show remaining errors after tsconfig fix
   ```

3. **Fix remaining errors one by one:**

   **Error Group 1: Missing imports (3 files)**

   **File: `src/components/SidebarOverlay/index.tsx`**
   ```typescript
   // ERROR: Cannot find module '../../contexts/CMSContext'

   // DECISION NEEDED:
   // Option A: Create the missing CMSContext
   // Option B: Remove CMSContext dependency (recommended if not used)

   // If Option B, replace CMSContext usage with simple state:
   import React, { useState } from 'react';

   // Remove: import { useCMS } from '../../contexts/CMSContext';
   // Replace with local state management
   ```

   **File: `src/pages/download-integration.tsx`**
   ```typescript
   // ERROR: Cannot find name 'FileText' (Line 631)

   // FIX: Add missing import
   import { FileText } from 'lucide-react';
   ```

   **Error Group 2: Framer Motion type errors (5 occurrences)**

   **File: `src/components/NXGENSphereHero.tsx`**
   ```typescript
   // ERROR: Type '{ ease: string; duration: number; }' is not compatible

   // BEFORE (Line 172):
   const variants = {
     animate: {
       transition: {
         ease: "easeInOut",  // ❌ Wrong type
         duration: 2
       }
     }
   };

   // AFTER:
   const variants = {
     animate: {
       transition: {
         ease: [0.645, 0.045, 0.355, 1.000],  // ✅ Correct type (cubic bezier array)
         duration: 2
       }
     }
   };

   // Search and replace all string easing values with arrays:
   // "easeInOut" → [0.645, 0.045, 0.355, 1.000]
   // "easeOut" → [0.16, 1, 0.3, 1]
   // "easeIn" → [0.42, 0, 1, 1]
   ```

   **Error Group 3: Chart.js global type (1 file)**

   **File: `src/pages/quick-start/platform-overview.tsx`**
   ```typescript
   // ERROR: Property 'Chart' does not exist on type 'Window'

   // FIX: Add type declaration at top of file
   declare global {
     interface Window {
       Chart: any;
     }
   }
   ```

   **Error Group 4: Disabled component (can skip or fix)**

   **File: `src/theme/DocCardList.disabled/index.tsx`**
   ```typescript
   // ERROR: Property 'items' does not exist on type 'unknown'

   // Since this component is .disabled, you can either:
   // Option A: Skip fixing (it's disabled anyway)
   // Option B: Add proper type annotation

   // If Option B:
   interface DocCardListProps {
     items?: any[];
   }

   export default function DocCardList({ items }: DocCardListProps) {
     // ...
   }
   ```

4. **Run typecheck again to verify all fixed:**
   ```bash
   npm run typecheck
   # Should show 0 errors or minimal acceptable errors
   ```

5. **Test build to ensure no runtime errors:**
   ```bash
   npm run build
   # Should succeed
   ```

**Deliverables:**
- [ ] tsconfig.json updated with proper configuration
- [ ] All 22 TypeScript errors resolved
- [ ] typecheck command runs successfully (0 errors)
- [ ] Build succeeds without type-related errors
- [ ] Before/after error count documented

**Report Back Format:**
```
TASK CU-1 STATUS: ✅ COMPLETE

TypeScript Configuration:
✅ Updated tsconfig.json with proper types array
✅ Added jsx: "react-jsx" configuration
✅ Included all necessary type definitions

Errors Fixed:
1. JSX Namespace Errors: 14 → 0 (tsconfig fix)
2. Missing CMSContext: 1 → 0 (removed dependency)
3. Missing FileText import: 1 → 0 (added import)
4. Framer Motion type errors: 5 → 0 (fixed easing values)
5. Chart.js global: 1 → 0 (added type declaration)
6. DocCardList disabled: 1 → 0 (skipped - component disabled)

Before: 22 errors
After: 0 errors

Verification:
✅ npm run typecheck - 0 errors
✅ npm run build - SUCCESS (2m 10s)

Files Modified:
1. classic/tsconfig.json - Updated configuration
2. classic/src/components/SidebarOverlay/index.tsx - Removed CMSContext
3. classic/src/pages/download-integration.tsx - Added FileText import
4. classic/src/components/NXGENSphereHero.tsx - Fixed easing types
5. classic/src/pages/quick-start/platform-overview.tsx - Added Chart global

Issues/Blockers: None
```

---

### TASK CU-2: Add XSS Protection to Storyblok Components 🔴 HIGH
**Priority:** P2
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Add DOMPurify sanitization to prevent XSS attacks in Storyblok rich text rendering.

**Detailed Instructions:**

1. **Verify DOMPurify is installed:**
   ```bash
   cd classic
   grep "dompurify" package.json
   # Should show: "dompurify": "^3.0.0" or similar

   # If not installed:
   npm install dompurify
   npm install --save-dev @types/dompurify
   ```

2. **Update DocPage component with sanitization:**

   **File: `classic/src/components/storyblok/DocPage.tsx`**
   ```typescript
   import React from 'react';
   import { storyblokEditable, renderRichText, SbBlokData } from '@storyblok/react';
   import DOMPurify from 'dompurify';  // ← ADD THIS
   import type { DocPage as DocPageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

   interface DocPageProps {
     blok: DocPageType;
   }

   const DocPage: React.FC<DocPageProps> = ({ blok }) => {
     // Render rich text content
     const renderedBody = blok.body ? renderRichText(blok.body as any) : '';

     // ← ADD SANITIZATION HERE
     const sanitizedBody = DOMPurify.sanitize(renderedBody, {
       ALLOWED_TAGS: [
         'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
         'p', 'br', 'hr',
         'strong', 'em', 'u', 's', 'code', 'pre',
         'ul', 'ol', 'li',
         'a', 'img',
         'blockquote',
         'table', 'thead', 'tbody', 'tr', 'th', 'td',
         'div', 'span'
       ],
       ALLOWED_ATTR: [
         'href', 'target', 'rel',
         'src', 'alt', 'width', 'height',
         'class', 'id'
       ],
       ALLOW_DATA_ATTR: false
     });

     return (
       <article {...storyblokEditable(blok as SbBlokData)} className="storyblok-doc-page">
         {blok.title && <h1 className="doc-title">{blok.title}</h1>}

         {blok.description && (
           <p className="doc-description">{blok.description}</p>
         )}

         {sanitizedBody && (
           <div
             className="doc-content"
             dangerouslySetInnerHTML={{ __html: sanitizedBody }}  // ← USE SANITIZED VERSION
           />
         )}
       </article>
     );
   };

   export default DocPage;
   ```

3. **Update Page component (if it uses rich text):**

   **File: `classic/src/components/storyblok/Page.tsx`**
   ```typescript
   import React from 'react';
   import { storyblokEditable, SbBlokData } from '@storyblok/react';
   import DOMPurify from 'dompurify';  // ← ADD THIS
   import type { Page as PageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

   interface PageProps {
     blok: PageType;
   }

   const Page: React.FC<PageProps> = ({ blok }) => {
     // Sanitize body if it contains HTML
     const sanitizedBody = blok.body ? DOMPurify.sanitize(blok.body) : '';

     return (
       <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
         {blok.title && <h1>{blok.title}</h1>}
         {sanitizedBody && (
           <div
             className="page-content"
             dangerouslySetInnerHTML={{ __html: sanitizedBody }}
           />
         )}
       </div>
     );
   };

   export default Page;
   ```

4. **Create sanitization utility (optional but recommended):**

   **New File: `classic/src/lib/sanitize.ts`**
   ```typescript
   import DOMPurify from 'dompurify';

   /**
    * Sanitize HTML content to prevent XSS attacks
    * Uses DOMPurify with strict allowlist
    */
   export function sanitizeHTML(html: string): string {
     return DOMPurify.sanitize(html, {
       ALLOWED_TAGS: [
         // Headings
         'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
         // Text formatting
         'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'code', 'pre',
         // Lists
         'ul', 'ol', 'li',
         // Links and media
         'a', 'img',
         // Quotes and blocks
         'blockquote',
         // Tables
         'table', 'thead', 'tbody', 'tr', 'th', 'td',
         // Containers
         'div', 'span'
       ],
       ALLOWED_ATTR: [
         'href', 'target', 'rel',
         'src', 'alt', 'width', 'height',
         'class', 'id'
       ],
       ALLOW_DATA_ATTR: false,
       FORCE_BODY: true
     });
   }

   /**
    * Sanitize rich text from Storyblok
    */
   export function sanitizeRichText(richTextHTML: string): string {
     return sanitizeHTML(richTextHTML);
   }
   ```

   **Then update components to use utility:**
   ```typescript
   import { sanitizeRichText } from '../../lib/sanitize';

   const sanitizedBody = sanitizeRichText(renderedBody);
   ```

5. **Test sanitization:**
   ```bash
   # Build should succeed
   npm run build

   # Test that XSS attempts are blocked:
   # In Storyblok, try adding: <script>alert('XSS')</script>
   # Should be stripped out when rendered
   ```

**Deliverables:**
- [ ] DOMPurify installed and configured
- [ ] DocPage component sanitizes rich text
- [ ] Page component sanitizes HTML
- [ ] Sanitization utility created (optional)
- [ ] XSS protection tested and verified
- [ ] Build succeeds with sanitization

**Report Back Format:**
```
TASK CU-2 STATUS: ✅ COMPLETE

DOMPurify Installation:
✅ dompurify@3.0.0 installed
✅ @types/dompurify installed

Components Updated:
1. classic/src/components/storyblok/DocPage.tsx
   - Added DOMPurify sanitization
   - Configured strict allowlist (18 allowed tags)
   - Sanitizes before dangerouslySetInnerHTML

2. classic/src/components/storyblok/Page.tsx
   - Added DOMPurify sanitization
   - Handles plain HTML body field

3. classic/src/lib/sanitize.ts (NEW)
   - Created reusable sanitization utility
   - Consistent configuration across components
   - Documentation included

XSS Protection Testing:
✅ Tested <script> tag injection - BLOCKED
✅ Tested onclick handler injection - BLOCKED
✅ Tested data: URI in img src - BLOCKED
✅ Allowed tags render correctly (headings, links, images)

Verification:
✅ npm run build - SUCCESS
✅ TypeScript compilation - No errors
✅ XSS attempts properly sanitized

Issues/Blockers: None
```

---

### TASK CU-3: Improve Storyblok Page Component Rich Text Rendering 🟡 MEDIUM
**Priority:** P2
**Estimated Time:** 0.5 hours
**Status:** 🔴 NOT STARTED

**Objective:**
Fix Page component to properly render rich text like DocPage does.

**Detailed Instructions:**

1. **Check current Page component implementation:**
   ```typescript
   // Current issue: blok.body is displayed raw, not rendered as HTML
   {blok.body && (
     <div className="page-content">
       {blok.body}  // ← This just shows raw text/HTML
     </div>
   )}
   ```

2. **Check Storyblok schema for Page component:**
   ```bash
   # Check what type 'body' field is
   cat classic/.storyblok/components/289434723537263/components.json | grep -A 20 '"name": "page"'

   # Look for body field type:
   # - If "plugin": "richtext" → needs renderRichText()
   # - If "type": "text" → can use as plain text
   # - If "type": "textarea" → can use as plain text or markdown
   ```

3. **Update Page component based on body field type:**

   **Option A: If body is rich text (like DocPage):**
   ```typescript
   import React from 'react';
   import { storyblokEditable, renderRichText, SbBlokData } from '@storyblok/react';
   import DOMPurify from 'dompurify';
   import type { Page as PageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

   interface PageProps {
     blok: PageType;
   }

   const Page: React.FC<PageProps> = ({ blok }) => {
     // Render and sanitize rich text
     const renderedBody = blok.body ? renderRichText(blok.body as any) : '';
     const sanitizedBody = DOMPurify.sanitize(renderedBody);

     return (
       <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
         {blok.title && <h1>{blok.title}</h1>}
         {sanitizedBody && (
           <div
             className="page-content"
             dangerouslySetInnerHTML={{ __html: sanitizedBody }}
           />
         )}
       </div>
     );
   };

   export default Page;
   ```

   **Option B: If body is plain text:**
   ```typescript
   const Page: React.FC<PageProps> = ({ blok }) => {
     return (
       <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
         {blok.title && <h1>{blok.title}</h1>}
         {blok.body && (
           <div className="page-content">
             <p>{blok.body}</p>  {/* Plain text, no HTML rendering */}
           </div>
         )}
       </div>
     );
   };
   ```

   **Option C: If body is markdown:**
   ```typescript
   import ReactMarkdown from 'react-markdown';

   const Page: React.FC<PageProps> = ({ blok }) => {
     return (
       <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
         {blok.title && <h1>{blok.title}</h1>}
         {blok.body && (
           <div className="page-content">
             <ReactMarkdown>{blok.body}</ReactMarkdown>
           </div>
         )}
       </div>
     );
   };
   ```

4. **Test the Page component:**
   ```bash
   # Build should succeed
   npm run build

   # Test in Storyblok:
   # 1. Create a test Page story in Storyblok
   # 2. Add content to the body field
   # 3. Preview should render correctly (not show raw HTML/text)
   ```

**Deliverables:**
- [ ] Page component body field type identified
- [ ] Page component updated with correct rendering method
- [ ] Sanitization applied if rendering HTML
- [ ] Build succeeds
- [ ] Component tested with Storyblok preview

**Report Back Format:**
```
TASK CU-3 STATUS: ✅ COMPLETE

Investigation:
- Checked Storyblok schema for Page component
- Body field type: [richtext/text/textarea]
- Current behavior: Raw text display (incorrect)

Implementation:
- Updated Page component to use [renderRichText/plain text/markdown]
- Added DOMPurify sanitization (if HTML rendering)
- Improved component structure

Files Modified:
1. classic/src/components/storyblok/Page.tsx - Fixed body rendering

Verification:
✅ npm run build - SUCCESS
✅ Created test Page story in Storyblok
✅ Preview renders correctly (not raw HTML)
✅ Sanitization working (tested XSS attempt)

Issues/Blockers: None
```

---

### TASK CU-4: Fix or Remove Broken Components 🟡 MEDIUM
**Priority:** P2
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Address recently deleted components and components with errors.

**Detailed Instructions:**

1. **Investigate deleted FloatingDarkModeToggle:**
   ```bash
   # Check git history to see why it was deleted
   git log --oneline --all -- classic/src/components/FloatingDarkModeToggle/
   git show <commit-hash>  # View deletion commit

   # Check if functionality was moved elsewhere
   grep -r "dark.*mode.*toggle" classic/src/theme/
   grep -r "DarkModeToggle" classic/src/
   ```

   **Actions based on findings:**
   - If functionality moved to theme → Document in comments
   - If functionality lost → Consider if it needs to be restored
   - If intentional deletion → Verify dark mode still works

2. **Investigate deleted FloatingLanguageToggle:**
   ```bash
   # Check git history
   git log --oneline --all -- classic/src/components/FloatingLanguageToggle/

   # Check if language switching still works
   grep -r "language.*toggle" classic/src/
   grep -r "LanguageToggle" classic/src/
   ```

   **Actions:**
   - Verify language switching functionality exists elsewhere
   - Test language switching in browser
   - Document if intentional deletion

3. **Fix SidebarOverlay missing CMSContext:**

   **File: `classic/src/components/SidebarOverlay/index.tsx`**

   **Decision: Remove CMSContext dependency (already done in TASK CU-1)**
   ```typescript
   // If CMSContext was for sidebar state, use local state instead:
   import React, { useState } from 'react';

   interface SidebarOverlayProps {
     isOpen: boolean;
     onClose: () => void;
   }

   const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ isOpen, onClose }) => {
     if (!isOpen) return null;

     return (
       <div className="sidebar-overlay" onClick={onClose}>
         {/* Overlay content */}
       </div>
     );
   };

   export default SidebarOverlay;
   ```

4. **Check if SidebarOverlay is actually used:**
   ```bash
   # Search for SidebarOverlay usage
   grep -r "SidebarOverlay" classic/src/ --exclude-dir=node_modules

   # If not used anywhere:
   # Consider deleting the component entirely
   ```

5. **Review DocCardList.disabled:**
   ```bash
   # Check why it's disabled
   git log --oneline -- classic/src/theme/DocCardList.disabled/

   # Options:
   # A. Try to re-enable if issues are fixed
   # B. Delete if permanently unused
   # C. Keep disabled but fix TypeScript errors for future use
   ```

6. **Test UI components:**
   ```bash
   # Start dev server
   npm start

   # Open browser and test:
   # - Dark mode toggle (should work)
   # - Language switching (should work)
   # - Sidebar overlay (if used)
   # - Doc card lists (on doc pages)
   ```

**Deliverables:**
- [ ] FloatingDarkModeToggle deletion investigated and documented
- [ ] FloatingLanguageToggle deletion investigated and documented
- [ ] SidebarOverlay CMSContext dependency removed or component deleted
- [ ] DocCardList.disabled decision made (fix/delete/keep)
- [ ] All UI components tested in browser
- [ ] Dark mode and language switching verified working

**Report Back Format:**
```
TASK CU-4 STATUS: ✅ COMPLETE

Deleted Components Investigation:

1. FloatingDarkModeToggle:
   - Deleted in commit: abc1234 on 2025-12-27
   - Reason: Functionality moved to Docusaurus theme toggle
   - Current status: ✅ Dark mode works via theme toggle
   - Action: No restoration needed

2. FloatingLanguageToggle:
   - Deleted in commit: abc1234 on 2025-12-27
   - Reason: Functionality moved to navbar language dropdown
   - Current status: ✅ Language switching works via navbar
   - Action: No restoration needed

Component Fixes:

3. SidebarOverlay:
   - Removed CMSContext dependency
   - Checked usage: NOT USED anywhere in codebase
   - Decision: DELETED component (not needed)
   - File removed: classic/src/components/SidebarOverlay/

4. DocCardList.disabled:
   - Status: Kept disabled for now
   - Reason: SSG errors per documentation
   - Action: Fixed TypeScript errors for future re-enabling
   - Can be re-enabled when SSG issues resolved

UI Testing:
✅ Dark mode toggle - Working (theme toggle in navbar)
✅ Language switching - Working (navbar dropdown)
✅ Sidebar - Working (no overlay needed)
✅ Doc cards - Render correctly on documentation pages

Files Modified:
1. Deleted: classic/src/components/SidebarOverlay/ (not used)
2. Updated: classic/src/theme/DocCardList.disabled/ (TypeScript fixes)

Issues/Blockers: None
```

---

## ☁️ AMAZON Q AGENT TASKS

### TASK AQ-1: Update Security-Critical Dependencies 🔴 HIGH
**Priority:** P2
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Update security-critical packages to latest versions, especially DOMPurify and other security libraries.

**Detailed Instructions:**

1. **Check current versions:**
   ```bash
   cd classic
   npm outdated
   # Note all outdated packages
   ```

2. **Update security-critical packages (HIGH PRIORITY):**
   ```bash
   # DOMPurify (XSS protection)
   npm update dompurify
   # Should update to 3.2.0 or later

   # Check for other security packages:
   npm audit
   npm audit fix
   ```

3. **Update Docusaurus to latest patch version (MEDIUM PRIORITY):**
   ```bash
   # Update all Docusaurus packages
   npm update @docusaurus/core@3.9.2
   npm update @docusaurus/preset-classic@3.9.2
   npm update @docusaurus/theme-mermaid@3.9.2
   npm update @docusaurus/plugin-client-redirects@3.9.2
   npm update @docusaurus/plugin-content-docs@3.9.2
   npm update @docusaurus/plugin-content-blog@3.9.2
   npm update @docusaurus/plugin-content-pages@3.9.2

   # Or use single command:
   npm update @docusaurus/core @docusaurus/preset-classic @docusaurus/theme-mermaid
   ```

4. **Update Storyblok packages (LOW PRIORITY):**
   ```bash
   npm update @storyblok/react
   npm update storyblok-js-client
   ```

5. **Update Algolia search (MEDIUM PRIORITY):**
   ```bash
   # Check current version
   npm list algoliasearch

   # Algolia 4 → 5 is a MAJOR version upgrade
   # Skip for now if build is working
   # Document for future upgrade:
   echo "TODO: Plan Algolia v5 upgrade" >> classic/docs/internal/upgrade-todos.md
   ```

6. **DO NOT update React (breaking changes):**
   ```bash
   # React 18 → 19 has breaking changes
   # Keep React 18 for now
   # Document in upgrade plan:
   echo "TODO: Plan React 19 upgrade (test for breaking changes)" >> classic/docs/internal/upgrade-todos.md
   ```

7. **Test after updates:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install

   # Run typecheck
   npm run typecheck

   # Run build
   npm run build

   # Test dev server
   npm start
   # Open http://localhost:3000 and click around
   ```

8. **Document updates:**
   ```bash
   # Create update log
   npm list --depth=0 > updated-dependencies.txt
   git add package.json package-lock.json updated-dependencies.txt
   git commit -m "chore: Update security-critical dependencies

   - Updated DOMPurify to latest version
   - Updated Docusaurus to 3.9.2 (bug fixes)
   - Ran security audit and fixed vulnerabilities
   - Tested build and dev server

   🤖 Generated with Amazon Q"
   ```

**Deliverables:**
- [ ] Security audit run and vulnerabilities fixed
- [ ] DOMPurify updated to latest
- [ ] Docusaurus updated to 3.9.2
- [ ] All tests passed (typecheck, build, dev server)
- [ ] package.json and package-lock.json updated
- [ ] Upgrade plan documented for React 19 and Algolia v5
- [ ] Changes committed

**Report Back Format:**
```
TASK AQ-1 STATUS: ✅ COMPLETE

Dependency Updates:

Security-Critical (UPDATED):
- dompurify: 3.0.0 → 3.2.1 ✅
- react-helmet: X.X.X → X.X.X ✅
- [other security packages]

Docusaurus (UPDATED):
- @docusaurus/core: 3.8.1 → 3.9.2 ✅
- @docusaurus/preset-classic: 3.8.1 → 3.9.2 ✅
- @docusaurus/theme-mermaid: 3.8.1 → 3.9.2 ✅

Storyblok (UPDATED):
- @storyblok/react: X.X.X → X.X.X ✅
- storyblok-js-client: X.X.X → X.X.X ✅

Deferred for Future:
- React: 18.3.1 (keep) - React 19 requires testing
- algoliasearch: 4.25.3 (keep) - v5 is major upgrade
- Documented in: docs/internal/upgrade-todos.md

Security Audit:
✅ npm audit - 0 high severity vulnerabilities
✅ npm audit fix - Applied automatic fixes
⚠️ X moderate vulnerabilities (acceptable for now)

Verification:
✅ npm run typecheck - 0 errors
✅ npm run build - SUCCESS (2m 18s)
✅ npm start - Dev server working
✅ Tested in browser - All features working

Commit:
✅ Committed as: chore: Update security-critical dependencies (xyz1234)

Issues/Blockers: None
```

---

### TASK AQ-2: Verify Netlify Deployment & Environment Variables 🔴 HIGH
**Priority:** P1 (after CC-1 completes)
**Status:** 🔴 NOT STARTED

**Objective:**
Update Netlify dashboard with new credentials and verify deployment works.

**Detailed Instructions:**

1. **Wait for Claude Code Agent to complete TASK CC-1:**
   - You will need the NEW credentials generated in CC-1
   - Do not proceed until CC-1 is marked ✅ COMPLETE

2. **Login to Netlify dashboard:**
   ```
   URL: https://app.netlify.com
   Site: gcxone.netlify.app (or current site)
   ```

3. **Update environment variables with NEW credentials:**
   ```
   Navigate to: Site Settings → Environment Variables

   DELETE old variables (exposed credentials):
   ❌ Remove: STORYBLOK_ACCESS_TOKEN (old value)
   ❌ Remove: STORYBLOK_MANAGEMENT_TOKEN (old value)
   ❌ Remove: SMTP_USER (old value)
   ❌ Remove: SMTP_PASS (old value)
   ❌ Remove: HYGRAPH_TOKEN (old value)

   ADD new variables (from CC-1):
   ✅ Add: STORYBLOK_ACCESS_TOKEN = [NEW_TOKEN_FROM_CC1]
   ✅ Add: STORYBLOK_MANAGEMENT_TOKEN = [NEW_TOKEN_FROM_CC1]
   ✅ Add: STORYBLOK_REGION = eu
   ✅ Add: STORYBLOK_SPACE_ID = 289434723537263
   ✅ Add: STORYBLOK_IS_PREVIEW = false  (production mode)
   ✅ Add: SMTP_USER = [NEW_USER_FROM_CC1]
   ✅ Add: SMTP_PASS = [NEW_PASS_FROM_CC1]

   Optional (if using Hygraph):
   ✅ Add: HYGRAPH_TOKEN = [NEW_TOKEN_FROM_CC1]
   ✅ Add: HYGRAPH_AS_SOURCE = false  (using Storyblok instead)
   ```

4. **Trigger manual deploy to test new environment variables:**
   ```
   Navigate to: Deploys → Trigger deploy → Deploy site

   Watch build log:
   - Should fetch Storyblok content successfully
   - Should build without errors
   - Should deploy successfully
   ```

5. **Verify build log doesn't expose secrets:**
   ```
   Check build log:
   ✅ No API tokens visible in logs
   ✅ No passwords visible in logs
   ✅ Environment variables loaded correctly
   ✅ Build succeeds
   ```

6. **Test deployed site:**
   ```
   Open: https://gcxone.netlify.app (or your production URL)

   Test:
   ✅ Site loads correctly
   ✅ Documentation pages work
   ✅ Search works (Algolia)
   ✅ Images load
   ✅ No console errors
   ✅ Feedback widget works (tests SMTP)
   ```

7. **Configure deploy notifications (optional but recommended):**
   ```
   Navigate to: Site Settings → Notifications

   Add:
   - Deploy succeeded notification (email or Slack)
   - Deploy failed notification (email or Slack)
   ```

8. **Document Netlify configuration:**
   ```bash
   # Create Netlify configuration document
   cat > classic/docs/internal/NETLIFY_SETUP.md <<'EOF'
   # Netlify Configuration

   ## Site Information
   - Site Name: gcxone
   - URL: https://gcxone.netlify.app
   - Production URL: https://docs.nxgen.cloud
   - Git Repository: [GitLab URL]

   ## Environment Variables

   Required for Production:
   - STORYBLOK_ACCESS_TOKEN - Storyblok public API token
   - STORYBLOK_MANAGEMENT_TOKEN - Storyblok management API token
   - STORYBLOK_REGION - eu
   - STORYBLOK_SPACE_ID - 289434723537263
   - STORYBLOK_IS_PREVIEW - false
   - SMTP_USER - Email service username
   - SMTP_PASS - Email service password
   - NODE_VERSION - 18 (set in netlify.toml)

   Optional:
   - HYGRAPH_TOKEN - Only if using Hygraph
   - HYGRAPH_AS_SOURCE - false (we use Storyblok)

   ## Build Settings
   - Build command: npm run sync:storyblok:safe && npm run build
   - Publish directory: build
   - Node version: 18

   ## Deploy Settings
   - Auto-deploy: Enabled (on push to main)
   - Deploy previews: Enabled (on pull requests)
   - Branch deploys: Disabled

   ## Notifications
   - Deploy succeeded: [Email/Slack]
   - Deploy failed: [Email/Slack]

   ## Last Updated
   2025-12-28
   EOF
   ```

**Deliverables:**
- [ ] All old environment variables removed from Netlify
- [ ] All new credentials added to Netlify dashboard
- [ ] Manual deploy triggered and succeeded
- [ ] Build log verified (no exposed secrets)
- [ ] Production site tested and working
- [ ] Deploy notifications configured
- [ ] Netlify configuration documented

**Report Back Format:**
```
TASK AQ-2 STATUS: ✅ COMPLETE

Netlify Dashboard Updates:

Environment Variables:
❌ Removed 5 old variables (exposed credentials)
✅ Added 7 new variables (fresh credentials)
✅ Set STORYBLOK_IS_PREVIEW = false (production mode)

Variables Configured:
- STORYBLOK_ACCESS_TOKEN: ✅ Set (new token)
- STORYBLOK_MANAGEMENT_TOKEN: ✅ Set (new token)
- STORYBLOK_REGION: ✅ eu
- STORYBLOK_SPACE_ID: ✅ 289434723537263
- STORYBLOK_IS_PREVIEW: ✅ false
- SMTP_USER: ✅ Set (new credentials)
- SMTP_PASS: ✅ Set (new credentials)

Deployment Test:
✅ Manual deploy triggered
✅ Build time: 5m 23s
✅ Build succeeded (exit code 0)
✅ No secrets exposed in build log
✅ Deploy successful

Production Site Verification:
URL: https://gcxone.netlify.app
✅ Site loads correctly
✅ Documentation pages render
✅ Search functionality works
✅ Images load correctly
✅ No console errors
✅ Feedback widget works (SMTP tested)

Deploy Notifications:
✅ Configured email notifications for:
   - Deploy succeeded → team@example.com
   - Deploy failed → team@example.com

Documentation:
✅ Created classic/docs/internal/NETLIFY_SETUP.md

Issues/Blockers: None
```

---

### TASK AQ-3: Verify Device Documentation Links 🟡 MEDIUM
**Priority:** P3
**Estimated Time:** 1 hour
**Status:** 🔴 NOT STARTED

**Objective:**
Check all device integration hub links and identify broken links to missing documentation.

**Detailed Instructions:**

1. **Extract all device links from integration-hub page:**
   ```bash
   cd classic

   # Extract device links
   grep -oP 'href="/docs/devices/[^"]+' src/pages/integration-hub.tsx > device-links.txt

   # Count total links
   wc -l device-links.txt
   # Should show ~50 device links
   ```

2. **Check which documentation files exist:**
   ```bash
   # Create script to check links
   cat > check-device-links.sh <<'EOF'
   #!/bin/bash

   echo "Checking device documentation links..."
   echo ""

   missing_count=0
   existing_count=0

   while IFS= read -r link; do
     # Remove /docs prefix and add .md extension
     file_path="docs${link#/docs}.md"

     if [ -f "$file_path" ]; then
       echo "✅ EXISTS: $link"
       ((existing_count++))
     else
       echo "❌ MISSING: $link (expected: $file_path)"
       ((missing_count++))
     fi
   done < device-links.txt

   echo ""
   echo "Summary:"
   echo "✅ Existing: $existing_count"
   echo "❌ Missing: $missing_count"
   echo "📊 Total: $((existing_count + missing_count))"
   EOF

   chmod +x check-device-links.sh
   bash check-device-links.sh > device-links-report.txt
   cat device-links-report.txt
   ```

3. **Create list of missing documentation:**
   ```bash
   # Extract just the missing links
   grep "MISSING" device-links-report.txt > missing-device-docs.txt

   # Count missing
   wc -l missing-device-docs.txt
   ```

4. **Create placeholder pages for critical missing docs:**
   ```bash
   # Create script to generate placeholder pages
   cat > create-placeholders.sh <<'EOF'
   #!/bin/bash

   # Read missing docs and create placeholders
   while IFS= read -r line; do
     # Extract file path
     file_path=$(echo "$line" | grep -oP 'expected: \K[^)]+')

     if [ ! -f "$file_path" ]; then
       # Create directory if needed
       mkdir -p "$(dirname "$file_path")"

       # Extract device name and page type
       device=$(echo "$file_path" | grep -oP 'devices/\K[^/]+')
       page=$(basename "$file_path" .md)

       # Create placeholder content
       cat > "$file_path" <<PLACEHOLDER
   ---
   id: $page
   title: $(echo $device | tr '[:lower:]' '[:upper:]') - $(echo $page | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
   sidebar_label: $(echo $page | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
   ---

   # $(echo $device | tr '[:lower:]' '[:upper:]') - $(echo $page | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

   :::info Coming Soon
   Documentation for this device is currently being developed.
   :::

   ## Overview

   This page will contain detailed information about $(echo $device | tr '[:lower:]' '[:upper:]') $page.

   ## Available Resources

   For immediate assistance, please:
   - Contact NXGEN support
   - Check general device integration guides
   - Review manufacturer documentation

   ---

   *Last updated: $(date +%Y-%m-%d)*
   PLACEHOLDER

       echo "✅ Created placeholder: $file_path"
     fi
   done < missing-device-docs.txt
   EOF

   chmod +x create-placeholders.sh
   # DON'T RUN YET - get approval first
   ```

5. **Run link checker tool (optional):**
   ```bash
   # Install markdown-link-check
   npm install -g markdown-link-check

   # Check all docs
   find docs -name "*.md" -exec markdown-link-check {} \; > link-check-report.txt

   # Summarize broken links
   grep "✖" link-check-report.txt | wc -l
   ```

6. **Create report for business team:**
   ```bash
   cat > DEVICE_DOCUMENTATION_STATUS.md <<'EOF'
   # Device Documentation Status Report

   **Generated:** $(date)
   **Total Devices:** 48

   ## Summary

   - ✅ Complete Documentation: X devices
   - ⚠️ Partial Documentation: Y devices
   - ❌ Missing Documentation: Z devices

   ## Complete Documentation

   [List devices with all pages: overview, installer-configuration, admin-configuration, troubleshooting]

   ## Partial Documentation

   [List devices with some pages missing]

   ## Missing Documentation

   [List devices with no pages or minimal pages]

   ## Recommendations

   1. Create placeholder pages for all missing docs (prevents 404 errors)
   2. Prioritize top 10 most-used devices for complete documentation
   3. Set up documentation queue for technical writing team

   ## Action Items

   - [ ] Create placeholders for all missing device docs
   - [ ] Identify top 10 priority devices (by usage analytics)
   - [ ] Create device documentation templates
   - [ ] Assign documentation tasks to technical writers

   EOF
   ```

**Deliverables:**
- [ ] All device links extracted and checked
- [ ] Report generated showing existing vs missing docs
- [ ] List of missing documentation created
- [ ] Placeholder creation script prepared (not run yet)
- [ ] Link checker report generated
- [ ] Device documentation status report for business team
- [ ] Recommendations documented

**Report Back Format:**
```
TASK AQ-3 STATUS: ✅ COMPLETE

Device Link Analysis:

Total Device Links: 52
✅ Existing Documentation: 34 (65%)
❌ Missing Documentation: 18 (35%)

Missing Documentation Breakdown:
- overview.md: 8 missing
- installer-configuration.md: 4 missing
- admin-configuration.md: 12 missing
- troubleshooting.md: 6 missing

Critical Missing Devices (high priority):
1. /docs/devices/adpro/overview.md
2. /docs/devices/spykebox/overview.md
3. /docs/devices/miwi/overview.md
[... more]

Link Checker Results:
- Total links checked: 523
- ✅ Valid links: 498 (95%)
- ❌ Broken links: 25 (5%)

Deliverables Created:
✅ device-links.txt - All extracted links
✅ device-links-report.txt - Detailed check results
✅ missing-device-docs.txt - List of missing files
✅ create-placeholders.sh - Script to create placeholders
✅ link-check-report.txt - Full link validation report
✅ DEVICE_DOCUMENTATION_STATUS.md - Status report for business team

Recommendations:
1. Run placeholder creation script (18 files)
2. Prioritize top 10 devices for full documentation
3. Set up documentation workflow for technical writers

Issues/Blockers:
⚠️ Placeholder script ready but NOT executed (awaiting approval)
```

---

## 📊 PROGRESS TRACKING

### Overall Progress
- [ ] Claude Code Tasks: 0/3 complete (0%)
- [ ] Cursor Tasks: 0/4 complete (0%)
- [ ] Amazon Q Tasks: 0/3 complete (0%)

**Total Progress: 0/10 tasks (0%)**

---

## 🚦 DEPENDENCIES & COORDINATION

### Critical Path (Must be done in order):

1. **CC-1** (Security credential rotation) → **AQ-2** (Netlify deployment)
   - AQ-2 CANNOT start until CC-1 is complete
   - AQ-2 needs new credentials from CC-1

2. **CU-1** (TypeScript fixes) → All Cursor tasks
   - Fix TypeScript config first, then other code fixes
   - Reduces cascading errors

3. **CC-3** (Clean up & commits) → Should be LAST
   - All other tasks should be complete first
   - Final cleanup and commit organization

### Parallel Work (Can be done simultaneously):

**Group 1: Security (P1)**
- CC-1: Security credential rotation (Claude Code)
- CC-2: Purge .env.local from git (Claude Code)

**Group 2: Code Quality (P2)**
- CU-1: TypeScript fixes (Cursor)
- CU-2: XSS protection (Cursor)
- CU-3: Storyblok component improvements (Cursor)
- CU-4: Fix broken components (Cursor)
- AQ-1: Dependency updates (Amazon Q)

**Group 3: Verification (P2-P3)**
- AQ-2: Netlify deployment (Amazon Q) - DEPENDS ON CC-1
- AQ-3: Device link verification (Amazon Q)

**Group 4: Final Cleanup (P2)**
- CC-3: Clean up and commits (Claude Code) - SHOULD BE LAST

---

## 🔄 STATUS UPDATE PROTOCOL

### When Starting a Task:
```markdown
## [Agent Name] - Starting TASK XX-X
**Status:** 🟡 IN PROGRESS
**Started:** [Timestamp]
**Expected Completion:** [Estimate]
```

### When Completing a Task:
```markdown
## [Agent Name] - Completed TASK XX-X
**Status:** ✅ COMPLETE
**Completed:** [Timestamp]
**Time Taken:** [Actual]

[Use "Report Back Format" template from task instructions]
```

### When Blocked:
```markdown
## [Agent Name] - BLOCKED on TASK XX-X
**Status:** ⚠️ BLOCKED
**Blocker:** [Description]
**Waiting For:** [What's needed to unblock]
**Impact:** [What this delays]
```

---

## 🎯 SUCCESS CRITERIA

All tasks complete when:

✅ **Security (P1)**
- [ ] All hardcoded credentials removed from codebase
- [ ] All credentials rotated (new values generated)
- [ ] .env.local purged from git history
- [ ] Netlify environment variables updated with new credentials
- [ ] No secrets exposed in build logs or source code

✅ **Code Quality (P2)**
- [ ] TypeScript compilation: 0 errors
- [ ] XSS protection: DOMPurify sanitization added
- [ ] All Storyblok components properly implemented
- [ ] Broken components fixed or removed
- [ ] Dependencies updated (security-critical)

✅ **Deployment (P2)**
- [ ] Netlify build succeeds with new credentials
- [ ] Production site working correctly
- [ ] All tests passed (build, typecheck, manual testing)

✅ **Documentation (P3)**
- [ ] Device documentation status report created
- [ ] Broken links identified
- [ ] Placeholder creation plan ready

✅ **Git Hygiene (P2)**
- [ ] All test files removed
- [ ] Changes committed in logical groups
- [ ] Git history clean (no .env.local)
- [ ] All changes pushed to remote

---

## 📋 HANDOVER CHECKLIST

Before declaring "Ready for Business Handover":

### Technical Checklist
- [ ] All P1 (CRITICAL) tasks complete
- [ ] All P2 (HIGH) tasks complete
- [ ] Build succeeds on Netlify
- [ ] Production site tested and working
- [ ] No exposed credentials in codebase or git history
- [ ] TypeScript compilation passes
- [ ] No critical errors in console

### Documentation Checklist
- [ ] NETLIFY_SETUP.md created
- [ ] DEVICE_DOCUMENTATION_STATUS.md created
- [ ] All task completion reports in this file
- [ ] Upgrade plan documented (React 19, Algolia v5)

### Verification Checklist
- [ ] Site loads: https://gcxone.netlify.app
- [ ] Documentation pages render correctly
- [ ] Search works (Algolia)
- [ ] Storyblok integration works
- [ ] Feedback widget works (SMTP)
- [ ] Dark mode toggle works
- [ ] Language switching works

---

## 🆘 ESCALATION

If any agent encounters:
- Blocker that can't be resolved in 30 minutes
- Security concern during implementation
- Breaking changes from dependency updates
- Git history issues during purge

**STOP and report immediately to user for guidance.**

---

**Last Updated:** 2025-12-28
**Status:** 🔴 NOT STARTED
**Target Completion:** Within 11 hours (parallelized)
