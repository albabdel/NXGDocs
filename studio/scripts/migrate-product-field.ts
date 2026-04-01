import {createClient} from '@sanity/client'

const DOCUMENT_TYPES = [
  'doc',
  'release',
  'roadmapItem',
  'article',
  'landingPage',
  'sidebarCategory',
  'update',
  'deviceIntegration',
] as const

const PRODUCT_DEFAULT = 'gcxone'

function createSanityClient() {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const apiToken = process.env.SANITY_API_TOKEN

  if (!projectId) {
    throw new Error('Missing SANITY_PROJECT_ID environment variable')
  }
  if (!apiToken) {
    throw new Error('Missing SANITY_API_TOKEN environment variable')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2025-02-06',
    useCdn: false,
    token: apiToken,
  })
}

function parseArgs() {
  const args = process.argv.slice(2)
  return {
    dryRun: args.includes('--dry-run'),
    help: args.includes('--help') || args.includes('-h'),
  }
}

function printHelp() {
  console.log(`
Usage: npx tsx studio/scripts/migrate-product-field.ts [options]

Options:
  --dry-run    Show what would be migrated without making changes
  -h, --help   Show this help message

Environment Variables:
  SANITY_PROJECT_ID   Sanity project ID (required)
  SANITY_DATASET      Sanity dataset (default: production)
  SANITY_API_TOKEN    Sanity API token with write permissions (required)

Description:
  Migrates all existing documents by setting the 'product' field to 'gcxone'.
  This ensures no content is lost when the product field becomes required.
`)
}

interface MigrationStats {
  type: string
  found: number
  migrated: number
  errors: number
}

async function migrateDocuments(
  client: ReturnType<typeof createClient>,
  type: string,
  dryRun: boolean
): Promise<MigrationStats> {
  const stats: MigrationStats = {type, found: 0, migrated: 0, errors: 0}

  try {
    const query = `*[_type == "${type}" && !defined(product)] {_id, _rev, title}`
    const documents = await client.fetch(query)

    stats.found = documents.length

    if (documents.length === 0) {
      console.log(`  [${type}] No documents need migration`)
      return stats
    }

    console.log(`  [${type}] Found ${documents.length} document(s) without product field`)

    for (const doc of documents) {
      try {
        if (dryRun) {
          console.log(`    [DRY-RUN] Would migrate: ${doc._id} (${doc.title || 'untitled'})`)
          stats.migrated++
        } else {
          await client
            .patch(doc._id)
            .set({product: PRODUCT_DEFAULT})
            .commit()
          console.log(`    Migrated: ${doc._id}`)
          stats.migrated++
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`    Error migrating ${doc._id}: ${message}`)
        stats.errors++
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  Error querying ${type}: ${message}`)
    stats.errors++
  }

  return stats
}

async function verifyMigration(
  client: ReturnType<typeof createClient>,
  type: string
): Promise<number> {
  try {
    const query = `count(*[_type == "${type}" && !defined(product)])`
    const count = await client.fetch(query)
    return count
  } catch {
    return -1
  }
}

async function run() {
  const args = parseArgs()

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  const client = createSanityClient()

  console.log('=== Product Field Migration Script ===')
  console.log(`Mode: ${args.dryRun ? 'DRY-RUN (no changes will be made)' : 'LIVE'}`)
  console.log(`Default product: ${PRODUCT_DEFAULT}`)
  console.log('')

  const allStats: MigrationStats[] = []

  for (const type of DOCUMENT_TYPES) {
    console.log(`\nProcessing ${type}...`)
    const stats = await migrateDocuments(client, type, args.dryRun)
    allStats.push(stats)
  }

  console.log('\n=== Migration Summary ===')

  const totalFound = allStats.reduce((sum, s) => sum + s.found, 0)
  const totalMigrated = allStats.reduce((sum, s) => sum + s.migrated, 0)
  const totalErrors = allStats.reduce((sum, s) => sum + s.errors, 0)

  for (const stats of allStats) {
    console.log(`  ${stats.type}: ${stats.migrated}/${stats.found} migrated${stats.errors > 0 ? ` (${stats.errors} errors)` : ''}`)
  }

  console.log(`\nTotal: ${totalMigrated}/${totalFound} documents ${args.dryRun ? 'would be ' : ''}migrated`)

  if (totalErrors > 0) {
    console.log(`Errors: ${totalErrors}`)
  }

  if (!args.dryRun) {
    console.log('\n=== Verification ===')
    let allClear = true

    for (const type of DOCUMENT_TYPES) {
      const remaining = await verifyMigration(client, type)
      if (remaining < 0) {
        console.log(`  ${type}: Unable to verify`)
      } else if (remaining === 0) {
        console.log(`  ${type}: OK (0 documents without product)`)
      } else {
        console.log(`  ${type}: WARNING - ${remaining} documents still without product`)
        allClear = false
      }
    }

    if (allClear) {
      console.log('\nMigration complete. All documents have product field.')
    } else {
      console.log('\nMigration completed with warnings. Some documents may need manual review.')
    }
  }

  if (totalErrors > 0) {
    process.exit(1)
  }
}

run().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
