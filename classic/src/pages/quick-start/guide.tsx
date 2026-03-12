import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/quick-start/guide';

export default function QuickStartGuideRoute() {
  return <SanityLandingPageRoute slug="quick-start/guide" fallback={LegacyPage} />;
}
