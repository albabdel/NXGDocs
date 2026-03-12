import {createElement} from 'react'
import {Iframe} from 'sanity-plugin-iframe-pane'

const SIDEBAR_PREVIEW_INFO = `
<div style="padding: 1.5rem; max-width: 600px;">
  <h3 style="margin: 0 0 1rem; font-size: 1.1rem;">📁 Sidebar Structure</h3>
  <p style="margin: 0 0 1rem; color: var(--card-fg-color-muted); font-size: 0.9rem;">
    This view mirrors the production sidebar. Categories shown here will appear on the live site in the same order.
  </p>
  <p style="margin: 0; color: var(--card-fg-color-muted); font-size: 0.85rem;">
    <strong>To reorder:</strong> Edit the <code>position</code> field on each category.<br/>
    <strong>To nest:</strong> Set the <code>parent</code> reference on child categories.
  </p>
</div>
`

const BASE_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://gcxone.pages.dev'

function getPreviewUrl(document: any): string {
  const slug = document?.slug?.current || ''
  const type = document?._type || 'doc'
  const status = document?.status || 'draft'

  if (!slug) {
    return BASE_URL
  }

  switch (type) {
    case 'doc':
    case 'article':
      return `${BASE_URL}/docs/${slug}`
    case 'releaseNote':
      return `${BASE_URL}/releases/${slug}`
    case 'landingPage':
      return `${BASE_URL}/${slug}`
    case 'referencePage':
      return `${BASE_URL}/docs/${slug}`
    default:
      return `${BASE_URL}/docs/${slug}`
  }
}

function documentWithPreviewViews(S: any) {
  return [
    S.view.form().title('Edit'),
    S.view
      .component(Iframe)
      .title('Preview')
      .options({
        url: (options: {document: any}) => getPreviewUrl(options.document),
        showDisplayUrl: true,
        reloadOnPublish: true,
      })
      .icon(() => '👁️'),
  ]
}

function buildCategoryHierarchy(S: any, categoryId: string) {
  return S.documentList()
    .title('Child Categories')
    .schemaType('sidebarCategory')
    .filter('_type == "sidebarCategory" && parent._ref == $categoryId')
    .params({categoryId})
    .defaultOrdering([{field: 'position', direction: 'asc'}])
    .child((childId: string) => buildCategoryHierarchy(S, childId))
}

function buildCategoryWithDocs(S: any, categoryId: string, categoryTitle: string) {
  return S.list()
    .title(categoryTitle)
    .items([
      S.listItem()
        .title('Documents in this Category')
        .child(
          S.documentList()
            .title('Documents')
            .schemaType('doc')
            .filter('_type == "doc" && sidebarCategory._ref == $categoryId')
            .params({categoryId})
            .defaultOrdering([{field: 'sidebarPosition', direction: 'asc'}])
        ),
      S.listItem()
        .title('Sub-categories')
        .child(buildCategoryHierarchy(S, categoryId)),
    ])
}

