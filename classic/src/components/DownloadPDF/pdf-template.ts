export const NXGEN_PDF_STYLES = {
  colors: {
    primary: '#C9A227',
    primaryLight: '#E8C45A',
    primaryDark: '#A68A1F',
    headerText: '#1A1C2E',
    heading1: '#C9A227',
    heading2: '#1A1C2E',
    heading3: '#2C2C2C',
    text: '#2C2C2C',
    textSecondary: '#374151',
    textMuted: '#888888',
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    border: '#E5E7EB',
    code: '#F5F5F7',
    hyperlink: '#0563C1',
  },

  fonts: {
    base: "Arial, Helvetica, sans-serif",
    mono: "'Courier New', Courier, monospace",
  },

  typography: {
    title: { size: '28pt', weight: 700, lineHeight: 1.2, color: '#C9A227' },
    h1: { size: '15pt', weight: 700, lineHeight: 1.3, color: '#C9A227' },
    h2: { size: '12pt', weight: 700, lineHeight: 1.3, color: '#1A1C2E' },
    h3: { size: '11pt', weight: 600, lineHeight: 1.4, color: '#2C2C2C' },
    h4: { size: '11pt', weight: 600, lineHeight: 1.4, color: '#2C2C2C' },
    body: { size: '11pt', weight: 400, lineHeight: 1.6, color: '#2C2C2C' },
    caption: { size: '9pt', weight: 400, lineHeight: 1.4, color: '#888888' },
    footer: { size: '8pt', weight: 400, lineHeight: 1.4, color: '#888888' },
  },

  spacing: {
    xs: '1mm',
    sm: '2mm',
    md: '3mm',
    lg: '5mm',
    xl: '8mm',
  },

  page: {
    format: 'a4' as const,
    orientation: 'portrait' as const,
    margin: [15, 10, 15, 10],
    unit: 'mm' as const,
  },

  header: {
    height: '12mm',
    logoWidth: 48,
    logoHeight: 32,
  },

  footer: {
    height: '8mm',
  },
};

