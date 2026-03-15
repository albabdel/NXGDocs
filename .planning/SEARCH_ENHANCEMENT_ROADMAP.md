# Search Enhancement Master Roadmap

**Project:** NXGEN Docs Search & Discovery Enhancement  
**Created:** March 15, 2026  
**Status:** ✅ COMPLETE - All Phases Delivered

### Progress
- ✅ Phase 1: Core Search Enhancements (Complete)
- ✅ Phase 2: AI-Powered Features (Complete)
- ✅ Phase 3: Analytics Dashboard (Complete)
- ✅ Phase 4: Advanced Search Types (Complete)
- ✅ Phase 5: Polish & Deploy (Complete)

---

## Executive Summary

This roadmap outlines a comprehensive enhancement of the NXGEN documentation search system, transforming it from a basic Fuse.js keyword search to an intelligent, AI-powered search and discovery platform.

### Current State
- **Search Engine:** Fuse.js v7.1.0 (client-side)
- **Index:** Static JSON generated at build time
- **Features:** Basic fuzzy search, recent searches, saved searches, faceted filters
- **Gap:** Code blocks stripped, no semantic search, no AI answers, limited analytics

### Target State
- **Search Engine:** Hybrid (Fuse.js + Vector search + AI)
- **Features:** 20 advanced search capabilities including semantic search, AI answer panel, code snippet search, analytics dashboard
- **Data Sources:** Sanity CMS + YouTube transcripts + Error database

---

## Phase Overview

| Phase | Focus | Duration | Priority |
|-------|-------|----------|----------|
| **Phase 1** | Core Search Enhancements | 5-7 days | HIGH |
| **Phase 2** | AI-Powered Features | 4-6 days | HIGH |
| **Phase 3** | Analytics Dashboard | 3-4 days | MEDIUM |
| **Phase 4** | Advanced Search Types | 4-5 days | MEDIUM |
| **Phase 5** | Polish & Deploy | 2-3 days | HIGH |

**Total Estimated Duration:** 18-25 days

---

## Phase 1: Core Search Enhancements

### Objective
Establish the foundation for advanced search by enhancing the index schema and adding core discovery features.

### Features Delivered

| Feature | Description | Effort |
|---------|-------------|--------|
| **Code Snippet Search** | Index and search within code blocks with language filtering | 2-3 days |
| **Image Search** | Search by alt text and captions | 1-2 days |
| **Query Autocomplete** | Real-time suggestions as user types | 1 day |
| **Typo Tolerance Enhancement** | Improved fuzzy matching with Levenshtein distance | 0.5 days |
| **Search Synonyms Management** | Admin-configurable synonym groups | 1 day |

### Technical Changes

#### 1.1 Enhanced Search Index Schema

```typescript
interface EnhancedSearchRecord {
  id: string;
  type: 'page' | 'code' | 'image' | 'video' | 'error';
  title: string;
  excerpt: string;
  content: string;
  url: string;
  section: string;
  category: string;
  tags: string[];
  
  // Code-specific
  code?: string;
  language?: string;
  filename?: string;
  lineNumber?: number;
  
  // Image-specific
  alt?: string;
  caption?: string;
  thumbnailUrl?: string;
  
  // Metadata
  productVersion?: string;
  lastUpdated?: string;
  popularityScore?: number;
}
```

#### 1.2 Index Generation Script

Create `scripts/generate-enhanced-search-index.ts`:

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

async function generateEnhancedIndex() {
  const records: EnhancedSearchRecord[] = [];
  
  // Extract from .sanity-cache/docs
  const docRecords = await extractDocRecords();
  records.push(...docRecords);
  
  // Extract code blocks
  const codeRecords = await extractCodeBlocks();
  records.push(...codeRecords);
  
  // Extract images
  const imageRecords = await extractImages();
  records.push(...imageRecords);
  
  // Write to static/search-index.json
  fs.writeFileSync('static/search-index.json', JSON.stringify(records));
}
```

#### 1.3 Synonym Management Schema

Create `studio/schemaTypes/searchSynonym.ts`:

```typescript
export const searchSynonymType = defineType({
  name: 'searchSynonym',
  title: 'Search Synonym',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      type: 'string',
      title: 'Primary Term',
    }),
    defineField({
      name: 'synonyms',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Synonyms',
    }),
    defineField({
      name: 'enabled',
      type: 'boolean',
      title: 'Enabled',
      initialValue: true,
    }),
  ],
});
```

### Files to Create

```
classic/
├── scripts/
│   ├── generate-enhanced-search-index.ts
│   ├── extract-code-blocks.ts
│   └── extract-images.ts
├── src/
│   ├── components/SearchModal/
│   │   ├── components/
│   │   │   ├── CodeResult.tsx
│   │   │   ├── ImageResult.tsx
│   │   │   ├── Autocomplete.tsx
│   │   │   └── LanguageFilter.tsx
│   │   ├── hooks/
│   │   │   └── useSynonyms.ts
│   │   └── types/
│   │       └── EnhancedSearchRecord.ts
│   └── data/
│       └── defaultSynonyms.json

