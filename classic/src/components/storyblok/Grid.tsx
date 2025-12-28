import React from 'react';
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react';
import type { Grid as GridType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface GridProps {
  blok: GridType;
}

const Grid: React.FC<GridProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok as SbBlokData)} className="storyblok-grid">
      <div className="grid-columns">
        {blok.columns?.map((column) => (
          <StoryblokComponent blok={column as SbBlokData} key={column._uid} />
        ))}
      </div>
    </div>
  );
};

export default Grid;
