import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/getting-started';

export default function GettingStartedRoute() {
  return <SanityLandingPageRoute slug="getting-started" fallback={LegacyPage} />;
}
