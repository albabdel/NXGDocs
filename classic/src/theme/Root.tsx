import React from 'react';
import ScrollIndicator from '../components/ScrollIndicator';
import FloatingSearch from '../components/FloatingSearch';
import FloatingDarkModeToggle from '../components/FloatingDarkModeToggle';

export default function Root({children}) {
  return (
    <>
      <ScrollIndicator />
      <FloatingDarkModeToggle />
      {children}
    </>
  );
} 