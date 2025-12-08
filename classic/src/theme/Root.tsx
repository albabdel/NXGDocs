import React from 'react';
import PDFExportButton from '../components/PDFExportButton';
import ScrollProgress from '../components/ScrollProgress';

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      {children}
      <PDFExportButton />
    </>
  );
}