# Advanced Search Features Implementation Guide

**Project:** NXGEN Docs (Docusaurus + Sanity CMS)
**Created:** March 2026
**Confidence:** HIGH (based on existing codebase analysis)

---

## Executive Summary

The current search implementation (Fuse.js + Algolia) **strips code blocks from search indexing**, limiting discoverability of technical content. This guide provides implementation approaches for:

1. **Code Snippet Search** - Index and search within code blocks with language filtering
2. **Image Search** - Search by alt text, captions, and metadata
3. **Video Transcript Search** - YouTube/Mux transcript indexing with timestamp navigation
4. **Error Message Search** - Pattern matching for error codes linking to troubleshooting docs
5. **Version-specific Search** - Filter results by product version

---

## Current State Analysis

### Existing Search Infrastructure

| Component | Technology | Status |
|-----------|------------|--------|
| Client-side search | Fuse.js v7.1.0 | Active |
| Server-side search | Algolia | Active |
| Index generation | `generate-search-index.js` | Strips code blocks |
| Algolia indexer | `index-documentation.js` | Strips code blocks |
| Search UI | `SearchModal.tsx` | Basic title/content search |

### Current Index Schema

```typescript
interface SearchRecord {
  id: string;
  title: string;
  excerpt: string;      // Plain text only
  content: string;      // Code blocks REMOVED
  url: string;
  section: string;
  category: string;
  tags: string[];
}
```

### What Gets Stripped

```javascript
// From generate-search-index.js line 29-30
.replace(/```[\s\S]*?```/g, ' ')  // Fenced code blocks - REMOVED
.replace(/`[^`\n]+`/g, ' ')       // Inline code - REMOVED
```

**Result:** Code content is completely unsearchable.

---

## 1. Code Snippet Search

### Overview

Enable searching within code blocks while preserving language metadata for filtering.

### Data Extraction Approach

#### Option A: MDX/Markdown Parsing (Recommended for static files)

Use unified/remark to parse MDX and extract code blocks with metadata:

```typescript
// scripts/extract-code-blocks.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';

interface CodeBlock {
  id: string;
  code: string;
  language: string | null;
  filename: string | null;
  meta: string | null;       // Additional metadata like line numbers
  sourceUrl: string;
  sourceTitle: string;
  lineNumber: number;
}

function extractCodeBlocks(mdxContent: string, sourceUrl: string, sourceTitle: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx)
    .parse(mdxContent);

  visit(tree, 'code', (node: any, index: number, parent: any) => {
    blocks.push({
      id: `${sourceUrl}#code-${index}`,
      code: node.value,
      language: node.lang || null,
      filename: node.meta?.match(/title="([^"]+)"/)?.[1] || null,
      meta: node.meta || null,
      sourceUrl,
      sourceTitle,
      lineNumber: node.position?.start?.line || 0,
    });
  });

  return blocks;
}
```

**Dependencies:**
```bash
npm install unified remark-parse remark-gfm remark-mdx unist-util-visit
```

#### Option B: Sanity Portable Text Extraction (For CMS content)

Extract code blocks from Sanity's portable text structure:

```typescript
// scripts/extract-code-from-sanity.ts
import { SanityClient } from '@sanity/client';

interface SanityCodeBlock {
  _type: 'code';
  code: string;
  language?: string;
  filename?: string;
  highlightedLines?: number[];
}

async function extractCodeBlocksFromSanity(client: SanityClient): Promise<CodeBlock[]> {
  const docs = await client.fetch(`
    *[_type == 'doc' && status == 'published'] {
      _id,
      title,
      slug,
      body
    }
  `);

  const blocks: CodeBlock[] = [];

  for (const doc of docs) {
    for (const block of doc.body || []) {
      if (block._type === 'code') {
        blocks.push({
          id: `${doc.slug.current}#code-${block._key}`,
          code: block.code,
          language: block.language || null,
          filename: block.filename || null,
          meta: null,
          sourceUrl: `/docs/${doc.slug.current}`,
          sourceTitle: doc.title,
          lineNumber: 0, // Portable text doesn't preserve line numbers
        });
      }
    }
  }

  return blocks;
}
```

### Extended Index Schema

```typescript
interface EnhancedSearchRecord {
  // Existing fields
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  section: string;
  category: string;
  tags: string[];
  
  // NEW: Content type discriminator
  type: 'page' | 'code' | 'image' | 'video' | 'error';
  
  // Code-specific (when type === 'code')
  code?: string;
  language?: string;
  filename?: string;
  lineNumber?: number;
  anchor?: string;          // For deep linking to code block
}
```

### Search Index Modifications

```typescript
// scripts/generate-enhanced-search-index.ts

