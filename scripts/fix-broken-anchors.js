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

async function fixAlertsPage() {
  console.log('\n=== Fixing /alerts page - #best-practices anchor ===\n');
  
  const page = await client.fetch(
    '*[_type == "landingPage" && slug.current == "alerts"][0]'
  );
  
  if (!page) {
    console.log('ERROR: Landing page with slug "alerts" not found');
    return;
  }
  
  console.log(`Found page: ${page._id} (${page.title})`);
  
  if (!page.sections || !Array.isArray(page.sections)) {
    console.log('No sections found on this page');
    return;
  }
  
  console.log(`Sections (${page.sections.length}):`);
  page.sections.forEach((section, idx) => {
    console.log(`  [${idx}] _key: "${section._key}" _type: "${section._type}" title: "${section.title || '(none)'}"`);
  });
  
  const bestPracticesSection = page.sections.find(s => s._key === 'best-practices');
  
  if (bestPracticesSection) {
    console.log('\nSection with _key "best-practices" already exists - no fix needed');
    return;
  }
  
  console.log('\nNo section with _key "best-practices" found');
  console.log('Looking for sections that might need anchor fix...');
  
  let modified = false;
  const updatedSections = page.sections.map((section, idx) => {
    if (section._type === 'landingSectionFeatures' && Array.isArray(section.features)) {
      const updatedFeatures = section.features.map((feature, featIdx) => {
        if (feature.link && feature.link.includes('#best-practices')) {
          console.log(`  Found link with #best-practices in features[${featIdx}] "${feature.title}": ${feature.link}`);
          const newLink = feature.link.replace('#best-practices', '#best-practices-guidelines');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'alerts',
            location: `sections[${idx}].features[${featIdx}]`,
            old: feature.link,
            new: newLink
          });
          modified = true;
          return { ...feature, link: newLink };
        }
        return feature;
      });
      if (modified) {
        return { ...section, features: updatedFeatures };
      }
    }
    
    if (section._type === 'landingSectionContentGrid' && Array.isArray(section.items)) {
      const updatedItems = section.items.map((item, itemIdx) => {
        if (item.link && item.link.includes('#best-practices')) {
          console.log(`  Found link with #best-practices in items[${itemIdx}] "${item.title}": ${item.link}`);
          const newLink = item.link.replace('#best-practices', '#best-practices-guidelines');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'alerts',
            location: `sections[${idx}].items[${itemIdx}]`,
            old: item.link,
            new: newLink
          });
          modified = true;
          return { ...item, link: newLink };
        }
        return item;
      });
      if (modified) {
        return { ...section, items: updatedItems };
      }
    }
    
    if (section._type === 'landingSectionCTA' && Array.isArray(section.buttons)) {
      const updatedButtons = section.buttons.map((btn, btnIdx) => {
        if (btn.href && btn.href.includes('#best-practices')) {
          console.log(`  Found link with #best-practices in buttons[${btnIdx}] "${btn.label}": ${btn.href}`);
          const newLink = btn.href.replace('#best-practices', '#best-practices-guidelines');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'alerts',
            location: `sections[${idx}].buttons[${btnIdx}]`,
            old: btn.href,
            new: newLink
          });
          modified = true;
          return { ...btn, href: newLink };
        }
        return btn;
      });
      if (modified) {
        return { ...section, buttons: updatedButtons };
      }
    }
    
    return section;
  });
  
  if (modified) {
    console.log('\nUpdating /alerts page...');
    await client.patch(page._id).set({ sections: updatedSections }).commit();
    console.log('Updated successfully!');
  } else {
    console.log('\nNo links with #best-practices found to fix');
  }
}

