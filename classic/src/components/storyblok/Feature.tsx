import React from 'react';
import { storyblokEditable, SbBlokData } from '@storyblok/react';
import type { Feature as FeatureType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface FeatureProps {
  blok: FeatureType;
}

const Feature: React.FC<FeatureProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-feature">
      {blok.name && <h3>{blok.name}</h3>}
    </div>
  );
};

export default Feature;
