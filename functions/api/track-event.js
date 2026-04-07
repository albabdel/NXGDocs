/**
 * Cloudflare Pages Function: Analytics Event Tracker
 *
 * Receives page view and search events from the frontend and persists them to
 * Supabase. Designed to be called client-side with minimal overhead.
 *
 * Accepts POST /api/track-event with JSON body:
 *   { type: 'view', slug: '/docs/foo', product: 'gcxone' }
 *   { type: 'search', query: 'alarm codes', results: 5, product: 'gcxone' }
 *   { type: 'zero_result', query: 'unicorn', product: 'gcxone' }
 *
 * Environment variables (CF Pages → Settings → Env Vars):
 *   SUPABASE_URL     — https://temmzrunmzjiivogsbzz.supabase.co
 *   SUPABASE_KEY     — sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3U (anon/publishable)
 *
 * Route: POST /api/track-event
 */

const SUPABASE_URL = 'https://temmzrunmzjiivogsbzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JqYChtiG2IZr_3ZtjfLMNA_q6roK3U';

function supInsert(table, record, supabaseKey) {
  return fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(record),
  });
}

function supUpsert(table, record, onConflict, supabaseKey) {
  return fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(record),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS: allow from the docs site
  const origin = request.headers.get('Origin') || '';
  const allowed = ['https://gcxone.pages.dev', 'https://gcsurge.pages.dev', 'https://docs.gcxone.com'];
  if (!allowed.some((o) => origin.startsWith(o)) && !origin.includes('localhost')) {
    return new Response('Forbidden', { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { type, slug, product = 'gcxone', query, results } = body;
  const supabaseKey = env.SUPABASE_KEY || SUPABASE_ANON_KEY;
  const sessionId = request.headers.get('X-Session-Id') || null;
  const country = request.headers.get('CF-IPCountry') || null;
  const userAgent = request.headers.get('User-Agent')?.slice(0, 200) || null;
  const referrer = request.headers.get('Referer')?.slice(0, 500) || null;

  try {
    if (type === 'view' && slug) {
      await supInsert(
        'doc_views',
        { slug, product, referrer, user_agent: userAgent, country, session_id: sessionId },
        supabaseKey
      );
    } else if (type === 'search' && query) {
      await supInsert(
        'search_events',
        { query: query.slice(0, 200), results_count: results ?? 0, product, session_id: sessionId },
        supabaseKey
      );
    } else if (type === 'zero_result' && query) {
      // Upsert: increment count for existing query+product pair
      await supUpsert(
        'zero_results',
        { query: query.slice(0, 200), product, count: 1 },
        'query,product',
        supabaseKey
      );
    } else {
      return new Response('Bad Request: unknown event type', { status: 400 });
    }
  } catch (err) {
    // Don't fail the user experience on tracking errors
    console.error('Tracking error:', err.message);
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST',
    },
  });
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
      'Access-Control-Max-Age': '86400',
    },
  });
}
