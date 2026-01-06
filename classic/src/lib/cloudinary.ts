import { Cloudinary } from '@cloudinary/url-gen';

/**
 * Cloudinary configuration utility
 * 
 * In Docusaurus, environment variables need to be accessed differently on client vs server.
 * For client-side components, we use a fallback to the default cloud name.
 * 
 * Configuration options:
 * - CLOUDINARY_CLOUD_NAME (server-side only)
 * - CLOUDINARY_URL (server-side only, format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
 * 
 * Note: Cloud name is safe to expose publicly, so we use a default value.
 * API key and secret should NEVER be exposed to the client.
 */
export const getCloudinaryInstance = (): Cloudinary => {
  // For client-side (browser), process.env may not be available or may be undefined
  // Cloud name is public and safe to expose
  let cloudName = 'dbwfhhf0g'; // Default from provided credentials

  // Try to get from environment (works in Node.js/server context)
  if (typeof process !== 'undefined' && process.env) {
    // Check for CLOUDINARY_URL first (standard format)
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    
    if (cloudinaryUrl) {
      // Parse CLOUDINARY_URL: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
      const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
      if (match) {
        cloudName = match[3];
      }
    } else {
      // Fallback to individual environment variable
      cloudName = process.env.CLOUDINARY_CLOUD_NAME || cloudName;
    }
  }

  return new Cloudinary({
    cloud: {
      cloudName: cloudName,
    },
  });
};

// Export a singleton instance for convenience
export const cld = getCloudinaryInstance();

