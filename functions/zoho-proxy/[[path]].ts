// functions/zoho-proxy/[[path]].ts
// Cloudflare Pages Function — proxies browser requests to desk.zoho.eu to avoid CORS.
// The browser cannot call desk.zoho.eu directly (CORS blocked).
// Usage: replace API_BASE in zohoApi.ts with '/zoho-proxy'
// e.g. GET /zoho-proxy/tickets → https://desk.zoho.eu/api/v1/tickets

interface Env {}

const ZOHO_DESK_BASE = 'https://desk.zoho.eu/api/v1';
const ZOHO_ACCOUNTS_BASE = 'https://accounts.zoho.eu';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, orgId',
};

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, { status: 200, headers: CORS_HEADERS });

export const onRequest: PagesFunction<Env> = async (context) => {
  const { params, request } = context;

  // Reconstruct the path from the catch-all param
  const pathSegments: string[] = Array.isArray(params.path)
    ? params.path
    : params.path
    ? [params.path]
    : [];
  const path = pathSegments.join('/');

  // Determine target base URL
  // Special prefix 'accounts' → accounts.zoho.eu, else → desk.zoho.eu/api/v1
  let targetUrl: string;
  if (path.startsWith('accounts/')) {
    targetUrl = `${ZOHO_ACCOUNTS_BASE}/${path.replace(/^accounts\//, '')}`;
  } else {
    targetUrl = `${ZOHO_DESK_BASE}/${path}`;
  }

  // Forward query string
  const reqUrl = new URL(request.url);
  if (reqUrl.search) targetUrl += reqUrl.search;

  // Forward the request headers we care about (Authorization, orgId, Content-Type)
  const forwardHeaders: Record<string, string> = {};
  for (const key of ['authorization', 'orgid', 'content-type']) {
    const val = request.headers.get(key);
    if (val) forwardHeaders[key === 'orgid' ? 'orgId' : key] = val;
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body,
  });

  // Return upstream response with CORS headers added
  const responseHeaders = new Headers(CORS_HEADERS);
  const contentType = upstream.headers.get('content-type');
  if (contentType) responseHeaders.set('content-type', contentType);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};
