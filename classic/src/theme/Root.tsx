import React from 'react';
import ScrollIndicator from '../components/ScrollIndicator';
import FloatingSearch from '../components/FloatingSearch';

export default function Root({children}) {
  return (
    <>
      <ScrollIndicator />
      <FloatingSearch />
      {children}
    </>
  );
} 