studio/
└── schemaTypes/
    └── searchSynonym.ts
```

### Dependencies

```bash
npm install unified remark-parse remark-gfm unist-util-visit
```

### Verification

- [ ] Code blocks appear in search results with language badges
- [ ] Image results show thumbnails with alt text
- [ ] Autocomplete suggests queries after 2 characters
- [ ] Synonyms expand search (e.g., "login" finds "authentication")
- [ ] Build time remains under 60 seconds

---

## Phase 2: AI-Powered Features

### Objective
Integrate AI capabilities for semantic search and intelligent answer generation.

### Features Delivered

| Feature | Description | Effort |
|---------|-------------|--------|
| **Semantic Search** | Vector-based similarity search understanding intent | 2-3 days |
| **Hybrid Search** | Combine vector and keyword search for optimal results | 1 day |
| **AI Answer Panel** | Summarize best article directly in search results | 2-3 days |
| **Natural Language Q&A** | Answer questions in conversational format | 1-2 days |

### Technical Changes

#### 2.1 Vector Search Integration

Use existing `@google/generative-ai` dependency for embeddings:

```typescript
// src/lib/embeddings.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return Array.from(result.embedding.values);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

#### 2.2 Hybrid Search Hook

```typescript
// src/components/SearchModal/hooks/useHybridSearch.ts
export function useHybridSearch(query: string) {
  const [vectorResults, setVectorResults] = useState<SearchRecord[]>([]);
  const [keywordResults, setKeywordResults] = useState<FuseResult<SearchRecord>[]>([]);
  
  useEffect(() => {
    if (!query.trim()) return;
    
    // Parallel search
    Promise.all([
      searchByVector(query),
      searchByKeyword(query),
    ]).then(([vector, keyword]) => {
      setVectorResults(vector);
      setKeywordResults(keyword);
    });
  }, [query]);
  
  // Combine and re-rank
  const hybridResults = useMemo(() => {
    return mergeAndRank(vectorResults, keywordResults, {
      vectorWeight: 0.6,
      keywordWeight: 0.4,
    });
  }, [vectorResults, keywordResults]);
  
  return hybridResults;
}
```

#### 2.3 AI Answer Panel Component

```typescript
// src/components/SearchModal/components/AIAnswerPanel.tsx
import { GoogleGenerativeAI } from '@google/generative-ai';

export function AIAnswerPanel({ query, topResult }: AIAnswerPanelProps) {
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<SearchRecord[]>([]);
  
  useEffect(() => {
    if (!query.trim() || !topResult) return;
    
    setIsLoading(true);
    generateAnswer(query, topResult)
      .then(({ answer, sources }) => {
        setAnswer(answer);
        setSources(sources);
      })
      .finally(() => setIsLoading(false));
  }, [query, topResult]);
  
  return (
    <div className="ai-answer-panel">
      <div className="ai-header">
        <Sparkles size={16} />
        <span>AI Answer</span>
      </div>
      
      {isLoading ? (
        <div className="ai-loading">
          <span className="spinner" />
          Generating answer...
        </div>
      ) : (
        <>
          <div className="ai-answer">{answer}</div>
          <div className="ai-sources">
            {sources.map(source => (
              <a key={source.id} href={source.url} className="source-link">
                {source.title}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

async function generateAnswer(query: string, context: SearchRecord) {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const prompt = `You are a helpful documentation assistant. Based on the following documentation content, answer the user's question concisely and accurately.

Context: ${context.content}

Question: ${query}

Instructions:
1. Provide a direct, helpful answer
2. Include relevant code examples if applicable
3. Cite the source document
4. Keep the answer under 200 words

Answer:`;
  
  const result = await model.generateContent(prompt);
  return {
    answer: result.response.text(),
    sources: [context],
  };
}
```

#### 2.4 Pre-computed Embeddings

Generate embeddings at build time:

