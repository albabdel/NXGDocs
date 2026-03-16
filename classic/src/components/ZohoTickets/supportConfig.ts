export interface CannedResponse {
  id: string;
  name: string;
  category: string;
  content: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subjectPrefix: string;
  descriptionTemplate: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  tags: string[];
}

export interface SLAConfig {
  id: string;
  name: string;
  priority: string;
  responseHours: number;
  resolutionHours: number;
}

export const CANNED_RESPONSES: CannedResponse[] = [
  {
    id: 'acknowledge',
    name: 'Ticket Acknowledgment',
    category: 'General',
    content: `Thank you for contacting NXGEN Support.

We have received your ticket and a member of our team will review it shortly. We aim to respond within our standard SLA timeframe.

Ticket Reference: #{ticketNumber}

If you have any additional information that may help us resolve your issue faster, please reply to this ticket.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'investigating',
    name: 'Under Investigation',
    category: 'Status Update',
    content: `We are currently investigating your issue. Our team is actively working on identifying the root cause and we will provide an update as soon as we have more information.

Thank you for your patience.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'need-info',
    name: 'Request More Information',
    category: 'Action Required',
    content: `To help us resolve your issue more effectively, we need some additional information:

1. 
2. 
3. 

Please reply with the requested details at your earliest convenience.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'escalated',
    name: 'Escalated to Specialist',
    category: 'Status Update',
    content: `Your ticket has been escalated to our specialist team for further investigation. They have the expertise to handle more complex issues and will be in touch shortly.

We appreciate your patience while we work to resolve this matter.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'resolved',
    name: 'Issue Resolved',
    category: 'Resolution',
    content: `We're pleased to inform you that your issue has been resolved.

Resolution Summary:


If you experience this issue again or have any follow-up questions, please don't hesitate to reply to this ticket.

We would appreciate it if you could take a moment to rate your support experience.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'waiting-feedback',
    name: 'Awaiting Your Feedback',
    category: 'Action Required',
    content: `We're following up on your ticket. We provided a solution/response but haven't heard back from you.

Could you please confirm if:
- The issue has been resolved
- You need further assistance
- You would like to close this ticket

If we don't hear back within 7 days, we'll assume the issue is resolved and close the ticket.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'closing',
    name: 'Ticket Closing Notice',
    category: 'Resolution',
    content: `We're closing this ticket as the issue appears to be resolved. If you continue to experience problems or have additional questions, please feel free to reopen this ticket or create a new one.

Thank you for choosing NXGEN.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'maintenance',
    name: 'Scheduled Maintenance',
    category: 'Notifications',
    content: `Please be advised that we have scheduled maintenance on:

Date: 
Time: 
Duration: 

During this period, you may experience temporary service interruptions. We apologize for any inconvenience.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'bug-reported',
    name: 'Bug Reported to Engineering',
    category: 'Status Update',
    content: `We have identified this as a bug and reported it to our engineering team. It has been logged with the following reference:

Bug ID: 
Priority: 
Estimated Fix: 

We will notify you when a fix is available. Thank you for your patience.

Best regards,
NXGEN Support Team`,
  },
  {
    id: 'feature-request',
    name: 'Feature Request Logged',
    category: 'Status Update',
    content: `Thank you for your feature request. We have logged this in our product backlog for consideration in future releases.

Request Summary: 

Our product team reviews all feature requests during their planning cycles. While we cannot guarantee implementation, we value your feedback in shaping our product roadmap.

Best regards,
NXGEN Support Team`,
  },
];