function generateCodeRecords(codeBlocks: CodeBlock[]): EnhancedSearchRecord[] {
  return codeBlocks.map(block => ({
    id: block.id,
    type: 'code' as const,
    title: block.filename 
      ? `${block.filename} (${block.language || 'code'})`
      : `Code snippet in ${block.sourceTitle}`,
    excerpt: block.code.slice(0, 150) + (block.code.length > 150 ? '...' : ''),
    content: block.code,
    code: block.code,
    language: block.language || undefined,
    filename: block.filename || undefined,
    lineNumber: block.lineNumber,
    url: block.sourceUrl + (block.lineNumber ? `#L${block.lineNumber}` : ''),
    section: block.sourceTitle,
    category: block.language || 'code',
    tags: [block.language].filter(Boolean) as string[],
    anchor: `code-${block.lineNumber}`,
  }));
}
```

### UI Component: Code Search Result

```tsx
// src/components/SearchModal/components/CodeResult.tsx
import { Code, Copy, FileCode } from 'lucide-react';

interface CodeResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

export function CodeResult({ result, query, isHighlighted, onSelect }: CodeResultProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-result ${isHighlighted ? 'active' : ''}`} onClick={onSelect}>
      <div className="code-result-header">
        <FileCode size={14} />
        <span className="language-badge">{result.language}</span>
        {result.filename && <span className="filename">{result.filename}</span>}
      </div>
      
      <div className="code-preview">
        <code>{highlightMatches(result.code || '', query)}</code>
      </div>
      
      <div className="code-result-footer">
        <span className="source">{result.section}</span>
        <button className="copy-btn" onClick={handleCopy}>
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
```

### Language Filter UI

```tsx
// src/components/SearchModal/components/LanguageFilter.tsx
const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'bash', label: 'Shell', icon: '💻' },
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'yaml', label: 'YAML', icon: '⚙️' },
  { value: 'sql', label: 'SQL', icon: '🗃️' },
];

export function LanguageFilter({ 
  activeLanguage, 
  counts, 
  onChange 
}: LanguageFilterProps) {
  return (
    <div className="language-filter">
      <button 
        className={!activeLanguage ? 'active' : ''} 
        onClick={() => onChange(null)}
      >
        All Code
      </button>
      {SUPPORTED_LANGUAGES.map(lang => (
        <button
          key={lang.value}
          className={activeLanguage === lang.value ? 'active' : ''}
          onClick={() => onChange(lang.value)}
        >
          {lang.icon} {lang.label}
          {counts[lang.value] && <span className="count">{counts[lang.value]}</span>}
        </button>
      ))}
    </div>
  );
}
```

### Code Snippet Search Implementation Checklist

- [ ] Install unified/remark dependencies
- [ ] Create `extract-code-blocks.ts` script
- [ ] Modify `generate-search-index.js` to include code blocks
- [ ] Add `type` field to Fuse.js index
- [ ] Create `CodeResult` component
- [ ] Add language filtering to SearchModal
- [ ] Add copy-to-clipboard in search results
- [ ] Test with existing MDX files

---

## 2. Image Search

### Overview

Enable searching images by alt text, captions, and Sanity metadata.

### Current Sanity Schema

Images already have rich metadata in Sanity (from `portableText-ultimate.ts` lines 216-286):

```typescript
{
  type: 'image',
  fields: [
    { name: 'alt', type: 'string', title: 'Alt text' },
    { name: 'caption', type: 'string', title: 'Caption' },
    { name: 'credit', type: 'string', title: 'Credit / Attribution' },
    // ... additional fields
  ],
}
```

### Data Extraction Approach

```typescript
// scripts/extract-images-from-sanity.ts
import { SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

interface ImageRecord {
  id: string;
  type: 'image';
  alt: string | null;
  caption: string | null;
  credit: string | null;
  imageUrl: string;           // Thumbnail URL
  fullImageUrl: string;       // Full resolution URL
  sourceUrl: string;
  sourceTitle: string;
  width?: number;
  height?: number;
}

async function extractImagesFromSanity(client: SanityClient): Promise<ImageRecord[]> {
  const docs = await client.fetch(`
    *[_type == 'doc' && status == 'published'] {
      _id,
      title,
      slug,
      body
    }
  `);

  const images: ImageRecord[] = [];
  const builder = imageUrlBuilder(client);

  for (const doc of docs) {
    for (const block of doc.body || []) {
      if (block._type === 'image' && block.asset?._ref) {
        images.push({
          id: `${doc.slug.current}#image-${block._key}`,
          type: 'image',
          alt: block.alt || null,
          caption: block.caption || null,
          credit: block.credit || null,
          imageUrl: builder.image(block).width(200).url(),
          fullImageUrl: builder.image(block).url(),
          sourceUrl: `/docs/${doc.slug.current}`,
          sourceTitle: doc.title,
        });
      }
    }
  }

  return images;
}
```

### Visual Search with CLIP (Advanced - MVP+1)

For visual similarity search, use CLIP embeddings:

```typescript
// scripts/generate-image-embeddings.ts
// Note: This adds significant complexity - start with alt text search first

