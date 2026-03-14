import React from 'react';
import Layout from '@theme/Layout';
import {
  DocsHero,
  QuickLinksSection,
  CategoriesGrid,
  LandingPagesSection,
  ResourcesSection,
  ReturnHomeBanner,
} from '../components/DocsIndex';
import releasesData from '../data/sanity-releases.generated.json';
import roadmapData from '../data/sanity-roadmap.generated.json';
import landingPagesData from '../data/sanity-landing-pages.generated.json';
import styles from './docs-index.module.css';

type Release = {
  _id: string;
  displayTitle: string;
  sprintId?: string;
  slug: { current: string };
  publishedAt: string;
  summary?: string;
  items: Array<{ _key: string; title: string }>;
};

type RoadmapItem = {
  _id: string;
  title: string;
  status: 'Planned' | 'In Progress' | 'Shipped';
  projectedRelease: string;
  description: string;
  changeType: string;
};

type LandingPage = {
  title: string;
  description: string;
  slug: { current: string };
  lastUpdated: string;
  status: string;
  hero?: {
    badge?: { icon: string; text: string };
    headline: string;
    subheadline?: string;
  };
  layoutType?: string;
};

export default function DocsIndexPage(): React.JSX.Element {
  const handleSearchOpen = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      code: 'KeyK',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  const releases = releasesData as Release[];
  const roadmapItems = roadmapData as RoadmapItem[];
  const landingPages = landingPagesData as LandingPage[];

  const totalArticles = 153;
  const totalCategories = 12;
  const lastUpdated = landingPages[0]?.lastUpdated || new Date().toISOString().split('T')[0];

  return (
    <Layout
      title="Documentation Center | NXGEN GCXONE"
      description="Complete technical documentation for NXGEN GCXONE platform. Guides, API references, integrations, and troubleshooting resources."
    >
      <main className={styles.main}>
        <DocsHero
          onOpenSearch={handleSearchOpen}
          lastUpdated={lastUpdated}
          totalArticles={totalArticles}
          totalCategories={totalCategories}
        />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <ReturnHomeBanner />
          <QuickLinksSection />
          <CategoriesGrid />
          <LandingPagesSection landingPages={landingPages} />
          <ResourcesSection
            releaseCount={releases.length}
            roadmapCount={roadmapItems.filter(i => i.status !== 'Shipped').length}
          />

          <div className={styles.footerCta}>
            <div className={styles.footerCtaContent}>
              <h3 className={styles.footerCtaTitle}>Can't find what you're looking for?</h3>
              <p className={styles.footerCtaText}>
                Our support team is here to help. Submit a ticket or browse our community forums.
              </p>
              <div className={styles.footerCtaButtons}>
                <a
                  href="/contact"
                  className={styles.footerCtaPrimary}
                >
                  Contact Support
                </a>
                <a
                  href="/docs/knowledge-base/faq"
                  className={styles.footerCtaSecondary}
                >
                  Browse FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
