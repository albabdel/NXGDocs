# Phase 2 Research: AI-Powered Search Features

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 2 - AI-Powered Features  
**Date:** March 15, 2026

---

## 1. Google Gemini API Analysis

### 1.1 Embedding API

**Model:** `text-embedding-004`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

const result = await model.embedContent(text);
const embedding = Array.from(result.embedding.values);
```

**Specifications:**
- Output dimensionality: 768 (default) or configurable
- Max input tokens: 2048
- Rate limit: 60 requests/min (free tier)
- Cost: Free tier available

### 1.2 Generative AI API

**Model:** `gemini-2.0-flash` (fast, efficient for search answers)

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent(prompt);
const answer = result.response.text();
```

**Streaming Response:**
```typescript
const result = await model.generateContentStream(prompt);
for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  // Append to UI
}
```

---

## 2. Embedding Generation Strategy

### 2.1 Build-Time Generation (Recommended)

**Pros:**
- Zero runtime API costs
- Instant search response
- No rate limit concerns

**Cons:**
- Requires rebuild for content updates
- Larger static file size

**Implementation:**
```typescript
// scripts/generate-embeddings.ts
const BATCH_SIZE = 10; // Process 10 records at a time
const DELAY_MS = 1000; // 1 second between batches

async function generateEmbeddingsBatch(records: SearchRecord[]) {
  const embeddings = [];
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await Promise.all(
      batch.map(r => generateEmbedding(r.content.slice(0, 2000)))
    );
    embeddings.push(...batchEmbeddings);
    
    if (i + BATCH_SIZE < records.length) {
      await sleep(DELAY_MS);
    }
  }
  
  return embeddings;
}
```

### 2.2 Embedding Index Format

```typescript
interface EmbeddingIndex {
  version: string;
  generated: string;
  model: string;
  records: EmbeddingRecord[];
}

interface EmbeddingRecord {
  id: string;
  embedding: number[];  // 768 dimensions
  contentHash: string;  // For cache validation
}
```

---

## 3. Vector Search Algorithm

### 3.1 Cosine Similarity

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### 3.2 Query Embedding Caching

```typescript
const queryEmbeddingCache = new Map<string, number[]>();

async function getQueryEmbedding(query: string): Promise<number[]> {
  const cacheKey = query.trim().toLowerCase();
  
  if (queryEmbeddingCache.has(cacheKey)) {
    return queryEmbeddingCache.get(cacheKey)!;
  }
  
  const embedding = await generateEmbedding(query);
  queryEmbeddingCache.set(cacheKey, embedding);
  
  // Limit cache size
  if (queryEmbeddingCache.size > 100) {
    const firstKey = queryEmbeddingCache.keys().next().value;
    queryEmbeddingCache.delete(firstKey);
  }
  
  return embedding;
}
```

---

## 4. Hybrid Search Algorithm

### 4.1 Score Fusion

```typescript
interface HybridSearchOptions {
  vectorWeight: number;   // Default: 0.6
  keywordWeight: number;  // Default: 0.4
  minVectorScore: number; // Default: 0.3
  minKeywordScore: number;// Default: 0.4
}

function mergeAndRank(
  vectorResults: VectorResult[],
  keywordResults: FuseResult<SearchRecord>[],
  options: HybridSearchOptions
): MergedResult[] {
  const scoreMap = new Map<string, MergedResult>();
  
  // Add vector results
  for (const v of vectorResults) {
    if (v.score < options.minVectorScore) continue;
    
    scoreMap.set(v.id, {
      record: v.record,
      vectorScore: v.score,
      keywordScore: 0,
      combinedScore: v.score * options.vectorWeight,
    });
  }
  
  // Add/merge keyword results
  for (const k of keywordResults) {
    const keywordScore = 1 - (k.score ?? 0); // Fuse uses distance
    if (keywordScore < options.minKeywordScore) continue;
    
    const existing = scoreMap.get(k.item.id);
    if (existing) {
      existing.keywordScore = keywordScore;
      existing.combinedScore = 
        existing.vectorScore * options.vectorWeight +
        keywordScore * options.keywordWeight;
    } else {
      scoreMap.set(k.item.id, {
        record: k.item,
        vectorScore: 0,
        keywordScore,
        combinedScore: keywordScore * options.keywordWeight,
      });
    }
  }
  
  // Sort by combined score
  return Array.from(scoreMap.values())
    .sort((a, b) => b.combinedScore - a.combinedScore);
}
```

### 4.2 Reciprocal Rank Fusion (Alternative)

