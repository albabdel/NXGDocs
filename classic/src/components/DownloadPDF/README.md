# PDF Generation System - Implementation Guide

## Overview

This document describes the PDF generation system implemented for NXGEN documentation articles.

## Implementation Summary

### Files Created

```
classic/src/
├── components/
│   └── DownloadPDF/
│       ├── index.tsx           # Main React component
│       ├── styles.module.css   # Component styles
│       └── pdf-template.ts     # PDF styling configuration
├── theme/
│   └── DocItem/
│       └── Layout/
│           └── index.tsx       # Integration with article layout
└── css/
    └── custom.css              # Global positioning styles
```

### Dependencies

The system uses **html2pdf.js** (already in package.json):
- `html2pdf.js: ^0.10.2`
- `@types/html2pdf.js: ^0.10.0`

## How It Works

### 1. User Flow
1. User navigates to any documentation article
2. "Download PDF" button appears in the TOC sidebar (desktop) or article footer (mobile)
3. Click triggers client-side PDF generation
4. PDF downloads automatically with NXGEN branding

### 2. Technical Flow
1. Component extracts article content from `.theme-doc-markdown` element
2. Pre-processes content (removes videos, iframes, tab controls)
3. Wraps in NXGEN-branded header/footer template
4. Uses html2canvas to capture HTML as image
5. jsPDF generates final PDF document

## NXGEN Branding

The PDF uses NXGEN design system:
- **Primary Color**: #C89446 (NXGEN Gold)
- **Header**: Gold gradient with NXGEN | GCXONE branding
- **Footer**: Copyright and source URL
- **Typography**: Inter font family
- **Code Blocks**: JetBrains Mono with light background

## Alternative Approaches

### Option A: Current Implementation (html2pdf.js)
**Pros:**
- Works entirely client-side
- No server required
- Fast for static sites
- Preserves rendered HTML styling

**Cons:**
- Large documents may be slow
- Complex layouts may have rendering issues
- Limited control over PDF-specific features

### Option B: Server-Side with Puppeteer
```bash
npm install puppeteer
```

**Best for:** High-quality PDFs with full CSS support

```typescript
import puppeteer from 'puppeteer';

async function generatePDF(url: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    printBackground: true,
  });
  
  await browser.close();
  return pdf;
}
```

**Requires:** Serverless function or API endpoint

### Option C: DOCX Template with docxtemplater
**Best for:** Using existing NXGEN_Document_Template.docx

```bash
npm install docxtemplater pizzip
```

```typescript
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';

async function generateFromTemplate(data: ArticleData): Promise<Buffer> {
  const content = fs.readFileSync('NXGEN_Document_Template.docx', 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  
  doc.render({
    title: data.title,
    content: data.content,
    date: new Date().toLocaleDateString(),
  });
  
  return doc.getZip().generate({ type: 'nodebuffer' });
}
```

**Note:** Requires separate DOCX → PDF conversion (LibreOffice, unoconv, or cloud service)

### Option D: pdf-lib (Low-Level Control)
**Best for:** Precise control over PDF structure

```bash
npm install pdf-lib
```

```typescript
import { PDFDocument, rgb } from 'pdf-lib';

async function createPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  
  // NXGEN Gold header
  page.drawRectangle({
    x: 0, y: 800, width: 595.28, height: 40,
    color: rgb(0.78, 0.58, 0.27), // #C89446
  });
  
  const { title, content } = await extractArticleContent();
  
  // Draw text, images, etc.
  page.drawText(title, { x: 50, y: 780, size: 24 });
  
  return pdfDoc.save();
}
```

## Build-Time PDF Generation

For static hosting without runtime PDF generation:

```javascript
// scripts/generate-pdfs.js
const html2pdf = require('html2pdf.js');
const fs = require('fs');
const path = require('path');

async function generateAllPDFs() {
  const docsDir = './build/docs';
  const articles = findAllArticles(docsDir);
  
  for (const article of articles) {
    const html = fs.readFileSync(article.path, 'utf8');
    const pdf = await html2pdf().from(html).toPdf().outputPdf();
    const pdfPath = article.path.replace('.html', '.pdf');
    fs.writeFileSync(pdfPath, pdf);
  }
}
```

Add to `docusaurus.config.ts`:
```typescript
plugins: [
  function generatePDFs() {
    return {
      name: 'generate-pdfs',
      postBuild: async () => {
        const { generateAllPDFs } = await import('./scripts/generate-pdfs');
        await generateAllPDFs();
      },
    };
  },
],
```

## Troubleshooting

### Images Not Rendering
- Ensure images have `crossOrigin="anonymous"` attribute
- Use CORS-enabled image hosting (Cloudinary recommended)
- Consider embedding images as base64 for reliability

### Memory Issues with Large Documents
- Split long articles into sections
- Use `pagebreak: { mode: 'css' }` for better pagination
- Consider server-side generation for documents > 50 pages

### Styling Inconsistencies
- PDF uses light-mode styles regardless of user theme
- Dark-mode specific CSS may not render correctly
- Use explicit color values in PDF template CSS

## Future Enhancements

1. **Add print stylesheet** for browser Print → PDF
2. **Generate PDFs at build time** for instant download
3. **Add PDF metadata** (title, author, keywords)
4. **Include table of contents** in PDF
5. **Support custom page sizes** (Letter, Legal, etc.)
6. **Add watermark option** for draft documents
