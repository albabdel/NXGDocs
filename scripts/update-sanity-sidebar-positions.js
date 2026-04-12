#!/usr/bin/env node
/**
 * Updates sidebarPosition on GCXONE docs in Sanity to match the new 9-section taxonomy.
 *
 * Run:  node scripts/update-sanity-sidebar-positions.js
 *
 * Uses the editor/write token from Keys.md.
 */
'use strict';

const https = require('https');

const PROJECT_ID = 'fjjuacab';
const DATASET    = 'production';
const TOKEN      = 'skrDjnhpDRzNNkD5IgIwEY1c9wiC3JEpfLRqz34aV2U4JQ1JTpHayqmau4LrZzmkig2ekdkfSoHzpJkAOkWVfjjBdmgE3FtPZPl2OchAHjU4pAL3Xe7jxcoAVnKUitg8zmiFgBeYqIoOMS7Ndv0pbwagOubDqRFXLh6LxCbdFqTcJ0yQkVpE';

// slug → sidebarPosition mapping (section * 1000 + item order * 10)
const POSITIONS = {
  // 1. Getting Started
  'getting-started/what-is-gcxone':             1010,
  'getting-started/pre-deployment-requirements': 1020,
  'getting-started/first-time-login-access':    1030,
  'getting-started/organization-setup':         1040,
  'getting-started/user-management-setup':      1050,
  'features/alarm-management-system':           1060,
  'getting-started/quick-start-checklist':      1070,

  // 2. Platform Fundamentals — Architecture
  'platform-fundamentals/cloud-architecture':   2010,
  'platform-fundamentals/hierarchy-model':      2020,
  // Talos Integration
  'platform-fundamentals/what-is-evalink-talos':    2110,
  'platform-fundamentals/getting-to-know-talos':    2120,
  'platform-fundamentals/gcxone-talos-interaction': 2130,
  'platform-fundamentals/talos-workflows':          2140,
  // Core Processes
  'platform-fundamentals/event-processing':    2210,
  'platform-fundamentals/alarm-flow':          2220,
  'platform-fundamentals/site-synchronization': 2230,
  // User Management
  'platform-fundamentals/roles-permissions':     2310,
  'platform-fundamentals/talos-user-management': 2320,
  'platform-fundamentals/inviting-users':        2330,
  'platform-fundamentals/managing-users':        2340,

  // 3. Devices & Integrations
  'devices/add-a-device-to-gcxone':   3000,
  // NVR
  'devices/hikvision':                3110,
  'devices/dahua':                    3120,
  'devices/hanwha-device-configuration': 3130,
  'devices/eagle-eye':                3140,
  'devices/senstar':                  3150,
  'devices/adpro':                    3160,
  'devices/autoaid':                  3170,
  'devices/bosch':                    3180,
  'devices/eneo':                     3190,
  'devices/eneoip':                   3200,
  'devices/heitel':                   3210,
  'devices/honeywell':                3220,
  'devices/miwi-urmet-grundig':       3230,
  'devices/rosenberger':              3240,
  'devices/spykebox':                 3250,
  'devices/uniview':                  3260,
  'devices/viasys-shieldbox':         3270,
  // IP Camera
  'devices/axis-ip-camera':           3310,
  'devices/mobotix':                  3320,
  'devices/netvu':                    3330,
  'devices/onvif':                    3340,
  'devices/vivotek':                  3350,
  // Cloud VMS
  'devices/Cloud VMS/hikproconnect-troubleshoot': 3410,
  'devices/dahua-cloud-arc':          3420,
  'devices/axis-camera-station':      3430,
  'devices/axis-communications-family-integration-guide': 3440,
  'devices/axxon':                    3450,
  'devices/avigilon':                 3460,
  'devices/avigilon-unity':           3470,
  'devices/geutebruck':               3480,
  'devices/milestone-gcx-one':        3490,
  'devices/nxg-cloud-nvr':            3500,
  'devices/vivotek-onpremise':        3510,
  'devices/vivotek-vortex':           3520,
  'devices/dc09-alarm-management-system': 3530,
  // AI Box
  'devices/camect':                   3610,
  'devices/davantis':                 3620,
  'devices/ganz':                     3630,
  'devices/dahua-air-shield':         3640,
  'devices/innovi':                   3650,
  // Router
  'devices/teltonika':                3710,
  'devices/teltonika-iot':            3720,
  'devices/victron':                  3730,
  'devices/efoy-fuel-cell':           3740,
  'devices/efoy':                     3750,
  'devices/auraigateway':             3760,
  // PIR CAM
  'devices/dahua-pir-cam':            3810,
  'devices/essence-my-shield':        3820,
  'devices/reconeyez':                3830,
  // Other
  'devices/ajax':                     3910,
  'devices/genesis-audio':            3920,

  // 4. Platform Features — Video Monitoring
  'features/video-monitoring/live-view/overview':              4010,
  'features/video-monitoring/live-view/troubleshooting':       4020,
  'features/live-view-advanced-troubleshooting':               4030,
  'features/video-monitoring/video-streaming/overview':        4040,
  'features/video-monitoring/video-streaming/configuration':   4050,
  'features/video-monitoring/video-streaming/troubleshooting': 4060,
  'features/video-monitoring/playback/overview':               4070,
  'features/video-monitoring/playback/troubleshooting':        4080,
  'features/video-monitoring/ptz-control/overview':            4090,
  'features/video-monitoring/ptz-control/configuration':       4100,
  'features/video-monitoring/event-clips/overview':            4110,
  'features/video-monitoring/autostream':                      4120,
  'alarm-management/arm-disarm-isolate':                       4130,
  // Alarms & AI
  'features/ai-automation/overview':   4210,
  'features/auto-stream-new':          4220,
  'alarm-management/technical-alarms': 4230,
  'alarm-management/event-overflow':   4240,
  // Audio
  'features/operational-modes/audio-routing-conference-mode': 4310,
  // Navigation & Search
  'features/maps':            4410,
  'features/universal-search': 4420,
  // Operational Tools
  'features/operational-modes/local-mode/overview':      4510,
  'features/operational-modes/local-mode/configuration': 4520,
  'features/data-export-import':     4530,
  'operator-guide/operator-dashboard': 4540,

  // 5. Breakthroughs & Add-ons
  'features/nova99x':                      5010,
  'features/zenmode':                      5020,
  'features/healthcheck':                  5030,
  'features/system-monitoring/towerguard': 5040,
  'features/ai-automation/genie-ai-assistant': 5050,
  'features/bulkimport':                   5060,
  'features/customview':                   5070,
  'features/pulseview':                    5080,
  'features/timesync':                     5090,
  'features/platform/marketplace':         5100,

  // 6. Installer Guide — Pre-Installation
  'installer-guide/installation-overview':  6010,
  'installer-guide/environmental':          6020,
  'installer-guide/network-setup':          6030,
  'installer-guide/firewall-configuration': 6040,
  'installer-guide/ip-whitelisting':        6050,
  'installer-guide/bandwidth-requirements': 6060,
  // Installation
  'installer-guide/device-installation':    6110,
  'installer-guide/device-registration':    6120,
  // Post-Installation
  'installer-guide/post-installation':      6210,
  'installer-guide/troubleshooting':        6220,

  // 7. Operator Guide
  'operator-guide/training-guide':        7010,
  'operator-guide/multi-site-monitoring': 7020,
  'operator-guide/handling-alarms':       7030,
  'operator-guide/live-video':            7040,
  'operator-guide/site-navigation':       7050,

  // 8. Admin Guide
  'operator-guide/site-management':   8010,
  'getting-started/user-management':  8020,
  'reporting/reporting-overview':     8030,
  'features/system-health-monitoring': 8040,

  // 9. Datasheets & Specs
  'knowledge-base/compliance':   9010,
  'knowledge-base/data-privacy': 9020,
  'knowledge-base/glossary':     9030,
  'knowledge-base/faq':          9040,
};

