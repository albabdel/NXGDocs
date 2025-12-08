const fs = require('fs');
const path = require('path');

// Internal docs structure
const internalArticles = {
    'support': [
        { file: 'l1-first-check.md', title: 'L1 First Check Protocol', desc: 'Verify Title + Description + Screenshot before starting work' },
        { file: '24-hour-analysis.md', title: '24-Hour Analysis Rule', desc: 'Resolution timeline expectations, when analysis phase ends' },
        { file: 'information-gathering.md', title: 'Information Gathering Protocol', desc: 'Protocol for missing details - go back to customer immediately' },
        { file: 'ticket-ownership.md', title: 'Ticket Ownership Guidelines', desc: 'CSM owns communication through to closure' },
        { file: 'consolidated-resolution.md', title: 'Consolidated Resolution Approach', desc: 'Solve completely, not in isolated pockets' },
        { file: 'l1-to-l2-escalation.md', title: 'L1 to L2 Escalation Criteria', desc: '>30 min troubleshooting, complex issues, bandwidth constraints' },
        { file: 'when-not-to-escalate.md', title: 'When NOT to Escalate', desc: 'Device problems, customer config issues, missing info' },
        { file: 'csm-queue-management.md', title: 'CSM Queue Management', desc: 'Proactively picking up tickets, cross-coverage' },
        { file: 'jump-server-protocol.md', title: 'Jump Server Access Protocol', desc: 'Shared VM usage, session management, communication' },
    ],
    'architecture': [
        { file: 'microservices-proxy.md', title: 'Microservices & Proxy Architecture', desc: 'One proxy per device type, standardized JSON/HTTP responses' },
        { file: 'communication-flow.md', title: 'Communication Flow Deep Dive', desc: 'UI to API to Proxy to Device complete path' },
        { file: 'protocol-flavors.md', title: 'Protocol Flavors Reference', desc: 'HTTP/REST, SDK, TCP, Webhooks, Websocket, SIA DC-09' },
        { file: 'cvidr-ai-engine.md', title: 'CVIDR AI Engine Overview', desc: 'Image processing, event detection, autoscaling' },
        { file: 'kubernetes-infrastructure.md', title: 'Kubernetes Infrastructure', desc: 'HPA scaling, 75% CPU threshold, node initialization' },
    ],
    'devices-internal': [
        { file: 'adpro-technical.md', title: 'ADPRO Technical Reference', desc: 'Server Unit ID issues, no P2P/O-key, unencrypted only' },
        { file: 'hikvision-technical.md', title: 'Hikvision Technical Reference', desc: '5-min live view limit, Server Unit ID uniqueness' },
        { file: 'dahua-technical.md', title: 'Dahua Technical Reference', desc: 'P2P ports 10000-10500, Local Mode prerequisites' },
        { file: 'milestone-technical.md', title: 'Milestone Technical Reference', desc: '.NET requirements, TCP JPEG (no RTSP), no Advanced Health' },
        { file: 'axxon-technical.md', title: 'Axxon Technical Reference', desc: 'Password issues, I/O not supported, unreliable polling' },
        { file: 'hanwha-technical.md', title: 'Hanwha Technical Reference', desc: 'NO Local Mode, NO PTZ/Presets in cloud' },
        { file: 'heitel-technical.md', title: 'Heitel Technical Reference', desc: 'Legacy, manual ticket per device, HTConnect' },
        { file: 'truevision-technical.md', title: 'True Vision Technical Reference', desc: 'Polling-based, IO to analytics.intrusion, NOT in Alarm Log' },
        { file: 'camect-technical.md', title: 'Camect Technical Reference', desc: 'HLS only, no playback support' },
        { file: 'senstar-technical.md', title: 'Senstar Technical Reference', desc: 'Event polling, no I/O, no Local Mode' },
        { file: 'reconeyez-technical.md', title: 'Reconeyez Technical Reference', desc: 'Dual-path flow, no live video (battery)' },
        { file: 'viasys-technical.md', title: 'Viasys Technical Reference', desc: 'Placeholder configuration process' },
    ],
    'custom-properties': [
        { file: 'master-sheet.md', title: 'Master Custom Properties Sheet', desc: 'ALL custom properties by device type' },
        { file: 'event-clip-record.md', title: 'eventClipRecord Configuration', desc: 'Pre/post recording for ADPRO, Dahua, Hikvision, Milestone' },
        { file: 'milestone-properties.md', title: 'Milestone Custom Properties', desc: 'baseUrl, WebSocket endpoints, isLowBandwidthDevice' },
        { file: 'teltonika-rules.md', title: 'Teltonika Custom Alarm Rules', desc: 'Voltage thresholds, filtering frequent data changes' },
        { file: 'false-alarm-filters.md', title: 'False Alarm Filter Properties', desc: 'Priority list, whitelist, blacklist, rejectUnknown syntax' },
        { file: 'alarm-overflow-threshold.md', title: 'Alarm Overflow Threshold', desc: 'Default 25, how to customize, custom property name' },
    ],
    'playbooks': [
        { file: 'no-alarms-received.md', title: 'Playbook: No Alarms Received', desc: 'Dashboard to Alarm Receiver Log to Device UI to Notify Surveillance Center' },
        { file: 'alarms-blocked-overflow.md', title: 'Playbook: Alarms Blocked/Overflow', desc: 'Overflow logs to Threshold property to IVS recommendation' },
        { file: 'incorrect-ai-classification.md', title: 'Playbook: Incorrect AI Classification', desc: 'Analytics dashboard to 4 custom properties to Masking to Data team' },
        { file: 'alarm-multiplicity.md', title: 'Playbook: Alarm Multiplicity', desc: 'Device log vs GCXONE vs Receiver Log to SDK test client' },
        { file: 'no-live-video.md', title: 'Playbook: No Live Video', desc: 'Video Activity to Device UI to Encoding to Cloud Only mode' },
        { file: 'discovery-failure.md', title: 'Playbook: Discovery Failure', desc: 'Credentials to Ports to Mandatory fields to Connectivity' },
        { file: 'time-sync-issues.md', title: 'Playbook: Time Sync Issues', desc: 'NTP server to Timezone to DST setting' },
        { file: 'sdk-exe-not-running.md', title: 'Playbook: SDK/EXE Not Running', desc: 'Executable status to Port monitoring' },
        { file: 'dahua-sdk-test-client.md', title: 'Using Dahua SDK Test Client', desc: 'Installation, IP/Port input, count comparison methodology' },
        { file: 'alarm-routing-setup.md', title: 'Two-Level Alarm Routing Setup', desc: 'GCXONE Customer Groups + Talos Org Units + Alarm Channels' },
    ],
    'alarm-routing': [
        { file: 'two-level-setup.md', title: 'Two-Level Alarm Routing Setup', desc: 'GCXONE Customer Groups + Talos Org Units + Alarm Channels' },
        { file: 'workspace-deep-dive.md', title: 'Workspace Configuration Deep Dive', desc: 'Bundling alarm channels, restricting site access' },
        { file: 'old-ajax-implementation.md', title: 'Old AJAX Implementation Guide', desc: 'Talos to GCXONE to Talos flow, BA alarm, extreme complexity' },
        { file: 'ajax-migration.md', title: 'AJAX Migration Recommendation', desc: 'Moving from workflow to GCXONE AJAX implementation' },
        { file: 'arm-disarm-vs-isolate.md', title: 'ARM/DISARM vs Isolate Technical', desc: 'Continuous state vs time-limited, image fetch behavior' },
        { file: 'talos-blocking-logic.md', title: 'Talos Alarm Blocking Logic', desc: 'Site-level blocking (not device), 25/5min threshold' },
        { file: 'event-polling-vs-push.md', title: 'Event Polling vs Push', desc: 'When to use: Teltonika, True Vision, Avigilon' },
    ],
    'network-internal': [
        { file: 'master-gateway-ips.md', title: 'Master Gateway IP List', desc: 'All primary/secondary service, streaming, messaging IPs' },
        { file: 'device-receiver-ips.md', title: 'Device Receiver IP Quick Reference', desc: 'Hikvision, Milestone, Hanwha, Heitel-specific IPs' },
        { file: 'vpn-whitelist-publicip.md', title: 'VPN vs Whitelist vs Public IP', desc: 'Decision tree for when to use each approach' },
        { file: 'port-feature-mapping.md', title: 'Port-to-Feature Mapping', desc: 'What fails when each port is blocked' },
    ],
    'ai-internal': [
        { file: 'identification-vs-decision.md', title: 'AI Identification vs Decision', desc: 'Two-phase process, configuration independence' },
        { file: 'complete-object-tags.md', title: 'Complete AI Object Tag List', desc: 'All tags returned by V4 and Nova' },
        { file: 'troubleshooting-misclassification.md', title: 'Troubleshooting AI Misclassification', desc: 'Check properties to Masking to Escalate to data team' },
        { file: 'data-team-escalation.md', title: 'Data Team Escalation Process', desc: 'When and how to escalate to Nazem/Asan' },
    ],
    'documentation': [
        { file: 'adding-findings.md', title: 'Adding New Findings to Docs', desc: 'Process for documenting undiscovered custom properties' },
        { file: 'style-guide.md', title: 'Documentation Style Guide', desc: 'Precise, small, screenshots, flowcharts' },
        { file: 'feeding-genie.md', title: 'Feeding the Genie', desc: 'What needs to be documented for AI knowledge base' },
        { file: 'vendor-contact-criteria.md', title: 'When to Contact Device Vendor', desc: 'After confirming issue is not GCXONE-related' },
        { file: 'vendor-escalation-templates.md', title: 'Vendor Escalation Templates', desc: 'Standard format for Dahua, Hikvision, etc.' },
    ],
};

// Create internal docs
const baseDir = 'internal_docs';

Object.entries(internalArticles).forEach(([category, articles]) => {
    const categoryDir = path.join(baseDir, category);

    articles.forEach(article => {
        const filePath = path.join(categoryDir, article.file);
        const sidebarLabel = article.title.replace(/^(Playbook: |Using )/, '');
        const content = `---
title: "${article.title}"
sidebar_label: "${sidebarLabel}"
---

# ${article.title}

:::info Internal Only
This article is for **internal use only** by CSM, Support, and Technical teams.
:::

## Overview

${article.desc}

## Content Coming Soon

This article is currently being developed. Content will be extracted from the comprehensive knowledge base document.

### Placeholder Sections

- Background & Context
- Step-by-Step Guide
- Common Issues
- Best Practices
- Related Articles

---

**Status**: 🚧 Under Construction  
**Last Updated**: ${new Date().toLocaleDateString()}
`;

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Created: ${filePath}`);
    });
});

console.log('\n✅ All internal documentation placeholders created!');
