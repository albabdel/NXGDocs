import { useState, useEffect, useCallback, useMemo } from 'react';

interface SynonymGroup {
  term: string;
  synonyms: string[];
  bidirectional: boolean;
  caseSensitive: boolean;
  enabled: boolean;
}

interface SynonymMap {
  [term: string]: string[];
}

const DEFAULT_SYNONYMS: SynonymGroup[] = [
  { term: 'login', synonyms: ['signin', 'sign in', 'authenticate', 'authentication', 'log in'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'logout', synonyms: ['signout', 'sign out', 'log out'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'setup', synonyms: ['install', 'installation', 'configure', 'configuration', 'get started'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'api', synonyms: ['endpoint', 'rest', 'graphql', 'interface'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'error', synonyms: ['exception', 'fault', 'failure', 'problem', 'issue'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'alarm', synonyms: ['alert', 'notification', 'warning'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'device', synonyms: ['equipment', 'hardware', 'unit', 'camera', 'sensor'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'tower', synonyms: ['station', 'site', 'location'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'user', synonyms: ['account', 'profile', 'operator'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'dashboard', synonyms: ['overview', 'home', 'main', 'console'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'report', synonyms: ['summary', 'analytics', 'statistics'], bidirectional: true, caseSensitive: false, enabled: true },
  { term: 'settings', synonyms: ['preferences', 'options', 'configuration', 'config'], bidirectional: true, caseSensitive: false, enabled: true },
];

export function useSynonyms() {
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>(DEFAULT_SYNONYMS);
  const [isLoading, setIsLoading] = useState(false);

  const synonymMap = useMemo(() => {
    const map: SynonymMap = {};

    for (const group of synonymGroups) {
      if (!group.enabled) continue;

      const normalizedTerm = group.caseSensitive
        ? group.term
        : group.term.toLowerCase();

      if (!map[normalizedTerm]) {
        map[normalizedTerm] = [];
      }

      for (const synonym of group.synonyms) {
        const normalizedSynonym = group.caseSensitive
          ? synonym
          : synonym.toLowerCase();

        if (!map[normalizedTerm].includes(normalizedSynonym)) {
          map[normalizedTerm].push(normalizedSynonym);
        }

        if (group.bidirectional) {
          if (!map[normalizedSynonym]) {
            map[normalizedSynonym] = [];
          }

          if (!map[normalizedSynonym].includes(normalizedTerm)) {
            map[normalizedSynonym].push(normalizedTerm);
          }

          for (const otherSynonym of group.synonyms) {
            if (otherSynonym !== synonym) {
              const normalizedOther = group.caseSensitive
                ? otherSynonym
                : otherSynonym.toLowerCase();

              if (!map[normalizedSynonym].includes(normalizedOther)) {
                map[normalizedSynonym].push(normalizedOther);
              }
            }
          }
        }
      }
    }

    return map;
  }, [synonymGroups]);

  const expandQuery = useCallback((query: string): string[] => {
    if (!query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/);
    const expandedTerms: string[] = [];

    for (const term of terms) {
      expandedTerms.push(term);

      const synonyms = synonymMap[term];
      if (synonyms && synonyms.length > 0) {
        expandedTerms.push(...synonyms);
      }
    }

    return [...new Set(expandedTerms)];
  }, [synonymMap]);

  const getSynonymsForTerm = useCallback((term: string): string[] => {
    const normalizedTerm = term.toLowerCase();
    return synonymMap[normalizedTerm] || [];
  }, [synonymMap]);

  return {
    synonymGroups,
    synonymMap,
    expandQuery,
    getSynonymsForTerm,
    isLoading,
  };
}

export default useSynonyms;
