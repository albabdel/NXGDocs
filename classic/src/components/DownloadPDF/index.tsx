import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Download, FileX, HardDriveDownload } from 'lucide-react';
import styles from './styles.module.css';

interface DownloadPDFProps {
  slug?: string;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function DownloadPDFInner({ slug: propSlug, className }: DownloadPDFProps) {
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const derivedSlug = propSlug || window.location.pathname.split('/').filter(Boolean).pop() || 'document';
    setSlug(derivedSlug);

    const pdfPath = `/pdfs/${derivedSlug}.pdf`;

    fetch(pdfPath, { method: 'HEAD' })
      .then((response) => {
        setPdfExists(response.ok);
        if (response.ok) {
          const contentLength = response.headers.get('Content-Length');
          if (contentLength) {
            setFileSize(parseInt(contentLength, 10));
          }
        }
      })
      .catch(() => {
        setPdfExists(false);
      });
  }, [propSlug]);

  if (pdfExists === null) {
    return (
      <div className={`${styles.downloadPDF} ${className || ''}`}>
        <div className={styles.loadingFallback}>Checking PDF...</div>
      </div>
    );
  }

  if (!pdfExists) {
    return (
      <div className={`${styles.downloadPDF} ${className || ''}`}>
        <div className={`${styles.downloadButton} ${styles.unavailable}`}>
          <FileX size={18} />
          <span>PDF not available</span>
        </div>
        <div className={styles.unavailableMessage}>
          PDF not yet generated for this page
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.downloadPDF} ${className || ''}`}>
      <a
        href={`/pdfs/${slug}.pdf`}
        download
        className={styles.downloadButton}
        aria-label="Download page as PDF"
      >
        <Download size={18} />
        <span>Download PDF</span>
        {fileSize && <span className={styles.fileSize}>({formatBytes(fileSize)})</span>}
      </a>
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
