import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/internal-releases/sprint-2025-12-b';

export default function InternalReleasesSprint202512BRoute() {
  return <SanityLandingPageRoute slug="internal-releases/sprint-2025-12-b" fallback={LegacyPage} />;
}
