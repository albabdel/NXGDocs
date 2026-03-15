#!/usr/bin/env node
/**
 * Extracts code blocks from MDX/MD files for enhanced search indexing.
 * Uses unified/remark to parse markdown and extract fenced code blocks.
 * Falls back to regex-based extraction if MDX parsing fails.
 * 
 * Output: Array of code block records with metadata (language, filename, line number)
 */

const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkGfm = require('remark-gfm');
const remarkMdx = require('remark-mdx');
const { visit } = require('unist-util-visit');
const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} ExtractedCodeBlock
 * @property {string} code - The code content
 * @property {string|null} language - Programming language
 * @property {string|null} filename - Filename from meta (e.g., title="config.yaml")
 * @property {string|null} meta - Raw meta string
 * @property {string} sourceUrl - URL of the source document
 * @property {string} sourceTitle - Title of the source document
 * @property {number} lineNumber - Line number where the code block starts
 */

/**
 * @typedef {Object} CodeBlockNode
 * @property {string} type - Node type ('code')
 * @property {string} [lang] - Language identifier
 * @property {string} [meta] - Meta string after language
 * @property {string} value - Code content
 * @property {Object} [position] - Position information
 * @property {Object} position.start - Start position
 * @property {number} position.start.line - Start line number
 */

/**
 * Fallback regex-based code block extraction
 * Used when unified/remark parsing fails (e.g., complex MDX with custom components)
 * @param {string} content - Markdown/MDX content
 * @param {string} sourceUrl - URL of the source document
 * @param {string} sourceTitle - Title of the source document
 * @returns {ExtractedCodeBlock[]} Array of extracted code blocks
 */
function extractCodeBlocksRegex(content, sourceUrl, sourceTitle) {
  const blocks = [];
  const lines = content.split('\n');
  
  // Regex to match fenced code blocks: ```lang meta
  const fenceRegex = /^```(\w*)?\s*(.*)$/;
  let inCodeBlock = false;
  let currentBlock = null;
  let startLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(fenceRegex);
    
    if (match && !inCodeBlock) {
      // Start of code block
      inCodeBlock = true;
      startLine = i + 1; // 1-indexed
      currentBlock = {
        code: '',
        language: match[1] || null,
        meta: match[2] || null,
        filename: null,
      };
      // Extract filename from meta
      if (currentBlock.meta) {
        const filenameMatch = currentBlock.meta.match(/title="([^"]+)"/);
        if (filenameMatch) {
          currentBlock.filename = filenameMatch[1];
        }
      }
    } else if (line === '```' && inCodeBlock) {
      // End of code block
      inCodeBlock = false;
      if (currentBlock && currentBlock.code.trim()) {
        blocks.push({
          code: currentBlock.code.trim(),
          language: currentBlock.language,
          filename: currentBlock.filename,
          meta: currentBlock.meta,
          sourceUrl,
          sourceTitle,
          lineNumber: startLine,
        });
      }
      currentBlock = null;
    } else if (inCodeBlock && currentBlock) {
      // Content inside code block
      currentBlock.code += line + '\n';
    }
  }
  
  return blocks;
}

/**
 * Extract code blocks from markdown content
 * @param {string} content - Markdown/MDX content
 * @param {string} sourceUrl - URL of the source document
 * @param {string} sourceTitle - Title of the source document
 * @returns {ExtractedCodeBlock[]} Array of extracted code blocks
 */
function extractCodeBlocksFromContent(content, sourceUrl, sourceTitle) {
  // Try unified/remark parser first
  try {
    const tree = unified()
      .use(remarkParse.default || remarkParse)
      .use(remarkGfm.default || remarkGfm)
      .use(remarkMdx.default || remarkMdx)
      .parse(content);

    const blocks = [];
    visit(tree, 'code', (node, index, parent) => {
      // Extract filename from meta if present (e.g., title="config.yaml")
      const meta = node.meta || '';
      const filenameMatch = meta.match(/title="([^"]+)"/);
      const filename = filenameMatch ? filenameMatch[1] : null;

      blocks.push({
        code: node.value,
        language: node.lang || null,
        filename,
        meta,
        sourceUrl,
        sourceTitle,
        lineNumber: node.position?.start?.line || 0,
      });
    });
    return blocks;
  } catch (error) {
    // Fall back to regex-based extraction for complex MDX files
    return extractCodeBlocksRegex(content, sourceUrl, sourceTitle);
  }
}

/**
 * Convert an extracted code block to a search record
 * @param {ExtractedCodeBlock} block - Extracted code block
 * @returns {Object} Search record for the code block
 */
function codeBlockToSearchRecord(block) {
  const id = `${block.sourceUrl}#code-L${block.lineNumber}`;
  const languageLabel = block.language || 'code';

  return {
    id,
    type: 'code',
    title: block.filename
      ? `${block.filename} (${languageLabel})`
      : `Code: ${languageLabel} in ${block.sourceTitle}`,
    excerpt: block.code.slice(0, 150) + (block.code.length > 150 ? '...' : ''),
    content: block.code,
    code: block.code,
    language: block.language || undefined,
    filename: block.filename || undefined,
    lineNumber: block.lineNumber,
    url: block.sourceUrl + (block.lineNumber ? `#L${block.lineNumber}` : ''),
    section: block.sourceTitle,
    category: block.language || 'code',
    tags: [block.language].filter(Boolean),
    anchor: `code-L${block.lineNumber}`,
  };
}

/**
 * Recursively extract code blocks from a directory
 * @param {string} dir - Directory path
 * @param {string} [baseDir] - Base directory for relative path calculation
 * @returns {ExtractedCodeBlock[]} Array of extracted code blocks
 */
function extractCodeBlocksFromDirectory(dir, baseDir = dir) {
  const allBlocks = [];

  if (!fs.existsSync(dir)) {
    console.warn(`[extract-code-blocks] Directory not found: ${dir}`);
    return allBlocks;
  }

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      allBlocks.push(...extractCodeBlocksFromDirectory(fullPath, baseDir));
    } else if (/\.(md|mdx)$/.test(file.name) && !file.name.startsWith('_')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
        const sourceUrl = `/docs/${relativePath}`;
        
        // Extract title from frontmatter if available
        const titleMatch = content.match(/^---\s*\n[\s\S]*?^title:\s*["']?([^"'\n]+)["']?\s*$/m);
        const sourceTitle = titleMatch ? titleMatch[1] : file.name.replace(/\.(md|mdx)$/, '');

        const blocks = extractCodeBlocksFromContent(content, sourceUrl, sourceTitle);
        allBlocks.push(...blocks);
      } catch (error) {
        console.warn(`[extract-code-blocks] Failed to read ${fullPath}:`, error.message);
      }
    }
  }

  return allBlocks;
}

/**
 * Extract code blocks from multiple directories
 * @param {Array<{dir: string, routeBase: string, section: string}>} sources - Source directories
 * @returns {ExtractedCodeBlock[]} Array of extracted code blocks
 */
function extractCodeBlocksFromSources(sources) {
  const allBlocks = [];

  for (const { dir, routeBase } of sources) {
    if (fs.existsSync(dir)) {
      const blocks = extractCodeBlocksFromDirectory(dir);
      // Update sourceUrl to use the correct routeBase
      for (const block of blocks) {
        block.sourceUrl = block.sourceUrl.replace('/docs/', routeBase + '/');
      }
      allBlocks.push(...blocks);
    }
  }

  return allBlocks;
}

module.exports = {
  extractCodeBlocksFromContent,
  codeBlockToSearchRecord,
  extractCodeBlocksFromDirectory,
  extractCodeBlocksFromSources,
};
