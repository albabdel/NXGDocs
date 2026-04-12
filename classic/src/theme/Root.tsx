import React, { Suspense, useEffect, createContext, useContext } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { PostHogProvider, usePostHog } from '@posthog/react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { ProductAccessProvider } from '../contexts/ProductAccessContext';
import { getProductConfig, PRODUCTS } from '../utils/productConfig';

declare const PRODUCT: string;
const productId = typeof process !== 'undefined' ? (process.env.PRODUCT || 'gcxone') : 'gcxone';
const productConfig = PRODUCTS[productId] || PRODUCTS.gcxone;

interface ProductContextValue {
  productId: string;
  productName: string;
  productTagline: string;
  productDomain: string;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function useProduct(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    return { 
      productId: 'gcxone', 
      productName: 'GCXONE',
      productTagline: 'Complete documentation for NXGEN GCXONE platform',
      productDomain: 'docs.gcxone.com'
    };
  }
  return context;
}

const AUTH0_DOMAIN = 'nxgen.eu.auth0.com';
const AUTH0_CLIENT_ID = 'jqiJJISVmCmWWB46m0wMI7CO91KyliIm';
const POSTHOG_TOKEN = 'phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS';

function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  const productConfig = getProductConfig();

  useEffect(() => {
    if (posthog && typeof window !== 'undefined') {
      posthog.group('product', productConfig.groupKey, {
        name: productConfig.name,
        id: productConfig.id,
      });
    }
  }, [posthog, productConfig]);

  useEffect(() => {
    if (posthog && typeof window !== 'undefined') {
      posthog.capture('$pageview', {
        product: productConfig.id,
      });
    }
  }, [posthog, productConfig]);

  return <>{children}</>;
}

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-gcxone');
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
      <ProductContext.Provider value={{ 
        productId, 
        productName: productConfig.name,
        productTagline: productConfig.tagline || '',
        productDomain: productConfig.domain || ''
      }}>
        <AdminAuthProvider>
          <ProductAccessProvider>
            <PostHogProvider
              apiKey={POSTHOG_TOKEN}
              options={{
                api_host: 'https://us.i.posthog.com',
                capture_pageview: false,
                capture_pageleave: true,
                persistence: 'localStorage',
              }}
            >
              <AnalyticsWrapper>
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
              </AnalyticsWrapper>
            </PostHogProvider>
          </ProductAccessProvider>
        </AdminAuthProvider>
      </ProductContext.Provider>
    </Auth0Provider>
  );
}
