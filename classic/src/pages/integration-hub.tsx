import React from 'react';
import SanityLandingPageRoute from '../components/SanityLandingPageRoute';
import LegacyPage from '../legacy-pages/integration-hub';

export default function IntegrationHubRoute() {
  return <SanityLandingPageRoute slug="integration-hub" fallback={LegacyPage} />;
}
