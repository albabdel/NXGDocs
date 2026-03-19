// functions/lib/confluence-service.ts
// Confluence API service for fetching content and statistics

export interface ConfluenceEnv {
  CONFLUENCE_EMAIL: string;
  CONFLUENCE_API_TOKEN: string;
  CONFLUENCE_SITE_URL: string;
  CONFLUENCE_SPACE_KEY: string;
}

export interface ConfluencePage {
  id: string;
  title: string;
  type: string;
  status: string;
  version: {
    number: number;
    when: string;
    by: {
      displayName: string;
      email: string;
    };
  };
  history?: {
    createdDate: string;
    lastUpdated: {
      when: string;
      by: {
        displayName: string;
        email: string;
      };
    };
  };
  _links?: {
    webui: string;
  };
}

export interface ConfluenceSpace {
  id: string;
  key: string;
  name: string;
  type: string;
  status: string;
  description?: {
    plain?: {
      value: string;
    };
  };
  _links?: {
    webui: string;
  };
}

export interface ConfluenceContentResponse {
  results: ConfluencePage[];
  start: number;
  limit: number;
  size: number;
  _links: {
    next?: string;
  };
}

export interface ConfluenceSpaceResponse {
  id: string;
  key: string;
  name: string;
  type: string;
  status: string;
}

export interface ConfluenceStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  archivedPages: number;
  lastUpdated: string | null;
  spaceName: string;
  spaceKey: string;
}

export interface ConfluenceConnectivityResult {
  connected: boolean;
  responseTime: number;
  message?: string;
  spaceName?: string;
}

function getAuthHeader(email: string, apiToken: string): string {
  const credentials = btoa(`${email}:${apiToken}`);
  return `Basic ${credentials}`;
}

function getConfluenceClient(env: ConfluenceEnv) {
  const baseUrl = env.CONFLUENCE_SITE_URL.replace(/\/$/, '');
  const authHeader = getAuthHeader(env.CONFLUENCE_EMAIL, env.CONFLUENCE_API_TOKEN);

  return {
    baseUrl,
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
}

export async function fetchSpaceContent(
  env: ConfluenceEnv,
  options: { limit?: number; start?: number } = {}
): Promise<ConfluenceContentResponse> {
  const client = getConfluenceClient(env);
  const limit = options.limit || 100;
  const start = options.start || 0;

  const url = `${client.baseUrl}/wiki/rest/api/content?spaceKey=${env.CONFLUENCE_SPACE_KEY}&limit=${limit}&start=${start}&expand=version,history`;

  const response = await fetch(url, {
    headers: client.headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Confluence API error: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<ConfluenceContentResponse>;
}

export async function fetchSpaceInfo(env: ConfluenceEnv): Promise<ConfluenceSpaceResponse> {
  const client = getConfluenceClient(env);

  const url = `${client.baseUrl}/wiki/rest/api/space/${env.CONFLUENCE_SPACE_KEY}`;

  const response = await fetch(url, {
    headers: client.headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Confluence API error: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<ConfluenceSpaceResponse>;
}

export async function getConfluenceStats(env: ConfluenceEnv): Promise<ConfluenceStats> {
  const [spaceInfo, contentResponse] = await Promise.all([
    fetchSpaceInfo(env),
    fetchSpaceContent(env, { limit: 500 }),
  ]);

  const pages = contentResponse.results;
  const publishedPages = pages.filter(p => p.status === 'current').length;
  const draftPages = pages.filter(p => p.status === 'draft').length;
  const archivedPages = pages.filter(p => p.status === 'archived' || p.status === 'trashed').length;

  const lastUpdatedPage = pages
    .filter(p => p.version?.when)
    .sort((a, b) => new Date(b.version.when).getTime() - new Date(a.version.when).getTime())[0];

  return {
    totalPages: pages.length,
    publishedPages,
    draftPages,
    archivedPages,
    lastUpdated: lastUpdatedPage?.version?.when || null,
    spaceName: spaceInfo.name,
    spaceKey: spaceInfo.key,
  };
}

export async function checkConfluenceConnectivity(env: ConfluenceEnv): Promise<ConfluenceConnectivityResult> {
  const start = Date.now();

  if (!env.CONFLUENCE_EMAIL || !env.CONFLUENCE_API_TOKEN || !env.CONFLUENCE_SITE_URL || !env.CONFLUENCE_SPACE_KEY) {
    return {
      connected: false,
      responseTime: 0,
      message: 'Confluence credentials not configured',
    };
  }

  try {
    const spaceInfo = await fetchSpaceInfo(env);

    return {
      connected: true,
      responseTime: Date.now() - start,
      spaceName: spaceInfo.name,
    };
  } catch (error) {
    return {
      connected: false,
      responseTime: Date.now() - start,
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

export async function getConfluencePagesForDashboard(env: ConfluenceEnv): Promise<{
  stats: ConfluenceStats | null;
  error?: string;
}> {
  try {
    const stats = await getConfluenceStats(env);
    return { stats };
  } catch (error) {
    console.error('[ConfluenceService] Error fetching stats:', error);
    return {
      stats: null,
      error: error instanceof Error ? error.message : 'Failed to fetch Confluence stats',
    };
  }
}
