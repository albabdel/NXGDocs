import React from 'react';
import { useLocation } from '@docusaurus/router';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import AlgoliaInsights from '../components/AlgoliaInsights';
// @ts-ignore
import SearchBar from '@theme/SearchBar';

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <>
      <AlgoliaInsights />
      <BackgroundPattern />
      <ScrollProgress />
      {/* Search bar — rendered outside hidden navbar; hidden on home (hero has its own search) */}
      {pathname !== '/' && (
        <div style={{
          position: 'fixed',
          top: '12px',
          right: '64px',
          zIndex: 1000,
        }}>
          <SearchBar />
        </div>
      )}
      {children}
      <Footer />
      <ThemeToggle />
      <VoCWidget />
    </>
  );
}