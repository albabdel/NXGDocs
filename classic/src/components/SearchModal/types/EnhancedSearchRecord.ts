export type ContentType = 'page' | 'code' | 'image' | 'video' | 'error';

export interface EnhancedSearchRecord {
  id: string;
  type: ContentType;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  section: string;
  category: string;
  tags: string[];
  
  // Code-specific (type === 'code')
  code?: string;
  language?: string;
  filename?: string;
  lineNumber?: number;
  anchor?: string;
  
  // Image-specific (type === 'image')
  alt?: string;
  caption?: string;
  thumbnailUrl?: string;
  fullImageUrl?: string;
  
  // Video-specific (type === 'video')
  videoId?: string;
  startTime?: number;
  endTime?: number;
  videoTitle?: string;
  
  // Error-specific (type === 'error')
  errorCode?: string;
  errorPattern?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  
  // Metadata
  productVersion?: string;
  lastUpdated?: string;
  popularityScore?: number;
}

/**
 * Type guard to check if a record is a code result
 */
export function isCodeResult(record: EnhancedSearchRecord): record is EnhancedSearchRecord & { code: string } {
  return record.type === 'code' && typeof record.code === 'string';
}

/**
 * Type guard to check if a record is an image result
 */
export function isImageResult(record: EnhancedSearchRecord): record is EnhancedSearchRecord & { fullImageUrl: string } {
  return record.type === 'image' && typeof record.fullImageUrl === 'string';
}

/**
 * Type guard to check if a record is a video result
 */
export function isVideoResult(record: EnhancedSearchRecord): record is EnhancedSearchRecord & { videoId: string } {
  return record.type === 'video' && typeof record.videoId === 'string';
}

/**
 * Type guard to check if a record is an error reference
 */
export function isErrorResult(record: EnhancedSearchRecord): record is EnhancedSearchRecord & { errorCode: string } {
  return record.type === 'error' && typeof record.errorCode === 'string';
}
