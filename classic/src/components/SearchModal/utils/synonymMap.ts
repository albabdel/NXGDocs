const synonymMap: Map<string, string[]> = new Map([
  ['nvr', ['recorder', 'recording device', 'network video recorder']],
  ['recorder', ['nvr', 'recording device', 'dvr']],
  ['recording device', ['nvr', 'recorder', 'dvr']],
  ['dvr', ['recorder', 'recording device', 'digital video recorder']],
  ['camera', ['cam', 'device', 'ip camera', 'video camera']],
  ['cam', ['camera', 'device', 'ip camera']],
  ['vms', ['video management system', 'video management']],
  ['ptz', ['pan tilt zoom', 'pan-tilt-zoom']],
  ['ai', ['analytics', 'artificial intelligence', 'machine learning', 'ml']],
  ['analytics', ['ai', 'artificial intelligence', 'analysis', 'intelligent analytics']],
  ['alarm', ['alert', 'event', 'notification', 'warning']],
  ['alert', ['alarm', 'event', 'notification', 'warning']],
  ['event', ['alarm', 'alert', 'notification', 'incident']],
  ['site', ['location', 'facility', 'premises', 'area']],
  ['location', ['site', 'facility', 'premises', 'area']],
  ['device', ['camera', 'recorder', 'equipment', 'hardware']],
]);

export function getSynonyms(term: string): string[] {
  const normalizedTerm = term.toLowerCase().trim();
  const synonyms = synonymMap.get(normalizedTerm);
  return synonyms ? [...synonyms] : [];
}

export function expandQuery(query: string): string[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const expandedTerms = new Set<string>([query.toLowerCase().trim()]);

  for (const term of terms) {
    expandedTerms.add(term);
    const synonyms = getSynonyms(term);
    for (const synonym of synonyms) {
      expandedTerms.add(synonym);
    }
  }

  return Array.from(expandedTerms);
}

export default synonymMap;
