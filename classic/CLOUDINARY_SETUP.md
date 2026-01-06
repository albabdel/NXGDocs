# Cloudinary Integration Setup

Cloudinary has been successfully integrated into the codebase! 🎉

## Installation

The following packages have been installed:
- `@cloudinary/react` - React components for Cloudinary
- `@cloudinary/url-gen` - URL generation and transformations

## Configuration

### Environment Variables

Create a `.env.local` file in the `classic/` directory with your Cloudinary credentials:

```bash
# Option 1: Use CLOUDINARY_URL (recommended)
CLOUDINARY_URL=cloudinary://763772222114342:kiOwkd-72mJ31U6Z5Yf5_UxFPGw@dbwfhhf0g

# Option 2: Use individual variables
CLOUDINARY_CLOUD_NAME=dbwfhhf0g
CLOUDINARY_API_KEY=763772222114342
CLOUDINARY_API_SECRET=kiOwkd-72mJ31U6Z5Yf5_UxFPGw
```

**Note:** The `.env.local` file is already in `.gitignore` and will not be committed to version control.

### Your Cloudinary Account

- **Cloud Name:** `dbwfhhf0g`
- **Collection:** https://collection.cloudinary.com/dbwfhhf0g/77c2c3784c637e916730efd160c750f2

## Usage

### Basic Usage

```tsx
import { CloudinaryImage } from '@site/src/components/CloudinaryImage';

// Simple image
<CloudinaryImage 
  publicId="cld-sample-5" 
  alt="Sample image"
/>

// With dimensions and auto-optimization
<CloudinaryImage 
  publicId="cld-sample-5" 
  width={500}
  height={500}
  alt="Sample image"
  autoCrop={true}
/>
```

### Advanced Usage

```tsx
import { CloudinaryImage } from '@site/src/components/CloudinaryImage';

// Custom transformations
<CloudinaryImage 
  publicId="your-image-id"
  width={800}
  height={600}
  alt="Custom image"
  className="rounded-lg shadow-lg"
  autoFormat={true}
  autoQuality={true}
  autoCrop={true}
  gravity="face" // or 'center', 'north', 'south', etc.
/>
```

### Direct Cloudinary Instance

```tsx
import { cld } from '@site/src/lib/cloudinary';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const img = cld
  .image('cld-sample-5')
  .format('auto')
  .quality('auto')
  .resize(auto().gravity(autoGravity()).width(500).height(500));

<AdvancedImage cldImg={img} alt="Optimized image" />
```

## Component Props

The `CloudinaryImage` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `publicId` | `string` | **required** | The public ID of the image in Cloudinary |
| `width` | `number` | `undefined` | Optional width for the image |
| `height` | `number` | `undefined` | Optional height for the image |
| `alt` | `string` | `''` | Alt text for accessibility |
| `className` | `string` | `undefined` | CSS class name |
| `style` | `React.CSSProperties` | `undefined` | Inline styles |
| `autoFormat` | `boolean` | `true` | Use auto-format optimization |
| `autoQuality` | `boolean` | `true` | Use auto-quality optimization |
| `autoCrop` | `boolean` | `false` | Use auto-crop with gravity |
| `gravity` | `'auto' \| 'face' \| 'center' \| ...` | `'auto'` | Gravity for cropping |
| `transformations` | `function` | `undefined` | Custom transformation function |

## Features

✅ **Auto-format optimization** - Automatically serves WebP, AVIF, or best format  
✅ **Auto-quality optimization** - Automatically adjusts quality for optimal file size  
✅ **Responsive images** - Easy width/height configuration  
✅ **Auto-cropping** - Smart cropping with gravity detection  
✅ **Type-safe** - Full TypeScript support  
✅ **Reusable component** - Easy to use across the codebase  

## Files Created

- `src/lib/cloudinary.ts` - Cloudinary configuration utility
- `src/components/CloudinaryImage/index.tsx` - Reusable Cloudinary image component
- `.env.example` - Example environment variables (template)
- `CLOUDINARY_SETUP.md` - This documentation file

## Next Steps

1. Create `.env.local` file with your credentials (see Configuration section above)
2. Start using `<CloudinaryImage>` components in your pages
3. Upload images to your Cloudinary collection
4. Reference images by their public ID

## Resources

- [Cloudinary React SDK Documentation](https://cloudinary.com/documentation/react_integration)
- [Cloudinary URL Transformations](https://cloudinary.com/documentation/transformation_reference)
- [Your Cloudinary Collection](https://collection.cloudinary.com/dbwfhhf0g/77c2c3784c637e916730efd160c750f2)

