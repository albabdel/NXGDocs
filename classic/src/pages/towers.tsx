import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/towers';

export default function TowersRoute() {
  return <SanityLandingPageRoute slug="towers" fallback={LegacyPage} />;
}
