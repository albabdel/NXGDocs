#!/usr/bin/env node
/**
 * Assign every doc to its correct sidebarCategory based on the sidebars.ts taxonomy.
 *
 * Run from repo root:
 *   node studio/scripts/assign-docs-to-categories.js
 *
 * Idempotent — safe to run multiple times.
 */

import { readFileSync } from 'fs';
import { createClient } from '@sanity/client';

// Load .env manually
try {
  const envPath = new URL('../../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* rely on environment */ }

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const apiToken  = process.env.SANITY_API_TOKEN;
const dataset   = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) { console.error('Missing SANITY_PROJECT_ID'); process.exit(1); }
if (!apiToken)  { console.error('Missing SANITY_API_TOKEN');  process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: '2025-02-06', useCdn: false, token: apiToken });

/** Map doc slug → category _id (stable IDs from seed-sidebar-categories.js) */
const catId = slug => `sidebar-cat-${slug.replace(/[^a-zA-Z0-9]/g, '-')}`;

// ─── Full slug → category mapping derived from sidebars.ts ────────────────────
const DOC_TO_CATEGORY = {

  // ── Getting Started ──────────────────────────────────────────────────────────
  'getting-started/what-is-gcxone':              catId('getting-started'),
  'getting-started/pre-deployment-requirements': catId('getting-started'),
  'getting-started/first-time-login-access':     catId('getting-started'),
  'getting-started/organization-hierarchy-setup':catId('getting-started'),
  'getting-started/user-management-setup':       catId('getting-started'),
  'features/alarm-management-system':            catId('getting-started'),
  'getting-started/quick-start-checklist':       catId('getting-started'),

  // ── Platform Fundamentals / Architecture ─────────────────────────────────────
  'platform-fundamentals/cloud-architecture':    catId('platform-fundamentals/architecture'),
  'platform-fundamentals/hierarchy-model':       catId('platform-fundamentals/architecture'),
  'platform-architecture-overview':              catId('platform-fundamentals/architecture'),

  // ── Platform Fundamentals / Talos Integration ────────────────────────────────
  'platform-fundamentals/what-is-evalink-talos':  catId('platform-fundamentals/talos-integration'),
  'platform-fundamentals/getting-to-know-talos':  catId('platform-fundamentals/talos-integration'),
  'platform-fundamentals/gcxone-talos-interaction':catId('platform-fundamentals/talos-integration'),
  'platform-fundamentals/talos-workflows':         catId('platform-fundamentals/talos-integration'),

  // ── Platform Fundamentals / Core Processes ────────────────────────────────────
  'platform-fundamentals/event-processing':      catId('platform-fundamentals/core-processes'),
  'platform-fundamentals/alarm-flow':            catId('platform-fundamentals/core-processes'),
  'platform-fundamentals/site-synchronization':  catId('platform-fundamentals/core-processes'),

  // ── Platform Fundamentals / User Management ───────────────────────────────────
  'platform-fundamentals/roles-permissions':     catId('platform-fundamentals/user-management'),
  'platform-fundamentals/privilege-deep-dive':   catId('platform-fundamentals/user-management'),
  'platform-fundamentals/talos-user-management': catId('platform-fundamentals/user-management'),
  'platform-fundamentals/inviting-users':        catId('platform-fundamentals/user-management'),
  'platform-fundamentals/managing-users':        catId('platform-fundamentals/user-management'),

  // ── Devices & Integrations (root) ────────────────────────────────────────────
  'devices/add-a-device-to-gcxone':              catId('devices-integrations'),

  // ── Devices / NVR ────────────────────────────────────────────────────────────
  'devices/hikvision':                           catId('devices/nvr'),
  'devices/dahua':                               catId('devices/nvr'),
  'devices/hanwha-device-configuration':         catId('devices/nvr'),
  'devices/eagle-eye':                           catId('devices/nvr'),
  'devices/senstar':                             catId('devices/nvr'),
  'devices/adpro':                               catId('devices/nvr'),
  'devices/autoaid':                             catId('devices/nvr'),
  'devices/bosch':                               catId('devices/nvr'),
  'devices/eneo':                                catId('devices/nvr'),
  'devices/eneoip':                              catId('devices/nvr'),
  'devices/heitel':                              catId('devices/nvr'),
  'devices/honeywell':                           catId('devices/nvr'),
  'devices/miwi-urmet-grundig':                  catId('devices/nvr'),
  'devices/rosenberger':                         catId('devices/nvr'),
  'devices/spykebox':                            catId('devices/nvr'),
  'devices/uniview':                             catId('devices/nvr'),
  'devices/viasys-shieldbox':                    catId('devices/nvr'),

  // ── Devices / IP Camera ───────────────────────────────────────────────────────
  'devices/axis-ip-camera':                      catId('devices/ip-camera'),
  'devices/mobotix':                             catId('devices/ip-camera'),
  'devices/netvu':                               catId('devices/ip-camera'),
  'devices/onvif':                               catId('devices/ip-camera'),
  'devices/vivotek':                             catId('devices/ip-camera'),

  // ── Devices / Cloud VMS ───────────────────────────────────────────────────────
  'devices/Cloud-VMS/hikproconnect-troubleshoot':catId('devices/cloud-vms'),
  'devices/cloud-vms/hikproconnect-troubleshoot':catId('devices/cloud-vms'),
  'devices/dahua-cloud-arc':                     catId('devices/cloud-vms'),
  'devices/axis-camera-station':                 catId('devices/cloud-vms'),
  'devices/axis-communications-family-integration-guide': catId('devices/cloud-vms'),
  'devices/axxon':                               catId('devices/cloud-vms'),
  'devices/avigilon':                            catId('devices/cloud-vms'),
  'devices/avigilon-unity':                      catId('devices/cloud-vms'),
  'devices/geutebruck':                          catId('devices/cloud-vms'),
  'devices/geutebrck':                           catId('devices/cloud-vms'),
  'devices/milestone-gcx-one':                   catId('devices/cloud-vms'),
  'devices/nxg-cloud-nvr':                       catId('devices/cloud-vms'),
  'devices/vivotek-onpremise':                   catId('devices/cloud-vms'),
  'devices/vivotek-vortex':                      catId('devices/cloud-vms'),
  'devices/dc09-alarm-management-system':        catId('devices/cloud-vms'),

  // ── Devices / AI Box ──────────────────────────────────────────────────────────
  'devices/camect':                              catId('devices/ai-box'),
  'devices/davantis':                            catId('devices/ai-box'),
  'devices/ganz':                                catId('devices/ai-box'),
  'devices/dahua-air-shield':                    catId('devices/ai-box'),
  'devices/innovi':                              catId('devices/ai-box'),

  // ── Devices / Router ──────────────────────────────────────────────────────────
  'devices/teltonika':                           catId('devices/router'),
  'devices/teltonika-iot':                       catId('devices/router'),
  'devices/victron':                             catId('devices/router'),
  'devices/efoy-fuel-cell':                      catId('devices/router'),
  'devices/efoy':                                catId('devices/router'),
  'devices/auraigateway':                        catId('devices/router'),

  // ── Devices / PIR CAM ────────────────────────────────────────────────────────
  'devices/dahua-pir-cam':                       catId('devices/pir-cam'),
  'devices/essence-my-shield':                   catId('devices/pir-cam'),
  'devices/reconeyez':                           catId('devices/pir-cam'),

  // ── Devices / Other ───────────────────────────────────────────────────────────
  'devices/ajax':                                catId('devices/other'),
  'devices/genesis-audio':                       catId('devices/other'),
  'genesis-audio':                               catId('devices/other'),

  // ── Platform Features / Video Monitoring ──────────────────────────────────────
  'features/video-monitoring/live-view/overview':            catId('features/video-monitoring'),
  'features/video-monitoring/live-view/troubleshooting':     catId('features/video-monitoring'),
  'features/live-view-advanced-troubleshooting':             catId('features/video-monitoring'),
  'features/video-monitoring/video-streaming/overview':      catId('features/video-monitoring'),
  'features/video-monitoring/video-streaming/configuration': catId('features/video-monitoring'),
  'features/video-monitoring/video-streaming/troubleshooting':catId('features/video-monitoring'),
  'features/video-monitoring/playback/overview':             catId('features/video-monitoring'),
  'features/video-monitoring/playback/troubleshooting':      catId('features/video-monitoring'),
  'features/video-monitoring/ptz-control/overview':          catId('features/video-monitoring'),
  'features/video-monitoring/ptz-control/configuration':     catId('features/video-monitoring'),
  'features/video-monitoring/event-clips/overview':          catId('features/video-monitoring'),
  'features/video-monitoring/multi-monitor':                 catId('features/video-monitoring'),
  'features/video-monitoring/edit-properties':               catId('features/video-monitoring'),
  'alarm-management/arm-disarm-isolate':                     catId('features/video-monitoring'),
  'features/platform/feature-list':                          catId('features/video-monitoring'),

  // ── Platform Features / Alarms & AI ──────────────────────────────────────────
  'features/ai-automation/overview':              catId('features/alarms-ai'),
  'features/auto-stream-new':                     catId('features/alarms-ai'),
  'alarm-management/technical-alarms':            catId('features/alarms-ai'),
  'features/alarms-ai/alarm-mapping':             catId('features/alarms-ai'),
  'features/alarms-ai/workflows':                 catId('features/alarms-ai'),
  'features/alarms-ai/dc09':                      catId('features/alarms-ai'),
  'features/alarms-ai/standard-vs-smart-alarm':   catId('features/alarms-ai'),
  'alarm-management/event-overflow':              catId('features/alarms-ai'),

  // ── Platform Features / Audio ─────────────────────────────────────────────────
  'features/operational-modes/audio-routing-conference-mode': catId('features/audio'),
  'features/audio/speaker-on-help-desk':                      catId('features/audio'),
  'features/audio/audio-io':                                  catId('features/audio'),

  // ── Platform Features / Navigation & Search ───────────────────────────────────
  'features/maps':            catId('features/navigation-search'),
  'features/universal-search':catId('features/navigation-search'),

  // ── Platform Features / Operational Tools ─────────────────────────────────────
  'features/operational-modes/local-mode/overview':      catId('features/operational-tools'),
  'features/operational-modes/local-mode/configuration': catId('features/operational-tools'),
  'features/operational-tools/analytics':                catId('features/operational-tools'),
  'features/operational-tools/tags':                     catId('features/operational-tools'),
  'features/operational-tools/audit':                    catId('features/operational-tools'),
  'features/data-export-import':                         catId('features/operational-tools'),
  'operator-guide/operator-dashboard':                   catId('features/operational-tools'),

  // ── Breakthroughs & Add-ons ───────────────────────────────────────────────────
  'features/nova99x':                            catId('breakthroughs-add-ons'),
  'features/zenmode':                            catId('breakthroughs-add-ons'),
  'features/healthcheck':                        catId('breakthroughs-add-ons'),
  'features/system-monitoring/towerguard':       catId('breakthroughs-add-ons'),
  'features/ai-automation/genie-ai-assistant':   catId('breakthroughs-add-ons'),
  'features/bulkimport':                         catId('breakthroughs-add-ons'),
  'features/customview':                         catId('breakthroughs-add-ons'),
  'features/pulseview':                          catId('breakthroughs-add-ons'),
  'features/timesync':                           catId('breakthroughs-add-ons'),
  'features/platform/marketplace':               catId('breakthroughs-add-ons'),

  // ── Installer Guide / Pre-Installation ───────────────────────────────────────
  'installer-guide/installation-overview':  catId('installer-guide/pre-installation'),
  'installer-guide/environmental':          catId('installer-guide/pre-installation'),
  'installer-guide/network-setup':          catId('installer-guide/pre-installation'),
  'installer-guide/firewall-configuration': catId('installer-guide/pre-installation'),
  'installer-guide/ip-whitelisting':        catId('installer-guide/pre-installation'),
  'installer-guide/bandwidth-requirements': catId('installer-guide/pre-installation'),

  // ── Installer Guide / Installation ────────────────────────────────────────────
  'installer-guide/device-installation': catId('installer-guide/installation'),
  'installer-guide/device-registration': catId('installer-guide/installation'),

  // ── Installer Guide / Post-Installation ──────────────────────────────────────
  'installer-guide/post-installation': catId('installer-guide/post-installation'),
  'installer-guide/troubleshooting':   catId('installer-guide/post-installation'),

  // ── Operator Guide ────────────────────────────────────────────────────────────
  'operator-guide/training-guide':        catId('operator-guide'),
  'operator-guide/multi-site-monitoring': catId('operator-guide'),
  'operator-guide/handling-alarms':       catId('operator-guide'),
  'operator-guide/live-video':            catId('operator-guide'),
  'operator-guide/site-navigation':       catId('operator-guide'),
  'operator-guide/escalation-procedures': catId('operator-guide'),
  'operator-guide/site-management':       catId('operator-guide'),

  // ── Admin Guide ───────────────────────────────────────────────────────────────
  'admin-guide/overview':           catId('admin-guide'),
  'admin-guide/alarm-configuration':catId('admin-guide'),
  'admin-guide/admin-training':     catId('admin-guide'),
  'reporting/reporting-overview':   catId('admin-guide'),
  'reporting/standard-reports':     catId('admin-guide'),
  'reporting/report-sharing':       catId('admin-guide'),
  'reporting/report-troubleshooting':catId('admin-guide'),
  'features/system-health-monitoring':catId('admin-guide'),

  // ── Datasheets & Specs ────────────────────────────────────────────────────────
  'knowledge-base/compliance':         catId('datasheets-specs'),
  'knowledge-base/data-privacy':       catId('datasheets-specs'),
  'knowledge-base/glossary':           catId('datasheets-specs'),
  'knowledge-base/faq':                catId('datasheets-specs'),
  'knowledge-base/image-video-display-issues': catId('datasheets-specs'),
  'knowledge-base/browser-errors':     catId('datasheets-specs'),
  'knowledge-base/integration-guides': catId('datasheets-specs'),
  'knowledge-base/migration-guides':   catId('datasheets-specs'),
  'knowledge-base/network-requirements':catId('datasheets-specs'),
  'knowledge-base/quick-reference':    catId('datasheets-specs'),
};

