# Phase 2: AI-Powered Search Features

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 2 of 5  
**Duration:** 4-6 days  
**Status:** IN PROGRESS  
**Started:** March 15, 2026

---

## Objective

Integrate AI capabilities for semantic search and intelligent answer generation, transforming the search experience from keyword matching to intent understanding.

## Features Delivered

| Feature | Description | Effort | Status |
|---------|-------------|--------|--------|
| **Semantic Search** | Vector-based similarity search understanding intent | 2-3 days | PENDING |
| **Hybrid Search** | Combine vector and keyword search for optimal results | 1 day | PENDING |
| **AI Answer Panel** | Summarize best article directly in search results | 2-3 days | PENDING |
| **Natural Language Q&A** | Answer questions in conversational format | 1-2 days | PENDING |

---

## Technical Architecture

### 2.1 Vector Search Integration

Using existing `@google/generative-ai` dependency for embeddings:

```typescript
// src/lib/embeddings.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateEmbedding(text: string): Promise<number[]>
export function cosineSimilarity(a: number[], b: number[]): number
```

### 2.2 Pre-computed Embeddings at Build Time

Generate embeddings during build to avoid runtime API costs:

```typescript
// scripts/generate-embeddings.ts
- Load search-index.json
- Generate embeddings for each record's content
- Save to static/embeddings-index.json
```

### 2.3 Hybrid Search Algorithm

```typescript
// src/components/SearchModal/hooks/useHybridSearch.ts
- Parallel: vector search + keyword search
- Merge results with configurable weights
- Re-rank by combined score
```

### 2.4 AI Answer Panel

```typescript
// src/components/SearchModal/components/AIAnswerPanel.tsx
- Stream responses from Gemini API
- Show loading state with animation
- Cite source documents
- Copy answer functionality
```

---

## Implementation Tasks

### Task 2.1: Embeddings Infrastructure (Day 1-2)

- [ ] Create `src/lib/embeddings.ts` - Core embedding utilities
- [ ] Create `scripts/generate-embeddings.ts` - Build-time embedding generation
- [ ] Add `embeddings-index.json` to static files
- [ ] Update build process to include embedding generation

### Task 2.2: Vector Search Implementation (Day 2-3)

- [ ] Create `src/components/SearchModal/hooks/useVectorSearch.ts`
- [ ] Implement cosine similarity search
- [ ] Add embedding loading and caching
- [ ] Test semantic search with various queries

### Task 2.3: Hybrid Search Integration (Day 3)

- [ ] Create `src/components/SearchModal/hooks/useHybridSearch.ts`
- [ ] Implement result merging algorithm
- [ ] Add configurable weights (vector: 0.6, keyword: 0.4)
- [ ] Integrate with SearchModal

### Task 2.4: AI Answer Panel (Day 4-5)

- [ ] Create `AIAnswerPanel.tsx` component
- [ ] Create `AIAnswerPanel.module.css` styles
- [ ] Implement streaming response handling
- [ ] Add source citations
- [ ] Add copy-to-clipboard functionality
- [ ] Add "AI Answer" toggle in search modal

### Task 2.5: Natural Language Q&A (Day 5-6)

- [ ] Enhance AI panel for conversational queries
- [ ] Add follow-up question support
- [ ] Implement context preservation
- [ ] Add "Related questions" suggestions

---

## Files to Create

```
classic/
├── scripts/
│   └── generate-embeddings.ts
├── src/
│   ├── lib/
│   │   └── embeddings.ts
│   ├── components/SearchModal/
│   │   ├── components/
│   │   │   ├── AIAnswerPanel.tsx
│   │   │   └── AIAnswerPanel.module.css
│   │   └── hooks/
│   │       ├── useVectorSearch.ts
│   │       └── useHybridSearch.ts
│   └── types/
│       └── embeddings.ts
└── static/
    └── embeddings-index.json (generated)
```

## Files to Modify

```
classic/
├── src/components/SearchModal/
│   └── SearchModal.tsx - Integrate hybrid search and AI panel
├── docusaurus.config.ts - Add environment variables
└── package.json - Add build script for embeddings
```

---

## Environment Variables

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## Verification Criteria

- [ ] Semantic search finds relevant results without exact keyword matches
- [ ] Hybrid search combines vector and keyword results correctly
- [ ] AI Answer Panel displays summarized answers with citations
- [ ] Answers cite source documents with clickable links
- [ ] Embedding generation completes in under 5 minutes
- [ ] Search response time remains under 300ms
- [ ] Bundle size increase is under 50KB

---

## Dependencies

Already installed:
- `@google/generative-ai: ^0.24.1`

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Gemini API latency | Stream responses, show loading state |
| Embedding API costs | Pre-compute at build time |
| Bundle size bloat | Lazy load AI components |
| API rate limits | Cache embeddings, implement retry logic |
