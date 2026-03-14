import html2pdf from 'html2pdf.js';

export interface ArticleContent {
  title: string;
  bodyHtml: string;
  images?: Array<{
    src: string;
    alt?: string;
    caption?: string;
  }>;
  author?: string;
  date?: string;
}

export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  imageQuality?: number;
  enableLinks?: boolean;
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
  };
}

const NXGEN_COLORS = {
  primary: '#E8B058',
  primaryDark: '#D4A04A',
  background: '#1a1a2e',
  text: '#ffffff',
  textDark: '#333333',
  headerBg: '#16213e',
  footerBg: '#0f0f23',
};

async function loadImageAsBase64(src: string): Promise<string> {
  if (src.startsWith('data:')) {
    return src;
  }
  
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return src;
  }
}

async function processImagesInHtml(html: string, images?: ArticleContent['images']): Promise<string> {
  if (!images || images.length === 0) {
    return html;
  }

  const processedImages = await Promise.all(
    images.map(async (img) => ({
      ...img,
      base64: await loadImageAsBase64(img.src),
    }))
  );

  let processedHtml = html;
  for (const img of processedImages) {
    const imgRegex = new RegExp(`src=["']${escapeRegex(img.src)}["']`, 'g');
    processedHtml = processedHtml.replace(imgRegex, `src="${img.base64}"`);
  }

  return processedHtml;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createPDFContainer(article: ArticleContent, dateStr: string): HTMLElement {
  const container = document.createElement('div');
  container.id = 'pdf-container';
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 210mm;
    background: ${NXGEN_COLORS.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  `;

  container.innerHTML = `
    <style>
      @page {
        margin: 20mm 15mm;
        @top-center {
          content: element(header);
        }
        @bottom-center {
          content: element(footer);
        }
      }
      
      #pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: linear-gradient(135deg, ${NXGEN_COLORS.headerBg} 0%, ${NXGEN_COLORS.background} 100%);
        border-bottom: 3px solid ${NXGEN_COLORS.primary};
        margin-bottom: 20px;
      }
      
      .nxgen-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 24px;
        font-weight: bold;
        color: ${NXGEN_COLORS.primary};
      }
      
      .nxgen-logo-icon {
        width: 32px;
        height: 32px;
        background: ${NXGEN_COLORS.primary};
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${NXGEN_COLORS.background};
        font-size: 18px;
        font-weight: bold;
      }
      
      .article-title-header {
        color: ${NXGEN_COLORS.text};
        font-size: 14px;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .article-body {
        color: ${NXGEN_COLORS.text};
        line-height: 1.7;
        padding: 0 20px;
      }
      
      .article-body h1 {
        color: ${NXGEN_COLORS.primary};
        font-size: 28px;
        margin-bottom: 16px;
        border-bottom: 2px solid ${NXGEN_COLORS.primary};
        padding-bottom: 10px;
      }
      
      .article-body h2 {
        color: ${NXGEN_COLORS.primary};
        font-size: 22px;
        margin-top: 24px;
        margin-bottom: 12px;
      }
      
      .article-body h3 {
        color: ${NXGEN_COLORS.primaryDark};
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      
      .article-body p {
        margin-bottom: 14px;
        color: #e0e0e0;
      }
      
      .article-body a {
        color: ${NXGEN_COLORS.primary};
        text-decoration: underline;
      }
      
      .article-body code {
        background: ${NXGEN_COLORS.headerBg};
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 14px;
        color: ${NXGEN_COLORS.primary};
      }
      
      .article-body pre {
        background: ${NXGEN_COLORS.footerBg};
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        border-left: 4px solid ${NXGEN_COLORS.primary};
        margin: 16px 0;
      }
      
      .article-body pre code {
        background: none;
        padding: 0;
      }
      
      .article-body ul, .article-body ol {
        margin-bottom: 14px;
        padding-left: 24px;
      }
      
      .article-body li {
        margin-bottom: 8px;
        color: #e0e0e0;
      }
      
      .article-body blockquote {
        border-left: 4px solid ${NXGEN_COLORS.primary};
        padding-left: 16px;
        margin: 16px 0;
        font-style: italic;
        color: #b0b0b0;
      }
      
      .article-body img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      
      .article-body table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }
      
      .article-body th {
        background: ${NXGEN_COLORS.headerBg};
        color: ${NXGEN_COLORS.primary};
        padding: 12px;
        text-align: left;
        border: 1px solid ${NXGEN_COLORS.primaryDark};
      }
      
      .article-body td {
        padding: 10px 12px;
        border: 1px solid ${NXGEN_COLORS.headerBg};
        color: #e0e0e0;
      }
      
      .article-body tr:nth-child(even) {
        background: rgba(22, 33, 62, 0.3);
      }
      
      .article-meta {
        display: flex;
        gap: 20px;
        padding: 10px 20px;
        color: #888;
        font-size: 12px;
        border-bottom: 1px solid ${NXGEN_COLORS.headerBg};
        margin-bottom: 20px;
      }
      
      .article-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      #pdf-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background: ${NXGEN_COLORS.footerBg};
        border-top: 2px solid ${NXGEN_COLORS.primaryDark};
        color: #888;
        font-size: 11px;
      }
      
      .footer-left {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .footer-right {
        color: ${NXGEN_COLORS.primaryDark};
      }
      
      .page-number:after {
        content: counter(page);
      }
    </style>
    
    <div id="pdf-header">
      <div class="nxgen-logo">
        <div class="nxgen-logo-icon">NX</div>
        <span>NXGEN</span>
      </div>
      <div class="article-title-header">${escapeHtml(article.title)}</div>
    </div>
    
    <div class="article-meta">
      ${article.author ? `<span>👤 ${escapeHtml(article.author)}</span>` : ''}
      <span>📅 ${dateStr}</span>
    </div>
    
    <div class="article-body">
      <h1>${escapeHtml(article.title)}</h1>
      ${article.bodyHtml}
    </div>
    
    <div id="pdf-footer">
      <div class="footer-left">
        <span>NXGEN Documentation</span>
      </div>
      <div class="footer-right">
        <span>Page <span class="page-number"></span></span>
        <span> | ${dateStr}</span>
      </div>
    </div>
  `;

  return container;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function generatePDF(
  article: ArticleContent,
  options: PDFOptions = {}
): Promise<Blob> {
  const {
    filename = 'article.pdf',
    margin = [20, 15, 20, 15],
    imageQuality = 0.95,
    enableLinks = true,
    html2canvas: html2canvasOptions = {},
  } = options;

  const dateStr = article.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const processedHtml = await processImagesInHtml(article.bodyHtml, article.images);
  
  const container = createPDFContainer({ ...article, bodyHtml: processedHtml }, dateStr);
  document.body.appendChild(container);

  const opt = {
    margin,
    filename,
    image: { type: 'jpeg', quality: imageQuality },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      ...html2canvasOptions,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    enableLinks,
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    const pdf = await html2pdf().set(opt).from(container).outputPdf('blob');
    return pdf as Blob;
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadPDF(blob: Blob, filename: string = 'nxgen-article.pdf'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateAndDownloadPDF(
  article: ArticleContent,
  options: PDFOptions = {}
): Promise<void> {
  const filename = options.filename || `${article.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  const blob = await generatePDF(article, options);
  downloadPDF(blob, filename);
}
