import fs from 'fs';
import path from 'path';
import type { EnhancedSearchRecord } from '../src/components/SearchModal/types/EnhancedSearchRecord';

interface ExtractedImage {
  assetId: string;
  alt: string | null;
  caption: string | null;
  credit: string | null;
  sourceUrl: string;
  sourceTitle: string;
}

/**
 * Extract images from markdown/MDX content
 * Matches markdown image syntax: ![alt](url)
 */
export function extractImagesFromContent(
  content: string,
  sourceUrl: string,
  sourceTitle: string
): ExtractedImage[] {
  const images: ExtractedImage[] = [];

  // Match markdown images: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1] || null;
    const url = match[2];

    // Skip if it's an external URL or data URI
    if (url.startsWith('http') || url.startsWith('data:')) continue;

    images.push({
      assetId: url,
      alt,
      caption: null,
      credit: null,
      sourceUrl,
      sourceTitle,
    });
  }

  return images;
}

/**
 * Convert an extracted image to a search record
 */
export function imageToSearchRecord(image: ExtractedImage): EnhancedSearchRecord {
  const id = `${image.sourceUrl}#image-${encodeURIComponent(image.assetId)}`;

  return {
    id,
    type: 'image',
    title: image.alt || `Image in ${image.sourceTitle}`,
    excerpt: (image.caption || image.alt || '').slice(0, 200),
    content: [image.alt, image.caption].filter(Boolean).join(' '),
    url: image.sourceUrl,
    section: image.sourceTitle,
    category: 'image',
    tags: [],
    alt: image.alt || undefined,
    caption: image.caption || undefined,
    thumbnailUrl: image.assetId,
    fullImageUrl: image.assetId,
  };
}

/**
 * Recursively extract images from a directory of MDX/MD files
 */
export function extractImagesFromDirectory(dir: string, baseDir?: string): ExtractedImage[] {
  const allImages: ExtractedImage[] = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return allImages;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const effectiveBaseDir = baseDir || dir;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      allImages.push(...extractImagesFromDirectory(fullPath, effectiveBaseDir));
    } else if (/\.(md|mdx)$/.test(entry.name) && !entry.name.startsWith('_')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const relativePath = path.relative(effectiveBaseDir, fullPath).replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
      const sourceUrl = `/docs/${relativePath}`;
      const sourceTitle = entry.name.replace(/\.(md|mdx)$/, '');

      const images = extractImagesFromContent(content, sourceUrl, sourceTitle);
      allImages.push(...images);
    }
  }

  return allImages;
}

/**
 * Extract images from Sanity cache files
 */
export function extractImagesFromSanityCache(cacheDir: string): ExtractedImage[] {
  const allImages: ExtractedImage[] = [];

  if (!fs.existsSync(cacheDir)) {
    console.warn(`Sanity cache directory not found: ${cacheDir}`);
    return allImages;
  }

  const entries = fs.readdirSync(cacheDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const docDir = path.join(cacheDir, entry.name);
    const docFiles = fs.readdirSync(docDir);

    for (const docFile of docFiles) {
      if (!/\.(md|mdx)$/.test(docFile)) continue;

      const filePath = path.join(docDir, docFile);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sourceUrl = `/docs/${entry.name}/${docFile.replace(/\.(md|mdx)$/, '')}`;
      const sourceTitle = docFile.replace(/\.(md|mdx)$/, '');

      const images = extractImagesFromContent(content, sourceUrl, sourceTitle);
      allImages.push(...images);
    }
  }

  return allImages;
}

/**
 * Main extraction function - tries both direct docs and Sanity cache
 */
export function extractAllImages(projectRoot: string): ExtractedImage[] {
  const allImages: ExtractedImage[] = [];

  // Try Sanity cache first
  const sanityCacheDir = path.join(projectRoot, '.sanity-cache', 'docs');
  const sanityImages = extractImagesFromSanityCache(sanityCacheDir);
  allImages.push(...sanityImages);

  // Also try direct docs directory
  const docsDir = path.join(projectRoot, 'docs');
  const docsImages = extractImagesFromDirectory(docsDir);
  allImages.push(...docsImages);

  // Deduplicate by assetId + sourceUrl
  const seen = new Set<string>();
  return allImages.filter((img) => {
    const key = `${img.assetId}::${img.sourceUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default {
  extractImagesFromContent,
  extractImagesFromDirectory,
  extractImagesFromSanityCache,
  extractAllImages,
  imageToSearchRecord,
};
