import React from 'react';
import LandingPageRenderer from './LandingPageRenderer';
import landingPages from '../data/sanity-landing-pages.generated.json';

type LandingPageDoc = {
  title?: string;
  slug?: { current?: string };
  status?: string;
};

type Props = {
  slug: string;
  fallback: React.ComponentType;
};

function normalizeSlug(slug: string): string {
  return String(slug || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

export default function SanityLandingPageRoute({ slug, fallback: Fallback }: Props) {
  const normalized = normalizeSlug(slug);
  const pageList = Array.isArray(landingPages) ? (landingPages as LandingPageDoc[]) : [];

  const pageData = pageList.find(
    (page) => normalizeSlug(page?.slug?.current || '') === normalized
  );

  if (!pageData) {
    return <Fallback />;
  }

  return <LandingPageRenderer pageData={pageData as any} />;
}
