import React from 'react';
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
  return (
    <>
      <AlgoliaInsights />
      <BackgroundPattern />
      <ScrollProgress />
      {/* Search bar — rendered outside hidden navbar so it's always accessible */}
      <div style={{
        position: 'fixed',
        top: '12px',
        right: '120px',
        zIndex: 1000,
      }}>
        <SearchBar />
      </div>
      {children}
      <Footer />
      <ThemeToggle />
      <VoCWidget />
    </>
  );
}