import React, { useState, useMemo, useCallback } from 'react';
import { Image, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../../lib/cloudinary';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from '@cloudinary/url-gen/qualifiers/focusOn';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';
import { highlightMatches, type HighlightPart } from '../utils/highlightMatches';
import styles from './ImageResult.module.css';

interface ImageResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

type ImageLoadState = 'loading' | 'loaded' | 'error';

function HighlightedText({ parts, className }: { parts: HighlightPart[]; className?: string }) {
  return (
    <span className={className}>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <mark key={i} className={styles.highlight}>{part.match}</mark>
        )
      )}
    </span>
  );
}

function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('cloudinary.com')) {
      const pathParts = urlObj.pathname.split('/');
      const uploadIndex = pathParts.findIndex(p => p === 'upload');
      if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
        let publicId = pathParts.slice(uploadIndex + 1).join('/');
        const lastDot = publicId.lastIndexOf('.');
        if (lastDot !== -1) {
          publicId = publicId.substring(0, lastDot);
        }
        const versionMatch = publicId.match(/^v\d+\//);
        if (versionMatch) {
          publicId = publicId.substring(versionMatch[0].length);
        }
        return publicId;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function ImageResult({ result, query, isHighlighted, onSelect }: ImageResultProps) {
  const [imageState, setImageState] = useState<ImageLoadState>('loading');
  
  const altParts = useMemo(() => 
    result.alt ? highlightMatches(result.alt, query) : null,
    [result.alt, query]
  );
  
  const captionParts = useMemo(() => 
    result.caption ? highlightMatches(result.caption, query) : null,
    [result.caption, query]
  );
  
  const excerptParts = useMemo(() => 
    result.excerpt ? highlightMatches(result.excerpt, query) : null,
    [result.excerpt, query]
  );

  const cldImage = useMemo(() => {
    const imageUrl = result.thumbnailUrl || result.fullImageUrl;
    if (!imageUrl) return null;
    
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      return cld
        .image(publicId)
        .format('auto')
        .quality('auto')
        .resize(
          thumbnail()
            .width(160)
            .height(120)
            .gravity(autoGravity())
        )
        .roundCorners(byRadius(6));
    }
    return null;
  }, [result.thumbnailUrl, result.fullImageUrl]);

  const handleImageLoad = useCallback(() => {
    setImageState('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    setImageState('error');
  }, []);

  const fallbackUrl = result.thumbnailUrl || result.fullImageUrl;

  return (
    <a
      href={result.url}
      className={`${styles.imageResult} ${isHighlighted ? styles.active : ''}`}
      onClick={onSelect}
      role="option"
      aria-selected={isHighlighted}
    >
      <div className={styles.thumbnail}>
        {cldImage ? (
          <div className={styles.thumbnailWrapper}>
            <AdvancedImage
              cldImg={cldImage}
              alt={result.alt || 'Documentation image'}
              className={`${styles.thumbnailImg} ${imageState === 'loaded' ? styles.loaded : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {imageState === 'loading' && (
              <div className={styles.thumbnailOverlay}>
                <Loader2 size={20} className={styles.spinner} />
              </div>
            )}
            {imageState === 'error' && (
              <div className={styles.thumbnailOverlay}>
                <AlertCircle size={20} />
              </div>
            )}
          </div>
        ) : fallbackUrl ? (
          <img
            src={fallbackUrl}
            alt={result.alt || 'Documentation image'}
            loading="lazy"
            className={styles.thumbnailImg}
          />
        ) : (
          <div className={styles.placeholder}>
            <Image size={24} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        {result.alt && altParts && (
          <div className={styles.alt}>
            <HighlightedText parts={altParts} />
          </div>
        )}

        {result.caption && captionParts && (
          <div className={styles.caption}>
            <HighlightedText parts={captionParts} />
          </div>
        )}

        {result.excerpt && excerptParts && !result.caption && (
          <div className={styles.excerpt}>
            <HighlightedText parts={excerptParts} />
          </div>
        )}

        <div className={styles.source}>
          <span className={styles.sourceTitle}>{result.section}</span>
          <ExternalLink size={12} />
        </div>
      </div>

      <div className={styles.hoverIndicator}>
        <ExternalLink size={14} />
      </div>
    </a>
  );
}

export default ImageResult;
