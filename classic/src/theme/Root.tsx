import React from 'react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import AlgoliaInsights from '../components/AlgoliaInsights';
// @ts-ignore
import SearchBar from '@theme/SearchBar';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AlgoliaInsights />
      <BackgroundPattern />
      <ScrollProgress />
      <div style={{
        position: 'fixed',
        top: '12px',
        right: '64px',
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