// ─── HTTP helper ─────────────────────────────────────────────────────────────

function sanityRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      },
    };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode}: ${text}`));
        }
        try { resolve(JSON.parse(text)); }
        catch (e) { resolve(text); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  // Fetch all gcxone docs to get their _ids
  const query = encodeURIComponent(
    `*[_type == "doc" && product == "gcxone" && !(_id in path("drafts.**"))] { _id, "slug": slug.current }`
  );
  const result = await sanityRequest('GET', `/v2021-06-07/data/query/${DATASET}?query=${query}`);
  const docs = result.result || [];
  console.log(`Fetched ${docs.length} published GCXONE docs`);

  const mutations = [];

  for (const doc of docs) {
    const slug = doc.slug;
    const position = POSITIONS[slug];
    if (position == null) continue; // not in our map → skip
    mutations.push({
      patch: {
        id: doc._id,
        set: { sidebarPosition: position },
      },
    });
  }

  if (mutations.length === 0) {
    console.log('No docs matched the position map — nothing to update.');
    return;
  }

  console.log(`Patching sidebarPosition on ${mutations.length} docs...`);

  // Sanity mutations API supports up to 100 mutations per request
  const BATCH = 100;
  for (let i = 0; i < mutations.length; i += BATCH) {
    const batch = mutations.slice(i, i + BATCH);
    const res = await sanityRequest(
      'POST',
      `/v2021-06-07/data/mutate/${DATASET}`,
      { mutations: batch }
    );
    const results = res.results || [];
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: ${results.length} docs updated`);
  }

  console.log('Done.');
}

run().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
