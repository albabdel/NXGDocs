// functions/request-article.ts
// Cloudflare Pages Function — handles customer requests to create new documentation articles.
// Sends a notification email to the docs team via ZeptoMail.

import { getSessionFromHeader } from './lib/zoho-session';

interface Env {
  ZEPTO_API_KEY: string;
  ZOHO_SESSION_SECRET: string;
}

interface RequestPayload {
  ticketId: string;
  ticketNumber: string;
  subject: string;
  requesterEmail: string;
}

function buildEmailHtml(payload: RequestPayload, contactId: string): string {
  const now = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  return `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
  <div style="background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <h2 style="margin: 0 0 4px 0; color: #1a1a1a; font-size: 1.4rem;">📄 New Article Request</h2>
    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 0.9rem; border-bottom: 2px solid #E8B058; padding-bottom: 16px;">
      A customer has requested documentation for a topic they couldn't find.
    </p>

    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; width: 160px; color: #374151;">Ticket #</td>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a; font-family: monospace;">${payload.ticketNumber}</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Topic / Subject</td>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a; font-weight: 500;">${payload.subject}</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Requester</td>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563;">
          <a href="mailto:${payload.requesterEmail}" style="color: #3B82F6; text-decoration: none;">${payload.requesterEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Contact ID</td>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #9ca3af; font-size: 0.85rem; font-family: monospace;">${contactId}</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Requested At</td>
        <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #6b7280;">${now}</td>
      </tr>
    </table>

    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px;">
      <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
        💡 <strong>Action needed:</strong> Review the linked support ticket and consider creating a documentation article
        covering the topic above. Link it back to the customer's ticket once published.
      </p>
    </div>
  </div>
  <p style="text-align: center; color: #9ca3af; font-size: 0.8rem; margin-top: 16px;">
    Sent from the NXGEN Customer Support Portal.
  </p>
</div>
  `.trim();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = { 'Content-Type': 'application/json' };

  try {
    // Verify the customer session cookie — ensures only authenticated customers can call this
    const cookieHeader = context.request.headers.get('Cookie');
    const session = await getSessionFromHeader(cookieHeader, context.env.ZOHO_SESSION_SECRET).catch(() => null);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const payload = await context.request.json() as RequestPayload;
    if (!payload.ticketId || !payload.subject) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: corsHeaders });
    }

    const emailRes = await fetch('https://api.zeptomail.eu/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-enczapikey ${context.env.ZEPTO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'noreply@nxgen.io' },
        to: [{ email_address: { address: 'abed.badarnah@nxgen.io' } }],
        subject: `[Article Request] ${payload.subject}`,
        htmlbody: buildEmailHtml(payload, session.contactId),
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text().catch(() => emailRes.statusText);
      console.error('ZeptoMail error:', emailRes.status, errText);
      throw new Error(`ZeptoMail ${emailRes.status}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('request-article error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send request' }), { status: 500, headers: corsHeaders });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