```typescript
// scripts/generate-embeddings.ts
async function generateEmbeddingsIndex() {
  const records = JSON.parse(fs.readFileSync('static/search-index.json'));
  
  const embeddingsIndex = await Promise.all(
    records.map(async (record) => ({
      id: record.id,
      embedding: await generateEmbedding(record.content),
    }))
  );
  
  fs.writeFileSync('static/embeddings-index.json', JSON.stringify(embeddingsIndex));
}
```

### Environment Variables

```bash
# .env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Files to Create

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
│   │       ├── useHybridSearch.ts
│   │       └── useVectorSearch.ts
│   └── types/
│       └── embeddings.ts
└── static/
    └── embeddings-index.json (generated)
```

### Dependencies

```bash
# Already installed
@google/generative-ai
```

### Verification

- [ ] Semantic search finds relevant results even without exact keyword matches
- [ ] Hybrid search combines vector and keyword results
- [ ] AI Answer Panel displays summarized answers
- [ ] Answers cite source documents
- [ ] Embedding generation completes in under 5 minutes

---

## Phase 3: Analytics Dashboard

### Objective
Build a comprehensive analytics dashboard for search insights.

### Features Delivered

| Feature | Description | Effort |
|---------|-------------|--------|
| **Search Analytics Dashboard** | Visual metrics for search performance | 2-3 days |
| **Zero Result Query Tracking** | Identify content gaps | 0.5 days |
| **Top Queries Report** | Most searched terms | 0.5 days |
| **Click-Through Rate Tracking** | Measure search effectiveness | 0.5 days |
| **Zero Result Spike Alerts** | Notify on content gaps | 0.5 days |

### Technical Changes

#### 3.1 Supabase Schema

```sql
-- Run in Supabase SQL Editor
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  result_count INTEGER NOT NULL DEFAULT 0,
  user_id TEXT,
  session_id TEXT,
  filters JSONB,
  referrer TEXT
);

CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_event_id UUID REFERENCES search_events(id),
  result_id TEXT NOT NULL,
  result_title TEXT,
  result_url TEXT,
  position INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  time_to_click_ms INTEGER
);

CREATE MATERIALIZED VIEW daily_search_stats AS
SELECT 
  DATE(timestamp) as date,
  normalized_query as query,
  COUNT(*) as search_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(result_count) as avg_result_count,
  COUNT(*) FILTER (WHERE result_count = 0) as zero_result_count
FROM search_events
GROUP BY DATE(timestamp), normalized_query;
```

#### 3.2 Enhanced Analytics Hook

```typescript
// src/hooks/useSearchAnalyticsEnhanced.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useSearchAnalyticsEnhanced() {
  const trackSearch = async (query: string, resultCount: number, filters?: Record<string, string>) => {
    await supabase.from('search_events').insert({
      query: query.trim(),
      normalized_query: query.trim().toLowerCase(),
      result_count: resultCount,
      user_id: getUserId(),
      session_id: getSessionId(),
      filters,
      referrer: window.location.pathname,
    });
  };
  
  const trackClick = async (result: SearchRecord, position: number, searchId: string) => {
    await supabase.from('click_events').insert({
      search_event_id: searchId,
      result_id: result.id,
      result_title: result.title,
      result_url: result.url,
      position,
      user_id: getUserId(),
      session_id: getSessionId(),
      time_to_click_ms: Date.now() - searchTimestamp,
    });
  };
  
  return { trackSearch, trackClick };
}
```

#### 3.3 Dashboard Component

```typescript
// src/pages/admin/search-analytics.tsx
import { LineChart, AreaChart, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SearchAnalyticsDashboard() {
  const { data, isLoading } = useAnalyticsData(dateRange);
  
  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard title="Total Searches" value={data.totalSearches} icon={<Search />} />
        <MetricCard title="Zero Result Rate" value={data.zeroResultRate} format="percent" />
        <MetricCard title="Click-Through Rate" value={data.clickThroughRate} format="percent" />
        <MetricCard title="Avg. Time to Click" value={data.avgTimeToClick} format="duration" />
      </div>
      
      <div className="charts-row">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.searchVolumeTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#E8B058" fill="#E8B058" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="tables-row">
        <TopQueriesTable queries={data.topQueries} />
        <ZeroResultsTable queries={data.zeroResultQueries} />
      </div>
    </div>
  );
}
```

### Dependencies

```bash
npm install recharts @supabase/supabase-js date-fns
```

### Files to Create

```
classic/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       └── search-analytics.tsx
│   ├── components/
│   │   └── SearchAnalytics/
│   │       ├── SearchAnalyticsDashboard.tsx
│   │       ├── MetricCard.tsx
│   │       ├── TopQueriesTable.tsx
│   │       └── ZeroResultsTable.tsx
│   └── hooks/
│       └── useSearchAnalyticsEnhanced.ts
└── .env
    VITE_SUPABASE_URL=https://xxx.supabase.co
    VITE_SUPABASE_ANON_KEY=xxx
```

