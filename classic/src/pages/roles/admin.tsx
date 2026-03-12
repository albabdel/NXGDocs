import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/roles/admin';

export default function RolesAdminRoute() {
  return <SanityLandingPageRoute slug="roles/admin" fallback={LegacyPage} />;
}
