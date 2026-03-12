import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/roles/manager';

export default function RolesManagerRoute() {
  return <SanityLandingPageRoute slug="roles/manager" fallback={LegacyPage} />;
}
