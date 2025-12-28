import React from 'react';
import { storyblokEditable, SbBlokData } from '@storyblok/react';
import { sanitizeHTML } from '../../lib/sanitize';
import type { Page as PageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface PageProps {
  blok: PageType;
}

const Page: React.FC<PageProps> = ({ blok }) => {
  // Sanitize body content to prevent XSS attacks
  const sanitizedBody = blok.body ? sanitizeHTML(blok.body) : '';

  return (
    <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
      {blok.title && <h1>{blok.title}</h1>}
      {sanitizedBody && (
        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />
      )}
    </div>
  );
};

export default Page;
