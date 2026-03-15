# Phase 4: Advanced Search Types - Research Document

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 4 of 5  
**Created:** March 15, 2026  
**Status:** RESEARCH COMPLETE

---

## Table of Contents

1. [Image Search Analysis](#1-image-search-analysis)
2. [Code Snippet Search](#2-code-snippet-search)
3. [Video Transcript Search](#3-video-transcript-search)
4. [Error Message Search](#4-error-message-search)
5. [Version Filtering](#5-version-filtering)
6. [Content Type Detection](#6-content-type-detection)

---

## 1. Image Search Analysis

### 1.1 Extracting Images from Markdown/MDX Docs

Use unified/remark to parse MDX files and extract image nodes. Key interfaces include ExtractedImage (id, url, alt, title, sourceFile, sourceUrl, lineNumber, surroundingContext) and SanityExtractedImage for Sanity CMS (assetId, caption, credit, dimensions).

**Approaches:**
1. **Static MDX parsing**: Use unified(), remark-parse, remark-gfm, remark-mdx, and unist-util-visit
2. **Sanity Portable Text**: Query Sanity for documents with image blocks

### 1.2 Cloudinary Image Transformation APIs

Project has @cloudinary/react v1.14.3 and @cloudinary/url-gen v1.22.0 installed.

Key functions: getOptimizedImageUrl(publicId, options) and getSearchThumbnail(publicId).

Transformation options: searchThumbnail (200x150, auto:low quality), previewImage (400x300, auto:good), placeholder (20x15, blur 100).

### 1.3 Alt Text Extraction and Indexing

Process: Normalization (lowercase, remove special chars), keyword extraction (filter stop words), semantic embedding using Google Generative AI text-embedding-004.

### 1.4 Thumbnail Generation Strategies

1. Build-time with Sharp: Generate thumb (200x150), small (400x300), medium (800x600)
2. On-demand Cloudinary: Transform URLs with c_thumb parameters
3. Sanity transformations: Use imageUrlBuilder with crop/entropy options

---

## 2. Code Snippet Search

### 2.1 Prism-react-renderer Usage

Project has prism-react-renderer v2.3.0. Basic usage involves Highlight component with theme, code, and language props, rendering tokens with getLineProps and getTokenProps.

### 2.2 Syntax Highlighting Themes

Available: vsDark, vsLight, nightOwl, nightOwlLight, oceanicNext, github, githubDark, duotoneDark, duotoneLight, shadesOfPurple.

### 2.3 Line Number Implementation

Add span before each line with width 2.5-3em, color rgba(255,255,255,0.25), user-select none, border-right separator.

### 2.4 Copy-to-Clipboard Patterns

Use navigator.clipboard.writeText with try/catch and fallback to textarea/execCommand for older browsers.

### 2.5 Multi-language Support

Languages: javascript, typescript, jsx, tsx, python, java, c, cpp, csharp, go, rust, ruby, php, html, css, scss, sass, less, markdown, mdx, yaml, json, xml, bash, shell, powershell, docker, sql, graphql, protobuf, toml, diff, regex.

Aliases: js->javascript, ts->typescript, py->python, sh->bash, yml->yaml.

---

## 3. Video Transcript Search

### 3.1 YouTube/Vimeo Transcript Extraction

YouTube: Use youtube-transcript package with YoutubeTranscript.fetchTranscript(videoId, {lang}).
Vimeo: Use Vimeo API /videos/{videoId}/texttracks, parse VTT format.

### 3.2 Timestamp Linking Formats

YouTube: watch?v=VIDEO_ID&t=120s, embed/VIDEO_ID?start=120
Vimeo: vimeo.com/VIDEO_ID#t=2m30s, player.vimeo.com/video/VIDEO_ID#t=150s

### 3.3 Transcript Indexing Strategies

Chunking: Max 30 seconds, create TranscriptChunk with id, videoId, text, startTime, endTime, thumbnailUrl. Semantic chunking possible with AI.

### 3.4 Video Thumbnail APIs

YouTube (no API key): default 120x90, mqdefault 320x180, hqdefault 480x360, maxresdefault 1280x720.
Vimeo: Requires API call for picture URLs.

---

## 4. Error Message Search

### 4.1 Common Error Code Patterns

HTTP Status: 4xx (400,401,403,404,405,408,409,422,429) and 5xx (500,501,502,503,504).
Platform codes: NX-001, NX-002, NX-003, GCX-500, etc.
Network: ECONNREFUSED, ETIMEDOUT, ENOTFOUND, ECONNRESET, EHOSTUNREACH, ENETUNREACH, EPIPE.

### 4.2 Regex Patterns for Error Detection

Patterns for HTTP Status, HTTP Error, Error Code (XX-###), Network Error (E[A-Z]+), Exception, Error Message.

### 4.3 Error Documentation Structure

ErrorSearchRecord: id, type, errorCode, errorType, title, description, solution, relatedErrors, url, category, tags, severity.

### 4.4 Solution Linking Approaches

Direct links, related errors, contextual help, stack trace analysis.

---

## 5. Version Filtering

### 5.1 Version Extraction from URLs

Patterns: /v2.0/guide, /2.0/guide, ?version=2.0, v2.example.com.

### 5.2 Version Normalization

VersionInfo: major, minor, patch, prerelease, original. Parse with regex for semver format.

### 5.3 Version Comparison

compareVersions(a, b): Compare major, minor, patch. isVersionInRange for min/max checks.

### 5.4 Version Selector UI Patterns

Dropdown with all versions, highlight current, latest badge, group by major version.
URL-based selection with localStorage persistence.
Visual: deprecated (strikethrough), latest (green), beta (yellow).

---

## 6. Content Type Detection

### 6.1 Analyzing Search Index Structure

SearchResult: id, type (page/section/image/video/code/error), title, excerpt, content, url, score, metadata.

### 6.2 Type-based Result Rendering

page: File icon, title+breadcrumb | section: BookOpen, section title | image: Image, thumbnail | video: Play, thumbnail+timestamp | code: Code, language badge | error: AlertTriangle, error code.

### 6.3 Mixed Content Search Strategies

Unified scoring with weights: titleMatch 10, exactMatch 5, partialMatch 2, contentMatch 1.
Type boosts: error 1.5, page 1.0, code 1.2, video 0.85, image 0.8.
Type-specific filters, result grouping by type.

---

## Implementation Recommendations

### Phase 4 Tasks

1. Image Search (Week 1-2): Extract images, Cloudinary pipeline, index, components
2. Code Search (Week 2-3): Extract code blocks, language detection, syntax preview
3. Video Search (Week 3-4): Transcript pipeline, chunking, timestamp linking
4. Error Search (Week 4-5): Error registry, detection patterns, solution linking
5. Version Filtering (Week 5-6): URL extraction, normalization, selector UI
6. Content Detection (Week 6-7): Type detection, result components, filters

### Dependencies

Already installed: prism-react-renderer, @cloudinary/react, @cloudinary/url-gen, @google/generative-ai
New: youtube-transcript, sharp

---

## Summary

Phase 4 covers six advanced search capabilities using existing dependencies:
1. Image Search: Unified/remark parsing, Cloudinary, alt text indexing
2. Code Search: Prism-react-renderer, language detection, copy functionality
3. Video Search: Transcript extraction, timestamp linking, thumbnails
4. Error Search: Pattern detection, error registry, solution linking
5. Version Filtering: URL extraction, normalization, comparison
6. Content Detection: Type analysis, type-specific rendering