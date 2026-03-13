const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sksGSY5ZhiL9k4I8Pkt4hsaSi546BiGYRAGbP7TYHAF6tcNXV6f5xAKSpNjL7Qr8FPGBvVA4GX5xzFKAE65rWV26JKeWnSJfJjtnNX8dtcMBcmrjKp9ujPnKHMhhszjR3pj2MXCBxPj3DIosHjDlX14OFBbEEwG1RkPliTbTdAjyCC7tQG2i',
  useCdn: false,
})

const releases = [
  {
    _id: 'release-2026-03-a',
    _type: 'release',
    displayTitle: 'March 2026 Release A',
    sprintId: 'Sprint 2026.03-A',
    slug: { _type: 'slug', current: 'sprint-2026-03-a' },
    publishedAt: '2026-03-07',
    summary: 'Alarm management improvements and new reporting filters for faster incident response.',
    items: [
      { _type: 'releaseItem', _key: 'item1', title: 'New alarm grouping view', changeType: 'improvement', affectedAreas: ['alarm-management'] },
      { _type: 'releaseItem', _key: 'item2', title: 'Bulk acknowledge alarms', changeType: 'improvement', affectedAreas: ['alarm-management'] },
      { _type: 'releaseItem', _key: 'item3', title: 'Report filter persistence', changeType: 'fix', affectedAreas: ['reporting'] },
    ],
  },
  {
    _id: 'release-2026-02-b',
    _type: 'release',
    displayTitle: 'February 2026 Release B',
    sprintId: 'Sprint 2026.02-B',
    slug: { _type: 'slug', current: 'sprint-2026-02-b' },
    publishedAt: '2026-02-21',
    summary: 'Device configuration and operator guide updates.',
    items: [
      { _type: 'releaseItem', _key: 'item1', title: 'Bulk device configuration', changeType: 'feature', affectedAreas: ['devices'] },
      { _type: 'releaseItem', _key: 'item2', title: 'Installer guide restructure', changeType: 'improvement', affectedAreas: ['installer-guide'] },
      { _type: 'releaseItem', _key: 'item3', title: 'Platform SSO login fix', changeType: 'fix', affectedAreas: ['platform-fundamentals'] },
    ],
  },
  {
    _id: 'release-2026-02-a',
    _type: 'release',
    displayTitle: 'February 2026 Release A',
    sprintId: 'Sprint 2026.02-A',
    slug: { _type: 'slug', current: 'sprint-2026-02-a' },
    publishedAt: '2026-02-07',
    summary: 'API integrations and knowledge base improvements.',
    items: [
      { _type: 'releaseItem', _key: 'item1', title: 'Webhook retry logic', changeType: 'improvement', affectedAreas: ['api'] },
      { _type: 'releaseItem', _key: 'item2', title: 'Knowledge base search index', changeType: 'improvement', affectedAreas: ['knowledge-base'] },
    ],
  },
]

const roadmapItems = [
  { _id: 'roadmap-1', _type: 'roadmapItem', title: 'Bulk device configuration', description: 'Allow operators to configure multiple devices simultaneously from a single panel — reduces setup time for large deployments.', status: 'Shipped', businessValue: 'Reduces device setup time by 80% for deployments with 50+ devices.', changeType: 'feature', uiChange: true, entitiesImpacted: ['Devices', 'Admin'], projectedRelease: 'Q1 2026', releaseRef: { _type: 'reference', _ref: 'release-2026-02-b' } },
  { _id: 'roadmap-2', _type: 'roadmapItem', title: 'New alarm grouping view', description: 'Group active alarms by zone or device type for faster operator triage.', status: 'Shipped', businessValue: 'Reduces mean time to acknowledge alarms by 40% in high-volume environments.', changeType: 'improvement', uiChange: true, entitiesImpacted: ['Alarm Management', 'Operators'], projectedRelease: 'Q1 2026', releaseRef: { _type: 'reference', _ref: 'release-2026-03-a' } },
  { _id: 'roadmap-3', _type: 'roadmapItem', title: 'Advanced reporting filters', description: 'Date range, custom field filters, and filter preset saving for reports.', status: 'In Progress', businessValue: 'Reduces manual data export effort by 60% for weekly reporting workflows.', changeType: 'feature', uiChange: true, entitiesImpacted: ['Reporting'], projectedRelease: 'Q2 2026' },
  { _id: 'roadmap-4', _type: 'roadmapItem', title: 'API rate limit visibility', description: 'Show current API usage and rate limit status in the developer dashboard.', status: 'In Progress', businessValue: 'Prevents unexpected API throttling by giving integrators real-time usage visibility.', changeType: 'improvement', uiChange: false, entitiesImpacted: ['API / Integrations'], projectedRelease: 'Q2 2026' },
  { _id: 'roadmap-5', _type: 'roadmapItem', title: 'Multi-language support (Phase 1)', description: 'UI language switching for English and Spanish — targeted at Latin American market.', status: 'Planned', businessValue: 'Opens the platform to Spanish-speaking operators; required for two pending enterprise contracts.', changeType: 'feature', uiChange: true, entitiesImpacted: ['Platform Fundamentals', 'Operators'], projectedRelease: 'Q3 2026' },
  { _id: 'roadmap-6', _type: 'roadmapItem', title: 'Automated compliance report generation', description: 'Schedule and auto-generate compliance reports in PDF format on a weekly or monthly cadence.', status: 'Planned', businessValue: 'Eliminates 4+ hours/month of manual report preparation for compliance teams.', changeType: 'feature', uiChange: true, entitiesImpacted: ['Reporting', 'Admin'], projectedRelease: 'Q3 2026' },
  { _id: 'roadmap-7', _type: 'roadmapItem', title: 'Operator shift handover notes', description: 'Structured handover notes field that operators complete at end-of-shift, attached to the active alarm queue state.', status: 'Planned', businessValue: 'Reduces missed alarms during shift changeover — top feedback item from Q4 customer survey.', changeType: 'feature', uiChange: true, entitiesImpacted: ['Alarm Management', 'Operators'], projectedRelease: 'Q4 2026' },
]

async function populate() {
  console.log('Creating releases...')
  for (const release of releases) {
    await client.createOrReplace(release)
    console.log(`  Created: ${release.displayTitle}`)
  }

  console.log('\nCreating roadmap items...')
  for (const item of roadmapItems) {
    await client.createOrReplace(item)
    console.log(`  Created: ${item.title} [${item.status}]`)
  }

  console.log('\nVerifying references...')
  const result = await client.fetch(`*[_type == "roadmapItem" && defined(releaseRef)]{"title": title, "releaseSlug": releaseRef->slug.current}`)
  console.log('GROQ query result:', JSON.stringify(result, null, 2))
  console.log(`\nExpected: 2 results with releaseSlug strings. Got: ${result.length} results.`)
}

populate().catch(console.error)
