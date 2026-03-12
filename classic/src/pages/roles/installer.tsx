import React from 'react';
import SanityLandingPageRoute from '../../components/SanityLandingPageRoute';
import LegacyPage from '../../legacy-pages/roles/installer';

export default function RolesInstallerRoute() {
  return <SanityLandingPageRoute slug="roles/installer" fallback={LegacyPage} />;
}
