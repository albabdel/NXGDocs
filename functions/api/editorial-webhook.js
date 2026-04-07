/**
 * Cloudflare Pages Function: Editorial Workflow Notifications
 *
 * Receives Sanity webhook events when workflowConfig.workflowStatus changes.
 * Sends Slack notifications to the team so reviewers know when content is ready.
 *
 * Configure a second Sanity webhook pointing to /api/editorial-webhook with:
 *   Filter: workflowConfig.workflowStatus in ["pending_review", "approved", "published"]
 *   Projection: { _id, _type, title, slug, product, workflowConfig, reviewedBy }
 *
 * Environment variables (CF Pages → Settings → Env Vars):
 *   SANITY_WEBHOOK_SECRET    — Same secret used for the deploy webhook
 *   SLACK_WEBHOOK_URL        — Slack webhook URL
 *   ZEPTOMAIL_TOKEN          — For email notifications
 *
 * Route: POST /api/editorial-webhook
 */

const STUDIO_BASE = 'https://fjjuacab.sanity.studio/structure/doc';
const SITE_BASE = 'https://gcxone.pages.dev/docs';

const STATUS_CONFIG = {
  pending_review: {
    emoji: '🟡',
    label: 'Ready for Review',
    color: '#f59e0b',
    message: 'A document has been submitted for review and needs approval.',
  },
  approved: {
    emoji: '🟢',
    label: 'Approved',
    color: '#10b981',
    message: 'A document has been approved and is ready to publish.',
  },
  published: {
    emoji: '✅',
    label: 'Published',
    color: '#3b82f6',
    message: 'A document has been published and is now live.',
  },
  rejected: {
    emoji: '🔴',
    label: 'Rejected',
    color: '#ef4444',
    message: 'A document has been rejected and needs revisions.',
  },
};

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
  const age = Date.now() / 1000 - parseInt(timestamp, 10);
  if (Math.abs(age) > 300) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const raw = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${body}`));
  return btoa(String.fromCharCode(...new Uint8Array(raw))) === signature;
}

async function sendSlackNotification(slackUrl, payload, statusKey) {
  const cfg = STATUS_CONFIG[statusKey] || { emoji: '📄', label: statusKey, color: '#6b7280', message: '' };
  const { title, slug, product, workflowConfig } = payload;
  const slugStr = slug?.current || slug || 'unknown';
  const studioUrl = `${STUDIO_BASE};${payload._id}`;
  const previewUrl = `${SITE_BASE}/${slugStr}`;
  const submitter = workflowConfig?.submittedBy?.name || workflowConfig?.submittedBy || null;
  const reviewer = workflowConfig?.reviewedBy?.name || workflowConfig?.reviewedBy || null;
  const notes = workflowConfig?.reviewNotes;

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${cfg.emoji} ${cfg.label}: ${title || 'Untitled'}` },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Product:*\n${(product || 'gcxone').toUpperCase()}` },
        { type: 'mrkdwn', text: `*Slug:*\n\`${slugStr}\`` },
        submitter ? { type: 'mrkdwn', text: `*Submitted by:*\n${submitter}` } : null,
        reviewer ? { type: 'mrkdwn', text: `*Reviewed by:*\n${reviewer}` } : null,
      ].filter(Boolean),
    },
    notes
      ? {
          type: 'section',
          text: { type: 'mrkdwn', text: `*Review Notes:*\n${notes}` },
        }
      : null,
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Open in Sanity Studio' },
          url: studioUrl,
          style: 'primary',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Preview Page' },
          url: previewUrl,
        },
      ],
    },
  ].filter(Boolean);

  await fetch(slackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  });
}

async function sendEmailNotification(zeptomailToken, payload, statusKey) {
  const cfg = STATUS_CONFIG[statusKey] || { emoji: '📄', label: statusKey, color: '#6b7280', message: '' };
  const slugStr = payload.slug?.current || payload.slug || 'unknown';

  const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;padding:24px;">
<div style="border-left:4px solid ${cfg.color};padding-left:16px;margin-bottom:24px;">
  <h2 style="margin:0;color:${cfg.color};">${cfg.emoji} ${cfg.label}</h2>
  <p style="margin:4px 0 0;color:#6b7280;">${cfg.message}</p>
</div>
<table style="width:100%;border-collapse:collapse;">
  <tr><td style="padding:8px;font-weight:600;width:140px;">Document</td><td style="padding:8px;">${payload.title || 'Untitled'}</td></tr>
  <tr style="background:#f9fafb;"><td style="padding:8px;font-weight:600;">Product</td><td style="padding:8px;">${(payload.product || 'gcxone').toUpperCase()}</td></tr>
  <tr><td style="padding:8px;font-weight:600;">Slug</td><td style="padding:8px;font-family:monospace;">${slugStr}</td></tr>
  ${payload.workflowConfig?.reviewNotes ? `<tr style="background:#f9fafb;"><td style="padding:8px;font-weight:600;">Review Notes</td><td style="padding:8px;">${payload.workflowConfig.reviewNotes}</td></tr>` : ''}
</table>
<div style="margin-top:24px;">
  <a href="https://fjjuacab.sanity.studio/structure/doc;${payload._id}" style="background:#C9A227;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;margin-right:12px;">Open in Sanity Studio</a>
</div>
<p style="margin-top:24px;color:#9ca3af;font-size:12px;">NXGen Docs Editorial Workflow</p>
</body></html>`;

  await fetch('https://api.zeptomail.eu/v1.1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: zeptomailToken,
    },
    body: JSON.stringify({
      from: { address: 'no-reply@nxgen.io', name: 'NXGen Docs' },
      to: [{ email_address: { address: 'abed.badarnah@nxgen.io', name: 'Abed Badarnah' } }],
      subject: `[NXGen Docs] ${cfg.emoji} ${cfg.label}: ${payload.title || 'Untitled'}`,
      htmlbody: html,
    }),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.text();
  const signatureHeader = request.headers.get('sanity-webhook-signature');

  const valid = await verifySanitySignature(body, signatureHeader, env.SANITY_WEBHOOK_SECRET);
  if (!valid) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const statusKey = payload.workflowConfig?.workflowStatus;
  if (!statusKey || !STATUS_CONFIG[statusKey]) {
    return new Response(JSON.stringify({ skipped: true, reason: 'no relevant status change' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const notifications = [];

  if (env.SLACK_WEBHOOK_URL) {
    notifications.push(
      sendSlackNotification(env.SLACK_WEBHOOK_URL, payload, statusKey).catch((e) =>
        console.error('Slack error:', e.message)
      )
    );
  }

  if (env.ZEPTOMAIL_TOKEN) {
    notifications.push(
      sendEmailNotification(env.ZEPTOMAIL_TOKEN, payload, statusKey).catch((e) =>
        console.error('Email error:', e.message)
      )
    );
  }

  await Promise.all(notifications);

  return new Response(JSON.stringify({ notified: true, status: statusKey }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
