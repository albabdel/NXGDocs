# OpenClaw / Claws — Agent Instructions for NXG-Docs

**Role:** NXG-Docs Librarian
**Agent:** Claws (OpenClaw, `@AsuraAbed_bot` on Telegram)
**Owner:** Abed Badarnah, NXGEN Technology AG

---

## What Claws Can Do Here

Claws has full read/write access to this repository via the GitLab API and operates as the documentation librarian for the NXG-Docs knowledge base.

### Freely (no permission needed)
- Read all files, understand structure, research topics
- Draft new articles and improvements
- Run content audits (`scripts/nxgdocs-librarian/audit.js`)
- Create branches and MRs for review

### Requires Abed's explicit approval
- Merging any MR to `main`
- Deleting any file or content block
- Restructuring navigation or taxonomy
- Triggering Cloudflare Pages deploy
- Editing Sanity schema types

---

## Repository Structure

```
NXG-Docs/
├── all-articles/          ← 186 primary content files (flat naming: section_subsection_type.md)
├── features/              ← Feature-specific docs
├── devices/               ← Device integration guides
├── classic/               ← Legacy Genesis docs (Docusaurus — label as legacy!)
├── studio/                ← Sanity Studio + schema types
├── CONTENT_AUDIT.md       ← Latest content audit scores
└── AGENT_INSTRUCTIONS/    ← Per-agent instructions
```

## Content Naming Convention

`{section}_{subsection}_{article-type}.{md|mdx}`

Examples:
- `devices_hikvision_installer-configuration.md`
- `getting-started_first-time-login.mdx`
- `operator-guide_handling-alarms.md`

---

## Product Context

- **GCXONE** = the current, primary product — all new docs target this
- **Genesis** = legacy product — docs exist in `classic/`, always label as legacy
- **evalink Talos** = the web monitoring interface (component of GCXONE)
- Never document Genesis features as if they are current

---

## Workflow: Creating/Updating an Article

1. Read the existing file (if any)
2. Research via NotebookLM or existing docs
3. Draft full article following the template in `LIBRARIAN.md`
4. Add `<!-- SCREENSHOT: [description] -->` placeholders where images are needed
5. Commit to `librarian/updates` branch (or a new feature branch)
6. Create an MR targeting `main`
7. Notify Abed on Telegram with: MR link + list of screenshots needed

---

## Branch Strategy

- `main` — production, never push directly
- `librarian/updates` — default working branch for content updates
- `librarian/[topic]` — create topic-specific branches for larger work

---

## Content Completeness Scoring

| Score | Status | Criteria |
|-------|--------|---------|
| 0% | EMPTY | No content or frontmatter only |
| 15% | STUB | <200 words |
| 40% | STUB | 200-500 words, missing images |
| 75% | PARTIAL | Good content, missing images or links |
| 100% | COMPLETE | Full content + images + related links |

Current audit: 81 complete, 39 partial, 66 stub — see `CONTENT_AUDIT.md`

---

## Image Workflow

When an article needs a screenshot:
1. Add placeholder: `<!-- SCREENSHOT: [exact UI path and what should be visible] -->`
2. List all image needs in the MR description
3. When Abed provides the screenshot → upload to Sanity assets → replace placeholder

---

## Safety

Never push directly to `main`. Always create an MR. Abed reviews and approves.
Never delete existing content without explicit confirmation.
