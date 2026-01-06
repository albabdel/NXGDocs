import React, { useState, useRef, useEffect } from 'react';
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
  preload = 'auto', // Changed default to 'auto' for better loading
  transformations,
  format = 'mp4', // Force MP4 for better compatibility and metadata loading
  quality = 'auto',
}) => {
  const [isLoading, setIsLoading] = useState(false); // Start as false, only show loading when actually loading
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create the base video
  let video = cld.video(publicId);

  // Apply format - use MP4 for better compatibility and metadata loading
  if (format === 'auto') {
    // Force MP4 for better compatibility and proper metadata
    video = video.format('mp4');
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

  // Handle video events through DOM with retry mechanism
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let videoElement: HTMLVideoElement | null = null;
    let cleanup: (() => void) | null = null;

    // Wait for video element to be available (AdvancedVideo might render async)
    const setupVideoListeners = () => {
      videoElement = container.querySelector('video') as HTMLVideoElement;
      
      if (!videoElement) {
        // Retry after a short delay
        setTimeout(setupVideoListeners, 100);
        return;
      }

      // Check if already loaded - if so, don't show loading
      if (videoElement.readyState >= 2) {
        setIsLoading(false);
      } else {
        // Only show loading if video is actually loading
        setIsLoading(true);
      }

      const handleLoadedMetadata = () => {
        setIsLoading(false);
        setHasError(false);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handleCanPlayThrough = () => {
        setIsLoading(false);
      };

      const handleError = (e: Event) => {
        setIsLoading(false);
        setHasError(true);
        console.error('Video error:', e);
      };

      const handleLoadStart = () => {
        setIsLoading(true);
        setHasError(false);
      };

      const handleWaiting = () => {
        setIsLoading(true);
      };

      const handlePlaying = () => {
        setIsLoading(false);
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('waiting', handleWaiting);
      videoElement.addEventListener('playing', handlePlaying);

      cleanup = () => {
        if (videoElement) {
          videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
          videoElement.removeEventListener('canplay', handleCanPlay);
          videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
          videoElement.removeEventListener('error', handleError);
          videoElement.removeEventListener('loadstart', handleLoadStart);
          videoElement.removeEventListener('waiting', handleWaiting);
          videoElement.removeEventListener('playing', handlePlaying);
        }
      };
    };

    // Start setup
    setupVideoListeners();

    // Fallback timeout - clear loading after 2 seconds if nothing happens
    const fallbackTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (cleanup) cleanup();
      clearTimeout(fallbackTimeout);
    };
  }, [retryCount, publicId]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setHasError(false);
    setIsLoading(true);
    const container = containerRef.current;
    if (container) {
      const videoElement = container.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.load();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full" style={style}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#E8B058] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-white/70">Loading video...</span>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
          <div className="flex flex-col items-center gap-3 p-4">
            <span className="text-sm text-white/70">Failed to load video</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#E8B058] text-black rounded-lg hover:bg-[#E8B058]/80 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
        style={{
          ...style,
          opacity: isLoading && !hasError ? 0.7 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default CloudinaryVideo;

