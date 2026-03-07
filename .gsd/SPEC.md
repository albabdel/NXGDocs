# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Migrate all static MDX documentation from `classic/docs/` into Sanity CMS to allow editors to manage content without code changes. The Docusaurus frontend remains exactly as it is, and all existing working URLs must continue to work seamlessly.

## Goals
1. Migrate all (~177) MDX/MD files from `classic/docs/` to appropriate Sanity content types (`doc`, `releaseNote`, `article`, `referencePage`).
2. Reconfigure Docusaurus routing so Sanity content serves at `/docs/...` instead of `/sanity-docs/...`.
3. Ensure zero new 404 errors by matching existing slugs exactly.

## Non-Goals (Out of Scope)
- No frontend redesigns or layout changes.
- Do not modify `.sanity-cache/` files manually (they are build-generated).
- Do not fix links that were already broken (leave `onBrokenLinks` set to `'warn'`).

## Users
- End-users consuming documentation at `https://gcxone.pages.dev/docs/...`
- Content editors updating documentation via Sanity Studio

## Constraints
- **Routing**: `slug.current` must match the URL path exactly without the leading `/docs/` (case-sensitive).
- **JSX Removal**: Any JSX components in MDX (e.g., lucide-react in `gcxone.mdx`) must be converted to pure Portable Text.
- **Images**: Upload local images to Sanity and reference them via Sanity's image blocks.
- **Frontmatter**: Strip YAML frontmatter when pasting into Sanity; map frontmatter fields (like `sidebar_position`) to corresponding Sanity fields.

## Success Criteria
- [ ] Every product documentation page previously at `/docs/...` resolves correctly.
- [ ] All release notes are in Sanity (`releaseNote` type).
- [ ] All articles are in Sanity (`article` type).
- [ ] All reference pages are in Sanity (`referencePage` type).
- [ ] A full URL sweep of the live site finds zero new 404s.