export const deskStructure = (S: any) =>
  S.list()
    .title('NXGEN Docs CMS')
    .items([
      S.listItem()
        .title('Sidebar Structure')
        .icon(() => '🗂️')
        .child(
          S.list()
            .title('Sidebar Structure (Mirrors Production)')
            .items([
              S.listItem()
                .title('About This View')
                .child(
                  S.component()
                    .title('Sidebar Structure Info')
                    .component(() => {
                      return createElement('div', {
                        dangerouslySetInnerHTML: {__html: SIDEBAR_PREVIEW_INFO},
                      })
                    })
                ),
              S.listItem()
                .title('Root Categories')
                .child(
                  S.documentList()
                    .title('Root Sidebar Categories')
                    .schemaType('sidebarCategory')
                    .filter('_type == "sidebarCategory" && !defined(parent)')
                    .defaultOrdering([{field: 'position', direction: 'asc'}])
                    .child((categoryId: string, context: any) => {
                      const category = context?.document
                      const title = category?.title || 'Category'
                      return buildCategoryWithDocs(S, categoryId, title)
                    })
                ),
              S.listItem()
                .title('All Categories (Flat)')
                .schemaType('sidebarCategory')
                .child(
                  S.documentList()
                    .title('All Sidebar Categories')
                    .schemaType('sidebarCategory')
                    .filter('_type == "sidebarCategory"')
                    .defaultOrdering([{field: 'position', direction: 'asc'}])
                ),
              S.listItem()
                .title('Sidebar Configurations')
                .schemaType('sidebarConfig')
                .child(
                  S.documentList()
                    .title('Sidebar Configurations')
                    .schemaType('sidebarConfig')
                    .filter('_type == "sidebarConfig"')
                    .defaultOrdering([{field: 'name', direction: 'asc'}])
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Documentation by Sidebar')
        .icon(() => '📚')
        .child(
          S.documentList()
            .title('Sidebar Categories')
            .schemaType('sidebarCategory')
            .filter('_type == "sidebarCategory" && !defined(parent)')
            .defaultOrdering([{field: 'position', direction: 'asc'}])
            .child((categoryId: string) =>
              S.documentList()
                .title('Documents in Category')
                .schemaType('doc')
                .filter('_type == "doc" && sidebarCategory._ref == $categoryId')
                .params({categoryId})
                .defaultOrdering([{field: 'sidebarPosition', direction: 'asc'}])
            )
        ),

      S.listItem()
        .title('All Documents')
        .icon(() => '📄')
        .schemaType('doc')
        .child(
          S.documentList()
            .title('All Documentation')
            .schemaType('doc')
            .filter('_type == "doc"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(documentId =>
              S.document()
                .schemaType('doc')
                .documentId(documentId)
                .views(documentWithPreviewViews(S))
            )
        ),

      S.listItem()
        .title('Drafts')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Drafts by Type')
            .items([
              S.listItem()
                .title('Documentation Drafts')
                .child(
                  S.documentList()
                    .title('Documentation Drafts')
                    .schemaType('doc')
                    .filter('_type == "doc" && status == "draft"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Article Drafts')
                .child(
                  S.documentList()
                    .title('Article Drafts')
                    .schemaType('article')
                    .filter('_type == "article" && status == "draft"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Landing Page Drafts')
                .child(
                  S.documentList()
                    .title('Landing Page Drafts')
                    .schemaType('landingPage')
                    .filter('_type == "landingPage" && status == "draft"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('In Review')
        .icon(() => '🔍')
        .child(
          S.list()
            .title('In Review by Type')
            .items([
              S.listItem()
                .title('Documentation')
                .child(
                  S.documentList()
                    .title('Documentation In Review')
                    .schemaType('doc')
                    .filter('_type == "doc" && status == "review"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Articles')
                .child(
                  S.documentList()
                    .title('Articles In Review')
                    .schemaType('article')
                    .filter('_type == "article" && status == "review"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('Published')
        .icon(() => '✅')
        .child(
          S.list()
            .title('Published by Type')
            .items([
              S.listItem()
                .title('Documentation')
                .child(
                  S.documentList()
                    .title('Published Documentation')
                    .schemaType('doc')
                    .filter('_type == "doc" && status == "published"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Articles')
                .child(
                  S.documentList()
                    .title('Published Articles')
                    .schemaType('article')
                    .filter('_type == "article" && status == "published"')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Release Notes')
                .child(
                  S.documentList()
                    .title('Published Release Notes')
                    .schemaType('releaseNote')
                    .filter('_type == "releaseNote" && status == "published"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Landing Pages')
        .icon(() => '🚀')
        .schemaType('landingPage')
        .child(
          S.documentList()
            .title('All Landing Pages')
            .schemaType('landingPage')
            .filter('_type == "landingPage"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(documentId =>
              S.document()
                .schemaType('landingPage')
                .documentId(documentId)
                .views(documentWithPreviewViews(S))
            )
        ),

      S.listItem()
        .title('Articles')
        .icon(() => '📰')
        .schemaType('article')
        .child(
          S.documentList()
            .title('All Articles')
            .schemaType('article')
            .filter('_type == "article"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(documentId =>
              S.document()
                .schemaType('article')
                .documentId(documentId)
                .views(documentWithPreviewViews(S))
            )
        ),

      S.listItem()
        .title('Release Notes')
        .icon(() => '📋')
        .schemaType('releaseNote')
        .child(
          S.documentList()
            .title('All Release Notes')
            .schemaType('releaseNote')
            .filter('_type == "releaseNote"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .child(documentId =>
              S.document()
                .schemaType('releaseNote')
                .documentId(documentId)
                .views(documentWithPreviewViews(S))
            )
        ),

      S.listItem()
        .title('Reference Pages')
        .icon(() => '📖')
        .schemaType('referencePage')
        .child(
          S.documentList()
            .title('All Reference Pages')
            .schemaType('referencePage')
            .filter('_type == "referencePage"')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child(documentId =>
              S.document()
                .schemaType('referencePage')
                .documentId(documentId)
                .views(documentWithPreviewViews(S))
            )
        ),

      S.divider(),

      S.listItem()
        .title('Organization')
        .icon(() => '🗂️')
        .child(
          S.list()
            .title('Organization')
            .items([
              S.listItem()
                .title('Folders')
                .schemaType('folder')
                .child(S.documentTypeList('folder').title('Folders')),
              S.listItem()
                .title('Tags')
                .schemaType('tag')
                .child(S.documentTypeList('tag').title('Tags')),
              S.listItem()
                .title('Content Templates')
                .schemaType('contentTemplate')
                .child(S.documentTypeList('contentTemplate').title('Templates')),
            ])
        ),

      S.listItem()
        .title('Import/Export')
        .icon(() => '📥')
        .schemaType('importJob')
        .child(S.documentTypeList('importJob').title('Import Jobs')),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item: {getId: () => string | null}) =>
          ![
            'doc',
            'article',
            'releaseNote',
            'referencePage',
            'folder',
            'tag',
            'contentTemplate',
            'importJob',
            'landingPage',
            'sidebarCategory',
            'sidebarConfig',
          ].includes(item.getId() || '')
      ),
    ])