```typescript
function reciprocalRankFusion(
  vectorResults: VectorResult[],
  keywordResults: FuseResult<SearchRecord>[],
  k: number = 60
): MergedResult[] {
  const scoreMap = new Map<string, MergedResult>();
  
  // Vector ranking
  vectorResults.forEach((v, i) => {
    const rrfScore = 1 / (k + i + 1);
    const existing = scoreMap.get(v.id) || { record: v.record, vectorScore: 0, keywordScore: 0, combinedScore: 0 };
    existing.vectorScore = rrfScore;
    existing.combinedScore += rrfScore;
    scoreMap.set(v.id, existing);
  });
  
  // Keyword ranking
  keywordResults.forEach((k, i) => {
    const rrfScore = 1 / (k + i + 1);
    const existing = scoreMap.get(k.item.id) || { record: k.item, vectorScore: 0, keywordScore: 0, combinedScore: 0 };
    existing.keywordScore = rrfScore;
    existing.combinedScore += rrfScore;
    scoreMap.set(k.item.id, existing);
  });
  
  return Array.from(scoreMap.values())
    .sort((a, b) => b.combinedScore - a.combinedScore);
}
```

---

## 5. AI Answer Panel Design

### 5.1 Prompt Engineering

```typescript
const ANSWER_PROMPT = `You are a helpful documentation assistant for NXGEN platform. Based on the following documentation content, answer the user's question concisely and accurately.

Context Documents:
{{CONTEXT}}

User Question: {{QUERY}}

Instructions:
1. Provide a direct, helpful answer in 2-4 sentences
2. Include a relevant code example if applicable
3. Always cite sources using [1], [2] notation
4. Keep the answer under 200 words
5. If the context doesn't contain relevant information, say so

Answer:`;
```

### 5.2 Context Assembly

```typescript
function assembleContext(results: SearchResult[]): string {
  return results
    .slice(0, 3) // Top 3 results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content.slice(0, 500)}`)
    .join('\n\n---\n\n');
}
```

### 5.3 Citation Linking

```typescript
function parseCitations(answer: string, sources: SearchResult[]): string {
  return answer.replace(/\[(\d+)\]/g, (match, num) => {
    const idx = parseInt(num) - 1;
    if (sources[idx]) {
      return `<a href="${sources[idx].url}" class="citation" target="_blank">[${num}]</a>`;
    }
    return match;
  });
}
```

---

## 6. Performance Considerations

### 6.1 Lazy Loading

```typescript
// Lazy load AI panel component
const AIAnswerPanel = React.lazy(() => import('./components/AIAnswerPanel'));

// Only load embeddings on first search
const embeddingsPromise = useMemo(() => 
  import('./lib/embeddings').then(m => m.loadEmbeddings()),
  []
);
```

### 6.2 Web Worker for Vector Search

```typescript
// src/workers/vectorSearch.worker.ts
self.onmessage = (e: MessageEvent) => {
  const { queryEmbedding, records } = e.data;
  
  const results = records.map(r => ({
    id: r.id,
    score: cosineSimilarity(queryEmbedding, r.embedding),
  })).sort((a, b) => b.score - a.score);
  
  self.postMessage(results);
};
```

---

## 7. Error Handling

### 7.1 API Error Recovery

```typescript
async function generateEmbeddingWithRetry(text: string, retries = 3): Promise<number[]> {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateEmbedding(text);
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(1000 * (i + 1));
    }
  }
  throw new Error('Failed to generate embedding');
}
```

### 7.2 Fallback Strategy

```typescript
// If AI is unavailable, show regular results only
if (!geminiApiKey) {
  return {
    aiAnswer: null,
    results: keywordResults,
    isAIAvailable: false,
  };
}
```

---

## 8. Cost Analysis

### 8.1 Build-Time Embeddings

| Item | Quantity | Cost |
|------|----------|------|
| Embedding API calls | ~200 records | Free (within limits) |
| Storage for embeddings | ~200KB | Free |

### 8.2 Runtime AI Answers

| Item | Rate | Cost |
|------|------|------|
| Gemini Flash | 60 req/min | Free tier |
| Tokens per answer | ~500 avg | Minimal |

---

## 9. Security Considerations

### 9.1 API Key Protection

```typescript
// Use VITE_ prefix for client-side access
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Validate key exists
if (!apiKey) {
  console.warn('Gemini API key not configured. AI features disabled.');
}
```

### 9.2 Input Sanitization

```typescript
function sanitizeQuery(query: string): string {
  return query
    .replace(/<[^>]*>/g, '') // Remove HTML
    .slice(0, 500); // Limit length
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

- Cosine similarity calculation
- Embedding cache behavior
- Hybrid search merging
- Prompt assembly

### 10.2 Integration Tests

- End-to-end search flow
- AI answer generation
- Error handling
- Performance benchmarks

### 10.3 Manual Tests

- Query: "how do I authenticate" → Should find auth docs
- Query: "connect to database" → Should find DB connection docs
- Query: "error 404" → Should find troubleshooting
