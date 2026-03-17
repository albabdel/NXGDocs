// studio/sanity.config.ts - Minimal configuration for faster builds
import {defineConfig, type DocumentBadgeComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {colorInput} from '@sanity/color-input'
import {dashboardTool, projectInfoWidget, projectUsersWidget} from '@sanity/dashboard'
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {unsplashAssetSource} from 'sanity-plugin-asset-source-unsplash'
import {iconPicker} from 'sanity-plugin-icon-picker'
import {muxInput} from 'sanity-plugin-mux-input'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './src/structure'
import {NxgenLogo} from './src/components/NxgenBranding'
import {duplicateAction, exportMarkdownAction, exportJSONAction, publishToAllAction, archiveAction, processImportAction, resetImportAction} from './src/documentActions'

const StatusBadge: DocumentBadgeComponent = ({published, draft}) => {
  const doc = published || draft
  const status = (doc as {status?: string} | null)?.status ?? 'draft'

  if (status === 'published') {
    return {label: 'Published', color: 'success'}
  }
  if (status === 'review') {
    return {label: 'In Review', color: 'warning'}
  }
  if (status === 'approved') {
    return {label: 'Approved', color: 'success'}
  }
  if (status === 'archived') {
    return {label: 'Archived', color: 'primary'}
  }
  return {label: 'Draft', color: 'primary'}
}

const initialValueTemplates = [
  {
    id: 'doc-default',
    title: 'Documentation Page',
    schemaType: 'doc',
    value: {
      status: 'draft',
      targetAudience: ['all'],
      sidebarPosition: 99,
    },
  },
  {
    id: 'article-default',
    title: 'Article',
    schemaType: 'article',
    value: {
      status: 'draft',
      featured: false,
    },
  },
  {
    id: 'sprint-release-default',
    title: 'Sprint Release',
    schemaType: 'release',
    value: {},
  },
  {
    id: 'landing-page-default',
    title: 'Landing Page',
    schemaType: 'landingPage',
    value: {
      status: 'draft',
      layoutType: 'standard',
      showBackground: true,
    },
  },
]

export default defineConfig({
  name: 'nxgen-docs',
  title: 'NXGEN Docs',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN,

  plugins: [
    structureTool({
      structure: deskStructure,
    }),

    visionTool({
      defaultApiVersion: '2024-01-01',
    }),

    codeInput({
      codeModes: [
        {name: 'javascript', title: 'JavaScript'},
        {name: 'typescript', title: 'TypeScript'},
        {name: 'python', title: 'Python'},
        {name: 'json', title: 'JSON'},
        {name: 'bash', title: 'Bash'},
        {name: 'yaml', title: 'YAML'},
      ],
    }),

    table(),

    colorInput(),

    iconPicker(),

    media({
      creditLine: {
        enabled: true,
      },
      directUploads: true,
    }),

    muxInput({
      mp4Support: 'standard',
      muxToken: process.env.SANITY_STUDIO_MUX_TOKEN_ID,
      muxSecretKey: process.env.SANITY_STUDIO_MUX_SECRET_KEY,
    }),

    dashboardTool({
      title: 'Dashboard',
      widgets: [
        projectInfoWidget({
          layout: {width: 'half'},
        }),
        projectUsersWidget({
          layout: {width: 'half'},
        }),
        documentListWidget({
          title: 'Recent Documents',
          layout: {width: 'full'},
          order: '_updatedAt desc',
          limit: 10,
          types: ['doc', 'article', 'landingPage', 'release', 'roadmapItem'],
        }),
        documentListWidget({
          title: 'Drafts',
          layout: {width: 'half'},
          order: '_updatedAt desc',
          limit: 5,
          types: ['doc', 'article', 'landingPage'],
          filter: 'status == "draft"',
        }),
        documentListWidget({
          title: 'Recently Published',
          layout: {width: 'half'},
          order: '_updatedAt desc',
          limit: 5,
          types: ['doc', 'article', 'landingPage', 'release', 'roadmapItem'],
          filter: 'status == "published"',
        }),
      ],
    }),
  ],

  form: {
    image: {
      assetSources: [unsplashAssetSource, mediaAssetSource],
      directUploads: true,
    },
    file: {
      assetSources: [mediaAssetSource],
      directUploads: true,
    },
  },

  schema: {
    types: schemaTypes,
  },

  document: {
    badges: [StatusBadge],
    actions: (prev, {schemaType}) => {
      if (schemaType === 'importJob') {
        return [processImportAction, resetImportAction, ...prev]
      }
      const typesWithCustomActions = ['doc', 'article', 'release', 'roadmapItem', 'landingPage', 'referencePage']
      if (typesWithCustomActions.includes(schemaType as string)) {
        return [
          ...prev,
          duplicateAction,
          exportMarkdownAction,
          exportJSONAction,
          publishToAllAction,
          archiveAction,
        ]
      }
      return prev
    },
  },

  studio: {
    components: {
      logo: NxgenLogo,
    },
  },

  // @ts-ignore
  templates: (prev: unknown[]) => [
    ...initialValueTemplates,
    ...prev.filter(
      (t: any) => !initialValueTemplates.some((it) => it.schemaType === t.schemaType)
    ),
  ],
})
