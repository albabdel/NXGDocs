import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/docs/breakthroughs';

export default function DocsBreakthroughsRoute() {
  return <SanityLandingPageRoute slug="docs/breakthroughs" fallback={LegacyPage} />;
}
