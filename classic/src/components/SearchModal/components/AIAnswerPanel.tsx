import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Copy, Check, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './AIAnswerPanel.module.css';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';

interface AIAnswerPanelProps {
  query: string;
  results: EnhancedSearchRecord[];
  isVisible: boolean;
  onClose?: () => void;
  onInteraction?: () => void;
}

interface SourceReference {
  id: string;
  title: string;
  url: string;
  number: number;
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (!genAI) {
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env)
      ? (import.meta as any).env.VITE_GEMINI_API_KEY
      : null;
    
    if (!apiKey) {
      return null;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function assembleContext(results: EnhancedSearchRecord[], maxResults: number = 3): string {
  return results
    .slice(0, maxResults)
    .map((r, i) => `[${i + 1}] ${r.title}\n${(r.content || r.excerpt || '').slice(0, 800)}`)
    .join('\n\n---\n\n');
}

function buildPrompt(query: string, context: string): string {
  return `You are a helpful documentation assistant for NXGEN platform. Based on the following documentation content, answer the user's question concisely and accurately.

Context Documents:
${context}

User Question: ${query}

Instructions:
1. Provide a direct, helpful answer in 2-4 sentences
2. Include a relevant code example if applicable (use markdown code blocks)
3. Always cite sources using [1], [2], [3] notation when referencing specific information
4. Keep the answer under 300 words
5. If the context doesn't contain relevant information, say "I couldn't find specific information about that in the documentation."

Answer:`;
}

function parseCitations(answer: string, sources: SourceReference[]): React.ReactNode {
  const parts = answer.split(/(\[\d+\])/g);
  
  const elements = parts.map((part, index) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const num = parseInt(match[1]);
      const source = sources.find(s => s.number === num);
      if (source) {
        return (
          <a
            key={index}
            href={source.url}
            className={styles.citation}
            target="_blank"
            rel="noopener noreferrer"
            title={source.title}
            onClick={onInteraction}
          >
            [{num}]
          </a>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });

  return elements;
}

function renderMarkdown(text: string): React.ReactNode {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;

  text.replace(codeBlockRegex, (match, lang, code, offset) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }
    parts.push(
      <pre key={keyIndex++} className={styles.codeBlock}>
        {lang && <span className={styles.codeLang}>{lang}</span>}
        <code>{code.trim()}</code>
      </pre>
    );
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    remaining.split(inlineCodeRegex).forEach((part, i) => {
      if (i % 2 === 0) {
        parts.push(part);
      } else {
        parts.push(<code key={keyIndex++} className={styles.inlineCode}>{part}</code>);
      }
    });
  }

  return parts;
}

export function AIAnswerPanel({ query, results, isVisible, onInteraction }: AIAnswerPanelProps): React.ReactElement | null {
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [sources, setSources] = useState<SourceReference[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateAnswer = useCallback(async (searchQuery: string, searchResults: EnhancedSearchRecord[]) => {
    const ai = getGenAI();
    if (!ai) {
      setError('AI features not configured. Add VITE_GEMINI_API_KEY to environment.');
      return;
    }

    if (searchResults.length === 0) {
      setError('No results found to generate answer from.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);

    const sourceRefs: SourceReference[] = searchResults.slice(0, 3).map((r, i) => ({
      id: r.id,
      title: r.title,
      url: r.url,
      number: i + 1,
    }));
    setSources(sourceRefs);

    const context = assembleContext(searchResults);
    const prompt = buildPrompt(searchQuery, context);

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      setAnswer(responseText);
    } catch (err) {
      console.error('Failed to generate AI answer:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate answer');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !query.trim() || results.length === 0) {
      setAnswer('');
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      generateAnswer(query, results);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, results, isVisible, generateAnswer]);

  const handleCopy = useCallback(async () => {
    if (!answer) return;
    
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [answer]);

  if (!isVisible) {
    return null;
  }

  const renderedAnswer = answer ? parseCitations(answer, sources) : null;

  return (
    <div className={styles.panel}>
      <button
        className={styles.header}
        onClick={() => { setIsExpanded(!isExpanded); onInteraction?.(); }}
        aria-expanded={isExpanded}
      >
        <div className={styles.headerLeft}>
          <Sparkles size={14} className={styles.sparkleIcon} />
          <span className={styles.headerTitle}>AI Answer</span>
          {isLoading && <span className={styles.loadingDot} />}
        </div>
        <div className={styles.headerRight}>
          {answer && !isLoading && (
            <button
              className={styles.copyBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              title="Copy answer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          )}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              <span>Generating answer...</span>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {answer && !isLoading && !error && (
            <>
              <div className={styles.answer}>
                {renderedAnswer}
              </div>

              {sources.length > 0 && (
                <div className={styles.sources}>
                  <span className={styles.sourcesLabel}>Sources:</span>
                  <div className={styles.sourcesList}>
                    {sources.map((source) => (
                      <a
                        key={source.id}
                        href={source.url}
                        className={styles.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onInteraction}
                      >
                        <span className={styles.sourceNumber}>[{source.number}]</span>
                        <span className={styles.sourceTitle}>{source.title}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!answer && !isLoading && !error && results.length === 0 && (
            <div className={styles.empty}>
              <span>Search for something to get an AI-generated answer.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAnswerPanel;
