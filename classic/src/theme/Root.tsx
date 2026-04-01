import React, { Suspense } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { ProductAccessProvider } from '../contexts/ProductAccessContext';

// Auth0 configuration - using existing application (same as support portal)
// Client ID: jqiJJISVmCmWWB46m0wMI7CO91KyliIm
// Domain: nxgen.eu.auth0.com
const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="memory"
    >
      <AdminAuthProvider>
        <ProductAccessProvider>
        <BackgroundPattern />
        <ScrollProgress />
        <div style={{
          position: 'fixed',
          top: '12px',
          right: '64px',
          zIndex: 1000,
        }}>
          <Suspense fallback={null}>
            <SearchModal />
          </Suspense>
        </div>
        {children}
        <Footer />
        <ThemeToggle />
        <VoCWidget />
      </ProductAccessProvider>
    </AdminAuthProvider>
    </Auth0Provider>
  );
}
