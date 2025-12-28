import React from 'react';
import { storyblokEditable, renderRichText, SbBlokData } from '@storyblok/react';
import type { DocPage as DocPageType } from '../../../.storyblok/types/289434723537263/storyblok-components';

interface DocPageProps {
  blok: DocPageType;
}

const DocPage: React.FC<DocPageProps> = ({ blok }) => {
  // Render rich text content
  const renderedBody = blok.body ? renderRichText(blok.body as any) : '';

  return (
    <article {...storyblokEditable(blok as SbBlokData)} className="storyblok-doc-page">
      {blok.title && <h1 className="doc-title">{blok.title}</h1>}

      {blok.description && (
        <p className="doc-description">{blok.description}</p>
      )}

      {renderedBody && (
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: renderedBody }}
        />
      )}
    </article>
  );
};

export default DocPage;
