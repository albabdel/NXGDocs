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

function DownloadPDFInner({ title: propTitle, content: propContent, slug: propSlug, className }: DownloadPDFProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generatePDF = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Find article content
      let articleEl = document.querySelector('.theme-doc-markdown') || 
                      document.querySelector('article') ||
                      document.querySelector('.markdown');
      
      if (!articleEl) {
        throw new Error('Could not find article content');
      }

      // Get title
      const titleEl = articleEl.querySelector('h1');
      const title = propTitle || titleEl?.textContent || document.title.replace(' | NXGEN GCXONE Documentation', '').trim();
      const slug = propSlug || window.location.pathname.split('/').filter(Boolean).pop() || 'document';
      const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');

      // Clone and clean content
      const clone = articleEl.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('button, .copy-button, [role="tablist"], .tabs, video, iframe, .theme-code-block').forEach(el => el.remove());
      
      // Convert links to plain text
      clone.querySelectorAll('a').forEach(link => {
        const span = document.createElement('span');
        span.textContent = link.textContent;
        link.replaceWith(span);
      });

      // Create print container
      const printContainer = document.createElement('div');
      printContainer.id = 'pdf-print-container';
      printContainer.innerHTML = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: white; color: #1a1a1a;">
          <header style="border-bottom: 3px solid #E8B058; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <span style="font-size: 20px; font-weight: 800; color: #E8B058;">NXGEN</span>
              <span style="color: #ccc;">|</span>
              <span style="font-size: 16px; font-weight: 600; color: #666;">GCXONE Documentation</span>
            </div>
            <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #1a1a1a;">${title}</h1>
            <p style="font-size: 12px; color: #888; margin-top: 10px; margin-bottom: 0;">
              Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>
          <main style="line-height: 1.7; font-size: 14px;">
            ${clone.innerHTML}
          </main>
          <footer style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px; font-size: 11px; color: #888;">
            <p style="margin: 0;">© ${new Date().getFullYear()} NXGEN Technology AG. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; word-break: break-all;">${window.location.href}</p>
          </footer>
        </div>
      `;

      // Add to DOM (must be visible for html2canvas)
      printContainer.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; background: white; z-index: 10000;';
      document.body.appendChild(printContainer);

      // Wait for images to load
      const images = printContainer.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000);
        });
      }));

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
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
        },
      };

      await html2pdf().set(opt).from(element).save();

      // Cleanup
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
