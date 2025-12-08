const fs = require('fs');
const path = require('path');

// External docs structure
const externalArticles = {
    'platform': [
        { file: 'what-is-gcxone-GCXONE.md', title: 'What is GCXONE GCXONE?', desc: 'Platform definition, cloud SaaS model, USMS concept, key capabilities' },
        { file: 'GCXONE-vs-talos.md', title: 'GCXONE vs Talos: How They Work Together', desc: 'GCXONE = video/analytics, Talos = alarm workflows, data flow between them' },
        { file: 'platform-hierarchy.md', title: 'Understanding the Platform Hierarchy', desc: 'Tenant to Customer to Site to Device to Sensor structure with examples' },
        { file: 'false-alarm-reduction.md', title: 'Key Benefits: False Alarm Reduction', desc: 'AI analytics, 80% reduction claim, 60-90 second response times' },
        { file: 'multi-tenant-architecture.md', title: 'Multi-Tenant Architecture Explained', desc: 'Subdomains, inexchange.cloud, nxgen.cloud, customer isolation' },
        { file: 'glossary.md', title: 'Glossary of Terms', desc: 'Definitions: Tenant, Site, Sensor, Workflow, ARM/DISARM, Isolate, etc.' },
    ],
    'account': [
        { file: 'add-customer.md', title: 'How to Add a Customer', desc: 'Step-by-step customer creation in Configuration App' },
        { file: 'create-customer-groups.md', title: 'How to Create Customer Groups', desc: 'Grouping customers, use cases for alarm routing' },
        { file: 'add-site.md', title: 'How to Add a Site', desc: 'Site creation, automatic Talos sync, required fields' },
        { file: 'manage-users-roles.md', title: 'Managing Users and Roles', desc: 'Admin, Customer Admin, Operator roles, permissions matrix' },
        { file: 'workspace-configuration.md', title: 'Workspace Configuration', desc: 'Restricting operator access to specific sites/alarms' },
    ],
    'network': [
        { file: 'readiness-checklist.md', title: 'Network Readiness Checklist', desc: 'Pre-installation requirements, connectivity options (VPN/Public IP/Whitelist)' },
        { file: 'gateway-ips.md', title: 'Gateway IPs to Whitelist', desc: 'Primary/Secondary IPs: 18.185.17.113, 3.124.50.242, streaming IPs' },
        { file: 'device-ports.md', title: 'Device-Specific Port Requirements', desc: 'Port list per device: ADPRO, Dahua, Hikvision, Milestone, etc.' },
        { file: 'device-receiver-ips.md', title: 'Device Receiver IPs', desc: 'Hikvision: 35.156.60.98, Milestone: 3.66.98.181, Hanwha: 18.184.110.24' },
        { file: 'vpn-setup.md', title: 'VPN Setup Guide', desc: 'IPsec and OpenVPN configuration for site-to-site connections' },
    ],
    'devices': [
        { file: 'standard-onboarding.md', title: 'Standard Device Onboarding Process', desc: 'Universal steps: Login to Config App to Add Device to Discover to Save' },
        { file: 'required-information.md', title: 'Required Device Information Checklist', desc: 'Fields needed per device type: IP, ports, credentials, unique IDs' },
        { file: 'hikvision-setup.md', title: 'Hikvision Setup Guide', desc: 'ISAPI subscription, Notify Surveillance Center, NTP sync, Server Unit ID' },
        { file: 'hikproconnect-setup.md', title: 'HikProConnect Cloud Setup', desc: 'Base URL (ieu.hik-partner.com), encryption key, cloud mode config' },
        { file: 'dahua-setup.md', title: 'Dahua Setup Guide', desc: 'Control port 37777, P2P streaming, NTP configuration' },
        { file: 'dahua-dolynk-setup.md', title: 'Dahua DoLynk Cloud Setup', desc: 'Serial number, share with dev@nxgen.info, DoLynk Care account' },
        { file: 'milestone-setup.md', title: 'Milestone VMS Setup', desc: 'Ports 443/7563/8081/22331, admin privileges, .NET requirements' },
        { file: 'adpro-setup.md', title: 'ADPRO Setup Guide', desc: 'TCP events, Port 10000, Server Unit ID, XO Client configuration' },
        { file: 'axis-setup.md', title: 'Axis IP Camera Setup', desc: 'Webhook URL format, nxgenDeviceId as credentials, RTSP port' },
        { file: 'hanwha-setup.md', title: 'Hanwha NVR Setup', desc: 'Webhook to hanvoproxy.nxgen.cloud, Camera ID in payload' },
        { file: 'axxon-setup.md', title: 'Axxon VMS Setup', desc: 'Websocket subscription (automatic), operator permissions' },
        { file: 'camect-setup.md', title: 'Camect Setup', desc: 'HLS URL for live video, event acknowledgement' },
        { file: 'reconeyez-setup.md', title: 'Reconeyez PIR Camera Setup', desc: 'DC-09 to Talos, FTP for images, workflow conversion' },
        { file: 'teltonika-setup.md', title: 'Teltonika IoT Setup', desc: 'Dashboard data, custom alarm rules, voltage thresholds' },
        { file: 'GCXONE-audio-setup.md', title: 'GCXONE Audio (SIP) Setup', desc: 'SIP URL, username, password, two-way audio config' },
        { file: 'heitel-setup.md', title: 'Heitel Legacy Device Setup', desc: 'HTConnect, Port 3333, manual ticket requirement' },
        { file: 'senstar-setup.md', title: 'Senstar VMS Setup', desc: 'Event polling configuration, Mobile API ports' },
        { file: 'viasys-setup.md', title: 'Viasys Cloud NVR Setup', desc: 'Placeholder device creation, webhook callback' },
    ],
    'features': [
        { file: 'dashboard-navigation.md', title: 'Dashboard Navigation Guide', desc: 'Main dashboard, device dashboard, alarm logs, analytics view' },
        { file: 'live-video.md', title: 'Live Video Streaming', desc: 'Cloud vs Local mode, supported formats, troubleshooting' },
        { file: 'playback-timeline.md', title: 'Playback & Timeline', desc: 'Accessing recordings, timeline navigation, export options' },
        { file: 'ptz-control.md', title: 'PTZ Control & Presets', desc: 'Pan-tilt-zoom controls, saving presets, device support matrix' },
        { file: 'io-management.md', title: 'I/O Management', desc: 'Input/Output configuration, supported devices, use cases' },
        { file: 'device-health.md', title: 'Device Health Monitoring', desc: 'Basic, Basic+, Advanced levels, what each monitors' },
        { file: 'site-pulse.md', title: 'Site Pulse & Lifecheck', desc: 'Heartbeat configuration, timeout alarms, intervals (10/30/60 min)' },
        { file: 'arm-disarm.md', title: 'Understanding ARM/DISARM', desc: 'What happens when armed vs disarmed, continuous state' },
        { file: 'device-isolation.md', title: 'Understanding Device Isolation', desc: 'Time-limited suppression, no AI/forwarding during isolation' },
        { file: 'event-clip-recording.md', title: 'Event Clip Recording', desc: 'Pre/post alarm clips, eventClipRecord configuration' },
    ],
    'ai': [
        { file: 'how-ai-reduces-false-alarms.md', title: 'How AI Reduces False Alarms', desc: 'Two-phase process: Identification to Decision, supported objects' },
        { file: 'enable-filtering.md', title: 'Enabling False Alarm Filtering', desc: 'Device-level activation steps, prerequisites' },
        { file: 'priority-list.md', title: 'Configuring the Priority List', desc: 'Objects that are ALWAYS real alarms, syntax, examples' },
        { file: 'whitelist.md', title: 'Configuring the Whitelist', desc: 'Objects with potential to be real alarms' },
        { file: 'blacklist.md', title: 'Configuring the Blacklist', desc: 'Objects to suppress as false alarms' },
        { file: 'reject-unknown.md', title: 'Reject Unknown Setting', desc: 'Handling unidentified objects (wind, reflections)' },
        { file: 'supported-objects.md', title: 'AI Supported Object List', desc: 'Complete list of detectable objects by AI version' },
    ],
    'workflows': [
        { file: 'introduction.md', title: 'Introduction to Workflows', desc: 'What workflows are, manual vs automated, benefits' },
        { file: 'levels-explained.md', title: 'Workflow Levels Explained', desc: 'Global, Group, Site-Specific, Managed workflows' },
        { file: 'creating-workflow.md', title: 'Creating a Workflow', desc: 'Incoming conditions, steps, actions configuration' },
        { file: 'customization-tips.md', title: 'Workflow Customization Tips', desc: 'Removing audio for no-speaker sites, test mode automation' },
        { file: 'arm-disarm-schedules.md', title: 'Setting Up ARM/DISARM Schedules', desc: 'Automated scheduling configuration' },
        { file: 'GCXONE-audio-announcements.md', title: 'Using GCXONE Audio for Announcements', desc: 'Remote audio broadcasts, two-way communication' },
    ],
    'troubleshooting': [
        { file: 'alarms-not-received.md', title: 'Alarms Not Being Received', desc: 'Check disarm/isolate, port verification, IP whitelist' },
        { file: 'video-not-working.md', title: 'Video/Live View Not Working', desc: 'Port checks, encoding (H.265 to H.264), cloud mode switch' },
        { file: 'time-sync-issues.md', title: 'Time Synchronization Issues', desc: 'NTP server (timel.nxgen.cloud), timezone matching' },
        { file: 'discovery-failures.md', title: 'Device Discovery Failures', desc: 'Credential verification, mandatory field checklist' },
        { file: 'alarms-blocked.md', title: 'Alarms Being Blocked', desc: 'Overflow threshold (25/5min), IVS alarm recommendation' },
    ],
    'support': [
        { file: 'submit-ticket.md', title: 'How to Submit a Support Ticket', desc: 'Required info: site name, device name, screenshots' },
        { file: 'ticket-priority.md', title: 'Understanding Ticket Priority Levels', desc: 'Priority definitions, response time expectations' },
        { file: 'salvo-links.md', title: 'Using Salvo Links', desc: 'How to share playback access with support team' },
    ],
};

// Create external docs
const baseDir = 'docs';

Object.entries(externalArticles).forEach(([category, articles]) => {
    const categoryDir = path.join(baseDir, category);

    articles.forEach(article => {
        const filePath = path.join(categoryDir, article.file);
        const sidebarLabel = article.title.replace(/^(How to |Understanding |Configuring the |Setting Up |Using )/, '');
        const content = `---
title: "${article.title}"
sidebar_label: "${sidebarLabel}"
---

# ${article.title}

## Overview

${article.desc}

## Content Coming Soon

This article is currently being developed. Content will be extracted from the comprehensive knowledge base document and tailored for customer use.

### What You'll Learn

- Key concepts and definitions
- Step-by-step instructions
- Best practices
- Common troubleshooting tips
- Related resources

---

**Status**: 🚧 Under Construction  
**Last Updated**: ${new Date().toLocaleDateString()}

:::tip Need Help Now?
If you need immediate assistance, please [submit a support ticket](../support/submit-ticket.md) with your site name, device name, and screenshots of the issue.
:::
`;

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Created: ${filePath}`);
    });
});

console.log('\n✅ All external documentation placeholders created!');
