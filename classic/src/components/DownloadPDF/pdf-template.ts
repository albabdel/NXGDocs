export const NXGEN_PDF_STYLES = {
  colors: {
    primary: '#C89446',
    primaryLight: '#E0B688',
    primaryDark: '#996B1F',
    text: '#1A1A1A',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    border: '#E5E7EB',
    code: '#F5F5F7',
  },

  fonts: {
    base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Monaco', monospace",
  },

  typography: {
    h1: { size: '24pt', weight: 800, lineHeight: 1.2 },
    h2: { size: '18pt', weight: 700, lineHeight: 1.3 },
    h3: { size: '14pt', weight: 600, lineHeight: 1.4 },
    h4: { size: '12pt', weight: 600, lineHeight: 1.4 },
    body: { size: '11pt', weight: 400, lineHeight: 1.6 },
    code: { size: '10pt', weight: 400, lineHeight: 1.5 },
    small: { size: '9pt', weight: 400, lineHeight: 1.4 },
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
    height: '15mm',
    background: 'linear-gradient(135deg, #C89446 0%, #E0B688 100%)',
    logo: 'NXGEN GCXONE',
  },

  footer: {
    height: '10mm',
    background: '#F9FAFB',
  },
};

export const PDF_CSS = `
  .nxgen-pdf-container {
    font-family: ${NXGEN_PDF_STYLES.fonts.base};
    color: ${NXGEN_PDF_STYLES.colors.text};
    background: ${NXGEN_PDF_STYLES.colors.background};
  }

  .nxgen-pdf-container a {
    color: ${NXGEN_PDF_STYLES.colors.primaryDark};
    text-decoration: underline;
  }

  .nxgen-pdf-container blockquote {
    border-left: 3px solid ${NXGEN_PDF_STYLES.colors.primary};
    margin: 5mm 0;
    padding: 3mm 5mm;
    background: rgba(200, 148, 70, 0.08);
    font-style: italic;
  }

  .nxgen-pdf-container .callout,
  .nxgen-pdf-container .admonition {
    padding: 4mm;
    margin: 4mm 0;
    border-radius: 3mm;
    border-left: 4px solid ${NXGEN_PDF_STYLES.colors.primary};
    background: rgba(200, 148, 70, 0.1);
  }

  .nxgen-pdf-container .callout-title,
  .nxgen-pdf-container .admonition-heading {
    font-weight: 600;
    margin-bottom: 2mm;
  }

  .nxgen-pdf-container hr {
    border: none;
    border-top: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    margin: 5mm 0;
  }

  .nxgen-pdf-container .mermaid,
  .nxgen-pdf-container .tabs-container,
  .nxgen-pdf-container .copy-button,
  .nxgen-pdf-container [role="tablist"] {
    display: none !important;
  }

  .nxgen-pdf-container video {
    display: none !important;
  }

  .nxgen-pdf-container .theme-code-block {
    margin: 4mm 0;
    page-break-inside: avoid;
  }

  .nxgen-pdf-container table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
    page-break-inside: avoid;
  }

  .nxgen-pdf-container th {
    background: ${NXGEN_PDF_STYLES.colors.backgroundAlt};
    font-weight: 600;
    padding: 2mm 3mm;
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
    text-align: left;
  }

  .nxgen-pdf-container td {
    padding: 2mm 3mm;
    border: 1px solid ${NXGEN_PDF_STYLES.colors.border};
  }

  .nxgen-pdf-container tr:nth-child(even) {
    background: ${NXGEN_PDF_STYLES.colors.backgroundAlt};
  }

  .nxgen-pdf-container img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 4mm auto;
    page-break-inside: avoid;
  }

  .nxgen-pdf-container figure {
    margin: 4mm 0;
    text-align: center;
  }

  .nxgen-pdf-container figure figcaption,
  .nxgen-pdf-container figure em {
    font-size: 9pt;
    color: ${NXGEN_PDF_STYLES.colors.textMuted};
    font-style: italic;
    margin-top: 2mm;
    display: block;
  }
`;

export function generatePDFConfig(title: string, url: string) {
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
