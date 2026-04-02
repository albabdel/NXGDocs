// Configuration for Confluence Surge space import
export const CONFLUENCE_SURGE_CONFIG = {
  spaceKey: 'Surge',
  spaceName: 'GC Surge',
  homepageId: '22249648',
  siteUrl: 'https://nxgen-team-f1bs1n7p.atlassian.net',
  sanity: {
    productId: 'gcsurge',
    dataset: 'production',
  },
  // Mapping of Confluence page IDs to Sanity slugs
  // Will be populated during import
  pageMapping: new Map<string, string>(),
};
