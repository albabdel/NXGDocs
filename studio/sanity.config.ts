// studio/sanity.config.ts
import {defineConfig, type DocumentBadgeComponent, type DocumentActionsComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {media} from 'sanity-plugin-media'
import {colorInput} from '@sanity/color-input'
import {assist} from '@sanity/assist'
import {dashboardTool, projectInfoWidget, projectUsersWidget} from '@sanity/dashboard'
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {documentInternationalization} from '@sanity/document-internationalization'
import {contentGraphView} from 'sanity-plugin-graph-view'
import {tableOfContentsPlugin} from 'sanity-plugin-table-of-contents'
import {unsplashAssetSource} from 'sanity-plugin-asset-source-unsplash'
import {references} from 'sanity-plugin-references'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {muxInput} from 'sanity-plugin-mux-input'
import {iconPicker} from 'sanity-plugin-icon-picker'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './src/structure'
import {NxgenLogo} from './src/components/NxgenBranding'
import {duplicateAction, exportMarkdownAction, exportJSONAction, publishToAllAction, archiveAction} from './src/documentActions'

const SUPPORTED_LANGUAGES = [
  {id: 'en', title: 'English', isDefault: true},
  {id: 'es', title: 'Spanish'},
  {id: 'fr', title: 'French'},
  {id: 'de', title: 'German'},
  {id: 'ja', title: 'Japanese'},
  {id: 'zh', title: 'Chinese'},
]

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
    id: 'release-note-default',
    title: 'Release Note',
    schemaType: 'releaseNote',
    value: {
      status: 'draft',
    },
  },
  {
    id: 'reference-page-default',
    title: 'Reference Page',
    schemaType: 'referencePage',
    value: {
      status: 'draft',
    },
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
  {
    id: 'landing-page-quick-start',
    title: 'Quick Start Landing Page',
    schemaType: 'landingPage',
    value: {
      status: 'draft',
      layoutType: 'quick-start',
      showBackground: true,
    },
  },
  {
    id: 'landing-page-releases',
    title: 'Release Notes Landing Page',
    schemaType: 'landingPage',
    value: {
      status: 'draft',
      layoutType: 'releases',
      showBackground: true,
    },
  },
  {
    id: 'landing-page-internal-releases',
    title: 'Internal Releases Landing Page',
    schemaType: 'landingPage',
    value: {
      status: 'draft',
      layoutType: 'internal-releases',
      showBackground: true,
    },
  },
]

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://gcxone.pages.dev'

function getPreviewPath(document: {slug?: {current?: string}; _type?: string; _id?: string}): string {
  const slug = document?.slug?.current || document?._id?.replace('drafts.', '') || ''
  const type = document?._type || 'doc'

  switch (type) {
    case 'doc':
    case 'article':
      return `/docs/${slug}`
    case 'releaseNote':
      return `/releases/${slug}`
    case 'landingPage':
      return `/${slug}`
    case 'referencePage':
      return `/reference/${slug}`
    default:
      return `/docs/${slug}`
  }
}

export default defineConfig({
  name: 'nxgen-docs',
  title: 'NXGEN Docs',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN,

  plugins: [
    presentationTool({
      title: 'Visual Editor',
      previewUrl: {
        previewMode: {
          enable: true,
        },
        origin: PREVIEW_URL,
        locate: {
          doc: (document: any) => ({
            url: `${PREVIEW_URL}${getPreviewPath(document)}?preview=true`,
          }),
          article: (document: any) => ({
            url: `${PREVIEW_URL}${getPreviewPath(document)}?preview=true`,
          }),
          releaseNote: (document: any) => ({
            url: `${PREVIEW_URL}${getPreviewPath(document)}?preview=true`,
          }),
          landingPage: (document: any) => ({
            url: `${PREVIEW_URL}${getPreviewPath(document)}?preview=true`,
          }),
          referencePage: (document: any) => ({
            url: `${PREVIEW_URL}${getPreviewPath(document)}?preview=true`,
          }),
        },
      },
    }),

    structureTool({
      structure: deskStructure,
    }),

    visionTool({
      defaultApiVersion: '2024-01-01',
      defaultDataset: 'production',
    }),

    codeInput({
      codeModes: [
        {name: 'javascript', title: 'JavaScript'},
        {name: 'typescript', title: 'TypeScript'},
        {name: 'python', title: 'Python'},
        {name: 'json', title: 'JSON'},
        {name: 'css', title: 'CSS'},
        {name: 'html', title: 'HTML'},
        {name: 'bash', title: 'Bash'},
        {name: 'markdown', title: 'Markdown'},
        {name: 'yaml', title: 'YAML'},
        {name: 'sql', title: 'SQL'},
      ],
    }),

    table(),

    media({
      csrfToken: process.env.SANITY_API_TOKEN,
    }),

    colorInput(),

    assist({
      defineFieldAssistConfigs: (fieldDef) => {
        return {
          field: fieldDef,
        }
      },
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
          types: ['doc', 'article', 'landingPage', 'releaseNote'],
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
          title: 'In Review',
          layout: {width: 'half'},
          order: '_updatedAt desc',
          limit: 5,
          types: ['doc', 'article', 'landingPage'],
          filter: 'status == "review"',
        }),
        documentListWidget({
          title: 'Recently Published',
          layout: {width: 'full'},
          order: '_updatedAt desc',
          limit: 5,
          types: ['doc', 'article', 'landingPage', 'releaseNote'],
          filter: 'status == "published"',
        }),
      ],
    }),

    documentInternationalization({
      supportedLanguages: SUPPORTED_LANGUAGES,
      schemaTypes: ['doc', 'article', 'landingPage', 'releaseNote'],
    }),

    internationalizedArray({
      languages: SUPPORTED_LANGUAGES,
      defaultLanguages: ['en'],
    }),

    contentGraphView({
      query: `*[_type in ["doc", "article", "landingPage", "releaseNote", "sidebarCategory"]]{
        _id, _type, title, slug, status,
        "references": *[references(^._id)]{_id, _type, title}
      }`,
    }),

    tableOfContentsPlugin({
      documentTypes: ['doc', 'article', 'landingPage', 'releaseNote'],
      fieldNames: ['content', 'body', 'description', 'sections'],
    }),

    references({
      exclude: ['media.tag', 'sanity.imageAsset', 'sanity.fileAsset'],
    }),

    muxInput({
      mp4Support: 'standard',
      additionalFields: [
        {name: 'title', type: 'string', title: 'Title'},
        {name: 'description', type: 'text', title: 'Description'},
      ],
      muxToken: process.env.SANITY_STUDIO_MUX_TOKEN_ID,
      muxSecretKey: process.env.SANITY_STUDIO_MUX_SECRET_KEY,
    }),

    iconPicker(),

    imageHotspotArrayPlugin({}),
  ],

  form: {
    image: {
      assetSources: [unsplashAssetSource],
      directUploads: true,
    },
    file: {
      assetSources: ['upload'],
      directUploads: true,
    },
  },

  schema: {
    types: schemaTypes,
  },

  document: {
    badges: [StatusBadge],
    actions: (prev, {schemaType}) => {
      const typesWithCustomActions = ['doc', 'article', 'releaseNote', 'landingPage', 'referencePage']
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
    newDocumentOptions: (prev, {creationContext}) => {
      const {type} = creationContext
      return prev.filter((template) => {
        if (type === 'global') return true
        return template.templateId?.startsWith(type as string) ?? true
      })
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
