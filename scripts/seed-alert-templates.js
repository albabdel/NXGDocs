#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const createBlock = (key, style, text, marks = []) => ({
  _type: 'block',
  _key: key,
  style,
  children: [{ _type: 'span', _key: `${key}-span`, text, marks }],
  markDefs: [],
});

const createCallout = (key, type, title, text) => ({
  _type: 'callout',
  _key: key,
  type,
  title,
  body: [{
    _type: 'block',
    _key: `${key}-body`,
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  }],
});

const alertTemplates = [
  {
    _id: 'alert-template-video-loss',
    _type: 'alertTemplate',
    name: 'Video Loss Alert',
    slug: { _type: 'slug', current: 'video-loss-alert' },
    description: 'Triggers when a camera video stream becomes unavailable or the signal is lost. Critical for maintaining continuous surveillance coverage.',
    alertType: 'heartbeat',
    severity: 'critical',
    conditions: [
      { _key: 'cond-video-stream', metric: 'video_stream_status', operator: 'eq', threshold: 0, duration: '30s', unit: 'status' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-sms', channelType: 'sms', recipients: ['on-call-operator', 'station-manager'], template: 'CRITICAL: Video signal lost from {{device_name}} at {{station_name}}. Immediate investigation required.' },
      { _key: 'notif-email', channelType: 'email', recipients: ['noc@nxgen.tech', 'operations@nxgen.tech'], template: 'Video Loss Alert - {{device_name}}\n\nCamera stream has become unavailable.\nStation: {{station_name}}\nTime: {{timestamp}}\nAction: Investigate camera connectivity immediately.' },
      { _key: 'notif-push', channelType: 'push', recipients: ['operator-group', 'manager-group'], template: 'VIDEO LOSS: {{device_name}} at {{station_name}}' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '5m', escalateTo: 'noc-lead', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '15m', escalateTo: 'operations-manager', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'industrial'],
    cooldownPeriod: '5m',
    autoResolve: true,
    autoResolveAfter: '1m',
    enabled: true,
    tags: ['video', 'critical', 'camera', 'surveillance'],
    body: [
      createBlock('body-intro', 'normal', 'The Video Loss Alert monitors camera connectivity and triggers when video streams become unavailable.'),
      createBlock('body-setup-h2', 'h2', 'Setup Instructions'),
      createBlock('body-step1', 'normal', 'Navigate to Alerts > Templates and select "Video Loss Alert"'),
      createBlock('body-step2', 'normal', 'Assign to specific cameras or camera groups via the Device Assignment panel'),
      createBlock('body-step3', 'normal', 'Configure notification recipients and escalation timeline'),
      createBlock('body-step4', 'normal', 'Set cooldown period to prevent alert flooding during known maintenance windows'),
      createCallout('callout-tip', 'tip', 'Best Practice', 'Pair this alert with a scheduled maintenance window to avoid false positives during planned camera restarts.'),
    ],
  },
  {
    _id: 'alert-template-device-offline',
    _type: 'alertTemplate',
    name: 'Device Offline',
    slug: { _type: 'slug', current: 'device-offline' },
    description: 'Triggers when a device stops responding to heartbeat pings or becomes unreachable on the network.',
    alertType: 'heartbeat',
    severity: 'high',
    conditions: [
      { _key: 'cond-heartbeat', metric: 'device_heartbeat', operator: 'eq', threshold: 0, duration: '1m', unit: 'status' },
      { _key: 'cond-ping', metric: 'ping_response', operator: 'eq', threshold: 0, duration: '1m', unit: 'status' },
    ],
    conditionLogic: 'or',
    notificationChannels: [
      { _key: 'notif-email', channelType: 'email', recipients: ['noc@nxgen.tech'], template: 'Device Offline Alert - {{device_name}}\n\nDevice is no longer responding.\nStation: {{station_name}}\nIP: {{device_ip}}\nTime: {{timestamp}}' },
      { _key: 'notif-push', channelType: 'push', recipients: ['operator-group'], template: 'DEVICE OFFLINE: {{device_name}} at {{station_name}}' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '10m', escalateTo: 'noc-lead', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '30m', escalateTo: 'field-technician', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'mobile', 'industrial'],
    cooldownPeriod: '10m',
    autoResolve: true,
    autoResolveAfter: '2m',
    enabled: true,
    tags: ['device', 'connectivity', 'heartbeat'],
    body: [
      createBlock('body-intro', 'normal', 'The Device Offline alert monitors device connectivity through heartbeat signals and network ping checks.'),
      createBlock('body-setup-h2', 'h2', 'Configuration Steps'),
      createBlock('body-step1', 'normal', 'Select devices to monitor from the Device Management console'),
      createBlock('body-step2', 'normal', 'Configure heartbeat interval (default: 60 seconds)'),
      createBlock('body-step3', 'normal', 'Set escalation path based on device criticality'),
    ],
  },
  {
    _id: 'alert-template-motion-detection',
    _type: 'alertTemplate',
    name: 'Motion Detection',
    slug: { _type: 'slug', current: 'motion-detection' },
    description: 'Triggers when motion is detected in a defined zone during off-hours or outside normal operating times.',
    alertType: 'schedule',
    severity: 'medium',
    conditions: [
      { _key: 'cond-motion', metric: 'motion_detected', operator: 'eq', threshold: 1, unit: 'boolean' },
      { _key: 'cond-zone', metric: 'motion_zone', operator: 'eq', threshold: 1, unit: 'zone_id' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-push', channelType: 'push', recipients: ['security-group', 'operator-group'], template: 'MOTION: {{zone_name}} at {{station_name}} - {{timestamp}}' },
    ],
    escalationRules: [],
    applicableStationTypes: ['tower', 'building', 'remote', 'industrial'],
    cooldownPeriod: '2m',
    autoResolve: true,
    autoResolveAfter: '30s',
    enabled: true,
    tags: ['video', 'motion', 'security', 'surveillance'],
    body: [
      createBlock('body-intro', 'normal', 'Motion Detection alerts trigger when movement is detected in configured zones during specified time windows.'),
      createBlock('body-setup-h2', 'h2', 'Zone Configuration'),
      createBlock('body-step1', 'normal', 'Access camera settings and enable motion detection'),
      createBlock('body-step2', 'normal', 'Draw detection zones on the camera view'),
      createBlock('body-step3', 'normal', 'Set sensitivity levels per zone'),
      createBlock('body-step4', 'normal', 'Configure schedule (e.g., off-hours: 22:00-06:00)'),
      createCallout('callout-warning', 'warning', 'Sensitivity Settings', 'High sensitivity may trigger false alerts from animals, weather, or lighting changes. Calibrate based on your environment.'),
    ],
  },
  {
    _id: 'alert-template-temperature',
    _type: 'alertTemplate',
    name: 'Temperature Alert',
    slug: { _type: 'slug', current: 'temperature-alert' },
    description: 'Monitors environmental temperature sensors and alerts when thresholds are exceeded. Supports warning and critical levels.',
    alertType: 'threshold',
    severity: 'high',
    conditions: [
      { _key: 'cond-temp-warning', metric: 'temperature', operator: 'gte', threshold: 30, unit: 'C' },
      { _key: 'cond-temp-critical', metric: 'temperature', operator: 'gte', threshold: 40, unit: 'C' },
    ],
    conditionLogic: 'or',
    notificationChannels: [
      { _key: 'notif-sms-warning', channelType: 'sms', recipients: ['facility-manager'], template: 'TEMP WARNING: {{sensor_name}} at {{station_name}} is {{value}}C. Action recommended.' },
      { _key: 'notif-sms-critical', channelType: 'sms', recipients: ['on-call-operator', 'facility-manager'], template: 'CRITICAL TEMP: {{sensor_name}} at {{station_name}} is {{value}}C! Immediate action required.' },
      { _key: 'notif-email', channelType: 'email', recipients: ['facilities@nxgen.tech', 'noc@nxgen.tech'], template: 'Temperature Alert - {{sensor_name}}\n\nCurrent: {{value}}C\nWarning threshold: 30C\nCritical threshold: 40C\nStation: {{station_name}}\nTime: {{timestamp}}' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '10m', escalateTo: 'hvac-technician', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '30m', escalateTo: 'facility-director', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'datacenter', 'industrial', 'building'],
    cooldownPeriod: '15m',
    autoResolve: true,
    autoResolveAfter: '5m',
    enabled: true,
    tags: ['environmental', 'temperature', 'hvac'],
    body: [
      createBlock('body-intro', 'normal', 'Temperature alerts monitor environmental sensors to protect equipment from overheating or freezing conditions.'),
      createBlock('body-thresholds-h2', 'h2', 'Default Thresholds'),
      createBlock('body-warning', 'normal', 'Warning: 30C or higher - Alert sent to facility manager'),
      createBlock('body-critical', 'normal', 'Critical: 40C or higher - Immediate notification to on-call operator'),
      createBlock('body-setup-h2', 'h2', 'Setup'),
      createBlock('body-step1', 'normal', 'Ensure temperature sensors are connected and reporting'),
      createBlock('body-step2', 'normal', 'Adjust thresholds based on equipment specifications'),
    ],
  },
  {
    _id: 'alert-template-storage-warning',
    _type: 'alertTemplate',
    name: 'Storage Warning',
    slug: { _type: 'slug', current: 'storage-warning' },
    description: 'Monitors disk storage capacity and alerts when usage exceeds defined thresholds to prevent recording loss.',
    alertType: 'threshold',
    severity: 'medium',
    conditions: [
      { _key: 'cond-storage', metric: 'disk_usage_percent', operator: 'gte', threshold: 85, unit: '%' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-email', channelType: 'email', recipients: ['admin@nxgen.tech', 'storage-team@nxgen.tech'], template: 'Storage Warning - {{station_name}}\n\nDisk usage: {{value}}%\nRemaining capacity: {{remaining_gb}}GB\nAction: Review retention policies or expand storage.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '24h', escalateTo: 'it-manager', severityOverride: 'high' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'industrial'],
    cooldownPeriod: '6h',
    autoResolve: true,
    autoResolveAfter: '1h',
    enabled: true,
    tags: ['system', 'storage', 'disk', 'capacity'],
    body: [
      createBlock('body-intro', 'normal', 'Storage warnings alert administrators when disk capacity is running low, allowing proactive action before recording stops.'),
      createBlock('body-setup-h2', 'h2', 'Configuration'),
      createBlock('body-step1', 'normal', 'Navigate to Storage Management > Alert Settings'),
      createBlock('body-step2', 'normal', 'Set warning threshold (default: 85%)'),
      createBlock('body-step3', 'normal', 'Optionally configure critical threshold at 95%'),
      createCallout('callout-tip', 'tip', 'Proactive Management', 'Review retention policies regularly. Automatic cleanup of old footage can prevent storage alerts.'),
    ],
  },
  {
    _id: 'alert-template-network-issue',
    _type: 'alertTemplate',
    name: 'Network Issue',
    slug: { _type: 'slug', current: 'network-issue' },
    description: 'Detects network performance degradation including packet loss, high latency, and connectivity issues.',
    alertType: 'compound',
    severity: 'high',
    conditions: [
      { _key: 'cond-packet-loss', metric: 'packet_loss_percent', operator: 'gte', threshold: 10, unit: '%' },
      { _key: 'cond-latency', metric: 'network_latency_ms', operator: 'gte', threshold: 500, unit: 'ms' },
    ],
    conditionLogic: 'or',
    notificationChannels: [
      { _key: 'notif-sms', channelType: 'sms', recipients: ['network-ops', 'noc-lead'], template: 'NETWORK ISSUE: {{station_name}} - {{issue_type}}. Current: {{value}}{{unit}}. Investigate immediately.' },
      { _key: 'notif-email', channelType: 'email', recipients: ['network@nxgen.tech', 'noc@nxgen.tech'], template: 'Network Performance Alert - {{station_name}}\n\nIssue: {{issue_type}}\nCurrent value: {{value}}{{unit}}\nThreshold: {{threshold}}{{unit}}\nTime: {{timestamp}}\n\nImmediate investigation recommended.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '3m', escalateTo: 'network-engineer', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '10m', escalateTo: 'isp-coordinator', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'mobile', 'industrial'],
    cooldownPeriod: '5m',
    autoResolve: true,
    autoResolveAfter: '2m',
    enabled: true,
    tags: ['network', 'connectivity', 'latency', 'packet-loss'],
    body: [
      createBlock('body-intro', 'normal', 'Network alerts monitor connectivity quality between monitoring stations and the central platform.'),
      createBlock('body-triggers-h2', 'h2', 'Alert Triggers'),
      createBlock('body-packet', 'normal', 'Packet Loss: 10% or higher - Indicates potential link degradation'),
      createBlock('body-latency', 'normal', 'Latency: 500ms or higher - May impact real-time video streams'),
      createBlock('body-setup-h2', 'h2', 'Configuration'),
      createBlock('body-step1', 'normal', 'Configure ping targets for each station'),
      createBlock('body-step2', 'normal', 'Set monitoring interval (recommended: 30 seconds)'),
      createBlock('body-step3', 'normal', 'Adjust thresholds based on network architecture'),
    ],
  },
  {
    _id: 'alert-template-power-failure',
    _type: 'alertTemplate',
    name: 'Power Failure',
    slug: { _type: 'slug', current: 'power-failure' },
    description: 'Critical alert for power loss events including UPS battery activation, power grid failure, or generator issues.',
    alertType: 'threshold',
    severity: 'critical',
    conditions: [
      { _key: 'cond-ups-battery', metric: 'ups_status', operator: 'eq', threshold: 1, unit: 'battery_mode' },
      { _key: 'cond-power-loss', metric: 'main_power_status', operator: 'eq', threshold: 0, unit: 'status' },
    ],
    conditionLogic: 'or',
    notificationChannels: [
      { _key: 'notif-sms', channelType: 'sms', recipients: ['on-call-operator', 'facility-manager', 'emergency-team'], template: 'CRITICAL: POWER FAILURE at {{station_name}}! UPS on battery. Runtime: {{ups_runtime}}min. Act immediately!' },
      { _key: 'notif-email', channelType: 'email', recipients: ['emergency@nxgen.tech', 'noc@nxgen.tech', 'facilities@nxgen.tech'], template: 'POWER FAILURE ALERT - {{station_name}}\n\nStatus: Main power lost\nUPS: On battery\nBattery runtime: {{ups_runtime}} minutes\nLoad: {{ups_load}}%\nTime: {{timestamp}}\n\nIMMEDIATE ACTION REQUIRED' },
      { _key: 'notif-push', channelType: 'push', recipients: ['all-operators', 'management'], template: 'POWER FAILURE: {{station_name}} - UPS on battery' },
      { _key: 'notif-voice', channelType: 'voice', recipients: ['on-call-operator'], template: 'Power failure detected at {{station_name}}. UPS is on battery. Estimated runtime: {{ups_runtime}} minutes.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '2m', escalateTo: 'emergency-team', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '5m', escalateTo: 'operations-director', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'industrial'],
    cooldownPeriod: '1m',
    autoResolve: true,
    autoResolveAfter: '30s',
    enabled: true,
    tags: ['power', 'ups', 'critical', 'infrastructure'],
    body: [
      createBlock('body-intro', 'normal', 'Power Failure is a critical alert that triggers immediately when main power is lost or UPS switches to battery mode.'),
      createBlock('body-response-h2', 'h2', 'Response Protocol'),
      createBlock('body-step1', 'normal', 'Verify UPS status and estimated battery runtime'),
      createBlock('body-step2', 'normal', 'Contact local power utility for outage information'),
      createBlock('body-step3', 'normal', 'Initiate graceful shutdown if battery runtime < 15 minutes'),
      createBlock('body-step4', 'normal', 'Dispatch field technician for generator activation if available'),
      createCallout('callout-critical', 'danger', 'Critical Priority', 'This alert uses ALL notification channels including voice calls. Ensure escalation contacts are always current.'),
    ],
  },
  {
    _id: 'alert-template-tamper-detection',
    _type: 'alertTemplate',
    name: 'Tamper Detection',
    slug: { _type: 'slug', current: 'tamper-detection' },
    description: 'Immediate alert when device tamper sensors are triggered, indicating potential physical interference or vandalism.',
    alertType: 'threshold',
    severity: 'critical',
    conditions: [
      { _key: 'cond-tamper', metric: 'tamper_sensor', operator: 'eq', threshold: 1, unit: 'status' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-sms', channelType: 'sms', recipients: ['security-team', 'on-call-operator', 'station-manager'], template: 'SECURITY ALERT: Tamper detected at {{station_name}} on {{device_name}}! Possible intrusion. Respond immediately.' },
      { _key: 'notif-email', channelType: 'email', recipients: ['security@nxgen.tech', 'noc@nxgen.tech', 'management@nxgen.tech'], template: 'TAMPER ALERT - {{station_name}}\n\nDevice: {{device_name}}\nSensor: {{sensor_name}}\nTime: {{timestamp}}\n\nThis may indicate physical tampering or vandalism. Immediate security response required.' },
      { _key: 'notif-push', channelType: 'push', recipients: ['security-group', 'all-operators'], template: 'TAMPER DETECTED: {{device_name}} at {{station_name}}' },
      { _key: 'notif-voice', channelType: 'voice', recipients: ['security-team-lead'], template: 'Security alert. Tamper sensor triggered at {{station_name}} on device {{device_name}}.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '2m', escalateTo: 'local-security', severityOverride: 'critical' },
      { _key: 'esc-step-2', step: 2, afterDuration: '5m', escalateTo: 'law-enforcement', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'industrial'],
    cooldownPeriod: '5m',
    autoResolve: false,
    enabled: true,
    tags: ['security', 'tamper', 'physical', 'critical'],
    body: [
      createBlock('body-intro', 'normal', 'Tamper Detection alerts trigger immediately when a device built-in tamper sensor is activated.'),
      createBlock('body-response-h2', 'h2', 'Response Protocol'),
      createBlock('body-step1', 'normal', 'Review camera footage from the affected device'),
      createBlock('body-step2', 'normal', 'Dispatch security personnel to investigate'),
      createBlock('body-step3', 'normal', 'Document findings and file incident report'),
      createCallout('callout-warning', 'warning', 'Security Priority', 'Tamper alerts should never be auto-resolved. Manual verification and resolution is required.'),
    ],
  },
  {
    _id: 'alert-template-login-failure',
    _type: 'alertTemplate',
    name: 'Login Failure Alert',
    slug: { _type: 'slug', current: 'login-failure-alert' },
    description: 'Triggers when multiple failed login attempts are detected, potentially indicating a brute force attack.',
    alertType: 'threshold',
    severity: 'medium',
    conditions: [
      { _key: 'cond-failed-logins', metric: 'failed_login_count', operator: 'gte', threshold: 5, duration: '5m', unit: 'attempts' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-email', channelType: 'email', recipients: ['admin@nxgen.tech', 'security@nxgen.tech'], template: 'Login Failure Alert - {{station_name}}\n\nFailed attempts: {{value}}\nIP Address: {{source_ip}}\nUsername: {{username}}\nTime: {{timestamp}}\n\nReview security logs for potential attack.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '10m', escalateTo: 'security-team', severityOverride: 'high' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'mobile', 'industrial'],
    cooldownPeriod: '15m',
    autoResolve: true,
    autoResolveAfter: '10m',
    enabled: true,
    tags: ['security', 'authentication', 'access-control'],
    body: [
      createBlock('body-intro', 'normal', 'Login Failure alerts help detect potential brute force attacks or unauthorized access attempts.'),
      createBlock('body-thresholds-h2', 'h2', 'Default Threshold'),
      createBlock('body-threshold', 'normal', '5 or more failed login attempts within 5 minutes'),
      createBlock('body-setup-h2', 'h2', 'Configuration'),
      createBlock('body-step1', 'normal', 'Navigate to Security > Authentication > Alert Settings'),
      createBlock('body-step2', 'normal', 'Set failed attempt threshold'),
      createBlock('body-step3', 'normal', 'Configure time window for counting attempts'),
      createCallout('callout-tip', 'tip', 'Best Practice', 'Consider enabling account lockout after repeated failures to prevent brute force attacks.'),
    ],
  },
  {
    _id: 'alert-template-certificate-expiry',
    _type: 'alertTemplate',
    name: 'Certificate Expiry',
    slug: { _type: 'slug', current: 'certificate-expiry' },
    description: 'Alerts when SSL/TLS certificates are approaching expiration, allowing time for renewal.',
    alertType: 'threshold',
    severity: 'high',
    conditions: [
      { _key: 'cond-cert-days', metric: 'certificate_days_remaining', operator: 'lte', threshold: 30, unit: 'days' },
    ],
    conditionLogic: 'and',
    notificationChannels: [
      { _key: 'notif-email', channelType: 'email', recipients: ['admin@nxgen.tech', 'it@nxgen.tech'], template: 'Certificate Expiry Warning - {{station_name}}\n\nCertificate: {{cert_name}}\nDomain: {{domain}}\nDays remaining: {{value}}\nExpires: {{expiry_date}}\n\nAction: Renew certificate before expiration.' },
    ],
    escalationRules: [
      { _key: 'esc-step-1', step: 1, afterDuration: '168h', escalateTo: 'it-manager', severityOverride: 'critical' },
    ],
    applicableStationTypes: ['tower', 'building', 'remote', 'datacenter', 'mobile', 'industrial'],
    cooldownPeriod: '24h',
    autoResolve: false,
    enabled: true,
    tags: ['system', 'security', 'ssl', 'certificate'],
    body: [
      createBlock('body-intro', 'normal', 'Certificate Expiry alerts provide advance warning when SSL/TLS certificates are approaching expiration.'),
      createBlock('body-thresholds-h2', 'h2', 'Default Threshold'),
      createBlock('body-threshold', 'normal', '30 days or less before certificate expiration'),
      createBlock('body-setup-h2', 'h2', 'Configuration'),
      createBlock('body-step1', 'normal', 'Navigate to Security > Certificates > Alert Settings'),
      createBlock('body-step2', 'normal', 'Set warning threshold (default: 30 days)'),
      createBlock('body-step3', 'normal', 'Configure certificate discovery for automatic monitoring'),
      createCallout('callout-warning', 'warning', 'Renewal Lead Time', 'Allow sufficient time for certificate renewal process, especially for certificates requiring manual approval.'),
    ],
  },
];

async function createAlertTemplate(template) {
  try {
    await client.createOrReplace(template);
    console.log(`  ✓ Created: ${template.name}`);
    return true;
  } catch (err) {
    console.error(`  ✗ Error creating ${template.name}:`, err.message);
    return false;
  }
}

async function seedAlertTemplates() {
  console.log('🌱 Seeding alert templates to Sanity...\n');
  console.log('📡 Project: fjjuacab');
  console.log('📡 Dataset: production\n');

  let created = 0;
  let failed = 0;

  for (const template of alertTemplates) {
    const success = await createAlertTemplate(template);
    if (success) created++;
    else failed++;
  }

  console.log(`\n✅ Seed complete! Created: ${created}, Failed: ${failed}`);
  console.log('\n🌐 Visit your studio at: https://nxgen-docs.sanity.studio/');
}

seedAlertTemplates().catch(console.error);
