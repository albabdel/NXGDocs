import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadEmbeddingsIndex,
  getQueryEmbedding,
  findSimilarRecords,
  type EmbeddingsIndex,
} from '../../../lib/embeddings';
import type { EnhancedSearchRecord } from '../types/EnhancedSearchRecord';

export interface VectorSearchResult {
  id: string;
  score: number;
  record: EnhancedSearchRecord;
}

interface UseVectorSearchOptions {
  enabled?: boolean;
  minScore?: number;
  topK?: number;
  debounceMs?: number;
}

interface UseVectorSearchReturn {
  results: VectorSearchResult[];
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;
  search: (query: string) => Promise<void>;
}

export function useVectorSearch(
  query: string,
  searchIndex: EnhancedSearchRecord[],
  options: UseVectorSearchOptions = {}
): UseVectorSearchReturn {
  const {
    enabled = true,
    minScore = 0.3,
    topK = 20,
    debounceMs = 200,
  } = options;

  const [results, setResults] = useState<VectorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [embeddingsIndex, setEmbeddingsIndex] = useState<EmbeddingsIndex | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    loadEmbeddingsIndex()
      .then((index) => {
        if (index && index.records.length > 0) {
          setEmbeddingsIndex(index);
          setIsAvailable(true);
          setError(null);
        } else {
          setIsAvailable(false);
          setError('Embeddings index not available');
        }
      })
      .catch((err) => {
        setIsAvailable(false);
        setError(err.message);
      });
  }, [enabled]);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!embeddingsIndex || !searchIndex.length) {
        setResults([]);
        return;
      }

      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const queryEmbedding = await getQueryEmbedding(trimmedQuery);
        
        if (!queryEmbedding) {
          setResults([]);
          setError('Failed to generate query embedding');
          return;
        }

        const similarIds = findSimilarRecords(queryEmbedding, embeddingsIndex, topK, minScore);
        
        const recordMap = new Map<string, EnhancedSearchRecord>();
        for (const record of searchIndex) {
          recordMap.set(record.id, record);
        }

        const vectorResults: VectorSearchResult[] = similarIds
          .map(({ id, score }) => {
            const record = recordMap.get(id);
            if (!record) return null;
            return { id, score, record };
          })
          .filter((r): r is VectorSearchResult => r !== null);

        setResults(vectorResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Vector search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [embeddingsIndex, searchIndex, topK, minScore]
  );

  useEffect(() => {
    if (!enabled || !isAvailable || !query.trim()) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery === lastQueryRef.current) {
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      lastQueryRef.current = trimmedQuery;
      search(trimmedQuery);
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, enabled, isAvailable, debounceMs, search]);

  return {
    results,
    isLoading,
    error,
    isAvailable,
    search,
  };
}
