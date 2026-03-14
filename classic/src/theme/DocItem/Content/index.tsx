import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import DownloadPDF from '@site/src/components/DownloadPDF';

function useSyntheticTitle() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }: { children: React.ReactNode }): JSX.Element {
  const { metadata, frontMatter } = useDoc();
  const syntheticTitle = useSyntheticTitle();
  const showPdfButton = frontMatter.pdfDownload !== false;

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header className="doc-item-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Heading as="h1">{syntheticTitle}</Heading>
            {showPdfButton && (
              <DownloadPDF
                title={metadata.title}
                slug={metadata.slug}
              />
            )}
          </div>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
