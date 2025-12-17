# NXGEN Sphere Background Implementation Guide

## Overview

This guide shows you how to implement the iconic NXGEN sphere background on your GCXONE documentation site, even without access to the original nxgen.io codebase.

I've created **two versions** for you:

1. **Pure CSS Version** (Recommended) - Lightweight, no dependencies, works everywhere
2. **Three.js Version** (Optional) - Ultra-realistic 3D, requires Three.js library

---

## Option 1: Pure CSS Version (Recommended)

### Why Choose This?
- ✅ No external dependencies
- ✅ Lightweight (~15KB CSS)
- ✅ Works on all browsers
- ✅ Easy to maintain
- ✅ Great performance
- ✅ SSR-friendly (Docusaurus)

### Installation Steps

#### Step 1: Add CSS to Your Project

Copy the contents of `sphere-background.css` into your custom CSS file:

```bash
# Option A: Append to existing custom.css
cat sphere-background.css >> src/css/custom.css

# Option B: Import as separate file
# Create src/css/sphere-background.css
# Then import it in custom.css:
```

In your `src/css/custom.css`:
```css
@import './sphere-background.css';
```

#### Step 2: Create Component File

Create the component file:
```bash
# Create components directory if it doesn't exist
mkdir -p src/components

# Copy the component
cp NXGENSphereHero.jsx src/components/
```

#### Step 3: Update Homepage

Replace your homepage hero section in `src/pages/index.js`:

```javascript
import React from 'react';
import Layout from '@theme/Layout';
import NXGENSphereHero from '@site/src/components/NXGENSphereHero';

export default function Home() {
  return (
    <Layout>
      {/* Replace your existing hero with this: */}
      <NXGENSphereHero />
      
      {/* Rest of your homepage content */}
      <main>
        {/* Other sections */}
      </main>
    </Layout>
  );
}
```

#### Step 4: Test It

```bash
npm run start
```

Visit http://localhost:3000 and you should see the animated sphere!

---

## Option 2: Three.js Version (Advanced)

### Why Choose This?
- ✅ Ultra-realistic 3D rendering
- ✅ True lighting and shadows
- ✅ Photorealistic sphere
- ❌ Requires Three.js dependency (~600KB)
- ❌ More complex setup
- ❌ Higher performance requirement

### Installation Steps

#### Step 1: Install Three.js

```bash
npm install three
```

#### Step 2: Add CSS (Same as Option 1)

You still need the CSS for the content overlay:
```bash
cat sphere-background.css >> src/css/custom.css
```

#### Step 3: Create Component

```bash
cp NXGENSphereHeroThreeJS.jsx src/components/
```

#### Step 4: Update Homepage

```javascript
import NXGENSphereHero from '@site/src/components/NXGENSphereHeroThreeJS';

export default function Home() {
  return (
    <Layout>
      <NXGENSphereHero />
      {/* Rest of content */}
    </Layout>
  );
}
```

---

## Customization Guide

### Changing Colors

To adjust the gold color scheme, modify these CSS variables:

```css
/* In sphere-background.css, find and replace: */

/* Primary gold */
#C89446 → your-color

/* Light gold */
#D4A574 → your-lighter-color

/* Example: Change to blue theme */
#C89446 → #0066CC
#D4A574 → #3385D6
```

### Adjusting Sphere Size

```css
/* In sphere-background.css */
.nxgen-sphere {
  width: 600px;   /* Change this */
  height: 600px;  /* And this */
}
```

### Changing Animation Speed

```css
/* Sphere rotation speed */
@keyframes sphereRotate {
  /* Change from 60s to faster/slower */
  animation: sphereRotate 30s linear infinite; /* Faster */
}

/* Grid movement speed */
@keyframes gridMove {
  /* Change from 30s to faster/slower */
  animation: gridMove 15s linear infinite; /* Faster */
}
```

### Removing Elements

Don't want certain elements? Comment them out:

