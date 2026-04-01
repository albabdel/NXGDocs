// classic/functions/voc-feedback.ts
// Cloudflare Pages Function — Web Standards API only (no Node.js require, no nodemailer)
// Docs: https://developers.cloudflare.com/pages/functions/api-reference/
//
// Replaces the old classic/api/feedback.ts (Vercel Edge Function w/ nodemailer).
// Uses the ZeptoMail HTTP API via fetch() — Cloudflare Workers have no TCP sockets,
// so nodemailer SMTP cannot be used here.

import { requireProductAccess, getProductFromRequest } from './lib/require-product-access';

interface Env {
  ZEPTO_API_KEY: string;
  ZOHO_SESSION_SECRET: string;
  PRODUCT?: string;
}

interface FeedbackPayload {
  type: 'feature' | 'bug' | 'integration';
  title: string;
  email?: string;
  tenant_name?: string;
  module?: string;
  severity?: string;
  role?: string;
  desired_outcome?: string;
  business_value?: string;
  acceptance_criteria?: string;
  actual_behavior?: string;
  expected_behavior?: string;
  repro_steps?: string;
  frequency?: string;
  device_type?: string;
  device_count?: string;
  capabilities?: string[];
  supporting_documents?: Array<{
    name: string;
    type: string;
    size: number;
    data: string;
  }>;
  context: {
    url: string;
    browser: string;
    viewport: string;
    timestamp: string;
  };
  attachment?: string; // Base64 image (may include data:image/png;base64, prefix)
}

function formatEmailBody(payload: FeedbackPayload): string {
  const isFeature = payload.type === 'feature';
  const isIntegration = payload.type === 'integration';
  const typeLabel = isFeature ? 'Feature Request' : isIntegration ? 'Integration Request' : 'Bug Report';

  let body = `
    <h2>New ${typeLabel} Submitted</h2>

    <h3>Basic Information</h3>
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Type</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${typeLabel}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Title</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.title}</td>
      </tr>
      ${payload.module ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Module</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.module}</td>
      </tr>
      ` : ''}
      ${payload.severity ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Severity/Impact</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.severity}</td>
      </tr>
      ` : ''}
      ${payload.email ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Customer Email</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.email}</td>
      </tr>
      ` : ''}
      ${payload.tenant_name ? `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Tenant Name</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.tenant_name}</td>
      </tr>
      ` : ''}
    </table>
  `;

  if (isFeature) {
    body += `
      <h3>Feature Request Details</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        ${payload.role ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5; width: 200px;">Role</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.role}</td>
        </tr>
        ` : ''}
        ${payload.desired_outcome ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Desired Outcome</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.desired_outcome}</td>
        </tr>
        ` : ''}
        ${payload.business_value ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Business Value</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.business_value}</td>
        </tr>
        ` : ''}
        ${payload.acceptance_criteria ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Acceptance Criteria</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.acceptance_criteria}</td>
        </tr>
        ` : ''}
      </table>
    `;
  } else if (isIntegration) {
    body += `
      <h3>Integration Request Details</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        ${payload.device_type ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5; width: 200px;">Device Type</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.device_type}</td>
        </tr>
        ` : ''}
        ${payload.device_count ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Expected Device Count</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.device_count}</td>
        </tr>
        ` : ''}
        ${payload.capabilities && payload.capabilities.length > 0 ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Required Capabilities</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.capabilities.join(', ')}</td>
        </tr>
        ` : ''}
      </table>
    `;

    if (payload.supporting_documents && payload.supporting_documents.length > 0) {
      body += `
        <h3>Supporting Documents</h3>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Number of Documents</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${payload.supporting_documents.length}</td>
          </tr>
        </table>
        <ul style="margin: 0; padding-left: 20px;">
          ${payload.supporting_documents.map(doc => `
            <li style="margin-bottom: 8px;">
              <strong>${doc.name}</strong> (${(doc.size / 1024).toFixed(2)} KB, ${doc.type || 'Unknown type'})
            </li>
          `).join('')}
        </ul>
        <p style="margin-top: 10px; color: #666; font-size: 0.9em;">
          <em>Documents are attached to this email.</em>
        </p>
      `;
    }
  } else {
    body += `
      <h3>Bug Report Details</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        ${payload.actual_behavior ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5; width: 200px;">What Happened</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.actual_behavior}</td>
        </tr>
        ` : ''}
        ${payload.expected_behavior ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Expected Behavior</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.expected_behavior}</td>
        </tr>
        ` : ''}
        ${payload.repro_steps ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Steps to Reproduce</td>
          <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${payload.repro_steps}</td>
        </tr>
        ` : ''}
        ${payload.frequency ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Frequency</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${payload.frequency}</td>
        </tr>
        ` : ''}
      </table>
    `;
  }

  body += `
    <h3>Context Information</h3>
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Page URL</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><a href="${payload.context.url}">${payload.context.url}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Browser</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.context.browser}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Viewport</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.context.viewport}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Submitted At</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.context.timestamp}</td>
      </tr>
    </table>
  `;

  if (payload.attachment) {
    body += `
      <h3>Attachment</h3>
      <p>An image attachment is included in this feedback (see attached file).</p>
    `;
  }

  return body;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    // Validate product access before processing feedback submission
    const session = await requireProductAccess(context.request, context.env);
    const product = getProductFromRequest(context.request, context.env);

    const payload = await context.request.json() as FeedbackPayload;

    // Validate required fields
    if (!payload.title || !payload.type) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title and type are required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!['feature', 'bug', 'integration'].includes(payload.type)) {
      return new Response(JSON.stringify({ error: 'Invalid feedback type. Must be feature, bug, or integration' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const typeLabel = payload.type === 'feature'
      ? 'Feature Request'
      : payload.type === 'integration'
        ? 'Integration Request'
        : 'Bug Report';

    const subject = `[${typeLabel}] ${payload.title}`;
    const htmlBody = formatEmailBody(payload);

    // Build ZeptoMail attachments array
    // ZeptoMail HTTP API accepts: { "attachments": [{ "name": "...", "content": "<base64>" }] }
    // Strip the data URI prefix (e.g. "data:image/png;base64,") before sending.
    const attachments: Array<{ name: string; content: string }> = [];

    if (payload.attachment) {
      const base64Data = payload.attachment.includes(',')
        ? payload.attachment.split(',')[1]
        : payload.attachment;
      attachments.push({ name: 'feedback-attachment.png', content: base64Data });
    }

    if (payload.supporting_documents && payload.supporting_documents.length > 0) {
      for (const doc of payload.supporting_documents) {
        const base64Data = doc.data.includes(',') ? doc.data.split(',')[1] : doc.data;
        attachments.push({ name: doc.name, content: base64Data });
      }
    }

    // ZeptoMail HTTP API — fetch() is globally available in Cloudflare Workers
    // Do NOT use nodemailer — Workers have no TCP sockets
    const emailPayload: Record<string, unknown> = {
      from: { address: 'noreply@nxgen.io' },
      to: [{ email_address: { address: 'abed.badarnah@nxgen.io' } }],
      subject,
      htmlbody: htmlBody,
    };

    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const emailResponse = await fetch('https://api.zeptomail.eu/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-enczapikey ${context.env.ZEPTO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('ZeptoMail error:', emailResponse.status, errorText);
      throw new Error(`ZeptoMail API error: ${emailResponse.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('voc-feedback function error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// CORS preflight handler
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
