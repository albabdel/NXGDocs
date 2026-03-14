export interface MatchMarker {
  match: string;
}

export type HighlightPart = string | MatchMarker;

export function highlightMatches(text: string, query: string): HighlightPart[] {
  if (!query || query.trim() === '') {
    return [text];
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);

  const result: HighlightPart[] = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.toLowerCase() === query.toLowerCase()) {
      result.push({ match: part });
    } else {
      result.push(part);
    }
  }

  return result;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