// ─────────────────────────────────────────────────────────────────────────────

async function run() {
  console.log(`[assign] Fetching all docs from Sanity...`);
  const docs = await client.fetch(
    `*[_type == "doc" && defined(slug.current)]{_id, title, "slug": slug.current, "currentCat": sidebarCategory._ref}`
  );
  console.log(`[assign] Found ${docs.length} docs`);

  let assigned = 0;
  let alreadyCorrect = 0;
  let noMapping = 0;

  const BATCH = 20;
  let pendingPatches = [];

  const flush = async () => {
    if (pendingPatches.length === 0) return;
    const tx = client.transaction();
    for (const { id, catRef } of pendingPatches) {
      tx.patch(id, { set: { sidebarCategory: { _type: 'reference', _ref: catRef } } });
    }
    await tx.commit();
    pendingPatches = [];
  };

  for (const doc of docs) {
    const slug = doc.slug;
    const targetCatId = DOC_TO_CATEGORY[slug];

    if (!targetCatId) {
      noMapping++;
      continue;
    }

    if (doc.currentCat === targetCatId) {
      alreadyCorrect++;
      continue;
    }

    console.log(`  [assign] "${doc.title}" (${slug}) → ${targetCatId}`);
    pendingPatches.push({ id: doc._id, catRef: targetCatId });
    assigned++;

    if (pendingPatches.length >= BATCH) await flush();
  }

  await flush();

  console.log(`
[assign] Done
  Assigned:        ${assigned}
  Already correct: ${alreadyCorrect}
  No mapping:      ${noMapping} (will use slug-based fallback in generation)
`);
}

run().catch(err => { console.error('[assign] Error:', err.message); process.exit(1); });