```css
/* Hide starfield */
.nxgen-sphere-background::before {
  display: none;
}

/* Hide grid pattern */
.sphere-grid {
  display: none;
}

/* Hide glow effect */
.sphere-glow {
  display: none;
}
```

---

## Integration Patterns

### Pattern 1: Homepage Hero Only

Use the sphere only on your homepage:

```javascript
// src/pages/index.js
import NXGENSphereHero from '@site/src/components/NXGENSphereHero';

export default function Home() {
  return (
    <Layout>
      <NXGENSphereHero />
      {/* Other sections */}
    </Layout>
  );
}
```

### Pattern 2: Reusable Background Component

Create a wrapper for any page:

```javascript
// src/components/SphereLayout.jsx
import React from 'react';
import Layout from '@theme/Layout';

export default function SphereLayout({ children, title }) {
  return (
    <Layout title={title}>
      <div className="nxgen-sphere-background">
        <div className="nxgen-sphere">
          <div className="sphere-glow"></div>
          <div className="sphere-body"></div>
          <div className="sphere-grid"></div>
          <div className="sphere-content">
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Usage in any page:
import SphereLayout from '@site/src/components/SphereLayout';

export default function AboutPage() {
  return (
    <SphereLayout title="About Us">
      <h1>About GCXONE</h1>
      <p>Your content here...</p>
    </SphereLayout>
  );
}
```

### Pattern 3: Simplified Version (No Sphere)

Just want the background effect without the sphere?

```html
<!-- Use only the background container -->
<div className="nxgen-sphere-background">
  <!-- Your content here, no sphere -->
  <div style={{ position: 'relative', zIndex: 2 }}>
    <h1>Your Title</h1>
    <p>Your content</p>
  </div>
</div>
```

---

## Performance Optimization

### Lazy Loading (For Three.js Version)

Only load Three.js when needed:

```javascript
import React, { lazy, Suspense } from 'react';

const NXGENSphereHero = lazy(() => import('@site/src/components/NXGENSphereHeroThreeJS'));

export default function Home() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <NXGENSphereHero />
      </Suspense>
    </Layout>
  );
}
```

### Reduce Animation on Mobile

The CSS already handles this, but you can further optimize:

```css
@media (max-width: 768px) {
  /* Simpler sphere on mobile */
  .sphere-grid {
    display: none; /* Remove grid overlay */
  }
  
  /* Slower animations to save battery */
  .sphere-body {
    animation-duration: 120s; /* Double the time = half the speed */
  }
}
```

### Disable Animations for Users Who Prefer Reduced Motion

Already built-in:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are automatically disabled */
}
```

---

## Troubleshooting

### Issue 1: Sphere Not Showing

**Check:**
1. CSS is imported correctly
2. Component is rendered in the page
3. Browser console for errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .docusaurus
npm run start
```

### Issue 2: Sphere Looks Flat (No 3D Effect)

**For CSS Version:**
The sphere uses gradients to simulate 3D. Make sure these lines are present:

```css
.sphere-body {
  background: radial-gradient(...); /* This creates the 3D illusion */
  box-shadow: inset 40px -40px 80px rgba(0, 0, 0, 0.9);
}
```

**For Three.js Version:**
Make sure Three.js is installed:
```bash
npm list three
# Should show three@0.x.x
```

### Issue 3: Animations Are Choppy

**Solutions:**

1. **Enable GPU acceleration:**
```css
.sphere-body {
  transform: translateZ(0);
  will-change: transform;
}
```

2. **Reduce animation complexity on lower-end devices:**
```css
@media (max-width: 768px) {
  .sphere-grid {
    display: none;
  }
}
```

3. **For Three.js version, reduce polygon count:**
```javascript
// In NXGENSphereHeroThreeJS.jsx
const geometry = new THREE.SphereGeometry(250, 32, 32); // Reduced from 64
```

### Issue 4: Stats Overlap Sphere on Mobile

**Solution:**
Adjust positioning in CSS:

