// functions/zoho-calendar-proxy/[[path]].ts
// Cloudflare Pages Function — passes MCP requests from the browser through to the
// Zoho Calendar MCP server, solving CORS restrictions.
// The frontend adds _mcpEndpoint to the body for routing; we strip it before forwarding.

const MCP_ENDPOINT = 'https://calendar-20110877848.zohomcp.eu/mcp/message?key=fbf99eb19f7517bbf700100abf90387d';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 200, headers: CORS_HEADERS });

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;

  const authHeader = request.headers.get('authorization');

  let mcpRequest: Record<string, unknown>;
  try {
    const body = await request.json() as Record<string, unknown>;
    // Strip the routing hint — forward the rest as-is to the MCP server
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _mcpEndpoint: _ignored, ...rest } = body;
    mcpRequest = rest;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });
  }

  try {
    const upstream = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(mcpRequest),
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
