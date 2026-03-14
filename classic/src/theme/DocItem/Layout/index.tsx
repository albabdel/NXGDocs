import React, { useEffect, useRef } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import PageFeedback from '@site/src/components/PageFeedback';
import ShareSection from '@site/src/components/ShareSection';
import DownloadPDF from '@site/src/components/DownloadPDF';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const shareSectionRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 997) {
      const tocContainer = document.querySelector('.theme-doc-toc-desktop');
      const shareSection = shareSectionRef.current;
      const downloadSection = downloadRef.current;

      if (tocContainer) {
        if (shareSection && shareSection.parentNode !== tocContainer) {
          const tocList = tocContainer.querySelector('.table-of-contents');
          if (tocList) {
            tocContainer.insertBefore(shareSection, tocList);
          } else {
            tocContainer.prepend(shareSection);
          }
        }

        if (downloadSection && downloadSection.parentNode !== tocContainer) {
          tocContainer.appendChild(downloadSection);
        }
      }
    }
  }, []);

  return (
    <div className="custom-doc-item-wrapper">
      <Layout {...props} />
      <div ref={shareSectionRef} className="share-section-global">
        <ShareSection />
      </div>
      <div ref={downloadRef} className="download-pdf-global">
        <DownloadPDF />
      </div>
      <PageFeedback />
    </div>
  );
}
