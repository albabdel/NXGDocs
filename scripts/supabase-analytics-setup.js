#!/usr/bin/env node
'use strict';

/**
 * Supabase Analytics Setup
 *
 * Creates the analytics tables in the NXGen Supabase project:
 *   - doc_views        — tracks page views per slug/product
 *   - search_events    — tracks search queries and result counts
 *   - zero_results     — tracks searches that returned no results (content gaps)
 *
 * Usage:
 *   node scripts/supabase-analytics-setup.js
 *   node scripts/supabase-analytics-setup.js --query  # Run a quick analytics summary
 */

const https = require('https');

const SUPABASE_URL = 'https://temmzrunmzjiivogsbzz.supabase.co';
const SUPABASE_SECRET = 'sb_secret_pGgCafLgflIpY_Tm5vPWdw_5nN1QtWV';

function supabaseRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const url = new URL(SUPABASE_URL + path);
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method,
        headers: {
          apikey: SUPABASE_SECRET,
          Authorization: `Bearer ${SUPABASE_SECRET}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const DDL = `
-- NXGen Docs Analytics Schema
-- Run this in Supabase SQL editor OR via the REST API

-- Track doc page views
CREATE TABLE IF NOT EXISTS doc_views (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  slug        TEXT NOT NULL,
  product     TEXT NOT NULL DEFAULT 'gcxone',
  referrer    TEXT,
  user_agent  TEXT,
  country     TEXT,
  session_id  TEXT
);

CREATE INDEX IF NOT EXISTS doc_views_slug_idx     ON doc_views (slug);
CREATE INDEX IF NOT EXISTS doc_views_product_idx  ON doc_views (product);
CREATE INDEX IF NOT EXISTS doc_views_created_idx  ON doc_views (created_at DESC);

-- Track search queries
CREATE TABLE IF NOT EXISTS search_events (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  query         TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  product       TEXT NOT NULL DEFAULT 'gcxone',
  filters       JSONB,
  session_id    TEXT
);

CREATE INDEX IF NOT EXISTS search_events_query_idx   ON search_events (query);
CREATE INDEX IF NOT EXISTS search_events_created_idx ON search_events (created_at DESC);

-- Zero-result searches (content gap tracker)
CREATE TABLE IF NOT EXISTS zero_results (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  query      TEXT NOT NULL,
  product    TEXT NOT NULL DEFAULT 'gcxone',
  count      INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS zero_results_query_product_idx ON zero_results (query, product);

-- Helper view: top pages last 30 days
CREATE OR REPLACE VIEW top_pages_30d AS
  SELECT slug, product, COUNT(*) AS views
  FROM doc_views
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY slug, product
  ORDER BY views DESC;

-- Helper view: top searches last 30 days
CREATE OR REPLACE VIEW top_searches_30d AS
  SELECT query, product, COUNT(*) AS count, AVG(results_count)::INT AS avg_results
  FROM search_events
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY query, product
  ORDER BY count DESC;

-- Row-level security: allow inserts from anon (the tracking CF Function uses publishable key)
ALTER TABLE doc_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_results  ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "allow insert doc_views"
  ON doc_views FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow insert search_events"
  ON search_events FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow upsert zero_results"
  ON zero_results FOR ALL WITH CHECK (true);
`;

const ANALYTICS_QUERY = `
-- Top 10 pages (last 30 days)
SELECT slug, product, COUNT(*) AS views
FROM doc_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY slug, product ORDER BY views DESC LIMIT 10;
`;

async function runQuery() {
  console.log('Running analytics summary...\n');
  const res = await supabaseRequest('POST', '/rest/v1/rpc/query', { query: ANALYTICS_QUERY });
  if (res.status === 200) {
    console.log('Top pages (last 30 days):');
    console.table(res.body);
  } else {
    console.log('Response:', res.status, res.body);
  }
}

async function setup() {
  console.log('NXGen Docs — Supabase Analytics Setup');
  console.log('═'.repeat(50));
  console.log();
  console.log('Project: temmzrunmzjiivogsbzz (nxg org)');
  console.log('Tables: doc_views, search_events, zero_results');
  console.log();
  console.log('To create tables, run the following DDL in the Supabase SQL editor:');
  console.log('  https://supabase.com/dashboard/project/temmzrunmzjiivogsbzz/sql/new');
  console.log();
  console.log(DDL);
  console.log();
  console.log('Or use the Supabase CLI:');
  console.log('  supabase db push');
  console.log();
  console.log('After setup, the CF Pages Function at /api/track-event will');
  console.log('automatically log page views and search events to these tables.');
  console.log();

  // Try to verify connection
  console.log('Testing Supabase connection...');
  try {
    const res = await supabaseRequest('GET', '/rest/v1/doc_views?limit=1&select=id');
    if (res.status === 200) {
      console.log('  ✓ Connected — doc_views table exists');
    } else if (res.status === 404 || res.status === 400) {
      console.log('  ⚠ Tables not yet created — run the DDL above first');
    } else {
      console.log(`  ⚠ HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`  ✗ Connection failed: ${err.message}`);
  }

  // Write the DDL file for easy reference
  const fs = require('fs');
  const path = require('path');
  const ddlPath = path.join(process.cwd(), 'scripts', 'supabase-analytics.sql');
  fs.writeFileSync(ddlPath, DDL.trim());
  console.log(`\nDDL written to: ${ddlPath}`);
}

if (process.argv.includes('--query')) {
  runQuery().catch(console.error);
} else {
  setup().catch(console.error);
}
