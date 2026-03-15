import React from 'react';
import { Play, Video, Clock } from 'lucide-react';
import { highlightMatches } from '../utils/highlightMatches';
import styles from './VideoResult.module.css';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';

interface VideoResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoResult({ result, query, isHighlighted, onSelect }: VideoResultProps): React.ReactElement {
  const titleParts = highlightMatches(result.title, query);
  const transcript = result.excerpt || result.content?.slice(0, 200) || '';
  const transcriptParts = highlightMatches(transcript.slice(0, 200), query);
  const startTime = result.startTime || 0;
  const thumbnailUrl = result.thumbnailUrl || result.fullImageUrl;

  return (
    <a
      href={result.url}
      className={`${styles.container} ${isHighlighted ? styles.highlighted : ''}`}
      onClick={onSelect}
      tabIndex={-1}
    >
      <div className={styles.thumbnailWrapper}>
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={result.title}
            className={styles.thumbnail}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Video size={24} />
          </div>
        )}
        <div className={styles.playOverlay}>
          <Play size={20} fill="currentColor" />
        </div>
        {startTime > 0 && (
          <span className={styles.timestamp}>{formatTimestamp(startTime)}</span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Video size={12} className={styles.typeIcon} />
          <span className={styles.typeLabel}>Video</span>
        </div>
        
        <h4 className={styles.title}>
          {titleParts.map((part, i) =>
            typeof part === 'string' ? (
              <span key={i}>{part}</span>
            ) : (
              <mark key={i} className={styles.highlight}>{part.match}</mark>
            )
          )}
        </h4>

        {transcript && (
          <p className={styles.transcript}>
            {transcriptParts.map((part, i) =>
              typeof part === 'string' ? (
                <span key={i}>{part}</span>
              ) : (
                <mark key={i} className={styles.highlight}>{part.match}</mark>
              )
            )}
            {transcript.length > 200 && <span>...</span>}
          </p>
        )}

        <div className={styles.meta}>
          <Clock size={10} />
          <span>Video transcript</span>
        </div>
      </div>
    </a>
  );
}
