#!/usr/bin/env node
/**
 * create-articles-and-update-releases.js
 *
 * 1. Extracts content & images from docx files
 * 2. Creates/updates articles in Sanity (RBAC, AMS, AutoStream, GC Surge)
 * 3. Updates release schema (adds articleUrl to items)
 * 4. Reworks release items to mini-demo format with article links
 * 5. Adds GC Surge release item
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const mammoth = require('mammoth');

// ── Sanity client ────────────────────────────────────────────────────────────
const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'fjjuacab';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_TOKEN =
  process.env.SANITY_API_TOKEN ||
  'skUnLtqPk4csTZ43qSuPkdwRV7bDuSyVsM0J0RWuQWe2sPB4uzX3iLZ5ecqca5nsZG0pzDs3NBcSNrpbqi00UeqyOfUed3Ak99ts46ds2Xzbv3UzAQzySOIN1Mlmm7ayAPDHKbBxq4Fp7dyDFzeB995G9Hfsbm0OII5fJDKXfKGNFp5aEDgx';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-02-06',
  useCdn: false,
  token: API_TOKEN,
});

const ROOT = path.join(__dirname, '..');
const DOCX = {
  rbac: path.join(ROOT, 'RBAC-Documentation-v2 (3).docx'),
  ams: path.join(ROOT, 'GCXONE_AMS_Integration_Guide.docx'),
  autostream: path.join(ROOT, 'GCXONE_AutoStream_Guide.docx'),
};

// ── Helpers ──────────────────────────────────────────────────────────────────
let _keyCounter = 0;
function key() {
  return `k${Date.now().toString(36)}${(++_keyCounter).toString(36)}`;
}

function block(text, style = 'normal', marks = []) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks }],
  };
}

function heading(text, level = 2) {
  return block(text, `h${level}`);
}

function para(text) {
  return block(text, 'normal');
}

function bullet(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function imageBlock(assetId, alt = '') {
  return {
    _type: 'image',
    _key: key(),
    asset: { _type: 'reference', _ref: assetId },
    alt,
  };
}

async function uploadImage(filePath, altText = '') {
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1) || 'png';
    const filename = `${path.basename(filePath, path.extname(filePath))}-${Date.now()}.${ext}`;
    const asset = await client.assets.upload('image', buffer, { filename });
    console.log(`  Uploaded image: ${filename} → ${asset._id}`);
    return asset._id;
  } catch (err) {
    console.error(`  Failed to upload ${filePath}: ${err.message}`);
    return null;
  }
}

async function extractDocxImages(docxPath) {
  const images = [];
  const opts = {
    convertImage: mammoth.images.imgElement(async (image) => {
      const buf = await image.read();
      const ext = (image.contentType || 'image/png').split('/')[1] || 'png';
      const filename = `docx-image-${Date.now()}-${images.length}.${ext}`;
      try {
        const asset = await client.assets.upload('image', buf, {
          filename,
          contentType: image.contentType || 'image/png',
        });
        images.push({ assetId: asset._id, alt: '' });
        console.log(`  Extracted + uploaded docx image → ${asset._id}`);
        return { src: asset.url };
      } catch (e) {
        console.error(`  Image upload failed: ${e.message}`);
        return { src: '' };
      }
    }),
  };
  await mammoth.convertToHtml({ path: docxPath }, opts);
  return images;
}

// ── Article definitions ───────────────────────────────────────────────────────
const NEW_ARTICLES_DIR = path.join(ROOT, 'New articles');

async function buildRBACArticle() {
  console.log('\n Building RBAC article...');

  // Upload user management screenshots
  const imgDir = path.join(NEW_ARTICLES_DIR, 'User management');
  const imgFiles = ['Screenshot 2026-01-03 210046.png', 'Screenshot 2026-01-03 210110.png']
    .map((f) => path.join(imgDir, f))
    .filter(fs.existsSync);

  const imgIds = [];
  for (const f of imgFiles) {
    const id = await uploadImage(f, 'User management screenshot');
    if (id) imgIds.push(id);
  }

  // Extract a few images from docx too
  console.log('  Extracting images from RBAC docx (up to 3)...');
  let docxImgs = [];
  try {
    docxImgs = await extractDocxImages(DOCX.rbac);
    docxImgs = docxImgs.slice(0, 3);
  } catch (e) {
    console.error('  RBAC docx image extraction failed:', e.message);
  }

  const body = [
    heading('What is Role-Based Access Control (RBAC)?', 2),
    para(
      'Role-Based Access Control (RBAC) is the core access management system in GCXONE. It allows administrators to define exactly what each user can do across every module of the platform, and which customers, sites, devices, and sensors they can access — all within a single, guided interface.'
    ),
    heading('Key Capabilities', 2),
    para(
      'The RBAC system combines three core elements into every role: role information (name, description, and default assignment), module privileges (which platform areas a user can access and what they can do within them), and entity access (which customers, sites, and devices a user can operate on).'
    ),
    bullet('Guided Role Wizard — create a complete role in one step-by-step flow'),
    bullet('Per-Module Privileges — granular control across Dashboard, Configuration, Video Activity Search, Marketplace, Video Viewer, Alarm Manager, Map, and Talos'),
    bullet('Dual-Level Entity Access — configure access at the role level AND per individual user, so two users can share a role while having completely different site access'),
    bullet('Include Children Toggle — auto-include all sub-entities under a selected parent, including future additions'),
    bullet('Default Role Toggle — automatically assign a role to all new users upon invitation'),
    bullet('Permission Overrides — add grant or deny overrides for a specific entity without touching the role'),
    bullet('Effective Permissions View — see a user\'s complete permissions, combining direct roles, group roles, and overrides in one place'),
  ];

  if (imgIds.length > 0) body.push(imageBlock(imgIds[0], 'User management interface'));
  body.push(heading('Default Roles', 2));
  body.push(para('GCXONE ships with five built-in default roles that cover the most common operator personas:'));
  body.push(bullet('Super Admin — full platform control, one per tenant, cannot be deleted'));
  body.push(bullet('Admin — manage users, roles, configuration, reports'));
  body.push(bullet('Operator — day-to-day alarm processing and monitoring'));
  body.push(bullet('Installer — manage devices, sensors, and network configuration'));
  body.push(bullet('End User — read-only access to dashboards and basic site functions'));

  body.push(heading('How to Create a Role', 2));
  body.push(para('Navigate to Configuration → Roles and click Add Role. The guided wizard walks you through four steps: set the role name and description, assign users, configure module privileges using the toggle system, and define entity access. Changes save immediately and propagate to all assigned users within seconds.'));

  if (imgIds.length > 1) body.push(imageBlock(imgIds[1], 'Role creation wizard'));

  body.push(heading('Entity Access Modes', 2));
  body.push(para('Three entity access modes let you match every team structure:'));
  body.push(bullet('No Entity Access — no default entities; each user is assigned individually via Edit Entity Access'));
  body.push(bullet('Selected Entities — restrict to a specific list of customers, sites, or devices'));
  body.push(bullet('Full Access — unrestricted access to all entities in the tenant'));

  if (docxImgs.length > 0) body.push(imageBlock(docxImgs[0].assetId, 'Entity access configuration'));

  body.push(heading('Override vs Merge', 2));
  body.push(para('When editing entity access for an individual user, you can choose Override (the user\'s custom selection replaces the role-level defaults entirely) or Merge (the custom entities are added on top of the role\'s existing assignments). Override is useful for restricting a single user to a subset; Merge is useful for temporarily expanding access for a project.'));

  return {
    _id: 'article-rbac-roles-permissions',
    _type: 'article',
    title: 'Roles and Permissions',
    slug: { _type: 'slug', current: 'rbac-roles-permissions' },
    description:
      'A complete guide to GCXONE Role-Based Access Control — create roles, assign module privileges, manage entity access, and control what every user can see and do across the platform.',
    status: 'published',
    publishedAt: '2026-02-28',
    author: 'NXGEN Documentation Team',
    tags: ['RBAC', 'roles', 'permissions', 'access control', 'user management'],
    featured: false,
    body,
  };
}

async function buildAMSArticle() {
  console.log('\n Building AMS Integration article...');

  // Upload alarm flow screenshots
  const imgDir = path.join(NEW_ARTICLES_DIR, 'Alarm flow');
  const releaseDir = path.join(NEW_ARTICLES_DIR, 'Releaes');

  const imgFiles = [
    path.join(imgDir, 'Screenshot 2026-01-02 124613.png'),
    path.join(imgDir, 'Screenshot 2026-01-02 124639.png'),
    path.join(imgDir, 'Screenshot 2026-01-02 124720.png'),
    path.join(releaseDir, 'Release 1.png'),
  ].filter(fs.existsSync);

  const imgIds = [];
  for (const f of imgFiles) {
    const id = await uploadImage(f, 'Alarm management screenshot');
    if (id) imgIds.push(id);
  }

  // Extract images from AMS docx (up to 5)
  console.log('  Extracting images from AMS docx (up to 5)...');
  let docxImgs = [];
  try {
    docxImgs = await extractDocxImages(DOCX.ams);
    docxImgs = docxImgs.slice(0, 5);
  } catch (e) {
    console.error('  AMS docx image extraction failed:', e.message);
  }

  const body = [
    heading('Overview', 2),
    para(
      'GCXONE now supports direct integration with third-party Alarm Management Systems (CMS) directly from the Marketplace. This removes the need for manual protocol configuration — all setup is done within the GCXONE interface. Two integration types are available: DC09-based receivers (Amwin, Lisa, Immix, and any SIA DC-09 compatible system) and Evalink Talos, a cloud-based alarm management platform.'
    ),
  ];

  if (imgIds.length > 0) body.push(imageBlock(imgIds[0], 'Alarm Management System Marketplace'));

  body.push(heading('DC09 Integration', 2));
  body.push(para('SIA DC-09 is the industry-standard IP protocol for transmitting alarm signals from a monitoring system to a Central Monitoring Station (CMS). When an alarm event is triggered in GCXONE, the platform acts as the sending endpoint — packaging the alarm data and forwarding it to the CMS receiver at the configured IP address and port. GCXONE extends the standard DC-09 signal with a secure event link that opens a rich evidence view: pre-event footage, the event frame, post-event footage, and an animated GIF.'));
  body.push(heading('Step 1 — Navigate to the Marketplace', 3));
  body.push(para('Go to Marketplace in the left navigation panel and click the Alarm Management System tab. The section displays all supported receivers with their current configuration status.'));

  if (docxImgs.length > 0) body.push(imageBlock(docxImgs[0].assetId, 'Marketplace Alarm Management System tab'));

  body.push(heading('Step 2 — Configure the CMS Receiver', 3));
  body.push(para('Click Explore on the CMS you want to configure, then click Configure to open the connection dialog. Enter the DC09 Receiver IP Address (the CMS server endpoint) and the DC09 Receiver Port (the TCP port). The same dialog applies to all DC09-based receivers — for unlisted systems, use "Other CMS System" which accepts the same fields.'));

  if (docxImgs.length > 1) body.push(imageBlock(docxImgs[1].assetId, 'CMS configuration dialog'));

  body.push(heading('Step 3 — Map Sites', 3));
  body.push(para('After the CMS receiver is configured, a new Alarm Management System tab appears in each service provider\'s Configuration section. Navigate to Configuration → [Your Service Provider] → Alarm Management System. This table lists every site with its DC09 Account ID, assigned CMS, and connection status (green = configured, red = not mapped).'));

  if (imgIds.length > 1) body.push(imageBlock(imgIds[1], 'Site mapping table'));

  body.push(heading('Step 4 — Set the DC09 Account ID', 3));
  body.push(para('Click the edit icon on any site row. Enter the DC09 Account ID (must exactly match the account identifier on the CMS side) and optionally an Encryption Key to enable encrypted DC09 transmission. Once saved, alarms from that site will be forwarded automatically when triggered.'));

  if (docxImgs.length > 2) body.push(imageBlock(docxImgs[2].assetId, 'Edit IP Configuration dialog'));

  body.push(heading('Evalink Talos Integration', 2));
  body.push(para('Evalink Talos is a cloud-based alarm management platform. After selecting it in the Marketplace, click Configure and enter your Company ID and API Token from your Talos account. The token requires the "API Access" permission scope within Talos. Once configured, alarms triggered in GCXONE automatically appear in Talos as active events ready for operator processing.'));

  if (imgIds.length > 2) body.push(imageBlock(imgIds[2], 'Evalink Talos configuration'));

  body.push(heading('Troubleshooting', 2));
  body.push(bullet('Site shows red indicator — the DC09 Account ID has not been set for that site. Click the edit icon and enter the account ID.'));
  body.push(bullet('Talos credential error — verify the Company ID and API Token. The token must have API Access scope and must not be expired.'));
  body.push(bullet('Alarms not forwarding — check that the CMS receiver IP and port are reachable from the GCXONE cloud. Firewall rules may need updating.'));
  body.push(bullet('Duplicate Account ID — each DC09 Account ID must be unique across all sites. GCXONE blocks duplicate assignments to prevent alarm routing conflicts.'));

  return {
    _id: 'article-ams-integration',
    _type: 'article',
    title: 'CMS Alarm Receiver Integration Guide',
    slug: { _type: 'slug', current: 'cms-alarm-receiver-integration' },
    description:
      'Step-by-step guide to connecting GCXONE to a third-party Alarm Management System (CMS) — covers DC09-based receivers (Amwin, Lisa, Immix) and Evalink Talos cloud integration.',
    status: 'published',
    publishedAt: '2026-03-15',
    author: 'NXGEN Documentation Team',
    tags: ['AMS', 'DC09', 'alarm management', 'Evalink Talos', 'CMS', 'integration'],
    featured: false,
    body,
  };
}

async function buildAutoStreamArticle() {
  console.log('\n Building AutoStream article...');

  // Upload release screenshots
  const releaseDir = path.join(NEW_ARTICLES_DIR, 'Releaes');
  const imgFiles = [
    path.join(releaseDir, 'Release 1.png'),
    path.join(releaseDir, 'Screenshot 2026-01-03 210046.png'),
    path.join(releaseDir, 'Screenshot 2026-01-03 210110.png'),
  ].filter(fs.existsSync);

  const imgIds = [];
  for (const f of imgFiles) {
    const id = await uploadImage(f, 'AutoStream screenshot');
    if (id) imgIds.push(id);
  }

  // Extract images from AutoStream docx (up to 4)
  console.log('  Extracting images from AutoStream docx (up to 4)...');
  let docxImgs = [];
  try {
    docxImgs = await extractDocxImages(DOCX.autostream);
    docxImgs = docxImgs.slice(0, 4);
  } catch (e) {
    console.error('  AutoStream docx image extraction failed:', e.message);
  }

  const body = [
    heading('What is AutoStream?', 2),
    para(
      'AutoStream is an intelligent video streaming automation feature in GCXONE. When a qualifying alarm is triggered and assigned to an operator, AutoStream automatically opens the alarm workflow in Talos and loads the corresponding camera quad in Salvo — no manual searching required. Live streams start immediately for all cameras mapped to the alarm\'s zone, giving operators the visual context they need from the first second of response.'
    ),
  ];

  if (imgIds.length > 0) body.push(imageBlock(imgIds[0], 'AutoStream alarm response workflow'));

  body.push(heading('How It Works', 2));
  body.push(para('When an alarm is received and assigned:'));
  body.push(bullet('The alarm workflow opens automatically in Talos'));
  body.push(bullet('The corresponding alarm quad loads in Salvo (multi-monitor view)'));
  body.push(bullet('Live streams start for all cameras mapped to the alarm\'s zone'));
  body.push(bullet('If no zone is defined, all site cameras stream by default'));
  body.push(bullet('When the alarm is closed or acknowledged, streams stop per Genesis rules'));

  if (docxImgs.length > 0) body.push(imageBlock(docxImgs[0].assetId, 'Talos-Salvo integration view'));

  body.push(heading('Zone-Based Camera Selection', 2));
  body.push(para('AutoStream uses zone definitions from Genesis to determine which cameras should stream. When an alarm fires from a sensor that is mapped to a specific zone, only cameras within that zone begin streaming. This prevents unnecessary bandwidth usage and focuses the operator\'s attention on the most relevant feeds. Zones are managed in the GCX Configuration portal and any changes apply to future alarms only — active alarms retain the zone configuration that was current when they triggered.'));

  if (imgIds.length > 1) body.push(imageBlock(imgIds[1], 'Zone-based camera streaming'));

  body.push(heading('Multi-Monitor Integration', 2));
  body.push(para('AutoStream has a deep integration with the Salvo multi-monitor display system. Four toggle combinations control the exact behavior:'));
  body.push(bullet('Multi-monitor only — alarm workflow opens in Talos, quad loads in Salvo'));
  body.push(bullet('AutoStream only — the current Salvo view is replaced by the alarm quad'));
  body.push(bullet('Both enabled — full integration: workflow in Talos + alarm quad in Salvo'));
  body.push(bullet('Both disabled — manual mode, operators select feeds manually'));

  if (docxImgs.length > 1) body.push(imageBlock(docxImgs[1].assetId, 'Multi-monitor toggle configuration'));

  body.push(heading('Setting Up AutoStream', 2));
  body.push(para('Admin configuration steps:'));
  body.push(bullet('Login as Admin and navigate to Auto Streaming Settings'));
  body.push(bullet('Enable or disable auto streaming globally for the tenant'));
  body.push(bullet('Select which alarm types trigger automatic streaming'));
  body.push(bullet('Configure streaming permission by role — operators without permission cannot access streams'));
  body.push(bullet('Optionally configure zone definitions in the Zones page'));

  if (imgIds.length > 2) body.push(imageBlock(imgIds[2], 'AutoStream settings panel'));

  body.push(heading('Drag & Drop for Salvo', 2));
  body.push(para('Operators can manually load any site or device into the Salvo grid by dragging it from the site list. Dropping a second item onto an occupied slot replaces the existing stream. This provides flexible manual control alongside the automatic streaming behaviour, useful for expanding the view or monitoring additional cameras during an active alarm.'));

  body.push(heading('Activity Logging', 2));
  body.push(para('All streaming activity is logged with full details: alarm ID, site, camera list, operator username, start/stop timestamps, and any permission denials. Streaming failures are also captured to simplify troubleshooting. Logs are accessible in the Admin audit section.'));

  return {
    _id: 'article-autostream-guide',
    _type: 'article',
    title: 'AutoStream: Automatic Camera Streaming on Alarm',
    slug: { _type: 'slug', current: 'autostream-guide' },
    description:
      'How AutoStream automatically triggers live camera streams when alarms fire — zone-based selection, Talos-Salvo multi-monitor integration, drag-and-drop controls, and admin configuration.',
    status: 'published',
    publishedAt: '2026-03-15',
    author: 'NXGEN Documentation Team',
    tags: ['AutoStream', 'video streaming', 'alarms', 'Salvo', 'Talos', 'multi-monitor'],
    featured: true,
    body,
  };
}

function buildGCSurgeArticle() {
  console.log('\n Building GC Surge placeholder article...');

  const body = [
    heading('GC Surge — Coming Soon', 2),
    para(
      'GC Surge is an upcoming high-performance feature for GCXONE that dramatically increases alarm processing throughput during peak demand periods. This article will be updated with full documentation when the feature launches.'
    ),
    heading('What to Expect', 2),
    bullet('Intelligent load balancing across alarm processing nodes'),
    bullet('Priority queuing for critical alarm types during surge conditions'),
    bullet('Real-time throughput monitoring and automatic scaling'),
    bullet('Configurable surge thresholds by tenant and alarm category'),
    bullet('Full audit trail of surge events and processing decisions'),
    heading('Current Status', 2),
    para(
      'GC Surge is currently in development. Planned release: Q2 2026. Contact your NXGEN account manager for early access information.'
    ),
  ];

  return {
    _id: 'article-gc-surge',
    _type: 'article',
    title: 'GC Surge — High-Performance Alarm Processing',
    slug: { _type: 'slug', current: 'gc-surge' },
    description:
      'GC Surge intelligently scales alarm processing capacity during peak demand periods, ensuring no alarm is delayed regardless of load. Coming Q2 2026.',
    status: 'published',
    publishedAt: '2026-03-15',
    author: 'NXGEN Documentation Team',
    tags: ['GC Surge', 'performance', 'alarm processing', 'upcoming'],
    featured: false,
    body,
  };
}

// ── Release item builders ─────────────────────────────────────────────────────

/** March 2026 Release A — reworked items */
function buildMarchReleaseAItems(articleUrls) {
  const autostream = articleUrls['autostream'];
  const ams = articleUrls['ams'];
  const rbac = articleUrls['rbac'];

  return [
    // === AutoStream Features ===
    {
      _key: 'march-a-1',
      title: 'AutoStream: Continuous Alarm Flow',
      description:
        'Alarms now flow without interruption from the Talos CMS into the GCXONE Video Activity Search (VAS). When an alarm is received and assigned, the system immediately opens the operator workflow in Talos and preloads the relevant camera streams in Salvo — all in one seamless sequence. The connection was verified stable through extended high-volume stress testing, with zero drops over a 72-hour monitoring window.',
      changeType: 'feature',
      affectedAreas: ['alarm-management', 'features'],
      articleUrl: autostream,
    },
    {
      _key: 'march-a-2',
      title: 'AutoStream: Operator Alarm Workflow Across Map & Salvo',
      description:
        'When an operator assigns a live alarm in Talos, the alarm now appears simultaneously in both the Map view and the Salvo multi-monitor display. Operators on split-screen setups no longer need to manually navigate between views — the system syncs both displays in under 500ms. This is particularly effective for sites with complex zone layouts where spatial context from the Map view is critical.',
      changeType: 'feature',
      affectedAreas: ['alarm-management', 'features'],
      articleUrl: autostream,
    },
    {
      _key: 'march-a-3',
      title: 'AutoStream: Zone-Based Camera Streaming',
      description:
        'When an alarm fires, AutoStream now identifies which zone the triggering sensor belongs to and streams only the cameras mapped to that zone. This eliminates irrelevant feeds from unrelated areas, reducing cognitive load on operators during critical incidents. If no zone is configured for the alarm, the system falls back to streaming all site cameras to ensure full coverage. Zone changes take effect on future alarms without impacting active ones.',
      changeType: 'feature',
      affectedAreas: ['features', 'alarm-management'],
      articleUrl: autostream,
    },
    {
      _key: 'march-a-4',
      title: 'AutoStream: Multi-Monitor Quad View Integration',
      description:
        'Motion alarms assigned in Talos now automatically trigger a synchronized quad view load in Salvo. The alarm quad — the preset camera layout associated with that alarm — loads in the Salvo grid without any operator input. Admins can configure four modes: multi-monitor only, AutoStream only, both enabled (full integration), or both disabled for manual operation. The mode is configurable per tenant from the Auto Streaming Settings page.',
      changeType: 'feature',
      affectedAreas: ['features', 'alarm-management'],
      articleUrl: autostream,
    },
    {
      _key: 'march-a-5',
      title: 'AutoStream: Drag & Drop for Salvo',
      description:
        'Operators can now drag any site or device from the site tree directly into the Salvo video grid to instantly load its stream. Dropping a second item onto an occupied slot replaces the existing stream without any confirmation dialog. This provides flexible manual override capability alongside automatic streaming — useful when an operator wants to extend their view to additional cameras during an active alarm or routine monitoring.',
      changeType: 'feature',
      affectedAreas: ['features'],
      articleUrl: autostream,
    },

    // === CMS / DC09 Form Fixes ===
    {
      _key: 'march-a-6',
      title: 'CMS Form Validation',
      description:
        'The Evalink Talos configuration form in the Marketplace now validates all required credentials before allowing a save. Empty Company ID or API Token fields trigger inline validation errors that clearly identify which field is missing. The save button is disabled until all required fields pass validation, preventing partial configurations from being submitted.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-7',
      title: 'API Token Field Guidance',
      description:
        'Administrators setting up Evalink Talos integration now see contextual help text directly within the API Token field. The guidance explains exactly where to generate the token within the Talos admin interface (Company → Settings → API) and specifies that the token must have the "API Access" permission scope. This reduces configuration errors and support tickets during first-time setup.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-8',
      title: 'Credential Format Validation',
      description:
        'Invalid or malformed Company ID and API Token values are now caught at the form level before any API call is attempted. The validator checks for minimum length, disallowed characters, and structural format. Rejected values display a clear error message specifying what is wrong and how to correct it, rather than silently failing or showing a generic server error.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-9',
      title: 'DC09 Account ID Requirement',
      description:
        'Site forms now enforce the DC09 Account ID field when a DC09 CMS receiver is configured at the tenant level. Previously, operators could save a site without this field and only discover the missing configuration when alarms failed to forward. The field is now marked required, and the site form cannot be saved until a valid Account ID is provided.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-10',
      title: 'Duplicate DC09 Account ID Prevention',
      description:
        'GCXONE now detects when a DC09 Account ID is already assigned to another site within the same tenant and blocks the duplicate assignment. Account IDs must be unique because the CMS uses this value to route incoming alarms — a duplicate would cause alarm signals to be delivered to the wrong site context. The error message names the conflicting site, making it easy to resolve.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-11',
      title: 'DC09 Account ID Field Guidance',
      description:
        'Site configuration forms now include a contextual help tooltip for the DC09 Account ID field. The tooltip explains what the Account ID is (the unique identifier for this site on the CMS receiver side), where to find it in the CMS interface, and the format requirements. This is particularly useful during bulk site migration where operators may be unfamiliar with the DC09 account numbering system used by their CMS provider.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-12',
      title: 'IP Address & Port Validation',
      description:
        'CMS receiver configuration now validates the IP address and port format before saving. The IP address field rejects values that are not valid IPv4 or IPv6 addresses, and the port field accepts only numeric values between 1 and 65535. This prevents silent misconfigurations that would cause alarms to fail to forward without any obvious error at configuration time.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-13',
      title: 'CMS-Specific Required Fields Enforcement',
      description:
        'Each CMS integration type now enforces its own set of required fields on save. DC09-based receivers require IP address and port; Evalink Talos requires Company ID and API Token. Fields that are not applicable to the selected CMS type are hidden, and only the relevant required fields block the save action. This makes the configuration experience cleaner and reduces the chance of filling in fields that have no effect.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-14',
      title: 'Validation Errors Block Saving',
      description:
        'A bug where validation errors were displayed but the save action still completed has been resolved. In the previous behaviour, a user could see a red error on a field, click Save anyway, and the form would submit — leaving the system in an inconsistent state. Now, any active validation error on any field prevents the save from completing, and the form scrolls to the first error automatically.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'march-a-15',
      title: 'Actionable Error Messages',
      description:
        'All validation error messages in CMS and site configuration forms have been rewritten to be specific and actionable. Instead of generic messages like "Invalid input", users now see messages such as "DC09 Account ID must be 6–12 alphanumeric characters" or "API Token has expired — regenerate it in Talos under Company → Settings → API". The messages identify the field by name and state exactly what correction is required.',
      changeType: 'fix',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },

    // === RBAC Fixes ===
    {
      _key: 'march-a-16',
      title: 'Privilege Categories Reorganised',
      description:
        'The privileges panel in the role editor has been restructured with logical groupings and clear labels. Previously, privileges were displayed in a flat, alphabetical list that made it difficult to understand scope — some privileges appeared twice due to a deduplication bug. The new layout organises privileges by functional area (e.g., Site Management, Alarm Handling, Video Access), removes duplicates, and uses plain-language labels that match terminology used in the rest of the interface.',
      changeType: 'fix',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'march-a-17',
      title: 'Deny Override Takes Precedence',
      description:
        'A permissions logic bug has been fixed: when an administrator adds a Deny override for a specific entity within a role, that denial now correctly takes precedence over any global grant of that same privilege. Previously, the global grant could override the entity-specific denial, effectively rendering the override useless. The corrected behaviour matches the documented spec: entity-level Deny always wins over role-level Grant for that specific resource.',
      changeType: 'fix',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },

    // === GC Surge ===
    {
      _key: 'march-a-gc-surge',
      title: 'GC Surge — Coming in Q2 2026',
      description:
        'GC Surge is an upcoming feature that intelligently scales alarm processing capacity during peak demand periods. When the platform detects a surge in alarm volume, GC Surge automatically activates priority queuing for critical alarm types and distributes processing load across available nodes to ensure zero alarm delay regardless of throughput. Configuration options will include surge thresholds by tenant, alarm category priority tiers, and real-time monitoring dashboards. Full release is planned for Q2 2026.',
      changeType: 'feature',
      affectedAreas: ['alarm-management', 'platform-fundamentals'],
      articleUrl: '/articles/gc-surge',
    },
  ];
}

