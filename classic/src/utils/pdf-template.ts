/**
 * PDF Template Configuration
 * NXGEN Document Template Styling - extracted from NXGEN_Document_Template.docx
 * 
 * Colors extracted from docx template:
 * - Primary (gold): #C9A227
 * - Header text: #1A1C2E (dark navy)
 * - Body text: #2C2C2C
 * - Muted text: #888888
 * - Hyperlink: #0563C1
 * 
 * Typography from docx template:
 * - Title: 28pt, weight 700
 * - Heading 1: 15pt, color #C9A227
 * - Heading 2: 12pt, color #1A1C2E
 * - Heading 3: 11pt, color #2C2C2C
 * - Body: 11pt
 * - Caption/Footer: 9pt, color #888888
 */

export const PDF_TEMPLATE = {
  colors: {
    primary: '#C9A227',
    primaryLight: '#E8C45A',
    primaryDark: '#A68A1F',
    headerText: '#1A1C2E',
    heading1: '#C9A227',
    heading2: '#1A1C2E',
    heading3: '#2C2C2C',
    background: '#FFFFFF',
    text: '#2C2C2C',
    textLight: '#374151',
    textMuted: '#888888',
    border: '#E5E7EB',
    borderAccent: '#C9A227',
    codeBackground: '#F5F5F7',
    headerBg: '#FFFFFF',
    footerBg: '#FFFFFF',
    hyperlink: '#0563C1',
  },
  
  fonts: {
    primary: "Arial, Helvetica, sans-serif",
    mono: "'Courier New', Consolas, Monaco, monospace",
  },
  
  typography: {
    title: { size: '28pt', weight: 700 },
    h1: { size: '15pt', weight: 700 },
    h2: { size: '12pt', weight: 700 },
    h3: { size: '11pt', weight: 600 },
    h4: { size: '11pt', weight: 600 },
    body: { size: '11pt', weight: 400 },
    caption: { size: '9pt', weight: 400 },
    footer: { size: '8pt', weight: 400 },
  },
  
  spacing: {
    pageMargin: '15mm',
    headerPadding: '8mm 15mm',
    footerPadding: '4mm 15mm',
    contentPadding: '5mm 15mm',
    sectionGap: '5mm',
  },
  
  logo: {
    path: '/img/nxgen-pdf-logo.png',
    width: 48,
    height: 32,
  },
};

export function getHeaderHtml(title: string, logoBase64?: string): string {
  const logoSrc = logoBase64 || PDF_TEMPLATE.logo.path;
  const { colors, fonts, logo, spacing } = PDF_TEMPLATE;
  
  return `
    <header style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${spacing.headerPadding};
      border-bottom: 2px solid ${colors.borderAccent};
      margin-bottom: ${spacing.sectionGap};
      background: ${colors.headerBg};
    ">
      <div style="display: flex; align-items: center; gap: 8px;">
        <img 
          src="${logoSrc}" 
          alt="NXGEN Logo" 
          style="height: ${logo.height}px; width: ${logo.width}px; object-fit: contain;"
        />
        <div style="display: flex; flex-direction: column;">
          <span style="
            font-family: ${fonts.primary};
            font-size: 14pt;
            font-weight: 700;
            color: ${colors.primary};
            letter-spacing: 0.5px;
          ">GCXONE</span>
          <span style="
            font-family: ${fonts.primary};
            font-size: 10pt;
            color: ${colors.headerText};
          ">NXGEN Technology AG</span>
        </div>
      </div>
      <div style="
        font-family: ${fonts.primary};
        font-size: 10pt;
        color: ${colors.textMuted};
        text-align: right;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      ">
        Documentation
      </div>
    </header>
    
    <div style="
      padding: 5mm 15mm;
      margin-bottom: ${spacing.sectionGap};
    ">
      <h1 style="
        font-family: ${fonts.primary};
        font-size: ${PDF_TEMPLATE.typography.title.size};
        font-weight: ${PDF_TEMPLATE.typography.title.weight};
        color: ${colors.heading1};
        margin: 0 0 3mm 0;
        line-height: 1.2;
      ">${escapeHtml(title)}</h1>
      <p style="
        font-family: ${fonts.primary};
        font-size: ${PDF_TEMPLATE.typography.caption.size};
        color: ${colors.textMuted};
        margin: 0;
      ">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  `;
}

export function getFooterHtml(_dateStr: string): string {
  const year = new Date().getFullYear();
  const { colors, fonts, spacing } = PDF_TEMPLATE;
  
  return `
    <footer style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${spacing.footerPadding};
      border-top: 2px solid ${colors.borderAccent};
      margin-top: 5mm;
      background: ${colors.footerBg};
      font-family: ${fonts.primary};
    ">
      <div style="
        font-size: ${PDF_TEMPLATE.typography.footer.size};
        font-weight: 500;
        color: ${colors.textMuted};
      ">
        GCXONE Security Management Platform | NXGEN Technology AG
      </div>
      <div style="
        font-size: ${PDF_TEMPLATE.typography.footer.size};
        color: ${colors.textMuted};
        text-align: right;
      ">
        <span>${year}</span>
      </div>
    </footer>
  `;
}