import { CLIPTextModel, CLIPVisionModel } from '@xenova/clip';

async function generateImageEmbedding(imageUrl: string): Promise<number[]> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const embedding = await visionModel(blob);
  return Array.from(embedding.data);
}

// Cosine similarity for visual search
function cosineSimilarity(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0) / 
    (Math.sqrt(a.reduce((sum, val) => sum + val * val, 0)) * 
     Math.sqrt(b.reduce((sum, val) => sum + val * val, 0)));
}
```

### Search Index Record

```typescript
interface ImageSearchRecord extends EnhancedSearchRecord {
  type: 'image';
  alt?: string;
  caption?: string;
  credit?: string;
  thumbnailUrl?: string;
  fullImageUrl?: string;
}
```

### UI Component: Image Result

```tsx
// src/components/SearchModal/components/ImageResult.tsx
import { ExternalLink } from 'lucide-react';

export function ImageResult({ result, query, isHighlighted, onSelect }: ImageResultProps) {
  return (
    <div className={`image-result ${isHighlighted ? 'active' : ''}`} onClick={onSelect}>
      <div className="image-thumbnail">
        <img 
          src={result.thumbnailUrl} 
          alt={result.alt || 'Documentation image'} 
          loading="lazy"
        />
      </div>
      
      <div className="image-info">
        {result.alt && (
          <div className="image-alt">
            {highlightMatches(result.alt, query)}
          </div>
        )}
        {result.caption && (
          <div className="image-caption">
            {highlightMatches(result.caption, query)}
          </div>
        )}
        <div className="image-source">
          <span>{result.sourceTitle}</span>
          <ExternalLink size={12} />
        </div>
      </div>
    </div>
  );
}
```

### Image Search Implementation Checklist

- [ ] Create `extract-images-from-sanity.ts` script
- [ ] Add image records to search index
- [ ] Create `ImageResult` component
- [ ] Add thumbnail loading with lazy loading
- [ ] Consider CLIP embeddings for MVP+1

---

## 3. Video Transcript Search

### Overview

Index video transcripts with timestamps for direct navigation to relevant moments.

### Current Video Setup

From `video-tutorials.tsx`:
- Videos are YouTube embeds with hardcoded IDs
- No transcript data currently available
- Categories: Getting Started, Features, Advanced

### YouTube Transcript Extraction

```bash
npm install youtube-transcript
```

```typescript
// scripts/extract-youtube-transcripts.ts
import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptLine {
  text: string;
  offset: number;    // milliseconds from start
  duration: number;  // milliseconds
}

async function fetchTranscript(videoId: string): Promise<TranscriptLine[]> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'en',
    });
    return transcript.map(line => ({
      text: line.text,
      offset: line.offset,
      duration: line.duration,
    }));
  } catch (error) {
    console.error(`Failed to fetch transcript for ${videoId}:`, error);
    return [];
  }
}

// Current hardcoded videos
const VIDEOS = [
  { id: 'I7dccOLTOsk', title: 'First-Time Login Setup', category: 'Getting Started' },
  { id: 'ER-tnAvGXow', title: 'GCXONE Product Overview', category: 'Getting Started' },
  { id: 'p--04PIIO-M', title: 'Platform Walkthrough', category: 'Features' },
  { id: 'AxHOF8cV88Q', title: 'Dashboard Deep Dive', category: 'Features' },
  { id: 'H2WhN1p3x9E', title: 'Tower Management', category: 'Advanced' },
];
```

### YouTube Data API for Metadata

```typescript
// scripts/fetch-youtube-metadata.ts
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchVideoDetails(videoId: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.items?.length) return null;
  
  return {
    id: videoId,
    title: data.items[0].snippet.title,
    description: data.items[0].snippet.description,
    duration: data.items[0].contentDetails.duration, // ISO 8601 (PT5M32S)
    thumbnails: data.items[0].snippet.thumbnails,
  };
}
```

### Transcript Chunking for Search

Break transcripts into searchable chunks with timestamps:

```typescript
// scripts/chunk-transcript.ts
interface TranscriptChunk {
  id: string;
  videoId: string;
  videoTitle: string;
  text: string;
  startTime: number;      // seconds
  endTime: number;        // seconds
  thumbnailUrl: string;
  category: string;
}

