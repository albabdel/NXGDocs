function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function getDefaultMaxDistance(word: string): number {
  const len = word.length;
  if (len >= 3 && len <= 5) {
    return 2;
  }
  return 3;
}

interface SuggestionResult {
  term: string;
  distance: number;
}

function findSuggestions(
  query: string,
  terms: string[],
  maxDistance?: number
): string[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery.length === 0) {
    return [];
  }

  const exactMatch = terms.some(
    (term) => term.toLowerCase().trim() === normalizedQuery
  );

  if (exactMatch) {
    return [];
  }

  const effectiveMaxDistance =
    maxDistance ?? getDefaultMaxDistance(normalizedQuery);

  const suggestions: SuggestionResult[] = [];

  for (const term of terms) {
    const normalizedTerm = term.toLowerCase().trim();
    const distance = levenshteinDistance(normalizedQuery, normalizedTerm);

    if (distance <= effectiveMaxDistance && distance > 0) {
      suggestions.push({ term, distance });
    }
  }

  suggestions.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.term.localeCompare(b.term);
  });

  return suggestions.slice(0, 3).map((s) => s.term);
}

export { findSuggestions, levenshteinDistance };
