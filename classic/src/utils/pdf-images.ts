/**
 * PDF Image Utilities
 * Handles image conversion and processing for PDF generation
 */

/**
 * Converts an image URL to base64 data URL
 * Handles CORS, SVG, and various image formats
 */
export async function imageToBase64(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) {
    return url;
  }

  try {
    if (url.toLowerCase().endsWith('.svg') || url.includes('svg')) {
      return await convertSvgToBase64(url);
    }

    const response = await fetch(url, { 
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image blob'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Direct fetch failed, trying canvas approach:', url);
    return await convertViaCanvas(url);
  }
}

/**
 * Converts SVG images to PNG base64 via canvas
 */
async function convertSvgToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 150;
        
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = url;
  });
}

/**
 * Fallback: converts image via canvas drawing
 */
async function convertViaCanvas(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 150;
        
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error('Canvas conversion failed'));
    img.src = url;
  });
}

/**
 * Processes all images in an HTML element, converting them to base64
 */
export async function processImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');
  
  await Promise.all(
    Array.from(images).map(async (img) => {
      try {
        if (!img.complete) {
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 3000);
          });
        }
        
        if (img.src && !img.src.startsWith('data:')) {
          const base64 = await imageToBase64(img.src);
          img.src = base64;
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (err) {
        console.warn('Failed to process image:', img.src, err);
        img.style.display = 'none';
      }
    })
  );
}

/**
 * Preloads an image and returns its base64 representation
 */
export async function preloadImageAsBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}
