import {docType} from './doc'
import {releaseType} from './release'
import {roadmapItemType} from './roadmapItem'
import {updateType} from './update'
import {articleType} from './article'
import {referenceType} from './reference'
import {folderType, documentFolderType} from './folder'
import {deviceProfileType} from './deviceProfile'
import {monitoringStationType} from './monitoringStation'
import {alertTemplateType} from './alertTemplate'
import {integrationType} from './integration'
import {deviceIntegrationType} from './deviceIntegration'
import {apiReferenceType} from './apiReference'
import {tagType, tagGroupType} from './tags'
import {
  seoDefaultsType,
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
import {
  gettingStartedPageType,
  onboardingPhaseType,
  onboardingStepType,
} from './gettingStartedPage'
import {docsIndexConfigType} from './docsIndexConfig'
import {searchSynonymType} from './searchSynonym'
import {adminUserType} from './adminUser'
import {auditLogType} from './auditLog'
import {notificationType} from './notification'
import {workflowConfigType} from './workflowConfig'
import {routeConfigType} from './routeConfig'

export const schemaTypes = [
  routeConfigType,
  adminUserType,
  auditLogType,
  notificationType,
  workflowConfigType,
  searchSynonymType,
  // Original document types
  docType,
  releaseType,
  roadmapItemType,
  updateType,
  articleType,
  referenceType,
  
  // NXGEN Monitoring Station types
  deviceProfileType,
  monitoringStationType,
  alertTemplateType,
  integrationType,
  deviceIntegrationType,
  apiReferenceType,
  
  // Landing pages
  landingPageType,
  gettingStartedPageType,
  docsIndexConfigType,
  
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
  
  // Getting Started page components
  onboardingPhaseType,
  onboardingStepType,
  
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
  seoDefaultsType,
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
