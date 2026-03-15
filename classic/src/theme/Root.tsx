import React, { Suspense } from 'react';
import ScrollProgress from '../components/ScrollProgress';
import VoCWidget from '../components/VoCWidget';
import ThemeToggle from '../components/ThemeToggle';
import BackgroundPattern from '../components/BackgroundPattern';
import Footer from '../components/Footer';
import SearchModal from '../components/SearchModal';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
