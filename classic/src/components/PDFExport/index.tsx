import React, { useState } from 'react';
import { Download, CheckCircle2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './styles.module.css';

// Helper function to convert RGB/RGBA to hex
function rgbToHex(rgb: string): string {
  if (!rgb || rgb === 'transparent') return '#ffffff';
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return '#ffffff';
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

type ProgressStage = 'idle' | 'preparing' | 'capturing' | 'generating' | 'complete' | 'error';

export default function PDFExport(): JSX.Element {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressStage, setProgressStage] = useState<ProgressStage>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateProgress = (stage: ProgressStage, percent: number) => {
    setProgressStage(stage);
    setProgressPercent(percent);
  };

  const handleExport = async () => {
    const articleElement = document.querySelector('.theme-doc-markdown') ||
                           document.querySelector('article.markdown') ||
                           document.querySelector('article') ||
                           document.querySelector('.markdown') as HTMLElement;

    if (!articleElement) {
      setErrorMessage('Could not find article content');
      setProgressStage('error');
      setTimeout(() => {
        setErrorMessage(null);
        setProgressStage('idle');
      }, 3000);
      return;
    }

    setIsExporting(true);
    setShowSuccess(false);
    setErrorMessage(null);
    setProgressPercent(0);

    try {
      updateProgress('preparing', 20);
      
      // Get styles
      const computedStyles = window.getComputedStyle(articleElement);
      const backgroundColor = computedStyles.backgroundColor || 
                             window.getComputedStyle(document.body).backgroundColor ||
                             '#ffffff';
      const bgColorHex = rgbToHex(backgroundColor);
      const theme = document.documentElement.getAttribute('data-theme') || 'light';

      // Get title
      const titleElement = articleElement.querySelector('h1');
      const title = titleElement?.textContent || 
                   document.title.replace(' | NXGEN Documentation', '') ||
                   'document';

      updateProgress('capturing', 40);

      // Wait for images to load
      const images = articleElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 3000);
        });
      }));

      // Capture with optimal settings
      const canvas = await html2canvas(articleElement, {
        scale: 2, // Good balance of quality and performance
        useCORS: true,
        logging: false,
        backgroundColor: bgColorHex,
        allowTaint: true,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Remove unwanted elements
          const clonedArticle = clonedDoc.querySelector('.theme-doc-markdown, article.markdown, article, .markdown');
          if (clonedArticle) {
            clonedArticle.querySelectorAll(
              '.pagination-nav, .theme-doc-footer, .theme-doc-breadcrumbs, nav, .tocCollapsible, button, [data-pdf-export-injected], .pdfButtonWrapper, .pdfButtonContainer'
            ).forEach(el => el.remove());
          }
          if (theme) {
            clonedDoc.documentElement.setAttribute('data-theme', theme);
          }
        }
      });

      updateProgress('generating', 60);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Content could not be captured. Please try again.');
      }

      // PDF settings
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgAspectRatio = imgWidth / imgHeight;
      const pdfContentHeight = contentWidth / imgAspectRatio;
      const pageContentHeight = pdfHeight - (margin * 2);
      const totalPages = Math.ceil(pdfContentHeight / pageContentHeight);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add metadata
      pdf.setProperties({
        title: title,
        author: 'NXGEN Documentation',
        creator: 'NXGEN GCXONE',
      });

      // Add image to PDF - split across pages if needed
      const imgData = canvas.toDataURL('image/png', 0.92);
      
      if (totalPages === 1) {
        // Single page - simple case
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, pdfContentHeight, undefined, 'FAST');
      } else {
        // Multiple pages - split the image
        let sourceY = 0;
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          const pageProgress = 60 + (page / totalPages) * 35;
          updateProgress('generating', Math.min(pageProgress, 95));

          const remainingHeight = pdfContentHeight - (page * pageContentHeight);
          const pageHeight = Math.min(pageContentHeight, remainingHeight);
          const sourceHeight = (pageHeight / pdfContentHeight) * imgHeight;
          
          if (sourceHeight > 0 && sourceY < imgHeight) {
            // Create canvas slice for this page
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = imgWidth;
            pageCanvas.height = Math.ceil(Math.min(sourceHeight, imgHeight - sourceY));
            const pageCtx = pageCanvas.getContext('2d');
            
            if (pageCtx) {
              pageCtx.drawImage(
                canvas,
                0, sourceY, imgWidth, sourceHeight,
                0, 0, imgWidth, sourceHeight
              );
              
              const pageImgData = pageCanvas.toDataURL('image/png', 0.92);
              pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, pageHeight, undefined, 'FAST');
              
              sourceY += sourceHeight;
            }
          }
        }
      }
      
      updateProgress('complete', 100);
      
      // Generate filename
      const sanitizedTitle = title
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .substring(0, 100);
      
      const filename = `${sanitizedTitle || 'document'}.pdf`;
      pdf.save(filename);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setProgressStage('idle');
        setProgressPercent(0);
      }, 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMsg);
      setProgressStage('error');
      console.error('PDF export failed:', error);
      
      setTimeout(() => {
        setErrorMessage(null);
        setProgressStage('idle');
        setProgressPercent(0);
      }, 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const getProgressText = () => {
    switch (progressStage) {
      case 'preparing':
        return 'Preparing...';
      case 'capturing':
        return 'Capturing...';
      case 'generating':
        return 'Generating...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error';
      default:
        return 'Download PDF';
    }
  };

  return (
    <div className={styles.pdfExportWrapper}>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`${styles.pdfButton} ${showSuccess ? styles.success : ''} ${errorMessage ? styles.error : ''}`}
        title="Download article as PDF"
        aria-label="Download PDF"
      >
        {showSuccess ? (
          <CheckCircle2 size={16} className={styles.pdfIcon} />
        ) : errorMessage ? (
          <AlertCircle size={16} className={styles.pdfIcon} />
        ) : (
          <Download size={16} className={styles.pdfIcon} />
        )}
        <span className={styles.pdfButtonText}>
          {isExporting ? getProgressText() : showSuccess ? 'Downloaded!' : errorMessage ? 'Failed' : 'Download PDF'}
        </span>
        {isExporting && progressPercent > 0 && (
          <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
        )}
      </button>
      {isExporting && (
        <div className={styles.pdfProgress}>
          <div 
            className={styles.pdfProgressBar}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
