import React, { createContext, useContext } from 'react';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ThemeToggle from '../components/ThemeToggle';

// ── Product context (hardcoded for GC Surge) ────────────────────────────────

interface ProductContextValue {
  productId: string;
  productName: string;
  productTagline: string;
  productDomain: string;
}

const ProductContext = createContext<ProductContextValue>({
  productId: 'gcsurge',
  productName: 'GC Surge',
  productTagline: 'Documentation for NXGEN GC Surge platform',
  productDomain: 'docs.gcsurge.com',
});

export function useProduct(): ProductContextValue {
  return useContext(ProductContext);
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ProductContext.Provider value={{
      productId: 'gcsurge',
      productName: 'GC Surge',
      productTagline: 'Documentation for NXGEN GC Surge platform',
      productDomain: 'docs.gcsurge.com',
    }}>
      <BackgroundPattern />
      <ScrollProgress />
      {children}
      <Footer />
      <ThemeToggle />
    </ProductContext.Provider>
  );
}
