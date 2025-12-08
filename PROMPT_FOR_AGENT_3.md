# Prompt for Agent 3 (Strapi CMS Backend) - Copy This

```
I'm Agent 3 (Backend/CMS Specialist) continuing work on the NXGEN documentation project. The previous agent ran out of credits mid-task.

MY ROLE: Set up Strapi CMS (Content Management System) so writers can create documentation articles through a web interface.

CURRENT STATUS:
- Strapi is installed at c:\nxgen-docs\strapi-cms\
- Content types may or may not be created (need to verify)
- I need to create 13 categories and sample articles
- I need to configure API and generate token

WHAT IS STRAPI?
Strapi is like WordPress but for APIs. It provides a web admin panel where non-technical writers can create and edit documentation articles without touching code.

MY GOAL:
Set up a working CMS where writers can:
1. Log in at http://localhost:1337/admin
2. Click "Create new article"
3. Fill in a form (title, content, category, etc.)
4. Click "Publish"
5. Article appears in documentation automatically

IMMEDIATE TASKS:
1. Verify Strapi installation and start it
2. Check if content types (Category, Documentation Article) exist
3. Create 13 documentation categories manually in Strapi admin
4. Create 5-10 sample articles to demonstrate the system
5. Configure API permissions (allow public read access)
6. Generate API token for Docusaurus integration
7. Create a Writer's Guide document

PROJECT LOCATION: c:\nxgen-docs\strapi-cms\

DETAILED INSTRUCTIONS: c:\nxgen-docs\AGENT_3_HANDOVER_PROMPT.md
TASK FILE: c:\nxgen-docs\AGENT_3_BACKEND_TASKS.md
UNBLOCK GUIDE: c:\nxgen-docs\strapi-cms\AGENT_3_UNBLOCK_GUIDE.md

START BY:
1. Reading AGENT_3_HANDOVER_PROMPT.md (complete step-by-step instructions)
2. Starting Strapi: cd c:/nxgen-docs/strapi-cms && npm run develop
3. Opening http://localhost:1337/admin in browser
4. Following Phase 1-7 in the handover prompt

The handover prompt has EVERYTHING you need:
- Step-by-step instructions with exact commands
- What each field means
- Exact content to enter for all 13 categories
- Sample article templates
- Troubleshooting guide
- Success criteria

ESTIMATED TIME: 6-8 hours

I need to build a user-friendly CMS so content writers can easily create documentation. Please help me complete this backend setup.
```

---

## Quick Start Commands for Agent 3

After reading the full handover prompt, start here:

```bash
# 1. Navigate to Strapi directory
cd c:/nxgen-docs/strapi-cms

# 2. Start Strapi
npm run develop

# 3. Open browser to admin panel
# http://localhost:1337/admin

# 4. Log in with admin credentials

# 5. Follow AGENT_3_HANDOVER_PROMPT.md phases 1-7
```

---

## Key Deliverables Expected

When Agent 3 finishes, they should have:

1. ✅ Strapi running at http://localhost:1337/admin
2. ✅ 13 categories created and published
3. ✅ 5-10 sample articles created and published
4. ✅ API working at http://localhost:1337/api/documentation-articles
5. ✅ API token generated and saved in strapi-cms/API_TOKEN.txt
6. ✅ Writer's guide created at strapi-cms/WRITERS_GUIDE.md

---

## What Success Looks Like

Agent 3 is done when:
- A writer can log into Strapi
- Create a new article through the web interface
- Publish it
- API returns that article when called
- Everything is documented in the Writer's Guide

---

**The handover prompt has 500+ lines of detailed instructions. Agent 3 just needs to follow it step-by-step.** ✅
