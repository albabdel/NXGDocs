import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage as CloudinaryImageType } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cld } from '../../lib/cloudinary';

export interface CloudinaryImageProps {
  /**
   * The public ID of the image in Cloudinary
   */
  publicId: string;
  
  /**
   * Optional width for the image
   */
  width?: number;
  
  /**
   * Optional height for the image
   */
  height?: number;
  
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
   * Whether to use auto-format optimization
   */
  autoFormat?: boolean;
  
  /**
   * Whether to use auto-quality optimization
   */
  autoQuality?: boolean;
  
  /**
   * Custom transformations (will be applied after default optimizations)
   */
  transformations?: (img: CloudinaryImageType) => CloudinaryImageType;
  
  /**
   * Whether to use auto-crop with gravity
   */
  autoCrop?: boolean;
  
  /**
   * Custom gravity for cropping (defaults to autoGravity)
   */
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

/**
 * CloudinaryImage - A reusable component for displaying optimized Cloudinary images
 * 
 * @example
 * ```tsx
 * <CloudinaryImage 
 *   publicId="cld-sample-5" 
 *   width={500} 
 *   height={500}
 *   alt="Sample image"
 * />
 * ```
 */
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  width,
  height,
  alt = '',
  className,
  style,
  autoFormat = true,
  autoQuality = true,
  transformations,
  autoCrop = false,
  gravity = 'auto',
}) => {
  // Create the base image
  let img = cld.image(publicId);

  // Apply format and quality optimizations
  if (autoFormat) {
    img = img.format('auto');
  }
  if (autoQuality) {
    img = img.quality('auto');
  }

  // Apply resize/transform if dimensions are provided
  if (width || height) {
    if (autoCrop) {
      // Auto-crop with gravity
      const gravityQualifier = gravity === 'auto' 
        ? autoGravity() 
        : gravity as any;
      
      img = img.resize(
        auto()
          .gravity(gravityQualifier)
          .width(width || 500)
          .height(height || 500)
      );
    } else {
      // Simple resize
      img = img.resize(
        auto()
          .width(width || 500)
          .height(height || 500)
      );
    }
  }

  // Apply custom transformations if provided
  if (transformations) {
    img = transformations(img);
  }

  return (
    <AdvancedImage
      cldImg={img}
      alt={alt}
      className={className}
      style={style}
    />
  );
};

export default CloudinaryImage;