```css
@media (max-width: 480px) {
  .stats-container {
    position: relative; /* Change from absolute */
    margin-top: 3rem;
    flex-direction: column;
  }
}
```

### Issue 5: Content Not Readable Over Background

**Solution:**
Add backdrop blur and darker overlay:

```css
.sphere-content {
  backdrop-filter: blur(10px);
  background: rgba(10, 10, 10, 0.3);
  border-radius: 20px;
  padding: 2rem;
}
```

---

## Comparison: CSS vs Three.js

| Feature | Pure CSS | Three.js |
|---------|----------|----------|
| **File Size** | ~15KB | ~615KB |
| **Dependencies** | None | three.js |
| **3D Realism** | Good (simulated) | Excellent (true 3D) |
| **Performance** | Excellent | Good |
| **Mobile Support** | Perfect | Good |
| **Browser Support** | All modern browsers | WebGL required |
| **Maintenance** | Easy | Moderate |
| **Build Time** | Instant | Slightly slower |
| **Docusaurus SSR** | Perfect | Requires dynamic import |

### Recommendation

- **Use Pure CSS** if:
  - You want maximum performance
  - You need broad browser support
  - You want easy maintenance
  - Your users are on mobile devices
  - You want instant load times

- **Use Three.js** if:
  - You need photorealistic 3D
  - You have high-end target audience
  - You're willing to manage dependencies
  - You want advanced lighting effects
  - Bundle size isn't a concern

**For most Docusaurus sites: Use Pure CSS version.**

---

## Advanced Customizations

### Adding Mouse Interaction

Make the sphere follow the mouse:

```javascript
// Add to component
useEffect(() => {
  const handleMouseMove = (e) => {
    const sphere = document.querySelector('.sphere-body');
    if (!sphere) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    sphere.style.transform = `
      rotate3d(${-y}, ${x}, 0, ${Math.sqrt(x*x + y*y)}deg)
    `;
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);
```

### Adding Scroll Parallax

Make elements move at different speeds:

```javascript
useEffect(() => {
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const sphere = document.querySelector('.nxgen-sphere');
    
    if (sphere) {
      sphere.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Changing XO Logo to Custom Logo

Replace the XO text with your logo:

```jsx
{/* Instead of: */}
<div className="xo-inner">XO</div>

{/* Use: */}
<div className="xo-inner">
  <img 
    src="/img/your-logo.svg" 
    alt="Logo" 
    style={{ width: '80px', height: '80px' }}
  />
</div>
```

---

## Production Checklist

Before deploying to production:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS and Android)
- [ ] Check performance (Lighthouse score should be 90+)
- [ ] Verify animations work smoothly
- [ ] Test with slow 3G connection
- [ ] Ensure content is readable
- [ ] Check accessibility (keyboard navigation)
- [ ] Verify reduced motion preferences work
- [ ] Test on different screen sizes
- [ ] Check bundle size didn't increase significantly

---

## Support & Resources

### CSS Animation Resources
- MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- CSS Tricks: https://css-tricks.com/almanac/properties/a/animation/

### Three.js Resources (if using Three.js version)
- Three.js Docs: https://threejs.org/docs/
- Three.js Examples: https://threejs.org/examples/

### Docusaurus Resources
- Styling Docs: https://docusaurus.io/docs/styling-layout
- Component Docs: https://docusaurus.io/docs/creating-pages

---

## Summary

You now have two complete implementations of the NXGEN sphere background:

**Pure CSS Version:**
- ✅ Lightweight and fast
- ✅ No dependencies
- ✅ Perfect for most use cases
- ✅ Easy to customize

**Three.js Version:**
- ✅ Ultra-realistic 3D
- ✅ Advanced lighting
- ⚠️ Requires Three.js library
- ⚠️ More complex

**My Recommendation:** Start with the Pure CSS version. It's 95% as good visually, but much lighter and easier to maintain. You can always upgrade to Three.js later if needed.

---

**Created:** December 2024  
**Version:** 1.0  
**Status:** Production Ready
