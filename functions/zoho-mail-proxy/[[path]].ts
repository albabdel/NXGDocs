// functions/zoho-mail-proxy/[[path]].ts
// Cloudflare Pages Function — CORS proxy for Zoho Mail REST API.
// Forwards requests to https://mail.zoho.eu/api/* with auth token pass-through.

const ZOHO_MAIL_BASE = 'https://mail.zoho.eu/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 200, headers: CORS_HEADERS });

export const onRequest: PagesFunction = async (context) => {
  const { params, request } = context;

  const pathSegments: string[] = Array.isArray(params.path)
    ? params.path
    : params.path
    ? [params.path]
    : [];
  const path = pathSegments.join('/');

  const reqUrl = new URL(request.url);
  let targetUrl = `${ZOHO_MAIL_BASE}/${path}`;
  if (reqUrl.search) targetUrl += reqUrl.search;

  const forwardHeaders: Record<string, string> = {};
  for (const key of ['authorization', 'content-type']) {
    const val = request.headers.get(key);
    if (val) forwardHeaders[key] = val;
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer();

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const responseHeaders = new Headers(CORS_HEADERS);
    const ct = upstream.headers.get('content-type');
    if (ct) responseHeaders.set('content-type', ct);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Proxy error', message: msg }), {
      status: 502,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });
  }
};