export const PDF_CSS = `
  .nxgen-pdf-container {
    font-family: ${NXGEN_PDF_STYLES.fonts.base};
    color: ${NXGEN_PDF_STYLES.colors.text};
    background: ${NXGEN_PDF_STYLES.colors.background};
    padding: 0;
    margin: 0;
  }

  .nxgen-pdf-container a {
    color: ${NXGEN_PDF_STYLES.colors.hyperlink};
    text-decoration: underline;
  }

  .nxgen-pdf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8mm 15mm;
    border-bottom: 2px solid ${NXGEN_PDF_STYLES.colors.primary};
    margin-bottom: 5mm;
  }

  .nxgen-pdf-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nxgen-pdf-logo {
    width: ${NXGEN_PDF_STYLES.header.logoWidth}px;
    height: ${NXGEN_PDF_STYLES.header.logoHeight}px;
    object-fit: contain;
  }

  .nxgen-pdf-brand-text {
    display: flex;
    flex-direction: column;
  }

  .nxgen-pdf-brand-name {
    font-size: 14pt;
    font-weight: 700;
    color: ${NXGEN_PDF_STYLES.colors.primary};
    letter-spacing: 0.5px;
  }

  .nxgen-pdf-brand-company {
    font-size: 10pt;
    font-weight: 400;
    color: ${NXGEN_PDF_STYLES.colors.headerText};
  }

  .nxgen-pdf-header-right {
    font-size: 10pt;
    color: ${NXGEN_PDF_STYLES.colors.textMuted};
    text-align: right;
  }

  .nxgen-pdf-title-section {
    padding: 5mm 15mm;
    margin-bottom: 5mm;
  }

  .nxgen-pdf-title {
    font-size: ${NXGEN_PDF_STYLES.typography.title.size};
    font-weight: ${NXGEN_PDF_STYLES.typography.title.weight};
    color: ${NXGEN_PDF_STYLES.typography.title.color};
    margin: 0 0 3mm 0;
    line-height: ${NXGEN_PDF_STYLES.typography.title.lineHeight};
  }

  .nxgen-pdf-meta {
    font-size: ${NXGEN_PDF_STYLES.typography.caption.size};
    color: ${NXGEN_PDF_STYLES.colors.textMuted};
    margin: 0;
  }

  .nxgen-pdf-content {
    padding: 5mm 15mm;
    line-height: ${NXGEN_PDF_STYLES.typography.body.lineHeight};
  }

  .nxgen-pdf-content h1 {
    font-size: ${NXGEN_PDF_STYLES.typography.h1.size};
    font-weight: ${NXGEN_PDF_STYLES.typography.h1.weight};
    color: ${NXGEN_PDF_STYLES.typography.h1.color};
    margin: 8mm 0 4mm 0;
    padding-bottom: 2mm;
    border-bottom: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    line-height: ${NXGEN_PDF_STYLES.typography.h1.lineHeight};
  }

  .nxgen-pdf-content h2 {
    font-size: ${NXGEN_PDF_STYLES.typography.h2.size};
    font-weight: ${NXGEN_PDF_STYLES.typography.h2.weight};
    color: ${NXGEN_PDF_STYLES.typography.h2.color};
    margin: 6mm 0 3mm 0;
    padding-bottom: 1mm;
    border-bottom: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    line-height: ${NXGEN_PDF_STYLES.typography.h2.lineHeight};
  }

  .nxgen-pdf-content h3 {
    font-size: ${NXGEN_PDF_STYLES.typography.h3.size};
    font-weight: ${NXGEN_PDF_STYLES.typography.h3.weight};
    color: ${NXGEN_PDF_STYLES.typography.h3.color};
    margin: 5mm 0 2mm 0;
    line-height: ${NXGEN_PDF_STYLES.typography.h3.lineHeight};
  }

  .nxgen-pdf-content h4 {
    font-size: ${NXGEN_PDF_STYLES.typography.h4.size};
    font-weight: ${NXGEN_PDF_STYLES.typography.h4.weight};
    color: ${NXGEN_PDF_STYLES.typography.h4.color};
    margin: 4mm 0 2mm 0;
    line-height: ${NXGEN_PDF_STYLES.typography.h4.lineHeight};
  }

  .nxgen-pdf-content p {
    font-size: ${NXGEN_PDF_STYLES.typography.body.size};
    color: ${NXGEN_PDF_STYLES.typography.body.color};
    margin: 0 0 3mm 0;
  }

  .nxgen-pdf-content ul,
  .nxgen-pdf-content ol {
    margin: 0 0 3mm 0;
    padding-left: 5mm;
  }

  .nxgen-pdf-content li {
    font-size: ${NXGEN_PDF_STYLES.typography.body.size};
    color: ${NXGEN_PDF_STYLES.typography.body.color};
    margin: 1mm 0;
  }

  .nxgen-pdf-content code {
    font-family: ${NXGEN_PDF_STYLES.fonts.mono};
    font-size: 10pt;
    background: ${NXGEN_PDF_STYLES.colors.code};
    padding: 0.5mm 1.5mm;
    border-radius: 2px;
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
  }

  .nxgen-pdf-content pre {
    background: ${NXGEN_PDF_STYLES.colors.code};
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    border-radius: 3mm;
    padding: 3mm;
    margin: 3mm 0;
    overflow-x: auto;
    page-break-inside: avoid;
  }

  .nxgen-pdf-content pre code {
    background: none;
    border: none;
    padding: 0;
  }

  .nxgen-pdf-content blockquote {
    border-left: 3px solid ${NXGEN_PDF_STYLES.colors.primary};
    margin: 4mm 0;
    padding: 2mm 4mm;
    background: rgba(201, 162, 39, 0.08);
    font-style: italic;
  }

  .nxgen-pdf-content .callout,
  .nxgen-pdf-content .admonition {
    padding: 3mm;
    margin: 3mm 0;
    border-radius: 2mm;
    border-left: 4px solid ${NXGEN_PDF_STYLES.colors.primary};
    background: rgba(201, 162, 39, 0.1);
    page-break-inside: avoid;
  }

  .nxgen-pdf-content .callout-title,
  .nxgen-pdf-content .admonition-heading {
    font-weight: 600;
    margin-bottom: 2mm;
    color: ${NXGEN_PDF_STYLES.colors.primary};
  }

  .nxgen-pdf-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }

  .nxgen-pdf-content th {
    background: ${NXGEN_PDF_STYLES.colors.backgroundAlt};
    font-weight: 600;
    padding: 2mm 3mm;
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    text-align: left;
  }

  .nxgen-pdf-content td {
    padding: 2mm 3mm;
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
  }

  .nxgen-pdf-content tr:nth-child(even) {
    background: ${NXGEN_PDF_STYLES.colors.backgroundAlt};
  }

  .nxgen-pdf-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 3mm auto;
    page-break-inside: avoid;
  }

  .nxgen-pdf-content figure {
    margin: 4mm 0;
    text-align: center;
  }

  .nxgen-pdf-content figure figcaption,
  .nxgen-pdf-content figure em {
    font-size: ${NXGEN_PDF_STYLES.typography.caption.size};
    color: ${NXGEN_PDF_STYLES.colors.textMuted};
    font-style: italic;
    margin-top: 2mm;
    display: block;
  }

  .nxgen-pdf-content hr {
    border: none;
    border-top: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    margin: 5mm 0;
  }

  .nxgen-pdf-content .mermaid,
  .nxgen-pdf-content .tabs-container,
  .nxgen-pdf-content .copy-button,
  .nxgen-pdf-content [role="tablist"],
  .nxgen-pdf-content video,
  .nxgen-pdf-content iframe {
    display: none !important;
  }

  .nxgen-pdf-content .theme-code-block {
    margin: 4mm 0;
    page-break-inside: avoid;
  }

  .nxgen-pdf-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4mm 15mm;
    border-top: 2px solid ${NXGEN_PDF_STYLES.colors.primary};
    font-size: ${NXGEN_PDF_STYLES.typography.footer.size};
    color: ${NXGEN_PDF_STYLES.colors.textMuted};
    margin-top: 5mm;
  }

  .nxgen-pdf-footer-left {
    font-weight: 500;
  }

  .nxgen-pdf-footer-right {
    text-align: right;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export function generatePDFConfig(title: string, _url: string) {
  return {
    ...NXGEN_PDF_STYLES.page,
    filename: `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 800,
    },
    jsPDF: {
      unit: NXGEN_PDF_STYLES.page.unit,
      format: NXGEN_PDF_STYLES.page.format,
      orientation: NXGEN_PDF_STYLES.page.orientation,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['h1', 'h2', 'h3', 'table', 'figure', 'pre', '.admonition'],
    },
  };
}

export const LOGO_PATH = '/img/nxgen-pdf-logo.png';
