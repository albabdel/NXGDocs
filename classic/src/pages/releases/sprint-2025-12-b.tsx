import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/releases/sprint-2025-12-b';

export default function ReleasesSprint202512BRoute() {
  return <SanityLandingPageRoute slug="releases/sprint-2025-12-b" fallback={LegacyPage} />;
}
