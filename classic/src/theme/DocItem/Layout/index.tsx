import React, { useEffect, useRef } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type {WrapperProps} from '@docusaurus/types';
import PageFeedback from '@site/src/components/PageFeedback';
import ShareSection from '@site/src/components/ShareSection';

type Props = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: Props): JSX.Element {
  const shareSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject ShareSection right before TOC on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 997) {
      const tocContainer = document.querySelector('.theme-doc-toc-desktop');
      const shareSection = shareSectionRef.current;
      
      if (tocContainer && shareSection && shareSection.parentNode !== tocContainer.parentNode) {
        // Move ShareSection to be a sibling right before TOC
        tocContainer.parentNode?.insertBefore(shareSection, tocContainer);
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
