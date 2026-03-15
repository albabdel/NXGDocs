import { useState, useEffect, useMemo } from 'react';
import type { FuseResult } from 'fuse.js';
import { useVectorSearch, type VectorSearchResult } from './useVectorSearch';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';

export interface HybridSearchResult {
  record: EnhancedSearchRecord;
  vectorScore: number;
  keywordScore: number;
  combinedScore: number;
}

interface HybridSearchOptions {
  vectorWeight?: number;
  keywordWeight?: number;
  minVectorScore?: number;
  minKeywordScore?: number;
  enabled?: boolean;
}

interface UseHybridSearchReturn {
  results: HybridSearchResult[];
  vectorResults: VectorSearchResult[];
  keywordResults: FuseResult<EnhancedSearchRecord>[];
  isVectorLoading: boolean;
  isVectorAvailable: boolean;
  vectorError: string | null;
}

export function useHybridSearch(
  query: string,
  keywordResults: FuseResult<EnhancedSearchRecord>[],
  searchIndex: EnhancedSearchRecord[],
  options: HybridSearchOptions = {}
): UseHybridSearchReturn {
  const {
    vectorWeight = 0.6,
    keywordWeight = 0.4,
    minVectorScore = 0.25,
    minKeywordScore = 0.35,
    enabled = true,
  } = options;

  const [mergedResults, setMergedResults] = useState<HybridSearchResult[]>([]);

  const {
    results: vectorResults,
    isLoading: isVectorLoading,
    error: vectorError,
    isAvailable: isVectorAvailable,
  } = useVectorSearch(query, searchIndex, {
    enabled: enabled && query.trim().length > 0,
    minScore: minVectorScore,
    topK: 30,
    debounceMs: 150,
  });

  useEffect(() => {
    if (!enabled) {
      setMergedResults([]);
      return;
    }

    const scoreMap = new Map<string, HybridSearchResult>();

    for (const v of vectorResults) {
      if (v.score < minVectorScore) continue;

      scoreMap.set(v.id, {
        record: v.record,
        vectorScore: v.score,
        keywordScore: 0,
        combinedScore: v.score * vectorWeight,
      });
    }

    for (const k of keywordResults) {
      const keywordScore = 1 - (k.score ?? 0);
      if (keywordScore < minKeywordScore) continue;

      const existing = scoreMap.get(k.item.id);

      if (existing) {
        existing.keywordScore = keywordScore;
        existing.combinedScore =
          existing.vectorScore * vectorWeight + keywordScore * keywordWeight;
      } else {
        scoreMap.set(k.item.id, {
          record: k.item,
          vectorScore: 0,
          keywordScore,
          combinedScore: keywordScore * keywordWeight,
        });
      }
    }

    const sorted = Array.from(scoreMap.values()).sort(
      (a, b) => b.combinedScore - a.combinedScore
    );

    setMergedResults(sorted);
  }, [
    vectorResults,
    keywordResults,
    enabled,
    vectorWeight,
    keywordWeight,
    minVectorScore,
    minKeywordScore,
  ]);

  const filteredResults = useMemo(() => {
    if (mergedResults.length === 0 && keywordResults.length > 0) {
      return keywordResults
        .filter((k) => (1 - (k.score ?? 1)) >= minKeywordScore)
        .map((k) => ({
          record: k.item,
          vectorScore: 0,
          keywordScore: 1 - (k.score ?? 0),
          combinedScore: (1 - (k.score ?? 0)) * keywordWeight,
        }))
        .sort((a, b) => b.combinedScore - a.combinedScore);
    }
    return mergedResults;
  }, [mergedResults, keywordResults, minKeywordScore, keywordWeight]);

  return {
    results: filteredResults,
    vectorResults,
    keywordResults,
    isVectorLoading,
    isVectorAvailable,
    vectorError,
  };
}

export function useSemanticSearchEnabled(): boolean {
  const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env)
    ? (import.meta as any).env.VITE_GEMINI_API_KEY
    : null;

  return Boolean(apiKey);
}

export function getSearchModeInfo(isVectorAvailable: boolean): {
  mode: 'hybrid' | 'keyword';
  label: string;
  description: string;
} {
  if (isVectorAvailable) {
    return {
      mode: 'hybrid',
      label: 'AI Search',
      description: 'Semantic + Keyword search',
    };
  }
  return {
    mode: 'keyword',
    label: 'Search',
    description: 'Keyword search',
  };
}
