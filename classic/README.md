# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Search & Discovery Features

### Core Search
- Typo-tolerant fuzzy search
- Synonym expansion
- "Did you mean" suggestions
- Search result pinning
- Faceted filters
- Autocomplete

### AI-Powered Search
- Semantic search with vector embeddings
- Hybrid search (keyword + vector)
- AI answer panel with citations
- Natural language Q&A

### Advanced Search Types
- Code snippet search with syntax highlighting
- Image search with thumbnails
- Video transcript search
- Error message search
- Version filtering

### Analytics
- Search analytics dashboard at `/admin/search-analytics`
- Top queries tracking
- Zero-result query tracking
- Click-through rate analysis

## Environment Variables

```bash
# Gemini AI (required for AI features)
VITE_GEMINI_API_KEY=your_api_key

# Supabase (optional, for remote analytics)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Admin (optional, for analytics access)
VITE_ADMIN_KEY=your_admin_key
```

## NPM Scripts

```bash
npm run search:index      # Generate search index
npm run search:embeddings # Generate embeddings
npm run search:full       # Generate both indexes
```
