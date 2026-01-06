import React from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import { CloudinaryVideo as CloudinaryVideoType } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { cld } from '../../lib/cloudinary';

export interface CloudinaryVideoProps {
  /**
   * The public ID of the video in Cloudinary
   */
  publicId: string;
  
  /**
   * Optional width for the video
   */
  width?: number;
  
  /**
   * Optional height for the video
   */
  height?: number;
  
  /**
   * Optional poster image (thumbnail) public ID
   */
  poster?: string;
  
  /**
   * Optional alt text for accessibility
   */
  alt?: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Optional style object
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to show video controls
   */
  controls?: boolean;
  
  /**
   * Whether to autoplay the video
   */
  autoplay?: boolean;
  
  /**
   * Whether to loop the video
   */
  loop?: boolean;
  
  /**
   * Whether to mute the video
   */
  muted?: boolean;
  
  /**
   * Whether to show the video inline (for mobile)
   */
  playsInline?: boolean;
  
  /**
   * Preload strategy: 'none' | 'metadata' | 'auto'
   */
  preload?: 'none' | 'metadata' | 'auto';
  
  /**
   * Custom transformations (will be applied after default optimizations)
   */
  transformations?: (video: CloudinaryVideoType) => CloudinaryVideoType;
  
  /**
   * Video format: 'auto' will serve the best format for the browser
   */
  format?: 'auto' | 'mp4' | 'webm' | 'ogv';
  
  /**
   * Quality setting: 'auto' | 'best' | 'good' | 'eco' | 'lowest'
   */
  quality?: 'auto' | 'best' | 'good' | 'eco' | 'lowest';
}

/**
 * CloudinaryVideo - A reusable component for displaying optimized Cloudinary videos
 * 
 * @example
 * ```tsx
 * <CloudinaryVideo 
 *   publicId="sample-video" 
 *   width={800}
 *   height={450}
 *   controls={true}
 *   poster="sample-video-poster"
 * />
 * ```
 */
export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  publicId,
  width,
  height,
  poster,
  alt = '',
  className,
  style,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  playsInline = true,
  preload = 'metadata',
  transformations,
  format = 'auto',
  quality = 'auto',
}) => {
  // Create the base video
  let video = cld.video(publicId);

  // Apply format - use auto for best browser compatibility
  if (format === 'auto') {
    video = video.format('auto');
  } else {
    video = video.format(format);
  }

  if (quality === 'auto') {
    video = video.quality('auto');
  } else {
    video = video.quality(quality);
  }

  // Apply resize if dimensions are provided
  if (width || height) {
    video = video.resize(
      auto()
        .width(width || 800)
        .height(height || 450)
    );
  }

  // Apply custom transformations if provided
  if (transformations) {
    video = transformations(video);
  }

  // Get poster URL if provided
  let posterUrl: string | undefined;
  if (poster) {
    const posterImg = cld.image(poster).format('auto').quality('auto');
    posterUrl = posterImg.toURL();
  }

  return (
    <AdvancedVideo
      cldVid={video}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      poster={posterUrl}
      className={className}
      style={style}
    />
  );
};

export default CloudinaryVideo;
