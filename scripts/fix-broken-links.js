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

const LINK_FIXES = {
  '/quick-start': '/getting-started',
  '/demo': '/contact',
  '/docs/towers': '/docs/devices',
  '/docs/datacenters': '/docs/devices',
  '/docs/industrial': '/docs/devices',
  '/docs/substations': '/docs/devices',
  '/docs/buildings': '/docs/devices',
  '/docs/remote': '/docs/devices',
  '/docs/alerts/setup': '/docs/alarm-management',
  '/docs/alarm-management/test-mode': '/docs/alarm-management',
  '/docs/getting-started/troubleshooting': '/docs/alarm-management',
  '/docs/getting-started/troubleshooting/': '/docs/alarm-management',
  '/docs/getting-started/required-ports': '/docs/getting-started/pre-deployment-requirements',
};

const ANCHOR_FIXES = {
  '#integrations': '#station-integrations',
};

const changes = [];

function fixHref(href) {
  if (!href) return null;
  
  if (LINK_FIXES[href]) {
    return LINK_FIXES[href];
  }
  
  for (const [oldPath, newPath] of Object.entries(LINK_FIXES)) {
    if (href.startsWith(oldPath + '/') || href === oldPath) {
      return href.replace(oldPath, newPath);
    }
  }
  
  if (ANCHOR_FIXES[href]) {
    return ANCHOR_FIXES[href];
  }
  
  for (const [oldAnchor, newAnchor] of Object.entries(ANCHOR_FIXES)) {
    if (href.includes(oldAnchor)) {
      return href.replace(oldAnchor, newAnchor);
    }
  }
  
  return null;
}

function fixButtons(buttons, context) {
  if (!Array.isArray(buttons)) return false;
  
  let modified = false;
  const updatedButtons = buttons.map((btn, idx) => {
    const newHref = fixHref(btn.href);
    if (newHref) {
      changes.push({
        type: 'landingPage',
        context: `${context} button[${idx}] "${btn.label}"`,
        oldHref: btn.href,
        newHref: newHref,
      });
      modified = true;
      return { ...btn, href: newHref };
    }
    return btn;
  });
  
  return modified ? updatedButtons : false;
}

function fixBreadcrumbs(breadcrumbs, context) {
  if (!Array.isArray(breadcrumbs)) return false;
  
  let modified = false;
  const updated = breadcrumbs.map((crumb, idx) => {
    const newHref = fixHref(crumb.href);
    if (newHref) {
      changes.push({
        type: 'landingPage',
        context: `${context} breadcrumb[${idx}] "${crumb.label}"`,
        oldHref: crumb.href,
        newHref: newHref,
      });
      modified = true;
      return { ...crumb, href: newHref };
    }
    return crumb;
  });
  
  return modified ? updated : false;
}

function fixSections(sections, pageId) {
  if (!Array.isArray(sections)) return { modified: false, sections };
  
  let modified = false;
  const updatedSections = sections.map((section, sectionIdx) => {
    const sectionType = section._type;
    
    if (sectionType === 'landingSectionCTA' && Array.isArray(section.buttons)) {
      const updatedButtons = fixButtons(section.buttons, `sections[${sectionIdx}].landingSectionCTA "${section.title}"`);
      if (updatedButtons) {
        modified = true;
        return { ...section, buttons: updatedButtons };
      }
    }
    
    if (sectionType === 'landingSectionFeatures' && Array.isArray(section.features)) {
      const updatedFeatures = section.features.map((feature, featIdx) => {
        const newHref = fixHref(feature.link);
        if (newHref) {
          changes.push({
            type: 'landingPage',
            context: `sections[${sectionIdx}].features[${featIdx}] "${feature.title}"`,
            oldHref: feature.link,
            newHref: newHref,
          });
          modified = true;
          return { ...feature, link: newHref };
        }
        return feature;
      });
      if (modified) {
        return { ...section, features: updatedFeatures };
      }
    }
    
    if (sectionType === 'landingSectionContentGrid' && Array.isArray(section.items)) {
      const updatedItems = section.items.map((item, itemIdx) => {
        const newHref = fixHref(item.link);
        if (newHref) {
          changes.push({
            type: 'landingPage',
            context: `sections[${sectionIdx}].items[${itemIdx}] "${item.title}"`,
            oldHref: item.link,
            newHref: newHref,
          });
          modified = true;
          return { ...item, link: newHref };
        }
        return item;
      });
      if (modified) {
        return { ...section, items: updatedItems };
      }
    }
    
    return section;
  });
  
  return { modified, sections: updatedSections };
}

