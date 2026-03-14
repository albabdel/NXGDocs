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

const fixes = [];

async function findAllLinksWithAnchors() {
  console.log('\n=== Finding all links with anchors in Sanity ===\n');
  
  const pages = await client.fetch(
    '*[_type == "landingPage"]{ _id, title, slug, sections }'
  );
  
  const anchorLinks = [];
  
  pages.forEach(page => {
    if (!page.sections) return;
    
    page.sections.forEach((section, sectionIdx) => {
      if (section._type === 'landingSectionFeatures' && Array.isArray(section.features)) {
        section.features.forEach((feature, featIdx) => {
          if (feature.link && feature.link.includes('#')) {
            anchorLinks.push({
              page: page.slug?.current || page._id,
              pageTitle: page.title,
              location: `sections[${sectionIdx}].features[${featIdx}]`,
              link: feature.link,
              featureTitle: feature.title
            });
          }
        });
      }
      
      if (section._type === 'landingSectionContentGrid' && Array.isArray(section.items)) {
        section.items.forEach((item, itemIdx) => {
          if (item.link && item.link.includes('#')) {
            anchorLinks.push({
              page: page.slug?.current || page._id,
              pageTitle: page.title,
              location: `sections[${sectionIdx}].items[${itemIdx}]`,
              link: item.link,
              featureTitle: item.title
            });
          }
        });
      }
      
      if (section._type === 'landingSectionCTA' && Array.isArray(section.buttons)) {
        section.buttons.forEach((btn, btnIdx) => {
          if (btn.href && btn.href.includes('#')) {
            anchorLinks.push({
              page: page.slug?.current || page._id,
              pageTitle: page.title,
              location: `sections[${sectionIdx}].buttons[${btnIdx}]`,
              link: btn.href,
              featureTitle: btn.label
            });
          }
        });
      }
      
      if (section._type === 'landingSectionHero' && section.ctaButtons) {
        section.ctaButtons.forEach((btn, btnIdx) => {
          if (btn.href && btn.href.includes('#')) {
            anchorLinks.push({
              page: page.slug?.current || page._id,
              pageTitle: page.title,
              location: `sections[${sectionIdx}].ctaButtons[${btnIdx}]`,
              link: btn.href,
              featureTitle: btn.label
            });
          }
        });
      }
    });
  });
  
  console.log(`Found ${anchorLinks.length} links with anchors:\n`);
  anchorLinks.forEach(link => {
    console.log(`  [${link.page}] ${link.location}: "${link.link}" (${link.featureTitle})`);
  });
  
  return anchorLinks;
}

async function verifySectionAnchors() {
  console.log('\n=== Verifying section anchors exist ===\n');
  
  const pages = await client.fetch(
    '*[_type == "landingPage"]{ _id, title, slug, sections }'
  );
  
  const sectionAnchors = {};
  
  pages.forEach(page => {
    const slug = page.slug?.current || page._id;
    sectionAnchors[slug] = [];
    
    if (!page.sections) return;
    
    page.sections.forEach(section => {
      if (section._key) {
        sectionAnchors[slug].push({
          _key: section._key,
          _type: section._type,
          title: section.title
        });
      }
    });
  });
  
  console.log('Section anchors by page:\n');
  Object.entries(sectionAnchors).forEach(([slug, anchors]) => {
    console.log(`  ${slug}:`);
    anchors.forEach(a => {
      console.log(`    - #${a._key} (${a._type}) "${a.title || '(no title)'}"`);
    });
  });
  
  return sectionAnchors;
}

