import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/internal-releases/sprint-2026-01-a';

export default function InternalReleasesSprint202601ARoute() {
  return <SanityLandingPageRoute slug="internal-releases/sprint-2026-01-a" fallback={LegacyPage} />;
}
