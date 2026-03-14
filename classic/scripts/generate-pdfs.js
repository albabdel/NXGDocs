#!/usr/bin/env node
/**
 * Build-time PDF generation script using Puppeteer.
 * Generates styled PDFs from markdown documentation files.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const DOCS_DIR = path.join(__dirname, '..', '.sanity-cache', 'docs');
const OUTPUT_DIR = path.join(__dirname, '..', 'static', 'pdfs');
const LOGO_PATH = path.join(__dirname, '..', 'static', 'img', 'nxgen-pdf-logo.png');

const NXGEN_BRAND_COLOR = '#C9A227';
const NXGEN_DARK_COLOR = '#1A1C2E';

function generatePdfHtml(title, content, logoBase64) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 25mm 15mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      padding: 0;
    }
    .header {
      border-bottom: 3px solid ${NXGEN_BRAND_COLOR};
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .logo {
      height: 32px;
      width: auto;
    }
    .header-text {
      font-size: 14px;
      font-weight: 600;
      color: ${NXGEN_DARK_COLOR};
    }
    h1 {
      color: ${NXGEN_DARK_COLOR};
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      border-bottom: 2px solid ${NXGEN_BRAND_COLOR};
      padding-bottom: 10px;
    }
    h2 {
      color: ${NXGEN_DARK_COLOR};
      font-size: 18px;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    h3 {
      color: #444;
      font-size: 14px;
      font-weight: 600;
      margin-top: 18px;
      margin-bottom: 10px;
    }
    h4 {
      color: #555;
      font-size: 13px;
      font-weight: 600;
      margin-top: 14px;
      margin-bottom: 8px;
    }
    p {
      margin-bottom: 12px;
    }
    ul, ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 6px;
    }
    code {
      font-family: 'Courier New', Courier, monospace;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
    }
    pre {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 12px;
      font-size: 11px;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 3px solid ${NXGEN_BRAND_COLOR};
      padding-left: 12px;
      margin: 12px 0;
      color: #666;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background: ${NXGEN_DARK_COLOR};
      color: white;
    }
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    a {
      color: ${NXGEN_BRAND_COLOR};
      text-decoration: none;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 12px 0;
    }
    .footer {
      border-top: 2px solid ${NXGEN_BRAND_COLOR};
      padding-top: 12px;
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    .callout {
      background: #fff8e6;
      border-left: 4px solid ${NXGEN_BRAND_COLOR};
      padding: 12px;
      margin: 12px 0;
      border-radius: 0 4px 4px 0;
    }
    .callout-title {
      font-weight: 600;
      margin-bottom: 6px;
    }
    .jsx-stub {
      color: #888;
      font-style: italic;
      background: #f0f0f0;
      padding: 8px;
      border-radius: 4px;
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="data:image/png;base64,${logoBase64}" class="logo" alt="NXGEN Logo">
    <span class="header-text">NXGEN | GCXONE Documentation</span>
  </div>
  <h1>${escapeHtml(title)}</h1>
  <div class="content">${content}</div>
  <div class="footer">
    GCXONE Security Management Platform | NXGEN Technology AG | Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function stripMdxContent(content) {
  let processed = content;
  
  processed = processed.replace(/^import\s+.*$/gm, '');
  processed = processed.replace(/^export\s+.*$/gm, '');
  processed = processed.replace(/<Link[^>]*>([^<]*)<\/Link>/gi, '$1');
  processed = processed.replace(/<BrowserOnly[^>]*>[\s\S]*?<\/BrowserOnly>/gi, '');
  processed = processed.replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '');
  processed = processed.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/gi, (match) => {
    const content = match.replace(/<\/?[A-Z][a-zA-Z]*[^>]*>/g, '');
    return content.trim() ? `<div class="jsx-stub">${content}</div>` : '';
  });
  processed = processed.replace(/\s*style=\{\{[^}]*\}\}/g, '');
  processed = processed.replace(/\s*to="[^"]*"/g, '');
  
  processed = processed.replace(/####\s*/g, '#### ');
  processed = processed.replace(/###\s*/g, '### ');
  processed = processed.replace(/##\s*/g, '## ');
  
  return processed.trim();
}

function convertMarkdownToHtml(markdown) {
  const stripped = stripMdxContent(markdown);
  
  marked.setOptions({
    breaks: true,
    gfm: true
  });
  
  return marked(stripped);
}

function extractSlug(filePath, docsDir) {
  const relativePath = path.relative(docsDir, filePath);
  const parsed = path.parse(relativePath);
  let slug = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;
  slug = slug.replace(/\\/g, '/').replace(/\/index$/, '');
  if (slug === 'index') {
    slug = 'documentation-home';
  }
  return slug;
}

function findMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function generatePdf(browser, filePath, logoBase64) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: markdown } = matter(content);
  
  const title = data.title || path.parse(filePath).name;
  const slug = extractSlug(filePath, DOCS_DIR);
  const htmlContent = convertMarkdownToHtml(markdown);
  const html = generatePdfHtml(title, htmlContent, logoBase64);
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '25mm',
      left: '15mm',
      right: '15mm'
    }
  });
  
  await page.close();
  
  const outputPath = path.join(OUTPUT_DIR, `${slug}.pdf`);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, pdfBuffer);
  
  return { slug, title, size: pdfBuffer.length };
}

async function main() {
  console.log('[PDF Generation] Starting build-time PDF generation...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`[PDF Generation] Created output directory: ${OUTPUT_DIR}`);
  }
  
  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`[PDF Generation] Logo not found at ${LOGO_PATH}`);
    process.exit(1);
  }
  
  const logoBase64 = fs.readFileSync(LOGO_PATH, 'base64');
  console.log('[PDF Generation] Loaded NXGEN logo');
  
  const mdFiles = findMarkdownFiles(DOCS_DIR);
  console.log(`[PDF Generation] Found ${mdFiles.length} markdown files`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  console.log('[PDF Generation] Puppeteer browser launched');
  
  const results = [];
  const errors = [];
  
  for (const filePath of mdFiles) {
    try {
      const result = await generatePdf(browser, filePath, logoBase64);
      results.push(result);
      console.log(`[PDF Generation] Generated: ${result.slug}.pdf (${(result.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      const slug = extractSlug(filePath, DOCS_DIR);
      errors.push({ slug, error: error.message });
      console.error(`[PDF Generation] Failed: ${slug} - ${error.message}`);
    }
  }
  
  await browser.close();
  
  console.log('\n[PDF Generation] Summary:');
  console.log(`  - Successfully generated: ${results.length} PDFs`);
  console.log(`  - Failed: ${errors.length}`);
  
  if (results.length > 0) {
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    console.log(`  - Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  if (errors.length > 0) {
    console.log('\n[PDF Generation] Errors:');
    errors.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
  }
  
  console.log('[PDF Generation] Complete!');
}

main().catch(err => {
  console.error('[PDF Generation] Fatal error:', err.message);
  process.exit(1);
});