function chunkTranscript(
  transcript: TranscriptLine[],
  videoId: string,
  videoTitle: string,
  thumbnailUrl: string,
  category: string,
  maxChunkDuration: number = 30 // seconds
): TranscriptChunk[] {
  const chunks: TranscriptChunk[] = [];
  let currentChunk: TranscriptLine[] = [];
  let currentStart = 0;
  
  for (const line of transcript) {
    currentChunk.push(line);
    
    const chunkDuration = (line.offset + line.duration - currentStart) / 1000;
    
    if (chunkDuration >= maxChunkDuration) {
      chunks.push({
        id: `${videoId}#t=${Math.floor(currentStart / 1000)}`,
        videoId,
        videoTitle,
        text: currentChunk.map(l => l.text).join(' '),
        startTime: currentStart / 1000,
        endTime: (line.offset + line.duration) / 1000,
        thumbnailUrl,
        category,
      });
      
      currentChunk = [];
      currentStart = line.offset + line.duration;
    }
  }
  
  // Handle remaining lines
  if (currentChunk.length > 0) {
    chunks.push({
      id: `${videoId}#t=${Math.floor(currentStart / 1000)}`,
      videoId,
      videoTitle,
      text: currentChunk.map(l => l.text).join(' '),
      startTime: currentStart / 1000,
      endTime: (currentChunk[currentChunk.length - 1].offset + 
                currentChunk[currentChunk.length - 1].duration) / 1000,
      thumbnailUrl,
      category,
    });
  }
  
  return chunks;
}
```

### UI Component: Video Result with Timestamp

```tsx
// src/components/SearchModal/components/VideoResult.tsx
import { Play, Clock, Youtube } from 'lucide-react';

export function VideoResult({ result, query, isHighlighted, onSelect }: VideoResultProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoUrl = `https://www.youtube.com/watch?v=${result.videoId}&t=${result.startTime}s`;

  return (
    <a 
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`video-result ${isHighlighted ? 'active' : ''}`}
    >
      <div className="video-thumbnail">
        <img src={result.thumbnailUrl} alt={result.videoTitle} loading="lazy" />
        <div className="play-overlay">
          <Play size={24} />
        </div>
        <div className="timestamp">
          <Clock size={12} />
          {formatTime(result.startTime)}
        </div>
      </div>
      
      <div className="video-info">
        <div className="video-title">{result.videoTitle}</div>
        <div className="video-excerpt">
          {highlightMatches(result.content?.slice(0, 150) || '', query)}
        </div>
        <div className="video-meta">
          <span className="category">{result.category}</span>
          <Youtube size={14} />
        </div>
      </div>
    </a>
  );
}
```

### Sanity Schema for Video Tutorials

Move from hardcoded to Sanity-managed:

```typescript
// studio/schemaTypes/videoTutorial.ts
import { defineType, defineField } from 'sanity';

export const videoTutorialType = defineType({
  name: 'videoTutorial',
  title: 'Video Tutorial',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'videoId',
      type: 'string',
      title: 'YouTube Video ID',
      description: 'The ID from youtube.com/watch?v=XXXXX',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Getting Started', value: 'getting-started' },
          { title: 'Features', value: 'features' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Description',
    }),
    defineField({
      name: 'duration',
      type: 'string',
      title: 'Duration',
      description: 'Auto-populated from YouTube API',
    }),
    defineField({
      name: 'transcript',
      type: 'text',
      title: 'Transcript',
      description: 'Auto-populated from YouTube API',
      rows: 10,
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Tags',
    }),
  ],
});
```

### Video Transcript Search Implementation Checklist

- [ ] Install youtube-transcript package
- [ ] Create `extract-youtube-transcripts.ts` script
- [ ] Create transcript chunking function
- [ ] Add video records to search index
- [ ] Create `VideoResult` component
- [ ] Add timestamp navigation
- [ ] Create Sanity schema for video tutorials
- [ ] Migrate hardcoded videos to Sanity
- [ ] Add YouTube API key to environment

---

## 4. Error Message Search

### Overview

Detect error patterns in search queries and link to troubleshooting documentation.

### Error Pattern Detection

```typescript
// src/components/SearchModal/utils/errorPatterns.ts

interface ErrorPattern {
  name: string;
  pattern: RegExp;
  format: string;
  example: string;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  // HTTP Status Codes
  {
    name: 'HTTP Status',
    pattern: /\b([45]\d{2})\b/,
    format: 'HTTP $1',
    example: '404, 500, 403',
  },
  // HTTP Status with context
  {
    name: 'HTTP Error',
    pattern: /\b(HTTP|http)\s*(error|status|code)?\s*:?\s*([45]\d{2})\b/i,
    format: 'HTTP $3',
    example: 'HTTP 404, http error 500',
  },
  // Common error codes (alphanumeric)
  {
    name: 'Error Code',
    pattern: /\b(ERR|ERROR|E)[_-]?(\d{3,5}[A-Z]*)\b/i,
    format: '$1-$2',
    example: 'ERR001, ERROR-404, ECONNREFUSED',
  },
  // UUID-based error IDs
  {
    name: 'Error ID',
    pattern: /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i,
    format: '$1',
    example: '550e8400-e29b-41d4-a716-446655440000',
  },
  // Platform-specific: NXGEN error codes
  {
    name: 'NXGEN Error',
    pattern: /\b(NX|NXGEN|GCX)[_-]?(\d{3,5})\b/i,
    format: '$1-$2',
    example: 'NX-001, NXGEN-404, GCX-500',
  },
  // Exception types
  {
    name: 'Exception',
    pattern: /\b([A-Z][a-z]+Exception)\b/,
    format: '$1',
    example: 'NullPointerException, TimeoutException',
  },
  // Connection errors
  {
    name: 'Connection Error',
    pattern: /\b(ECONNREFUSED|ETIMEDOUT|ENOTFOUND|ECONNRESET)\b/,
    format: '$1',
    example: 'ECONNREFUSED, ETIMEDOUT',
  },
];