async function findBrokenAnchors(anchorLinks, sectionAnchors) {
  console.log('\n=== Finding broken anchors ===\n');
  
  const broken = [];
  
  anchorLinks.forEach(link => {
    const [path, anchor] = link.link.split('#');
    const pageSlug = path.replace(/^\//, '').replace(/\/$/, '') || 'integrations';
    
    if (!sectionAnchors[pageSlug]) {
      broken.push({
        ...link,
        issue: 'target-page-not-found',
        targetPage: pageSlug,
        anchor
      });
      return;
    }
    
    const anchorExists = sectionAnchors[pageSlug].some(s => s._key === anchor);
    
    if (!anchorExists) {
      broken.push({
        ...link,
        issue: 'anchor-not-found',
        targetPage: pageSlug,
        anchor,
        availableAnchors: sectionAnchors[pageSlug].map(s => s._key)
      });
    }
  });
  
  if (broken.length === 0) {
    console.log('No broken anchors found!');
  } else {
    console.log(`Found ${broken.length} broken anchors:\n`);
    broken.forEach(b => {
      if (b.issue === 'target-page-not-found') {
        console.log(`  [${b.page}] ${b.link} - Target page "${b.targetPage}" not found`);
      } else {
        console.log(`  [${b.page}] ${b.link} - Anchor "#${b.anchor}" not found on /${b.targetPage}`);
        console.log(`    Available anchors: ${b.availableAnchors.join(', ')}`);
      }
    });
  }
  
  return broken;
}

async function fixBrokenAnchors(brokenAnchors, sectionAnchors) {
  console.log('\n=== Fixing broken anchors ===\n');
  
  if (brokenAnchors.length === 0) {
    console.log('No broken anchors to fix.');
    return;
  }
  
  for (const broken of brokenAnchors) {
    if (broken.issue === 'target-page-not-found') {
      console.log(`Skipping ${broken.link} - target page not found`);
      continue;
    }
    
    const page = await client.fetch(
      `*[_type == "landingPage" && slug.current == $slug][0]`,
      { slug: broken.page }
    );
    
    if (!page) {
      console.log(`Page ${broken.page} not found`);
      continue;
    }
    
    const [path, oldAnchor] = broken.link.split('#');
    
    let newAnchor = null;
    
    if (broken.targetPage === 'integrations') {
      const anchorMap = {
        'video': 'video',
        'iot': 'iot',
        'cloud': 'cloud',
        'notifications': 'notifications'
      };
      newAnchor = anchorMap[oldAnchor.toLowerCase()];
      if (!newAnchor) {
        console.log(`Cannot fix ${broken.link} - integrations page needs anchor IDs added`);
        continue;
      }
      console.log(`Note: /integrations#${newAnchor} needs to be added to integrations.tsx`);
      continue;
    }
    
    const similarAnchors = broken.availableAnchors.filter(a => 
      a.includes(oldAnchor) || oldAnchor.includes(a.replace(/-/g, ''))
    );
    
    if (similarAnchors.length === 1) {
      newAnchor = similarAnchors[0];
    } else if (similarAnchors.length > 1) {
      console.log(`Multiple similar anchors found for ${broken.link}: ${similarAnchors.join(', ')}`);
      continue;
    } else {
      console.log(`No similar anchor found for ${broken.link}`);
      continue;
    }
    
    if (!newAnchor) continue;
    
    const newLink = `${path}#${newAnchor}`;
    console.log(`Would fix: ${broken.link} -> ${newLink}`);
    
    let modified = false;
    const updatedSections = page.sections.map((section, idx) => {
      if (section._type === 'landingSectionFeatures' && Array.isArray(section.features)) {
        const updatedFeatures = section.features.map((feature, featIdx) => {
          if (feature.link === broken.link) {
            modified = true;
            return { ...feature, link: newLink };
          }
          return feature;
        });
        if (modified) return { ...section, features: updatedFeatures };
      }
      
      if (section._type === 'landingSectionContentGrid' && Array.isArray(section.items)) {
        const updatedItems = section.items.map((item, itemIdx) => {
          if (item.link === broken.link) {
            modified = true;
            return { ...item, link: newLink };
          }
          return item;
        });
        if (modified) return { ...section, items: updatedItems };
      }
      
      if (section._type === 'landingSectionCTA' && Array.isArray(section.buttons)) {
        const updatedButtons = section.buttons.map((btn, btnIdx) => {
          if (btn.href === broken.link) {
            modified = true;
            return { ...btn, href: newLink };
          }
          return btn;
        });
        if (modified) return { ...section, buttons: updatedButtons };
      }
      
      return section;
    });
    
    if (modified) {
      console.log(`Updating page ${broken.page}...`);
      await client.patch(page._id).set({ sections: updatedSections }).commit();
      console.log('Updated!');
      fixes.push({
        page: broken.page,
        old: broken.link,
        new: newLink
      });
    }
  }
}

async function main() {
  console.log('Fix Remaining Broken Anchors Script');
  console.log('====================================');
  
  try {
    const anchorLinks = await findAllLinksWithAnchors();
    const sectionAnchors = await verifySectionAnchors();
    const brokenAnchors = await findBrokenAnchors(anchorLinks, sectionAnchors);
    await fixBrokenAnchors(brokenAnchors, sectionAnchors);
    
    console.log('\n=== SUMMARY ===\n');
    
    if (fixes.length === 0) {
      console.log('No fixes were applied.');
    } else {
      console.log(`Total fixes applied: ${fixes.length}\n`);
      fixes.forEach(f => {
        console.log(`  [${f.page}] "${f.old}" -> "${f.new}"`);
      });
    }
    
    console.log('\nDone!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
