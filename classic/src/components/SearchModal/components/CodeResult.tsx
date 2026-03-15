import React, { useState, useCallback, useMemo } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { FileCode, Copy, Check, ExternalLink } from 'lucide-react';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';
import { highlightMatches, type HighlightPart } from '../utils/highlightMatches';
import styles from './CodeResult.module.css';

interface CodeResultProps {
  result: EnhancedSearchRecord;
  query: string;
  isHighlighted: boolean;
  onSelect: () => void;
}

const CONTEXT_LINES = 3;

function getLanguagePrismName(language: string | undefined): string {
  if (!language) return 'typescript';
  const normalized = language.toLowerCase();
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    shell: 'bash',
    yml: 'yaml',
    md: 'markdown',
  };
  return aliases[normalized] || normalized;
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

export function CodeResult({ result, query, isHighlighted, onSelect }: CodeResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (result.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result.code]);

  const { displayCode, startLine, matchLine } = useMemo(() => {
    if (!result.code) {
      return { displayCode: '', startLine: 1, matchLine: undefined };
    }

    const lines = result.code.split('\n');
    const baseLineNumber = result.lineNumber ?? 1;

    if (!query || query.trim() === '') {
      const maxLines = 15;
      const truncated = lines.slice(0, maxLines);
      return {
        displayCode: truncated.join('\n'),
        startLine: baseLineNumber,
        matchLine: undefined,
      };
    }

    const lowerQuery = query.toLowerCase();
    let matchIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lowerQuery)) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex === -1) {
      const maxLines = 15;
      const truncated = lines.slice(0, maxLines);
      return {
        displayCode: truncated.join('\n'),
        startLine: baseLineNumber,
        matchLine: undefined,
      };
    }

    const contextStart = Math.max(0, matchIndex - CONTEXT_LINES);
    const contextEnd = Math.min(lines.length, matchIndex + CONTEXT_LINES + 1);
    const contextLines = lines.slice(contextStart, contextEnd);

    return {
      displayCode: contextLines.join('\n'),
      startLine: baseLineNumber + contextStart,
      matchLine: baseLineNumber + matchIndex,
    };
  }, [result.code, result.lineNumber, query]);

  const prismLanguage = getLanguagePrismName(result.language);
  const titleParts = highlightMatches(result.title, query);
  const totalLines = displayCode.split('\n').length;

  return (
    <div
      className={`${styles.codeResult} ${isHighlighted ? styles.active : ''}`}
      onClick={onSelect}
      role="option"
      aria-selected={isHighlighted}
      tabIndex={-1}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FileCode size={14} className={styles.codeIcon} />
          <span className={styles.title}>
            <HighlightedText parts={titleParts} />
          </span>
        </div>

        <div className={styles.meta}>
          {result.language && (
            <span className={`${styles.badge} ${styles.languageBadge}`}>
              {result.language}
            </span>
          )}
          {result.filename && (
            <span className={styles.filename}>{result.filename}</span>
          )}
        </div>
      </div>

      <div className={styles.codePreview}>
        <div className={styles.codeBlockHeader}>
          {result.language && (
            <span className={styles.codeLanguageBadge}>{result.language}</span>
          )}
          <button
            className={styles.inlineCopyBtn}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            type="button"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <Highlight
          theme={themes.vsDark}
          code={displayCode}
          language={prismLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} ${styles.codePre}`} style={style}>
              {tokens.map((line, i) => {
                const lineNum = startLine + i;
                const isMatchLine = matchLine !== undefined && lineNum === matchLine;
                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className={`${styles.codeLine} ${isMatchLine ? styles.matchedLine : ''}`}
                  >
                    <span className={styles.lineNumber}>{lineNum}</span>
                    <span className={styles.lineContent}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>

        {totalLines > 15 && (
          <div className={styles.codeTruncated}>
            <span>...</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <a
          href={result.url}
          className={styles.sourceLink}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{result.section}</span>
          <ExternalLink size={12} />
        </a>

        <button
          className={styles.copyBtn}
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          type="button"
        >
          {copied ? (
            <>
              <Check size={12} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CodeResult;