function detectErrorPatterns(query: string): ErrorPattern[] {
  const detected: ErrorPattern[] = [];
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.pattern.test(query)) {
      detected.push(pattern);
    }
  }
  return detected;
}

function extractErrorCodes(query: string): string[] {
  const codes: string[] = [];
  for (const pattern of ERROR_PATTERNS) {
    const matches = query.matchAll(pattern.pattern);
    for (const match of matches) {
      const formatted = pattern.format.replace(/\$(\d+)/g, (_, i) => match[i] || '');
      codes.push(formatted.toUpperCase());
    }
  }
  return [...new Set(codes)];
}
```

### Error Troubleshooting Database

```typescript
// src/data/error-database.ts
interface ErrorDefinition {
  code: string;
  pattern: string;
  title: string;
  summary: string;
  troubleshootingUrl: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  commonCauses: string[];
  relatedDocs: string[];
}

const ERROR_DATABASE: ErrorDefinition[] = [
  {
    code: '404',
    pattern: '^404$',
    title: 'Not Found',
    summary: 'The requested resource could not be found.',
    troubleshootingUrl: '/docs/troubleshooting/404-errors',
    severity: 'warning',
    category: 'HTTP',
    commonCauses: [
      'Incorrect URL',
      'Resource was deleted',
      'Invalid slug or ID',
    ],
    relatedDocs: [
      '/docs/api/endpoints',
      '/docs/troubleshooting/common-errors',
    ],
  },
  {
    code: 'ECONNREFUSED',
    pattern: '^ECONNREFUSED$',
    title: 'Connection Refused',
    summary: 'The connection was refused by the target server.',
    troubleshootingUrl: '/docs/troubleshooting/connection-errors',
    severity: 'error',
    category: 'Network',
    commonCauses: [
      'Server is down',
      'Firewall blocking connection',
      'Wrong port specified',
    ],
    relatedDocs: [
      '/docs/networking/firewall',
      '/docs/troubleshooting/connectivity',
    ],
  },
  // Add more error definitions...
];

function findErrorDefinition(code: string): ErrorDefinition | undefined {
  for (const error of ERROR_DATABASE) {
    if (new RegExp(error.pattern, 'i').test(code)) {
      return error;
    }
  }
  return undefined;
}
```

### Sanity Schema for Error Definitions

```typescript
// studio/schemaTypes/errorDefinition.ts
export const errorDefinitionType = defineType({
  name: 'errorDefinition',
  title: 'Error Definition',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      type: 'string',
      title: 'Error Code',
      description: 'The error code or pattern (e.g., "404", "ECONNREFUSED")',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'pattern',
      type: 'string',
      title: 'Regex Pattern',
      description: 'Regular expression to match variations',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Display Title',
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      title: 'Summary',
    }),
    defineField({
      name: 'troubleshootingUrl',
      type: 'url',
      title: 'Troubleshooting Doc URL',
    }),
    defineField({
      name: 'severity',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Error', value: 'error' },
          { title: 'Critical', value: 'critical' },
        ],
      },
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
    }),
    defineField({
      name: 'commonCauses',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Common Causes',
    }),
    defineField({
      name: 'relatedDocs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'doc' }] }],
      title: 'Related Documentation',
    }),
  ],
});
```

### UI Component: Error Result

```tsx
// src/components/SearchModal/components/ErrorResult.tsx
import { AlertTriangle, AlertCircle, Info, XCircle, ArrowRight } from 'lucide-react';

const SEVERITY_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  critical: XCircle,
};

const SEVERITY_COLORS = {
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  error: 'text-orange-400',
  critical: 'text-red-400',
};

