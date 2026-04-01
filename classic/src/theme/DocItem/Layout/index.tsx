import React, { useEffect, useRef } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import PageFeedback from '@site/src/components/PageFeedback';
import ShareSection from '@site/src/components/ShareSection';
import DownloadPDF from '@site/src/components/DownloadPDF';
import { ReadingProgressBar, MarkAsRead } from '@site/src/components/ReadingProgress';
import { useTrackDocView } from '@site/src/hooks/usePostHog';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const shareSectionRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const markAsReadRef = useRef<HTMLDivElement>(null);
  const trackDocView = useTrackDocView();

  // Extract doc metadata for reading progress
  const docMeta = (props as { children?: { props?: { content?: { metadata?: { slug?: string; title?: string; frontMatter?: { category?: string } } } } } })?.children?.props?.content?.metadata;
  const docSlug = docMeta?.slug || '';
  const docTitle = docMeta?.title || '';
  const docUrl = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 997) {
      const tocContainer = document.querySelector('.theme-doc-toc-desktop');
      const shareSection = shareSectionRef.current;
      const downloadSection = downloadRef.current;
      const markAsReadSection = markAsReadRef.current;

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

        // Add Mark as Read to TOC container
        if (markAsReadSection && markAsReadSection.parentNode !== tocContainer) {
          tocContainer.appendChild(markAsReadSection);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (docMeta) {
      trackDocView(
        docMeta.slug || window.location.pathname,
        docMeta.title || document.title,
        window.location.pathname,
        docMeta.frontMatter?.category
      );
    }
  }, [trackDocView, props]);

  return (
    <div className="custom-doc-item-wrapper">
      {/* Reading Progress Bar at top of page */}
      {docSlug && (
        <ReadingProgressBar slug={docSlug} showIndicator />
      )}
      
      <Layout {...props} />
      
      <div ref={shareSectionRef} className="share-section-global">
        <ShareSection />
      </div>
      <div ref={downloadRef} className="download-pdf-global">
        <DownloadPDF />
      </div>
      
      {/* Mark as Read button (shown in TOC on desktop, inline on mobile) */}
      {docSlug && (
        <div ref={markAsReadRef} className="mark-as-read-toc-wrapper">
          <MarkAsRead
            slug={docSlug}
            title={docTitle}
            url={docUrl}
            showCelebration
          />
        </div>
      )}
      
      <PageFeedback />
    </div>
  );
}
