import React from 'react';
import { storyblokEditable, SbBlokData } from '@storyblok/react';
import type { Page as PageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface PageProps {
  blok: PageType;
}

const Page: React.FC<PageProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-page">
      {blok.title && <h1>{blok.title}</h1>}
      {blok.body && (
        <div className="page-content">
          {blok.body}
        </div>
      )}
    </div>
  );
};

export default Page;
