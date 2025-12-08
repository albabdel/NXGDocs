import React from 'react';
import { useLocation } from '@docusaurus/router';
import PDFExport from '../PDFExport';
import styles from './styles.module.css';

export default function PDFExportButton(): JSX.Element {
  const location = useLocation();
  
  // Only show on docs article pages
  const isDocsArticlePage = location.pathname.startsWith('/docs/') && 
                            location.pathname !== '/docs';

  if (!isDocsArticlePage) {
    return null;
  }

  return (
    <div className={styles.pdfButtonWrapper}>
      <PDFExport />
    </div>
  );
}
