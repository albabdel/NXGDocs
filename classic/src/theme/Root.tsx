import React from 'react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import AlgoliaInsights from '../components/AlgoliaInsights';

// Default implementation, that you can customize
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AlgoliaInsights />
      <BackgroundPattern />
      <ScrollProgress />
      {children}
      <Footer />
      <ThemeToggle />
      <VoCWidget />
    </>
  );
}