export function ErrorResult({ error, isHighlighted, onSelect }: ErrorResultProps) {
  const Icon = SEVERITY_ICONS[error.severity];
  
  return (
    <div 
      className={`error-result ${isHighlighted ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className={`error-icon ${SEVERITY_COLORS[error.severity]}`}>
        <Icon size={20} />
      </div>
      
      <div className="error-info">
        <div className="error-code">{error.code}</div>
        <div className="error-title">{error.title}</div>
        <div className="error-summary">{error.summary}</div>
        
        {error.commonCauses.length > 0 && (
          <div className="error-causes">
            <span className="label">Common causes:</span>
            <ul>
              {error.commonCauses.slice(0, 3).map((cause, i) => (
                <li key={i}>{cause}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <a href={error.troubleshootingUrl} className="troubleshoot-link">
        Troubleshoot
        <ArrowRight size={14} />
      </a>
    </div>
  );
}
```

### Search Modal Integration

```tsx
// In SearchModal.tsx, add error detection
const errorResults = useMemo(() => {
  if (!query.trim()) return [];
  
  const errorCodes = extractErrorCodes(query);
  if (errorCodes.length === 0) return [];
  
  return errorCodes
    .map(code => findErrorDefinition(code))
    .filter(Boolean) as ErrorDefinition[];
}, [query]);

// Render error results first (before regular results)
{errorResults.length > 0 && (
  <div className="error-results-section">
    <div className="section-header">
      <AlertTriangle size={14} />
      <span>Error Solutions</span>
    </div>
    {errorResults.map((error, i) => (
      <ErrorResult 
        key={error.code}
        error={error}
        isHighlighted={selectedIndex === i}
        onSelect={() => navigateToError(error)}
      />
    ))}
  </div>
)}
```

### Error Message Search Implementation Checklist

- [ ] Create `errorPatterns.ts` utility
- [ ] Create `error-database.ts` with initial error definitions
- [ ] Create `errorDefinition` Sanity schema
- [ ] Create `ErrorResult` component
- [ ] Add error detection to SearchModal
- [ ] Populate error database with common platform errors
- [ ] Add error definitions via Sanity CMS

---

## 5. Version-specific Search

### Overview

Filter search results by product version, useful for documentation that spans multiple versions.

### Sanity Schema Modifications

Add version field to doc schema:

```typescript
// studio/schemaTypes/doc.ts - Add version field

defineField({
  name: 'productVersion',
  title: 'Product Version',
  type: 'string',
  description: 'The product version this documentation applies to',
  options: {
    list: [
      { title: 'All Versions', value: 'all' },
      { title: 'v3.0 (Latest)', value: 'v3.0' },
      { title: 'v2.5', value: 'v2.5' },
      { title: 'v2.0', value: 'v2.0' },
      { title: 'v1.x (Legacy)', value: 'v1.x' },
    ],
  },
  initialValue: 'all',
}),
```

### Extended Index Schema

```typescript
interface VersionedSearchRecord extends EnhancedSearchRecord {
  productVersion?: string;
  versionDeprecated?: boolean;
  versionReleased?: string;  // ISO date
}
```

### Version Filtering in Search

```typescript
// src/components/SearchModal/hooks/useVersionFilter.ts
import { useState, useMemo } from 'react';

interface VersionInfo {
  value: string;
  label: string;
  isLatest: boolean;
  isDeprecated: boolean;
}

const VERSIONS: VersionInfo[] = [
  { value: 'all', label: 'All Versions', isLatest: false, isDeprecated: false },
  { value: 'v3.0', label: 'v3.0 (Latest)', isLatest: true, isDeprecated: false },
  { value: 'v2.5', label: 'v2.5', isLatest: false, isDeprecated: false },
  { value: 'v2.0', label: 'v2.0', isLatest: false, isDeprecated: false },
  { value: 'v1.x', label: 'v1.x (Legacy)', isLatest: false, isDeprecated: true },
];

export function useVersionFilter(results: EnhancedSearchRecord[], activeVersion: string) {
  return useMemo(() => {
    if (activeVersion === 'all') return results;
    
    return results.filter(result => {
      const record = result as VersionedSearchRecord;
      // Include if version matches or if no version specified (assumed 'all')
      return !record.productVersion || 
             record.productVersion === 'all' || 
             record.productVersion === activeVersion;
    });
  }, [results, activeVersion]);
}
```

### Version Selector UI Component

```tsx
// src/components/SearchModal/components/VersionSelector.tsx
import { Check, ChevronDown } from 'lucide-react';

export function VersionSelector({ 
  activeVersion, 
  counts, 
  onChange 
}: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="version-selector">
      <button 
        className="version-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{VERSIONS.find(v => v.value === activeVersion)?.label}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="version-dropdown">
          {VERSIONS.map(version => (
            <button
              key={version.value}
              className={`version-option ${activeVersion === version.value ? 'active' : ''}`}
              onClick={() => {
                onChange(version.value);
                setIsOpen(false);
              }}
            >
              <span className="version-label">
                {version.label}
                {version.isLatest && <span className="badge latest">Latest</span>}
                {version.isDeprecated && <span className="badge deprecated">Legacy</span>}
              </span>
              <span className="version-count">{counts[version.value] || 0}</span>
              {activeVersion === version.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Version Badge in Search Results

```tsx
// Add version indicator to result items
{result.productVersion && result.productVersion !== 'all' && (
  <span className={`version-badge ${result.versionDeprecated ? 'deprecated' : ''}`}>
    {result.productVersion}
  </span>
)}
```

### Version-specific Search Implementation Checklist

- [ ] Add `productVersion` field to Sanity doc schema
- [ ] Migrate existing docs with version information
- [ ] Update search index generation to include version
- [ ] Create `VersionSelector` component
- [ ] Create `useVersionFilter` hook
- [ ] Add version filtering to SearchModal
- [ ] Add version badges to search results
- [ ] Store version preference in localStorage

---

## 6. Integration Summary

### Complete Enhanced Search Index Schema

```typescript
// Full schema for all search record types
interface EnhancedSearchRecord {
  // Common fields (required)
  id: string;
  type: 'page' | 'code' | 'image' | 'video' | 'error';
  title: string;
  excerpt: string;
  content: string;
  url: string;
  section: string;
  category: string;
  tags: string[];
  
  // Version-specific
  productVersion?: string;
  versionDeprecated?: boolean;
  
  // Code-specific (type === 'code')
  code?: string;
  language?: string;
  filename?: string;
  lineNumber?: number;
  anchor?: string;
  
  // Image-specific (type === 'image')
  alt?: string;
  caption?: string;
  credit?: string;
  thumbnailUrl?: string;
  fullImageUrl?: string;
  
  // Video-specific (type === 'video')
  videoId?: string;
  startTime?: number;
  endTime?: number;
  thumbnailUrl?: string;
  videoTitle?: string;
}
```

### Updated Fuse.js Configuration

```typescript
// src/components/SearchModal/SearchModal.tsx
const FUSE_OPTIONS: IFuseOptions<EnhancedSearchRecord> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.25 },
    { name: 'code', weight: 0.2 },      // NEW: Code search
    { name: 'alt', weight: 0.15 },       // NEW: Image alt text
    { name: 'caption', weight: 0.1 },    // NEW: Image/video captions
    { name: 'category', weight: 0.1 },
    { name: 'tags', weight: 0.05 },
    { name: 'language', weight: 0.05 },  // NEW: Language filter
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  // Optional: Use extended search for exact matches
  useExtendedSearch: true,
};
```

### Updated Search Modal Architecture

```
SearchModal.tsx
├── hooks/
│   ├── useDebounce.ts          (existing)
│   ├── useRecentSearches.ts    (existing)
│   ├── useSavedSearches.ts     (existing)
│   ├── useSearchAnalytics.ts   (existing)
│   ├── useVersionFilter.ts     (NEW)
│   └── useTypeFilter.ts        (NEW)
├── components/
│   ├── FacetedFilters.tsx      (existing)
│   ├── KeyboardShortcuts.tsx   (existing)
│   ├── LanguageFilter.tsx      (NEW)
│   ├── VersionSelector.tsx     (NEW)
│   ├── TypeFilter.tsx          (NEW)
│   ├── CodeResult.tsx          (NEW)
│   ├── ImageResult.tsx         (NEW)
│   ├── VideoResult.tsx         (NEW)
│   └── ErrorResult.tsx         (NEW)
├── utils/
│   ├── highlightMatches.ts     (existing)
│   ├── synonymMap.ts           (existing)
│   ├── didYouMean.ts           (existing)
│   └── errorPatterns.ts        (NEW)
└── types/
    └── EnhancedSearchRecord.ts (NEW)
```

---

## 7. Implementation Phases

### Phase 1: Code Snippet Search (High Priority)
**Estimated effort:** 2-3 days

1. Install dependencies: `unified`, `remark-parse`, `remark-gfm`, `unist-util-visit`
2. Create `scripts/extract-code-blocks.ts`
3. Modify `generate-search-index.js` to include code blocks
4. Add `type` field to search records
5. Create `CodeResult` component with syntax highlighting
6. Add language filter to SearchModal
7. Add copy-to-clipboard functionality

**Files to modify:**
- `classic/scripts/generate-search-index.js`
- `classic/src/components/SearchModal/SearchModal.tsx`
- `studio/schemaTypes/portableText-ultimate.ts` (already has code blocks)

### Phase 2: Image Search (Medium Priority)
**Estimated effort:** 1-2 days

1. Create `scripts/extract-images-from-sanity.ts`
2. Add image records to search index
3. Create `ImageResult` component with lazy-loaded thumbnails
4. Add image type filter

**Files to modify:**
- `classic/scripts/generate-search-index.js`
- `classic/src/components/SearchModal/SearchModal.tsx`

### Phase 3: Video Transcript Search (Medium Priority)
**Estimated effort:** 3-4 days

1. Install `youtube-transcript` package
2. Create `scripts/extract-youtube-transcripts.ts`
3. Create Sanity schema for `videoTutorial`
4. Migrate hardcoded videos to Sanity
5. Add transcript chunking with timestamps
6. Create `VideoResult` component with timestamp navigation
7. Set up periodic transcript sync (GitHub Action or Sanity webhook)

**Files to create:**
- `studio/schemaTypes/videoTutorial.ts`
- `classic/scripts/extract-youtube-transcripts.ts`
- `classic/src/components/SearchModal/components/VideoResult.tsx`

**Files to modify:**
- `classic/src/pages/video-tutorials.tsx` (fetch from Sanity)
- `classic/scripts/generate-search-index.js`

### Phase 4: Error Message Search (Low Priority)
**Estimated effort:** 1-2 days

1. Create `errorPatterns.ts` utility
2. Create `error-database.ts` with initial definitions
3. Create Sanity schema for `errorDefinition`
4. Create `ErrorResult` component
5. Add error detection to SearchModal

**Files to create:**
- `studio/schemaTypes/errorDefinition.ts`
- `classic/src/components/SearchModal/utils/errorPatterns.ts`
- `classic/src/data/error-database.ts`
- `classic/src/components/SearchModal/components/ErrorResult.tsx`

### Phase 5: Version-specific Search (Low Priority)
**Estimated effort:** 1 day

1. Add `productVersion` field to Sanity doc schema
2. Update search index to include version
3. Create `VersionSelector` component
4. Create `useVersionFilter` hook
5. Add version badges to results

**Files to modify:**
- `studio/schemaTypes/doc.ts`
- `classic/scripts/generate-search-index.js`
- `classic/src/components/SearchModal/SearchModal.tsx`

---

## 8. Algolia Integration

For server-side search with Algolia, update the indexer:

```typescript
// classic/scripts/index-documentation.js

// Add code blocks to Algolia index
const INDEX_SETTINGS = {
  searchableAttributes: [
    'unordered(hierarchy.lvl0)',
    'unordered(hierarchy.lvl1)',
    'unordered(hierarchy.lvl2)',
    'content',
    'code',           // NEW
    'alt',            // NEW
    'caption',        // NEW
    'language',       // NEW
  ],
  attributesForFaceting: [
    'searchable(hierarchy.lvl0)',
    'searchable(type)',        // NEW
    'searchable(language)',    // NEW
    'searchable(productVersion)', // NEW
  ],
  customRanking: [
    'desc(weight.pageRank)',
    'desc(weight.level)',
  ],
  // ... existing settings
};
```

---

## 9. Dependencies Summary

### New npm packages required:

```json
{
  "dependencies": {
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

### Environment variables:

```bash
# YouTube Data API (for video metadata)
YOUTUBE_API_KEY=your_api_key

# Algolia (existing)
ALGOLIA_APP_ID=0QV3FAFAD5
ALGOLIA_ADMIN_KEY=your_admin_key
ALGOLIA_INDEX_NAME=NXG Docs
```

---

## 10. Testing Strategy

### Unit Tests

```typescript
// Test error pattern detection
describe('errorPatterns', () => {
  it('detects HTTP status codes', () => {
    expect(extractErrorCodes('404 error')).toContain('HTTP 404');
  });
  
  it('detects connection errors', () => {
    expect(extractErrorCodes('ECONNREFUSED')).toContain('ECONNREFUSED');
  });
});

// Test transcript chunking
describe('chunkTranscript', () => {
  it('creates chunks at correct timestamps', () => {
    const transcript = [
      { text: 'Hello', offset: 0, duration: 5000 },
      { text: 'World', offset: 5000, duration: 5000 },
    ];
    const chunks = chunkTranscript(transcript, 'test', 'Test', '', '', 5);
    expect(chunks).toHaveLength(2);
  });
});
```

### E2E Tests

```typescript
// classic/e2e/search.spec.ts
test('code search returns code snippets', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+K');
  await page.fill('input[type="search"]', 'function');
  await expect(page.locator('.code-result')).toBeVisible();
});

test('video search shows timestamps', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+K');
  await page.fill('input[type="search"]', 'login setup');
  await expect(page.locator('.video-result .timestamp')).toBeVisible();
});
```

---

## Confidence Assessment

| Feature | Confidence | Notes |
|---------|------------|-------|
| Code Snippet Search | HIGH | Standard AST parsing, existing schema support |
| Image Search | HIGH | Sanity already has alt/caption fields |
| Video Transcript Search | MEDIUM | YouTube API rate limits, transcript availability varies |
| Error Message Search | HIGH | Pure regex pattern matching |
| Version-specific Search | HIGH | Simple filtering, requires schema update |

## Open Questions

1. **YouTube API quotas** - Free tier allows 10,000 units/day. Need to verify if this covers daily transcript sync.
2. **Transcript availability** - Some videos may not have auto-captions. Need fallback strategy.
3. **CLIP embeddings** - Should we pursue visual similarity search? Significant complexity for MVP.
4. **Algolia vs Fuse.js** - Which should be the primary search backend for advanced features?
