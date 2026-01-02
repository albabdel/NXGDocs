import nodemailer from 'nodemailer';

// ZeptoMail SMTP Configuration
const mailConfig = {
  host: 'smtp.zeptomail.eu',
  port: 587,
  secure: false,
  from: 'noreply@nxgen.io',
};

const recipientEmail = 'abed.badarnah@nxgen.io';

function formatEmailBody(payload) {
  const feedbackType = payload.helpful ? '✅ Positive Feedback' : '💡 Improvement Suggestion';
  
  let body = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        
        <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 1.5rem; border-bottom: 2px solid ${payload.helpful ? '#22C55E' : '#C89446'}; padding-bottom: 12px;">
          ${feedbackType}
        </h2>
        
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; width: 140px; color: #374151;">Page</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a;">
              <a href="${payload.context.url}" style="color: #3B82F6; text-decoration: none;">${payload.context.pageTitle}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Page URL</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563; font-size: 0.9rem; word-break: break-all;">
              ${payload.context.url}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Helpful?</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: ${payload.helpful ? '#22C55E' : '#DC2626'}; font-weight: 600;">
              ${payload.helpful ? 'Yes ✓' : 'Needs Improvement'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Submitted At</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563;">${new Date(payload.context.timestamp).toLocaleString()}</td>
          </tr>
        </table>
  `;

  if (payload.comment) {
    body += `
        <h3 style="margin: 24px 0 12px 0; color: #1a1a1a; font-size: 1.1rem;">Feedback Comment</h3>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">
          ${payload.comment}
        </div>
    `;
  }

  if (payload.name || payload.email) {
    body += `
        <h3 style="margin: 24px 0 12px 0; color: #1a1a1a; font-size: 1.1rem;">Contact Information</h3>
        <table style="border-collapse: collapse; width: 100%;">
          ${payload.name ? `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; width: 140px; color: #374151;">Name</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #1a1a1a;">${payload.name}</td>
          </tr>
          ` : ''}
          ${payload.email ? `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">Email</td>
            <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">
              <a href="mailto:${payload.email}" style="color: #3B82F6; text-decoration: none;">${payload.email}</a>
            </td>
          </tr>
          ` : ''}
        </table>
    `;
  }

  body += `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 12px 0; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Technical Context</h4>
          <table style="border-collapse: collapse; width: 100%; font-size: 0.85rem;">
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: 500; background-color: #f9fafb; width: 100px; color: #6b7280;">Browser</td>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; color: #6b7280; font-size: 0.8rem;">${(payload.context.browser || '').substring(0, 100)}...</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; font-weight: 500; background-color: #f9fafb; color: #6b7280;">Viewport</td>
              <td style="padding: 6px 8px; border: 1px solid #e5e7eb; color: #6b7280;">${payload.context.viewport}</td>
            </tr>
          </table>
        </div>
        
      </div>
      
      <p style="text-align: center; color: #9ca3af; font-size: 0.8rem; margin-top: 16px;">
        This feedback was submitted via the NXGEN Documentation site.
      </p>
    </div>
  `;

  return body;
}

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Validate required fields
    if (!payload.type || payload.type !== 'page_feedback') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid feedback type' }),
      };
    }

    if (typeof payload.helpful !== 'boolean') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required field: helpful' }),
      };
    }

    // Get SMTP credentials from environment
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('Missing SMTP credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Prepare email
    const feedbackLabel = payload.helpful ? 'Positive' : 'Improvement';
    const pageTitle = payload.context?.pageTitle || 'Unknown Page';
    const subject = `[Page Feedback - ${feedbackLabel}] ${pageTitle}`;
    const htmlBody = formatEmailBody(payload);

    // Prepare attachments
    const attachments = [];
    if (payload.attachment) {
      const base64Data = payload.attachment.includes(',')
        ? payload.attachment.split(',')[1]
        : payload.attachment;

      attachments.push({
        filename: payload.attachmentName || 'attachment',
        content: base64Data,
        encoding: 'base64',
      });
    }

    // Send email
    const info = await transporter.sendMail({
      from: mailConfig.from,
      to: recipientEmail,
      subject: subject,
      html: htmlBody,
      attachments: attachments,
    });

    console.log('Page feedback email sent successfully:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId,
      }),
    };
  } catch (error) {
    console.error('Error sending page feedback email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send feedback',
        message: error.message,
      }),
    };
  }
}

