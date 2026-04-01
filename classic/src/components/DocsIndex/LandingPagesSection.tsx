import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Clock } from 'lucide-react';

interface LandingPageItem {
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
}

interface LandingPagesSectionProps {
  landingPages: LandingPageItem[];
}

export default function LandingPagesSection({ landingPages }: LandingPagesSectionProps) {
  const publishedPages = landingPages.filter(page => page.status === 'published');
  const pageGroups: Record<string, LandingPageItem[]> = {};

  publishedPages.forEach(page => {
    const type = page.layoutType || 'standard';
    if (!pageGroups[type]) pageGroups[type] = [];
    pageGroups[type].push(page);
  });

  const formatLastUpdated = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getLayoutLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'standard': 'Feature Pages',
      'quick-start': 'Quick Start',
      'tower-guide': 'Tower Guides',
    };
    return labels[type] || 'Landing Pages';
  };

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="section-badge">
            Featured Pages
          </span>
          <h2
            className="text-2xl font-bold"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            All Landing Pages
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--ifm-color-content-secondary)' }}
          >
            Comprehensive guides and feature documentation
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(pageGroups).map(([type, pages], groupIndex) => (
          <div key={type}>
            <h3 className="text-sm font-semibold mb-3 text-muted-dark">
              {getLayoutLabel(type)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page, index) => (
                <motion.div
                  key={page.slug.current}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    to={`/${page.slug.current}`}
                    className="docs-index-card no-underline group h-full"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {page.hero?.badge && (
                          <span className="status-badge-updated" style={{ fontSize: '0.625rem' }}>
                            {page.hero.badge.text}
                          </span>
                        )}
                      </div>
                      <ExternalLink
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity"
                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                      />
                    </div>

                    <h4
                      className="font-semibold mb-1.5 group-hover:text-[#E8B058] transition-colors"
                      style={{ color: 'var(--ifm-color-content)' }}
                    >
                      {page.hero?.headline || page.title}
                    </h4>

                    <p
                      className="text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{ color: 'var(--ifm-color-content-secondary)' }}
                    >
                      {page.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-muted-light">
                        <Clock className="w-3 h-3" />
                        {formatLastUpdated(page.lastUpdated)}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-gold-link">
                        View
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
