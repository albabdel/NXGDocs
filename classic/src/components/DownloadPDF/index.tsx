import React, { useState, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Download, Loader2, Check, AlertCircle } from 'lucide-react';
import styles from './styles.module.css';

interface DownloadPDFProps {
  title?: string;
  content?: string;
  slug?: string;
  className?: string;
}

function extractArticleContent(): { title: string; content: string; slug: string } {
  const articleEl = document.querySelector('.theme-doc-markdown');
  if (!articleEl) {
    return {
      title: document.title.replace(' | NXGEN GCXONE Documentation', '').trim(),
      content: '<p>Content not available</p>',
      slug: window.location.pathname.split('/').filter(Boolean).pop() || 'document',
    };
  }

  const titleEl = articleEl.querySelector('h1');
  const title = titleEl?.textContent || document.title.replace(' | NXGEN GCXONE Documentation', '').trim();

  const contentClone = articleEl.cloneNode(true) as HTMLElement;
  const h1InClone = contentClone.querySelector('h1');
  if (h1InClone) h1InClone.remove();

  contentClone.querySelectorAll('button, .copy-button, [role="tablist"], .tabs-container, video, iframe').forEach(el => el.remove());

  contentClone.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      const span = document.createElement('span');
      span.textContent = link.textContent;
      link.replaceWith(span);
    }
  });

  contentClone.querySelectorAll('img').forEach(img => {
    img.style.maxWidth = '180mm';
    img.style.height = 'auto';
  });

  const content = contentClone.innerHTML;
  const slug = window.location.pathname.split('/').filter(Boolean).pop() || 'document';

  return { title, content, slug };
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

      const { title: extractedTitle, content: extractedContent, slug: extractedSlug } = extractArticleContent();

      const title = propTitle || extractedTitle;
      const content = propContent || extractedContent;
      const slug = propSlug || extractedSlug;

      const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
      const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');

      const pdfContainer = document.createElement('div');
      pdfContainer.className = 'nxgen-pdf-container';

      const header = document.createElement('div');
      header.className = 'nxgen-pdf-header';
      header.innerHTML = `
        <div class="nxgen-pdf-brand">
          <span class="nxgen-pdf-logo">NXGEN</span>
          <span class="nxgen-pdf-divider">|</span>
          <span class="nxgen-pdf-product">GCXONE</span>
        </div>
        <h1 class="nxgen-pdf-title">${cleanTitle}</h1>
        <div class="nxgen-pdf-meta">
          <span class="nxgen-pdf-date">${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      `;

      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'nxgen-pdf-content';
      contentWrapper.innerHTML = content;

      const footer = document.createElement('div');
      footer.className = 'nxgen-pdf-footer';
      footer.innerHTML = `
        <div class="nxgen-pdf-copyright">© ${new Date().getFullYear()} NXGEN. All rights reserved.</div>
        <div class="nxgen-pdf-url">${window.location.href}</div>
      `;

      pdfContainer.appendChild(header);
      pdfContainer.appendChild(contentWrapper);
      pdfContainer.appendChild(footer);

      document.body.appendChild(pdfContainer);

      const opt = {
        margin: [20, 15, 20, 15] as [number, number, number, number],
        filename: `${sanitizedSlug}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as string[] },
      };

      await html2pdf().set(opt).from(pdfContainer).save();

      document.body.removeChild(pdfContainer);
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setStatus('error');
      setErrorMessage('Failed to generate PDF. Please try again.');
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
