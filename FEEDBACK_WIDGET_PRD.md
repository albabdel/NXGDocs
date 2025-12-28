# Product Requirements Document: Feedback Widget (VoC Widget)

**Version:** 1.0  
**Date:** 2024  
**Status:** Implemented  
**Owner:** Product Team

---

## Executive Summary

The Feedback Widget (VoC - Voice of Customer) is a floating action button (FAB) that enables users to submit feedback directly from any page in the documentation site. The widget supports three distinct feedback types: Feature Requests, Bug Reports, and Integration Requests, each with tailored forms and routing to appropriate internal teams.

---

## Problem Statement

Users need a convenient, context-aware way to provide feedback while browsing documentation. Without a dedicated feedback mechanism, users may:
- Abandon feedback due to friction
- Submit incomplete information
- Route feedback to incorrect teams
- Lose context about where issues occur

---

## Goals & Objectives

### Primary Goals
1. **Reduce Feedback Friction**: Enable one-click access to feedback form from any page
2. **Improve Feedback Quality**: Collect structured, actionable feedback with required context
3. **Streamline Routing**: Automatically route feedback to correct teams (Product/Quality/Integration)
4. **Capture Context**: Automatically capture page URL, browser, viewport, and timestamp

### Success Metrics
- Feedback submission rate (target: >5% of page views)
- Feedback completeness rate (target: >90%)
- Average time to submit feedback (target: <2 minutes)
- Team satisfaction with feedback quality (target: >4/5)

---

## User Stories

### US-1: Submit Feature Request
**As a** documentation user  
**I want to** submit a feature request with user story format  
**So that** the product team can prioritize features based on user needs

**Acceptance Criteria:**
- User can access feedback widget from any page
- Form includes: Title, Role, Desired Outcome, Business Value, Acceptance Criteria
- Email is required for follow-up
- Module can be selected or auto-detected from URL
- Submission routes to Product team

### US-2: Report a Bug
**As a** documentation user  
**I want to** report a bug with screenshot evidence  
**So that** the quality team can quickly reproduce and fix issues

**Acceptance Criteria:**
- Form includes: Title, What Happened, Expected Behavior, Repro Steps, Frequency
- Screenshot upload is required (paste or file upload)
- Email is optional
- Module can be selected or auto-detected
- Submission routes to Quality team

### US-3: Request Integration
**As a** documentation user  
**I want to** request device integration with specifications  
**So that** the integration team can evaluate and plan new device support

**Acceptance Criteria:**
- Form includes: Device Type, Device Count, Required Capabilities, Supporting Documents
- Email is required for coordination
- Multiple documents can be uploaded (SDKs, PDFs, specs)
- Capabilities can be selected via checkboxes
- Submission routes to Integration team

### US-4: Access Feedback Widget
**As a** documentation user  
**I want to** easily access the feedback form from any page  
**So that** I can provide feedback without leaving my current context

**Acceptance Criteria:**
- Floating action button visible on all pages
- Button positioned bottom-right, non-intrusive
- Button expands on hover to show "Feedback" label
- Modal opens with smooth animation
- Modal closes on route change

---

## Functional Requirements

### FR-1: Widget Visibility
- **REQ-1.1**: FAB must be visible on all documentation pages
- **REQ-1.2**: FAB must be fixed position (bottom-right, 2rem from edges)
- **REQ-1.3**: FAB must have z-index 9999 to appear above all content
- **REQ-1.4**: FAB must hide when modal is open

### FR-2: Modal Behavior
- **REQ-2.1**: Modal must open on FAB click
- **REQ-2.2**: Modal must close on overlay click or close button
- **REQ-2.3**: Modal must auto-close when user navigates to different page
- **REQ-2.4**: Modal must be responsive (full-screen on mobile)

### FR-3: Form Types
- **REQ-3.1**: Three tabs: Feature Request, Bug Report, Integration Request
- **REQ-3.2**: Form fields must dynamically change based on selected type
- **REQ-3.3**: Active tab must be visually distinct
- **REQ-3.4**: Form must reset when switching types

### FR-4: Feature Request Form
- **REQ-4.1**: Required fields: Title, Email, Desired Outcome
- **REQ-4.2**: Optional fields: Role, Business Value, Acceptance Criteria
- **REQ-4.3**: Module dropdown with 14 predefined options + "Other"
- **REQ-4.4**: Severity/Impact dropdown (Low/Medium/High/Critical)

### FR-5: Bug Report Form
- **REQ-5.1**: Required fields: Title, Actual Behavior, Repro Steps, Screenshot
- **REQ-5.2**: Optional fields: Email, Expected Behavior
- **REQ-5.3**: Frequency dropdown (Every Time/Intermittent/Once)
- **REQ-5.4**: Screenshot upload via paste (Ctrl+V) or file picker
- **REQ-5.5**: Module dropdown with 14 predefined options + "Other"