export function getBodyStyles(): string {
  const { colors, fonts, typography } = PDF_TEMPLATE;
  
  return `
    <style>
      .pdf-body {
        font-family: ${fonts.primary};
        font-size: ${typography.body.size};
        line-height: 1.6;
        color: ${colors.text};
        background: ${colors.background};
      }
      
      .pdf-body h1 {
        font-family: ${fonts.primary};
        font-size: ${typography.h1.size};
        font-weight: ${typography.h1.weight};
        color: ${colors.heading1};
        margin: 8mm 0 4mm 0;
        padding-bottom: 2mm;
        border-bottom: 1px solid ${colors.border};
        line-height: 1.3;
      }
      
      .pdf-body h2 {
        font-family: ${fonts.primary};
        font-size: ${typography.h2.size};
        font-weight: ${typography.h2.weight};
        color: ${colors.heading2};
        margin: 6mm 0 3mm 0;
        padding-bottom: 1mm;
        border-bottom: 1px solid ${colors.border};
        line-height: 1.3;
      }
      
      .pdf-body h3 {
        font-family: ${fonts.primary};
        font-size: ${typography.h3.size};
        font-weight: ${typography.h3.weight};
        color: ${colors.heading3};
        margin: 5mm 0 2mm 0;
        line-height: 1.4;
      }
      
      .pdf-body h4 {
        font-family: ${fonts.primary};
        font-size: ${typography.h4.size};
        font-weight: ${typography.h4.weight};
        color: ${colors.text};
        margin: 4mm 0 2mm 0;
        line-height: 1.4;
      }
      
      .pdf-body p {
        margin: 0 0 3mm 0;
        color: ${colors.text};
        font-size: ${typography.body.size};
      }
      
      .pdf-body a {
        color: ${colors.hyperlink};
        text-decoration: underline;
      }
      
      .pdf-body ul, .pdf-body ol {
        margin: 0 0 3mm 0;
        padding-left: 5mm;
      }
      
      .pdf-body li {
        margin: 1mm 0;
        color: ${colors.text};
        font-size: ${typography.body.size};
      }
      
      .pdf-body code {
        font-family: ${fonts.mono};
        font-size: 10pt;
        background: ${colors.codeBackground};
        padding: 0.5mm 1.5mm;
        border-radius: 2px;
        border: 1px solid ${colors.border};
      }
      
      .pdf-body pre {
        background: ${colors.codeBackground};
        padding: 3mm;
        border-radius: 3mm;
        overflow-x: auto;
        margin: 3mm 0;
        border: 1px solid ${colors.border};
        page-break-inside: avoid;
      }
      
      .pdf-body pre code {
        background: none;
        padding: 0;
        border: none;
      }
      
      .pdf-body blockquote {
        border-left: 3px solid ${colors.primary};
        padding: 2mm 4mm;
        margin: 4mm 0;
        font-style: italic;
        color: ${colors.textLight};
        background: rgba(201, 162, 39, 0.08);
      }
      
      .pdf-body img {
        max-width: 100%;
        height: auto;
        border-radius: 2mm;
        margin: 3mm auto;
        display: block;
        page-break-inside: avoid;
      }
      
      .pdf-body table {
        width: 100%;
        border-collapse: collapse;
        margin: 4mm 0;
        font-size: 10pt;
        page-break-inside: avoid;
      }
      
      .pdf-body th {
        background: #F9FAFB;
        color: ${colors.text};
        padding: 2mm 3mm;
        text-align: left;
        font-weight: 600;
        border: 1px solid ${colors.border};
      }
      
      .pdf-body td {
        padding: 2mm 3mm;
        border: 1px solid ${colors.border};
        color: ${colors.text};
      }
      
      .pdf-body tr:nth-child(even) {
        background: #F9FAFB;
      }
      
      .pdf-body .admonition {
        padding: 3mm;
        border-radius: 2mm;
        margin: 3mm 0;
        border-left: 4px solid ${colors.primary};
        background: rgba(201, 162, 39, 0.1);
        page-break-inside: avoid;
      }
      
      .pdf-body .admonition-title,
      .pdf-body .admonition-heading {
        font-weight: 600;
        margin-bottom: 2mm;
        color: ${colors.primary};
      }
      
      .pdf-body figure {
        margin: 4mm 0;
        text-align: center;
      }
      
      .pdf-body figure figcaption,
      .pdf-body figure em {
        font-size: ${typography.caption.size};
        color: ${colors.textMuted};
        font-style: italic;
        margin-top: 2mm;
        display: block;
      }
      
      .pdf-body hr {
        border: none;
        border-top: 1px solid ${colors.border};
        margin: 5mm 0;
      }
      
      .pdf-body .mermaid,
      .pdf-body .tabs-container,
      .pdf-body .copy-button,
      .pdf-body [role="tablist"],
      .pdf-body video,
      .pdf-body iframe {
        display: none !important;
      }
    </style>
  `;
}

export function createPDFDocument(
  title: string,
  contentHtml: string,
  logoBase64?: string
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      ${getBodyStyles()}
    </head>
    <body style="margin: 0; padding: 0;">
      <div style="
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background: ${PDF_TEMPLATE.colors.background};
      ">
        ${getHeaderHtml(title, logoBase64)}
        
        <main class="pdf-body">
          ${contentHtml}
        </main>
        
        ${getFooterHtml(dateStr)}
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