async function fixMonitoringStationsPage() {
  console.log('\n=== Fixing /monitoring-stations page - #integrations anchor ===\n');
  
  const page = await client.fetch(
    '*[_type == "landingPage" && slug.current == "monitoring-stations"][0]'
  );
  
  if (!page) {
    console.log('ERROR: Landing page with slug "monitoring-stations" not found');
    return;
  }
  
  console.log(`Found page: ${page._id} (${page.title})`);
  
  if (!page.sections || !Array.isArray(page.sections)) {
    console.log('No sections found on this page');
    return;
  }
  
  console.log(`Sections (${page.sections.length}):`);
  page.sections.forEach((section, idx) => {
    console.log(`  [${idx}] _key: "${section._key}" _type: "${section._type}" title: "${section.title || '(none)'}"`);
  });
  
  const integrationsSection = page.sections.find(s => s._key === 'integrations');
  const stationIntegrationsSection = page.sections.find(s => s._key === 'station-integrations');
  
  if (integrationsSection) {
    console.log('\nSection with _key "integrations" already exists - no fix needed');
    return;
  }
  
  if (stationIntegrationsSection) {
    console.log('\nFound section with _key "station-integrations"');
    console.log('Renaming _key from "station-integrations" to "integrations"...');
    
    const sectionIdx = page.sections.findIndex(s => s._key === 'station-integrations');
    const updatedSections = [...page.sections];
    updatedSections[sectionIdx] = { ...updatedSections[sectionIdx], _key: 'integrations' };
    
    fixes.push({
      page: 'monitoring-stations',
      location: `sections[${sectionIdx}]`,
      old: 'station-integrations',
      new: 'integrations'
    });
    
    await client.patch(page._id).set({ sections: updatedSections }).commit();
    console.log('Updated successfully!');
    return;
  }
  
  console.log('\nNo section with _key "integrations" or "station-integrations" found');
  console.log('Looking for links with #integrations to fix...');
  
  let modified = false;
  const updatedSections = page.sections.map((section, idx) => {
    if (section._type === 'landingSectionFeatures' && Array.isArray(section.features)) {
      const updatedFeatures = section.features.map((feature, featIdx) => {
        if (feature.link && feature.link.includes('#integrations')) {
          console.log(`  Found link with #integrations in features[${featIdx}] "${feature.title}": ${feature.link}`);
          const newLink = feature.link.replace('#integrations', '#station-integrations');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'monitoring-stations',
            location: `sections[${idx}].features[${featIdx}]`,
            old: feature.link,
            new: newLink
          });
          modified = true;
          return { ...feature, link: newLink };
        }
        return feature;
      });
      if (modified) {
        return { ...section, features: updatedFeatures };
      }
    }
    
    if (section._type === 'landingSectionContentGrid' && Array.isArray(section.items)) {
      const updatedItems = section.items.map((item, itemIdx) => {
        if (item.link && item.link.includes('#integrations')) {
          console.log(`  Found link with #integrations in items[${itemIdx}] "${item.title}": ${item.link}`);
          const newLink = item.link.replace('#integrations', '#station-integrations');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'monitoring-stations',
            location: `sections[${idx}].items[${itemIdx}]`,
            old: item.link,
            new: newLink
          });
          modified = true;
          return { ...item, link: newLink };
        }
        return item;
      });
      if (modified) {
        return { ...section, items: updatedItems };
      }
    }
    
    if (section._type === 'landingSectionCTA' && Array.isArray(section.buttons)) {
      const updatedButtons = section.buttons.map((btn, btnIdx) => {
        if (btn.href && btn.href.includes('#integrations')) {
          console.log(`  Found link with #integrations in buttons[${btnIdx}] "${btn.label}": ${btn.href}`);
          const newLink = btn.href.replace('#integrations', '#station-integrations');
          console.log(`  -> Would change to: ${newLink}`);
          fixes.push({
            page: 'monitoring-stations',
            location: `sections[${idx}].buttons[${btnIdx}]`,
            old: btn.href,
            new: newLink
          });
          modified = true;
          return { ...btn, href: newLink };
        }
        return btn;
      });
      if (modified) {
        return { ...section, buttons: updatedButtons };
      }
    }
    
    if (section._type === 'landingSectionTabs' && Array.isArray(section.tabs)) {
      const updatedTabs = section.tabs.map((tab, tabIdx) => {
        if (tab.id === 'integrations') {
          console.log(`  Found tab with id "integrations" in tabs[${tabIdx}] "${tab.label}"`);
          fixes.push({
            page: 'monitoring-stations',
            location: `sections[${idx}].tabs[${tabIdx}]`,
            old: tab.id,
            new: 'station-integrations'
          });
          modified = true;
          return { ...tab, id: 'station-integrations' };
        }
        return tab;
      });
      if (modified) {
        return { ...section, tabs: updatedTabs };
      }
    }
    
    return section;
  });
  
  if (modified) {
    console.log('\nUpdating /monitoring-stations page...');
    await client.patch(page._id).set({ sections: updatedSections }).commit();
    console.log('Updated successfully!');
  } else {
    console.log('\nNo links with #integrations found to fix');
  }
}

async function main() {
  console.log('Fix Broken Anchors Script');
  console.log('=========================');
  
  try {
    await fixAlertsPage();
    await fixMonitoringStationsPage();
    
    console.log('\n=== SUMMARY ===\n');
    
    if (fixes.length === 0) {
      console.log('No anchor fixes were needed.');
    } else {
      console.log(`Total fixes applied: ${fixes.length}\n`);
      fixes.forEach(f => {
        console.log(`  [${f.page}] ${f.location}: "${f.old}" -> "${f.new}"`);
      });
    }
    
    console.log('\nDone!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
