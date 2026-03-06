// classic/functions/page-feedback.ts
// Cloudflare Pages Function — Web Standards API only (no Node.js require, no nodemailer)
// Docs: https://developers.cloudflare.com/pages/functions/api-reference/

interface Env {
  ZEPTO_API_KEY: string;
}

interface PageFeedbackPayload {
  type: string;
  rating?: 'helpful' | 'not-helpful';
  helpful?: boolean;
  comment?: string;
  name?: string;
  email?: string;
  attachment?: string;
  attachmentName?: string;
  context?: {
    pageTitle?: string;
    pageUrl?: string;
    url?: string;
    browser?: string;
    viewport?: string;
    timestamp?: string;
  };
}

function formatEmailBody(payload: PageFeedbackPayload): string {
  const { helpful, rating, comment, name, email, context } = payload;
  const timestamp = new Date().toISOString();

  const isHelpful = helpful !== undefined ? helpful : rating === 'helpful';
  const feedbackType = isHelpful ? '&#x2705; Positive Feedback' : '&#x1F4A1; Improvement Suggestion';
  const pageTitle = context?.pageTitle ?? 'Unknown';
  const pageUrl = context?.pageUrl ?? context?.url ?? 'Unknown';
  const browserInfo = context?.browser ?? '';
  const viewport = context?.viewport ?? '';
  const submittedAt = context?.timestamp ?? timestamp;

  let body = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

        <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 1.5rem; border-bottom: 2px solid ${isHelpful ? '#22C55E' : '#C89446'}; padding-bottom: 12px;">
          ${feedbackType}
        </h2>

        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; width: 140px; color: #374151;">Page</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a;">
              <a href="${pageUrl}" style="color: #3B82F6; text-decoration: none;">${pageTitle}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Page URL</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563; font-size: 0.9rem; word-break: break-all;">
              ${pageUrl}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Helpful?</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: ${isHelpful ? '#22C55E' : '#DC2626'}; font-weight: 600;">
              ${isHelpful ? 'Yes &#x2713;' : 'Needs Improvement'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Submitted At</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563;">${new Date(submittedAt).toLocaleString()}</td>
          </tr>
        </table>
  `;

  if (comment) {
    body += `
        <h3 style="margin: 24px 0 12px 0; color: #1a1a1a; font-size: 1.1rem;">Feedback Comment</h3>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">
          ${comment}
        </div>
    `;
  }

  if (name || email) {
    body += `
        <h3 style="margin: 24px 0 12px 0; color: #1a1a1a; font-size: 1.1rem;">Contact Information</h3>
        <table style="border-collapse: collapse; width: 100%;">
          ${name ? `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; width: 140px; color: #374151;">Name</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a;">${name}</td>
          </tr>
          ` : ''}
          ${email ? `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Email</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">
              <a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a>
            </td>
          </tr>
          ` : ''}
        </table>
    `;
  }

  if (browserInfo || viewport) {
    body += `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 12px 0; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Technical Context</h4>
          <table style="border-collapse: collapse; width: 100%; font-size: 0.85rem;">
            ${browserInfo ? `
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: 500; background-color: #f9fafb; width: 100px; color: #6b7280;">Browser</td>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; color: #6b7280; font-size: 0.8rem;">${browserInfo.substring(0, 100)}...</td>
            </tr>
            ` : ''}
            ${viewport ? `
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: 500; background-color: #f9fafb; color: #6b7280;">Viewport</td>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; color: #6b7280;">${viewport}</td>
            </tr>
            ` : ''}
          </table>
        </div>
    `;
  }

  body += `
      </div>

      <p style="text-align: center; color: #9ca3af; font-size: 0.8rem; margin-top: 16px;">
        This feedback was submitted via the NXGEN Documentation site.
      </p>
    </div>
  `;

  return body;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const payload = await context.request.json() as PageFeedbackPayload;

    if (!payload.type || payload.type !== 'page_feedback') {
      return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // ZeptoMail HTTP API — fetch() is globally available in Cloudflare Workers
    // Do NOT use nodemailer — Workers have no TCP sockets
    const isHelpful = payload.helpful !== undefined ? payload.helpful : payload.rating === 'helpful';
    const feedbackLabel = isHelpful ? 'Positive' : 'Improvement';
    const pageTitle = payload.context?.pageTitle ?? 'Unknown Page';
    const subject = `[Page Feedback - ${feedbackLabel}] ${pageTitle}`;

    const emailResponse = await fetch('https://api.zeptomail.eu/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-enczapikey ${context.env.ZEPTO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'noreply@nxgen.io' },
        to: [{ email_address: { address: 'abed.badarnah@nxgen.io' } }],
        subject,
        htmlbody: formatEmailBody(payload),
      }),
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
    console.error('page-feedback function error:', error);
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
