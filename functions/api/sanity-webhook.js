/**
 * Cloudflare Pages Function: Sanity Webhook Receiver
 *
 * Receives POST requests from Sanity when documents change, verifies the
 * HMAC-SHA256 signature, then triggers a Cloudflare Pages deploy for the
 * appropriate product (gcxone or gcsurge).
 *
 * Environment variables required (set in CF Pages → Settings → Env Vars):
 *   SANITY_WEBHOOK_SECRET    — The secret you set in Sanity webhook config
 *   CF_API_TOKEN             — cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039
 *   CF_ACCOUNT_ID            — ff9df0a2daf8c9eb1032f67dd551c784
 *   SLACK_WEBHOOK_URL        — Slack webhook for deploy notifications
 *
 * Route: POST /api/sanity-webhook
 */

const CF_ACCOUNT_ID = 'ff9df0a2daf8c9eb1032f67dd551c784';

// Map Sanity product field values to CF Pages project names
const PRODUCT_TO_PROJECT = {
  gcxone: 'gcxone',
  gcsurge: 'gcsurge',
  shared: null, // triggers both
};

/**
 * Verify Sanity HMAC-SHA256 webhook signature.
 * Sanity sends: sanity-webhook-signature: t={timestamp},v1={base64-signature}
 */
async function verifySanitySignature(body, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k, v.join('=')];
    })
  );

  const { t: timestamp, v1: signature } = parts;
  if (!timestamp || !signature) return false;

  // Prevent replay attacks: reject if timestamp is >5 minutes old
  const age = Date.now() / 1000 - parseInt(timestamp, 10);
  if (Math.abs(age) > 300) return false;

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const payload = `${timestamp}.${body}`;
  const rawSig = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(payload));

  // Base64-encode the computed signature
  const computed = btoa(String.fromCharCode(...new Uint8Array(rawSig)));
  return computed === signature;
}

async function triggerDeploy(projectName, cfApiToken, reason) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${projectName}/deployments`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const json = await res.json().catch(() => ({}));
  return {
    ok: res.ok,
    status: res.status,
    deploymentId: json.result?.id,
    error: json.errors?.[0]?.message,
  };
}

async function notifySlack(slackUrl, product, deployResults, docTitle) {
  if (!slackUrl) return;

  const lines = [
    `🚀 *Deploy triggered* for \`${product}\``,
    docTitle ? `📄 Changed: ${docTitle}` : null,
    ...deployResults.map((r) =>
      r.ok
        ? `  ✅ \`${r.project}\` deploy started (${r.deploymentId?.slice(0, 8) || 'pending'})`
        : `  ❌ \`${r.project}\` deploy failed: ${r.error}`
    ),
  ]
    .filter(Boolean)
    .join('\n');

  await fetch(slackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines }),
  }).catch(() => {});
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const body = await request.text();
  const signatureHeader = request.headers.get('sanity-webhook-signature');

  // Verify signature
  const valid = await verifySanitySignature(body, signatureHeader, env.SANITY_WEBHOOK_SECRET);
  if (!valid) {
    return new Response('Unauthorized: invalid signature', { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response('Bad Request: invalid JSON', { status: 400 });
  }

  // Only trigger deploys for published status changes (ignore drafts)
  const status = payload.status || payload.workflowConfig?.workflowStatus;
  if (status && status !== 'published') {
    return new Response(JSON.stringify({ skipped: true, reason: `status=${status}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const product = payload.product || 'gcxone';
  const docTitle = payload.title || '(untitled)';
  const cfApiToken = env.CF_API_TOKEN;

  // Determine which projects to deploy
  let projectsToDeploy = [];
  if (product === 'shared' || !PRODUCT_TO_PROJECT[product]) {
    projectsToDeploy = ['gcxone', 'gcsurge'];
  } else {
    projectsToDeploy = [PRODUCT_TO_PROJECT[product]].filter(Boolean);
  }

  if (projectsToDeploy.length === 0) {
    return new Response(JSON.stringify({ skipped: true, reason: 'no projects matched' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Trigger deploys in parallel
  const results = await Promise.all(
    projectsToDeploy.map(async (project) => {
      const result = await triggerDeploy(project, cfApiToken, `Sanity doc changed: ${docTitle}`);
      return { project, ...result };
    })
  );

  // Send Slack notification
  await notifySlack(env.SLACK_WEBHOOK_URL, product, results, docTitle);

  const allOk = results.every((r) => r.ok);
  return new Response(
    JSON.stringify({
      triggered: results.map((r) => r.project),
      results,
    }),
    {
      status: allOk ? 200 : 207,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Health check
export async function onRequestGet() {
  return new Response(JSON.stringify({ status: 'ok', endpoint: '/api/sanity-webhook' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
