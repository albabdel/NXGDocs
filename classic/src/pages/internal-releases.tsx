import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/internal-releases';

export default function InternalReleasesRoute() {
  return <SanityLandingPageRoute slug="internal-releases" fallback={LegacyPage} />;
}
