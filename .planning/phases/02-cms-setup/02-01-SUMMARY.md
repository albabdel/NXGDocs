---
phase: 02-cms-setup
plan: 01
subsystem: infra
tags: [sanity, sanity-studio, cms, mcp, typescript, react19]

# Dependency graph
requires: []
provides:
  - studio/ directory at repo root with Sanity v3/v5 scaffold
  - sanity.cli.ts with env-var projectId and studioHost nxgen-docs
  - sanity.config.ts with codeInput and table plugins registered
  - Sanity MCP server registered in Claude Code user scope (.claude.json)
  - studio/schemaTypes/index.ts empty barrel ready for Plan 02 schemas
affects:
  - 02-02 (schema authoring — depends on studio/ structure)
  - 02-03 (studio deployment — depends on sanity.cli.ts studioHost)

# Tech tracking
tech-stack:
  added:
    - sanity@^5.13.0 (Studio runtime + CLI + schema SDK)
    - "@sanity/code-input@^7.0.11 (code block Portable Text plugin)"
    - "@sanity/table@^2.0.1 (table Portable Text plugin)"
    - "@sanity/vision@^5.13.0 (GROQ explorer dev tool)"
    - react@^19.2.2 (required by sanity v5 and code-input v7)
    - react-dom@^19.2.2
    - styled-components@^6.1.15
    - Sanity remote MCP server (mcp.sanity.io, HTTP type, user scope)
  patterns:
    - Studio in studio/ subdirectory (not classic/) to separate Docusaurus and Sanity concerns
    - projectId read from SANITY_STUDIO_PROJECT_ID env var — never hardcoded
    - studioHost set in sanity.cli.ts so sanity deploy runs non-interactively
    - SANITY_STUDIO_* prefix for browser-accessible Studio vars (separate from Phase 3 SANITY_* vars)

key-files:
  created:
    - studio/sanity.cli.ts
    - studio/sanity.config.ts
    - studio/package.json
    - studio/tsconfig.json
    - studio/schemaTypes/index.ts
    - studio/.gitignore
  modified:
    - ~/.claude.json (mcpServers.Sanity entry added — outside repo)

key-decisions:
  - "Use sanity@v5 (not v3): latest CLI version downloads v5 which requires react@19 — upgraded all peer deps accordingly"
  - "Scaffold manually (not via sanity init): --create-project flag requires --organization for non-interactive mode; personal accounts cannot use it non-interactively. User must create Sanity project at manage.sanity.io and set SANITY_STUDIO_PROJECT_ID in studio/.env"
  - "MCP registered by editing .claude.json directly: claude CLI not in bash PATH; added mcpServers.Sanity HTTP entry pointing to mcp.sanity.io"
  - "package-lock.json not committed: root .gitignore has project-wide package-lock.json exclusion — consistent with existing project convention"

patterns-established:
  - "Pattern: env-var-only projectId — sanity.cli.ts and sanity.config.ts both use process.env.SANITY_STUDIO_PROJECT_ID to avoid hardcoding credentials"
  - "Pattern: studio subdirectory isolation — all Sanity files under studio/, never inside classic/"

requirements-completed: [CMS-01, CMS-02]

# Metrics
duration: 10min
completed: 2026-03-07
---

# Phase 2 Plan 01: CMS Setup — Studio Scaffold Summary

**Sanity Studio v5 scaffolded in studio/ with codeInput+table plugins, env-var projectId, studioHost nxgen-docs, and remote MCP server registered at mcp.sanity.io in Claude Code user config**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-07T04:56:57Z
- **Completed:** 2026-03-07T05:07:16Z
- **Tasks:** 2
- **Files modified:** 6 (repo) + 1 (~/.claude.json, outside repo)

## Accomplishments

- `studio/` directory created at repo root with full Sanity v5 scaffold: `sanity.cli.ts`, `sanity.config.ts`, `package.json`, `tsconfig.json`, `schemaTypes/index.ts`, `.gitignore`
- `@sanity/code-input` and `@sanity/table` installed and registered as plugins in `sanity.config.ts`
- Sanity MCP server registered in Claude Code user config (`~/.claude.json`) pointing to `https://mcp.sanity.io`
- `studio/.env` placeholder created (gitignored) with instructions for the user to set the real project ID
- All env var references use `SANITY_STUDIO_PROJECT_ID` prefix — browser-accessible in Studio bundle

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Sanity Studio in studio/ subdirectory** - `93b941e` (chore)

Task 2 (MCP registration) has no repo commit — it modified `~/.claude.json` outside the repository.

## Files Created/Modified

- `studio/sanity.cli.ts` — CLI config: projectId from env, dataset, studioHost: nxgen-docs
- `studio/sanity.config.ts` — Studio runtime: structureTool, visionTool, codeInput, table plugins, schemaTypes import
- `studio/package.json` — sanity@^5.13.0, @sanity/code-input@^7.0.11, @sanity/table@^2.0.1, react@^19.2.2
- `studio/tsconfig.json` — TypeScript config: ESNext target, Bundler module resolution
- `studio/schemaTypes/index.ts` — Empty barrel export; populated in Plan 02
- `studio/.gitignore` — Excludes node_modules, dist, .sanity, .env
- `~/.claude.json` — Added `mcpServers.Sanity` HTTP entry (outside repo, not committed)
- `studio/.env` — Placeholder with SANITY_STUDIO_PROJECT_ID=REPLACE_WITH_ACTUAL_PROJECT_ID (gitignored, not committed)