### FR-6: Integration Request Form
- **REQ-6.1**: Required fields: Title, Email, Device Type, Device Count, Capabilities
- **REQ-6.2**: Optional fields: Tenant Name, Supporting Documents
- **REQ-6.3**: Capability checkboxes: Alarms, Video Verification, Playback, Audio, PTZ, IO, Cloud
- **REQ-6.4**: Multiple document upload (PDFs, SDKs, specifications)
- **REQ-6.5**: Document preview with remove option

### FR-7: Validation
- **REQ-7.1**: Client-side validation before submission
- **REQ-7.2**: Error messages displayed in red banner with shake animation
- **REQ-7.3**: Required fields marked with red asterisk
- **REQ-7.4**: Custom module name required if "Other" selected
- **REQ-7.5**: At least one capability required for integration requests

### FR-8: File Handling
- **REQ-8.1**: Screenshot must convert to Base64
- **REQ-8.2**: Documents must convert to Base64
- **REQ-8.3**: File preview before submission
- **REQ-8.4**: Remove file option before submission

### FR-9: Context Capture
- **REQ-9.1**: Auto-capture page URL on submit
- **REQ-9.2**: Auto-capture browser user agent
- **REQ-9.3**: Auto-capture viewport dimensions
- **REQ-9.4**: Auto-capture timestamp (ISO format)
- **REQ-9.5**: Auto-detect module from URL path on mount

### FR-10: Submission
- **REQ-10.1**: Submit button disabled during submission
- **REQ-10.2**: Loading state: "Sending to Team..."
- **REQ-10.3**: Success state: Show team-specific success message
- **REQ-10.4**: Auto-close modal 2.5 seconds after success
- **REQ-10.5**: Error state: Show error message, allow retry

### FR-11: Email Delivery
- **REQ-11.1**: Send formatted HTML email to configured recipient
- **REQ-11.2**: Email subject: `[Type] Title`
- **REQ-11.3**: Include all form data in structured tables
- **REQ-11.4**: Attach screenshot for bug reports
- **REQ-11.5**: Attach supporting documents for integration requests
- **REQ-11.6**: Include context information (URL, browser, viewport, timestamp)

---

## Technical Requirements

### TR-1: Frontend Stack
- **REQ-TR-1.1**: React with TypeScript
- **REQ-TR-1.2**: Docusaurus framework integration
- **REQ-TR-1.3**: React Hooks (useState, useEffect, useRef)
- **REQ-TR-1.4**: Docusaurus router for location tracking

### TR-2: Backend Stack
- **REQ-TR-2.1**: Vercel serverless function
- **REQ-TR-2.2**: Node.js runtime
- **REQ-TR-2.3**: Nodemailer for email delivery
- **REQ-TR-2.4**: ZeptoMail SMTP service

### TR-3: API Endpoint
- **REQ-TR-3.1**: POST-only endpoint
- **REQ-TR-3.2**: Development: `http://localhost:3001/api/feedback`
- **REQ-TR-3.3**: Production: `/api/feedback` (Vercel serverless)
- **REQ-TR-3.4**: Auto-detect environment (localhost vs production)

### TR-4: Data Format
- **REQ-TR-4.1**: JSON payload with all form fields
- **REQ-TR-4.2**: Base64 encoding for images and documents
- **REQ-TR-4.3**: Context object with URL, browser, viewport, timestamp

### TR-5: Email Configuration
- **REQ-TR-5.1**: SMTP host: smtp.zeptomail.eu
- **REQ-TR-5.2**: Port: 587 (TLS)
- **REQ-TR-5.3**: From: noreply@nxgen.io
- **REQ-TR-5.4**: To: abed.badarnah@nxgen.io (configurable)

---

## Design Requirements

