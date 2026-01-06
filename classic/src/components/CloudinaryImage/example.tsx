/**
 * Example usage of CloudinaryImage component
 * 
 * This file demonstrates various ways to use the CloudinaryImage component.
 * You can reference this when implementing Cloudinary images in your pages.
 */

import React from 'react';
import { CloudinaryImage } from './index';
import { cld } from '../../lib/cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

export const CloudinaryExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Cloudinary Image Examples</h1>

      {/* Example 1: Basic usage */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Basic Image</h2>
        <CloudinaryImage 
          publicId="cld-sample-5" 
          alt="Basic sample image"
        />
      </section>

      {/* Example 2: With dimensions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">2. With Dimensions</h2>
        <CloudinaryImage 
          publicId="cld-sample-5" 
          width={500}
          height={500}
          alt="500x500 image"
        />
      </section>

      {/* Example 3: Auto-crop with gravity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">3. Auto-Crop with Gravity</h2>
        <CloudinaryImage 
          publicId="cld-sample-5" 
          width={500}
          height={500}
          alt="Auto-cropped image"
          autoCrop={true}
          gravity="auto"
        />
      </section>

      {/* Example 4: With custom styling */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">4. With Custom Styling</h2>
        <CloudinaryImage 
          publicId="cld-sample-5" 
          width={600}
          height={400}
          alt="Styled image"
          className="rounded-lg shadow-xl border-4 border-gray-200"
          style={{ maxWidth: '100%' }}
        />
      </section>

      {/* Example 5: Direct Cloudinary instance usage */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Direct Cloudinary Instance</h2>
        <AdvancedImage
          cldImg={cld
            .image('cld-sample-5')
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(500).height(500))}
          alt="Direct instance example"
        />
      </section>

      {/* Example 6: Custom transformations */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">6. Custom Transformations</h2>
        <CloudinaryImage 
          publicId="cld-sample-5" 
          width={400}
          height={300}
          alt="Custom transformed image"
          transformations={(img) => {
            return img
              .format('auto')
              .quality('auto')
              .addFlag('progressive');
          }}
        />
      </section>
    </div>
  );
};

export default CloudinaryExamples;

