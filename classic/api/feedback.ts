import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// ZeptoMail SMTP Configuration
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error(
    'SMTP_USER and SMTP_PASS environment variables are required. ' +
    'Please set them in your Netlify environment variables.'
  );
}

const mailConfig = {
  host: 'smtp.zeptomail.eu',
  port: 587,
  user: SMTP_USER,
  pass: SMTP_PASS,
  secure: false,
  from: 'noreply@nxgen.io',
};

const recipientEmail = 'abed.badarnah@nxgen.io';

// Create transporter
const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

interface FeedbackPayload {
  type: 'feature' | 'bug' | 'integration';
  title: string;
  email?: string;
  tenant_name?: string;
  module: string;
  severity: string;
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
  attachment?: string; // Base64 image
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
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Module</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.module}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Severity/Impact</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${payload.severity}</td>
      </tr>
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
      <p>An image attachment is included in this feedback.</p>
      <img src="${payload.attachment}" alt="Feedback attachment" style="max-width: 100%; height: auto; border: 1px solid #ddd; padding: 10px; margin-top: 10px;" />
    `;
  }

  return body;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: FeedbackPayload = req.body;

    // Validate required fields
    if (!payload.title || !payload.type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare email
    const typeLabel = payload.type === 'feature' ? 'Feature Request' : payload.type === 'integration' ? 'Integration Request' : 'Bug Report';
    const subject = `[${typeLabel}] ${payload.title}`;
    const htmlBody = formatEmailBody(payload);

    // Prepare attachments
    const attachments = [];
    if (payload.attachment) {
      attachments.push({
        filename: 'feedback-attachment.png',
        content: payload.attachment.split(',')[1], // Remove data:image/png;base64, prefix
        encoding: 'base64',
      });
    }
    
    // Add supporting documents for integration requests
    if (payload.supporting_documents && payload.supporting_documents.length > 0) {
      payload.supporting_documents.forEach((doc) => {
        const base64Data = doc.data.includes(',') ? doc.data.split(',')[1] : doc.data;
        attachments.push({
          filename: doc.name,
          content: base64Data,
          encoding: 'base64',
        });
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

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
    });
  }
}

