#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

async function fixVideoTutorialsLink() {
  console.log('Querying for quick-start landing page...\n');

  const query = `*[_type == "landingPage" && slug.current == "quick-start"][0]`;
  const page = await client.fetch(query);

  if (!page) {
    console.error('Quick-start landing page not found!');
    return;
  }

  console.log('Found page:', page._id);
  console.log('Title:', page.title);
  console.log('\n--- Current state ---\n');

  if (page.hero?.ctaButtons) {
    console.log('Hero CTA Buttons:');
    page.hero.ctaButtons.forEach((btn, idx) => {
      console.log(`  [${idx}] ${btn.label} -> ${btn.href}`);
    });
  }

  if (page.sections) {
    page.sections.forEach((section, sectionIdx) => {
      if (section._type === 'landingSectionCTA' && section.buttons) {
        console.log(`\nSection [${sectionIdx}] CTA "${section.title}":`);
        section.buttons.forEach((btn, btnIdx) => {
          console.log(`  [${btnIdx}] ${btn.label} -> ${btn.href}`);
        });
      }
    });
  }

  let hasWatchDemo = false;

  if (page.hero?.ctaButtons) {
    for (const btn of page.hero.ctaButtons) {
      if (btn.label && btn.label.toLowerCase().includes('watch') && btn.label.toLowerCase().includes('demo')) {
        hasWatchDemo = true;
        if (btn.href !== '/video-tutorials') {
          console.log(`\n--- Fixing Watch Demo link: ${btn.href} -> /video-tutorials ---\n`);
          const fixedButtons = page.hero.ctaButtons.map(b => {
            if (b.label && b.label.toLowerCase().includes('watch') && b.label.toLowerCase().includes('demo')) {
              return { ...b, href: '/video-tutorials' };
            }
            return b;
          });
          await client.patch(page._id).set({ 'hero.ctaButtons': fixedButtons }).commit();
          console.log('Fixed!');
        } else {
          console.log('\nWatch Demo button already has correct link.');
        }
        break;
      }
    }
  }

  if (!hasWatchDemo) {
    console.log('\n--- Adding Watch Demo CTA button to hero ---\n');
    
    const currentButtons = page.hero?.ctaButtons || [];
    const watchDemoButton = {
      label: 'Watch Demo',
      href: '/video-tutorials',
      variant: 'secondary'
    };
    
    const updatedButtons = [...currentButtons, watchDemoButton];
    
    await client.patch(page._id).set({ 'hero.ctaButtons': updatedButtons }).commit();
    console.log('Added Watch Demo button with link to /video-tutorials');
  }

  console.log('\n--- Final state ---\n');
  const updatedPage = await client.fetch(query);
  if (updatedPage.hero?.ctaButtons) {
    console.log('Hero CTA Buttons:');
    updatedPage.hero.ctaButtons.forEach((btn, idx) => {
      console.log(`  [${idx}] ${btn.label} -> ${btn.href}`);
    });
  }
}

fixVideoTutorialsLink().catch(console.error);
