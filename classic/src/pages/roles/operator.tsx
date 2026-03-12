import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/roles/operator';

export default function RolesOperatorRoute() {
  return <SanityLandingPageRoute slug="roles/operator" fallback={LegacyPage} />;
}
