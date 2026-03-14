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

async function imageToBase64(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;
  
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Fallback: try loading via Image
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 150;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(''); // Return empty on failure
      img.src = url;
    });
  }
}

async function processImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img');
  for (const img of Array.from(images)) {
    try {
      if (img.src && !img.src.startsWith('data:')) {
        const base64 = await imageToBase64(img.src);
        if (base64) {
          img.src = base64;
        }
      }
    } catch {
      // Hide failed images
      (img as HTMLElement).style.display = 'none';
    }
  }
}

function DownloadPDFInner({ title: propTitle, slug: propSlug, className }: DownloadPDFProps) {
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
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Clone and clean content
      const clone = articleEl.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('button, .copy-button, [role="tablist"], .tabs, video, iframe, .theme-code-block, .hash-link').forEach(el => el.remove());
      
      // Convert links to plain text
      clone.querySelectorAll('a').forEach(link => {
        const span = document.createElement('span');
        span.textContent = link.textContent;
        link.replaceWith(span);
      });

      // Create PDF container with NXGEN branding
      const pdfDiv = document.createElement('div');
      pdfDiv.id = 'nxgen-pdf-container';
      
      // Load logo as base64
      let logoHtml = `<div style="width: 48px; height: 32px; background: linear-gradient(135deg, #C9A227 0%, #E8C45A 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-weight: 800; font-size: 14px;">N</span></div>`;
      try {
        const logoBase64 = await imageToBase64(`${window.location.origin}/img/nxgen-pdf-logo.png`);
        if (logoBase64) {
          logoHtml = `<img src="${logoBase64}" alt="NXGEN" style="height: 32px; width: auto; object-fit: contain;" />`;
        }
      } catch (e) {
        console.warn('Could not load logo, using fallback');
      }
      
      pdfDiv.innerHTML = `
        <div style="font-family: Arial, Helvetica, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; background: white; color: #1a1a1a;">
          <!-- Header with Logo -->
          <header style="border-bottom: 3px solid #C9A227; padding-bottom: 15px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                ${logoHtml}
                <div>
                  <div style="font-size: 18px; font-weight: 700; color: #C9A227; letter-spacing: 0.5px;">NXGEN</div>
                  <div style="font-size: 12px; color: #666;">GCXONE Documentation</div>
                </div>
              </div>
              <div style="font-size: 11px; color: #888; text-align: right;">
                ${dateStr}
              </div>
            </div>
          </header>
          
          <!-- Title -->
          <h1 style="font-size: 26px; font-weight: 700; color: #1A1C2E; margin: 0 0 20px 0; line-height: 1.3;">${title}</h1>
          
          <!-- Content -->
          <main style="font-size: 14px; line-height: 1.7; color: #2C2C2C;">
            ${clone.innerHTML}
          </main>
          
          <!-- Footer -->
          <footer style="border-top: 2px solid #C9A227; padding-top: 15px; margin-top: 40px; font-size: 11px; color: #888;">
            <div style="display: flex; justify-content: space-between;">
              <span>GCXONE Security Management Platform | NXGEN Technology AG</span>
              <span>© ${new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      `;

      // Position container visibly for html2canvas
      pdfDiv.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; background: white; z-index: 99999;';
      document.body.appendChild(pdfDiv);

      // Process images
      await processImages(pdfDiv);

      // Wait a moment for images to render
      await new Promise(r => setTimeout(r, 200));

      const element = pdfDiv.firstElementChild as HTMLElement;

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
      document.body.removeChild(pdfDiv);
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate PDF');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  }, [propTitle, propSlug]);

  return (
    <div className={`${styles.downloadPDF} ${className || ''}`}>
      <button
        onClick={generatePDF}
        disabled={status === 'loading'}
        className={`${styles.downloadButton} ${styles[status]}`}
        aria-label="Download page as PDF"
      >
        {status === 'loading' && <><Loader2 size={18} className={styles.spinner} /><span>Generating...</span></>}
        {status === 'success' && <><Check size={18} /><span>Downloaded!</span></>}
        {status === 'error' && <><AlertCircle size={18} /><span>Error</span></>}
        {status === 'idle' && <><Download size={18} /><span>Download PDF</span></>}
      </button>
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
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
