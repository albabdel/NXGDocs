import {docType} from './doc'
import {releaseNoteType} from './releaseNote'
import {articleType} from './article'
import {referenceType} from './reference'
import {folderType, documentFolderType} from './folder'
import {tagType, tagGroupType} from './tags'
import {
  seoMetadataType,
  analyticsMetadataType,
  publishingMetadataType,
  collaborationMetadataType,
  versionMetadataType,
  importMetadataType,
} from './metadata'
import {
  enhancedImageType,
  enhancedVideoType,
  audioType,
  embedType,
  mediaGalleryType,
  animatedImageType,
  gifType,
} from './enhancedMedia'
import {
  importJobType,
  pasteSettingsType,
  contentTemplateType,
} from './importTool'
import {sidebarCategoryType, sidebarConfigType} from './sidebarConfig'
import {
  landingPageType,
  landingSectionVideo,
  landingSectionFeatures,
  landingSectionSteps,
  landingSectionCapabilities,
  landingSectionHierarchy,
  landingSectionTabs,
  landingSectionReleases,
  landingSectionContentGrid,
  landingSectionCTA,
  landingSectionCustom,
} from './landingPage'

export const schemaTypes = [
  // Original document types
  docType,
  releaseNoteType,
  articleType,
  referenceType,
  
  // Landing pages
  landingPageType,
  
  // Landing page sections
  landingSectionVideo,
  landingSectionFeatures,
  landingSectionSteps,
  landingSectionCapabilities,
  landingSectionHierarchy,
  landingSectionTabs,
  landingSectionReleases,
  landingSectionContentGrid,
  landingSectionCTA,
  landingSectionCustom,
  
  // Folder and organization
  folderType,
  documentFolderType,
  
  // Tagging system
  tagType,
  tagGroupType,
  
  // Sidebar configuration
  sidebarCategoryType,
  sidebarConfigType,
  
  // Metadata objects
  seoMetadataType,
  analyticsMetadataType,
  publishingMetadataType,
  collaborationMetadataType,
  versionMetadataType,
  importMetadataType,
  
  // Enhanced media
  enhancedImageType,
  enhancedVideoType,
  audioType,
  embedType,
  mediaGalleryType,
  animatedImageType,
  gifType,
  
  // Import and templates
  importJobType,
  pasteSettingsType,
  contentTemplateType,
]
