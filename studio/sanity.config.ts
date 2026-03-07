// studio/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'

// Sections matching the live site sidebar — docs grouped by slug prefix,
// mirroring exactly what appears in the Docusaurus sidebar on production.
const DOC_SECTIONS = [
  {title: 'Getting Started',       prefix: 'getting-started/'},
  {title: 'Devices',               prefix: 'devices/'},
  {title: 'Features',              prefix: 'features/'},
  {title: 'Alarm Management',      prefix: 'alarm-management/'},
  {title: 'Operator Guide',        prefix: 'operator-guide/'},
  {title: 'Installer Guide',       prefix: 'installer-guide/'},
  {title: 'Platform Fundamentals', prefix: 'platform-fundamentals/'},
  {title: 'Reporting',             prefix: 'reporting/'},
  {title: 'Knowledge Base',        prefix: 'knowledge-base/'},
  {title: 'Support',               prefix: 'support/'},
]

export default defineConfig({
  name: 'nxgen-docs',
  title: 'NXGEN Docs',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Documentation Pages grouped by section — mirrors the live sidebar
            S.listItem()
              .title('Documentation Pages')
              .schemaType('doc')
              .child(
                S.list()
                  .title('Documentation Pages')
                  .items([
                    ...DOC_SECTIONS.map(({title, prefix}) =>
                      S.listItem()
                        .title(title)
                        .child(
                          S.documentList()
                            .title(title)
                            .schemaType('doc')
                            .filter(
                              '_type == "doc" && string::startsWith(slug.current, $prefix)'
                            )
                            .params({prefix})
                            .defaultOrdering([
                              {field: 'sidebarPosition', direction: 'asc'},
                              {field: 'title', direction: 'asc'},
                            ])
                        )
                    ),
                    S.divider(),
                    S.listItem()
                      .title('Root / Other')
                      .child(
                        S.documentList()
                          .title('Root / Other')
                          .schemaType('doc')
                          .filter(
                            `_type == "doc" && !(${DOC_SECTIONS.map(
                              ({prefix}) =>
                                `string::startsWith(slug.current, "${prefix}")`
                            ).join(' || ')})`
                          )
                          .defaultOrdering([{field: 'slug', direction: 'asc'}])
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Docs (flat)')
                      .child(
                        S.documentList()
                          .title('All Documentation Pages')
                          .schemaType('doc')
                          .filter('_type == "doc"')
                          .defaultOrdering([{field: 'slug', direction: 'asc'}])
                      ),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem('releaseNote').title('Release Notes'),
            S.documentTypeListItem('article').title('Articles'),
            S.documentTypeListItem('referencePage').title('Reference Pages'),
          ]),
    }),
    visionTool(),
    codeInput(),
    table(),
  ],
  schema: {
    types: schemaTypes,
  },
})
