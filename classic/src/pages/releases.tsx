import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/releases';

export default function ReleasesRoute() {
  return <SanityLandingPageRoute slug="releases" fallback={LegacyPage} />;
}