### Verification

- [ ] Analytics data appears in Supabase
- [ ] Dashboard shows real-time metrics
- [ ] Zero-result queries are tracked
- [ ] Click-through rate is calculated
- [ ] Export functionality works

---

## Phase 4: Advanced Search Types

### Objective
Add specialized search capabilities for different content types.

### Features Delivered

| Feature | Description | Effort |
|---------|-------------|--------|
| **Video Transcript Search** | Search within YouTube video transcripts | 2-3 days |
| **Error Message Search** | Pattern-matched error code lookup | 1-2 days |
| **Search Result Pinning** | Admin-pinned results at top | 0.5 days |
| **"Did You Mean" Enhancements** | Improved typo correction | 0.5 days |
| **Search by Product Version** | Filter by version | 1 day |

### Technical Changes

#### 4.1 Video Tutorial Schema

```typescript
// studio/schemaTypes/videoTutorial.ts
export const videoTutorialType = defineType({
  name: 'videoTutorial',
  title: 'Video Tutorial',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'videoId', type: 'string', description: 'YouTube video ID' }),
    defineField({ name: 'category', type: 'string', options: {
      list: ['getting-started', 'features', 'advanced']
    }}),
    defineField({ name: 'transcript', type: 'text', rows: 10 }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }] }),
  ],
});
```

#### 4.2 Error Definition Schema

```typescript
// studio/schemaTypes/errorDefinition.ts
export const errorDefinitionType = defineType({
  name: 'errorDefinition',
  title: 'Error Definition',
  type: 'document',
  fields: [
    defineField({ name: 'code', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'pattern', type: 'string', description: 'Regex pattern' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'summary', type: 'text', rows: 2 }),
    defineField({ name: 'troubleshootingUrl', type: 'url' }),
    defineField({ name: 'severity', type: 'string', options: {
      list: ['info', 'warning', 'error', 'critical']
    }}),
    defineField({ name: 'commonCauses', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'relatedDocs', type: 'array', of: [{ type: 'reference', to: [{ type: 'doc' }] }] }),
  ],
});
```

#### 4.3 Error Pattern Detection

```typescript
// src/components/SearchModal/utils/errorPatterns.ts
const ERROR_PATTERNS = [
  { name: 'HTTP Status', pattern: /\b([45]\d{2})\b/, format: 'HTTP $1' },
  { name: 'Error Code', pattern: /\b(ERR|ERROR|E)[_-]?(\d{3,5}[A-Z]*)\b/i, format: '$1-$2' },
  { name: 'NXGEN Error', pattern: /\b(NX|NXGEN|GCX)[_-]?(\d{3,5})\b/i, format: '$1-$2' },
  { name: 'Connection Error', pattern: /\b(ECONNREFUSED|ETIMEDOUT|ENOTFOUND)\b/, format: '$1' },
];

export function detectErrorPatterns(query: string): string[] {
  const codes: string[] = [];
  for (const { pattern, format } of ERROR_PATTERNS) {
    const matches = query.matchAll(pattern);
    for (const match of matches) {
      codes.push(format.replace(/\$(\d+)/g, (_, i) => match[i] || '').toUpperCase());
    }
  }
  return [...new Set(codes)];
}
```

#### 4.4 Pinned Results Schema

```typescript
// studio/schemaTypes/pinnedSearchResult.ts
export const pinnedSearchResultType = defineType({
  name: 'pinnedSearchResult',
  title: 'Pinned Search Result',
  type: 'document',
  fields: [
    defineField({ name: 'query', type: 'string', description: 'Query to match' }),
    defineField({ name: 'result', type: 'reference', to: [{ type: 'doc' }] }),
    defineField({ name: 'position', type: 'number', initialValue: 1 }),
    defineField({ name: 'enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'expiresAt', type: 'datetime' }),
  ],
});
```

### Dependencies

```bash
npm install youtube-transcript
```

### Files to Create

```
classic/
├── scripts/
│   ├── extract-youtube-transcripts.ts
│   └── sync-error-definitions.ts
├── src/
│   ├── components/SearchModal/
│   │   ├── components/
│   │   │   ├── VideoResult.tsx
│   │   │   ├── ErrorResult.tsx
│   │   │   └── PinnedResult.tsx
│   │   └── utils/
│   │       └── errorPatterns.ts
│   └── hooks/
│       └── useVersionFilter.ts

studio/
└── schemaTypes/
    ├── videoTutorial.ts
    ├── errorDefinition.ts
    └── pinnedSearchResult.ts
```