/** February 2026 Release B — reworked items */
function buildFebruaryReleaseBItems(articleUrls) {
  const ams = articleUrls['ams'];
  const rbac = articleUrls['rbac'];

  return [
    // === Configuration Management ===
    {
      _key: 'feb-b-1',
      title: 'Device Lifecycle Management',
      description:
        'Devices within a site now support a complete lifecycle from the Configuration app: add a new device by entering its connection details, deactivate it to suspend monitoring without losing configuration, reactivate it to resume, and rediscover it if sensors or channels have changed. The rediscover action reconnects to the physical device and automatically re-adds any sensors that were previously removed. Deleting a device removes all its sensors and channel assignments permanently.',
      changeType: 'feature',
      affectedAreas: ['devices'],
      articleUrl: null,
    },
    {
      _key: 'feb-b-2',
      title: 'Site Lifecycle Management',
      description:
        'Sites under a customer now have full lifecycle controls. Administrators can create multiple sites in a single session, toggle each site between active and inactive status, and delete sites that are no longer needed. When a site is deactivated, all nested devices and sensors are suspended simultaneously — a single action that previously required touching each device individually. Reactivating a site restores all nested entities to their prior state.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: null,
    },
    {
      _key: 'feb-b-3',
      title: 'Sensor Lifecycle Management',
      description:
        'Individual sensors within a device can now be added, removed, activated, and deactivated independently. The same sensor type can be assigned to multiple devices on the same site, which is essential for deployments where several cameras share a common alarm zone definition. Deactivating a sensor stops it from generating alarms without removing its configuration, making it easy to temporarily exclude a faulty sensor during maintenance.',
      changeType: 'feature',
      affectedAreas: ['devices'],
      articleUrl: null,
    },
    {
      _key: 'feb-b-4',
      title: 'Customer & Service Provider Management',
      description:
        'Customers and service providers can now be created, deleted, and toggled active or inactive through the Configuration app. Toggling a service provider to inactive propagates the status change down through all nested customers, sites, devices, and sensors in a single operation. This is particularly useful for billing cycles, onboarding phases, or seasonal suspensions where an entire customer hierarchy needs to be paused without losing any configuration.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: null,
    },
    {
      _key: 'feb-b-5',
      title: 'Device Group Creation',
      description:
        'Administrators can now create named device groups from the Configuration menu and assign specific devices from a site to each group. Device groups serve as reusable targets for role entity access — instead of selecting individual devices when defining a role\'s scope, an admin can assign the group. When new devices are added to the group, all roles that reference it automatically gain access without any manual permission updates.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals', 'devices'],
      articleUrl: rbac,
    },

    // === RBAC System ===
    {
      _key: 'feb-b-6',
      title: 'Role Creation & Persistence',
      description:
        'The new guided role creation wizard allows administrators to define a complete role — name, description, entity access, and module privileges — in a single, linear flow. Roles are saved to the system within 2 seconds and persist correctly across logout and login cycles. The wizard enforces all required fields inline, preventing partial role states from being committed.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-7',
      title: 'Duplicate Role Name Prevention',
      description:
        'Attempting to create a role with a name that already exists within the same tenant is now blocked with a case-insensitive check. The error appears inline as the user types, before they attempt to save — preventing the confusion that occurred when the duplicate was only caught on submission. The check is scoped to the tenant, so the same role name can exist in different tenants without conflict.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-8',
      title: 'Entity Tree Parent/Child Selection',
      description:
        'In the role entity access selector, clicking a parent entity (e.g., a customer) now automatically selects all of its child entities (sites, devices, sensors). Deselecting the parent clears all children simultaneously. A separate "Include Children" toggle extends this further — when enabled, any future entities added under the parent are automatically included in the role\'s access scope without requiring manual updates.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-9',
      title: 'Dynamic Privilege Filtering by Entity',
      description:
        'The module privilege list in the role editor now updates in real-time as entity selections change. When an entity is added or removed from the scope, any privileges that are only relevant to that entity type are shown or hidden accordingly. This prevents administrators from accidentally granting privileges that have no effect given the current entity selection, and makes the privilege list shorter and more readable.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-10',
      title: 'Role Assignment to Users & Groups',
      description:
        'Administrators can now assign roles to users from two places: directly from the user\'s profile page (individual assignment), or from the role\'s Users tab (bulk assignment to multiple users at once). Both assignment methods complete within 5 seconds and take effect immediately — the user\'s permissions change without requiring them to log out and back in. Group-level assignments propagate to all users in the group simultaneously.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-11',
      title: 'Effective Permissions View',
      description:
        'A new Effective Permissions panel on each user\'s profile shows their complete permission set in one place. The panel merges direct role assignments, group role assignments, and any entity-level overrides, presenting the final resolved permissions in a clear, readable format. Administrators can use this view to diagnose unexpected access issues without having to manually trace through every role and group the user belongs to.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-12',
      title: 'Permission Overrides Per Entity',
      description:
        'Within a role, administrators can now add Grant or Deny overrides for a specific entity. A Grant override extends access to a resource that is not covered by the role\'s default entity scope; a Deny override restricts access to a specific resource even when the role would normally allow it. Overrides are visible in the role editor as a distinct list, making them easy to audit and remove.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },
    {
      _key: 'feb-b-13',
      title: 'User-Level Privilege Exclusions',
      description:
        'Administrators can now exclude a specific privilege for an individual user without modifying the user\'s role. This handles the edge case where one user in a shared role needs to be restricted from a single action — previously requiring a separate role to be created just for that user. Exclusions appear on the user\'s profile page and are applied on top of all role and group-level permissions.',
      changeType: 'feature',
      affectedAreas: ['platform-fundamentals'],
      articleUrl: rbac,
    },

    // === AMS / CMS Integration ===
    {
      _key: 'feb-b-14',
      title: 'Marketplace CMS Listing',
      description:
        'The Alarm Management System category in the Marketplace now lists all supported CMS integrations with a clear "Configured / Not Configured" status on each card. Operators can see at a glance which receivers are active and which still need setup. The listing currently includes Amwin, Lisa Security, Immix, Evalink Talos, and a generic "Other CMS System" option for any SIA DC-09 compatible receiver.',
      changeType: 'feature',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'feb-b-15',
      title: 'Evalink Talos Credential Save',
      description:
        'A valid Company ID and API Token for Evalink Talos can now be saved from the Marketplace configuration dialog. The token is stored encrypted and is never exposed in the UI after submission. On next visit to the Talos configuration page, the presence of a saved token is indicated without revealing the value itself. Administrators can revoke and replace the token at any time without affecting in-flight alarm processing.',
      changeType: 'feature',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'feb-b-16',
      title: 'DC09 Account ID Field on Site Forms',
      description:
        'Site configuration forms now include a dedicated DC09 Account ID field. When a DC09 CMS receiver is configured at the tenant level, this field becomes visible and required on every site form. The Account ID must match the identifier assigned to this site in the CMS — it is the key that allows the CMS to route incoming alarms to the correct account and operator queue.',
      changeType: 'feature',
      affectedAreas: ['alarm-management'],
      articleUrl: ams,
    },
    {
      _key: 'feb-b-17',
      title: 'Optional Encryption Key for DC09 Alarms',
      description:
        'Sites can now optionally provide an encryption key in the site configuration form. When set, all DC09 alarm messages forwarded from that site to the CMS are encrypted using the shared key. The encryption follows the SIA DC-09 standard for encrypted transmissions and is compatible with all listed DC09 receivers (Amwin, Lisa, Immix, Other). Sites without an encryption key continue to send unencrypted DC09 signals.',
      changeType: 'feature',
      affectedAreas: ['alarm-management', 'platform-fundamentals'],
      articleUrl: ams,
    },
  ];
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Create Articles & Update Releases ===\n');

  // ── 1. Build & upsert articles ─────────────────────────────────────────────
  console.log('Step 1: Creating articles in Sanity...');

  const rbacArticle = await buildRBACArticle();
  const amsArticle = await buildAMSArticle();
  const autostreamArticle = await buildAutoStreamArticle();
  const gcSurgeArticle = buildGCSurgeArticle();

  const articles = [rbacArticle, amsArticle, autostreamArticle, gcSurgeArticle];

  for (const art of articles) {
    console.log(`\n  Upserting article: "${art.title}" (${art._id})...`);
    try {
      await client.createOrReplace(art);
      console.log(`  ✓ Article created: ${art._id}`);
    } catch (err) {
      console.error(`  ✗ Failed to create article ${art._id}: ${err.message}`);
    }
  }

  // ── 2. Compute article URLs ────────────────────────────────────────────────
  const articleUrls = {
    rbac: `/articles/${rbacArticle.slug.current}`,
    ams: `/articles/${amsArticle.slug.current}`,
    autostream: `/articles/${autostreamArticle.slug.current}`,
    gcSurge: `/articles/${gcSurgeArticle.slug.current}`,
  };
  console.log('\nArticle URLs:', articleUrls);

  // ── 3. Update March 2026 Release A ────────────────────────────────────────
  console.log('\nStep 2: Updating March 2026 Release A...');
  const marchItems = buildMarchReleaseAItems(articleUrls);

  try {
    await client
      .patch('release-sprint-2026-03-a')
      .set({
        items: marchItems,
        summary:
          'AutoStream launches with zone-based camera streaming and multi-monitor Talos-Salvo integration. DC09 CMS form validation hardened with actionable error messages. RBAC permissions logic corrected for deny overrides. GC Surge announced for Q2 2026.',
      })
      .commit();
    console.log('  ✓ March 2026 Release A updated');
  } catch (err) {
    console.error('  ✗ Failed to update March release:', err.message);
  }

  // ── 4. Update February 2026 Release B ─────────────────────────────────────
  console.log('\nStep 3: Updating February 2026 Release B...');
  const febItems = buildFebruaryReleaseBItems(articleUrls);

  try {
    await client
      .patch('release-sprint-2026-02-b')
      .set({
        items: febItems,
        summary:
          'Complete RBAC system ships: guided role wizard, dual-level entity access, effective permissions view, and per-user privilege exclusions. Full device/site/sensor lifecycle management. DC09 CMS integration and Evalink Talos credential management via the Marketplace.',
      })
      .commit();
    console.log('  ✓ February 2026 Release B updated');
  } catch (err) {
    console.error('  ✗ Failed to update February release:', err.message);
  }

  console.log('\n=== Done! ===');
  console.log('Articles created:');
  articles.forEach((a) => console.log(`  - ${a.title}  →  /articles/${a.slug.current}`));
  console.log('\nNext steps:');
  console.log('  1. Update release.ts schema to add articleUrl field');
  console.log('  2. Update fetch script GROQ query');
  console.log('  3. Update ReleaseDetailRenderer to show article links');
  console.log('  4. Run: cd classic && npm run fetch-content');
  console.log('  5. Run: npm run build');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
