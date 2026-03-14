#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function findMatchingDocArticle(integration, docArticles) {
  const manufacturer = normalizeName(integration.manufacturer);
  const brand = normalizeName(integration.brand);
  
  for (const article of docArticles) {
    const articleTitle = normalizeName(article.title);
    const articleManufacturer = normalizeName(article.manufacturer);
    
    if (brand && articleTitle.includes(brand)) {
      return article;
    }
    
    if (manufacturer && articleTitle.includes(manufacturer)) {
      return article;
    }
    
    if (articleManufacturer && (
      articleManufacturer.includes(manufacturer) ||
      manufacturer.includes(articleManufacturer)
    )) {
      return article;
    }
    
    const altNames = ['hikvision', 'dahua', 'axis', 'hanwha', 'milestone', 'avigilon', 'axxon'];
    for (const alt of altNames) {
      if (manufacturer.includes(alt) && articleTitle.includes(alt)) {
        return article;
      }
    }
  }
  
  return null;
}

async function updateIntegrationDocs() {
  console.log('Updating device integration documentation references...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  const jsonPath = path.join(__dirname, 'integration-matrix.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const matrixData = JSON.parse(jsonData);
  
  const urlMap = new Map();
  for (const device of matrixData) {
    const key = `${device.manufacturer}|${device.brand}|${device.deviceType}`;
    urlMap.set(key, {
      helpManuals: device.documents?.helpManuals || [],
      helpdesk: device.documents?.helpdesk || [],
    });
  }
  
  console.log(`Loaded ${matrixData.length} devices from integration-matrix.json\n`);

  console.log('Fetching device integrations from Sanity...');
  const integrations = await client.fetch(
    `*[_type == "deviceIntegration"]{
      _id,
      title,
      slug,
      manufacturer,
      brand,
      deviceType,
      originalDeviceType,
      documentation
    }`
  );
  console.log(`Found ${integrations.length} device integrations\n`);

  console.log('Fetching doc articles from Sanity...');
  const docArticles = await client.fetch(
    `*[_type == "doc"]{
      _id,
      title,
      slug,
      "manufacturer": content.manufacturer,
      "category": content.category
    }`
  );
  console.log(`Found ${docArticles.length} doc articles\n`);

  let updated = 0;
  let noMatch = 0;
  let noUrls = 0;
  let errors = 0;
  const updates = [];

  for (const integration of integrations) {
    try {
      const manufacturer = integration.manufacturer || '';
      const brand = integration.brand || '';
      const deviceType = integration.originalDeviceType || integration.deviceType || '';
      
      const key = `${manufacturer}|${brand}|${deviceType}`;
      const urlData = urlMap.get(key);
      
      if (!urlData) {
        console.log(`No URL data found for: ${integration.title}`);
        noMatch++;
        continue;
      }

      const helpManualUrl = urlData.helpManuals.length > 0 ? urlData.helpManuals[0] : null;
      const helpdeskUrl = urlData.helpdesk.length > 0 ? urlData.helpdesk[0] : null;

      if (!helpManualUrl && !helpdeskUrl) {
        noUrls++;
        continue;
      }

      const matchingArticle = findMatchingDocArticle(integration, docArticles);

      const documentation = {
        _type: 'documentationInfo',
        configurationArticle: matchingArticle ? { _type: 'reference', _ref: matchingArticle._id } : null,
        helpManualUrl: helpManualUrl,
        helpdeskUrl: helpdeskUrl,
      };

      await client
        .patch(integration._id)
        .set({ documentation })
        .commit();

      const articleInfo = matchingArticle ? matchingArticle.title : 'none';
      console.log(`Updated: ${integration.title}`);
      console.log(`  - Config article: ${articleInfo}`);
      console.log(`  - Help manual URL: ${helpManualUrl || 'none'}`);
      console.log(`  - Helpdesk URL: ${helpdeskUrl || 'none'}`);
      
      updates.push({
        title: integration.title,
        configArticle: articleInfo,
        helpManualUrl: helpManualUrl || 'none',
        helpdeskUrl: helpdeskUrl || 'none',
      });
      
      updated++;
    } catch (err) {
      console.error(`Error updating ${integration.title}:`, err.message);
      errors++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total integrations: ${integrations.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`No URL data: ${noMatch}`);
  console.log(`No URLs available: ${noUrls}`);
  console.log(`Errors: ${errors}`);
  
  if (updates.length > 0) {
    console.log('\n--- Detailed Updates ---');
    for (const update of updates) {
      console.log(`\n${update.title}:`);
      console.log(`  Config Article: ${update.configArticle}`);
      console.log(`  Help Manual: ${update.helpManualUrl}`);
      console.log(`  Helpdesk: ${update.helpdeskUrl}`);
    }
  }
  
  console.log('\nUpdate complete!');
}

updateIntegrationDocs().catch(console.error);
