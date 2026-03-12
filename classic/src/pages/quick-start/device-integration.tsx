import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/quick-start/device-integration';

export default function QuickStartDeviceIntegrationRoute() {
  return <SanityLandingPageRoute slug="quick-start/device-integration" fallback={LegacyPage} />;
}