export const TICKET_TEMPLATES: TicketTemplate[] = [
  {
    id: 'general',
    name: 'General Inquiry',
    description: 'General questions or requests',
    category: 'General',
    subjectPrefix: '',
    descriptionTemplate: `Please describe your inquiry:

1. What would you like to know or request?
2. Any relevant context or background information?
3. Expected outcome?`,
    priority: 'Medium',
    tags: ['general', 'inquiry'],
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    description: 'Report a software bug or issue',
    category: 'Technical',
    subjectPrefix: '[BUG] ',
    descriptionTemplate: `**Description of the bug:**
[A clear description of what the bug is]

**Steps to reproduce:**
1. 
2. 
3. 

**Expected behavior:**
[What you expected to happen]

**Actual behavior:**
[What actually happened]

**Environment:**
- Browser/Device: 
- OS: 
- Version: 

**Screenshots/Attachments:**
[Attach any relevant screenshots]`,
    priority: 'High',
    tags: ['bug', 'technical'],
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    description: 'Request a new feature or enhancement',
    category: 'Product',
    subjectPrefix: '[FEATURE] ',
    descriptionTemplate: `**Feature Description:**
[A clear description of the feature you'd like]

**Use Case:**
[How would this feature help you? What problem does it solve?]

**Proposed Solution:**
[Any ideas on how this could be implemented?]

**Additional Context:**
[Any other relevant information]`,
    priority: 'Medium',
    tags: ['feature', 'enhancement'],
  },
  {
    id: 'billing',
    name: 'Billing Inquiry',
    description: 'Questions about invoices, payments, or subscriptions',
    category: 'Billing',
    subjectPrefix: '[BILLING] ',
    descriptionTemplate: `**Nature of Inquiry:**
[ ] Invoice question
[ ] Payment issue
[ ] Subscription change
[ ] Refund request
[ ] Other: 

**Invoice/Transaction ID (if applicable):**

**Details:**
[Please provide details about your billing inquiry]`,
    priority: 'High',
    tags: ['billing', 'finance'],
  },
  {
    id: 'account',
    name: 'Account Issue',
    description: 'Login, access, or account-related problems',
    category: 'Account',
    subjectPrefix: '[ACCOUNT] ',
    descriptionTemplate: `**Issue Type:**
[ ] Cannot log in
[ ] Password reset
[ ] Account locked
[ ] Need access to feature
[ ] Other: 

**Email associated with account:**

**Description:**
[Please describe the issue in detail]

**When did this start?**:`,
    priority: 'High',
    tags: ['account', 'access'],
  },
  {
    id: 'security',
    name: 'Security Concern',
    description: 'Report a security vulnerability or concern',
    category: 'Security',
    subjectPrefix: '[SECURITY] ',
    descriptionTemplate: `**Type of Security Concern:**
[ ] Suspected unauthorized access
[ ] Vulnerability report
[ ] Data privacy concern
[ ] Other: 

**Description:**
[Please describe the security concern]

**Impact:**
[Who or what systems are affected?]

**Additional Information:**
[Any other relevant details]`,
    priority: 'Critical',
    tags: ['security', 'urgent'],
  },
  {
    id: 'integration',
    name: 'Integration Support',
    description: 'Help with API or third-party integrations',
    category: 'Technical',
    subjectPrefix: '[INTEGRATION] ',
    descriptionTemplate: `**Integration Type:**
[Which system/service are you integrating with?]

**Current Status:**
[ ] Planning integration
[ ] In development
[ ] Integration failing
[ ] Other: 

**API Endpoint(s) (if applicable):**

**Error Messages/Logs:**

**Description:**
[Describe what you're trying to achieve and any issues encountered]`,
    priority: 'Medium',
    tags: ['integration', 'api', 'technical'],
  },
  {
    id: 'training',
    name: 'Training Request',
    description: 'Request for product training or documentation',
    category: 'Support',
    subjectPrefix: '[TRAINING] ',
    descriptionTemplate: `**Training Type:**
[ ] Product walkthrough
[ ] Feature-specific training
[ ] Admin training
[ ] API/Developer training
[ ] Other: 

**Number of Participants:**

**Preferred Format:**
[ ] Live session
[ ] Recorded video
[ ] Documentation
[ ] Other: 

**Topics to Cover:**

**Preferred Date/Time (if live session):**`,
    priority: 'Low',
    tags: ['training', 'documentation'],
  },
];

export const DEFAULT_SLA_CONFIGS: SLAConfig[] = [
  { id: 'critical', name: 'Critical Priority SLA', priority: 'Critical', responseHours: 1, resolutionHours: 4 },
  { id: 'high', name: 'High Priority SLA', priority: 'High', responseHours: 4, resolutionHours: 24 },
  { id: 'medium', name: 'Medium Priority SLA', priority: 'Medium', responseHours: 8, resolutionHours: 48 },
  { id: 'low', name: 'Low Priority SLA', priority: 'Low', responseHours: 24, resolutionHours: 72 },
];

export const AUTO_REPLY_TEMPLATE = `Thank you for contacting NXGEN Support.

We have received your request and a member of our team will be in touch shortly.

**Your Ticket Reference:** #{ticketNumber}
**Priority:** {priority}
**Expected Response Time:** {sla}

You can track the status of your ticket at any time through our support portal.

If you have additional information to share, please reply to this ticket.

Best regards,
NXGEN Support Team`;

export function getCannedResponseById(id: string): CannedResponse | undefined {
  return CANNED_RESPONSES.find(r => r.id === id);
}

export function getCannedResponsesByCategory(): Record<string, CannedResponse[]> {
  const categories: Record<string, CannedResponse[]> = {};
  for (const response of CANNED_RESPONSES) {
    if (!categories[response.category]) {
      categories[response.category] = [];
    }
    categories[response.category].push(response);
  }
  return categories;
}

export function getTemplateById(id: string): TicketTemplate | undefined {
  return TICKET_TEMPLATES.find(t => t.id === id);
}

export function getSLAForPriority(priority: string, configs: SLAConfig[] = DEFAULT_SLA_CONFIGS): SLAConfig | undefined {
  return configs.find(c => c.priority === priority);
}

export function calculateSLARemaining(
  createdTime: string,
  priority: string,
  type: 'response' | 'resolution' = 'response'
): { remainingMs: number; isBreached: boolean; percentage: number } | null {
  const sla = getSLAForPriority(priority);
  if (!sla) return null;
  
  const hours = type === 'response' ? sla.responseHours : sla.resolutionHours;
  const deadline = new Date(createdTime).getTime() + hours * 60 * 60 * 1000;
  const now = Date.now();
  const remainingMs = deadline - now;
  const totalMs = hours * 60 * 60 * 1000;
  
  return {
    remainingMs,
    isBreached: remainingMs < 0,
    percentage: Math.max(0, Math.min(100, (remainingMs / totalMs) * 100)),
  };
}

export function formatSLARemaining(remainingMs: number): string {
  if (remainingMs < 0) {
    const overdueMs = Math.abs(remainingMs);
    const hours = Math.floor(overdueMs / (60 * 60 * 1000));
    const minutes = Math.floor((overdueMs % (60 * 60 * 1000)) / (60 * 1000));
    return `Overdue by ${hours}h ${minutes}m`;
  }
  
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  
  return `${hours}h ${minutes}m remaining`;
}

export function generateAutoReply(ticketNumber: string, priority: string): string {
  const sla = getSLAForPriority(priority);
  const slaText = sla 
    ? `${sla.responseHours} hour${sla.responseHours !== 1 ? 's' : ''}`
    : 'within business hours';
  
  return AUTO_REPLY_TEMPLATE
    .replace('{ticketNumber}', ticketNumber)
    .replace('{priority}', priority)
    .replace('{sla}', slaText);
}