## Decisions Made

- **Sanity v5 instead of v3:** The latest `sanity` npm package is now v5 (v3 is years old). v5 requires React 19. All dependencies updated to match.
- **Manual scaffold instead of `sanity init`:** The `--create-project` flag in non-interactive mode requires `--organization <id>`, which personal accounts don't have. The alternative `sanity init` without `-y` would need TTY interaction. Solution: scaffold all files manually with correct content and instruct user to create project at manage.sanity.io.
- **Direct `.claude.json` edit for MCP:** The `claude` CLI is not in the bash shell's PATH in this environment. Directly edited the user-scoped Claude Code config file to add the `mcpServers.Sanity` entry.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Sanity v5 + React 19 peer deps instead of v3 + React 18**
- **Found during:** Task 1 (npm install)
- **Issue:** Plan specified Sanity v3 but `sanity@latest` is v5. v5 requires `react@^19.2.2`. Initial package.json had React 18 causing ERESOLVE peer conflict.
- **Fix:** Updated package.json to sanity@^5.13.0, react@^19.2.2, react-dom@^19.2.2, @sanity/code-input@^7.0.11, @sanity/vision@^5.13.0, styled-components@^6.1.15.
- **Files modified:** studio/package.json
- **Verification:** `npm install` completed with 0 vulnerabilities
- **Committed in:** 93b941e (Task 1 commit)

**2. [Rule 3 - Blocking] Manual scaffold instead of `sanity init` (not authenticated + org required)**
- **Found during:** Task 1 — `sanity init` attempted
- **Issue:** Two blockers: (a) user not authenticated (`sanity login` required, needs browser), (b) `--create-project --y` requires `--organization <id>` for personal accounts.
- **Fix:** Scaffolded all files manually with correct content matching plan spec. Created studio/.env with placeholder project ID and instructions.
- **Files modified:** studio/sanity.cli.ts, studio/sanity.config.ts, studio/package.json, studio/tsconfig.json, studio/schemaTypes/index.ts, studio/.gitignore, studio/.env
- **Verification:** All plan verification checks pass (env var reference, studioHost, plugin presence)
- **Committed in:** 93b941e (Task 1 commit)

**3. [Rule 3 - Blocking] Direct .claude.json edit for MCP (claude CLI not in PATH)**
- **Found during:** Task 2 — `claude mcp add` attempted
- **Issue:** `claude` CLI is not in bash shell PATH. Cannot run `claude mcp add Sanity -t http https://mcp.sanity.io --scope user`.
- **Fix:** Directly edited `~/.claude.json` to add `mcpServers.Sanity` with `type: "http"` and `url: "https://mcp.sanity.io"`. Equivalent to running the claude CLI command.
- **Files modified:** ~/.claude.json (outside repo)
- **Verification:** Python3 JSON parse confirmed entry present with correct type and URL
- **Committed in:** Not committed (outside repo)

---

**Total deviations:** 3 auto-fixed (1 bug/version mismatch, 2 blocking issues)
**Impact on plan:** All auto-fixes necessary for correctness and to overcome environment constraints. No scope creep. Functional outcome matches plan must_haves.

## Issues Encountered

- **Corrupted npx cache:** First `sanity init` attempt failed with `ERR_MODULE_NOT_FOUND` due to TAR_ENTRY_ERROR during package download on Windows. Resolved by clearing the npx cache entry and npm cache, then re-running.
- **`@sanity/code-input@^4.2.1` version doesn't exist:** Plan referenced a non-existent version. Corrected to latest `^7.0.11`.

## User Setup Required

Before Plan 02 can begin, the user must complete Sanity project creation and authentication:

### Step 1: Create Sanity Project
1. Go to https://manage.sanity.io
2. Click "Create new project"
3. Name it "NXGEN Docs"
4. Select "Production" dataset
5. Copy the project ID (format: 8 alphanumeric chars, e.g., `ab12cd34`)

### Step 2: Set Environment Variable
Edit `studio/.env` and replace the placeholder:
```
SANITY_STUDIO_PROJECT_ID=<your-actual-project-id>
SANITY_STUDIO_DATASET=production
```

### Step 3: Authenticate Sanity CLI
```bash
cd studio
npx sanity@latest login
```
Follow the browser OAuth flow.

### Step 4: Verify Studio starts locally
```bash
cd studio
npx sanity@latest dev
```
Expected: Studio opens at http://localhost:3333

### Step 5: Deploy empty schema manifest (for MCP context)
```bash
cd studio
npx sanity schema deploy
```

### Step 6: Re-authenticate MCP in Claude Code
On the next Claude Code session start, a browser OAuth prompt will appear for the Sanity MCP server. Complete it to grant Claude access to the Sanity project.

## Next Phase Readiness

- Studio scaffold is complete and committed — Plan 02 (schema authoring) can begin once user completes setup
- MCP server registered — will be available for schema-aware operations after OAuth
- Blockers: User must create Sanity project and set `SANITY_STUDIO_PROJECT_ID` in `studio/.env` before `sanity dev` or `sanity deploy` will work

---
*Phase: 02-cms-setup*
*Completed: 2026-03-07*
