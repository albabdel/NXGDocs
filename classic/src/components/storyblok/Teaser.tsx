import React from 'react';
import { storyblokEditable, SbBlokData } from '@storyblok/react';
import type { Teaser as TeaserType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface TeaserProps {
  blok: TeaserType;
}

const Teaser: React.FC<TeaserProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-teaser">
      {blok.headline && <h2>{blok.headline}</h2>}
    </div>
  );
};

export default Teaser;