async function fixLandingPages() {
  console.log('\n=== FIXING LANDING PAGES ===\n');
  
  const pages = await client.fetch('*[_type == "landingPage"]');
  console.log(`Found ${pages.length} landing pages\n`);
  
  for (const page of pages) {
    const patches = {};
    let hasChanges = false;
    
    if (page.breadcrumbs) {
      const updated = fixBreadcrumbs(page.breadcrumbs, `/${page.slug?.current || page._id}`);
      if (updated) {
        patches.breadcrumbs = updated;
        hasChanges = true;
      }
    }
    
    if (page.hero?.ctaButtons) {
      const updated = fixButtons(page.hero.ctaButtons, `/${page.slug?.current || page._id} hero`);
      if (updated) {
        patches['hero.ctaButtons'] = updated;
        hasChanges = true;
      }
    }
    
    if (page.sections) {
      const result = fixSections(page.sections, page._id);
      if (result.modified) {
        patches.sections = result.sections;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      console.log(`Updating landing page: ${page._id} (${page.title})`);
      await client.patch(page._id).set(patches).commit();
    }
  }
}

function fixPortableText(body, docId) {
  if (!Array.isArray(body)) return { modified: false, body };
  
  let modified = false;
  const updatedBody = body.map((block, blockIdx) => {
    if (block.markDefs && Array.isArray(block.markDefs)) {
      const updatedMarkDefs = block.markDefs.map((markDef, markIdx) => {
        if (markDef._type === 'link' && markDef.href) {
          const newHref = fixHref(markDef.href);
          if (newHref) {
            changes.push({
              type: 'doc',
              context: `${docId} body[${blockIdx}].markDefs[${markIdx}]`,
              oldHref: markDef.href,
              newHref: newHref,
            });
            modified = true;
            return { ...markDef, href: newHref };
          }
        }
        return markDef;
      });
      
      if (modified) {
        return { ...block, markDefs: updatedMarkDefs };
      }
    }
    return block;
  });
  
  return { modified, body: updatedBody };
}

async function fixDocs() {
  console.log('\n=== FIXING DOCS ===\n');
  
  const docs = await client.fetch('*[_type == "doc"]');
  console.log(`Found ${docs.length} docs\n`);
  
  for (const doc of docs) {
    if (!doc.body) continue;
    
    const result = fixPortableText(doc.body, doc._id);
    if (result.modified) {
      console.log(`Updating doc: ${doc._id} (${doc.title})`);
      await client.patch(doc._id).set({ body: result.body }).commit();
    }
  }
}

async function main() {
  console.log('Broken Links Fix Script');
  console.log('========================');
  
  try {
    await fixLandingPages();
    await fixDocs();
    
    console.log('\n=== SUMMARY ===\n');
    
    if (changes.length === 0) {
      console.log('No broken links found that need fixing.');
    } else {
      console.log(`Total changes: ${changes.length}\n`);
      
      const landingPageChanges = changes.filter(c => c.type === 'landingPage');
      const docChanges = changes.filter(c => c.type === 'doc');
      
      if (landingPageChanges.length > 0) {
        console.log(`Landing Pages (${landingPageChanges.length} changes):`);
        landingPageChanges.forEach(c => {
          console.log(`  - ${c.context}: ${c.oldHref} → ${c.newHref}`);
        });
      }
      
      if (docChanges.length > 0) {
        console.log(`\nDocs (${docChanges.length} changes):`);
        docChanges.forEach(c => {
          console.log(`  - ${c.context}: ${c.oldHref} → ${c.newHref}`);
        });
      }
    }
    
    console.log('\nDone!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
