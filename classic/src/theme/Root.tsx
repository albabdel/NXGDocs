import React, { Suspense, useEffect, createContext, useContext } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { ProductAccessProvider } from '../contexts/ProductAccessContext';

declare const PRODUCT: string;
const productId = typeof process !== 'undefined' ? (process.env.PRODUCT || 'gcxone') : 'gcxone';

interface ProductContextValue {
  productId: string;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function useProduct(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    return { productId: 'gcxone' };
  }
  return context;
}

const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-gcxone', 'theme-gcsurge');
      document.documentElement.classList.add('theme-' + productId);
      console.log('[Product Theme] Applied theme-' + productId);
    }
  }, []);

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="memory"
    >
      <ProductContext.Provider value={{ productId }}>
        <AdminAuthProvider>
          <ProductAccessProvider>
            <BackgroundPattern />
            <ScrollProgress />
            <div style={{ position: 'fixed', top: '12px', right: '64px', zIndex: 1000 }}>
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
      </ProductContext.Provider>
    </Auth0Provider>
  );
}
