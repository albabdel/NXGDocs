import React from 'react';
import { AlertTriangle, AlertCircle, Info, Wrench, ExternalLink } from 'lucide-react';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';
import { highlightMatches, type HighlightPart } from '../utils/highlightMatches';
import styles from './ErrorResult.module.css';

interface ErrorResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

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

function getSeverityIcon(severity?: string) {
  switch (severity) {
    case 'critical':
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
}

function getSeverityClass(severity?: string): string {
  switch (severity) {
    case 'critical':
    case 'error':
      return styles.severityError;
    case 'warning':
      return styles.severityWarning;
    case 'info':
    default:
      return styles.severityInfo;
  }
}

export function ErrorResult({ result, query, isHighlighted, onSelect }: ErrorResultProps) {
  const SeverityIcon = getSeverityIcon(result.severity);
  const severityClass = getSeverityClass(result.severity);
  
  const titleParts = highlightMatches(result.title, query);
  const messageParts = result.excerpt ? highlightMatches(result.excerpt, query) : null;

  return (
    <a
      href={result.url}
      className={`${styles.errorResult} ${isHighlighted ? styles.active : ''}`}
      onClick={onSelect}
      role="option"
      aria-selected={isHighlighted}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <SeverityIcon size={14} className={`${styles.severityIcon} ${severityClass}`} />
          <span className={styles.title}>
            <HighlightedText parts={titleParts} />
          </span>
        </div>
        
        {result.errorCode && (
          <span className={`${styles.errorCode} ${severityClass}`}>
            {result.errorCode}
          </span>
        )}
      </div>
      
      {messageParts && (
        <div className={styles.message}>
          <HighlightedText parts={messageParts} />
        </div>
      )}
      
      {result.errorPattern && (
        <div className={styles.pattern}>
          <code>{result.errorPattern}</code>
        </div>
      )}
      
      <div className={styles.footer}>
        <div className={styles.solutionHint}>
          <Wrench size={12} className={styles.wrenchIcon} />
          <span>View solution</span>
        </div>
        
        <div className={styles.source}>
          <span className={styles.sourceSection}>{result.section}</span>
          <ExternalLink size={12} />
        </div>
      </div>
    </a>
  );
}

export default ErrorResult;