### DR-1: Visual Design
- **REQ-DR-1.1**: Dark theme with glassmorphism effects
- **REQ-DR-1.2**: NXGEN gold accent color (#C89446 / rgba(200, 148, 70))
- **REQ-DR-1.3**: Smooth animations and transitions
- **REQ-DR-1.4**: Professional, luxury aesthetic

### DR-2: FAB Design
- **REQ-DR-2.1**: Circular button, 60px height
- **REQ-DR-2.2**: Gold border, dark background with blur
- **REQ-DR-2.3**: Xo.png icon (36px × 36px)
- **REQ-DR-2.4**: Hover: Expand to show "Feedback" label
- **REQ-DR-2.5**: Subtle float animation (6s infinite)
- **REQ-DR-2.6**: Gold glow pulse on hover

### DR-3: Modal Design
- **REQ-DR-3.1**: Centered modal, max-width 600px
- **REQ-DR-3.2**: Glassmorphism background (rgba(18, 18, 18, 0.95))
- **REQ-DR-3.3**: Gold top border gradient
- **REQ-DR-3.4**: Backdrop blur overlay
- **REQ-DR-3.5**: Slide-up entrance animation
- **REQ-DR-3.6**: Max-height 85vh with scroll

### DR-4: Form Design
- **REQ-DR-4.1**: Tab navigation with active state
- **REQ-DR-4.2**: Input fields with gold focus ring
- **REQ-DR-4.3**: Dropzone with dashed border
- **REQ-DR-4.4**: Gold gradient submit button
- **REQ-DR-4.5**: Error banner with shake animation
- **REQ-DR-4.6**: Success screen with checkmark icon

### DR-5: Responsive Design
- **REQ-DR-5.1**: Mobile: Full-screen modal
- **REQ-DR-5.2**: Mobile: Single-column form layout
- **REQ-DR-5.3**: Mobile: Adjusted FAB position
- **REQ-DR-5.4**: Breakpoint: 600px

### DR-6: Animations
- **REQ-DR-6.1**: FAB float animation (subtle vertical movement)
- **REQ-DR-6.2**: Modal fade-in and slide-up
- **REQ-DR-6.3**: Error shake animation
- **REQ-DR-6.4**: Success scale-in animation
- **REQ-DR-6.5**: Hover transitions (0.3-0.4s)

---

## Acceptance Criteria

### AC-1: Widget Visibility
- ✅ FAB visible on all pages
- ✅ FAB positioned bottom-right
- ✅ FAB has correct z-index
- ✅ FAB hides when modal open

### AC-2: Modal Functionality
- ✅ Modal opens on FAB click
- ✅ Modal closes on overlay/close button
- ✅ Modal closes on route change
- ✅ Modal responsive on mobile

### AC-3: Form Types
- ✅ Three tabs functional
- ✅ Fields change per type
- ✅ Active tab highlighted
- ✅ Form resets on type change

### AC-4: Feature Request
- ✅ All required fields validated
- ✅ Email required
- ✅ Module selection works
- ✅ Submission successful

### AC-5: Bug Report
- ✅ All required fields validated
- ✅ Screenshot required
- ✅ Paste image works (Ctrl+V)
- ✅ File upload works
- ✅ Submission successful

### AC-6: Integration Request
- ✅ All required fields validated
- ✅ Capabilities selection works
- ✅ Multiple documents upload
- ✅ Document preview/remove works
- ✅ Submission successful

### AC-7: Validation
- ✅ Client-side validation works
- ✅ Error messages display
- ✅ Required fields marked
- ✅ Custom module validation

### AC-8: Email Delivery
- ✅ Email sent to correct recipient
- ✅ Email formatted correctly
- ✅ Attachments included
- ✅ Context information included

---

## Out of Scope

### Not Included in v1.0
- ❌ Feedback history/tracking for users
- ❌ Admin dashboard for feedback management
- ❌ Email notifications to submitter
- ❌ Integration with ticketing system (Jira, etc.)
- ❌ Rate limiting or spam protection
- ❌ File size limits enforcement
- ❌ Multi-language form support
- ❌ Feedback analytics/reporting
- ❌ User authentication/identification

---

## Dependencies

### External Services
- ZeptoMail SMTP service (email delivery)
- Vercel serverless functions (API hosting)

### Internal Components
- Docusaurus theme system
- Root.tsx theme component
- Custom CSS styling system

### Assets
- `/img/Xo.png` (FAB icon)

---

## Configuration

### Environment Variables (Recommended)
- `SMTP_HOST`: SMTP server hostname
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: Email sender address
- `FEEDBACK_RECIPIENT`: Email recipient address

### Hardcoded Values (Current)
- SMTP credentials in `feedback.ts`
- Recipient email: `abed.badarnah@nxgen.io`
- Module options in `VoCModal.tsx`
- Capability options in `VoCModal.tsx`

---

## Security Considerations

### Current Limitations
- ⚠️ No rate limiting on API endpoint
- ⚠️ No file size validation
- ⚠️ No input sanitization (XSS risk in email HTML)
- ⚠️ SMTP credentials in code (should use env vars)
- ⚠️ No CSRF protection

### Recommendations
- Implement rate limiting (e.g., 5 submissions per hour per IP)
- Add file size limits (e.g., 5MB per file, 20MB total)
- Sanitize user input before email generation
- Move credentials to environment variables
- Add CSRF token validation

---

## Future Enhancements

### Phase 2 (Potential)
- User feedback history
- Email notifications to submitter
- Integration with ticketing system
- Admin dashboard
- Analytics and reporting
- Multi-language support

### Phase 3 (Potential)
- User authentication
- Feedback status tracking
- Public feedback board
- Voting/prioritization
- Automated categorization

---

## Appendix

### Module Options
1. Getting Started
2. Platform Fundamentals
3. Admin & Configuration
4. Devices
5. Alarm Management
6. Features
7. Operator Guide
8. Installer Guide
9. Reporting
10. Troubleshooting
11. Knowledge Base
12. Support
13. API Documentation
14. General
15. Other (with custom input)

### Capability Options
- Alarms
- Video Verification
- Playback
- Audio
- PTZ
- IO
- Cloud

### Team Routing
- Feature Request → Product Team
- Bug Report → Quality Team
- Integration Request → Integration Team

---

**Document Status:** ✅ Implemented  
**Last Updated:** 2024  
**Next Review:** As needed


