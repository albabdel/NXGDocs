import React, { useState, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Download, Loader2, Check, AlertCircle } from 'lucide-react';
import styles from './styles.module.css';
import { imageToBase64, processImages, preloadImageAsBase64 } from '@site/src/utils/pdf-images';
import { PDF_TEMPLATE, getHeaderHtml, getFooterHtml, getBodyStyles } from '@site/src/utils/pdf-template';

interface DownloadPDFProps {
  title?: string;
  content?: string;
  slug?: string;
  className?: string;
}

function DownloadPDFInner({ title: propTitle, content: propContent, slug: propSlug, className }: DownloadPDFProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generatePDF = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      let articleEl = document.querySelector('.theme-doc-markdown') || 
                      document.querySelector('article') ||
                      document.querySelector('.markdown');
      
      if (!articleEl) {
        throw new Error('Could not find article content');
      }

      const titleEl = articleEl.querySelector('h1');
      const title = propTitle || titleEl?.textContent || document.title.replace(' | NXGEN GCXONE Documentation', '').trim();
      const slug = propSlug || window.location.pathname.split('/').filter(Boolean).pop() || 'document';
      const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');

      const clone = articleEl.cloneNode(true) as HTMLElement;
      
      clone.querySelectorAll('button, .copy-button, [role="tablist"], .tabs, video, iframe, .theme-code-block, .hash-link').forEach(el => el.remove());
      
      clone.querySelectorAll('a').forEach(link => {
        const span = document.createElement('span');
        span.textContent = link.textContent;
        link.replaceWith(span);
      });

      let logoBase64: string | undefined;
      try {
        const logoUrl = `${window.location.origin}${PDF_TEMPLATE.logo.path}`;
        logoBase64 = await preloadImageAsBase64(logoUrl);
      } catch (err) {
        console.warn('Could not load logo, using fallback:', err);
      }

      const printContainer = document.createElement('div');
      printContainer.id = 'pdf-print-container';
      
      const dateStr = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      printContainer.innerHTML = `
        ${getBodyStyles()}
        <div style="
          font-family: ${PDF_TEMPLATE.fonts.primary};
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          background: ${PDF_TEMPLATE.colors.background};
          color: ${PDF_TEMPLATE.colors.text};
        ">
          ${getHeaderHtml(title, logoBase64)}
          <main class="pdf-body" style="line-height: 1.7; font-size: 14px;">
            ${clone.innerHTML}
          </main>
          ${getFooterHtml(dateStr)}
        </div>
      `;

      printContainer.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; background: white; z-index: 10000;';
      document.body.appendChild(printContainer);

      await processImages(printContainer);

      const element = printContainer.firstElementChild as HTMLElement;

      const opt = {
        margin: 10,
        filename: `${sanitizedSlug}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: 0,
          scrollX: 0,
          logging: false,
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();

      document.body.removeChild(printContainer);
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  }, [propTitle, propContent, propSlug]);

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 size={18} className={styles.spinner} />
            <span>Generating...</span>
          </>
        );
      case 'success':
        return (
          <>
            <Check size={18} />
            <span>Downloaded!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={18} />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <Download size={18} />
            <span>Download PDF</span>
          </>
        );
    }
  };

  return (
    <div className={`${styles.downloadPDF} ${className || ''}`}>
      <button
        onClick={generatePDF}
        disabled={status === 'loading'}
        className={`${styles.downloadButton} ${styles[status]}`}
        aria-label="Download page as PDF"
        title="Download this page as a PDF document"
      >
        {getButtonContent()}
      </button>
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default function DownloadPDF(props: DownloadPDFProps) {
  return (
    <BrowserOnly fallback={<div className={styles.downloadPDF}><div className={styles.loadingFallback}>Loading...</div></div>}>
      {() => <DownloadPDFInner {...props} />}
    </BrowserOnly>
  );
}
