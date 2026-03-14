const https = require('https');
const fs = require('fs');

const projectId = 'fjjuacab';
const dataset = 'production';
const token = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

const query = encodeURIComponent(`*[_type == "doc"] {
  _id,
  title,
  "slug": slug.current,
  category,
  targetAudience
}`);

const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

https.get(url, {
  headers: { 'Authorization': `Bearer ${token}` }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const docs = JSON.parse(data).result;
    
    const sidebarIds = [
      'index', 'getting-started/what-is-gcxone', 'getting-started/pre-deployment-requirements',
      'getting-started/first-time-login--access', 'getting-started/organization--hierarchy-setup',
      'getting-started/user-management-setup', 'getting-started/quick-start-checklist',
      'quick-start-guide', 'platform-architecture-overview', 'devices/hikvision',
      'devices/dahua', 'devices/axxon', 'devices/camect', 'devices/ajax',
      'devices/add-a-device-to-gcxone', 'devices/axis-ip-camera-2', 'devices/hikproconnect-troubleshoot',
      'devices/hanwha-device-configuration', 'devices/genesis-audio', 'devices/axis-camera-station',
      'devices/axis-communications-family-integration-guide', 'devices/axis-cs-pro',
      'devices/axis-ip-camera', 'devices/dahua-cloud-arc', 'devices/eagle-eye',
      'devices/milestone-gcx-one', 'devices/senstar', 'devices/victron',
      'features/platform/feature-list', 'features/AI---Automation/overview',
      'features/AI---Automation/genie-ai-assistant', 'features/System-Monitoring/healthcheck',
      'features/System-Monitoring/towerguard', 'features/Video-Monitoring/live-view/overview',
      'features/Video-Monitoring/live-view/troubleshooting', 'features/Video-Monitoring/playback/overview',
      'features/Video-Monitoring/playback/troubleshooting', 'features/Video-Monitoring/video-streaming/overview',
      'features/Video-Monitoring/video-streaming/troubleshooting', 'features/Video-Monitoring/video-streaming/configuration',
      'features/Video-Monitoring/ptz-control/overview', 'features/Video-Monitoring/ptz-control/configuration',
      'features/Video-Monitoring/event-clips/overview', 'features/Operational-Modes/local-mode/overview',
      'features/Operational-Modes/local-mode/configuration', 'features/Operational-Modes/audio-routing--conference-mode',
      'features/platform/marketplace', 'platform-fundamentals/cloud-architecture',
      'platform-fundamentals/hierarchy-model', 'platform-fundamentals/what-is-evalink-talos',
      'platform-fundamentals/getting-to-know-talos', 'platform-fundamentals/gcxone--talos-interaction',
      'platform-fundamentals/talos-workflows', 'platform-fundamentals/event-processing',
      'platform-fundamentals/alarm-flow', 'platform-fundamentals/site-synchronization',
      'platform-fundamentals/roles--permissions', 'platform-fundamentals/talos-user-management',
      'platform-fundamentals/inviting-users', 'platform-fundamentals/managing-users',
      'alarm-management/alarm-codes', 'alarm-management/arm-disarm-isolate',
      'alarm-management/event-overflow', 'alarm-management/priority-whitelist-blacklist',
      'alarm-management/redundant-alarms', 'alarm-management/technical-alarms',
      'operator-guide/event-clips', 'operator-guide/handling-alarms', 'operator-guide/live-video',
      'operator-guide/multi-site-monitoring', 'operator-guide/notes-annotations',
      'operator-guide/operator-dashboard', 'operator-guide/performance-metrics',
      'operator-guide/ptz-control', 'operator-guide/shortcuts-tips', 'operator-guide/site-navigation',
      'operator-guide/training-guide', 'operator-guide/video-playback',
      'knowledge-base/compliance', 'knowledge-base/data-privacy', 'knowledge-base/faq',
      'knowledge-base/glossary', 'knowledge-base/integration-guides', 'knowledge-base/migration-guides',
      'knowledge-base/network-requirements', 'knowledge-base/quick-reference'
    ];

    const publishedDocs = docs.filter(d => d.slug && !d._id.startsWith('drafts.'));
    const sanitySlugs = new Set(publishedDocs.map(d => d.slug));

    const inSanityNotSidebar = publishedDocs.filter(d => !sidebarIds.includes(d.slug));
    const inSidebarNotSanity = sidebarIds.filter(id => !sanitySlugs.has(id));

    const slugIssues = publishedDocs.filter(d => {
      const slug = d.slug;
      if (/[A-Z]/.test(slug)) return true;
      if (/[^a-z0-9\-\/]/.test(slug)) return true;
      if (slug.includes('--')) return true;
      return false;
    });

    console.log('=== SANITY vs SIDEBAR ANALYSIS ===\n');
    console.log('Total published Sanity docs:', publishedDocs.length);
    console.log('Total sidebar IDs:', sidebarIds.length);

    console.log('\n--- 1. DOCS IN SANITY BUT NOT IN SIDEBAR (' + inSanityNotSidebar.length + ') ---');
    inSanityNotSidebar.sort((a,b) => a.slug.localeCompare(b.slug)).forEach(d => {
      console.log('  - ' + d.slug);
      console.log('    Title: ' + d.title);
      console.log('    Sanity Category: ' + (d.category || 'null'));
    });

    console.log('\n--- 2. SIDEBAR IDs NOT MATCHING SANITY (' + inSidebarNotSanity.length + ') ---');
    inSidebarNotSanity.forEach(id => console.log('  - ' + id));

    console.log('\n--- 3. SLUG FORMAT ISSUES (' + slugIssues.length + ') ---');
    slugIssues.forEach(d => {
      const issues = [];
      if (/[A-Z]/.test(d.slug)) issues.push('uppercase');
      if (/[^a-z0-9\-\/]/.test(d.slug)) issues.push('special-chars');
      if (d.slug.includes('--')) issues.push('double-hyphen');
      console.log('  - ' + d.slug + ' [' + issues.join(', ') + ']');
    });

    console.log('\n--- 4. CATEGORY MISMATCH ANALYSIS ---');
    const sanityCategories = {};
    publishedDocs.forEach(d => {
      if (d.category) {
        const cat = d.category;
        if (!sanityCategories[cat]) sanityCategories[cat] = [];
        sanityCategories[cat].push(d.slug);
      }
    });

    console.log('\nSanity Categories and their docs:');
    Object.entries(sanityCategories).sort().forEach(([cat, slugs]) => {
      console.log('  "' + cat + '" (' + slugs.length + ' docs)');
    });

    console.log('\nDocs with category=null:');
    publishedDocs.filter(d => !d.category).forEach(d => {
      console.log('  - ' + d.slug + ' (' + d.title + ')');
    });
  });
}).on('error', console.error);
