# Phase 4: Advanced Search Types

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 4 of 5  
**Duration:** 3-4 days  
**Status:** IN PROGRESS  
**Started:** March 15, 2026

---

## Objective

Implement specialized search types for different content formats, enabling users to find images, code snippets, videos, error messages, and version-specific documentation.

## Features Delivered

| Feature | Description | Effort | Status |
|---------|-------------|--------|--------|
| **Image Search** | Search images by alt text and captions | 1 day | PENDING |
| **Code Snippet Search** | Enhanced code search with language filter | 1 day | PENDING |
| **Video Transcript Search** | Search within video transcripts | 1 day | PENDING |
| **Error Message Search** | Search by error codes and messages | 0.5 day | PENDING |
| **Version Filter** | Filter docs by product version | 0.5 day | PENDING |

---

## Technical Architecture

### 4.1 Content Type Detection

Search index records already support content types via `type` field:
- `page` - Standard documentation pages
- `code` - Code snippets with language
- `image` - Images with alt text
- `video` - Videos with transcripts
- `error` - Error documentation

### 4.2 Image Search Enhancement

```typescript
// Enhanced ImageResult component
interface ImageResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

// Display: thumbnail, alt text, surrounding context
// Cloudinary integration for image optimization
```

### 4.3 Code Snippet Search Enhancement

```typescript
// Enhanced CodeResult component
- Syntax highlighting
- Language badge
- Line numbers
- Copy button
- Context lines before/after match
```

### 4.4 Video Transcript Search

```typescript
// New VideoResult component
interface VideoResultProps {
  result: EnhancedSearchRecord;
  query: string;
  timestamp?: number; // Jump to specific time
  isHighlighted: boolean;
}

// Display: video thumbnail, transcript excerpt, timestamp links
```

### 4.5 Error Message Search

```typescript
// ErrorSearch component for troubleshooting
- Error code detection in query
- Suggested solutions
- Related documentation links
```

### 4.6 Version Filter

```typescript
// VersionFilter component
interface VersionFilterProps {
  activeVersion: string | null;
  versions: string[];
  counts: Record<string, number>;
  onChange: (version: string | null) => void;
}

// Extract versions from search index
// Filter results by version
```

---

## Implementation Tasks

### Task 4.1: Enhanced ImageResult (Day 1)

- [ ] Update `ImageResult.tsx` with thumbnail display
- [ ] Add Cloudinary image optimization
- [ ] Show alt text highlighted with query match
- [ ] Display surrounding context from document

### Task 4.2: Enhanced CodeResult (Day 1-2)

- [ ] Add syntax highlighting with Prism
- [ ] Add line numbers toggle
- [ ] Show context lines around match
- [ ] Add copy-to-clipboard functionality
- [ ] Add language badge

### Task 4.3: VideoResult Component (Day 2)

- [ ] Create `VideoResult.tsx` component
- [ ] Display video thumbnail
- [ ] Show transcript excerpt with highlights
- [ ] Add timestamp links for navigation
- [ ] Add play button overlay

### Task 4.4: Error Search (Day 2-3)

- [ ] Create `ErrorResult.tsx` component
- [ ] Detect error patterns in queries
- [ ] Display error code prominently
- [ ] Show solution suggestions
- [ ] Link to related documentation

### Task 4.5: Version Filter (Day 3)

- [ ] Create `VersionFilter.tsx` component
- [ ] Extract versions from search index
- [ ] Add to SearchModal filters row
- [ ] Filter results by selected version
- [ ] Persist version selection

### Task 4.6: Integration (Day 3-4)

- [ ] Update SearchModal to render new result types
- [ ] Update search index generation to include new fields
- [ ] Add version extraction to index generation
- [ ] Test all search types

---

## Files to Create

```
classic/
├── src/components/SearchModal/components/
│   ├── VideoResult.tsx
│   ├── VideoResult.module.css
│   ├── ErrorResult.tsx
│   ├── ErrorResult.module.css
│   ├── VersionFilter.tsx
│   └── VersionFilter.module.css
└── scripts/
    └── enhance-search-index.ts (update)
```

## Files to Modify

```
classic/
├── src/components/SearchModal/components/
│   ├── ImageResult.tsx - Enhance with thumbnail
│   ├── CodeResult.tsx - Enhance with highlighting
│   └── index.ts - Export new components
├── src/components/SearchModal/
│   └── SearchModal.tsx - Integrate new types
└── scripts/
    └── generate-search-index.js - Add version extraction
```

---

## Search Index Schema Enhancement

```typescript
interface EnhancedSearchRecord {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  url: string;
  section: string;
  category?: string;
  type: 'page' | 'code' | 'image' | 'video' | 'error';
  
  // New fields for Phase 4
  version?: string;           // Product version (e.g., "v2.0")
  imageUrl?: string;          // Cloudinary URL for images
  imageAlt?: string;          // Alt text for images
  code?: string;              // Code snippet content
  language?: string;          // Programming language
  videoUrl?: string;          // Video URL
  transcript?: string;        // Video transcript
  timestamp?: number;         // Video timestamp (seconds)
  errorCode?: string;         // Error code (e.g., "E001")
  errorMessage?: string;      // Error message
}
```

---

## Verification Criteria

- [ ] Image results show thumbnails with alt text
- [ ] Code results have syntax highlighting and copy button
- [ ] Video results show transcript with timestamp links
- [ ] Error search detects error codes in queries
- [ ] Version filter shows available versions
- [ ] Version filter correctly filters results
- [ ] All result types render correctly in SearchModal

---

## Dependencies

Already installed:
- `prism-react-renderer` - Syntax highlighting
- `@cloudinary/url-gen` - Image optimization
- `lucide-react` - Icons

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Video transcript data not available | Graceful fallback to video title |
| Version data not in docs | Parse from URL paths |
| Image thumbnails slow | Use Cloudinary transformations |
| Code highlighting performance | Debounce rendering |
