import React, { useEffect, useRef } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import PageFeedback from '@site/src/components/PageFeedback';
import ShareSection from '@site/src/components/ShareSection';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const shareSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject ShareSection inside TOC container, above "ON THIS PAGE", on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 997) {
      const tocContainer = document.querySelector('.theme-doc-toc-desktop');
      const shareSection = shareSectionRef.current;

      if (tocContainer && shareSection && shareSection.parentNode !== tocContainer) {
        // Place inside TOC container so it benefits from padding-top clearance,
        // positioned before .table-of-contents so it sits right above "ON THIS PAGE"
        const tocList = tocContainer.querySelector('.table-of-contents');
        if (tocList) {
          tocContainer.insertBefore(shareSection, tocList);
        } else {
          tocContainer.prepend(shareSection);
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
      <PageFeedback />
    </div>
  );
}
