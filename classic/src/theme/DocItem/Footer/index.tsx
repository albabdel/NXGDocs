import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

type Props = WrapperProps<typeof FooterType>;

function PdfDownloadButton({ slug }: { slug: string }) {
  // PDF files are generated to /pdfs/{slug-with-slashes-as-dashes}.pdf
  const pdfSlug = slug.replace(/^\//, '').replace(/\//g, '--');
  const pdfUrl = `/pdfs/${pdfSlug}.pdf`;

  return (
    <div className={styles.pdfDownload}>
      <a
        href={pdfUrl}
        download
        className={styles.pdfButton}
        title="Download this page as PDF"
        aria-label="Download PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </a>
    </div>
  );
}

export default function FooterWrapper(props: Props): JSX.Element {
  const { metadata } = useDoc();
  const slug = metadata.slug || '';

  return (
    <>
      <Footer {...props} />
      {slug && <PdfDownloadButton slug={slug} />}
    </>
  );
}