### Verification

- [ ] Video transcripts are searchable
- [ ] Error codes show troubleshooting links
- [ ] Pinned results appear at top
- [ ] "Did you mean" suggestions are accurate
- [ ] Version filtering works

---

## Phase 5: Polish & Deployment

### Objective
Finalize, test, and deploy all features.

### Tasks

1. **Testing**
   - Unit tests for all new utilities
   - E2E tests for search flows
   - Performance benchmarks

2. **Documentation**
   - Update user documentation
   - Create admin guide
   - Document API endpoints

3. **Deployment**
   - Build and verify production bundle
   - Deploy to GitLab Pages
   - Configure environment variables

4. **Monitoring**
   - Set up error tracking
   - Configure analytics alerts
   - Create operational dashboard

### Files to Update

```
roadmap.md                              # Update with completion status
classic/README.md                       # Document new features
studio/README.md                        # Document new schemas
.planning/VERIFICATION.md               # Create verification report
```

---

## Success Criteria

### Feature Completion

| Feature | Status | Verification |
|---------|--------|--------------|
| Semantic search | ☐ | Vector search returns relevant results without keyword match |
| Hybrid search | ☐ | Combined results improve over keyword-only |
| Typo tolerance | ☐ | 2-character typos still find results |
| Query autocomplete | ☐ | Suggestions appear after 2 characters |
| Query suggestions | ☐ | Past searches influence suggestions |
| Result ranking | ☐ | Engagement signals improve ranking |
| "Did you mean" | ☐ | Typo corrections appear for zero-result queries |
| Synonyms | ☐ | Admin-configured synonyms expand search |
| Highlighted answers | ☐ | AI panel shows summarized answer |
| Analytics dashboard | ☐ | Metrics visible in admin panel |
| Zero-result tracking | ☐ | Zero-result queries logged and reportable |
| Result pinning | ☐ | Pinned results appear at configured position |
| Faceted filters | ☐ | Already implemented |
| Version search | ☐ | Filter by product version works |
| Image search | ☐ | Images appear in results with thumbnails |
| Code search | ☐ | Code blocks searchable with language filter |
| Video search | ☐ | Video transcripts searchable with timestamps |
| Error search | ☐ | Error codes link to troubleshooting |
| Natural language Q&A | ☐ | Conversational queries return answers |
| AI answer panel | ☐ | AI summarizes best article |

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Search response time | < 300ms | TBD |
| Index size | < 2MB | TBD |
| Build time increase | < 60s | TBD |
| Bundle size increase | < 50KB | TBD |

### Quality Metrics

| Metric | Target |
|--------|--------|
| Zero-result rate | < 5% |
| Click-through rate | > 60% |
| Average click position | < 3 |
| User satisfaction | > 4.5/5 |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| YouTube API rate limits | Medium | Low | Cache transcripts, batch sync |
| Embedding API costs | Medium | Medium | Pre-compute at build time |
| Gemini API latency | Low | Medium | Stream responses, show loading |
| Supabase free tier limits | Low | Medium | Monitor usage, set retention policy |
| Bundle size bloat | Medium | Medium | Tree-shake, code split, lazy load |

---

## Dependencies Summary

### npm packages

```json
{
  "dependencies": {
    "recharts": "^2.12.0",
    "@supabase/supabase-js": "^2.0.0",
    "youtube-transcript": "^1.0.6",
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "unified": "^11.0.0",
    "remark-parse": "^11.0.0",
    "remark-gfm": "^4.0.0",
    "remark-mdx": "^3.0.0"
  }
}
```

### External services

| Service | Purpose | Cost |
|---------|---------|------|
| Google Gemini API | AI answers, embeddings | Free tier: 60 requests/min |
| Supabase | Analytics storage | Free tier: 500MB |
| YouTube Data API | Video metadata | Free tier: 10K units/day |

### Environment variables

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

---

## Next Steps

1. **User confirmation** - Review and approve this roadmap
2. **Begin Phase 1** - Start with code snippet search and enhanced index
3. **Weekly progress reviews** - Check in on milestones
4. **Iterate based on feedback** - Adjust priorities as needed

---

*This roadmap synthesizes research from:*
- `.planning/research/vector-search-analysis.md`
- `.planning/research/ai-qa-integration.md`
- `.planning/research/analytics-dashboard.md`
- `.planning/research/advanced-search-features.md`
