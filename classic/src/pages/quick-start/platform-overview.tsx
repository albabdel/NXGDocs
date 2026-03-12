import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/quick-start/platform-overview';

export default function QuickStartPlatformOverviewRoute() {
  return <SanityLandingPageRoute slug="quick-start/platform-overview" fallback={LegacyPage} />;
}
