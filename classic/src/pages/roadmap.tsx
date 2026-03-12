import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/roadmap';

export default function RoadmapRoute() {
  return <SanityLandingPageRoute slug="roadmap" fallback={LegacyPage} />;
}
